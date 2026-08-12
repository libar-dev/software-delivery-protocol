---
id: spec:validation.oracle-target-eligibility.rule-space-accepted
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.oracle-target-eligibility
  verifies: spec:validation.oracle-target-eligibility
---
# A rule owning an example space accepts an oracle

## Intent
- outcome: Execute kind-neutral oracle resolution for a rule that owns the vocabulary its oracle models.

```gwt
Given the oracle targets a {targetKind: "rule"} spec
Given the target owns an example space: {ownsExampleSpace: true}
When oracle linkage is resolved
Then oracle linkage reports {findingCount: 0} findings and resolving presence {oraclePresent: true}
```
