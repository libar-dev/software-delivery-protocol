---
id: spec:validation.kind-evidence.empty-promoted-child
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.kind-evidence
  verifies: spec:validation.kind-evidence
---
# An empty promoted child confers no evidence

## Intent
- outcome: Execute the promoted-evidence bound where a refining child carries none of its own kind's evidence.

```gwt
Given the graph holds a {kind: "behavior"} spec {specId: "spec:probe.empty-promotion"} stating readiness {readiness: "scoped"}
Given its only evidence is {evidence: "an empty promoted rule child"}
When the graph is validated
Then the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}
Then the finding names the unmet floor clause {clauseId: "kind-evidence-present"}
Then the report holds {errorCount: 1} errors
```
