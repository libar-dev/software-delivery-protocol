---
id: spec:observation.run-evidence.absolute-path-joins
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:observation.run-evidence
  verifies:
    target: spec:observation.run-evidence
    exercises: [graphUntouched, fileGrain, ctrfInput, pathNormalization]
---
# A test whose reporter wrote an absolute path joins its anchored file

## Intent
- outcome: Execute the file-grain join through path normalization, and hold the graph untouched by it.
- assumption: The world writes a root with one Spec and one test file holding a `specTest` anchor that verifies it, derives the graph, keeps the Spec's delivery facts, runs recipe 45's shipped body with one CTRF report holding the one test, and compares the Spec's delivery facts in a graph derived again afterwards.

```gwt
Given a CTRF report whose test {testName: "renders the page"} names the file {filePath: "/home/runner/work/repo/repo/test/page.test.ts"} and reports the result {status: "passed"}
Given the graph holds a test anchor in the file {anchorFile: "test/page.test.ts"} that verifies {specId: "spec:probe.page"}
When recipe 45 reads the report
Then the test joins the file {joinedFile: "test/page.test.ts"}
Then the test is unjoined for the reason {reason: "none"}
Then the delivery facts of the verified Spec are unchanged: {factsUnchanged: true}
```
