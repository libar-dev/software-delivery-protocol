---
id: spec:validation.pack-coherence.incoherent-aggregate
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.pack-coherence
  verifies: spec:validation.pack-coherence
---
# A repeated member and a non-model modelRef are both named

## Intent
- outcome: Execute both halves of the pack law against one incoherent aggregate.

```gwt
Given a pack {packId: "pack:probe.checkout"} lists the spec {specId: "spec:probe.create-order"} {memberCount: 2} times
Given the pack also names that spec as a modelRef
When the graph is validated
Then the report names {findingId: "conformance/pack-coherence"} at severity {severity: "error"}
Then the report holds {findingCount: 2} pack-coherence findings
```
