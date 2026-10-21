---
id: spec:extraction.entry-citations.unanchored-file-unread
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:extraction.entry-citations
  verifies:
    target: spec:extraction.entry-citations
    exercises: [anchoredFilesOnly]
---
# A file that carries no anchor is not read for citations

## Intent
- outcome: Execute the anchored-file rule on a test file with no anchor that names a pinned declaration's address.
- assumption: The world writes the probe corpus of the test-title example and the same test file without its test anchor, derives the graph and reads the Spec context's entry citations.

```gwt
Given a probe corpus whose Spec pins the declaration {declaration: "spec:probe.one#design.typeOne"}
Given a test file that {anchored: "carries no anchor"} and names the address {address: "spec:probe.one#design.typeOne"} in a test title on line {line: 9}
When the graph is derived
Then the Spec context lists {citations: 0} entry citations
Then the citation {recorded: "is not recorded"}
```
