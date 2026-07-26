---
id: spec:carrier.slot-notation.typed-declaration
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.slot-notation
  verifies: spec:carrier.slot-notation
---
# A typed declaration normalizes to the skeleton its binding shares

## Intent
- outcome: Execute the declaration form and the skeleton identity on one vocabulary step.

```gwt
Given the step text {stepText: "a cart with {n:number} line items"}
When the notation parses the step text
Then the notation finds {slotCount: 1} slot groups
Then the first group has the form {form: "typed"} and the name {slotName: "n"}
Then the step skeleton is {skeleton: "a cart with {n} line items"}
```
