---
id: spec:carrier.step-keys.conflicting-example-key-withheld
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.step-keys
  verifies:
    - target: spec:carrier.step-keys
      exercises: [vocabularyHome]
    - target: spec:extraction.executable-contracts
      exercises: [keyConflicts]
---
# An example marker that disagrees with its vocabulary withholds the contract

## Intent
- outcome: Execute the shared-key rule: an example step keyed apart from the vocabulary step it resolves to gets no step contract, and the finding names the conflict.

```gwt
Given the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items"}
Given a child example of that parent whose Given steps read {example: "[#basketSize] a customer has a cart with {items: 2} line items"}
When the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again
Then the first extraction finding's message contains {extractMessage: ""}
Then the first contract finding about the child is {contractFinding: "contracts/conflicting-step-key"}
Then the child contract binds its first Given step as {bindingKey: ""} and then as {rewordedBindingKey: ""}
```
