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

The shipped Mermaid projection draws bounded one-hop diagrams rooted at a Spec or a Pack and never the whole graph. Code units, their component membership and their `uses` edges appear in the census tables and in recipes 12 to 14 and 17, never in a diagram. The original design drew container and component maps from its architecture model (`docs/lineage/v0-design/07-spec-studio-and-projections.md` §8.2, §8.3). Plan 35 deferred a Mermaid rendering of structural edges, because no reader needed diagrams rooted at code units that the census and the Spec-rooted diagrams fail to serve (plan 35, "H leftover projections"). Components have since gained a layer and a context, so such a diagram would have more to draw. The shipped projections are frozen, so this view would be a new root or would need a decision that supersedes part of the freeze.

## Intent
- outcome: Draw component, membership and uses diagrams rooted at code units, once a reader needs them and the existing views do not serve it.

### Open questions
- [blocking #namedStructuralReader] Re-entry trigger from plan 35: a named reader who needs diagrams rooted at code units, which census tables and Spec-rooted one-hop Mermaid do not serve, plus a recorded decision to extend or abandon the one-generated-view posture.
- [non-blocking #layerAndContext] Would a component diagram group its nodes by context and order them by layer, and would that make it the architecture view the Studio's architecture lens draws?

## Behavior
