---
id: spec:validation.claim-separation
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:validation.two-check-families
---
# Graph claims and contracts stay distinct

## Intent
- outcome: Preserve the graph's declared, anchored, and inferred distinctions while keeping its typed contracts lawful.

## Rule
- Node and edge types, claims, descriptors, and relation endpoint contracts must use their ratified forms; the claim taxonomy never collapses.
- The realizing validator entrypoint is `checkClaimSeparation` in `src/validate/validators.ts`.
