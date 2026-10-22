---
id: spec:validation.superseded-decision-signal.end-and-loop-named
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.superseded-decision-signal
  verifies: { target: spec:validation.superseded-decision-signal, exercises: [chainEnd, closedChain] }
---
# A chain of replacements that reaches an end and a loop names both

## Intent
- outcome: Execute the chain walk where one branch ends and the other closes on itself.

```gwt
Given a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}
Given the probe decision is replaced by {replacement: "an end and a loop at once"}
Given every replacing decision states {replacementRung: "ready"}
When the graph is validated
Then the report holds {warnings: 1} superseded-decision warnings
Then the warnings name {named: "spec:probe.decision-b, spec:probe.decision-c, spec:probe.decision-d"}
Then the warning message follows {template: "mixedChainMessage"}
Then the report holds {errorCount: 0} errors
```
