---
id: spec:validation.referential-integrity
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:validation.two-check-families
---
# Every graph reference resolves

## Intent
- outcome: Keep derived graph relationships trustworthy by refusing references to absent nodes.

## Rule
- Every edge endpoint and every Pack model reference must resolve to a node in the derived graph; an unresolved reference is a conformance error.
- The realizing validator entrypoint is `checkReferentialIntegrity` in `src/validate/validators.ts`.
