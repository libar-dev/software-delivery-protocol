---
id: spec:consumers.agent-surface.evaluation-sink.recipe-call
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface.evaluation-sink
  verifies:
    target: spec:consumers.agent-surface.evaluation-sink
    exercises: [fifthBinding, recipeCall]
---
# A body calls a shipped recipe and returns its answer unchanged

## Intent
- outcome: Execute a recipe call through `sdp q` and compare its answer with the answer of the recipe's shipped file over the same graph.
- assumption: The world writes a probe corpus of two story-altitude behavior Specs, each stating `idea` with an Intent outcome and each declaring `dependsOn` on the other. It runs `sdp q --json` on the probe root with the body `return recipes(26);`, then runs `sdp q --json` on the same root with the text of `dist/recipes/26-dependency-cycles.js` as the body, and compares the two printed answers.

```gwt
Given a probe corpus in which two Specs depend on each other through dependsOn
Given a body that calls {call: "recipe 26 with no parameters"}
When the body runs {entrance: "through sdp q"}
Then the call {outcome: "resolves"}
Then the answer equals the shipped recipe file's own answer over the same graph and parameters: {sameAnswer: true}
```
