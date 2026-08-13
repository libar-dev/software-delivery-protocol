---
id: spec:carrier.gherkin-authoring.duplicate-surface-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# Duplicate Markdown and Gherkin surfaces are both excluded

## Intent
- outcome: Prove one canonical surface per Spec ID by excluding every duplicate site and its edges while preserving healthy siblings.

```gwt
Given the Gherkin fixture corpus {probe: "duplicate-surface"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 2} findings
Then the report contains finding {findingId: "extract/duplicate-id"}
Then the graph omits the Spec {absentId: "spec:fixture.surface-duplicate"}
Then no graph edge names the absent Spec {absentId: "spec:fixture.surface-duplicate"}
Then the graph contains the Spec {specId: "spec:fixture.surface-sibling"} with kind {specKind: "example"}
```
