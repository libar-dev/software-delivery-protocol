---
id: spec:validation.readiness-floor.blocking-open-question
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.readiness-floor
  verifies: spec:validation.readiness-floor
---
# A blocking open question holds a spec below defined

## Intent
- outcome: Execute the defined rung where a recorded open question is flagged as blocking.

```gwt
Given the graph holds a spec {specId: "spec:probe.blocked-defined"} stating readiness {readiness: "defined"}
Given the spec {defect: "records a blocking open question"}
When the graph is validated
Then the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}
Then the finding names the unmet floor clause {clauseId: "no-blocking-open-questions"}
Then the report holds {errorCount: 1} errors
```
