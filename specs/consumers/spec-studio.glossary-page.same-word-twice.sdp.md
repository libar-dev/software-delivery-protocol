---
id: spec:consumers.spec-studio.glossary-page.same-word-twice
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.glossary-page
  verifies:
    target: spec:consumers.spec-studio.glossary-page
    exercises: [terms, sameWordTwice]
---
# A word two Specs define appears once per Spec on the glossary page

## Intent
- outcome: Execute the glossary on one word two Specs define: both definitions listed, and the keyed one with its address.
- assumption: The world writes a root with two Specs under the probe namespace, `alpha` and `beta`, each defining `order` in its Model section, the first with an authored key; it builds the page set and reads the glossary page's rows for the term.

```gwt
Given two Specs whose Model sections define the term {term: "order"}, the first with the key {key: "order"}
When the build renders the glossary page
Then the page lists the term {rows: 2} times
Then the keyed row shows the address {address: "spec:probe.alpha#term.order"}
```
