---
id: spec:carrier.gherkin-authoring.multi-finding-bounded
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# Multiple findings exclude one carrier and keep a healthy sibling

## Intent
- outcome: Prove independent semantic Gherkin findings accumulate without partial graph insertion while a healthy sibling survives.

```gwt
Given the Gherkin fixture corpus {probe: "multi-finding"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 4} findings
Then the first finding is {findingId: "extract/gherkin-grammar"} at line {line: 1}
Then the graph contains exactly {specCount: 1} Specs
Then the graph omits the Spec {absentId: "spec:fixture.invalid-parent"}
Then no graph edge names the absent Spec {absentId: "spec:fixture.invalid-child"}
Then the graph contains the Spec {specId: "spec:fixture.healthy-sibling"} with kind {specKind: "behavior"}
```
