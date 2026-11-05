// 8. Arrive with a word: where each term in `params.terms` lives, through both matchers. Without
// terms, the first epic's id leaf is searched in its spaced and hyphenated forms.
// Teaches: the word entry `g.findByConcept(term)` beside entry search, `recipes(23, { term })`, per term
// Subject: {"terms":["<a word you hold>"]}
const epic = g.specs().find((s) => s.altitude === "epic") ?? g.specs()[0];
const leaf = epic === undefined ? "" : epic.id.split(".").pop();
const fallback = leaf.includes("-") ? [leaf.replaceAll("-", " "), leaf] : leaf ? [leaf] : [];
const terms = [params.terms ?? params.term ?? fallback].flat();
if (terms.length === 0)
  return { diagnostics: [{ parameter: "terms", problem: "Expected a list of terms." }] };
const count = (k, one, many = `${one}s`) => `${k} ${k === 1 ? one : many}`;
// A list printed in part says how much of it shows, so a count is never read as the rows.
const listed = (head, rows, cut) => `${head}${cut}${rows.length > 0 ? ": " : ""}${rows.join("; ")}`;
// Keyed through a Map, so a term an object inherits, such as `__proto__`, keeps its own key.
const out = new Map();
for (const term of terms) {
  const nodes = g.findByConcept(term);
  const entries = await recipes(23, { term });
  const named = nodes.slice(0, 5).map((n) => `${n.id} [${n.matchedIn.join(",")}]`);
  const found = entries.matches
    .slice(0, 4)
    .map((m) => `${m.address ?? `${m.id} ${m.entry ?? m.section}`} line ${m.line}`);
  out.set(term, {
    findByConcept: listed(
      count(nodes.length, "node"),
      named,
      named.length < nodes.length ? `; the first ${named.length}` : "",
    ),
    entrySearch: listed(
      `${count(entries.totals.matches, "entry", "entries")} in ${count(entries.totals.specs, "Spec")}`,
      found,
      found.length < entries.totals.matches
        ? `; the first ${found.length} of the ${entries.totals.shown} rows recipe 23 returns`
        : "",
    ),
  });
}
return Object.fromEntries(out);
