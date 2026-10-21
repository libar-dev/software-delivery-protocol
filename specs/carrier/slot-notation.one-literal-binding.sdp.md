---
id: spec:carrier.slot-notation.one-literal-binding
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.slot-notation
  verifies: { target: spec:carrier.slot-notation, exercises: [oneLiteralBinding] }
---
# A one-literal group in a vocabulary is a binding that declares nothing

## Intent
- outcome: Execute the one-literal reading on a vocabulary step, from the parse to contract generation.

```gwt
Given the step text {stepText: "the cart is in {mode: 'only'} mode"}
When the notation parses the step text
Then the notation finds {slotCount: 1} slot groups
Then the first group has the form {form: "bound"} and the name {slotName: "mode"}
Then the step skeleton is {skeleton: "the cart is in {mode} mode"}
Then contract generation declares {dimensionCount: 0} dimensions and reports {generationFinding: "contracts/untyped-vocabulary-slot"}
```
