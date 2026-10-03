---
id: spec:model.stable-ids.unsectioned-address-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:model.stable-ids
  verifies: spec:model.stable-ids
---
# A `#` sub-part without its section is refused with its reason named

## Intent
- outcome: Execute the entry-address clause of the ID grammar on a sub-part that names no section.

```gwt
Given the authored identifier {identifier: "spec:orders.create-order#valid-cart"}
When the identifier is parsed
Then parsing {outcome: "is refused"}
Then the refusal names the reason {reason: "entry address must be <section>.<key> with section design or ui"}
```
