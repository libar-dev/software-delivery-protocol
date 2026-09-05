---
id: spec:model.structural-patterns
kind: model
altitude: feature
readiness: defined
relations:
  refines: spec:model.anchors
  decidedBy: spec:decisions.architectural-significance-rides-primitives
---
# Architectural significance dissolves into existing primitives

## Intent

- outcome: Express architectural responsibilities in Specs of the appropriate kind, connect their semantic dependencies with existing relations, and bind their implementations through structural anchors. Architectural significance adds no kind or vocabulary.

## Model

- **architecturally significant unit** — a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding.
