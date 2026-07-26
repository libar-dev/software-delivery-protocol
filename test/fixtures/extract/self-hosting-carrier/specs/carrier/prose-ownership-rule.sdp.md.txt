---
id: spec:carrier.prose-ownership-rule
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
  decidedBy: spec:decisions.prose-ownership
---
# Every prose edge has one owner

## Intent
- outcome: Keep free prose in the graph without ambiguous attachment.

## Rule
- Narrative lives before the first H2 and is owned directly by the Spec; it is Spec content, never an envelope field.
- A description is owned only by a singular section and lives under that section's own heading; the array-shaped constraints section has no description owner, so its explanatory prose belongs in narrative or intent instead.
- Unowned prose — prose standing under no typed owner — is refused loudly rather than attached by guess or dropped in silence.
- Prose is stored as graph content inside its typed owner, never as a file pointer or a heading-path key: a consumer reads prose from the graph without re-parsing the document, and churned document structure carries no identity.
- The realizing entrypoints are `parseMarkdownBody` in `src/extract/markdown-body.ts` and `mapOwner` in `src/extract/markdown-body-owners.ts`.
