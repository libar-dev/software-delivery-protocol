// The build brief, an `sdp q` body, for one Spec passed as `params.spec`: its rung beside its
// floor; the open questions, on it and on each Spec it rests on, that hold the work answering them
// (blocking) or that the build proceeds on (non-blocking, with the provisional reading); the
// declarations it pins; and its keyed rules that no enabled example exercises yet. It writes nothing.
const footing = await recipes(56, { spec: params.spec });
if (!footing.found) return footing;
const rests = [params.spec, ...footing.law.map((row) => row.id)];
const questions = (await recipes(20, {})).specs
  .filter((row) => rests.includes(row.id))
  .flatMap((row) =>
    row.questions.map((q) => ({
      ...q,
      at: q.key === null ? `${row.id}: ${q.question}` : `${row.id}#question.${q.key}`,
    })),
  );
const coverage = await recipes(34, { spec: params.spec });
return {
  readiness: `stated ${footing.statedReadiness}, floor ${footing.floorReached}`,
  holds: questions.filter((q) => q.blocking).map((q) => `${q.at}, decider ${q.decider}`),
  buildOn: questions.filter((q) => !q.blocking).map((q) => `${q.at}: ${q.provisional}`),
  declarations: (await recipes(24, {})).rows
    .filter((row) => row.spec === params.spec)
    .map((row) => `${row.key}: ${row.declaration}`),
  unexercised: coverage.rows
    .filter((row) => !row.exercisedBy.some((example) => example.enabled))
    .map((row) => row.address),
  unkeyedRules: coverage.totals.unkeyedRules,
};
