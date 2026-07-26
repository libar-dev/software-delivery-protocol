---
id: spec:validation.kind-evidence.untargeted-constraint
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.kind-evidence
  verifies: spec:validation.kind-evidence
---
# A constraint without a machine-readable target is not complete

## Intent
- outcome: Execute the constraint row where the entry is present but carries no target a machine can read.

```gwt
Given the graph holds a {kind: "constraint"} spec {specId: "spec:probe.untargeted-constraint"} stating readiness {readiness: "defined"}
Given its only evidence is {evidence: "a constraints entry with no target"}
When the graph is validated
Then the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}
Then the finding names the unmet floor clause {clauseId: "kind-evidence-complete"}
Then the report holds {errorCount: 1} errors
```
