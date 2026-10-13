---
id: spec:validation.architecture-constraints.unstated-layer-unclassified
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.architecture-constraints
  verifies:
    target: spec:validation.architecture-constraints
    exercises: [unclassified]
---
# A component with no layer leaves its edge unclassified

## Intent
- outcome: Execute the walk through `sdp q` on one `uses` edge whose used component states no layer.
- assumption: The world writes the probe root of the forbidden-pair example, except that the used component's anchor states no layer, which the `unstated` value names. It runs the walk as that example does; an empty rule-id string names no finding.

```gwt
Given a member of a component at the layer {fromLayer: "domain"} in the context {fromContext: "platform"} that uses a member of a component at the layer {toLayer: "unstated"} in the context {toContext: "platform"}
When the architecture walk runs {invocation: "through sdp q"} with the forbidden pair domain to infrastructure and the isolated context platform
Then the walk reports {findings: 0} findings with the rule ids {ruleIds: ""}
Then the walk lists {unclassified: 1} unclassified edges
Then the command exits {exitCode: 0}
```
