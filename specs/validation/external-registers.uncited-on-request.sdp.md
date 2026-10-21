---
id: spec:validation.external-registers.uncited-on-request
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.external-registers
  verifies:
    target: spec:validation.external-registers
    exercises: [uncitedToken, asRulesFile]
---
# A held token no Spec cites fails a rules run only when the caller asks

## Intent
- outcome: Execute the uncited check as a rules file over a Spec that cites one of two held tokens.
- assumption: The world writes the probe corpus of the unknown-and-retired example, its first Spec citing only the held token named below, and the register file `{ "tokens": ["E-1", "E-2"] }`, and runs the shipped file as that example does, with `uncited` true.

```gwt
Given a probe corpus whose Spec cites the tokens {cited: "E-1"}
Given a register file that holds {held: "E-1 E-2"} and retires {retired: ""}
When the shipped external-registers file runs as a rules file with the pattern for E-numbers and uncited {uncited: true}
Then the command exits {exitCode: 1}
Then the corpus findings carry the rule ids {ruleIds: "uncited-token"}
```
