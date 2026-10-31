---
id: spec:consumers.design-slice.dependency-cycle
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [depth, orderAdvisory]
---
# A cycle shares a depth

## Intent

- outcome: A cycle shares a depth.

```gwt
Given a probe Pack whose members {structure: "include two members that depend on each other"}
Given one member depends on an outside Spec {outside: "that no code satisfies"}
Given one member is a component design whose component {anchor: "an anchor satisfies, matching every declared value"}
When the design slice runs over the probe Pack
Then the slice reports {cycles: 1} cycles and {exampleMembers: 0} folded example members
```
