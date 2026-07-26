---
id: spec:validation.warn-level-signals
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:validation.two-check-families
---
# Missing connective evidence warns without failing

## Intent
- outcome: Surface graph conditions that need attention without turning informative delivery signals into workflow gates.

## Rule
- Orphaned Specs and ready Specs lacking a resolving verifier are warnings, not validation errors.
- The gap signal reads the delivery facts the one derivation rule recomputes from the graph, never the facts a Spec states, so a hand-authored fact can never silence it.
- The realizing validator entrypoints are `checkOrphans` and `checkGaps` in `src/validate/validators.ts`.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string} at readiness {readiness:"idea"|"ready"}
Given the spec declares {relations:"no relation"|"a decidedBy decision"}
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the report holds {errorCount:number} errors
```
