---
id: spec:model.enrichment-lifecycle
kind: model
altitude: feature
readiness: defined
relations:
  refines: spec:model.core-model
---
# Enrichment keeps one Spec while its detail changes

## Intent
- outcome: Keep a Spec useful after implementation without recreating value-transfer duplication.

## Model
- **enrichment lifecycle** — The same Spec gains and may later slim typed detail without changing identity or moving truth into another artifact type.
- **distillation boundary** — A Design entry may leave its Spec once the Spec is implemented with a verifier and a bound artifact carries the entry: a pinned declaration whose realizing unit exists, or a bound example. Prose that explains why always stays, so each explanation keeps one home, and implemented code alone justifies neither keeping nor deleting detail.
- **slimming candidate** — A Design entry past the distillation boundary. A recipe reports the candidates and never deletes one; removing an entry stays the author's edit.
