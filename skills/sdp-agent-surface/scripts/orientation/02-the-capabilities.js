// 2. The capabilities: each capability epic as a one-line promise, with counts over its
// refinement descendants, and one `distinct` line of corpus totals.
// Teaches: a shipped recipe composed in a body, `recipes(52)`, cut to one line per epic
const map = await recipes(52);
const t = map.totals;
const count = (k, one, many = `${one}s`) => `${k} ${k === 1 ? one : many}`;
const line = (r) =>
  `${count(r.specs, "Spec")} (${count(r.byKind.example, "example")}, ${count(r.byKind.decision, "decision")}), ` +
  `${r.byStatedReadiness.ready} stated ready, ${r.withImplementationBinding} implementation-bound, ` +
  `${r.withVerifierBinding} verifier-bound, ${count(r.blockingQuestions, "blocking question")}`;
return {
  epics: t.epics,
  unreached: t.unreached,
  cycles: map.cycles.length,
  damage: map.damage.length,
  distinct: line(t),
  rows: map.epics.map(
    (e) =>
      `${e.id}: ${e.title} | ${line(e.rollup)}${e.parentEpicIds.length > 0 ? `; under ${e.parentEpicIds.join(", ")}` : ""}`,
  ),
};
