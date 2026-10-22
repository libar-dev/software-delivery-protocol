---
id: spec:consumers.design-slice.decision-backlink
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-slice
  verifies:
    target: spec:consumers.design-slice
    exercises: [restsOn, depth, decisionsInScope]
---
# A shaping decision comes before its member

## Intent

- outcome: A shaping decision comes before its member.

```gwt
Given a probe Pack whose members {structure: "include a decision that refines the member it shapes"}
Given one member depends on an outside Spec {outside: "that no code satisfies"}
Given one member is a component design whose component {anchor: "an anchor satisfies, matching every declared value"}
When the design slice runs over the probe Pack
Then the members read in depth order {order: "spec:probe.base, spec:probe.design, spec:probe.top"}
```
