---
id: spec:model.planned-architecture.differing-layer-and-uses
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:model.planned-architecture
  verifies: spec:model.planned-architecture
---
# A realized component that differs from its design gives one row per field

## Intent
- outcome: Execute the realization comparison on one realized component whose layer and uses differ from its design.
- assumption: The world writes the probe root of the unrealized-design example and adds a comment-form anchor for the planned component that satisfies the design Spec and states the realized layer, with one `impl:` member whose anchor `uses` the member of the component the realized-uses slot names.

```gwt
Given a component design for {componentId: "component:probe.history"} that plans the layer {plannedLayer: "domain"} and uses {plannedUses: "component:probe.kernel"}
Given the component anchor for that design {anchor: "satisfies the design"}
Given that anchor states the layer {realizedLayer: "application"} and its member uses {realizedUses: "component:probe.audit"}
When the realization comparison runs
Then the comparison lists {unrealized: 0} unrealized designs, {matching: 0} matching designs and {differing: 2} differing rows
Then the differing fields are {fields: "layer, uses"}
```
