---
id: spec:validation.warn-level-signals.orphan-signal
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.warn-level-signals
  verifies: spec:validation.warn-level-signals
---
# A disconnected Spec warns and fails nothing

## Intent
- outcome: Execute the orphan signal on a Spec no relation reaches.

```gwt
Given the graph holds a spec {specId: "spec:probe.orphan-signal"} at readiness {readiness: "idea"}
Given the spec declares {relations: "no relation"}
When the graph is validated
Then the report names {findingId: "conformance/orphans"} at severity {severity: "warning"}
Then the report holds {errorCount: 0} errors
```
