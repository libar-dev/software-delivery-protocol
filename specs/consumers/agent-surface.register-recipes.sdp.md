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
    - target: spec:extraction.entry-locations
      reason: the key-family register gives each row the line the location table records
    - target: spec:model.term-addresses
      reason: entry search and the mention audit read term addresses
---
# Register questions stay executable graph recipes

A corpus keeps registers of its own values, such as its limits, its error messages and its storage tables, as families of keyed Design entries whose keys share a prefix: `limit`, `error`, `table`. The key-family register lists one or more families across a scope each time it runs, so no one keeps those tables by hand. It reads Design and UI entries only. A rule or flow key names a law that an example exercises, and its text is a statement of law rather than a value two parties hold to. Rule coverage and entry search already list rule keys, the open-question register lists question keys, and a register that mixed laws with values would hide which rows are values.

## Intent
- problem: An adopter that keeps open-question tables, dependency lists and reference checks by hand lets each copy go stale.
- outcome: Answer register, dependency, and mention questions with catalog recipes, so the tables an adopter would keep by hand are derived on demand.

## Behavior
- rule: The open-question register lists every open question by Spec with its blocking flag, key, decider, links, provisional and trigger fields, marks a question carrying a trigger as a deferral, and counts deferrals and blocking questions without a trigger apart.
- rule: The dependency footing lists what one Spec rests on across `refines`, `dependsOn`, `constrainedBy`, and `decidedBy`, with each target's stated and derived readiness.
- rule: The mention audit lists Spec ids and entry addresses written in narrative and section text, outside `gwt` and `gwt-vocabulary` fences, that do not resolve or that no declared relation in either direction backs.
- rule: The mention audit takes a list of mentioning Spec ids, with an empty list selecting the whole corpus. It reports target Spec pairs and unresolved token pairs, keeping every location in `at` as section and entry. Unresolved rows carry `reason: "spec" | "entry" | "malformed"` for an absent Spec; an absent own key of that `design` or `ui` section, `description` there, a question key no open question carries, a rule key no rule or flow carries, or a term key no Model term carries; or a refused token. Pairs with no declared relation in either direction, and pairs backed only by a declared relation from the target are separate lists. The audit accepts `params.intended` rows of `from`, `to` and `reason`: `intended` holds the matching unbacked pairs with their reasons, `unbacked` holds the remaining unbacked pairs, and `staleIntended` holds supplied rows that match no unbacked pair in the selected scope. The validator reads no intended list, so its warnings stand.
- rule: Entry search matches whole tokens and answers with the Spec, the section, and the matching entry's key or text, plus `address: string | null`, where concept search names the node and the fields it matched, never the entry.
- rule: Entry search gives an entry its address when one exists: `spec:<id>#<section>.<key>` for a `design` or `ui` key matching `^[a-z][A-Za-z0-9]*$` other than `description`, `spec:<id>#question.<key>` for the text of an open question that carries a key, `spec:<id>#rule.<key>` for a keyed rule or flow, and `spec:<id>#term.<key>` for a keyed Model term; every other entry has `address: null`.
- rule: Whole tokens are maximal runs of Unicode letters and digits, split at camelCase humps and compared without case; a multiword term matches only as a consecutive run in the same order inside one key or text.
- rule: Pinned declarations reports each keyed Design entry whose value opens with a code span, giving the Spec, the key, and the span content as authored with the count of entries and of Specs, and parses no language inside the span.
- rule: [#keyFamily] The key-family register lists every keyed Design and UI entry whose key starts with one of the given prefixes, across the corpus, the members of one Pack, or a list of Specs, each with its Spec, section, key, value as the graph holds it, file and line, with no row cap.
- rule: [#familySections] The key-family register never lists a rule, flow or question key, or the `description` entry.
- rule: Each body composes the reader and adds no reader join or CLI verb.
- rule: The recipe check executes each catalog body as written, and the on-ramps point to the catalog for its contents.

## Design

- familyRecipe: recipe 41, the key-family register, takes `params.prefixes`, a non-empty list of unique non-empty strings, each matched case-sensitively against the start of a key as authored, with `["finding", "impact"]` when absent, and at most one scope, `params.pack` or `params.specs`, reading the whole corpus with neither and a listed Spec once however often it is listed; a malformed prefix list, both scopes, or a Pack or Spec id that does not resolve returns `{ diagnostics: [{ parameter, problem }] }` and no register, `parameter` naming the parameter at fault and `specs` when both scopes are given. A Pack member that does not resolve returns a `pack` diagnostic naming that member, and no register.
- familyShape: `{ prefixes, scope, totals: { rows, specs, byPrefix }, rows }` is the register, where `scope` is `{ corpus: true }`, `{ pack }` or `{ specs }`, `totals.specs` counts the Specs with a row, and `byPrefix` maps each prefix, in the given order, to the count of rows it matches, a key that matches two prefixes counting under each.
- familyRow: `{ key, spec, section, value, file, line }` is one row, with `section` either `design` or `ui`, and `line` null when the location table records no line for the entry; rows sort by key, then Spec id, then section, in code-unit order.
