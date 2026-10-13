---
id: spec:model.term-addresses
kind: rule
altitude: story
readiness: idea
relations:
  refines:
    target: spec:model.spec-sections
    reason: extends entry addresses to the terms a Model section defines
  dependsOn:
    - target: spec:model.stable-ids
      reason: a term address extends the Spec entry-address grammar
    - target: spec:model.rule-keys
      reason: the term-key design follows the rule-entry address pattern
  decidedBy:
    target: spec:decisions.checked-mentions
    reason: a term address would join the address law that decision rules
---
# A Model term may carry a key that addresses it

A Model section defines a Spec's terms, and prose can name those terms by word. Such a word is not a checked entry address, so a view cannot resolve it to one authored definition without a rule for its owner and key. Design, UI, question and rule entries already carry keys that a mention addresses and validation checks; a Model term has none. With a key, prose could cite a concept as a checked mention, and every view, the Obsidian vault included, could link it exactly.

## Intent

- outcome: Let a Model term carry a key, addressed as an entry of its Spec's model section, so prose cites a concept as a checked mention and every view links it exactly.

### Open questions
- [blocking #termKeyForm] Is a term's key authored in a marker, as rules and questions carry theirs, or derived from the term?
  - decider: owner
  - provisional: an authored marker, since a key derived from the term breaks every address when the term is reworded
- [non-blocking #glossaryTerms] Do the ratified glossary terms move into Model sections so that each gains an address?
  - decider: owner
  - provisional: no; the glossary stays a document, and a term gains an address where a Spec defines it
- [non-blocking #addressSection] Does a keyed Model term use the term segment or the model segment in its entry address?
  - decider: owner

## Rule
