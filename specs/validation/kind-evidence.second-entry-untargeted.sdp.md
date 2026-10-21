---
id: spec:validation.kind-evidence.second-entry-untargeted
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.kind-evidence
  verifies:
    - spec:validation.kind-evidence
    - target: spec:carrier.markdown-body-grammar
      exercises: [constraintEntryCount]
---
# A constraint whose second entry has no target is not complete

## Intent
- outcome: Execute the constraint row where a Spec carries two entries and only the first carries a target, so the evidence clauses read every entry.

```gwt
Given the graph holds a {kind: "constraint"} spec {specId: "spec:probe.second-entry-untargeted"} stating readiness {readiness: "defined"}
Given its only evidence is {evidence: "a targeted constraints entry and an untargeted second entry"}
When the graph is validated
Then the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}
Then the finding names the unmet floor clause {clauseId: "kind-evidence-complete"}
Then the report holds {errorCount: 1} errors
```
