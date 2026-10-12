---
id: spec:extraction.open-section-order
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:extraction.derive-graph
---
# Serialization preserves authored entry order

Integer-like keys are refused rather than carried in an ordered list: JavaScript orders integer-like object keys before all others, so a plain object keeps authored order only when no key is integer-like.

## Intent
- problem: Sorting entries by code unit loses the author's sequence and grouping.
- outcome: Carry the authored order of open-section entries and model terms through the serialized graph and the Design Review's key order.

## Rule
- The entry order of `design`, `ui`, and `model` terms is authored content. Extraction keeps it, the serialized graph emits it, the Design Review's entry list follows it for open sections, and the Model table follows it for terms.
- Authored order is a function of the committed source, so two derivations of one commit stay byte-identical. What is given up is invariance under permutation: two carriers that author the same entries in different orders derive different graph bytes, and parity for these sections means the same entries in the same order.
- [#integerLikeKey] A key is integer-like when it matches `^(0|[1-9][0-9]*)$`; `design`, `ui` and `model.terms` refuse such keys in every carrier that carries those sections.
- The Markdown carrier refuses an integer-like Model term with the structure finding `model terms must not be integer-like` and drops the carrier. Its lower-camel Design and UI keys cannot be integer-like. Gherkin carries no open section.
- The TypeScript carrier reads identifier and string names as their text and numeric names as JavaScript's string form of the number, so `1e3` becomes `"1000"`, `0x10` becomes `"16"`, and `0.0000001` becomes `"1e-7"`.
- The TypeScript carrier refuses each integer-like property, method, getter or setter with one `extract/unrecognized-property` error regardless of value, with the message `property "<key>" is refused: integer-like keys are not accepted in design, ui, or model terms`. Only that member drops; the Spec and other keys remain.
- A non-integer numeric name such as `1.5` drops as a non-static name.
- With integer-like keys refused, a plain object keeps insertion order, so the representation stays an object and no field shape changes. Authored key order is part of the graph contract. The derived graph establishes it, so the reader, the serialized graph, and the Design Review agree. In `design` and `ui` the section's own `description`, its leading prose, comes first, then every other key in authored order. `model.terms` keeps pure authored order, and a term named `description` is an ordinary term, because the Model section's prose lives at `model.description`.
- The reader exposes authored order as the key order of a Spec context's `sections.design`, `sections.ui`, and `sections.model.terms`; entry search rows follow it, and no reader method is added.
- Rendering open-section entries as a list follows the authored-entry-order decision; this Spec supplies the order the list follows.
