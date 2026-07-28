---
id: spec:validation.oracle-target-eligibility
kind: rule
altitude: story
readiness: scoped
relations:
  refines: spec:validation.verification-linkage
  dependsOn: spec:model.anchors
---
# Oracle eligibility follows example-space ownership

## Intent
- outcome: Let an expected-outcome oracle model any Spec whose own law defines an example space, regardless of Spec kind.

### Open questions
- [blocking] Which shared resolution predicate and diagnostic seam must change so validator and reader consumers stay fail-closed together?

## Rule
- Oracle target eligibility follows ownership of an example space, not a behavior-kind check.

## Example space
```gwt-vocabulary
Given the oracle targets a {targetKind:"behavior"|"rule"} spec
Given the target owns an example space: {ownsExampleSpace:boolean}
When oracle linkage is resolved
Then the report contains {findingCount:number} oracle-linkage findings
Then a resolving oracle is present: {oraclePresent:boolean}
```
