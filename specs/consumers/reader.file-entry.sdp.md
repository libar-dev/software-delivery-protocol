---
id: spec:consumers.reader.file-entry
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.reader
  verifies: spec:consumers.reader
---
# A source file reaches the Spec its binding names, and a carrier reaches its own Spec

## Intent
- outcome: Execute the file entry on both halves it has to bridge — a source file the graph records only a binding at, and the carrier a Spec is authored in.

```gwt
Given a reader built over the graph a real extraction derives from the probe root
Given the source file {boundFile: "src/create-order.ts"} carries the binding {bindingId: "impl:orders.create-order"}
When the reader answers the {entry: "file"} entry
Then the file entry names the node {nodeId: "impl:orders.create-order"} the graph records at that path
Then the file entry reaches the spec {reachedSpecId: "spec:orders.create-order"} that binding names
Then the spec carrier {carrierFile: "specs/create-order.sdp.md"} answers with its own spec {carrierSpecId: "spec:orders.create-order"}
```
