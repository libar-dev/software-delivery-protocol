---
id: spec:validation.validator-self-testing.overeager-check-named
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.validator-self-testing
  verifies: { target: spec:validation.validator-self-testing, exercises: [silentAndOvereager, bothDirections] }
---
# A check that reports its near miss is named overeager

## Intent
- outcome: Execute the audit on a check that reports every probe it runs over.

```gwt
Given the audit reads {table: "the shipped probe table"}
Given the check {findingId: "conformance/orphans"} behaves {behavior: "overeagerly"}
Given the engine source also writes {extraSourceId: "nothing"}
When the audit runs
Then the audit {verdict: "fails"}
Then the audit names {named: "conformance/orphans"} as {list: "overeager"}
```
