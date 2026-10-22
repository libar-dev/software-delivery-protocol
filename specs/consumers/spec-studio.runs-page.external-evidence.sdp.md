---
id: spec:consumers.spec-studio.runs-page.external-evidence
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.runs-page
  verifies:
    target: spec:consumers.spec-studio.runs-page
    exercises: [namesEachRun, externalEvidence, runSections]
---
# The runs page shows a run as external evidence from a test file

## Intent
- outcome: Execute the runs page on one report: the run named by its tool, its results under the test file they join, and no page saying a Spec or a verifier passed.
- assumption: The world writes a root with one Spec and one test file holding a `specTest` anchor that verifies it, writes one CTRF report whose three tests name that file, two passed and one failed, builds the page set with the report as run records, and reads the runs page, then the tests lens and the Spec page for any sentence saying that the Spec or the verifier passed.

```gwt
Given one CTRF report whose tool is {tool: "vitest"} at version {version: "3.2.4"}, and whose tests in an anchored test file {passed: 2} passed and {failed: 1} failed
When the build renders the runs page
Then the run's heading reads {heading: "Run 1: external run evidence from vitest 3.2.4"}
Then the page lists {rows: 3} results under that test file
Then a page says that a Spec or a verifier passed: {verdict: false}
```
