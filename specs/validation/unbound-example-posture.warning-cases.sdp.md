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
- assumption: The world has one unbound example stating `ready` and 28 non-example children, one for each pairing of behavior, workflow, rule, constraint, model, decision, and contract with `idea`, `scoped`, `defined`, and `ready`. Each child verifies its own behavior parent stating `defined`. No parent or child has a test binding or oracle binding.
- assumption: All probes are story-altitude Specs with declared claims and an Intent outcome, with no other section evidence. Each child declares `verifies` to its resolving parent. A binding is a resolving `test:` Anchor with an anchored `verifies` edge. No other relations or anchors are present except those stated here. Outcome counts read only `conformance/verifies-linkage`, parent `honesty/gaps`, and `conformance/oracle-linkage`; other findings stay outside the counts.
- assumption: Each child remains a declared, disabled verifier and emits one conformance warning whose subject is the child and whose related Spec is its parent. Neither child nor parent derives `has-verifier`. No parent gap or oracle error appears.
```gwt
Given the verification posture matrix {matrix: "warning-cases"}
When the reader derives the verification signals
Then the matrix reports {warnings: 29} linkage warnings and {gaps: 0} parent gaps and {oracleErrors: 0} oracle errors
```
