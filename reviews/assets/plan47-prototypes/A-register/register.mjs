import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Throwaway page evidence. The graph supplies membership, roles, locations and binding targets.
const here = dirname(fileURLToPath(import.meta.url));
const engineRoot = resolve(process.argv[2] ?? resolve(here, '../../../..'));
const platformRoot = resolve(process.argv[3] ?? '/tmp/plan47-platform');
const engine = resolve(engineRoot, 'dist/cli/sdp.js');
const body = `return { graph, architecture: await recipes(17), taxonomy: await recipes(28), plans: await recipes(43), vocabulary: g.specContext('spec:protocol.role-vocabulary')?.sections?.model?.terms ?? {} };`;
const esc = (v) => String(v ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const code = (v) => `<code>${esc(v)}</code>`;
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const targetList = (xs) => xs.length ? `<ul>${xs.map(x => `<li>${code(x)}</li>`).join('')}</ul>` : '<span class="muted">None recorded</span>';
const order = ['model', 'graph', 'notation', 'extract', 'validate', 'reader', 'codegen', 'runner', 'adapters', 'testing', 'projections', 'studio-elements', 'cli', 'import'];
const label = (id) => id.replace(/^component:(protocol\.|platform\.|example\.)/, '').replaceAll('-', ' ');
for (const corpus of [{ key: 'protocol', title: 'The Protocol', root: engineRoot }, { key: 'platform', title: 'libar-platform', root: platformRoot }]) {
  const args = [engine, 'q', '--root', corpus.root];
  if (corpus.key === 'protocol') args.push('--exclude', 'explorations', '--exclude', 'examples', '--exclude', 'test/fixtures/import/parity');
  args.push(body, '--json');
  const data = JSON.parse(execFileSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));
  const edges = data.graph.edges;
  const membership = new Map(edges.filter(e => e.type === 'memberOf').map(e => [e.from, e.to]));
  const units = data.graph.nodes.filter(n => n.nodeType === 'CodeNode');
  const components = data.architecture.components.filter(c => c.declared).sort((a, b) => {
    const rank = id => { const n = order.indexOf(id.split('.').at(-1)); return n < 0 ? order.length : n; };
    return rank(a.id) - rank(b.id) || compare(a.id, b.id);
  });
  const targets = (id, type) => edges.filter(e => e.from === id && e.type === type).map(e => e.to).sort(compare);
  const row = (unit) => `<tr><td><strong>${esc(unit.label ?? 'No label recorded')}</strong><br>${code(unit.id)}<p class="source">${code(unit.file)}${unit.line ? `:${unit.line}` : ''}</p></td><td><span class="field-name">Satisfies</span>${targetList(targets(unit.id, 'satisfies'))}<span class="field-name">References</span>${targetList(targets(unit.id, 'references'))}</td></tr>`;
  const roleDefinition = (role) => data.vocabulary[role]?.replace(/^\[#[A-Za-z0-9]+\]\s*/, '');
  const groups = (members, first = false) => {
    const roles = [...new Set(members.map(u => u.role ?? 'not stated'))].sort(compare);
    return roles.map((role, n) => {
      const own = members.filter(u => (u.role ?? 'not stated') === role).sort((a, b) => compare(a.id, b.id));
      const definition = roleDefinition(role);
      return `<details class="role-group"${first && n === 0 ? ' open' : ''}><summary>${esc(role)} <span class="muted">${own.length} ${own.length === 1 ? 'unit' : 'units'}</span></summary>${definition ? `<p class="role-meaning">${esc(definition)}</p>` : role === 'not stated' ? '<p class="role-meaning">These bindings carry no role. Omission is lawful.</p>' : '<p class="role-meaning">This corpus has no role definition in the selected vocabulary Model.</p>'}<table><caption class="visually-hidden">${esc(role)} units and their recorded bindings</caption><thead><tr><th scope="col">Unit and source</th><th scope="col">Design bindings</th></tr></thead><tbody>${own.map(row).join('')}</tbody></table></details>`;
    }).join('');
  };
  const sections = components.map((component, index) => {
    const own = units.filter(n => membership.get(n.id) === component.id);
    const recorded = units.find(n => n.id === component.id);
    return `<section class="component-register" id="${esc(component.id)}"><h2>${esc(label(component.id))}</h2><p class="component-id">${code(component.id)}</p><p class="attributes">Context <strong>${esc(component.context ?? 'not stated')}</strong> · Layer <strong>${esc(component.layer ?? 'not stated')}</strong> · Role <strong>${esc(recorded?.role ?? 'not stated')}</strong></p><p>${esc(component.label ?? 'No component label recorded')}</p><details class="role-group"><summary>Component bindings and source</summary><table><caption class="visually-hidden">Component binding</caption><thead><tr><th scope="col">Component and source</th><th scope="col">Design bindings</th></tr></thead><tbody>${recorded ? row(recorded) : ''}</tbody></table></details><p class="dependencies">Uses ${component.usesCounts.length ? component.usesCounts.map(x => `<a href="#${esc(x.component)}">${esc(label(x.component))}</a>`).join(', ') : 'none recorded'}</p>${own.length ? groups(own, index === 0) : '<p>No member binding is recorded for this component.</p>'}</section>`;
  }).join('');
  const unassigned = units.filter(n => !n.id.startsWith('component:') && !membership.has(n.id));
  const nav = `<h2>Components</h2><ul>${components.map(c => `<li><a href="#${esc(c.id)}">${esc(label(c.id))}</a></li>`).join('')}<li><a href="#unassigned">No component recorded</a></li></ul>`;
  const other = corpus.key === 'protocol' ? 'platform' : 'protocol';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Architecture register · ${esc(corpus.title)}</title><link rel="stylesheet" href="studio.css"><style>
  .prototype-label {color:var(--muted);max-width:74ch}.register-intro{max-width:74ch}.component-register{margin-block:2.5rem 3.25rem;scroll-margin-top:1rem}.component-register h2{margin-bottom:.35rem;text-transform:none}.component-id{margin-block:.25rem .75rem}.attributes{color:var(--muted);margin-block:.5rem}.attributes strong{color:var(--text);font-weight:500}.dependencies{max-width:74ch}.role-group{margin-top:.65rem;border:1px solid var(--line);border-radius:var(--radius)}.role-group>summary{padding:.7rem .9rem;font-weight:600;cursor:pointer}.role-group>summary .muted{margin-left:.7rem;font-weight:400}.role-meaning{padding:0 .9rem;max-width:74ch;color:var(--muted)}.role-group table{margin:0;width:100%;table-layout:fixed;border-collapse:collapse}.role-group th:first-child{width:54%}.role-group th,.role-group td{vertical-align:top;padding:.8rem .9rem;overflow-wrap:anywhere}.role-group td strong{font-weight:500}.role-group code{font-size:.84rem;overflow-wrap:anywhere;white-space:normal}.source{margin-block:.5rem 0;color:var(--muted);line-height:1.55}.field-name{font-size:.8rem;color:var(--muted);display:block;margin-top:.4rem}.field-name:first-child{margin-top:0}.role-group td ul{padding:0;margin:.2rem 0 .5rem;list-style:none}.muted{color:var(--muted)}.mobile-index{display:none}.rail{position:sticky;top:0;align-self:start;max-height:100vh;overflow:auto}.legend{max-width:74ch;border-block:1px solid var(--line);padding:.9rem 0;margin-top:1.5rem}.legend p{margin:.4rem 0}.top nav a{padding:.35rem 0}::selection{background:var(--rung-scoped-bg);color:var(--rung-scoped-text)}
  @media(max-width:719.98px){.top{display:block}.top nav{margin-top:.5rem}.rail{display:none}.mobile-index{display:block;margin:1.5rem 0}.mobile-index ul{columns:2;padding-left:1.2rem}.mobile-index a{display:inline-block;padding:.25rem 0}.role-group table,.role-group tbody,.role-group tr,.role-group td{display:block}.role-group thead{display:none}.role-group tr+tr{border-top:1px solid var(--line)}.role-group td{border:0;padding:.6rem .8rem}.role-group td+td{padding-top:0}.role-group>summary{min-height:44px}.component-register{margin-block:2rem}.attributes{line-height:1.8}.role-group code{font-size:.82rem}.role-group td strong{font-size:.94rem}}
  </style></head><body><a class="skip-link" href="#main">Skip to the page</a><header class="top"><a class="brand" href="${corpus.key}.html">Spec Studio</a><nav aria-label="Prototype"><a href="#main" aria-current="page">Architecture</a><a href="#reading">Reading this register</a><a href="${other}.html">${other === 'protocol' ? 'The Protocol' : 'libar-platform'}</a></nav></header><div class="layout"><nav class="rail" aria-label="Component index">${nav}</nav><main id="main"><h1>Architecture</h1><p class="prototype-label">Register layout proposal · ${esc(corpus.title)} · current graph</p><p class="register-intro">Find a responsibility by component and role, then follow its source and the designs it binds. The graph records ${units.length} code units; ${data.taxonomy.totals.withRole} carry a role.</p><div class="legend" id="reading"><p><strong>Recorded bindings.</strong> Roles and membership come from anchors. These rows record no review approval or execution result.</p><p><strong>Satisfies</strong> names realization claims. <strong>References</strong> names designs the code answers to.</p></div><details class="mobile-index"><summary>Browse components</summary>${nav}</details>${sections}<section class="component-register" id="unassigned"><h2>No component recorded</h2><p>${unassigned.length} code units have no membership. Document and recipe realizations may deliberately remain outside engine components.</p>${groups(unassigned)}</section><p class="muted">This prototype reads the graph only. Proposed anchor edits remain in the curation review.</p></main></div></body></html>`;
  writeFileSync(resolve(here, `${corpus.key}.html`), html);
  console.log(`${corpus.key}: ${components.length} components, ${units.length} code units, ${unassigned.length} without membership`);
}
