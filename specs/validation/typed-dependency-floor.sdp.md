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
- problem: A `ready` statement needs a settled basis across `refines`, `dependsOn`, `constrainedBy`, and `decidedBy`. Omitting any of these relations would let a Spec state `ready` while a dependency still stands below `defined`.
- outcome: Refuse a `ready` statement while any Spec it depends on, through any typed dependency, stands below `defined`.

## Rule
- The `ready` floor's target clause reads every typed dependency the Spec declares. Each resolving `refines`, `dependsOn`, `constrainedBy`, and `decidedBy` target itself states at least `defined`. The clause reads stated readiness, so a dependent does not inherit a target's own floor failure.
- The threshold is `defined` for all four relations. A `decidedBy` target at `defined` is a complete decision record awaiting ratification, and demanding `ready` of it would make `ready` on every shaped Spec a transitive registry fact, so a design can state `ready` while the decisions that shape it stay proposals.
- The clause stays kind-blind and reads resolving targets only. An unresolved target remains the relation-resolution clause's failure, never a second one.
- `verifies` and `supersedes` stay outside the clause. A verifier's rung is independent of the Spec it verifies, and a replacement decision does not rest on the record it supersedes.
- An unsettled fact is stated the way any unsettled truth is. A constraint Spec that records a blocking open question clears at most `scoped`. When it states a rung below `defined`, a Spec bounded by it may state `defined` if its own floor clears, but cannot lawfully state `ready`.
- The floor keeps one target clause, `typed-dependency-targets-are-defined`, in `src/validate/readiness-floor.ts`. Its parent `spec:validation.readiness-floor` states the same target bound. A failure of the clause names every target that breaks it.

## Example space
```gwt-vocabulary
Given the typed dependency matrix {matrix:"relation-rungs"|"missing-targets"|"unsettled-fact"|"stated-readiness"}
When the reader checks the readiness floor
Then the matrix reports {targetFailures:number} target failures and {resolutionFailures:number} resolution failures and {questionFailures:number} blocking question failures
```
