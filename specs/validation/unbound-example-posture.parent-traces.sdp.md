---
id: spec:validation.unbound-example-posture.parent-traces
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.unbound-example-posture
  verifies: spec:validation.unbound-example-posture
---
# Parent gaps follow enabled bindings and preserve the decision exemption

## Intent
- outcome: Check parent gaps with no binding, a sibling binding, and a direct binding, the decision exemption, a ready child warning, and an unresolved oracle.
```gwt
Given the verification posture matrix {matrix: "parent-traces"}
When the reader derives the verification signals
Then the matrix reports {warnings: 1} linkage warnings and {gaps: 1} parent gaps and {oracleErrors: 1} oracle errors
```
