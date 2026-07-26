---
id: spec:validation.authored-honesty.unearned-stated-fact
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.authored-honesty
  verifies: spec:validation.authored-honesty
---
# A stated delivery fact no binding earns is refused

## Intent
- outcome: Execute the delivery-fact refusal where the stated array outruns the recomputed facts.

```gwt
Given the graph holds a spec {specId: "spec:probe.unearned-fact"}
Given the spec hand-authors the delivery fact {factName: "has-verifier"} at {site: "the node deliveryFacts array"}
When the graph is validated
Then the report names {findingId: "honesty/delivery-facts"} at severity {severity: "error"}
Then the finding names the fact {relatedId: "has-verifier"} and states {phrase: "derived, never authored"}
```
