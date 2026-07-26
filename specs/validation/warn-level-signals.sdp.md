---
id: spec:validation.warn-level-signals
kind: rule
altitude: feature
readiness: defined
relations:
  refines: spec:validation.two-check-families
---
# Missing connective evidence warns without failing

## Intent
- outcome: Surface graph conditions that need attention without turning informative delivery signals into workflow gates.

## Rule
- Orphaned Specs and ready Specs lacking a resolving verifier are warnings, not validation errors.
- The realizing validator entrypoints are `checkOrphans` and `checkGaps` in `src/validate/validators.ts`.
