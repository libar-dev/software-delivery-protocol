---
id: spec:consumers.readiness-planner.decision-first
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.readiness-planner
  verifies:
    target: spec:consumers.readiness-planner
    exercises: [refinesYields, rounds]
---
# A waiting decision comes before the Spec it shapes

## Intent
- outcome: Execute the yielding rule on a waiting decision that refines the waiting Spec naming it through `decidedBy`.
- assumption: The world writes a probe corpus of a story-altitude behavior Spec stating `defined` with an Intent outcome and one rule, and a decision stating `defined` with its context and choice. The decision refines the behavior Spec, and the behavior Spec names the decision through `decidedBy`, so both floors reach `ready`. The Specs carry the ids the queue names, and the world reads the queue as the dependency-order example does.

```gwt
Given a probe corpus in which {corpus: "a waiting Spec names a waiting decision that refines it"}
When the statement queue runs over the probe corpus
Then the queue lists {queue: "spec:probe.decision, spec:probe.shaped"} in that order
Then round 1 holds {firstRound: "spec:probe.decision"}
Then the queue reports {cycles: 0} cycles
```
