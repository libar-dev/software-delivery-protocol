---
id: spec:consumers.spec-studio.diagrams.folds-by-layer
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.diagrams
  verifies:
    target: spec:consumers.spec-studio.diagrams
    exercises: [bound, foldByLayer]
---
# One context over the bound folds by layer

## Intent
- outcome: Execute the fold by layer on an architecture whose one context is too large for one drawing.
- assumption: The world builds the layout's input as the within-bound example does, with every component in one context and no uses edge, so each of the five layers holds ten components and draws in a section of its own within the bound.

```gwt
Given an architecture of {components: 50} components spread over {contexts: 1} contexts and {layers: 5} layers, with {edges: 0} uses edges between components
When the build lays the architecture diagram out twice
Then the two drawings are byte-identical: {identical: true}
Then the diagram folds by {fold: "layer"}
Then the first drawing holds {drawn: 5} boxes
Then its text equivalent names {named: 5} boxes and edges
```
