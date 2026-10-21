---
id: spec:consumers.readiness-planner.cycle-shares-a-round
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.readiness-planner
  verifies:
    target: spec:consumers.readiness-planner
    exercises: [cycles, order]
---
# Waiting Specs that rest on each other share a round and report a cycle

## Intent
- outcome: Execute the cycle rule on two waiting Specs that depend on each other.
- assumption: The world writes a probe corpus of two story-altitude behavior Specs, each stating `defined` with an Intent outcome and one rule and each declaring `dependsOn` on the other, so both floors reach `ready`. The Specs carry the ids the queue names, and the world reads the queue as the dependency-order example does.

```gwt
Given a probe corpus in which {corpus: "two waiting Specs depend on each other"}
When the statement queue runs over the probe corpus
Then the queue lists {queue: "spec:probe.a, spec:probe.b"} in that order
Then round 1 holds {firstRound: "spec:probe.a, spec:probe.b"}
Then the queue reports {cycles: 1} cycles
```
