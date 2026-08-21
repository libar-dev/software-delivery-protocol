---
id: spec:consumers.projections-model
kind: model
altitude: feature
readiness: defined
relations:
  refines: spec:protocol.self-hosting
  decidedBy: spec:decisions.mcp-deferred
---
# Projections fan out from one graph without becoming truth stores

## Intent
- outcome: Give agents and humans consumer-specific views while preserving the repository as the only canonical source.

### Open questions
- [non-blocking] Does the pure-projection binding-language law stated in src/projections/design-review.ts commentary promote here or to a story-altitude child under comment promotion?

## Model
- **projection** — A pure, disposable, regenerable function of the graph that produces a consumer artifact without becoming a second source of truth.
- **diagnostic publication posture** — After extraction succeeds, a projection publishes its honestly labelled graph view even when validation reports errors, and returns the validation exit code so findings remain both visible and nonzero.
- **curated graph** — The authored architectural read model of declared intent and anchored bindings, valued for editorial sparsity.
- **impact graph** — A separately derived code-structure surface for exhaustive usage and blast-radius questions, valued for exhaustiveness and never promoted into architecture.
- **reader** — The thin typed front door that decodes graph joins and taxonomy once, returns composable data, and persists nothing.
- **curation** — The deliberate difference between the sparse curated graph and the code-structure surface; it is not drift.
- **measured curation** — In a measured comparison, the curated graph selected from single-digit to about one quarter of the mechanical impact-graph surface.
- **discipline** — A lens or projection that filters or groups Specs by kind or section; it is not a phase to pass through.
- **release** — A tagged set surfaced as a git-tag projection.
- **baseline** — A named approved snapshot whose signed git tag is the approval artifact, with approval remaining outside the authored model.
- **phase / iteration / milestone** — Descriptive vocabulary for optional roadmap projections, never gates or enforced sequences.
