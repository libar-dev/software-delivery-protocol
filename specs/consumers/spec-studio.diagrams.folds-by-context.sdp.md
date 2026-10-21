---
id: spec:consumers.spec-studio.diagrams.folds-by-context
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.diagrams
  verifies:
    target: spec:consumers.spec-studio.diagrams
    exercises: [bound, foldByContext, sameBytes]
---
# An architecture over the bound folds by context

## Intent
- outcome: Execute the fold by context on an architecture too large for one drawing whose contexts each fit.
- assumption: The world builds the layout's input as the within-bound example does, with no uses edge, so each of the three contexts holds fifteen components and draws in a section of its own within the bound.

```gwt
Given an architecture of {components: 45} components spread over {contexts: 3} contexts and {layers: 5} layers, with {edges: 0} uses edges between components
When the build lays the architecture diagram out twice
Then the two drawings are byte-identical: {identical: true}
Then the diagram folds by {fold: "context"}
Then the first drawing holds {drawn: 3} boxes
Then its text equivalent names {named: 3} boxes and edges
```
