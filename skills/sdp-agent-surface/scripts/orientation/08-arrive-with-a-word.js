// 8. Arrive with a word: where each term in `params.terms` lives, through both matchers. Without
// terms, the first epic's id leaf is searched in its spaced and hyphenated forms.
const epic = g.specs().find((s) => s.altitude === "epic") ?? g.specs()[0];
const leaf = epic === undefined ? "" : epic.id.split(".").pop();
const fallback = leaf.includes("-") ? [leaf.replaceAll("-", " "), leaf] : leaf ? [leaf] : [];
const terms = [params.terms ?? params.term ?? fallback].flat();
if (terms.length === 0)
  return { diagnostics: [{ parameter: "terms", problem: "Expected a list of terms." }] };
const count = (k, one, many = `${one}s`) => `${k} ${k === 1 ? one : many}`;
const out = {};
for (const term of terms) {
  const nodes = g.findByConcept(term);
  const entries = await recipes(23, { term });
  out[term] = {
    findByConcept:
      `${count(nodes.length, "node")}${nodes.length > 0 ? ": " : ""}` +
      nodes
        .slice(0, 5)
        .map((n) => `${n.id} [${n.matchedIn.join(",")}]`)
        .join("; "),
    entrySearch:
      `${count(entries.totals.matches, "entry", "entries")} in ${count(entries.totals.specs, "Spec")}, ${entries.totals.shown} shown` +
      (entries.matches.length > 0 ? ": " : "") +
      entries.matches
        .slice(0, 4)
        .map((m) => `${m.address ?? `${m.id} ${m.entry ?? m.section}`} line ${m.line}`)
        .join("; "),
  };
}
return out;
