---
id: spec:consumers.spec-studio.lenses.architecture.planned-apart
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.lenses.architecture
  verifies:
    target: spec:consumers.spec-studio.lenses.architecture
    exercises: [contextAndLayer, plannedApart]
---
# A component design no anchor realizes draws planned beside the built one

## Intent
- outcome: Execute the planned component on the architecture lens: drawn in the grid where its design places it, marked planned, and listed apart.
- assumption: The world writes a root with one component anchor, `component:probe.orders`, that states the context `orders` and the layer `domain`, and one component design, a Spec whose Design entries name `component:probe.payments` in the same context and layer, which no anchor realizes; it builds the page set and reads the architecture page: the boxes in the `orders` lane and the `domain` band, the boxes carrying `data-planned="true"`, and the rows of the `Designed, not built` table.

```gwt
Given component anchors that realize {realized: 1} components in the context {context: "orders"} and the layer {layer: "domain"}
Given component designs that plan {planned: 1} more components in that context and layer, which no anchor realizes
When the build renders the architecture lens
Then the context's column holds {boxes: 2} component boxes in the layer's band
Then the diagram marks {plannedBoxes: 1} boxes planned
Then the Designed, not built section lists {listed: 1} component designs
```
