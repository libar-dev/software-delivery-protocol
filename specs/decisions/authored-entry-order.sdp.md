---
id: spec:decisions.authored-entry-order
kind: decision
altitude: feature
readiness: scoped
relations:
  refines: spec:consumers.design-review
  dependsOn:
    - spec:decisions.shipped-projections-frozen
    - spec:extraction.open-section-order
---
# The Design Review renders open-section entries as a list

## Intent
- outcome: Render the entries of an open section as a readable list in authored order, so a signature or a step reads as text and not as an escaped JSON string.

### Open questions
- [blocking] This record changes a stated rule of the Design Review, so it supersedes the shipped-projections freeze for open-section rendering and must pass the ADR three-part test. Does the owner reopen the freeze now, or after `spec:extraction.open-section-order` has landed and the ordered JSON has been read?

## Decision
- context: The Design Review prints an open section as one fenced JSON object, so each entry's value is an escaped string. Authored order is restored by `spec:extraction.open-section-order` as an ordinary revision, because no Spec states the sort. Rendering is different: `spec:consumers.design-review` states that fenced JSON preserves authored keys and values, and the shipped projections are frozen, so a list rendering needs a superseding record. The first adopter corpus carries 762 keyed entries, and its reviewers read the carrier files instead of the review.
- decision: The Design Review renders each entry of a `design` or `ui` section as a list item, its key as inline code and its value as Markdown text, in authored order. The fenced-JSON rule of the Design Review stops covering open sections. The freeze on the four shipped projections stands for everything else.
- rationale: A list reads as the author wrote it and escapes through the prose rules the Design Review already has for every rendered field, where fenced JSON turns a one-line signature into an escaped string nobody can paste.
- alternative: Keeping fenced JSON in authored order makes a sequence readable and leaves every value escaped.
- consequence: The Design Review Spec's encoding rule gains a list case for open sections, and the golden Design Review pages regenerate.
