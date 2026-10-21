---
id: spec:validation.validator-self-testing.silent-check-named
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.validator-self-testing
  verifies: { target: spec:validation.validator-self-testing, exercises: [silentAndOvereager, bothDirections] }
---
# A check that stops reporting is named silent

## Intent
- outcome: Execute the audit on a check whose findings no longer reach any run.

```gwt
Given the audit reads {table: "the shipped probe table"}
Given the check {findingId: "conformance/orphans"} behaves {behavior: "silently"}
Given the engine source also writes {extraSourceId: "nothing"}
When the audit runs
Then the audit {verdict: "fails"}
Then the audit names {named: "conformance/orphans"} as {list: "silent"}
```
