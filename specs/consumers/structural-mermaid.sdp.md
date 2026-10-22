---
id: spec:consumers.structural-mermaid
kind: behavior
altitude: feature
readiness: scoped
relations:
  refines: spec:consumers.projections-model
  dependsOn:
    target: spec:consumers.spec-studio.lenses.architecture
    reason: the lens draws the component diagram rooted at code units this Spec asked for
  decidedBy: spec:decisions.shipped-projections-frozen
---
# Mermaid diagrams can be rooted at code units

The shipped Mermaid projection draws bounded diagrams rooted at a Spec or a Pack. A Spec-rooted diagram within the bounds includes directly bound code units and test anchors; component membership and uses are read through the census and structural recipes. A view rooted at code units, grouping components by their context and layer, is now the Studio's architecture lens. Adding such a view to the shipped Mermaid root would still need a decision that narrows or replaces the projection freeze.

## Intent
- outcome: Draw component, membership and uses diagrams rooted at code units, once a reader needs them and the existing views do not serve it.

### Open questions
- [blocking #namedStructuralReader] Does a reader need diagrams rooted at code units, which census tables and Spec-rooted one-hop Mermaid do not serve?
  - decider: owner
  - trigger: a named reader with that need, plus a decision that refines `spec:decisions.shipped-projections-frozen` for the affected Mermaid rendering or supersedes that ruling whole

## Behavior
- rule: [#architectureLens] A component diagram rooted at code units groups its components by context and orders them by layer, and the Studio's architecture lens, `spec:consumers.spec-studio.lenses.architecture`, draws it; the shipped Mermaid root draws none.
