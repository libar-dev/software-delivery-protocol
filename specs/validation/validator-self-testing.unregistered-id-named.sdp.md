---
id: spec:validation.validator-self-testing.unregistered-id-named
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.validator-self-testing
  verifies: { target: spec:validation.validator-self-testing, exercises: [closedTable] }
---
# A finding id the source writes outside every registry is named

## Intent
- outcome: Execute the audit on a source that writes a finding id no registry lists.

```gwt
Given the audit reads {table: "the shipped probe table"}
Given the check {findingId: "conformance/orphans"} behaves {behavior: "as shipped"}
Given the engine source also writes {extraSourceId: "conformance/unlisted-check"}
When the audit runs
Then the audit {verdict: "fails"}
Then the audit names {named: "conformance/unlisted-check"} as {list: "unregistered"}
```
