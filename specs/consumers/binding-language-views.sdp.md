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

The binding-not-liveness decision owns what a binding asserts; this Spec states the labels the views render.

## Intent
- outcome: Keep a reader from reading a delivery fact as a liveness claim the graph never made.

## Rule
- No Design Review page labels a binding with a delivery-fact name; the drift queries read those names, and the census lists them as values of the graph's runtime taxonomy.
- A Spec page's bindings block renders four labelled lines — implementation binding, verifier binding, expected-outcome oracle, and runtime observation.
- The three binding lines read present or none, and nothing else: what a binding says is that a resolving anchor exists, so the reader is offered existence rather than a degree.
- Runtime observation always reads not tracked. The graph does not derive the designed observed fact, and the view states the absence instead of leaving a reader to infer it from a missing line.
- [#aggregateColumns] The Pack member table and the index table carry the same two binding columns, with the same present and none values, so the aggregate surfaces speak the page's language rather than a shorthand of their own.

## Example space
```gwt-vocabulary
Given the graph holds a spec {specId:string} bound by {bindings:"an implementing code anchor and a verifying test anchor"|"no anchor at all"}
Given the graph holds a pack {packId:string} listing that spec beside an unbound member
When the Design Review renders the graph
Then the spec page renders the implementation binding as {implementation:"present"|"none"}
Then the spec page renders the verifier binding as {verifier:"present"|"none"}
Then the spec page renders the runtime observation as {observation:string}
Then the index table repeats those binding values for the spec: {tableRepeats:boolean}
Then the pack member table repeats those binding values for the spec: {memberTableRepeats:boolean}
Then the internal delivery-fact name {factName:string} appears as rendered label text: {factNameRendered:boolean}
```
