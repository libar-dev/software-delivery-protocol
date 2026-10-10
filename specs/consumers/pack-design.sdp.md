---
id: spec:consumers.pack-design
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.reader
  dependsOn:
    - spec:validation.next-rung-floor
    - spec:extraction.pack-member-order
    - spec:extraction.entry-locations
    - spec:extraction.contract-declarations
---
# The Pack context carries the Pack's design

A capability designed ahead of its code is read as a Pack: its members in reading order, how far each has matured, what design each carries, what it rests on, and which code answers to it. The reader already holds every one of those facts. This Spec assembles them once on the Pack context so a page, a recipe and an adopter's script read one answer.

## Intent
- problem: Reading a Pack's design means joining member readiness, the floor one rung above the stated rung, design entries, decisions, open questions, code bindings with their components, and the Specs outside the Pack, and every consumer that joins them by hand reads the floor or the boundary a different way.
- outcome: Give each Pack member its design columns and give the Pack its boundary on the existing Pack context, so the Design Review, a recipe and an adopter's page read the design from one assembly.

### Open questions
- [non-blocking #designedRung] The design columns stand in for a `designed` stage without a new rung; `spec:model.design-maturity` holds whether a rung is still needed once readers have used them.

## Behavior
- rule: The Pack context keeps every field it has and adds the design columns to each resolved member and the boundary to the Pack. It is an extension of the existing per-Pack context, not a new reader method.
- rule: A member's stated next rung is the rung above its stated rung, none when it states `ready`. Its unmet clauses come from the one floor evaluator with that rung as the target, each failure with its targets when it has them. The list is empty when the floor already holds the stated next rung, which reads as a rung that waits for its author and never as a promotion. The floor reached and the context's existing next-rung failures, which read the rung above the floor, stay as they are, so the two readings never share a name.
- rule: A member's design columns count its keyed `design` and `ui` entries, other than `description`; its pinned declarations, the `design` entries whose value opens with a code span under the rule of the contract-declarations Spec; its open questions and how many of them block, listing each question with its text, its blocking flag, its key when it carries one, and its source line from the location table; and they list the decisions it names through `decidedBy`, each with its stated rung, or unresolved when the target is no Spec. The columns are counts and lists read from the graph, never a score or a rung.
- rule: A member lists the code units that satisfy it and the code units that reference it, each as a code unit binding. A code unit binding carries its component when the unit has a `memberOf` edge: the component's id with its layer and context when the component anchor states them. The component rides the binding on the Spec context as well, as an addition.
- rule: A member counts its verifiers and its enabled verifiers, and the examples that declare `verifies` on it with how many of them are enabled, by the reader's existing verifier decoding.
- rule: The Pack's boundary lists the Specs outside the Pack joined to a member by an authored relation. A Spec a member relates to by `refines`, `dependsOn`, `constrainedBy` or `decidedBy` is one the Pack rests on; a Spec that relates to a member by any authored relation is one that rests on the Pack. Each row carries the outside Spec's id, title, stated rung and whether it carries `implemented`, and for each relation type the members it joins. A relation whose target is not a Spec in the graph is left to referential integrity and does not appear.
- rule: Members keep the manifest's authored order, an unresolved member keeps its existing row with no design columns, and boundary rows sort by id in code-unit order.
- rule: The assembly is a pure function of the graph: it reads no carrier file, records nothing, and confers no delivery fact or readiness.
- rule: The realizing site is `packContext` in `src/reader/reader.ts`.
