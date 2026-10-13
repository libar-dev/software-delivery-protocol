---
id: spec:validation.verification-linkage
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:validation.two-check-families
---
# Example verification and oracle bindings resolve honestly

## Intent
- outcome: Keep declared example verification bound to a resolving test anchor, and keep an oracle's expected-outcome binding resolved to its example space.

## Rule
- A declared `verifies` from an example stands as verification evidence only when a resolving test anchor binds that example. An oracle's anchored `models` edge records expected-outcome semantics for a Spec that owns an example space and confers no delivery fact.
- A non-resolving trace confers no delivery fact. Which unbound declared verifiers warn is stated by `spec:validation.unbound-example-posture`; ineligible oracle bindings are reported by the oracle-linkage check.
- At most one expected-outcome authority may model an example space: a second resolving oracle binding on the same space is an error, because two authorities leave the modeled outcome ambiguous.

## Example space
```gwt-vocabulary
Given the graph holds a parent spec {parentId:string}
Given a non-resolving {verifierKind:"example spec"|"oracle anchor"} named {verifierId:string} points at it
Given the example verifier states ready
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the parent earns the delivery fact has-verifier: {conferred:boolean}
```
