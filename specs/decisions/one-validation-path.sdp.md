---
id: spec:decisions.one-validation-path
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:validation.two-check-families
---
# Validation follows one graph

## Intent
- outcome: Keep conformance and honesty checks aligned with the source the graph actually represents.

## Decision
- context: Source can be statically reified without matching what an executing import would evaluate.
- decision: Validators consume the derived graph through one path: source, extraction, graph, then checks.
- rationale: A parallel import-time validation path can approve values absent from the graph.
- consequence: Typed authoring feedback and extraction findings remain distinct from graph validation rather than becoming a second validator.
