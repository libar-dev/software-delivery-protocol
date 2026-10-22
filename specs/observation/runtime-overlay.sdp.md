---
id: spec:observation.runtime-overlay
kind: behavior
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:extraction.derive-graph
    reason: an observed fact would be derived beside implemented and has-verifier
  dependsOn: spec:model.core-model
---
# Runtime observations can close the liveness loop

## Intent
- outcome: Associate runtime evidence with measurable Spec targets without turning operational payloads into authored model truth.

### Open questions
- [blocking #observationIdentity] Which external observation identity and freshness boundary is small enough for the graph while still supporting an honest `observed` delivery fact?
  - decider: owner
  - trigger: An adopter needs runtime measurements linked to measurable Spec targets and can supply an observation identity and freshness policy for review.
