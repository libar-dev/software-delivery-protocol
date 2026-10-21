---
id: spec:validation.superseded-decision-signal.dependency-unread
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.superseded-decision-signal
  verifies: { target: spec:validation.superseded-decision-signal, exercises: [readsDecidedBy] }
---
# A dependency on a replaced decision raises no warning

## Intent
- outcome: Execute the signal's reach on a Spec that names a superseded decision only through dependsOn.

```gwt
Given a {subject: "live Spec"} names the probe decision through {relation: "dependsOn"}
Given the probe decision is replaced by {replacement: "one decision"}
Given every replacing decision states {replacementRung: "ready"}
When the graph is validated
Then the report holds {warnings: 0} superseded-decision warnings
Then the warnings name {named: "nothing"}
Then the report holds {errorCount: 0} errors
```
