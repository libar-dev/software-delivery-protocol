---
id: spec:model.relations
kind: model
altitude: feature
readiness: ready
relations:
  refines: spec:model.core-model
  decidedBy:
    target: spec:decisions.planning-truths-placement
    reason: planning truths ride these six relation types, and new relation types were refused
---
# Specs declare typed directed relations

## Intent
- outcome: Preserve the explicit intent links that make a delivery model navigable and queryable.

## Model
- **authored relation** — A declared, directed Spec-to-Spec edge that records human intent.
- **refines** — A more precise child points to its parent; refinement is how altitude descends, and a decision that narrows one part of another decision refines it.
- **dependsOn** — A dependent Spec points to the Spec it needs.
- **constrainedBy** — A bounded Spec points to its rule, constraint, or policy Spec.
- **decidedBy** — A shaped Spec points to its Decision Record.
- **typed dependency distinction** — `constrainedBy` and `decidedBy` preserve separately queryable intents that a generic `dependsOn` edge would flatten.
- **verifies** — A verifier points to the Spec it verifies; an example declares it, a test anchor's binding derives it, and the two claims are never collapsed.
- **supersedes** — A newer Decision Record points to the older record it replaces whole; the older record and the edge stay only while its text explains something a reader still needs.
