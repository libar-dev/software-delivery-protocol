---
id: spec:model.anchors.physical-identity
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:model.anchors
  verifies: spec:model.anchors
---
# A deep relative import that resolves to the Protocol builders is trusted

## Intent
- outcome: Execute the builder-trust law where trust turns on physical module identity rather than the import's spelling.

```gwt
Given a repository whose one source file builds an anchor through {builderSource: "a relative import resolving to the Protocol builder modules"}
When the repository is extracted
Then the extraction mints {anchorCount: 1} anchors
Then the extraction reports {findingCount: 0} findings
```
