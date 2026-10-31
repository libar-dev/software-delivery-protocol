---
id: spec:consumers.design-slice.chain
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [depth, scope, memberColumns]
---
# Members rest on a chain

## Intent

- outcome: Members rest on a chain.

```gwt
Given a probe Pack whose members {structure: "rest on each other in a chain"}
Given one member depends on an outside Spec {outside: "that no code satisfies"}
Given one member is a component design whose component {anchor: "an anchor satisfies, matching every declared value"}
When the design slice runs over the probe Pack
Then the members read in depth order {order: "spec:probe.base, spec:probe.design, spec:probe.top"}
```
