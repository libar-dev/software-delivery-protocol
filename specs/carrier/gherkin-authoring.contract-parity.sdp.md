---
id: spec:carrier.gherkin-authoring.contract-parity
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:carrier.gherkin-authoring
  verifies: spec:carrier.gherkin-authoring
---
# Markdown and Gherkin twins derive equal graphs and contracts

## Intent
- outcome: Prove the Gherkin carrier derives the same graph and generated contract semantics as its Markdown twin.

```gwt
Given the Gherkin fixture corpus {probe: "parity"}
When the fixture corpus is extracted and validated
Then extraction reports {findingCount: 0} findings
Then the graph for {parityLeft: "twin.sdp.md"} equals the graph for {parityRight: "twin.feature"}
Then the contracts for {parityLeft: "twin.sdp.md"} equal the contracts for {parityRight: "twin.feature"}
```
