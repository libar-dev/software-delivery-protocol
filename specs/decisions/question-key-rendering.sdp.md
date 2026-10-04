---
id: spec:decisions.question-key-rendering
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.design-review
  dependsOn: spec:model.open-question-keys
  supersedes: spec:decisions.shipped-projections-frozen
---
# The Design Review shows an open question's key

## Intent
- outcome: Show an open question's key on its Spec page, so a reader can cite the question's entry address from the page.

## Decision
- context: `spec:model.open-question-keys` gives an open question an optional key in its marker and an entry address `spec:<id>#question.<key>`. The Design Review renders an open question as its escaped text, with the word blocking after a blocking one, and the shipped projections are frozen, so a reader of the page cannot see the key the address needs. The first adopter cites its open questions from a decision register and from generated pages.
- decision: The Design Review renders an open question that carries a key with the key as inline code, `#<key>`, at the start of its item, before the question's text; a question without a key renders as before. The freeze on the four shipped projections stands for everything else.
- rationale: The key is the one part of the address the page did not show, and the `#` that opens it in the marker opens it on the page.
- alternative: Rendering the whole address beside each question repeats the Spec id on every question of its own page.
- alternative: Leaving the key off the page keeps the freeze whole and leaves the address to the carrier file and recipe 20.
- consequence: A self-hosted page whose Spec keys a question changes; the checkout-v1 goldens hold no keyed question and do not change.
