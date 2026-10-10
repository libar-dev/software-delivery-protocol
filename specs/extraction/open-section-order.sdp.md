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
- problem: Before schema `0.6.0`, canonical serialization sorted the keys of `design`, `ui`, and `model` terms by code unit, and the Design Review sorted them again, so a ten-step sequence read as step 1, step 10, step 2 and an author's grouping was lost.
- outcome: Carry the authored order of open-section entries and model terms through the serialized graph and the Design Review's key order.

## Rule
- The entry order of `design`, `ui`, and `model` terms is authored content. Extraction keeps it, the serialized graph emits it, the Design Review's entry list follows it for open sections, and the Model table follows it for terms.
- Authored order is a function of the committed source, so two derivations of one commit stay byte-identical. What is given up is invariance under permutation: two carriers that author the same entries in different orders derive different graph bytes, and parity for these sections means the same entries in the same order.
- A key is integer-like when it matches `^(0|[1-9][0-9]*)$`. The Markdown carrier refuses an integer-like Model term with the structure finding `model terms must not be integer-like` and drops the carrier, as it does for every structure refusal; its open-section keys are lower-camel and cannot be integer-like. The TypeScript carrier reads each name under `design`, `ui`, or `model.terms` as the key JavaScript gives it. A name written as an identifier or a string is its text, and a numeric name is the string form of its number, so `1e3` is `"1000"`, `0x10` is `"16"`, and `0.0000001` is `"1e-7"`. A property, method, getter, or setter whose key is integer-like is refused with the finding `extract/unrecognized-property` at severity error, where that finding is otherwise a warning, and the message `property "<key>" is refused: integer-like keys are not accepted in design, ui, or model terms`. Each refused member gets one finding whatever its value, and only that member drops; the Spec and its other keys stay. A numeric name whose key is not integer-like, such as `1.5`, drops as a non-static name, as it did before this rule. The Gherkin carrier has no open section. The owner ruled the refusal over an ordered-list representation; re-measured at `242d8e6`, neither this corpus nor the first adopter's carries such a key.
- With integer-like keys refused, a plain object keeps insertion order, so the representation stays an object and no field shape changes. Authored key order is part of the graph contract. The derived graph establishes it, so the reader, the serialized graph, and the Design Review agree. In `design` and `ui` the section's own `description`, its leading prose, comes first, then every other key in authored order. `model.terms` keeps pure authored order, and a term named `description` is an ordinary term, because the Model section's prose lives at `model.description`.
- The schema version moves from `0.5.0` to `0.6.0`, documented as a change of accepted ids, since the `#` sub-part becomes an entry address, and of ordering semantics, with unchanged field shapes. The serialized graph changes for every Spec whose entries are not already in code-unit order.
- The reader exposes authored order as the key order of a Spec context's `sections.design`, `sections.ui`, and `sections.model.terms`; entry search rows follow it, and no reader method is added.
- This rule is an ordinary revision, and no Spec stated the sort it replaced. `canonicalDynamicSection` in `src/extract/serialize.ts`, `renderDynamicRecord` in `src/projections/design-review-markdown.ts`, and `renderModel` in `src/projections/design-review-section-content.ts` are the sites that keep authored order. Rendering entries as a list is a change to the Design Review's encoding rule, ruled by `spec:decisions.authored-entry-order`; this rule supplies only the order the list follows.
