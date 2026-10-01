---
id: spec:validation.typed-dependency-floor
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:validation.readiness-floor
  dependsOn: spec:model.relations
---
# A ready Spec rests only on settled dependencies

## Intent
- problem: The `ready` floor reads `refines` and `dependsOn` targets only, so a Spec bounded by an unsettled constraint or shaped by an unsettled decision can still state `ready`.
- outcome: Refuse a `ready` statement while any Spec it depends on, through any typed dependency, stands below `defined`.

## Rule
- The `ready` floor's target clause reads every typed dependency the Spec declares. Each `refines`, `dependsOn`, `constrainedBy`, and `decidedBy` target itself states at least `defined`.
- The threshold is `defined` for all four relations. A `decidedBy` target at `defined` is a complete decision record awaiting ratification, and demanding `ready` of it would make `ready` on every shaped Spec a transitive registry fact, so a design can state `ready` while the decisions that shape it stay proposals.
- The clause stays kind-blind and reads resolving targets only. An unresolved target remains the relation-resolution clause's failure, never a second one.
- `verifies` and `supersedes` stay outside the clause. A verifier's rung is independent of the Spec it verifies, and a replacement decision does not rest on the record it supersedes.
- An unsettled fact is stated the way any unsettled truth is. A constraint Spec that records a blocking open question stays below `defined`, and every Spec bounded by it can state `defined` and cannot state `ready`.
- This clause replaces the `refines` and `dependsOn` sentence of `spec:validation.readiness-floor` and its row in the floor table of `src/validate/readiness-floor.ts`. The floor keeps one target clause, never two.
