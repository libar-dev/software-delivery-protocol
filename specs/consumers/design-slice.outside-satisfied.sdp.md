---
id: spec:consumers.design-slice.outside-satisfied
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [touchedComponents, outsideNeighbors, notDownstream]
---
# A prerequisite reaches its satisfying component

## Intent

- outcome: A prerequisite reaches its satisfying component.

```gwt
Given a probe Pack whose members {structure: "include a decision that refines the member it shapes"}
Given one member depends on an outside Spec {outside: "that a component's unit satisfies"}
Given one member is a component design whose component {anchor: "an anchor holds without satisfying the design"}
When the design slice runs over the probe Pack
Then the touched components are {components: "component:probe.dependency, component:probe.designed"}, {throughRestsOn: 1} of them reached through what the slice rests on
```
