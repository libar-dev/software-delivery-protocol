---
id: spec:carrier.gherkin-authoring.step-less-scenario-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# A step-less Scenario is refused at its Scenario line

## Intent
- outcome: Prove an ordinary Scenario without steps fails loudly at the Scenario line and contributes no Spec nodes.

```gwt
Given the Gherkin fixture corpus {probe: "step-less"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 1} findings
Then the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 5}
Then the graph omits the Spec {absentId: "spec:fixture.step-less"}
```
