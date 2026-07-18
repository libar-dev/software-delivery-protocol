---
id: spec:consumers.projections-model
kind: model
altitude: feature
readiness: defined
relations:
  refines: spec:protocol.self-hosting
---
# Projections fan out from one graph without becoming truth stores

## Intent
- outcome: Give agents and humans consumer-specific views while preserving the repository as the only canonical source.

## Model
- **projection** — A pure, disposable, regenerable function of the graph that produces a consumer artifact without becoming a second source of truth.
- **curated graph** — The authored architectural read model of declared intent and anchored bindings, valued for editorial sparsity.
- **impact graph** — A separately derived code-structure surface for exhaustive usage and blast-radius questions, valued for exhaustiveness and never promoted into architecture.
- **reader** — The thin typed front door that decodes graph joins and taxonomy once, returns composable data, and persists nothing.
- **curation** — The deliberate difference between the sparse curated graph and the code-structure surface; it is not drift.
