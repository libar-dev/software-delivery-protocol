---
id: spec:consumers.upgrade-kit.rule-key-proposal.collision-and-unkeyable
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.upgrade-kit.rule-key-proposal
  verifies:
    target: spec:consumers.upgrade-kit.rule-key-proposal
    exercises: [coinedKey, uniqueKey, unkeyable]
---
# Two rules that coin one key stay apart, and a rule with no ASCII word stays unkeyed

## Intent
- outcome: Execute the uniqueness and unkeyable rules on a probe Spec whose first two rules coin the same key and whose third holds no ASCII word.
- assumption: The world writes the probe corpus of the applies-clean example with the three rules the step lists, the third written in Greek letters, and reads the shipped rule-key proposal file's answer as that example does.

```gwt
Given a probe Spec whose unkeyed rules read {rules: "A part fits the budget. / Every part fits the budget again. / Ο κανόνας ισχύει."}
When the rule-key proposal runs for it at a commit and the proposal check reads it against the graph of that commit
Then the proposal adds the keys {keys: "partFitsBudget, partFitsBudget2"}
Then the proposal leaves {unkeyable: 1} entries unkeyed
Then the proposal check reports {moved: 0} moved changes and {problems: 0} schema problems
```
