---
id: spec:carrier.gherkin-authoring.unknown-tag-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# A graph-aware tag near miss is refused

## Intent
- outcome: Prove misspelled graph-aware tags fail with a bounded suggestion rather than becoming silent decoration.

```gwt
Given the Gherkin fixture corpus {probe: "unknown-tag"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 1} findings
Then the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 1}
Then the graph omits the Spec {absentId: "spec:fixture.unknown-tag"}
```
