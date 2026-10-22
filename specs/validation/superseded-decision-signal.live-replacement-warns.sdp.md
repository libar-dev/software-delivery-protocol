---
id: spec:validation.superseded-decision-signal.live-replacement-warns
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.superseded-decision-signal
  verifies: { target: spec:validation.superseded-decision-signal, exercises: [onePerPair, liveSubjectsOnly] }
---
# A decision still decided by the record it replaces warns

## Intent
- outcome: Execute the live-subject rule on a replacing decision that names the decision it supersedes through decidedBy.

```gwt
Given a {subject: "replacing decision"} names the probe decision through {relation: "decidedBy"}
Given the probe decision is replaced by {replacement: "one decision"}
Given every replacing decision states {replacementRung: "ready"}
When the graph is validated
Then the report holds {warnings: 1} superseded-decision warnings
Then the warnings name {named: "spec:probe.decision-b"}
Then the warning has the subject {subjectId: "spec:probe.decision-b"} and the related Spec {relatedId: "spec:probe.decision-a"}
Then the report holds {errorCount: 0} errors
```
