---
id: spec:consumers.agent-surface.address-and-cycle-recipes.cycle-fails-a-rules-run
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface.address-and-cycle-recipes
  verifies:
    - target: spec:consumers.agent-surface.address-and-cycle-recipes
      exercises: [cycleFindings, findingsSeverity]
    - target: spec:validation.corpus-rules
      exercises: [recipesAsRules]
---
# The shipped dependency-cycles file fails a rules run on a cycle

## Intent
- outcome: Execute the cycle findings by naming the shipped dependency-cycles file as a rules file over a corpus with one cycle.
- assumption: The world writes a probe corpus of two story-altitude behavior Specs, each stating `idea` with an Intent outcome and each declaring `dependsOn` on the other, which the Protocol's validators find clean. It runs `sdp validate` on the probe root with `dist/recipes/26-dependency-cycles.js` named by `--rules` and no `--params`, which the addresses `none` names. The findings are the corpus findings the run prints, and the rule ids are their rule ids joined by a comma and a space.

```gwt
Given a probe corpus in which {corpus: "two Specs depend on each other through dependsOn"}
Given the caller passes the addresses {addresses: "none"}
When the shipped {recipe: "dependency cycles"} file runs {invocation: "as a rules file named by sdp validate --rules"}
Then the command exits {exitCode: 1}
Then the answer carries {findings: 1} findings with the rule ids {ruleIds: "dependency-cycle"}
```
