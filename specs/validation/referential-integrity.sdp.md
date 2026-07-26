---
id: spec:validation.referential-integrity
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:validation.two-check-families
---
# Every graph reference resolves

## Intent
- outcome: Keep derived graph relationships trustworthy by refusing references to absent nodes.

## Rule
- Every edge endpoint and every Pack model reference must resolve to a node in the derived graph; an unresolved reference is a conformance error.
- The finding names the unique nearest known id as a suggestion and stays silent when two candidates tie, because resolving ambiguity silently is never the check's job.
- The realizing validator entrypoint is `checkReferentialIntegrity` in `src/validate/validators.ts`.

## Example space
```gwt-vocabulary
Given the graph holds one spec {presentId:string}
Given the spec declares a dependsOn relation to {targetId:string}
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the finding offers the nearest-id suggestion: {suggested:boolean}
```
