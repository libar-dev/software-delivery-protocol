---
id: spec:model.anchors.lookalike-refusal
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:model.anchors
  verifies: spec:model.anchors
---
# A consumer-local lookalike builder mints no anchor and no finding

## Intent
- outcome: Execute the builder-trust law where a repository's own module merely resembles the Protocol builders.

```gwt
Given a repository whose one source file builds an anchor through {builderSource: "a consumer-local lookalike module"}
When the repository is extracted
Then the extraction mints {anchorCount: 0} anchors
Then the extraction reports {findingCount: 0} findings
```
