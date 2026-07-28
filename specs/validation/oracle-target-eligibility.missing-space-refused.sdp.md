---
id: spec:validation.oracle-target-eligibility.missing-space-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.oracle-target-eligibility
  verifies: spec:validation.oracle-target-eligibility
---
# A target without an example space refuses an oracle

## Intent
- outcome: Execute the fail-closed refusal when an otherwise valid Spec target owns no example space.

```gwt
Given the oracle targets a {targetKind: "behavior"} spec
Given the target owns an example space: {ownsExampleSpace: false}
When oracle linkage is resolved
Then oracle linkage reports {findingCount: 1} findings and resolving presence {oraclePresent: false}
```
