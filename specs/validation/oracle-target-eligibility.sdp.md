---
id: spec:validation.oracle-target-eligibility
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:validation.verification-linkage
  dependsOn: spec:model.anchors
---
# Oracle eligibility follows example-space ownership

## Intent
- outcome: Let an expected-outcome oracle model any Spec whose own law defines an example space, regardless of Spec kind.

## Rule
- Oracle target eligibility follows ownership of an example space, not a behavior-kind check.
- A resolving binding is an anchored `models` edge from an `oracle:` Anchor to a Spec that owns an example space.
- Missing targets, wrong namespaces, absent example spaces, and competing oracles remain fail-closed refusals.
- Validators and graph readers consume the same eligibility result.

## Example space
```gwt-vocabulary
Given the oracle targets a {targetKind:"behavior"|"rule"} spec
Given the target owns an example space: {ownsExampleSpace:boolean}
When oracle linkage is resolved
Then oracle linkage reports {findingCount:number} findings and resolving presence {oraclePresent:boolean}
```
