---
id: spec:consumers.agent-surface.evaluation-sink.unknown-recipe
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface.evaluation-sink
  verifies:
    target: spec:consumers.agent-surface.evaluation-sink
    exercises: [callRefusals]
---
# A call to a recipe the catalog does not hold fails the body

## Intent
- outcome: Execute a call to a recipe number the catalog does not list through `sdp q` and read the rejection.
- assumption: The world writes the probe corpus of the recipe-call example and runs `sdp q` on its root with the body `return recipes(99);`. It reads the exit code and the one stderr line, and takes the rejection as that line's text after `sdp q: `.

```gwt
Given a probe corpus in which two Specs depend on each other through dependsOn
Given a body that calls {call: "a recipe number the catalog does not hold"}
When the body runs {entrance: "through sdp q"}
Then the call {outcome: "rejects"}
Then the rejection reads {rejection: "recipes: the catalog holds no recipe 99"}
```
