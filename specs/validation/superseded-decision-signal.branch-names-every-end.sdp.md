---
id: spec:validation.superseded-decision-signal.branch-names-every-end
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.superseded-decision-signal
  verifies: { target: spec:validation.superseded-decision-signal, exercises: [chainEnd] }
---
# A replacement chain that branches names every end

## Intent
- outcome: Execute the chain walk where two decisions replace one.

```gwt
Given a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}
Given the probe decision is replaced by {replacement: "two decisions at once"}
Given every replacing decision states {replacementRung: "ready"}
When the graph is validated
Then the report holds {warnings: 1} superseded-decision warnings
Then the warnings name {named: "spec:probe.decision-b, spec:probe.decision-c"}
Then the warning message follows {template: "message"}
Then the report holds {errorCount: 0} errors
```
