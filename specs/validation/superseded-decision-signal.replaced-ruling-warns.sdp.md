---
id: spec:validation.superseded-decision-signal.replaced-ruling-warns
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.superseded-decision-signal
  verifies: { target: spec:validation.superseded-decision-signal, exercises: [readsDecidedBy, onePerPair, chainEnd, informative, noSupersedesWarning] }
---
# A Spec shaped by a replaced decision warns once and fails nothing

## Intent
- outcome: Execute the signal on a live Spec whose decision one later decision supersedes.

```gwt
Given a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}
Given the probe decision is replaced by {replacement: "one decision"}
When the graph is validated
Then the report holds {warnings: 1} superseded-decision warnings
Then the warnings name {named: "spec:probe.decision-b"}
Then the report holds {errorCount: 0} errors
```
