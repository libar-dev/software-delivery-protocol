---
id: spec:decisions.executable-meta-model
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
---
# The Protocol is an executable meta-model

## Intent
- outcome: Make delivery intent conform to one typed, self-validating contract.

## Decision
- context: Delivery tools can describe work without making their model executable.
- decision: The Protocol models authored Specs, Packs, and anchors in typed code, derives one graph, and checks conformance and honesty.
- rationale: Gen 1's failure was dual-source binding hidden from the type system, not executability itself; the typed meta-model removes that hidden truth path while allowing executability to return as a recovered surface.
- consequence: The Protocol is deterministically validated without judging content quality or enforcing workflow.
