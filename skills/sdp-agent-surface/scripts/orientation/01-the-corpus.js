// 1. The corpus and its surface: Specs by family, altitude and named coordinate; node, edge and
// claim counts; the reader's methods, every field a Spec row or an edge carries, and the
// parameters ten recipes accept.
const specs = g.specs();
const tally = (xs) => xs.reduce((t, x) => ({ ...t, [x]: (t[x] ?? 0) + 1 }), {});
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
    recipeParams: accepts,
  },
};
