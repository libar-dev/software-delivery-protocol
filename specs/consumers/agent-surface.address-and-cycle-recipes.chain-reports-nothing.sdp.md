---
id: spec:consumers.agent-surface.address-and-cycle-recipes.chain-reports-nothing
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface.address-and-cycle-recipes
  verifies:
    target: spec:consumers.agent-surface.address-and-cycle-recipes
    exercises: [cycleFindings, answersUnchanged]
---
# A dependency chain with no cycle yields no finding

## Intent
- outcome: Execute the cycle findings through `sdp q` over a chain, which reports no set and carries no finding.
- assumption: The world writes the probe corpus of the unresolved-address example and runs `sdp q --json` on its root with the text of `dist/recipes/26-dependency-cycles.js` as the body and no `--params`, which the addresses `none` names. It reads the exit code, the answer's `findings` and the answer's keys, which are `totals`, `cycles` and `findings`.

```gwt
Given a probe corpus in which {corpus: "one Spec depends on another"}
Given the caller passes the addresses {addresses: "none"}
When the shipped {recipe: "dependency cycles"} file runs {invocation: "through sdp q"}
Then the command exits {exitCode: 0}
Then the answer carries {findings: 0} findings with the rule ids {ruleIds: ""}
```
