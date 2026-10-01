---
id: spec:validation.verification-linkage
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:validation.two-check-families
---
# Declared verification resolves to a performing trace

## Intent
- outcome: Keep verification relationships meaningful by requiring declared test and oracle traces to resolve to their enabled bindings.

## Rule
- A declared verifies relation and an oracle model relation must resolve through their respective binding traces before either can stand as verification evidence.
- A non-resolving trace confers no delivery fact. The verifies-linkage warning names an unbound example only when it states `ready`, and names a non-example Spec that declares `verifies` at every rung. The oracle-linkage check continues to name a non-resolving oracle trace.
- At most one expected-outcome authority may model an example space: a second resolving oracle binding on the same space is an error, because two authorities leave the modeled outcome ambiguous.
- The realizing validator entrypoints are `checkVerifiesLinkage` and `checkOracleLinkage` in `src/validate/validators.ts`.

## Example space
```gwt-vocabulary
Given the graph holds a parent spec {parentId:string}
Given a non-resolving {verifierKind:"example spec"|"oracle anchor"} named {verifierId:string} points at it
Given the example verifier states ready
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the parent earns the delivery fact has-verifier: {conferred:boolean}
```
