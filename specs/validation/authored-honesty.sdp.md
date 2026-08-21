---
id: spec:validation.authored-honesty
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:validation.two-check-families
  decidedBy: spec:decisions.binding-not-liveness
---
# Machine truth is never authored

## Intent
- outcome: Keep derived graph truth trustworthy by rejecting any authored substitute for machine-derived claims or facts.

## Rule
- Specs and Packs must not author derived edges, claims, or delivery facts, and any stated delivery facts must equal the graph's recomputed facts.
- The realizing validator entrypoints are `checkAuthoringShape` and `checkDeliveryFacts` in `src/validate/validators.ts`.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string}
Given the spec hand-authors the delivery fact {factName:"implemented"|"has-verifier"} at {site:"a behavior section carrier"|"the node deliveryFacts array"}
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the finding names the fact {relatedId:string} and states {phrase:string}
```
