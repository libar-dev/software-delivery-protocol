---
id: spec:consumers.projections-model
kind: model
altitude: epic
readiness: ready
relations:
  decidedBy:
    - target: spec:decisions.mcp-deferred
      reason: MCP integration waits for a concrete caller to establish its boundary and contract
    - spec:decisions.shipped-projections-frozen
---
# Projections fan out from one graph without becoming truth stores

## Intent
- outcome: Give agents and humans consumer-specific views while preserving the repository as the only canonical source.

## Model
- **projection** — A pure, disposable, regenerable function of the graph that produces a consumer artifact without becoming a second source of truth.
- **diagnostic publication posture** — After extraction succeeds, a projection publishes its honestly labelled graph view even when validation reports errors, and returns the validation exit code so findings remain both visible and nonzero.
- **curated graph** — The part of the one derived graph that carries declared intent and anchored bindings, kept sparse by curation; the impact graph's inferred structure remains distinct.
- **reader** — The thin typed front door that decodes graph joins and taxonomy once, returns composable data, and persists nothing.
- **curation** — The deliberate difference between the sparse curated graph and the exhaustive code-structure surface `spec:consumers.impact-graph` designs; it is not drift.
- **discipline** — A filter that selects or groups Specs by kind or section; it is not a phase to pass through.
