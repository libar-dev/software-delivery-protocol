---
id: spec:observation.run-evidence.unanchored-file-unjoined
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:observation.run-evidence
  verifies:
    target: spec:observation.run-evidence
    exercises: [graphUntouched, unjoinedReported]
---
# A test in a file with no test anchor is reported as unjoined

## Intent
- outcome: Execute the unjoined report for a record whose file holds no test anchor.
- assumption: The world writes a root with one Spec and one test file holding a `specTest` anchor that verifies it, and a CTRF report whose one test names another file; it runs recipe 45's shipped body and reads the joined files and the unjoined rows, and compares the Spec's delivery facts before and after.

```gwt
Given a CTRF report whose test {testName: "counts the rows"} names the file {filePath: "test/other.test.ts"} and reports the result {status: "failed"}
Given the graph holds a test anchor in the file {anchorFile: "test/page.test.ts"} that verifies {specId: "spec:probe.page"}
When recipe 45 reads the report
Then the test joins the file {joinedFile: ""}
Then the test is unjoined for the reason {reason: "noTestAnchor"}
Then the delivery facts of the verified Spec are unchanged: {factsUnchanged: true}
```
