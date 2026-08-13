---
id: spec:carrier.gherkin-authoring.authored-fact-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# An authored delivery fact lookalike is refused

## Intent
- outcome: Prove Gherkin cannot author a delivery fact or disguise one as non-semantic decoration.

```gwt
Given the Gherkin fixture corpus {probe: "authored-fact"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 1} findings
Then the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 1}
Then the graph omits the Spec {absentId: "spec:fixture.authored-fact"}
```
