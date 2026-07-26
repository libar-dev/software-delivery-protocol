---
id: spec:extraction.excludes.refused-path
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:extraction.excludes
  verifies: spec:extraction.excludes
---
# A Windows-drive absolute path is refused rather than normalized

## Intent
- outcome: Execute the refusal rule on an exclusion that cannot name a root-relative prefix.

```gwt
Given the extraction root carries the tree {excludedTree: "foo"} and the similar sibling {similarTree: "foobar"}
Given the consumer supplies the exclusion {exclusion: "C:/work/specs"}
When the root is discovered
Then the discovery attempt {outcome: "is refused"}
Then the refusal states {diagnostic: "normalizeExcludes: invalid exclusion path"} and names the offending path
```
