---
id: spec:validation.unbound-example-posture.warning-cases
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.unbound-example-posture
  verifies: spec:validation.unbound-example-posture
---
# Ready examples and non-example verifiers keep warnings

## Intent
- outcome: Check an unbound ready example and every non-example kind at every rung.
```gwt
Given the verification posture matrix {matrix: "warning-cases"}
When the reader derives the verification signals
Then the matrix reports {warnings: 29} linkage warnings and {gaps: 0} parent gaps and {oracleErrors: 0} oracle errors
```
