---
id: spec:carrier.step-keys.reworded-unkeyed-step-breaks
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.step-keys
  verifies:
    - target: spec:carrier.step-keys
      exercises: [contractKey, unkeyedBreaks]
    - target: spec:extraction.executable-contracts
      exercises: [contractKeys]
---
# The same rewording without a key breaks the binding

## Intent
- outcome: Execute the contrast to the keyed rewording: an unkeyed step is keyed by its skeleton, so the same rewording renames it and the handlers bound before it no longer cover the contract.

```gwt
Given the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "a customer has a cart with {items:number} line items"}
Given a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}
When the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again
Then the first extraction finding's message contains {extractMessage: ""}
Then the child contract binds its first Given step as {bindingKey: "a customer has a cart with {items} line items"} and then as {rewordedBindingKey: "the cart holds {items} line items"}
Then the handlers bound to the first contract cover the second: {stillBound: false}
```
