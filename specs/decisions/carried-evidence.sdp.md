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
- decision: Promoted evidence counts only when the promoted Spec carries its own kind's natural evidence.
- rationale: Counting an empty promoted child or a wrong-kind constraint would clear the evidence floor without the content it is meant to require.
- consequence: The floor checks resolved target shape, and unresolved external decision links stay outside the relation grammar.
- consequence: Authoring-shape honesty rejects authored delivery facts.
- consequence: External `doc:` targets remain deferred until a corpus needs a relation to a decision recorded outside the graph.
