---
id: spec:extraction.executable-contracts.multi-entry-example
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:extraction.executable-contracts
  verifies: spec:extraction.executable-contracts
---
# A second structured entry is named, never left silently inert

## Intent
- outcome: Execute the one-point law where an example smuggles a second case into one document.

```gwt
Given a parent spec whose example space declares the slot {dimension: "n"}
Given a refining example {exampleId: "spec:probe.create-order.multi"} whose used step {binding: "binds"} that slot
Given the example carries {entryCount: 2} structured entries
When the contracts are generated from the derived graph
Then the step contract for the example is emitted: {emitted: true}
Then the findings name {findingId: "contracts/multi-entry-example"}
```
