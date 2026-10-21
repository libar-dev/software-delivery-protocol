---
id: spec:consumers.spec-studio.runs-page
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - target: spec:observation.run-evidence
      reason: the page renders the run evidence recipe 45 joins from the run records
    - target: spec:consumers.spec-studio.data.inputs
      reason: the run records reach the page as the build's named runs input
  decidedBy: spec:decisions.binding-not-liveness
---
# The runs page shows the run records the build was given, joined to test files

CI keeps the results of its test runs; the graph records only that a verifier is bound. Given run records in the Common Test Report Format, the build shows each run and the test files it joins, so a reviewer reads what ran where the verifiers are anchored. A result is evidence from a file, never the verdict of one verifier, and never a delivery fact.

## Intent
- outcome: Let a person read, from a link, the test runs the build was given, which anchored test files each joins, and which records join none, each labelled as external evidence.

## Behavior
- rule: [#onlyWithRuns] The page set holds `runs.html` only when the build was given run records; without them, no page, link or row names a run.
- rule: [#namesEachRun] The page names each run by its position among the inputs and its own fields: its tool and version, its build name and number, its branch, its commit, and its start and stop times as recorded, a field the record lacks reading `not recorded`.
- rule: [#externalEvidence] Every place a run shows, on this page, in the tests lens and on a Spec page, says in words that it is external run evidence from a test file, and none says that a Spec or a verifier passed.
- rule: [#runSections] For each run the page shows how many of its tests passed, failed, were skipped, pending or other, in words, then each test file it joins, with the test anchors in that file, the Specs they verify, linked, and each test's name, suite, result in words and duration, then the records that join no test anchor, each with its reason, no file path or no test anchor in that file.
- rule: [#commitShown] Each run shows its commit, and the page never says a run is fresh or stale; a stamp present beside the page set names the corpus commit the publishing step recorded, so a reader compares the two.
- rule: [#diagnosticsShown] An input recipe 45 cannot read as a run record shows with its problem, and the other inputs still show.
- rule: [#packPageSentence] Given run records, the sentence over a Pack page's members with no verifier binding also says that the runs page, the tests lens and the Spec pages of the Specs their files verify show the run records as external evidence from test files; it never says that no page shows a run result.

## UI
- runHeader: `Run <n>: external run evidence from <tool> <version>`, `<n>` the input's position counting from 1 and the version left out when the record names none, then a line with the build, branch, commit and times, each labelled, a time written as an ISO 8601 UTC time from the milliseconds the record holds.
- fileRow: the file as text with a copy action, the anchors in it as code, the Specs they verify as links, then a table of results with columns name, suite, result and duration.
- unjoinedRow: the test's name, its file path or `no file path`, its result in words, and the reason.

## Example space
```gwt-vocabulary
Given one CTRF report whose tool is {tool:string} at version {version:string}, and whose tests in an anchored test file {passed:number} passed and {failed:number} failed
When the build renders the runs page
Then the run's heading reads {heading:string}
Then the page lists {rows:number} results under that test file
Then a page says that a Spec or a verifier passed: {verdict:boolean}
```
