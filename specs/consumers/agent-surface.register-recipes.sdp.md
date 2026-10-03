---
id: spec:consumers.agent-surface.register-recipes
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface
---
# Register questions stay executable graph recipes

## Intent
- problem: An adopter keeps open-question tables, dependency lists, and reference checks by hand because the catalog ships no body for them, and each hand-kept copy goes stale.
- outcome: Answer register, dependency, and mention questions with catalog recipes, so the tables an adopter would keep by hand are derived on demand.

## Behavior
- rule: The open-question register lists every open question by Spec with its blocking flag and reports the totals.
- rule: The dependency footing lists what one Spec rests on across `refines`, `dependsOn`, `constrainedBy`, and `decidedBy`, with each target's stated and derived readiness.
- rule: The mention audit lists Spec ids written in narrative and section text, outside `gwt` and `gwt-vocabulary` fences, that do not resolve or that no declared relation from the mentioning Spec backs.
- rule: Entry search matches whole tokens and answers with the Spec, the section, and the matching entry's key or text, where concept search answers with the Spec and the section only.
- rule: The pinned declarations list reports each keyed Design entry whose value opens with a code span, giving the Spec, the key, and the span content as authored with the count of entries and of Specs, and parses no language inside the span.
- rule: Each body composes the existing reader. None adds a reader join or a CLI verb, because a join freezes into the reader only at the second-caller bar.
- rule: The recipe check executes each body as written, and every document that states the catalog's size moves with the catalog.
- rule: Whole tokens are maximal runs of Unicode letters and digits, split at camelCase humps and compared without case; a multiword term matches only as a consecutive run in the same order inside one key or text.
- rule: The mention audit takes a list of mentioning Spec ids, with an empty list selecting the whole corpus. It reports one row per mentioning Spec and target pair, with locations as section and entry. Unresolved pairs, pairs with no declared relation in either direction, and pairs backed only by a declared relation from the target are separate lists.
