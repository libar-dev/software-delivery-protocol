---
id: spec:carrier.gherkin-authoring.unbound-ready-refused
kind: example
altitude: story
readiness: ready
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
Then validation reports {findingCount: 3} findings
Then the report contains finding {findingId: "honesty/readiness-floor"}
Then the graph contains the Spec {specId: "spec:fixture.unbound-ready"} with kind {specKind: "example"}
```
