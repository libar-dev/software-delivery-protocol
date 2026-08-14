---
id: spec:carrier.gherkin-authoring.description-location-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# A bad description key reports its physical source line

## Intent
- outcome: Prove Gherkin description diagnostics point at the exact physical line after blanks and comments rather than at a parser-relative offset.

```gwt
Given the Gherkin fixture corpus {probe: "description-location-refusal"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 1} findings
Then the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 6}
Then the graph omits the Spec {absentId: "spec:fixture.desc-loc-refusal"}
```
