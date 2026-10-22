---
id: spec:validation.validator-self-testing.duplicate-pair-named
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.validator-self-testing
  verifies: { target: spec:validation.validator-self-testing, exercises: [closedTable, probePairs] }
---
# A check paired twice is named

## Intent
- outcome: Execute the audit on a table that holds one check's probe pair twice.

```gwt
Given the audit reads {table: "the shipped table with one pair twice"}
Given the check {findingId: "conformance/orphans"} behaves {behavior: "as shipped"}
Given the engine source also writes {extraSourceId: "nothing"}
When the audit runs
Then the audit {verdict: "fails"}
Then the audit names {named: "conformance/orphans"} as {list: "duplicatePairs"}
```
