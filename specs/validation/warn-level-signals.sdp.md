---
id: spec:validation.warn-level-signals
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:validation.two-check-families
  decidedBy: spec:decisions.decision-readiness-posture
---
# Missing connective evidence warns without failing

## Intent
- outcome: Surface graph conditions that need attention without turning informative delivery signals into workflow gates.

## Rule
- Orphaned Specs and ready Specs lacking a resolving verifier are warnings, not validation errors.
- The gap signal excludes kind `decision`.
- The gap signal reads the delivery facts the one derivation recomputes from the graph, never the `deliveryFacts` a node carries, so a hand-authored fact cannot silence it.
- The Protocol fixes the severity of these signals; no validator reads a per-team setting.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string} at readiness {readiness:"idea"|"ready"}
Given the spec declares {relations:"no relation"|"a decidedBy decision"}
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the report holds {errorCount:number} errors
```
