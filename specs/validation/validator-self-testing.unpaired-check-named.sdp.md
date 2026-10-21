---
id: spec:validation.validator-self-testing.unpaired-check-named
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.validator-self-testing
  verifies: { target: spec:validation.validator-self-testing, exercises: [closedTable, probePairs] }
---
# A registered check without a probe pair is named unpaired

## Intent
- outcome: Execute the audit on a table that has lost one check's probe pair.

```gwt
Given the audit reads {table: "the shipped table without one pair"}
Given the check {findingId: "conformance/orphans"} behaves {behavior: "as shipped"}
Given the engine source also writes {extraSourceId: "nothing"}
When the audit runs
Then the audit {verdict: "fails"}
Then the audit names {named: "conformance/orphans"} as {list: "unpaired"}
```
