---
id: spec:consumers.agent-surface.demand-map-entries
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface
  verifies: spec:consumers.agent-surface
---
# One body reaches every entry point the demand map names, and no symbol entry

## Intent
- outcome: Execute the demand map end to end — a string, a file, and a changeset each answered through the front door — and read the deferred symbol entry as honestly absent.

```gwt
Given an extraction root the front door derives in process on the invocation
Given the agent holds the concept {concept: "backorder"}, the file {file: "src/create-order.ts"}, and a changeset that also touches the unrecorded file {unrecordedFile: "src/price-book.ts"}
When the agent scripts a body {body: "reaching every entry point the demand map names"} through the front door
Then the front door exits {exitCode: 0} with an empty error stream
Then the concept entry answers with the spec {conceptSpecId: "spec:orders.order-management"}
Then the file entry answers with the spec {fileSpecId: "spec:orders.create-order"}
Then the changeset entry answers with the impacted spec {changesetSpecId: "spec:orders.create-order"}
Then the surface offers a symbol entry: {symbolEntry: false}
```
