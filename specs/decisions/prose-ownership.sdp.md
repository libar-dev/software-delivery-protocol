---
id: spec:decisions.prose-ownership
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.prose-ownership-rule
---
# Prose belongs to typed graph owners

## Intent
- outcome: Preserve free prose for projections without making its attachment ambiguous or forcing consumers to re-parse files.

## Decision
- context: Document prose needs a stable graph home when section structure evolves.
- decision: Free prose is stored as a narrative or a description on its typed owner; unowned prose is refused.
- rationale: File pointers force consumer re-parsing, while heading-path keys make churned document structure carry identity.
- consequence: Prose remains graph content inside typed shapes and ambiguous attachment fails loudly.
