---
id: spec:decisions.carried-evidence
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:validation.readiness-floor
  dependsOn:
    - spec:decisions.kind-conditional-floor
    - spec:decisions.content-only-sections
---
# Promoted evidence must carry its own evidence

## Intent
- outcome: Prevent empty promoted Specs and relation targets from satisfying an evidence floor.

## Decision
- context: Promotion and constraints preserve meaning only when the promoted target carries the matching kind evidence.
- decision: Promoted evidence counts only when the promoted Spec holds its natural evidence; authoring-shape honesty rejects authored delivery facts and external `doc:` targets remain deferred.
- rationale: Counting empty children or wrong-kind constraints makes a structural floor pass without content, while readiness gates and premature external target types add the wrong contract.
- consequence: The floor checks resolved target shape, and unresolved external decision links stay outside the current relation grammar.
