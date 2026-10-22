---
id: spec:consumers.design-slice.component-unrelated
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [componentDesigns, touchedComponents, touchedUses, outsideNeighbors]
---
# An anchor alone does not realize a component design

## Intent

- outcome: An anchor alone does not realize a component design.

```gwt
Given a probe Pack whose members {structure: "rest on each other in a chain"}
Given one member depends on an outside Spec {outside: "that a component's unit satisfies"}
Given one member is a component design whose component {anchor: "an anchor holds without satisfying the design"}
When the design slice runs over the probe Pack
Then the member design reads {realized: "unrealized"} with {differing: 0} differing and {unreadable: 0} unreadable rows
```
