---
id: spec:decisions.adopt-the-nouns
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
---
# Delivery nouns remain familiar without workflow gates

## Intent
- outcome: Keep the Protocol legible to delivery practitioners without adopting a lifecycle machine.

## Decision
- context: Shared delivery vocabulary is useful, but process-state language hides epistemic distinctions.
- decision: The Protocol adopts established delivery nouns and rejects process state-machine and lifecycle gating.
- rationale: Invented terminology taxes users, while workflow states reverse the Protocol's conformance-only boundary.
- consequence: Terms must be concrete, unambiguous, and carry authored-versus-derived status where it matters.
