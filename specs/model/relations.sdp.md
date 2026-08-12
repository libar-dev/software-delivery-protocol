---
id: spec:model.relations
kind: model
altitude: feature
readiness: defined
relations:
  refines: spec:model.core-model
---
# Specs declare typed directed relations

## Intent
- outcome: Preserve the explicit intent links that make a delivery model navigable and queryable.

## Model
- **authored relation** — A declared, directed Spec-to-Spec edge that records human intent.
- **refines** — A child points to its more precise parent.
- **dependsOn** — A dependent Spec points to the Spec it needs.
- **constrainedBy** — A bounded Spec points to its rule, constraint, or policy Spec.
- **decidedBy** — A shaped Spec points to its Decision Record.
- **typed dependency distinction** — `constrainedBy` and `decidedBy` preserve separately queryable intents that a generic `dependsOn` edge would flatten.
- **verifies** — A verifier points to the Spec it verifies.
- **supersedes** — A current Decision Record points forward to the decision it replaces.
