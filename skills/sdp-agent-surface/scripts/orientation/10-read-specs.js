// 10. Read Specs: for `params.specs` (a list or one id) or the members of `params.pack`, each
// Spec's coordinate, readiness, delivery facts, carrier, outcome, keyed rules with their lines,
// a decision's ruling, Design and UI keys, questions, relations, implementations and verifiers.
// Without either, the roadmap's first entry stands in, or the first epic.
const roadmapFirst = (await recipes(53, {})).roadmaps?.[0]?.entries?.[0]?.id;
const fallback = roadmapFirst ?? (g.specs().find((s) => s.altitude === "epic") ?? g.specs()[0])?.id;
const ids =
  params.specs !== undefined
    ? [params.specs].flat()
    : params.pack !== undefined
      ? g.packContext(params.pack)?.members.map((m) => m.id)
      : [fallback].filter((id) => id !== undefined);
if (ids === undefined)
  return { specs: params.specs ?? null, pack: params.pack ?? null, found: false };
const clip = (t) => {
  const x = typeof t === "string" ? t : (JSON.stringify(t) ?? "");
  return x.length > 110 ? `${x.slice(0, 110)}...` : x;
};
return ids.map((id) => {
  const c = g.specContext(id);
  if (c === undefined) return { id, found: false };
  const s = c.sections;
  const line = new Map(c.entryLocations.map((l) => [l.entry, l.line]));
  const keyOf = Object.fromEntries(
    Object.entries(s.behavior?.ruleKeys ?? {}).map(([k, v]) => [v, k]),
  );
  const inbound = {};
  for (const r of c.relationsIn) inbound[r.type] = (inbound[r.type] ?? 0) + 1;
  return {
    id,
    title: c.title,
    coordinate: `${c.kindDisplayLabel}, ${c.altitude}`,
    readiness: `stated ${c.statedReadiness}, derived ${c.derivedReadiness}`,
    deliveryFacts: c.deliveryFacts,
    file: c.file,
    outcome: clip(s.intent?.outcome ?? ""),
    // A draft decision may carry its context before any ruling.
    ...(s.decision
      ? { decision: s.decision.decision === undefined ? null : clip(s.decision.decision) }
      : {}),
    rules: (s.behavior?.rules ?? []).map(
      (r, i) =>
        `line ${line.get(`rule[${i}]`) ?? "-"} ${keyOf[`rules[${i}]`] ? `#${keyOf[`rules[${i}]`]}` : "(unkeyed)"}: ${clip(r)}`,
    ),
    designKeys: Object.keys(s.design ?? {}),
    uiKeys: Object.keys(s.ui ?? {}),
    questions: (s.intent?.openQuestions ?? []).map(
      (q) => `${q.key ?? "(unkeyed)"}${q.blocking ? ", blocking" : ""}`,
    ),
    relationsOut: c.relationsOut.map((r) => `${r.type} ${r.otherId} [${r.claim}]`),
    relationsIn: inbound,
    implementations: c.implementations.map(
      (u) => `${u.codeId} at ${u.file}:${u.line} [${u.claim}]`,
    ),
    references: c.references.length,
    verifiers: c.verifiers.map(
      (v) => `${v.verifierId} via ${v.via}${v.enabled ? "" : ", not enabled"}`,
    ),
  };
});
