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

- outcome: Specs carrying architectural significance, and relationships among those Specs, are authored as decision/model-kind Specs, existing relations, and the satisfies→decidedBy join — no new vocabulary is needed beyond the structural anchors already in the graph.

## Model

- **architecturally significant unit** — a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding.
