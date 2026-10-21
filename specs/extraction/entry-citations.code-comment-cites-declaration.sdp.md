---
id: spec:extraction.entry-citations.code-comment-cites-declaration
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:extraction.entry-citations
  verifies:
    target: spec:extraction.entry-citations
    exercises: [anchoredFilesOnly, declarationLines]
---
# A code file's comment cites a declaration without reading as a test line

## Intent
- outcome: Execute the test-line rule on a source file that carries a code anchor and names a pinned declaration's address in a comment.
- assumption: The world writes the probe corpus of the test-title example and a source file whose comment-form code anchor references that Spec and whose line comment, on the line the step names, holds the address. It derives the graph and reads the Spec context's entry citations, the row's `resolves`, its `anchors`, which name the code anchor, and its `testAnchors`, which are empty.

```gwt
Given a probe corpus whose Spec pins the declaration {declaration: "spec:probe.one#design.typeOne"}
Given a source file that {anchored: "carries a code anchor referencing the Spec"} and names the address {address: "spec:probe.one#design.typeOne"} on line {line: 9}
When the graph is derived
Then the Spec context lists {citations: 1} entry citations
Then the citation {recorded: "resolves"}
Then the citing line reads as a test line: {testLine: false}
```
