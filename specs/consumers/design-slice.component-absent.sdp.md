---
id: spec:consumers.design-slice.component-absent
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [componentDesigns, touchedComponents, touchedUses, outsideNeighbors]
---
# An unanchored component design stays visible

## Intent

- outcome: An unanchored component design stays visible.

```gwt
Given a probe Pack whose members {structure: "rest on each other in a chain"}
Given one member depends on an outside Spec {outside: "that a component's unit satisfies"}
Given one member is a component design whose component {anchor: "no anchor holds"}
When the design slice runs over the probe Pack
Then the member design reads {realized: "unrealized"} with {differing: 0} differing and {unreadable: 0} unreadable rows
```
