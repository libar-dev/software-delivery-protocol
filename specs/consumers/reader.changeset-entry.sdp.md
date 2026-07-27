---
id: spec:consumers.reader.changeset-entry
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.reader
  verifies: spec:consumers.reader
---
# A changeset names what it reaches, why, and what it cannot see

## Intent
- outcome: Execute the changeset entry on a mixed changeset, so the impacted reason, the one-hop at-risk edge with its claim, and the coverage-unknown file are all read from one answer.

```gwt
Given a reader built over the graph a real extraction derives from the probe root
Given the source file {boundFile: "src/create-order.ts"} carries the binding {bindingId: "impl:orders.create-order"}
Given the changeset also holds the file {unrecordedFile: "src/price-book.ts"} the graph records nothing at
When the reader answers the {entry: "changeset"} entry
Then the impacted specs name {impactedSpecId: "spec:orders.create-order"} through the binding {impactBindingId: "impl:orders.create-order"} at claim {impactClaim: "anchored"}
Then the one-hop at-risk neighbors name {atRiskId: "spec:orders.order-management"} through the edge {atRiskEdge: "refines"} at claim {atRiskClaim: "declared"}
Then the at-risk neighbors number {atRiskCount: 4}
Then the coverage-unknown files name {coverageUnknownFile: "src/price-book.ts"}
Then the coverage-unknown files number {coverageUnknownCount: 1}
```
