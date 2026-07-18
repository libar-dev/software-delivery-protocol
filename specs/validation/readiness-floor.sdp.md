---
id: spec:validation.readiness-floor
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
  dependsOn: spec:model.protocol-domain
  decidedBy:
    - spec:decisions.kind-conditional-floor
    - spec:decisions.carried-evidence
---
# Stated readiness must clear its floor

## Intent
- outcome: Refuse maturity claims that their authored evidence does not support.

## Rule
- A Spec may state a readiness only when every clause in that readiness floor passes.
