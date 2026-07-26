---
id: spec:validation.verification-linkage.unresolved-oracle
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.verification-linkage
  verifies: spec:validation.verification-linkage
---
# An oracle with no example space to model confers nothing

## Intent
- outcome: Execute the oracle-linkage law where the modeled spec owns no example space.

```gwt
Given the graph holds a parent spec {parentId: "spec:probe.order-policy"}
Given a non-resolving {verifierKind: "oracle anchor"} named {verifierId: "oracle:probe.order-policy"} points at it
When the graph is validated
Then the report names {findingId: "conformance/oracle-linkage"} at severity {severity: "error"}
Then the parent earns the delivery fact has-verifier: {conferred: false}
```
