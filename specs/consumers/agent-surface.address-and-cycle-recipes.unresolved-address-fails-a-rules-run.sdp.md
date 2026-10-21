---
id: spec:consumers.agent-surface.address-and-cycle-recipes.unresolved-address-fails-a-rules-run
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface.address-and-cycle-recipes
  verifies:
    - target: spec:consumers.agent-surface.address-and-cycle-recipes
      exercises: [addressFindings, findingsSeverity]
    - target: spec:validation.corpus-rules
      exercises: [recipesAsRules]
---
# The shipped address-resolution file fails a rules run on an address that names no entry

## Intent
- outcome: Execute the address findings by naming the shipped address-resolution file as a rules file with one address its Spec does not carry.
- assumption: The world writes a probe corpus of two story-altitude behavior Specs stating `idea`, each with an Intent outcome, the first declaring `dependsOn` on the second, which the Protocol's validators find clean; the first Spec's id is the one the address names. It runs `sdp validate` on the probe root with `dist/recipes/25-address-resolution.js` named by `--rules` and followed by `--params` holding the address as `addresses`. The findings and rule ids are read as in the cycle example.

```gwt
Given a probe corpus in which {corpus: "one Spec depends on another"}
Given the caller passes the addresses {addresses: "spec:probe.one#design.absent"}
When the shipped {recipe: "address resolution"} file runs {invocation: "as a rules file named by sdp validate --rules"}
Then the command exits {exitCode: 1}
Then the answer carries {findings: 1} findings with the rule ids {ruleIds: "unresolved-address"}
```
