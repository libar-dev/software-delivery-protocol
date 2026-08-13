---
id: spec:carrier.gherkin-authoring.malformed-relation-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# A malformed relation target is refused

## Intent
- outcome: Prove every Gherkin relation target restores to a lawful Spec ID before it can enter the graph.

```gwt
Given the Gherkin fixture corpus {probe: "malformed-relation"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 1} findings
Then the first finding is {findingId: "extract/invalid-id"} at line {line: 4}
Then the graph omits the Spec {absentId: "spec:fixture.malformed-relation"}
```
