---
id: spec:consumers.design-slice.component-unreadable
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [componentDesigns, touchedComponents, touchedUses, outsideNeighbors]
---
# An unreadable declared layer stays visible

## Intent

- outcome: An unreadable declared layer stays visible.

```gwt
Given a probe Pack whose members {structure: "rest on each other in a chain"}
Given one member depends on an outside Spec {outside: "that a component's unit satisfies"}
Given one member is a component design whose component {anchor: "an anchor satisfies, with an unreadable layer"}
When the design slice runs over the probe Pack
Then the member design reads {realized: "realized"} with {differing: 0} differing and {unreadable: 1} unreadable rows
```
