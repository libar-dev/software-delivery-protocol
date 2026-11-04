// 6. Undecided: every open question by entry address, as a hold, a deferral or non-blocking,
// with its decider and any provisional answer; then the readiness statements waiting, in
// dependency order, for `params.decider` (the recipe's default, `owner`, when absent).
const register = await recipes(20);
const queue = await recipes(46, { decider: params.decider });
if (queue.diagnostics) return queue;
const kind = (q) => (q.deferral ? "deferred" : q.blocking ? "holds" : "non-blocking");
return {
  questions: register.totals,
  rows: register.specs.flatMap((s) =>
    s.questions.map(
      (q) =>
        `${kind(q)} | ${q.key ? `${s.id}#question.${q.key}` : `${s.id} (unkeyed)`} | decider ${q.decider ?? "none"}${q.provisional ? ", provisional" : ""}`,
    ),
  ),
  queue: queue.totals,
  waitingStatements: queue.statements.map(
    (w) =>
      `${w.place}. ${w.id}: stated ${w.statedReadiness}, floor ${w.floorReached}${w.restsOn.length > 0 ? `, after ${w.restsOn.join(", ")}` : ""}`,
  ),
};
