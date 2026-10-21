---
id: spec:validation.validator-self-testing.shipped-checks-paired
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.validator-self-testing
  verifies: { target: spec:validation.validator-self-testing, exercises: [bothDirections, auditScope, probePairs, closedTable, silentAndOvereager, auditInGate] }
---
# Every shipped check reports its refusing probe and leaves its near miss alone

## Intent
- outcome: Execute the audit over the shipped registries, probe table and source.

```gwt
Given the audit reads {table: "the shipped probe table"}
Given the check {findingId: "conformance/orphans"} behaves {behavior: "as shipped"}
Given the engine source also writes {extraSourceId: "nothing"}
When the audit runs
Then the audit {verdict: "passes"}
Then the audit names {named: "nothing"} as {list: "none"}
```
