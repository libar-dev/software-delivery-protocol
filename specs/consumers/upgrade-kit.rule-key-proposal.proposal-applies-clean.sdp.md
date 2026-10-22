---
id: spec:consumers.upgrade-kit.rule-key-proposal.proposal-applies-clean
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.upgrade-kit.rule-key-proposal
  verifies:
    target: spec:consumers.upgrade-kit.rule-key-proposal
    exercises: [proposesKeys, keepsText, coinedKey, applyAfterCheck]
---
# A rule-key proposal passes the proposal check and validates once applied

## Intent
- outcome: Execute the proposal end to end on a probe Spec with two unkeyed rules: coin the keys, check the proposal against the base graph, apply it as an agent would, and validate.
- assumption: The world writes a probe corpus of one story-altitude behavior Spec stating `idea` with an Intent outcome and the two rules the step lists, split at ` / `, runs `sdp build` to write the base graph, and runs the shipped rule-key proposal file through `sdp q --json` with the Spec in `specs` and a commit string. It runs the shipped proposal check file with the answer's `proposal` and the base graph, then applies each change by putting its marker after the rule's label at the line its request names, and runs `sdp validate` on the probe root. The keys read joined by a comma and a space.

```gwt
Given a probe Spec whose unkeyed rules read {rules: "The bundle is composed on each invocation. / Each part fits the budget."}
When the rule-key proposal runs for it at a commit and the proposal check reads it against the graph of that commit
Then the proposal adds the keys {keys: "bundleComposedInvocation, partFitsBudget"}
Then the proposal leaves {unkeyable: 0} entries unkeyed
Then the proposal check reports {moved: 0} moved changes and {problems: 0} schema problems
Then the probe validates with {errors: 0} errors once an agent applies the proposal
```
