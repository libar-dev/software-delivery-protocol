// 9. Arrive with a file or a changeset: the nodes recorded at `params.file` and the Specs
// reachable from them; then the impact of `params.files`. Without them, the first anchored code
// file and the first carrier stand in.
const codeFile = graph.nodes.find((n) => n.nodeType === "CodeNode" && n.file)?.file;
const carrier = g.specs()[0]?.file;
const fileParam = params.file ?? codeFile;
const files = params.files ?? [codeFile, carrier].filter((f) => f !== undefined);
const file = fileParam === undefined ? null : g.byFile(fileParam);
const change = await recipes(4, { files });
return {
  file: file && {
    path: file.path,
    nodes: file.nodes.map(
      (n) => `${n.nodeType} ${n.id}${n.line === undefined ? "" : ` at line ${n.line}`}`,
    ),
    specs: file.specs,
  },
  changeset: {
    files,
    totals: change.totals,
    impactedSpecs: change.impactedSpecs,
    impactedPacks: change.impactedPacks,
    atRiskOther: change.atRisk.other,
    coverageUnknownFiles: change.coverageUnknownFiles,
    unlinkedUnits: change.unlinkedUnits,
    leftOut: change.leftOut,
  },
};
