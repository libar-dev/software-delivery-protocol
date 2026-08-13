---
id: spec:carrier.gherkin-authoring.example-space-extraction
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# The pseudo-scenario supplies example space without a node

## Intent
- outcome: Prove the Gherkin example-space pseudo-scenario populates the parent vocabulary and is withheld from graph identity.

```gwt
Given the Gherkin fixture corpus {probe: "example-space"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 0} findings
Then the graph contains exactly {specCount: 2} Specs
Then the parent example space contains {spaceStep: "Given a cart containing {item:string}"}
Then the graph omits the Spec {absentId: "spec:fixture.example-space"}
```
