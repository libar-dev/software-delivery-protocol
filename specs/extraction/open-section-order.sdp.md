---
id: spec:extraction.open-section-order
kind: rule
altitude: story
readiness: scoped
relations:
  refines: spec:extraction.derive-graph
---
# Serialization preserves authored entry order

## Intent
- problem: Canonical serialization sorts the keys of `design`, `ui`, and `model` terms by code unit, and the Design Review sorts them again, so a ten-step sequence reads as step 1, step 10, step 2 and an author's grouping is lost.
- outcome: Carry the authored order of open-section entries and model terms through the serialized graph and the Design Review's key order.

### Open questions
- [blocking] The in-memory graph holds these entries as plain objects, so an integer-like key already loses its place before serialization. Markdown `design` and `ui` keys are lower-camel and cannot be integer-like, but a Model term and a TypeScript open-section key can. Either the carriers refuse an integer-like key in those positions, or the representation becomes an ordered list. Which?

## Rule
- The entry order of `design`, `ui`, and `model` terms is authored content. Extraction keeps it, the serialized graph emits it, the Design Review's fenced JSON follows it for open sections, and the Model table follows it for terms.
- Authored order is a function of the committed source, so two derivations of one commit stay byte-identical. What is given up is invariance under permutation: two carriers that author the same entries in different orders derive different graph bytes, and parity for these sections means the same entries in the same order.
- The serialized graph changes for every Spec whose entries are not already in code-unit order, so the schema version moves and the golden trees regenerate.
- This rule is an ordinary revision. No Spec states the sort; it lives in `canonicalDynamicSection` in `src/extract/serialize.ts`, `renderDynamicRecord` in `src/projections/design-review-markdown.ts`, and `renderModel` in `src/projections/design-review-section-content.ts`, which are the realizing sites. The Design Review's encoding rule is untouched; rendering entries as a list is `spec:decisions.authored-entry-order`.
