---
id: spec:consumers.structural-mermaid
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:consumers.projections-model
  decidedBy: spec:decisions.shipped-projections-frozen
---
# Mermaid diagrams can be rooted at code units

The shipped Mermaid projection draws bounded diagrams rooted at a Spec or a Pack. A Spec-rooted diagram within the bounds includes directly bound code units and test anchors; component membership and uses are read through the census and structural recipes. A view rooted at code units could group components by their layer and context. Adding it to the shipped Mermaid root would need a decision that narrows or replaces the projection freeze. Whether it becomes a separate root or part of the Studio's architecture lens remains open.

## Intent
- outcome: Draw component, membership and uses diagrams rooted at code units, once a reader needs them and the existing views do not serve it.

### Open questions
- [blocking #namedStructuralReader] Does a reader need diagrams rooted at code units, which census tables and Spec-rooted one-hop Mermaid do not serve?
  - decider: owner
  - trigger: a named reader with that need, plus a decision that refines `spec:decisions.shipped-projections-frozen` for the affected Mermaid rendering or supersedes that ruling whole
- [non-blocking #layerAndContext] Would a component diagram group its nodes by context and order them by layer, and would that make it the architecture view the Studio's architecture lens draws?
  - decider: owner
  - provisional: the diagram folds into the Studio's architecture lens when that lens is designed, rather than becoming a Mermaid root

## Behavior
