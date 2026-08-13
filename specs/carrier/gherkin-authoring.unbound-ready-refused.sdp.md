---
id: spec:carrier.gherkin-authoring.unbound-ready-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# A ready example with an unbound used slot is refused

## Intent
- outcome: Prove Gherkin-authored examples share the existing readiness floor and concreteness law without carrier exceptions.

```gwt
Given the Gherkin fixture corpus {probe: "unbound-ready"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 1} findings
Then the first finding is {findingId: "honesty/readiness-floor"} at line {line: 11}
Then the graph contains the Spec {specId: "spec:fixture.unbound-ready"} with kind {specKind: "example"}
```
