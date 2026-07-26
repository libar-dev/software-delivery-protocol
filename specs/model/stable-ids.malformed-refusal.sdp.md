---
id: spec:model.stable-ids.malformed-refusal
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:model.stable-ids
  verifies: spec:model.stable-ids
---
# An uppercase namespace is refused with its reason named

## Intent
- outcome: Execute the lowercase-namespace clause of the ID grammar.

```gwt
Given the authored identifier {identifier: "Spec:orders.create-order"}
When the identifier is parsed
Then parsing {outcome: "is refused"}
Then the refusal names the reason {reason: "namespace must be lowercase"}
```
