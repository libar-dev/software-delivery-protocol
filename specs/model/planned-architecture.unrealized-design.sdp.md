---
id: spec:model.planned-architecture.unrealized-design
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:model.planned-architecture
  verifies: spec:model.planned-architecture
---
# A component design no anchor satisfies is listed as unrealized

## Intent
- outcome: Execute the realization comparison on one component design whose component no anchor realizes yet.
- assumption: The world writes a probe root holding one story-altitude model Spec stating `idea` with an Intent outcome, one Model term and a Design section whose `id`, `layer` and `uses` entries carry the slots' planned values, bare. Beside it the root holds comment-form anchors for `component:probe.kernel` and `component:probe.audit`, each with one `impl:` member. The world runs the comparison's shipped recipe file through `sdp q --json`; the differing fields are the `field` values of the `differing` rows joined by a comma and a space, in answer order, and an empty string names none.

```gwt
Given a component design for {componentId: "component:probe.history"} that plans the layer {plannedLayer: "domain"} and uses {plannedUses: "component:probe.kernel"}
Given the component anchor for that design {anchor: "is absent"}
When the realization comparison runs
Then the comparison lists {unrealized: 1} unrealized designs, {matching: 0} matching designs and {differing: 0} differing rows
Then the differing fields are {fields: ""}
```
