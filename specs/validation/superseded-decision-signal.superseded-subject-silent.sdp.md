---
id: spec:validation.superseded-decision-signal.superseded-subject-silent
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.superseded-decision-signal
  verifies: { target: spec:validation.superseded-decision-signal, exercises: [liveSubjectsOnly, noSupersedesWarning] }
---
# A superseded decision is not warned for the decision it names

## Intent
- outcome: Execute the live-subject rule on a decision that is itself superseded.

```gwt
Given a {subject: "superseded decision"} names the probe decision through {relation: "decidedBy"}
Given the probe decision is replaced by {replacement: "one decision"}
When the graph is validated
Then the report holds {warnings: 0} superseded-decision warnings
Then the warnings name {named: "nothing"}
Then the report holds {errorCount: 0} errors
```
