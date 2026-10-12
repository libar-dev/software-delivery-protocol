---
id: spec:carrier.prose-ownership-rule
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
  dependsOn:
    - spec:carrier.markdown-body-grammar
    - spec:model.relation-reasons
    - spec:model.open-question-fields
  decidedBy: spec:decisions.prose-ownership
---
# Every prose value has one typed owner

## Intent
- outcome: Keep free prose in the graph without ambiguous attachment.

## Rule
- Narrative lives before the first H2 and is owned directly by the Spec; it is Spec content, never an envelope field.
- A description belongs to one typed section; under `spec:carrier.markdown-body-grammar`, the primary behavior heading and Example space share the behavior section's one description, so leading prose may occur under either, never both. Constraints has no description owner; its explanatory prose belongs in narrative or Intent.
- Unowned prose — prose standing under no typed owner — is refused loudly rather than attached by guess or dropped in silence.
- Prose is graph content inside its typed owner, never a file pointer or a heading-path key: a consumer reads prose from the graph without re-parsing the document, and churned document structure carries no identity.
- Additional typed prose owners are stated by `spec:model.relation-reasons` for a relation's reason and `spec:model.open-question-fields` for a question's provisional and trigger lines.
