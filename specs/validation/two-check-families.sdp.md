---
id: spec:validation.two-check-families
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
  decidedBy: spec:decisions.one-validation-path
---
# Validation separates well-formedness from non-pretending

## Intent
- outcome: Keep the graph trustworthy by checking conformance and honesty without judging content quality or enforcing workflow.

### Open questions
- [non-blocking] Does the one-validation-path registry law stated in the src/validate/validators.ts file header promote here or to a story-altitude child under comment promotion?

## Rule
- Every validator belongs to either the conformance family, which checks meta-model well-formedness, or the honesty family, which rejects authored or overstated derived truth.
- Validation errors fail the build; gaps and orphans remain informative signals rather than delivery-process gates.
- Types enforce structural shape, schema validates graph payloads, and graph validators enforce cross-file conformance and honesty; no one layer substitutes for the others.
- All graph validation runs through the one derived graph path: source, extraction, graph, then checks.
- The two families are load-bearing, so an aggregate report spanning both states no family of its own while every finding names the family it came from.
- The realizing entrypoints are `graphValidatorIds` and `validateGraph` in `src/validate/validators.ts`.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string} at readiness {readiness:"idea"|"ready"}
Given the spec declares a dependsOn relation to the absent target {targetId:string}
When the graph is validated
Then the aggregate report states no family of its own
Then the conformance family reports {conformanceId:string} at severity {conformanceSeverity:"warning"|"error"}
Then the honesty family reports {honestyId:string} at severity {honestySeverity:"warning"|"error"}
```
