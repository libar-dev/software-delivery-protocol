---
id: spec:decisions.protocol-naming
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
---
# The meta-model is a software delivery protocol

## Intent
- outcome: Name the product and its meta-layer without implying workflow control.

## Decision
- context: The meta-layer needs a name that communicates a conformance contract rather than a process engine.
- decision: The product is the Libar Software Delivery Protocol, shortened to the Protocol; `sdp` names its CLI.
- rationale: Protocol names an executable conformance contract more honestly than process while retaining process for the modeled activity.
- consequence: Product, package, repository, and CLI names stay aligned around the Protocol.
