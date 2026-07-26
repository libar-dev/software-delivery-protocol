---
id: spec:consumers.binding-language-views
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.design-review
  decidedBy: spec:decisions.binding-not-liveness
---
# Views speak binding language, never the internal fact name

## Intent
- outcome: Keep a reader from reading a delivery fact as a liveness claim the graph never made.

## Rule
- The delivery-fact names stay internal. They are the graph's own vocabulary and the drift queries read them; no rendered surface shows one as user-facing label text.
- A spec page's bindings block renders four labelled lines — implementation binding, verifier binding, expected-outcome oracle, and runtime observation.
- The three binding lines read present or none, and nothing else: what a binding says is that a resolving anchor exists, so the reader is offered existence rather than a degree.
- Runtime observation always reads not tracked. No delivery fact records it, and the view states the absence instead of leaving a reader to infer it from a missing line.
- The pack member table and the index table carry the same two binding columns, with the same present and none values, so the aggregate surfaces speak the page's language rather than a shorthand of their own.
- The model half of this rule — that a binding states existence and never liveness — belongs to the decision this Spec is shaped by; what is stated here is only what the views render.
- The realizing entrypoints are `renderBindings` in `src/projections/design-review-context.ts` and the member and index tables in `src/projections/design-review-pages.ts`.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string} bound by {bindings:"an implementing code anchor and a verifying test anchor"|"no anchor at all"}
When the Design Review renders the graph
Then the spec page renders the implementation binding as {implementation:"present"|"none"}
Then the spec page renders the verifier binding as {verifier:"present"|"none"}
Then the spec page renders the runtime observation as {observation:string}
Then the index table repeats those binding values for the spec: {tableRepeats:boolean}
Then the internal delivery-fact name {factName:string} appears as rendered label text: {factNameRendered:boolean}
```
