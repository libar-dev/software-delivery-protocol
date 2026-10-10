---
id: spec:observation.run-evidence
kind: behavior
altitude: feature
readiness: scoped
relations:
  dependsOn: spec:extraction.delivery-facts
  decidedBy: spec:decisions.binding-not-liveness
---
# CI run records are joined to verifiers in a view

The original design ingested test reports into the graph. Each run became a node with its result and duration, and a passing run marked its Spec verified (`docs/lineage/v0-design/06-extraction-and-validation.md` §11.2; `08-delivery-evidence-and-tooling.md` §2, §3.2). The binding-not-liveness decision rules otherwise. `has-verifier` says a resolving verifier binding exists, and pass and fail stay in CI. The vision document says test run verdicts are never ingested (`docs/concept/00-vision-scope-and-mvp-boundary.md`). Read literally, that keeps them out of every view; this Spec reads it as keeping them out of the graph. The runtime overlay holds the other half of the original's evidence layer, runtime observations against measurable targets, which aims at the `observed` fact; run evidence derives no fact at all.

The first adopter keeps run records anyway, one JSON file per run with its tier, target, commit, whether the tree was clean, and each test's file, name, result and duration (`libar-platform/evidence/runs/`). It asks to see them beside the bindings as a separately identified input, joined by verifier, with commit, tier, composition and target, and a note when the run predates the source being read (`libar-platform/docs/feedback/sdp-feedback-02.md`, item 25). The Spec Studio's verification panels and its tests lens each hold a question on whether to show run results read from CI output; this Spec is the answer they wait on.

## Intent
- problem: A reader who wants to know whether a bound verifier passed has to leave the Protocol's views for CI, and an adopter that keeps run records has no view that shows them beside the binding without mistaking them for a delivery fact.
- outcome: Show a verifier's recorded runs beside its binding in a view, labelled as external input with its commit, while the graph keeps recording only that the binding exists.

### Open questions
- [blocking #joinKey] What joins a run record to a verifier: the test anchor's id, which no reporter prints, the test file the anchor sits in, or a name the adopter maps? The adopter's records carry a file and a test name.
- [blocking #recordShape] Which run records does the Protocol read: a schema of its own, a common reporter format, or any shape an adopter maps through a recipe parameter?
- [non-blocking #freshness] How does a view say a run is stale: by its commit against the commit being read, or by whether the bound files changed between the two?

## Behavior
- rule: Run records are an input a view reads beside the graph, named by the caller; the graph never holds them, and no node, edge or delivery fact derives from them.
- rule: A view shows each run joined to the verifier it exercised, with its result, its commit and the input it came from, labelled as external run evidence and never as `has-verifier` or `implemented`.
- rule: A run whose commit differs from the commit being read shows both commits, so a reader sees how old it is.
- rule: The Design Review stays a function of the graph alone and shows no run; run evidence appears only in a view that admits external input, such as a recipe that takes the records as a parameter, or the Studio.
