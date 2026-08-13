---
id: spec:carrier.gherkin-authoring.parent-child-extraction
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# A Feature and Scenario enter the graph as parent and child

## Intent
- outcome: Prove Gherkin nesting produces one behavior parent, one example child, and the two declared parent relations.

```gwt
Given the Gherkin fixture corpus {probe: "parent-child/basic"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 0} findings
Then the graph contains exactly {specCount: 2} Specs
Then the graph contains the Spec {specId: "spec:fixture.gherkin-parent"} with kind {specKind: "behavior"}
Then the graph contains the child Spec {childId: "spec:fixture.gherkin-child"} with kind {specKind: "example"}
Then the child Spec {childId: "spec:fixture.gherkin-child"} declares {relationType: "refines"} to {relationTarget: "spec:fixture.gherkin-parent"}
Then the child Spec {childId: "spec:fixture.gherkin-child"} declares the additional relation {relationType: "verifies"} to {relationTarget: "spec:fixture.gherkin-parent"}
```
