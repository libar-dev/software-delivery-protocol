---
id: spec:validation.superseded-decision-signal.chain-end-named
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.superseded-decision-signal
  verifies: { target: spec:validation.superseded-decision-signal, exercises: [chainEnd] }
---
# The warning names the decision at the end of a chain of replacements

## Intent
- outcome: Execute the chain walk where the replacing decision is itself replaced.

```gwt
Given a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}
Given the probe decision is replaced by {replacement: "a chain of two decisions"}
When the graph is validated
Then the report holds {warnings: 1} superseded-decision warnings
Then the warnings name {named: "spec:probe.decision-c"}
Then the report holds {errorCount: 0} errors
```
