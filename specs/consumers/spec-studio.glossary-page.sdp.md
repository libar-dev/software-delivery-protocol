---
id: spec:consumers.spec-studio.glossary-page
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - target: spec:model.term-addresses
      reason: a keyed term's address links it to its definition
---
# The glossary page lists every term the corpus's Specs define

A Spec's Model section defines terms, and a term may carry a key that gives it an address. The glossary page gathers every defined term on one page so a reviewer finds a word and the Spec that defines it. A corpus's ratified glossary stays the document it is; the page lists what the Specs define, so two definitions of one word read side by side.

## Intent
- outcome: Let a person find any term a Spec defines, read its definition, and open the Spec and the entry that define it.

## Behavior
- rule: [#terms] The page set holds `glossary.html`, which lists every term a Spec's Model section defines, sorted by the term's lowercase form in code-unit order and then by Spec id, each with its definition as text, its Spec linked, and, when the term carries a key, its address `spec:<id>#term.<key>` with a copy action, linked to the term on the Spec page.
- rule: [#sameWordTwice] A word two Specs define appears once per Spec, so the definitions read side by side and the page chooses none.
- rule: [#noGlossaryDocument] The page renders no glossary document: it lists the terms the graph holds and nothing else.
- rule: [#letterIndex] The page opens with the count of terms and of defining Specs in one sentence and the letters its terms start with, each linked to the heading over its terms.

## UI
- letterHeading: one heading per first letter, lowercased, with the element id `letter.<letter>`, over the terms that start with it; a term that starts with no letter sits under the heading `#` with the element id `letter.other`.
- termRow: the term in bold, its definition as text with inline code spans as code, then the Spec's title linked and, when keyed, `term.<key>` as a link with a copy action for the full address.

## Example space
```gwt-vocabulary
Given two Specs whose Model sections define the term {term:string}, the first with the key {key:string}
When the build renders the glossary page
Then the page lists the term {rows:number} times
Then the keyed row shows the address {address:string}
```
