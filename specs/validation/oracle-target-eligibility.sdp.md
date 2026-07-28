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

## Design
The validator and reader must continue to share one fail-closed definition of a resolving oracle.
- eligibilityPredicate: `isResolvingOracleModel` accepts an anchored `models` edge from an `oracle:` Anchor to any Primitive that owns `behavior.exampleSpace`; Spec kind does not participate.
- resolutionFlow: `checkOracleLinkage`, delivery-fact derivation, `specContext`, `byFile`, and blast-radius traversal consume the shared predicate rather than restating eligibility.
- failureDiagnostic: A non-resolving candidate says that the target must be a Spec owning an example space; competing-oracle diagnostics name the target as a Spec.
- executableSeams: Validator regressions cover rule-with-space acceptance and missing-space refusal; reader regressions prove the same rule-kind binding resolves through the shared predicate.

## Example space
```gwt-vocabulary
Given the oracle targets a {targetKind:"behavior"|"rule"} spec
Given the target owns an example space: {ownsExampleSpace:boolean}
When oracle linkage is resolved
Then oracle linkage reports {findingCount:number} findings and resolving presence {oraclePresent:boolean}
```
