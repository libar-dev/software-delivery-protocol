// The authoring check, an `sdp q` body: each touched Spec's stated rung beside its floor, the
// findings on the touched files, and what each other touched file records in the graph, read back
// against the request. Pass every file you touched as `params.files`. It writes nothing.
const files = params.files ?? [];
const specs = g.specs().filter((s) => files.includes(s.file));
const rungs = {};
for (const s of specs) {
  const { floorReached } = await recipes(9, { spec: s.id });
  rungs[s.id] = `stated ${s.statedReadiness}, floor ${floorReached}`;
}
const mine = report.findings.filter((f) => files.includes(f.file) || f.subjectId in rungs);
const readBack = (n) => {
  if (n.nodeType === "Pack") {
    const { title, members, framing } = g.packContext(n.id);
    return { pack: n.id, title, members: members.map((m) => m.id), framing };
  }
  const edges = graph.edges.filter((e) => e.from === n.id && e.claim === "anchored");
  return `${n.id} ${edges.map((e) => `${e.type} ${e.to}`).join(", ")}`.trim();
};
const others = files.filter((f) => !specs.some((s) => s.file === f));
return {
  rungs,
  findings: mine.map((f) => `${f.severity} ${f.validatorId} ${f.subjectId ?? f.file}`),
  recorded: others.map((f) => [f, g.byFile(f).nodes.map(readBack)]),
  errors: report.findings.filter((f) => f.severity === "error").length,
};
