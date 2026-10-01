---
id: spec:validation.unbound-example-posture.lower-rungs
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.unbound-example-posture
  verifies: spec:validation.unbound-example-posture
---
# Below-ready examples keep declared verifier data

## Intent
- outcome: Check all three lower rungs without enabling an unbound example.
```gwt
Given the verification posture matrix {matrix: "lower-rungs"}
When the reader derives the verification signals
Then the matrix reports {warnings: 0} linkage warnings and {gaps: 0} parent gaps and {oracleErrors: 0} oracle errors
```
