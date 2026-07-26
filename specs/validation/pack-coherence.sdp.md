---
id: spec:validation.pack-coherence
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:validation.two-check-families
---
# Packs are coherent aggregates

## Intent
- outcome: Keep review aggregates coherent without treating them as truth-bearing delivery artifacts.

## Rule
- Pack membership must not repeat a Spec, and every modelRef must resolve to a model-kind Spec.
- Membership is counted on the derived belongsTo edges the manifest re-expresses, so a repeated manifest entry is named once per repeated member.
- The realizing validator entrypoint is `checkPackCoherence` in `src/validate/validators.ts`.

## Example space
```gwt-vocabulary
Given a pack {packId:string} lists the spec {specId:string} {memberCount:number} times
Given the pack also names that spec as a modelRef
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the report holds {findingCount:number} pack-coherence findings
```
