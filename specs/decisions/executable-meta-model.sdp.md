---
id: spec:decisions.executable-meta-model
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:protocol.self-hosting
---
# The Protocol is an executable meta-model

## Intent
- outcome: Make delivery intent conform to one typed, self-validating contract.

## Decision
- context: Delivery tools can describe work without making their model executable.
- decision: The Protocol models authored Specs, Packs, and anchors in typed code, derives one graph, and checks conformance and honesty.
- rationale: Executable specs alone and workflow tooling omit the meta-model contract.
- consequence: The Protocol is deterministically validated without judging content quality or enforcing workflow.
