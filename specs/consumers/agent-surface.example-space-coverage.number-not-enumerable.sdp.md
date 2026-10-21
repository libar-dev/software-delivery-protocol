---
id: spec:consumers.agent-surface.example-space-coverage.number-not-enumerable
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface.example-space-coverage
  verifies:
    target: spec:consumers.agent-surface.example-space-coverage
    exercises: [literalUnions, perSlotOnly, confersNothing]
---
# A number slot is not enumerable and reports no uncovered value

## Intent
- outcome: Execute the not-enumerable answer on a number slot, which reports the values bound and never a missing one.
- assumption: The world writes the parent and children as the uncovered-literal example does, with the slot declared as `number` and each child binding the number its entry names; it runs recipe 44's shipped body with the parent as `spec`, reads the slot's row, and checks that the validation report and the parent's readiness are the same before and after.

```gwt
Given an example space that declares the slot {slot: "quantity"} as {declared: "number"}
Given its example children bind {bound: "2; 5"}
When recipe 44 reports the space's coverage
Then the slot is enumerable: {enumerable: false}
Then the values no example binds are {uncovered: ""}
Then the examples that leave the slot unbound are {unbound: ""}
```
