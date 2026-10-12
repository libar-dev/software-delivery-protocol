---
id: spec:validation.authored-honesty
kind: rule
altitude: feature
readiness: ready
relations:
  dependsOn: spec:extraction.delivery-facts
  refines: spec:validation.two-check-families
  decidedBy: spec:decisions.binding-not-liveness
---
# Machine truth is never authored

## Intent
- outcome: Keep derived graph truth trustworthy by rejecting any authored substitute for a derived edge or delivery fact.

## Rule
- Specs and Packs author no derived edge or delivery fact.
- A Primitive node's `deliveryFacts` equals the facts the one derivation recomputes from the graph.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string}
Given the spec hand-authors the delivery fact {factName:"implemented"|"has-verifier"} at {site:"a behavior section carrier"|"the node deliveryFacts array"}
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the finding names the fact {relatedId:string} and states {phrase:string}
```
