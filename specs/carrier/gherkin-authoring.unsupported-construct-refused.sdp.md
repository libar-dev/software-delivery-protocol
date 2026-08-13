---
id: spec:carrier.gherkin-authoring.unsupported-construct-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# A Scenario Outline is refused

## Intent
- outcome: Prove Gherkin constructs outside the closed carrier grammar fail loudly instead of entering the graph partially.

```gwt
Given the Gherkin fixture corpus {probe: "unsupported-construct"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 1} findings
Then the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 7}
Then the graph omits the Spec {absentId: "spec:fixture.outline"}
```
