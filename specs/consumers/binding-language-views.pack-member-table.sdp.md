---
id: spec:consumers.binding-language-views.pack-member-table
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.binding-language-views
  verifies: spec:consumers.binding-language-views
---
# The pack member table speaks the page's binding language, not a shorthand

## Intent
- outcome: Execute the aggregate half of the rule on the surface a reviewer reads a whole pack from, where a two-column yes/no shorthand would be cheapest to reach for.

```gwt
Given the graph holds a spec {specId: "spec:probe.bound-surface"} bound by {bindings: "an implementing code anchor and a verifying test anchor"}
Given the graph holds a pack {packId: "pack:probe.review-aggregate"} listing that spec beside an unbound member
When the Design Review renders the graph
Then the pack member table repeats those binding values for the spec: {memberTableRepeats: true}
Then the internal delivery-fact name {factName: "implemented"} appears as rendered label text: {factNameRendered: false}
```
