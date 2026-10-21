---
id: spec:carrier.step-keys.malformed-marker-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.step-keys
  verifies:
    target: spec:carrier.step-keys
    exercises: [markerRefusals]
---
# A step marker whose key is off the grammar refuses the carrier

## Intent
- outcome: Execute the marker refusal on step text that opens with a marker whose key is not lower-camel ASCII.

```gwt
Given the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cart-size] a customer has a cart with {items:number} line items"}
Given a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}
When the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again
Then the first extraction finding's message contains {extractMessage: "step key markers must be [#<lower-camel ASCII key>] followed by one space and text"}
```
