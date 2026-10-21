---
id: spec:carrier.step-keys.repeated-key-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.step-keys
  verifies:
    target: spec:carrier.step-keys
    exercises: [oneKeyOneStep]
---
# One key on two vocabulary steps refuses the carrier

## Intent
- outcome: Execute the refusal of a key that names two steps of one Spec.

```gwt
Given the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items; [#cartSize] the cart is open"}
Given a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items; the cart is open"}
When the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again
Then the first extraction finding's message contains {extractMessage: "names two steps; a step key names one step within a Spec"}
```
