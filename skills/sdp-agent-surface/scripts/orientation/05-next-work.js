// 5. Next work: the roadmap over every priority Pack, or over `params.pack`: each entry's need,
// stated rung against its floor, holding questions, build-now ids and drift, plus the statements
// and the selected decider's questions waiting.
// Teaches: a subject passed as `--params` into a composed recipe, `recipes(53, …)`, behind a diagnostics guard
const answer = await recipes(53, { pack: params.pack, decider: params.decider });
if (answer.diagnostics) return answer;
const entry = (e) =>
  `${e.place}. ${e.id}: ${e.need} (stated ${e.statedReadiness}, floor ${e.floorReached})` +
  (e.blockingQuestions.length > 0
    ? `; held by ${e.blockingQuestions.map((q) => q.address ?? q.spec).join(", ")}`
    : "") +
  (e.buildNow.length > 0 ? `; build now ${e.buildNow.join(", ")}` : "") +
  (e.work.drift > 0 ? `; ${e.work.drift} drift` : "");
return {
  decider: answer.decider,
  roadmaps: answer.roadmaps.map((roadmap) => ({
    pack: roadmap.pack,
    totals: roadmap.totals,
    entries: roadmap.entries.map(entry),
    apart: roadmap.apart.map((a) => `${a.place}. ${a.id}: ${a.need}`),
    unresolved: roadmap.unresolved.map((u) => `${u.place}. ${u.id}`),
    waitingStatements: roadmap.waiting.statements.map((s) => s.id),
    waitingQuestions: roadmap.waiting.questions.map((q) => q.address ?? q.spec),
    waitingWithoutDecider: roadmap.waiting.withoutDecider.map((q) => q.address ?? q.spec),
  })),
};
