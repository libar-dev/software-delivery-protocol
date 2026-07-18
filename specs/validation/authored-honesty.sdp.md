---
id: spec:validation.authored-honesty
kind: rule
altitude: feature
readiness: defined
relations:
  refines: spec:validation.two-check-families
---
# Machine truth is never authored

## Intent
- outcome: Keep derived graph truth trustworthy by rejecting any authored substitute for machine-derived claims or facts.

## Rule
- Specs and Packs must not author derived edges, claims, or delivery facts, and any stated delivery facts must equal the graph's recomputed facts.
- The realizing validator entrypoints are `checkAuthoringShape` and `checkDeliveryFacts` in `src/validate/validators.ts`.
