---
id: spec:validation.next-rung-floor.blocking-question
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.next-rung-floor
  verifies: spec:validation.next-rung-floor
---
# A scoped Spec held by a blocking question is told the clause

## Intent
- outcome: Execute the next rung's evidence on a Spec whose `defined` floor fails on a blocking open question, where the failure names no target.
- assumption: The world holds one story-altitude rule Spec with an Intent outcome, one rule, one declared `refines` on a parent stating `ready`, and one blocking open question. No anchor is present. A failure with no targets is written as an empty string.

```gwt
Given the graph holds a rule spec {specId: "spec:probe.held"} stating readiness {statedReadiness: "scoped"}
Given the spec {structure: "records a blocking open question"}
When the reader builds the spec's context
Then the floor reached is {floorReached: "scoped"} and the next rung is {nextRung: "defined"}
Then the next rung's first unmet clause is {clauseId: "no-blocking-open-questions"}
Then that failure names the targets {targets: ""}
Then the stated rung's floor failures number {currentFailures: 0}
```
