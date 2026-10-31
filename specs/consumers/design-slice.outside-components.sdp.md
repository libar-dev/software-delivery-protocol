---
id: spec:consumers.design-slice.outside-components
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [outsideNeighbors]
---
# Outside components stop at the touched components' neighbors

## Intent

- outcome: Outside components stop at the touched components' neighbors.

```gwt
Given a probe Pack whose members {structure: "include a decision that refines the member it shapes"}
Given one member depends on an outside Spec {outside: "that a component's unit satisfies"}
Given one member is a component design whose component {anchor: "an anchor satisfies, matching every declared value"}
When the design slice runs over the probe Pack
Then the outside components are {outsideComponents: "component:probe.neighbor"}
```
