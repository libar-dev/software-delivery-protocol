---
id: spec:model.pack-aggregate
kind: model
altitude: story
readiness: ready
relations:
  refines: spec:model.core-model
  decidedBy: spec:decisions.pack-reified
---
# A Pack is a truth-free review aggregate

## Intent
- outcome: Let reviewers group related Specs without introducing a second truth-bearing artifact.

## Model
- **Pack** — An authored aggregate that groups related Specs for ideation and review while stating no system truth of its own.
- **framing** — A plain descriptive note explaining why a Pack exists; it is not Spec intent.
- **membership** — A declared manifest reference that derives a belongsTo edge; a Spec may belong to many Packs.
- **modelRefs** — References from a Pack to standalone model Specs that carry shared vocabulary.
- **refinement** — A truth-bearing parent-child relation, distinct from the cross-cutting Pack aggregate.
