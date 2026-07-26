---
id: spec:validation.verification-linkage.unbound-example
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.verification-linkage
  verifies: spec:validation.verification-linkage
---
# A declared verifier no test binds confers nothing

## Intent
- outcome: Execute the verifies-linkage law where no test anchor completes the spec-to-test trace.

```gwt
Given the graph holds a parent spec {parentId: "spec:probe.create-order"}
Given a non-resolving {verifierKind: "example spec"} named {verifierId: "spec:probe.create-order.valid-cart"} points at it
When the graph is validated
Then the report names {findingId: "conformance/verifies-linkage"} at severity {severity: "warning"}
Then the parent earns the delivery fact has-verifier: {conferred: false}
```
