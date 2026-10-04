---
id: spec:validation.next-rung-floor.typed-dependency-targets
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.next-rung-floor
  verifies: spec:validation.next-rung-floor
---
# A defined Spec resting on a scoped dependency is told which one

## Intent
- outcome: Execute the next rung's evidence on a Spec whose own floor clears `defined` and whose `ready` floor fails on one dependency.
- assumption: The world holds two story-altitude rule Specs with an Intent outcome and one rule each. The subject declares `dependsOn` on the basis Spec named in the targets, which states `scoped` and declares `refines` on a third Spec stating `idea`. No Spec records an open question and no anchor is present. A target is written as its relation type, its id, and its stated rung in parentheses.

```gwt
Given the graph holds a rule spec {specId: "spec:probe.subject"} stating readiness {statedReadiness: "defined"}
Given the spec {structure: "depends on a spec stating scoped"}
When the reader builds the spec's context
Then the floor reached is {floorReached: "defined"} and the next rung is {nextRung: "ready"}
Then the next rung's first unmet clause is {clauseId: "typed-dependency-targets-are-defined"}
Then that failure names the targets {targets: "dependsOn spec:probe.basis (scoped)"}
Then the stated rung's floor failures number {currentFailures: 0}
```
