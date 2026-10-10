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
- A Pack's members list and its belongsTo edges agree: every listed member has one belongsTo edge into the Pack, and every belongsTo edge into the Pack comes from a listed member. A listed member with no edge, a listed member that is no Spec and no edge carries, and an edge from an unlisted source are each one error, in authored order, so the Pack context, a Spec's packs, and blast radius read the same membership. An edge whose source is absent or no Spec stays referential integrity's or the edge contract's finding, never a second one here.
- There is no duplicated-intent check on a Pack: a Pack states no system truth to duplicate, and semantic overlap among its members remains human or agent review rather than validator judgment. This lets a coherent group contain low-detail Specs without turning grouping into implementation demand.
- The realizing validator entrypoint is `checkPackCoherence` in `src/validate/validators.ts`.

## Example space
```gwt-vocabulary
Given a pack {packId:string} lists the spec {specId:string} {memberCount:number} times
Given the pack also names that spec as a modelRef
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the report holds {findingCount:number} pack-coherence findings
```
