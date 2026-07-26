---
id: spec:validation.readiness-floor.unrelated-scoped-spec
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.readiness-floor
  verifies: spec:validation.readiness-floor
---
# A scoped spec with no relation names the relation clause

## Intent
- outcome: Execute the scoped rung where every clause but the relation clause is satisfied.

```gwt
Given the graph holds a spec {specId: "spec:probe.unrelated-scoped"} stating readiness {readiness: "scoped"}
Given the spec {defect: "declares no relation"}
When the graph is validated
Then the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}
Then the finding names the unmet floor clause {clauseId: "at-least-one-relation"}
Then the report holds {errorCount: 1} errors
```
