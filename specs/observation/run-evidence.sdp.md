---
id: spec:observation.run-evidence
kind: behavior
altitude: feature
readiness: defined
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

An adopter that keeps CI run reports needs to read them beside verifier bindings as a separately named input. The view identifies the input and its commit and distinguishes evidence from a test file from a verdict for one anchored verifier. The freshness question records what remains unsettled about comparing a run with the source being read.

## Intent
- problem: A reader who wants to know whether a bound verifier passed has to leave the Protocol's views for CI, and an adopter that keeps run records has no view that shows them beside the binding without mistaking them for a delivery fact.
- outcome: Show a verifier's recorded runs beside its binding in a view, labelled as external input with its commit, while the graph keeps recording only that the binding exists.

### Open questions
- [non-blocking #freshness] How does a view say a run is stale: by its commit against the commit being read, or by whether the bound files changed between the two?
  - decider: owner
  - provisional: Display the run and source commit identifiers when they differ, as the differing-commit rule requires; whether freshness also follows changes to bound files remains open.
- [non-blocking #recipeContract] Which parameter and result shapes, CTRF revision and run-commit field, corpus-commit input, input label, and file-path normalization rule define the run-evidence recipe, and how does it report a record that joins no test anchor, or missing commit or path information?
  - decider: owner
  - provisional: Records stay external, join only through the named test file, and confer no delivery fact; the ruled contract lands as keyed Design entries before the view is built.
- [non-blocking #studioRuns] Should a later Studio phase admit run records beside the graph, and which input and reproducibility contracts would that require?
  - decider: owner
  - provisional: The Studio's first build stays graph-only; a later phase may admit named run records under its own input and reproducibility contract.

## Behavior
- rule: [#graphUntouched] Run records are an input a view reads beside the graph, named by the caller; the graph never holds them, and no node, edge or delivery fact derives from them.
- rule: [#fileGrain] A run record joins every verifier whose test anchor sits in the test file the record names, because the file is the binding grain of both anchor forms; each test name in the record shows as a row under that verifier. The join is at file grain: a result is evidence from the verifier's file, never the result of that verifier, because a file may hold several suites and a filtered run may exercise only one.
- rule: [#ctrfInput] The Protocol reads run records in the Common Test Report Format, CTRF, an open JSON schema with reporters for the common test runners, passed to a view as a recipe parameter. A record joins only when its reporter fills CTRF's optional `filePath` field, and an adopter with records of another shape maps them into CTRF itself.
- rule: A view shows each run beside the verifiers anchored in its file, with its result, its commit and the input it came from, labelled as external run evidence from that file and never as `has-verifier`, `implemented` or a pass verdict for one verifier.
- rule: A run whose commit differs from the commit being read shows both commits, so a reader sees how old it is.
- rule: The Design Review stays a function of the graph alone and shows no run; run evidence appears only in a view that explicitly admits records as external input, such as a recipe that takes them as a parameter. The Studio's first build reads no run evidence.
