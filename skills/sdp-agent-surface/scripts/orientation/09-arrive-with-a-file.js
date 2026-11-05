// 9. Arrive with a file or a changeset: the nodes recorded at `params.file` and the Specs
// reachable from them; then the impact of `params.files`. Either one alone stands for both, the
// first of `params.files` as the file. Without them, the first anchored code file and the first
// carrier stand in.
// Teaches: the file entry `g.byFile(path)` and the changeset entry `g.blastRadius` through recipe 4's summary
// Subject: {"files":["<a path you changed>"]}
const codeFile = graph.nodes.find((n) => n.nodeType === "CodeNode" && n.file)?.file;
const carrier = g.specs()[0]?.file;
// A subject given, even an empty list, is never swapped for the sample.
const fileParam = params.file ?? (params.files === undefined ? codeFile : params.files[0]);
const files =
  params.files ??
  (params.file !== undefined ? [params.file] : [codeFile, carrier].filter((f) => f !== undefined));
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
    atRisk: change.atRisk,
    coverageUnknownFiles: change.coverageUnknownFiles,
    unlinkedUnits: change.unlinkedUnits,
    leftOut: change.leftOut,
  },
};
