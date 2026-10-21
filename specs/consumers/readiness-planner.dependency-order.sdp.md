---
id: spec:consumers.readiness-planner.dependency-order
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.readiness-planner
  verifies:
    target: spec:consumers.readiness-planner
    exercises: [waiting, restsOn, rounds, order]
---
# The Spec another rests on comes first in the queue

## Intent
- outcome: Execute the order on two waiting Specs, one depending on the other.
- assumption: The world writes a probe corpus of two story-altitude behavior Specs, a base and a dependent, each stating `defined` with an Intent outcome and one rule, plus a decision stating `ready` with its context and choice. The decision refines the base, the base names it through `decidedBy`, and the dependent declares `dependsOn` on the base, so both behavior Specs' floors reach `ready` and the decision waits on nothing. The Specs carry the ids the queue names. The world runs the shipped statement queue file through `sdp q --json` on the probe root; a list reads as ids joined by a comma and a space.

```gwt
Given a probe corpus in which {corpus: "one waiting Spec depends on another"}
When the statement queue runs over the probe corpus
Then the queue lists {queue: "spec:probe.base, spec:probe.dependent"} in that order
Then round 1 holds {firstRound: "spec:probe.base"}
Then the queue reports {cycles: 0} cycles
```
