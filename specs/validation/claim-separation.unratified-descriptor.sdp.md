---
id: spec:validation.claim-separation.unratified-descriptor
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.claim-separation
  verifies: spec:validation.claim-separation
---
# An unratified kind fails closed instead of reaching the floor

## Intent
- outcome: Execute the descriptor law where a foreign producer states a kind the model never ratified.

```gwt
Given the graph holds a spec {specId: "spec:probe.create-order"}
Given the graph carries an off-contract {element: "descriptor value"} spelled {value: "saga"}
When the graph is validated
Then the report names {findingId: "conformance/claim-separation"} at severity {severity: "error"}
Then the finding message states {phrase: "outside the ratified descriptor values"}
Then the report holds {floorCount: 0} readiness-floor findings
```
