---
id: spec:decisions.agent-surface-scripts-graph
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.agent-surface
---
# Agents script the visible graph

## Intent
- outcome: Give agents composable graph context without a fixed command vocabulary becoming the model.

## Decision
- context: Agents need decoded context and entry adapters without rebuilding graph joins.
- decision: The typed graph is the visible contract and agents script it directly through a thin reader surface.
- rationale: A verb wall duplicates graph semantics and hides composable data behind commands.
- consequence: Entry adapters expose curated context while coverage gaps remain explicit rather than implied exhaustive.
