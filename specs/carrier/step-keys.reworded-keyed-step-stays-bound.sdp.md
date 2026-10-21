---
id: spec:carrier.step-keys.reworded-keyed-step-stays-bound
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.step-keys
  verifies:
    - target: spec:carrier.step-keys
      exercises: [stepMarker, vocabularyHome, contractKey, rewordedStaysBound]
    - target: spec:extraction.executable-contracts
      exercises: [contractKeys]
---
# A keyed step reworded in its vocabulary and its example keeps its binding

## Intent
- outcome: Execute the step key's acceptance: a step keyed in the parent's vocabulary keeps its contract key across a rewording, so the handlers bound before it still bind.

```gwt
Given the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items"}
Given a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}
When the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again
Then the first extraction finding's message contains {extractMessage: ""}
Then the child contract binds its first Given step as {bindingKey: "cartSize"} and then as {rewordedBindingKey: "cartSize"}
Then the handlers bound to the first contract cover the second: {stillBound: true}
```
