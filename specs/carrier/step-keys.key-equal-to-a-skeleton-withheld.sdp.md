---
id: spec:carrier.step-keys.key-equal-to-a-skeleton-withheld
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.step-keys
  verifies:
    - target: spec:carrier.step-keys
      exercises: [contractKey]
    - target: spec:extraction.executable-contracts
      exercises: [keyConflicts]
---
# A step key equal to another step's skeleton withholds the contract

## Intent
- outcome: Execute the contract-key collision: a keyed step and an unkeyed step whose skeleton is that key would share one contract key, so extraction accepts both and contract generation withholds the child's step contract with a named finding.

```gwt
Given the {carrier: "Markdown"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] the cart has {items:number} items; cartSize"}
Given a child example of that parent whose Given steps read {example: "the cart has {items: 2} items; cartSize"}
When the contracts are generated, the step lines are reworded by replacing {before: "the cart has"} with {after: "the cart holds"}, and the contracts are generated again
Then the first extraction finding's message contains {extractMessage: ""}
Then the first contract finding about the child is {contractFinding: "contracts/duplicate-step-key"}
Then the child contract binds its first Given step as {bindingKey: ""} and then as {rewordedBindingKey: ""}
```
