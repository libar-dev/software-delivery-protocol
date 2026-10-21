---
id: spec:validation.superseded-decision-signal.replaced-ruling-warns
kind: example
altitude: story
readiness: ready
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
Given every replacing decision states {replacementRung: "ready"}
When the graph is validated
Then the report holds {warnings: 1} superseded-decision warnings
Then the warnings name {named: "spec:probe.decision-b"}
Then the warning is {validatorId: "conformance/superseded-decisions"} in the {family: "conformance"} family at severity {severity: "warning"}
Then the warning has the subject {subjectId: "spec:probe.shaped"} and the related Spec {relatedId: "spec:probe.decision-a"}
Then the warning sits at {path: "relation.decidedBy.spec:probe.decision-a"} in {file: "shaped.sdp.md"} on line {line: 7}
Then the warning message follows {template: "message"}
Then the report holds {errorCount: 0} errors
```
