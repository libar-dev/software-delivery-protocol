---
id: spec:validation.claim-separation
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:validation.two-check-families
---
# Graph claims and contracts stay distinct

## Intent
- outcome: Preserve the graph's declared, anchored, and inferred distinctions while keeping its typed contracts lawful.

## Rule
- Node and edge types, claims, descriptors, and relation endpoint contracts must use their ratified forms; the claim taxonomy never collapses.
- An unratified descriptor value fails closed: it is a conformance error, and no readiness floor is evaluated over it.
- The realizing validator entrypoint is `checkClaimSeparation` in `src/validate/validators.ts`.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string}
Given the graph carries an off-contract {element:"edge claim"|"descriptor value"} spelled {value:string}
When the graph is validated
Then the report names {findingId:string} at severity {severity:"warning"|"error"}
Then the finding message states {phrase:string}
Then the report holds {floorCount:number} readiness-floor findings
```
