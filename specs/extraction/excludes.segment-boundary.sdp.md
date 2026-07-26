---
id: spec:extraction.excludes.segment-boundary
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:extraction.excludes
  verifies: spec:extraction.excludes
---
# A prefix excludes its own tree and leaves a similar sibling standing

## Intent
- outcome: Execute the segment-boundary rule across both discovery surfaces.

```gwt
Given the extraction root carries the tree {excludedTree: "foo"} and the similar sibling {similarTree: "foobar"}
Given the consumer supplies the exclusion {exclusion: "foo"}
When the root is discovered
Then the discovery attempt {outcome: "completes"}
Then the surviving spec carrier is {specCarrier: "foobar/included.sdp.ts"} and the surviving anchor candidate is {anchorCandidate: "foobar/helper.ts"}
```
