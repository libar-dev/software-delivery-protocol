---
id: spec:validation.architecture-constraints.forbidden-layer-pair
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.architecture-constraints
  verifies:
    target: spec:validation.architecture-constraints
    exercises: [walk]
---
# A domain member that uses an infrastructure member breaks a forbidden pair

## Intent
- outcome: Execute the walk through `sdp q` on one `uses` edge between members of two components whose layers form a forbidden pair.
- assumption: The world writes a probe root with no Spec and two comment-form `component:` anchors, each with one `impl:` member; the using member's anchor `uses` the used member. Each component states the layer and context its slots give, and the Protocol's validators find the root clean. The world runs the walk's shipped recipe file through `sdp q --json` with `params` `{ "forbidden": [{ "from": "domain", "to": "infrastructure" }], "isolated": ["platform"] }`; the rule ids are the findings' `validatorId` values joined by a comma and a space, in answer order.

```gwt
Given a member of a component at the layer {fromLayer: "domain"} in the context {fromContext: "orders"} that uses a member of a component at the layer {toLayer: "infrastructure"} in the context {toContext: "orders"}
When the architecture walk runs {invocation: "through sdp q"} with the forbidden pair domain to infrastructure and the isolated context platform
Then the walk reports {findings: 1} findings with the rule ids {ruleIds: "forbidden-layer"}
Then the walk lists {unclassified: 0} unclassified edges
Then the command exits {exitCode: 0}
```
