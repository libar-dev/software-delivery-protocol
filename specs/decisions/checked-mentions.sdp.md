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
- [non-blocking] `mention` and `entry address` are candidate terms, defined in the glossary's flagged list. They move into the ratified tables when this record states `ready`.

## Decision
- context: Specs name other Specs, and single entries of them, in prose. Referential integrity reads edges and Pack references only. A prose id that does not resolve passes validation, a mention that no relation backs hides a dependent from blast radius, and finding every Spec that repeats an entry is a text search. The first adopter corpus carried its design as keyed entries, and most of its prose mentions had no declared relation.
- decision: A Spec id in narrative or section text, outside `gwt` and `gwt-vocabulary` fences, is a mention. A mention that does not resolve is a conformance error. A mention of a Spec that shares no declared relation with the mentioning Spec, in either direction, is one warning per mentioning Spec and target Spec pair, whatever the number of locations. An entry address is a Spec id followed by `#`, the section name `design` or `ui`, a dot, and the entry's lower-camel ASCII key, as in `spec:<id>#design.<key>`; it addresses one keyed entry of that Spec and resolves when the Spec exists and the key is present in that section. The `#` sub-part is reserved for the entry address in every namespace: a Spec's own id, a relation target, a Pack member or model reference, an anchor id or target, and the `specId` and `ref` builders all refuse it. A mention mints no edge, and the reader gains no join.
- rationale: The warning asks for a relation that already exists, so linkage keeps one home. A relation in either direction backs a mention because blast radius walks its one hop both ways, so a reverse edge already surfaces the dependent. One warning per pair keeps the report readable where a Spec names one neighbor in many bullets, and the mention audit keeps every location.
- rationale: This applies the content-only sections ruling rather than contradicting it. A mention mints no edge, so no consumer branches on a reference union, and the warning names exactly the double-linkage drift that ruling calls legal and silent today. The id grammar already parses and formats a `#` sub-part; this record gives it its only meaning, and the dot inside the sub-part is the one grammar change.
- rationale: The owner ruled that the address carries the section, because open-section keys are unique within a section and not within a Spec, so `spec:<id>#design.shared` and `spec:<id>#ui.shared` stay distinct when one carrier holds both; that `#` is refused in every identity, because neither this corpus nor the first adopter's carries one, re-measured as zero in both at `242d8e6`, and one meaning per sub-part keeps resolution a lookup instead of a precedence rule; and that one lower-camel key grammar serves every carrier, so an address is typeable from memory and a lawful TypeScript key outside it is simply unaddressable.
- alternative: A new edge type for mentions costs the schema, the edge contract, the census, the Mermaid view, and every recipe that filters edges. The warning reaches the same dependents through relations that exist.
- alternative: Leaving the check to each adopter's own lint fixes one corpus and no other.
- alternative: A positional address for an unkeyed bullet, such as the third flow of a Workflow, was refused. Positions move with every edit above them, so such an address would break silently where a key breaks loudly.
- alternative: Refusing a key that appears under both Design and UI would shorten the address and make one section's keys depend on the other's. Refused by the owner.
- alternative: Letting an identity with `#` outrank an address would keep today's grammar and make every address resolution a two-step lookup for a case no corpus has. Refused by the owner.
- alternative: Warning only on a missing forward relation would turn a parent's mention of its own child into a finding the child's `refines` edge already answers. Refused by the owner.
- consequence: Only a keyed entry of `design` or `ui` is addressable. A Workflow flow, a Rule or Contract bullet, a Model term, and an open question have no address; a reference to one of them stays a Spec-level mention, and a sequence that must be addressed is authored as keyed entries.
- consequence: The key `description` names a section's leading prose and is never an entry, so an address ending in `.description` never resolves. A TypeScript key outside the lower-camel ASCII grammar is lawful and has no address.
- consequence: A renamed open-section key fails validation in every Spec that addresses it.
- consequence: Blast radius and delta review scope include a mentioning Spec once a declared relation backs its mention.
- consequence: A family pattern written in id form reads as an unresolved mention, so such a pattern is written as plain words.
- consequence: The id contract and its test move together: the stable-ids round-trip example re-binds from a sectionless `#` sub-part to an entry address, and the id tests move the sectionless form to the refused list.
- consequence: No reference check detects two Specs that restate one shape in their own words. The check narrows that defect class and never closes it.
