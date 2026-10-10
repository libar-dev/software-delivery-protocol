---
id: spec:validation.next-rung-floor
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:validation.readiness-floor
  dependsOn: spec:validation.typed-dependency-floor
---
# The floor names what blocks the next rung

## Intent
- problem: The floor is evaluated only at the stated rung, so promotion preflight answers no unmet clause for a Spec that states `defined` and cannot state `ready`, and an author or an adopter's page walks the floor table one rung up with its own code. A failed typed-dependency clause names the clause and not the dependencies that break it, so the same page recomputes which targets stand below `defined`.
- outcome: Let the one evaluator answer for any rung, name the next rung's unmet clauses in the reader, and name the targets that fail the typed-dependency clause, so no consumer evaluates the floor a second way.

## Rule
- The evaluator takes an optional target rung. Given one, it evaluates the cumulative clauses of every rung up to and including that rung; without one, it evaluates up to the stated rung, as before. A Spec of an unratified kind, or an evaluation with no ratified rung to reach, yields no failure, and the descriptor conformance error owns that case.
- The next rung is the rung above derived readiness: `idea` when no rung derives, and none when derived readiness is `ready`. Because derived readiness is the highest rung whose cumulative clauses all pass, the failures at the next rung are that rung's own clauses, and there is at least one whenever a next rung exists for a Spec of a ratified kind.
- The reader's Spec context carries the next rung's failures beside the stated rung's failures, computed by the same evaluator, and an empty list when there is no next rung. This is a field on the existing per-Spec context, not a new reader method, and it meets the second-caller bar: promotion preflight and the first adopter's Pack page both need it, and the page's own walk read the rung above the stated one where preflight reads the rung above the floor reached.
- A failure of the typed-dependency clause carries its targets: every distinct resolving `refines`, `dependsOn`, `constrainedBy`, or `decidedBy` target that states a rung below `defined`, or that is not a Spec, each with its relation type, its id, and its stated rung when it is a Spec. Targets sort by relation type in that order and then by id in code-unit order. No other clause carries targets.
- Promotion preflight keeps every field it reports and adds the next rung's failures and the first of them, each failure with its targets when it has them. The next rung's first unmet clause is a report and never a promotion: stating any rung stays a human's edit.
- The realizing sites are `evaluateReadinessFloor` and the typed-dependency clause in `src/validate/readiness-floor.ts`, and `specContext` in `src/reader/reader.ts`.

## Example space
```gwt-vocabulary
Given the graph holds a rule spec {specId:string} stating readiness {statedReadiness:"scoped"|"defined"}
Given the spec {structure:"depends on a spec stating scoped"|"records a blocking open question"}
When the reader builds the spec's context
Then the floor reached is {floorReached:"scoped"|"defined"} and the next rung is {nextRung:"defined"|"ready"}
Then the next rung's first unmet clause is {clauseId:string}
Then that failure names the targets {targets:string}
Then the stated rung's floor failures number {currentFailures:number}
```
