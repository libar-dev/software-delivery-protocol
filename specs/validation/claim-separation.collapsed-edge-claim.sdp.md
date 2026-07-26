---
id: spec:validation.claim-separation.collapsed-edge-claim
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.claim-separation
  verifies: spec:validation.claim-separation
---
# A binding edge cannot borrow the declared claim

## Intent
- outcome: Execute the edge-contract law where a satisfies edge carries the authored claim.

```gwt
Given the graph holds a spec {specId: "spec:probe.create-order"}
Given the graph carries an off-contract {element: "edge claim"} spelled {value: "declared"}
When the graph is validated
Then the report names {findingId: "conformance/claim-separation"} at severity {severity: "error"}
Then the finding message states {phrase: "never collapsed"}
Then the report holds {floorCount: 0} readiness-floor findings
```
