---
id: spec:decisions.binding-not-liveness
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:model.anchors
---
# Bindings state existence, not liveness

## Intent
- outcome: Make realization signals useful without overstating what source bindings prove.

## Decision
- context: Anchors can resolve code and tests without proving reachability, execution, or approval.
- decision: Delivery facts record bindings and enabled verifier existence; coverage gaps and human readiness practice remain explicit without becoming graph facts.
- rationale: Renaming useful delivery facts or recording approval primitives either weakens drift signals or reverses the one-primitive boundary.
- consequence: Impact reports name coverage-unknown files and `ready` remains a declared statement above a structural floor.
