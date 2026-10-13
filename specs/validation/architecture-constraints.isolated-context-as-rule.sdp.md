---
id: spec:validation.architecture-constraints.isolated-context-as-rule
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.architecture-constraints
  verifies:
    target: spec:validation.architecture-constraints
    exercises: [walk, walkAsRule]
---
# The walk named as a rules file fails validation on an isolation breach

## Intent
- outcome: Execute the walk's shipped recipe file, unchanged, as a rules file under `sdp validate --rules` on one `uses` edge that leaves an isolated context.
- assumption: The world writes the probe root of the forbidden-pair example, with the layers and contexts the slots give. It runs `sdp validate` on that root with the walk's shipped recipe file named by `--rules` and followed by `--params` with the parameters of that example. The findings are the lines in that file's corpus section, and the rule ids are their rule ids joined by a comma and a space, in output order.

```gwt
Given a member of a component at the layer {fromLayer: "application"} in the context {fromContext: "platform"} that uses a member of a component at the layer {toLayer: "adapter"} in the context {toContext: "orders"}
When the architecture walk runs {invocation: "as a rules file named by sdp validate --rules"} with the forbidden pair domain to infrastructure and the isolated context platform
Then the walk reports {findings: 1} findings with the rule ids {ruleIds: "isolated-context"}
Then the command exits {exitCode: 1}
```
