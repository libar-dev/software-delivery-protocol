---
id: spec:extraction.open-section-order
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:extraction.derive-graph
---
# Serialization preserves authored entry order

## Intent
- problem: Canonical serialization and the Design Review sort the keys of `design`, `ui`, and `model` terms by code unit, so a ten-step sequence reads as step 1, step 10, step 2 and an author's grouping is lost, while the in-memory graph keeps the authored order.
- outcome: Carry the authored order of open-section entries and model terms through the serialized graph and the Design Review's key order.

## Rule
- The entry order of `design`, `ui`, and `model` terms is authored content. Extraction keeps it, the serialized graph emits it, and the Design Review's fenced JSON follows it.
- Authored order is a function of the committed source, so two derivations of one commit stay byte-identical. The sort guarded against property-order nondeterminism, and the lower-camel key rule already removes that: no key is integer-like, so both carriers hold keys in insertion order.
- Two carriers that author the same entries in different orders derive different graph bytes. Parity for an open section means the same entries in the same order.
- The serialized graph changes for every Spec with an open section or model terms, so the schema version moves and the golden trees regenerate.
- This rule is an ordinary revision. No Spec states the sort; it lives in `canonicalDynamicSection` in `src/extract/serialize.ts` and `renderDynamicRecord` in `src/projections/design-review-markdown.ts`, which are the realizing sites. The Design Review's encoding rule is untouched; rendering entries as a list is `spec:decisions.authored-entry-order`.
