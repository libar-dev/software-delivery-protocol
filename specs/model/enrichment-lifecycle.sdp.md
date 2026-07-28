---
id: spec:model.enrichment-lifecycle
kind: model
altitude: feature
readiness: scoped
relations:
  refines: spec:model.core-model
---
# Enrichment keeps one Spec while its detail changes

## Intent
- outcome: Keep a Spec useful after implementation without recreating value-transfer duplication.

### Open questions
- [blocking] After implementation, which design-time detail stays in the Spec and which detail may be removed while preserving one durable home for each explanation?

## Model
- **enrichment lifecycle** — The same Spec gains and may later slim typed detail without changing identity or moving truth into another artifact type.
- **distillation boundary** — Implemented code does not automatically justify either retaining or deleting design-time detail; the unresolved policy must preserve one home per explanation.
