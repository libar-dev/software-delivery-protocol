---
id: spec:consumers.design-slice.component-differing
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [componentDesigns, touchedComponents, touchedUses, outsideNeighbors]
---
# A realized component keeps its differing layer and uses apart

## Intent

- outcome: A realized component keeps its differing layer and uses apart.

```gwt
Given a probe Pack whose members {structure: "rest on each other in a chain"}
Given one member depends on an outside Spec {outside: "that a component's unit satisfies"}
Given one member is a component design whose component {anchor: "an anchor satisfies, with a differing layer and uses"}
When the design slice runs over the probe Pack
Then the member design reads {realized: "realized"} with {differing: 2} differing and {unreadable: 0} unreadable rows
```
