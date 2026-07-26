---
id: spec:extraction.executable-contracts.concreteness-refusal
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:extraction.executable-contracts
  verifies: spec:extraction.executable-contracts
---
# An unbound slot in a used step earns no step contract

## Intent
- outcome: Execute the concreteness law where the example leaves a declared slot unbound.

```gwt
Given a parent spec whose example space declares the slot {dimension: "n"}
Given a refining example {exampleId: "spec:probe.create-order.unbound"} whose used step {binding: "leaves unbound"} that slot
When the contracts are generated from the derived graph
Then the generated tree holds {fileCount: 1} files
Then the step contract for the example is emitted: {emitted: false}
```
