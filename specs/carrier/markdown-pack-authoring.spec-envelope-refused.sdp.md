---
id: spec:carrier.markdown-pack-authoring.spec-envelope-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:carrier.markdown-pack-authoring
  verifies: spec:carrier.markdown-pack-authoring
---
# A Spec key on a Pack envelope is refused

## Intent
- outcome: Execute the closed-envelope refusal when a Markdown pack carries a Spec-only key.

```gwt
Given an extraction root holding the pack carrier {carrierSource: "a Markdown pack manifest carrying kind: behavior"}
When the extractor derives the graph
Then the report names the refusal {findingId: "extract/unrecognized-property"} and the graph holds no pack node
```
