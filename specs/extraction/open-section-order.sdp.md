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
- problem: Canonical serialization sorts the keys of `design`, `ui`, and `model` terms by code unit, and the Design Review sorts them again, so a ten-step sequence reads as step 1, step 10, step 2 and an author's grouping is lost.
- outcome: Carry the authored order of open-section entries and model terms through the serialized graph and the Design Review's key order.

## Rule
- The entry order of `design`, `ui`, and `model` terms is authored content. Extraction keeps it, the serialized graph emits it, the Design Review's fenced JSON follows it for open sections, and the Model table follows it for terms.
- Authored order is a function of the committed source, so two derivations of one commit stay byte-identical. What is given up is invariance under permutation: two carriers that author the same entries in different orders derive different graph bytes, and parity for these sections means the same entries in the same order.
- A key is integer-like when it matches `^(0|[1-9][0-9]*)$`. The Markdown carrier refuses an integer-like Model term with the structure finding `model terms must not be integer-like` and drops the carrier, as it does for every structure refusal; its open-section keys are lower-camel and cannot be integer-like. The TypeScript carrier refuses an integer-like property under `design`, `ui`, or `model.terms` with the finding `extract/unrecognized-property` at severity error, where that finding is otherwise a warning, and the message `property "<key>" is refused: integer-like keys are not accepted in design, ui, or model terms`, dropping that property as it drops a non-static one. The Gherkin carrier has no open section. The owner ruled the refusal over an ordered-list representation; re-measured at `242d8e6`, neither this corpus nor the first adopter's carries such a key.
- With integer-like keys refused, a plain object keeps insertion order, so the representation stays an object and no field shape changes. Authored key order is part of the graph contract: a consumer may rely on the key order of `design`, `ui`, and `model.terms` as the author's order, with `description` first where present.
- The schema version moves from `0.5.0` to `0.6.0`, documented as a change of accepted ids, since the `#` sub-part becomes an entry address, and of ordering semantics, with unchanged field shapes. The serialized graph changes for every Spec whose entries are not already in code-unit order.
- The reader exposes authored order as the key order of a Spec context's `sections.design`, `sections.ui`, and `sections.model.terms`; entry search rows follow it, and no reader method is added.
- This rule is an ordinary revision. No Spec states the sort; it lives in `canonicalDynamicSection` in `src/extract/serialize.ts`, `renderDynamicRecord` in `src/projections/design-review-markdown.ts`, and `renderModel` in `src/projections/design-review-section-content.ts`, which are the realizing sites. The Design Review's encoding rule is untouched; rendering entries as a list is `spec:decisions.authored-entry-order`.
