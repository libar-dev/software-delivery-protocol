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
- assumption: The world has six parents stating `ready`. Five are behaviors and one is a decision. Four example children state `defined`: one behavior parent has no binding, one has a bound `defined` example sibling, one has a direct test binding, and the decision parent has no binding. Two example children state `ready`: one is unbound beside a bound `defined` example sibling, and the other has its own resolving test binding.
- assumption: All probes are story-altitude Specs with declared claims and an Intent outcome, with no other section evidence. Each child declares `verifies` to its resolving parent. A binding is a resolving `test:` Anchor with an anchored `verifies` edge. No other relations or anchors are present except those stated here. Outcome counts read only `conformance/verifies-linkage`, parent `honesty/gaps`, and `conformance/oracle-linkage`; other findings stay outside the counts.
- assumption: The unbound children remain declared, disabled verifiers with no `has-verifier`. The bound `ready` child is a declared, enabled verifier, derives `has-verifier`, and emits no linkage warning. The direct binding, either sibling binding, and the bound `ready` child each confer `has-verifier` on their parent.
- assumption: Only the unbound `ready` child emits a linkage warning, at warning severity in the conformance family, naming its behavior parent as the related Spec. Only the behavior parent with no binding emits a parent gap. The decision parent stays exempt.
- assumption: An `oracle:` Anchor declares an anchored `models` edge to the behavior parent with no binding. That parent owns no example space, so the oracle emits one error naming the oracle as subject and that parent as related Spec.
```gwt
Given the verification posture matrix {matrix: "parent-traces"}
When the reader derives the verification signals
Then the matrix reports {warnings: 1} linkage warnings and {gaps: 1} parent gaps and {oracleErrors: 1} oracle errors
```
