---
id: spec:consumers.agent-surface.evaluation-sink.exported-evaluator
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface.evaluation-sink
  verifies:
    target: spec:consumers.agent-surface.evaluation-sink
    exercises: [exportedEvaluator, oneEvaluator, recipeCall]
---
# A script holding a graph runs a shipped recipe through the exported evaluator

## Intent
- outcome: Execute a recipe call with a parameter through `evaluateBody` over a graph the script derived once, and compare its answer with the recipe's shipped file evaluated over the same graph.
- assumption: The world writes the probe corpus of the recipe-call example and derives its graph once with the package's `extract`. It awaits `evaluateBody` with the body `return recipes(26, { severity: "warning" });` and that graph, then awaits `evaluateBody` with the text of `dist/recipes/26-dependency-cycles.js`, the same graph and the parameters `{ severity: "warning" }`, and compares the two answers. Neither call derives the graph.

```gwt
Given a probe corpus in which two Specs depend on each other through dependsOn
Given a body that calls {call: "recipe 26 with the severity warning"}
When the body runs {entrance: "through the exported evaluator over a graph derived once"}
Then the call {outcome: "resolves"}
Then the answer equals the shipped recipe file's own answer over the same graph and parameters: {sameAnswer: true}
```
