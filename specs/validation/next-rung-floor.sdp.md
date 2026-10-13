---
id: spec:validation.next-rung-floor
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:validation.readiness-floor
  dependsOn: spec:validation.typed-dependency-floor
---
# The floor names what blocks the floor's next rung

## Intent
- problem: The floor is evaluated only at the stated rung, so promotion preflight answers no unmet clause for a Spec that states `defined` and cannot state `ready`, and an author or an adopter's page walks the floor table one rung up with its own code. A failed typed-dependency clause names the clause and not the dependencies that break it, so the same page recomputes which targets stand below `defined`.
- outcome: Let the one evaluator answer for any named rung, name the floor's next rung's unmet clauses in the reader, and name the targets that fail the typed-dependency clause, so no consumer evaluates the floor a second way.

## Rule
- The evaluator takes an optional rung to evaluate. Given one, it evaluates the cumulative clauses of every rung up to and including it; without one, it evaluates up to the stated rung. A Spec of an unratified kind, or an evaluation with no ratified rung to reach, yields no failure, and the descriptor conformance error owns that case.
- The floor's next rung is the rung above derived readiness: `idea` when no rung derives, and none when derived readiness is `ready`. Because derived readiness is the highest rung whose cumulative clauses all pass, the failures at the floor's next rung are that rung's own clauses, and there is at least one whenever that rung exists for a Spec of a ratified kind.
- The reader's Spec context carries these failures as `nextRungFailures`, beside `floorFailures` for the stated rung and `statedNextRungFailures` for the stated next rung, which `spec:consumers.pack-design` owns. All three come from the one evaluator, and `nextRungFailures` is empty when derived readiness is `ready`.
- A failure of the typed-dependency clause carries its targets: every distinct resolving `refines`, `dependsOn`, `constrainedBy`, or `decidedBy` target that states a rung below `defined`, or that is not a Spec, each with its relation type, its id, and its stated rung when it is a Spec. Targets sort by relation type in that order and then by id in code-unit order. No other clause carries targets.
- Promotion preflight reports the floor's next rung with its failures, each with its targets when it has them, and the first of them. The report is never a promotion: stating any rung stays a human's edit.

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
