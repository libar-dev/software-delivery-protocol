---
id: spec:consumers.design-review.pure-projection
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.design-review
  verifies: spec:consumers.design-review
---
# The view is the graph read twice, and the corpus is untouched by reading it

## Intent
- outcome: Execute the parent's own law — an index beside a page per Spec and per Pack, a finding rendered as data, byte-identical repeat renders, and nothing written anywhere.

```gwt
Given an extraction root holding a Pack, its member Specs, and one member the checks warn about
When the Design Review renders the graph derived from that root
Then the page set holds the index page {indexPage: "index.md"}, one page per Spec, and one page per Pack
Then the page {packPage: "pack/orders-v1.md"} renders its members in context
Then the page {specPage: "spec/orders.create-order.empty-cart.md"} renders the finding {findingId: "conformance/verifies-linkage"} as data
Then a second render from a freshly derived graph is byte-identical: {byteIdentical: true}
Then the render leaves the extraction root byte-identical: {rootUntouched: true}
```
