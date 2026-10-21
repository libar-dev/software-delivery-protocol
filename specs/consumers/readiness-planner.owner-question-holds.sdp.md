---
id: spec:consumers.readiness-planner.owner-question-holds
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.readiness-planner
  verifies:
    target: spec:consumers.readiness-planner
    exercises: [ownerQuestions, waiting]
---
# An owner's blocking question lists the Specs it holds

## Intent
- outcome: Execute the owner's-question list on a blocking question that holds its own Spec and a Spec depending on it.
- assumption: The world writes a probe corpus of two story-altitude behavior Specs, each with an Intent outcome and one rule. The subject states `scoped`, carries one blocking open question whose `decider` is `owner`, and refines the dependent; the dependent states `defined` and declares `dependsOn` on the subject. Neither floor reaches above its stated rung, so the queue is empty. The Specs carry the ids the list names, and the world reads the queue as the dependency-order example does, the held Specs being the one listed question's `holds`.

```gwt
Given a probe corpus in which {corpus: "a Spec carries a blocking question its owner decides and another Spec depends on it"}
When the statement queue runs over the probe corpus
Then the queue lists {queue: ""} in that order
Then the owner's questions hold {held: "spec:probe.subject, spec:probe.dependent"}
```
