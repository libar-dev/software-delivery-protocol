---
id: spec:extraction.executable-contracts.case-colliding-path
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:extraction.executable-contracts
  verifies: spec:extraction.executable-contracts
---
# A case-only path collision withholds the whole contracts tree

## Intent
- outcome: Execute the all-or-nothing rule where two examples claim one case-folded contract path.

```gwt
Given a parent spec whose example space declares the slot {dimension: "n"}
Given a refining example {exampleId: "spec:probe.create-order.same-case"} whose used step {binding: "binds"} that slot
Given a case-twin example {twinId: "spec:probe.create-order.same-Case"} whose contract path differs only by letter case
When the contracts are generated from the derived graph
Then the generated tree holds {fileCount: 0} files
Then the findings name {findingId: "contracts/case-colliding-path"}
```
