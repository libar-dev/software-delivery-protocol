---
id: spec:validation.referential-integrity.did-you-mean
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.referential-integrity
  verifies: spec:validation.referential-integrity
---
# A unique near miss earns a did-you-mean suggestion

## Intent
- outcome: Execute the unresolved-reference law where exactly one known id is a near miss.

```gwt
Given the graph holds one spec {presentId: "spec:probe.create-order"}
Given the spec declares a dependsOn relation to {targetId: "spec:probe.create-ordr"}
When the graph is validated
Then the report names {findingId: "conformance/referential-integrity"} at severity {severity: "error"}
Then the finding offers the nearest-id suggestion: {suggested: true}
```
