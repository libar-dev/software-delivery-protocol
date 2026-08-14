---
id: spec:carrier.gherkin-authoring.missing-id-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# A Feature without identity is refused

## Intent
- outcome: Prove every Gherkin Feature must carry exactly one lawful Spec identity.

```gwt
Given the Gherkin fixture corpus {probe: "missing-id"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 1} findings
Then the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 3}
Then the graph omits the Spec {absentId: "spec:fixture.missing-id"}
```
