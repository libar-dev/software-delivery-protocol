// Throwaway simulation of the annotation review tables. Never writes a carrier or source binding.
const tableRows = (text) => text.split('\n').filter(line => line.startsWith('| `')).map(line => line.slice(1, -1).split('|').map(cell => cell.trim()));
const tokens = (cell) => [...cell.matchAll(/`([^`]+)`/g)].map(match => match[1]);
const between = (text, from, to) => text.split(from)[1].split(to)[0];
export function applyProposal(graph, review) {
  const draft = structuredClone(graph);
  const byId = new Map(draft.nodes.map(node => [node.id, node]));
  const ledger = tableRows(between(review, '## The component map and existing code-anchor dispositions', '## Missing responsibilities'));
  const current = draft.nodes.filter(node => node.nodeType === 'CodeNode');
  if (ledger.length !== current.length || new Set(ledger.map(row => tokens(row[0])[0])).size !== current.length) throw new Error('Identity ledger must account for every current CodeNode exactly once');
  const edge = (from, type, to) => {
    if (!draft.edges.some(e => e.from === from && e.type === type && e.to === to)) draft.edges.push({ from, type, to, claim: 'anchored' });
  };
  const removed = new Set();
  for (const row of ledger) {
    const id = tokens(row[0])[0];
    const node = byId.get(id);
    if (!node) throw new Error(`Unknown ledger identity ${id}`);
    const role = row[2].split('→').at(-1).trim();
    if (role === 'not stated') delete node.role; else node.role = role;
    if (/^(merge|drop)\./.test(row[3])) removed.add(id);
  }
  for (const row of tableRows(between(review, '## Merge and drop realization ledger', '## Every component pair'))) {
    const from = tokens(row[0])[0];
    const to = tokens(row[1])[0];
    if (!removed.has(from) || !byId.has(to)) throw new Error(`Unaccounted removal ${from}`);
    if (!row[1].includes('already satisfies')) {
      for (const e of [...draft.edges]) if (e.from === from && ['satisfies', 'references'].includes(e.type)) edge(to, e.type, e.to);
    }
  }
  draft.nodes = draft.nodes.filter(node => !removed.has(node.id));
  draft.edges = draft.edges.filter(e => !removed.has(e.from) && !removed.has(e.to));
  for (const id of removed) byId.delete(id);
  const envelope = byId.get('impl:protocol.envelope-contract');
  envelope.file = 'src/extract/markdown-frontmatter.ts'; delete envelope.line;
  for (const e of draft.edges) if (e.from === 'impl:protocol.example-space-decoding' && e.type === 'memberOf') e.to = 'component:protocol.reader';
  for (const id of ['impl:protocol.sdp-import-scan', 'impl:protocol.sdp-import-publish']) {
    draft.edges = draft.edges.filter(e => !(e.from === id && e.type === 'references' && e.to === 'spec:carrier.sdp-import'));
    edge(id, 'satisfies', 'spec:carrier.sdp-import');
  }
  byId.get('impl:protocol.binding-language-index-table').label = 'renders index and Pack-table binding language as present or none';
  byId.get('impl:protocol.schema-version').label = 'versioned GraphSchema contract, including node, claim, edge and located-evidence shapes';
  const additions = tableRows(between(review, '## Missing responsibilities', '## Changes to reviewed coarse-grain coverage'));
  for (const row of additions) {
    const id = tokens(row[0])[0];
    const component = tokens(row[2])[0];
    const node = { nodeType: 'CodeNode', id, file: tokens(row[1])[0], role: row[2].split(';')[0], label: row[6], proposal: true };
    if (byId.has(id)) throw new Error(`Duplicate proposed identity ${id}`);
    draft.nodes.push(node); byId.set(id, node); edge(id, 'memberOf', component);
    for (const [type, column] of [['satisfies', 3], ['references', 4], ['uses', 5]]) for (const target of tokens(row[column])) edge(id, type, target);
  }
  for (const row of tableRows(between(review, '## Every component pair', '## Curated unit-level relationships'))) {
    if (row[3].startsWith('Declare')) {
      const [from, to] = tokens(row[0])[0].split(' → ');
      edge(from, 'uses', to);
    }
  }
  for (const row of tableRows(between(review, '## Curated unit-level relationships', '## The complete source walk'))) {
    if (row[1] === 'Add') { const [from, to] = tokens(row[0])[0].split(' → '); edge(from, 'uses', to); }
  }
  const implemented = g => new Set(g.edges.filter(e => e.type === 'satisfies').map(e => e.to));
  const after = implemented(draft);
  const lost = [...implemented(graph)].filter(id => !after.has(id));
  if (lost.length) throw new Error(`Lost realization targets: ${lost.join(', ')}`);
  const ids = new Set(draft.nodes.map(n => n.id));
  for (const e of draft.edges) if (!ids.has(e.from) || !ids.has(e.to)) throw new Error(`Unresolved proposed endpoint: ${e.from} → ${e.to}`);
  for (const e of draft.edges.filter(e => e.type === 'satisfies')) if (draft.edges.some(r => r.type === 'references' && r.from === e.from && r.to === e.to)) throw new Error(`Overlapping target on ${e.from}`);
  const componentCycles = graph => {
    const components = graph.nodes.filter(n => n.nodeType === 'CodeNode' && n.id.startsWith('component:')).map(n => n.id);
    const reachable = (from, target, seen = new Set()) => {
      if (seen.has(from)) return false;
      seen.add(from);
      return graph.edges.filter(e => e.type === 'uses' && e.from === from && e.to.startsWith('component:')).some(e => e.to === target || reachable(e.to, target, seen));
    };
    return components.filter(id => reachable(id, id));
  };
  const beforeComponents = graph.edges.filter(e => e.type === 'uses' && e.from.startsWith('component:') && e.to.startsWith('component:')).length;
  const afterComponents = draft.edges.filter(e => e.type === 'uses' && e.from.startsWith('component:') && e.to.startsWith('component:')).length;
  return { graph: draft, summary: { currentUnits: current.length, removed: removed.size, added: additions.length, proposedUnits: draft.nodes.filter(n => n.nodeType === 'CodeNode').length, realizedTargetsRetained: after.size, lostRealizations: lost, componentUsesAdded: afterComponents - beforeComponents, unitUsesAdded: draft.edges.filter(e => e.type === 'uses').length - graph.edges.filter(e => e.type === 'uses').length - (afterComponents - beforeComponents), currentComponentCycleMembers: componentCycles(graph), proposedComponentCycleMembers: componentCycles(draft) } };
}
