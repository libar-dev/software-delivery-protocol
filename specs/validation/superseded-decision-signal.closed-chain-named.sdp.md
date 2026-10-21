---
id: spec:validation.superseded-decision-signal.closed-chain-named
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.superseded-decision-signal
  verifies: { target: spec:validation.superseded-decision-signal, exercises: [closedChain, informative] }
---
# A chain of replacements that closes on itself is named and fails nothing

## Intent
- outcome: Execute the chain walk where two decisions supersede each other.

```gwt
Given a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}
Given the probe decision is replaced by {replacement: "a chain that closes on itself"}
When the graph is validated
Then the report holds {warnings: 1} superseded-decision warnings
Then the warnings name {named: "spec:probe.decision-a, spec:probe.decision-b"}
Then the report holds {errorCount: 0} errors
```
