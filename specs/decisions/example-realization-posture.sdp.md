---
id: spec:decisions.example-realization-posture
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:model.core-model
  dependsOn: spec:decisions.binding-not-liveness
---
# Example realization stays evidence, not backlog work

## Intent
- outcome: Keep implementation bindings direct while making the operational build backlog name work that can own a realization.

## Decision
- context: The raw `ready ∧ ¬implemented` query includes every ready example whose bound suite verifies its parent even though the example usually owns no implementation site distinct from that parent.
- decision: Ready example Specs are verification evidence and are excluded from the canonical build-backlog recipe; `implemented` remains a direct, anchor-derived delivery fact with no propagation through refinement.
- rationale: Deriving an example's implementation through its parent would introduce an inferred realization claim that no source binding asserted, while adding one anchor per example would turn evidence points into ceremonial implementation sites. Keeping the fact direct preserves the claim boundary and leaves a rare example that genuinely owns a distinct realization free to carry its own code anchor.
- consequence: The unqualified raw `ready ∧ ¬implemented` expression remains literally true but is not the operational backlog definition because it includes example evidence.
- consequence: The canonical backlog recipe and adopter guidance filter out examples and report both the excluded count and any excluded ready example missing verifier evidence.
- consequence: Consumers that hand-roll the raw expression must opt into the example posture explicitly rather than assuming refinement confers implementation.
