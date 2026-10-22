---
id: spec:carrier.step-keys.two-keys-on-one-step-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.step-keys
  verifies:
    target: spec:carrier.step-keys
    exercises: [oneKeyOneStep]
---
# Two keys on one step refuse the carrier

## Intent
- outcome: Execute the refusal of one step, written twice in a vocabulary, that carries a different key each time.

```gwt
Given the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items; [#cartLines] a customer has a cart with {items:number} line items"}
Given a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}
When the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again
Then the first extraction finding's message contains {extractMessage: "carries two step keys; a step carries one key within a Spec"}
```
