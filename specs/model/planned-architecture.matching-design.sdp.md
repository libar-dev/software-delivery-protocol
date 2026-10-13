---
id: spec:model.planned-architecture.matching-design
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:model.planned-architecture
  verifies: spec:model.planned-architecture
---
# A realized component that matches its design gives no row

## Intent
- outcome: Execute the realization comparison on one realized component whose layer and uses match its design.
- assumption: The world writes the probe root of the differing example, with the realized layer and uses the slots give.

```gwt
Given a component design for {componentId: "component:probe.history"} that plans the layer {plannedLayer: "domain"} and uses {plannedUses: "component:probe.kernel"}
Given the component anchor for that design {anchor: "satisfies the design"}
Given that anchor states the layer {realizedLayer: "domain"} and its member uses {realizedUses: "component:probe.kernel"}
When the realization comparison runs
Then the comparison lists {unrealized: 0} unrealized designs, {matching: 1} matching designs and {differing: 0} differing rows
Then the differing fields are {fields: ""}
```
