// 4. Honest and built: the validation report as data, the drift alarm, readiness divergence,
// delivery facts outside examples and decisions, the build and design backlogs, and every Spec
// below `ready` with the clause holding its next rung.
// Teaches: `report` read as data, never a gate, beside six composed recipes (8, 2, 7, 1, 11, 33); a cut list keeps its count
const signals = await recipes(8);
const drift = await recipes(2);
const divergence = await recipes(7);
const build = await recipes(1);
const ladder = await recipes(11);
const design = await recipes(33);
const errors = report.findings.filter((f) => f.severity === "error");
const work = g.specs().filter((s) => s.specKind !== "example" && s.specKind !== "decision");
const has = (fact) => work.filter((s) => s.deliveryFacts.includes(fact)).length;
const floor = (r) => `${r.id}: stated ${r.statedReadiness}, floor ${r.floorReached}`;
const next = (r) =>
  r.statedNextRung
    ? `, next ${r.statedNextRung} ${r.nextUnmetClause ? `held by ${r.nextUnmetClause}` : "nothing blocks"}`
    : "";
return {
  findings: report.findings.length,
  errorCount: errors.length,
  errors: errors.slice(0, 10).map((f) => `${f.validatorId} ${f.subjectId ?? f.file ?? ""}`),
  warnings: signals.signals.map((s) => `${s.validatorId} ${s.subjectId}`),
  warningsLeftOut: signals.leftOut,
  exemptions: signals.exemptions,
  driftAlarm: drift.alarms.map(floor),
  statedAboveFloor: divergence.map(floor),
  realization: `${work.length} Specs outside examples and decisions: ${has("implemented")} implemented, ${has("has-verifier")} has-verifier`,
  buildBacklog: Object.values(build.byFamily)
    .flat()
    .map((r) => r.id),
  designBacklog: design.totals.specs,
  belowReady: Object.values(ladder.byFamily)
    .flat()
    .map((r) => `${floor(r)}${next(r)}`),
  excludedReady: {
    examples: build.excludedReadyExamples,
    decisions: build.excludedReadyDecisions,
    examplesWithoutVerifier: build.excludedWithoutVerifier.length,
  },
};
