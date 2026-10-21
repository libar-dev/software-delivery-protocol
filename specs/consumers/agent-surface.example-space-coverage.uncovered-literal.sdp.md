---
id: spec:consumers.agent-surface.example-space-coverage.uncovered-literal
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface.example-space-coverage
  verifies:
    target: spec:consumers.agent-surface.example-space-coverage
    exercises: [catalogRecipe, literalUnions, eligibleChildren, unboundSlot]
---
# A literal no example binds is reported uncovered, and an unbound child is named

## Intent
- outcome: Execute per-value coverage on a closed union with one covered, two uncovered values and one child that binds nothing.
- assumption: The world writes a parent Spec whose example space declares the slot as a closed union of the literals the declared value lists, separated by `|`, and one example child per entry of the bound value, separated by `; `, each child refining and verifying the parent and binding that literal, or binding no value where the entry is `none`; it runs recipe 44's shipped body with the parent as `spec` and joins the uncovered values and the unbound children's ids with `, `. The parent's id ends in `probe.parent`, and each child's id is the parent's followed by `.c1`, `.c2` and on, in order.

```gwt
Given an example space that declares the slot {slot: "availability"} as {declared: "in stock|out of stock|backordered"}
Given its example children bind {bound: "in stock; in stock; none"}
When recipe 44 reports the space's coverage
Then the slot is enumerable: {enumerable: true}
Then the values no example binds are {uncovered: "out of stock, backordered"}
Then the examples that leave the slot unbound are {unbound: "spec:probe.parent.c3"}
```
