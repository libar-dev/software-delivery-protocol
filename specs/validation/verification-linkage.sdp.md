---
id: spec:validation.verification-linkage
kind: rule
altitude: feature
readiness: defined
relations:
  refines: spec:validation.two-check-families
---
# Declared verification resolves to a performing trace

## Intent
- outcome: Keep verification relationships meaningful by requiring declared test and oracle traces to resolve to their enabled bindings.

## Rule
- A declared verifies relation and an oracle model relation must resolve through their respective binding traces before either can stand as verification evidence.
- The realizing validator entrypoints are `checkVerifiesLinkage` and `checkOracleLinkage` in `src/validate/validators.ts`.
