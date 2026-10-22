---
id: spec:consumers.spec-studio.diagram-kinds
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:consumers.spec-studio.diagrams
  decidedBy:
    target: spec:decisions.studio-diagram-renderer
    reason: every new kind is laid out by the engine at build time as the renderer decision rules
---
# The Studio draws every diagram kind the graph holds data for

The Studio draws four diagrams today: the architecture grid, a component's members, a Spec's one-hop relations and a Spec's realization. The graph holds more structure than they show: dependency chains across a Pack, the refinement tree of a capability, the components a Pack's members touch, and the stated and reached rungs of many Specs at once. Each kind the graph has honest data for gets a drawing, and a kind it has no data for is named and refused rather than guessed from prose.

## Intent

- outcome: Draw every diagram kind the graph holds honest data for, legible at a desktop width without zooming, each offering its Mermaid source to copy, and name each kind the graph cannot support.

### Open questions

- [blocking #kindCatalog] Which diagram kinds does the graph hold honest data for, and which would need data it does not hold, such as message order for a sequence diagram?
  - decider: delegated
- [blocking #legibleLabels] How does a drawing wider than its column keep its labels legible: a wider figure, shorter labels, a smallest scale with scrolling, or a mix?
  - decider: delegated
