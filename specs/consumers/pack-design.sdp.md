---
id: spec:consumers.pack-design
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.reader
  dependsOn:
    - spec:validation.next-rung-floor
    - spec:extraction.pack-member-order
    - spec:extraction.entry-locations
    - spec:extraction.contract-declarations
    - target: spec:model.open-question-fields
      reason: each listed open question carries its fields
  decidedBy:
    - target: spec:decisions.architectural-annotation
      reason: a code unit binding carries the role, layer and context its anchors state
---
# The Pack context carries the Pack's design

A capability designed ahead of its code is read as a Pack: its members in reading order, how far each has matured, what design each carries, what it rests on, and which code answers to it. The reader holds every one of those facts. This Spec assembles them once on the Pack context so a page, a recipe and an adopter's script read one answer.

## Intent
- problem: Reading a Pack's design means joining member readiness, the floor one rung above the stated rung, design entries, decisions, open questions, code bindings with their components, and the Specs outside the Pack, and every consumer that joins them by hand reads the floor or the boundary a different way.
- outcome: Give each Pack member its design columns and give the Pack its boundary on the Pack context, so the Design Review, a recipe and an adopter's page read the design from one assembly.

## Behavior
- rule: One helper derives a Spec's design columns; the Spec context carries them as `designColumns` and each resolved Pack member carries the same value as `design`, while the Pack context carries the boundary.
- rule: A member's stated next rung is the rung above its stated rung, none when it states `ready`. Its unmet clauses come from the one floor evaluator with that rung as the target, each failure with its targets when it has them. The list is empty when the floor already holds the stated next rung, so the rung waits for its author's statement, never a promotion. The floor reached and the failures at the rung above it are separate readings.
- rule: A member's design columns count its keyed `design` and `ui` entries other than `description`, its pinned declarations under the contract-declarations rule, and its open questions with how many block. They list each question with its zero-based authored `index`, text, blocking flag, optional key, `decider`, `links`, `provisional` and `trigger` as present, and optional source line from the location table. They list the decisions it names through `decidedBy`, each with its stated rung or unresolved when the target is no Spec. The columns are counts and lists read from the graph, never a score or a rung.
- rule: A member lists the code units that satisfy it and those that reference it as code unit bindings; each binding carries `codeId` and `claim`, plus `label`, `file`, `line` and `role` when recorded. A component unit carries its own optional `layer` and `context`; a `memberOf` edge adds its component's id and optional layer and context. The Spec context carries the same bindings.
- rule: A member counts its verifiers and enabled verifiers, and the example Specs that declare `verifies` on it with how many are enabled, using the reader's verifier decoding.
- rule: The Pack's boundary lists the Specs outside the Pack joined to a member by an authored relation. A Spec a member relates to by `refines`, `dependsOn`, `constrainedBy` or `decidedBy` is one the Pack rests on; a Spec that relates to a member by the same four relations is one that rests on the Pack. The boundary lists inbound `verifies` separately as `verifiedBy` and inbound `supersedes` as `supersededBy`, with the same row shape. Each row carries the outside Spec's id, title, stated rung and whether it carries `implemented`, and for each relation type the members it joins, the types in the closed relation list's order and the members in authored order. A relation whose target is not a Spec in the graph is left to referential integrity and does not appear.
- rule: Members keep the manifest's authored order, unresolved members carry their unresolved row without design columns, and boundary rows sort by id in code-unit order.
- rule: The assembly is a pure function of the graph: it reads no carrier file, records nothing, and confers no delivery fact or readiness.
