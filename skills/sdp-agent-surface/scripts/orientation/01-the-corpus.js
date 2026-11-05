// 1. The corpus and its surface: Specs by family, altitude and named coordinate; node, edge and
// claim counts; the reader's methods, every field a Spec row, an edge or a binding row carries,
// and the parameters ten recipes accept.
// Teaches: an ad-hoc body pre-shaped into counts; field names gathered across every row; the parameter probe `recipes(n, { "?": 1 }).accepts`
const specs = g.specs();
// Counted in a Map, so a name an object inherits, such as `constructor`, counts from zero.
const tally = (xs) => {
  const counts = new Map();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  return Object.fromEntries(counts);
};
const keys = (rows) => [...new Set(rows.flatMap((r) => Object.keys(r)))].join(" ");
const byKind = {};
for (const s of specs) {
  const row = (byKind[`${s.kindDisplayLabel} (${s.specKind})`] ??= {
    idea: 0,
    scoped: 0,
    defined: 0,
    ready: 0,
  });
  row[s.statedReadiness] = (row[s.statedReadiness] ?? 0) + 1;
}
const accepts = {};
for (const n of [3, 4, 6, 20, 23, 25, 29, 46, 53, 54]) {
  accepts[n] = (await recipes(n, { "?": 1 })).accepts.join(" ") || "none";
}
return {
  specs: specs.length,
  byFamily: tally(specs.map((s) => s.id.split(/[:.]/)[1])),
  byAltitude: tally(specs.map((s) => s.altitude)),
  byKind,
  nodesByType: tally(graph.nodes.map((n) => n.nodeType)),
  edgesByType: tally(graph.edges.map((e) => e.type)),
  edgesByClaim: tally(graph.edges.map((e) => e.claim)),
  surface: {
    reader: Object.keys(g).join(" "),
    specRow: keys(specs),
    edge: keys(graph.edges),
    binding:
      keys(
        specs.flatMap((s) => {
          const c = g.specContext(s.id);
          return [...c.implementations, ...c.verifiers, ...c.references];
        }),
      ) || "none",
    recipeParams: accepts,
  },
};
