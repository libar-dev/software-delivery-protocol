---
id: spec:consumers.design-slice.outside-holding
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [boundary, questionsInScope]
---
# An outside prerequisite names the member it holds

## Intent

- outcome: An outside prerequisite names the member it holds.

```gwt
Given a probe Pack whose members {structure: "include a decision that refines the member it shapes"}
Given one member depends on an outside Spec {outside: "stated below defined"}
Given one member is a component design whose component {anchor: "an anchor holds without satisfying the design"}
When the design slice runs over the probe Pack
Then the outside Spec holds {held: "spec:probe.base"}
```
