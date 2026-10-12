---
id: spec:carrier.gherkin-authoring.unbound-ready-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.gherkin-authoring
  verifies:
    - spec:carrier.gherkin-authoring
    - spec:validation.kind-evidence
---
# A Gherkin example with an unbound used slot fails its stated readiness floor

## Intent
- outcome: Execute the readiness floor on a Gherkin-carried example whose used step leaves a slot unbound.

```gwt
Given the Gherkin fixture corpus {probe: "unbound-ready"}
When the fixture corpus is extracted and validated
Then validation reports {findingCount: 3} findings
Then the report contains finding {findingId: "honesty/readiness-floor"}
Then the graph contains the Spec {specId: "spec:fixture.unbound-ready"} with kind {specKind: "example"}
```
