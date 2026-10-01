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
- assumption: The world has three behavior parents stating `defined`, each with one unbound example child, stating `idea`, `scoped`, or `defined`. No parent or child has a test binding or oracle binding.
- assumption: All probes are story-altitude Specs with declared claims and an Intent outcome, with no other section evidence. Each child declares `verifies` to its resolving parent. A binding is a resolving `test:` Anchor with an anchored `verifies` edge. No other relations or anchors are present except those stated here. Outcome counts read only `conformance/verifies-linkage`, parent `honesty/gaps`, and `conformance/oracle-linkage`; other findings stay outside the counts.
- assumption: Every child remains a declared, disabled verifier. Neither child nor parent derives `has-verifier`. No linkage warning, parent gap, or oracle error appears.
```gwt
Given the verification posture matrix {matrix: "lower-rungs"}
When the reader derives the verification signals
Then the matrix reports {warnings: 0} linkage warnings and {gaps: 0} parent gaps and {oracleErrors: 0} oracle errors
```
