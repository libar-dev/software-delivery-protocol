---
id: spec:carrier.slot-notation.refused-guess
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.slot-notation
  verifies: spec:carrier.slot-notation
---
# A stray brace stays prose while an unusable group stays a named slot

## Intent
- outcome: Execute the refuse-to-guess posture where a stray brace precedes an unparsable group.

```gwt
Given the step text {stepText: "a stray { then {n: maybe} line items"}
When the notation parses the step text
Then the notation finds {slotCount: 1} slot groups
Then the first group has the form {form: "malformed"} and the name {slotName: "n"}
Then the step skeleton is {skeleton: "a stray { then {n} line items"}
```
