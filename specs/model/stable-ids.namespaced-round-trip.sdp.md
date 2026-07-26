---
id: spec:model.stable-ids.namespaced-round-trip
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:model.stable-ids
  verifies: spec:model.stable-ids
---
# A namespaced dotted path with a sub-part survives parsing unchanged

## Intent
- outcome: Execute the ID grammar on the fullest well-formed shape the model allows.

```gwt
Given the authored identifier {identifier: "spec:orders.create-order#valid-cart"}
When the identifier is parsed
Then parsing {outcome: "resolves"}
Then reformatting the parsed parts restores {restored: "spec:orders.create-order#valid-cart"}
```
