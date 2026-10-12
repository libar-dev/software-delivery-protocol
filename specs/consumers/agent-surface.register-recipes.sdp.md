---
id: spec:consumers.agent-surface.register-recipes
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface
  dependsOn:
    - target: spec:model.rule-keys
      reason: entry search and the mention audit read rule addresses
    - target: spec:model.open-question-fields
      reason: the open-question register lists each question's fields
    - target: spec:model.relation-reasons
      reason: the mention audit reads a caller's intended mentions with their reasons
---
# Register questions stay executable graph recipes

## Intent
- problem: An adopter that keeps open-question tables, dependency lists and reference checks by hand lets each copy go stale.
- outcome: Answer register, dependency, and mention questions with catalog recipes, so the tables an adopter would keep by hand are derived on demand.

## Behavior
- rule: The open-question register lists every open question by Spec with its blocking flag, key, decider, links, provisional and trigger fields, marks a question carrying a trigger as a deferral, and counts deferrals and blocking questions without a trigger apart.
- rule: The dependency footing lists what one Spec rests on across `refines`, `dependsOn`, `constrainedBy`, and `decidedBy`, with each target's stated and derived readiness.
- rule: The mention audit lists Spec ids and entry addresses written in narrative and section text, outside `gwt` and `gwt-vocabulary` fences, that do not resolve or that no declared relation in either direction backs.
- rule: The mention audit takes a list of mentioning Spec ids, with an empty list selecting the whole corpus. It reports target Spec pairs and unresolved token pairs, keeping every location in `at` as section and entry. Unresolved rows carry `reason: "spec" | "entry" | "malformed"` for an absent Spec; an absent own key of that `design` or `ui` section, `description` there, a question key no open question carries, or a rule key no rule or flow carries; or a refused token. Pairs with no declared relation in either direction, and pairs backed only by a declared relation from the target are separate lists. The audit accepts `params.intended` rows of `from`, `to` and `reason`: `intended` holds the matching unbacked pairs with their reasons, `unbacked` holds the remaining unbacked pairs, and `staleIntended` holds supplied rows that match no unbacked pair in the selected scope. The validator reads no intended list, so its warnings stand.
- rule: Entry search matches whole tokens and answers with the Spec, the section, and the matching entry's key or text, plus `address: string | null`, where concept search names the node and the fields it matched, never the entry.
- rule: Entry search gives an entry its address when one exists: `spec:<id>#<section>.<key>` for a `design` or `ui` key matching `^[a-z][A-Za-z0-9]*$` other than `description`, `spec:<id>#question.<key>` for the text of an open question that carries a key, and `spec:<id>#rule.<key>` for a keyed rule or flow; every other entry has `address: null`.
- rule: Whole tokens are maximal runs of Unicode letters and digits, split at camelCase humps and compared without case; a multiword term matches only as a consecutive run in the same order inside one key or text.
- rule: Pinned declarations reports each keyed Design entry whose value opens with a code span, giving the Spec, the key, and the span content as authored with the count of entries and of Specs, and parses no language inside the span.
- rule: Each body composes the reader and adds no reader join or CLI verb.
- rule: The recipe check executes each catalog body as written, and the on-ramps point to the catalog for its contents.
