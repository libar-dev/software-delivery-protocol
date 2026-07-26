---
id: spec:validation.referential-integrity.dangling-target
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.referential-integrity
  verifies: spec:validation.referential-integrity
---
# An unrelated missing target is a bare conformance error

## Intent
- outcome: Execute the unresolved-reference law where no known id is near the missing one.

```gwt
Given the graph holds one spec {presentId: "spec:probe.create-order"}
Given the spec declares a dependsOn relation to {targetId: "spec:probe.fulfilment-policy"}
When the graph is validated
Then the report names {findingId: "conformance/referential-integrity"} at severity {severity: "error"}
Then the finding offers the nearest-id suggestion: {suggested: false}
```
