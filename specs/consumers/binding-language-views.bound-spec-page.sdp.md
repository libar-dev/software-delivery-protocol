---
id: spec:consumers.binding-language-views.bound-spec-page
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.binding-language-views
  verifies: spec:consumers.binding-language-views
---
# A fully bound spec renders binding language on the page and in the index

## Intent
- outcome: Execute the rendered vocabulary on a spec both anchors reach, where the internal fact name would be easiest to leak.

```gwt
Given the graph holds a spec {specId: "spec:probe.bound-surface"} bound by {bindings: "an implementing code anchor and a verifying test anchor"}
When the Design Review renders the graph
Then the spec page renders the implementation binding as {implementation: "present"}
Then the spec page renders the verifier binding as {verifier: "present"}
Then the spec page renders the runtime observation as {observation: "not tracked"}
Then the index table repeats those binding values for the spec: {tableRepeats: true}
Then the internal delivery-fact name {factName: "implemented"} appears as rendered label text: {factNameRendered: false}
```
