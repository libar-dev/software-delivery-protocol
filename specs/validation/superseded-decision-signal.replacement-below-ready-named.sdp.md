---
id: spec:validation.superseded-decision-signal.replacement-below-ready-named
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.superseded-decision-signal
  verifies: { target: spec:validation.superseded-decision-signal, exercises: [anyRung] }
---
# A replacement still below ready is named as it stands

## Intent
- outcome: Execute the signal where the decision that supersedes the shaping decision states `idea`.

```gwt
Given a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}
Given the probe decision is replaced by {replacement: "one decision"}
Given every replacing decision states {replacementRung: "idea"}
When the graph is validated
Then the report holds {warnings: 1} superseded-decision warnings
Then the warnings name {named: "spec:probe.decision-b"}
Then the report holds {errorCount: 0} errors
```
