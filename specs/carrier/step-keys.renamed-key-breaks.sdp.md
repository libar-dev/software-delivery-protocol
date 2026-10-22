---
id: spec:carrier.step-keys.renamed-key-breaks
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.step-keys
  verifies:
    target: spec:carrier.step-keys
    exercises: [renamedKey]
---
# Renaming a step key breaks the binding

## Intent
- outcome: Execute the renamed-key rule: a change of the key itself, with the wording left as it was, renames the step in the contract.

```gwt
Given the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items"}
Given a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}
When the contracts are generated, the step lines are reworded by replacing {before: "cartSize"} with {after: "cartLines"}, and the contracts are generated again
Then the first extraction finding's message contains {extractMessage: ""}
Then the child contract binds its first Given step as {bindingKey: "cartSize"} and then as {rewordedBindingKey: "cartLines"}
Then the handlers bound to the first contract cover the second: {stillBound: false}
```
