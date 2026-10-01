---
id: spec:decisions.checked-mentions
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:model.stable-ids
  dependsOn: spec:decisions.content-only-sections
---
# A Spec id written in prose is a checked mention

## Intent
- outcome: Make a Spec id written in prose resolve, and make one keyed entry of an open section addressable, so a reference below the Spec level can be checked.

### Open questions
- [non-blocking] `mention` and `entry address` are candidate terms. They enter the glossary when this record is ratified.

## Decision
- context: Specs name other Specs, and single entries of them, in prose. Referential integrity reads edges and Pack references only. A prose id that does not resolve passes validation, a mention that no relation backs hides a dependent from blast radius, and finding every Spec that repeats an entry is a text search. The first adopter corpus carried its design as keyed entries, and most of its prose mentions had no declared relation.
- decision: A Spec id in narrative or section text, outside `gwt` and `gwt-vocabulary` fences, is a mention. A mention that does not resolve is a conformance error. A mention with no declared relation from its Spec to the target is a warning. An id that adds `#` and a key to a Spec id addresses one keyed entry of that Spec's `design` or `ui` section and resolves when the key exists. A mention mints no edge, and the reader gains no join.
- rationale: The warning asks for a relation that already exists, so linkage keeps one home. Open-section keys are already unique within a Spec and already fit the sub-part form, so the address costs no carrier grammar.
- rationale: This applies the content-only sections ruling rather than contradicting it. A mention mints no edge, so no consumer branches on a reference union, and the warning names exactly the double-linkage drift that ruling calls legal and silent today. The id grammar already parses and formats the sub-part; this record gives it its first meaning.
- alternative: A new edge type for mentions costs the schema, the edge contract, the census, the Mermaid view, and every recipe that filters edges. The warning reaches the same dependents through relations that exist.
- alternative: Leaving the check to each adopter's own lint fixes one corpus and no other.
- alternative: A positional address for an unkeyed bullet, such as the third flow of a Workflow, was refused. Positions move with every edit above them, so such an address would break silently where a key breaks loudly.
- consequence: Only a keyed entry of `design` or `ui` is addressable. A Workflow flow, a Rule or Contract bullet, a Model term, and an open question have no address; a reference to one of them stays a Spec-level mention, and a sequence that must be addressed is authored as keyed entries.
- consequence: A renamed open-section key fails validation in every Spec that addresses it.
- consequence: Blast radius and delta review scope include a mentioning Spec once a declared relation backs its mention.
- consequence: A family pattern written in id form reads as an unresolved mention, so such a pattern is written as plain words.
- consequence: No reference check detects two Specs that restate one shape in their own words. The check narrows that defect class and never closes it.
