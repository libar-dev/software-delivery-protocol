---
id: spec:model.structural-patterns
kind: model
altitude: feature
readiness: defined
relations:
  refines: spec:model.anchors
  decidedBy: spec:decisions.architectural-significance-rides-primitives
---
# Architecturally significant patterns dissolve into existing primitives

## Intent

- outcome: Patterns and their relationships are authored as decision/model-kind Specs, existing relations, and the satisfies→decidedBy join — no new vocabulary is needed beyond the structural anchors already in the graph.

## Model

- **architecturally significant unit** — a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding.
- **pattern** — not a ratified term — a named coordinate carried by decision/model-kind Specs and their decidedBy edges.
