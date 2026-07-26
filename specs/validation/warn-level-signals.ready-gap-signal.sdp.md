---
id: spec:validation.warn-level-signals.ready-gap-signal
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.warn-level-signals
  verifies: spec:validation.warn-level-signals
---
# A ready spec without a verifier warns and fails nothing

## Intent
- outcome: Execute the gap signal on a connected ready spec no verifier resolves.

```gwt
Given the graph holds a spec {specId: "spec:probe.gap-signal"} at readiness {readiness: "ready"}
Given the spec declares {relations: "a decidedBy decision"}
When the graph is validated
Then the report names {findingId: "honesty/gaps"} at severity {severity: "warning"}
Then the report holds {errorCount: 0} errors
```
