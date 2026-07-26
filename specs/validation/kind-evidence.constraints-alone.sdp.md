---
id: spec:validation.kind-evidence.constraints-alone
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.kind-evidence
  verifies: spec:validation.kind-evidence
---
# Constraints alone stop short of complete behavior evidence

## Intent
- outcome: Execute the behavior-family row where the only evidence is the form that clears present but not complete.

```gwt
Given the graph holds a {kind: "behavior"} spec {specId: "spec:probe.constraints-alone"} stating readiness {readiness: "defined"}
Given its only evidence is {evidence: "a constraints entry carrying a target"}
When the graph is validated
Then the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}
Then the finding names the unmet floor clause {clauseId: "kind-evidence-complete"}
Then the report holds {errorCount: 1} errors
```
