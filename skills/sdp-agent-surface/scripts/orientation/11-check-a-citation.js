// 11. Check a citation: for each address in `params.addresses`, the slot it resolves to, its
// file, line and full wording, or why it fails and which keys the named section holds. Without
// addresses, the first two keyed entries the corpus holds (rules, Design and UI entries, open
// questions) stand in, beside a bare Spec id, which is not an entry address.
// Teaches: the frozen join `g.resolveEntryAddress` beside `recipes(25, { addresses })`, which adds the wording and line
// Subject: {"addresses":["<an entry address>"]}
const candidates = [];
for (const spec of g.specs()) {
  const sections = g.specContext(spec.id)?.sections ?? {};
  const keyed = [
    ...Object.keys(sections.behavior?.ruleKeys ?? {}).map((key) => `rule.${key}`),
    ...Object.keys(sections.design ?? {})
      .filter((key) => key !== "description")
      .map((key) => `design.${key}`),
    ...Object.keys(sections.ui ?? {})
      .filter((key) => key !== "description")
      .map((key) => `ui.${key}`),
    ...(sections.intent?.openQuestions ?? []).filter((q) => q.key).map((q) => `question.${q.key}`),
  ];
  candidates.push(...keyed.map((entry) => `${spec.id}#${entry}`));
  if (candidates.length >= 2) break;
}
const bare = g.specs()[0]?.id;
const fallback = [...candidates.slice(0, 2), ...(bare === undefined ? [] : [bare])];
const answer = await recipes(25, { addresses: [params.addresses ?? fallback].flat() });
if (answer.diagnostics) return answer;
const value = (r) => (typeof r.value === "string" ? r.value : JSON.stringify(r.value));
return {
  totals: answer.totals,
  rows: answer.rows.map((r) =>
    r.resolves
      ? `${r.address} -> ${g.resolveEntryAddress(r.address).entry} at ${r.file}:${r.line}: ${value(r)}`
      : `${r.address} UNRESOLVED (${r.reason})` +
        (r.available ? `; its ${r.section} keys: ${r.available.join(" ") || "none"}` : "") +
        (r.expected ? `; expected ${r.expected}` : ""),
  ),
};
