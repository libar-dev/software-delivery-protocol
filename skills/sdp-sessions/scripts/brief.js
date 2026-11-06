// The build brief, an `sdp q` body, for one Spec passed as `params.spec`: its rung beside its
// floor; the open questions, on it and on each Spec it rests on, that hold the work answering them
// (blocking), that the build proceeds on through their provisional reading (non-blocking), or that
// give the build no reading (non-blocking, none given); the declarations it pins; its keyed rules
// that no enabled example exercises yet; and the Specs refining it, which this brief leaves out.
// It writes nothing.
const footing = await recipes(56, { spec: params.spec });
if (!footing.found) return footing;
const rests = [params.spec, ...footing.law.map((row) => row.id)];
const questions = (await recipes(20, {})).specs
  .filter((row) => rests.includes(row.id))
  .flatMap((row) =>
    row.questions.map((q) => ({
      ...q,
      at: q.key === null ? `${row.id}: ${q.question}` : `${row.id}#question.${q.key}`,
      to: typeof q.decider === "string" ? `decider ${q.decider}` : "no decider named",
      read: typeof q.provisional === "string",
    })),
  );
const open = questions.filter((q) => !q.blocking);
const coverage = await recipes(34, { spec: params.spec });
return {
  readiness: `stated ${footing.statedReadiness}, floor ${footing.floorReached}`,
  holds: questions.filter((q) => q.blocking).map((q) => `${q.at}, ${q.to}`),
  buildOn: open.filter((q) => q.read).map((q) => `${q.at}: ${q.provisional}`),
  noReading: open.filter((q) => !q.read).map((q) => `${q.at}, ${q.to}`),
  declarations: (await recipes(24, {})).rows
    .filter((row) => row.spec === params.spec)
    .map((row) => `${row.key}: ${row.declaration}`),
  unexercised: coverage.rows
    .filter((row) => !row.exercisedBy.some((example) => example.enabled))
    .map((row) => row.address),
  unkeyedRules: coverage.totals.unkeyedRules,
  refinedBy: g
    .specContext(params.spec)
    .relationsIn.filter((relation) => relation.type === "refines")
    .map((relation) => `${relation.otherId} (${g.specContext(relation.otherId)?.specKind})`)
    .sort(),
};
