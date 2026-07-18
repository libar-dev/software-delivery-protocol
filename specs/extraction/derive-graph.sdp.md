---
id: spec:extraction.derive-graph
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
  constrainedBy: spec:extraction.determinism
---
# Carrier reification derives the one graph

## Intent
- outcome: Expose one carrier-neutral derivation seam.

## Behavior
- rule: Carrier reification feeds deriveGraph once; no consumer creates a second graph.
