---
id: spec:validation.two-check-families
kind: rule
altitude: epic
readiness: ready
relations:
  decidedBy: spec:decisions.one-validation-path
---
# Validation separates well-formedness from non-pretending

## Intent
- outcome: Keep the graph trustworthy by checking conformance and honesty without judging content quality or enforcing workflow.

## Rule
- Every validator the Protocol ships belongs to either the conformance family, which checks meta-model well-formedness, or the honesty family, which rejects authored or overstated derived truth; a corpus's own rules belong to neither family, and `spec:validation.corpus-rules` designs how they run and report.
- Errors from the Protocol's validators fail the build; gaps and orphans remain informative signals rather than delivery-process gates.
- Types check the shape of what is authored in TypeScript, extraction checks every carrier as it reads it, and graph validators check cross-file conformance and honesty; no one layer substitutes for the others.
- All graph validation runs through the one derived graph path: source, extraction, graph, then checks.
- The two families are load-bearing, so an aggregate report spanning both states no family of its own while every finding of the Protocol's own validators names the family it came from.
- [#stableIds] A validator id, once shipped, names one check for good: it is never reused or repurposed, and a new check ships under a new id.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string} at readiness {readiness:"idea"|"ready"}
Given the spec declares a dependsOn relation to the absent target {targetId:string}
When the graph is validated
Then the aggregate report states no family of its own
Then the conformance family reports {conformanceId:string} at severity {conformanceSeverity:"warning"|"error"}
Then the honesty family reports {honestyId:string} at severity {honestySeverity:"warning"|"error"}
```
