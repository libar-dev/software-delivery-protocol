---
id: spec:decisions.verification-posture-not-realization
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:model.spec-sections
  dependsOn: spec:decisions.binding-not-liveness
---
# Verification mode states posture, not realization

## Intent
- outcome: Keep authored verification intent distinct from derived evidence that a verifier exists.

## Decision
- context: A Spec may declare `verification.mode: executable` before any resolving test anchor exists, while the graph already derives enabled-verifier realization from bindings.
- decision: `verification.mode` states the intended verification posture; enabled-verifier realization remains a derived fact and the two are never collapsed.
- rationale: Treating the authored mode as realization would duplicate and weaken the binding-derived fact, while warning on an unrealized posture would turn an intended direction into workflow or content-quality policing.
- consequence: No validator warns merely because `mode: executable` has no enabled verifier.
- consequence: Consumers report the authored mode and derived verifier bindings separately.
