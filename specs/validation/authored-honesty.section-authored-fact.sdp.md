---
id: spec:validation.authored-honesty.section-authored-fact
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.authored-honesty
  verifies: spec:validation.authored-honesty
---
# A delivery fact smuggled into a section is refused

## Intent
- outcome: Execute the authoring-shape refusal on a section carrier that names a derived fact.

```gwt
Given the graph holds a spec {specId: "spec:probe.smuggled-fact"}
Given the spec hand-authors the delivery fact {factName: "implemented"} at {site: "a behavior section carrier"}
When the graph is validated
Then the report names {findingId: "honesty/authoring-shape"} at severity {severity: "error"}
Then the finding names the fact {relatedId: "implemented"} and states {phrase: "derived, never authored"}
```
