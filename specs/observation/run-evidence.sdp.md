---
id: spec:observation.run-evidence
kind: behavior
altitude: feature
readiness: ready
relations:
  dependsOn:
    - target: spec:extraction.delivery-facts
      reason: the view reads verifier bindings while leaving their delivery facts unchanged
    - target: spec:consumers.agent-surface.recipe-parameters
      reason: the caller passes run records to the recipe as data
  decidedBy: spec:decisions.binding-not-liveness
---
# CI run records are joined to verifiers in a view

The original design put test reports in the graph and used passing runs to mark verification. The Protocol keeps run verdicts in CI. A resolving verifier binding confers `has-verifier`; showing a recorded run beside that binding confers no delivery fact. Runtime observation against a measurable target is a separate concern carried by the runtime overlay.

An adopter that keeps CI run reports needs to read them beside verifier bindings as a separately named input. Recipe 45 reads them, and the Studio admits them as one of its two named inputs. The view identifies each run by its own fields and its commit, and distinguishes evidence from a test file from a verdict for one anchored verifier. Test reporters write a test's file as an absolute path or a path from the directory they ran in, so the join reads a path's end as well as the whole path. The freshness question records what remains unsettled about comparing a run with the source being read.

## Intent
- problem: A reader who wants to know whether a bound verifier passed has to leave the Protocol's views for CI, and an adopter that keeps run records has no view that shows them beside the binding without mistaking them for a delivery fact.
- outcome: Show a verifier's recorded runs beside its binding in a view, labelled as external input with its commit, while the graph keeps recording only that the binding exists.

### Open questions
- [non-blocking #freshness] How does a view say a run is stale: by its commit against the commit being read, or by whether the bound files changed between the two?
  - decider: owner
  - provisional: Display the run and source commit identifiers when they differ, as the differing-commit rule requires; whether freshness also follows changes to bound files remains open.

## Behavior
- rule: [#graphUntouched] Run records are an input a view reads beside the graph, named by the caller; the graph never holds them, and no node, edge or delivery fact derives from them.
- rule: [#fileGrain] A run record joins every verifier whose test anchor sits in the test file the record names, because the file is the binding grain of both anchor forms; each test name in the record shows as a row under that verifier. The join is at file grain: a result is evidence from the verifier's file, never the result of that verifier, because a file may hold several suites and a filtered run may exercise only one.
- rule: [#ctrfInput] The Protocol reads run records in the Common Test Report Format, CTRF, an open JSON schema with reporters for the common test runners, passed to a view as a recipe parameter. A record joins only when its reporter fills CTRF's optional `filePath` field, and an adopter with records of another shape maps them into CTRF itself.
- rule: [#pathNormalization] A record's file path joins a test anchor's file when, with each backslash written as a slash and a leading `./` removed, it equals that file or ends with a slash followed by that file; when several anchored files match, the longest joins.
- rule: [#unjoinedReported] A record that names no file path, or a file that holds no test anchor, is reported as unjoined with its reason, never dropped, and an input that is not a CTRF report is reported with its problem while the other inputs still join.
- rule: [#commitField] A run's commit is CTRF's `results.environment.commit`, and a run without one reads `not recorded`; given the commit being read, the recipe says for each run whether its commit is that commit, and never says the run is fresh or stale.
- rule: A view shows each run beside the verifiers anchored in its file, with its result, its commit and the input it came from, labelled as external run evidence from that file and never as `has-verifier`, `implemented` or a pass verdict for one verifier.
- rule: A run whose commit differs from the commit being read shows both commits, so a reader sees how old it is.
- rule: [#studioInput] The Design Review stays a function of the graph alone and shows no run; run evidence appears only in a view that explicitly admits records as external input: recipe 45, and the Studio built with run records, which shows them on its runs page, in its tests lens and on the Spec pages of the Specs their files verify.

## Design
- runsRecipe: recipe 45, run evidence, takes `params.runs`, one CTRF report or a list of them in input order, required; `params.commit`, the commit being read, optional; and `params.spec`, a Spec id, optional, which keeps only the files whose test anchors verify that Spec directly or through an enabled example. It returns `{ inputs, diagnostics, totals, files, unjoined }`, and `{ diagnostics }` alone when `params.runs` is missing or holds no report it can read.
- ctrfFields: the recipe reads `reportFormat` and `specVersion`; `results.tool.name` and `version`; `results.summary` with `tests`, `passed`, `failed`, `skipped`, `pending`, `other`, `start` and `stop`; `results.environment` with `commit`, `branchName`, `buildName` and `buildNumber`; and per test `name`, `status`, `duration`, `filePath` and `suite`; it reads no other field. A readable CTRF report has `reportFormat: "CTRF"` and a `specVersion`, as the CTRF schema requires; a report missing either produces a run diagnostic and contributes no run rows.
- runInput: `{ index: number; tool: string | null; toolVersion: string | null; specVersion: string; commit: string | null; branch: string | null; build: string | null; start: number | null; stop: number | null; summary: { tests: number; passed: number; failed: number; skipped: number; pending: number; other: number }; sameCommit: boolean | null }`, one per readable report, `index` its position from 0, `build` the build name and number joined by a space, and `sameCommit` null without `params.commit` or without a run commit.
- runFile: `{ file: string; anchors: { id: string; verifies: string[] }[]; specs: string[]; results: { input: number; name: string; suite: string | null; status: string; duration: number | null }[] }`, one per anchored test file a record joins, sorted by file, `specs` the Specs its anchors verify directly or through an enabled example, sorted, and `results` in input order and then record order, `suite` the record's suite path joined by ` > `.
- unjoinedRow: `{ input: number; name: string; filePath: string | null; status: string; reason: "noFilePath" | "noTestAnchor" }`, in input order and then record order.
- runDiagnostic: `{ input: number | null; problem: string }`, for a missing `params.runs`, with `input` null, or for an input that is not an object, has no `results.tests` list, lacks `reportFormat` or `specVersion`, or names a `reportFormat` other than `CTRF`.
- runTotals: `{ inputs: number; tests: number; joined: number; unjoined: number; files: number; specs: number }`, counting the readable reports, every test they hold, the tests joined and unjoined, the files joined, and the distinct Specs those files verify.

## Example space
```gwt-vocabulary
Given a CTRF report whose test {testName:string} names the file {filePath:string} and reports the result {status:"passed"|"failed"|"skipped"}
Given the graph holds a test anchor in the file {anchorFile:string} that verifies {specId:string}
When recipe 45 reads the report
Then the test joins the file {joinedFile:string}
Then the test is unjoined for the reason {reason:"none"|"noFilePath"|"noTestAnchor"}
Then the delivery facts of the verified Spec are unchanged: {factsUnchanged:boolean}
```
