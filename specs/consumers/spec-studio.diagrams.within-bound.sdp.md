---
id: spec:consumers.spec-studio.diagrams.within-bound
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.diagrams
  verifies:
    target: spec:consumers.spec-studio.diagrams
    exercises: [buildTime, layoutInputs, sameBytes, architectureGrid, textEquivalent]
---
# An architecture within the bound draws in one diagram, the same bytes twice

## Intent
- outcome: Execute the grid, the text equivalent and determinism on an architecture that fits one drawing.
- assumption: The world builds the layout's input directly: the components are named `component:probe.c01` and on, assigned in turn to the first contexts in code-unit order and the first layers in the closed order, and the uses edges join distinct component pairs taken in id order until the count is reached. It lays the input out twice through the engine's layout and compares the two SVG strings.

```gwt
Given an architecture of {components: 12} components spread over {contexts: 3} contexts and {layers: 4} layers, with {edges: 20} uses edges between components
When the build lays the architecture diagram out twice
Then the two drawings are byte-identical: {identical: true}
Then the diagram folds by {fold: "nothing"}
Then the first drawing holds {drawn: 12} boxes
Then its text equivalent names {named: 32} boxes and edges
```
