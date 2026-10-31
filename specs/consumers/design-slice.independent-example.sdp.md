---
id: spec:consumers.design-slice.independent-example
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [examplesFold, boundary]
---
# An example with its own dependency stays unfolded

## Intent

- outcome: An example with its own dependency stays unfolded.

```gwt
Given a probe Pack whose members {structure: "include an example that refines a member and depends on an outside Spec"}
Given one member depends on an outside Spec {outside: "that no code satisfies"}
Given one member is a component design whose component {anchor: "an anchor satisfies, matching every declared value"}
When the design slice runs over the probe Pack
Then the slice reports {cycles: 0} cycles and {exampleMembers: 0} folded example members
```
