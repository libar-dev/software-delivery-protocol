// 6. Undecided: every open question by entry address, as a hold, a deferral or non-blocking,
// with its decider and any provisional answer; then the readiness statements waiting, in
// dependency order, for `params.decider` (the recipe's default, `owner`, when absent).
// Teaches: a parameterless recipe (20) composed with a parameterized one (46, its `decider` from `--params`), each printed under its own field names
const register = await recipes(20);
const queue = await recipes(46, { decider: params.decider });
if (queue.diagnostics) return queue;
const kind = (q) => (q.deferral ? "deferred" : q.blocking ? "holds" : "non-blocking");
return {
  register: {
    totals: register.totals,
    specs: register.specs.flatMap((s) =>
      s.questions.map(
        (q) =>
          `${kind(q)} | ${q.key ? `${s.id}#question.${q.key}` : `${s.id} (unkeyed)`} | decider ${q.decider ?? "none"}${q.provisional ? ", provisional" : ""}`,
      ),
    ),
  },
  queue: {
    totals: queue.totals,
    statements: queue.statements.map(
      (w) =>
        `${w.place}. ${w.id}: stated ${w.statedReadiness}, floor ${w.floorReached}${w.restsOn.length > 0 ? `, after ${w.restsOn.join(", ")}` : ""}`,
    ),
  },
};
