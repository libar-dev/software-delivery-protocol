---
id: spec:decisions.pack-reified
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:model.pack-aggregate
---
# Packs group review context without becoming truth

## Intent
- outcome: Let related Specs be reviewed together without introducing another truth-bearing artifact.

## Decision
- context: Delivery work needs a cross-cutting aggregate that is distinct from refinement.
- decision: A Pack declares membership and framing while stating no system truth; Specs may belong to many Packs.
- rationale: Treating a Pack as a truth primitive or a refinement parent confuses grouping with authored intent.
- consequence: Review context remains disposable while Spec relations retain semantic hierarchy.
