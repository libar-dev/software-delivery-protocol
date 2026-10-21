---
id: spec:carrier.step-keys.typescript-keyed-step-imports-keyed
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.step-keys
  verifies:
    target: spec:carrier.step-keys
    exercises: [stepMarker, contractKey]
---
# A keyed TypeScript step keeps its key through import to Markdown

## Intent
- outcome: Execute the step marker in the TypeScript carrier: a keyed step string keeps its contract key across a rewording, and importing the carriers to Markdown writes the marker and extracts to the same step keys and step text.

```gwt
Given the {carrier: "TypeScript"} carriers of a parent whose example space declares the Given steps {vocabulary: "[#cartSize] a customer has a cart with {items:number} line items"}
Given a child example of that parent whose Given steps read {example: "a customer has a cart with {items: 2} line items"}
When the contracts are generated, the step lines are reworded by replacing {before: "a customer has a cart with"} with {after: "the cart holds"}, and the contracts are generated again
Then the first extraction finding's message contains {extractMessage: ""}
Then the child contract binds its first Given step as {bindingKey: "cartSize"} and then as {rewordedBindingKey: "cartSize"}
Then the carriers imported to Markdown write the parent's first Given step as {importedStep: "Given [#cartSize] the cart holds {items:number} line items"} and keep every step key and step text: {keptOnImport: true}
```
