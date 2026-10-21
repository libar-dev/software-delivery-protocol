---
id: spec:validation.external-registers.unknown-and-retired
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.external-registers
  verifies:
    target: spec:validation.external-registers
    exercises: [registerAsData, citation, unknownToken, retiredToken, asRulesFile]
---
# A cited token the register lacks or retires fails a rules run

## Intent
- outcome: Execute the register check as a rules file over a Spec that cites one held, one retired and one unlisted token.
- assumption: The world writes a probe corpus of two story-altitude behavior Specs stating `idea`, each with an Intent outcome, the second declaring `refines` on the first, so the Protocol's validators report no finding; the first Spec's outcome names the cited tokens in prose. It writes the register file `{ "tokens": ["E-1", "E-2", { "token": "E-7", "retired": true }] }` and runs `sdp validate` on the probe root with `dist/recipes/50-external-registers.js` named by `--rules`, followed by `--params register=@` that file and `--params` holding the pattern `\bE-\d+\b` and `uncited`. The rule ids are the corpus findings' rule ids in printed order, joined by a comma and a space.

```gwt
Given a probe corpus whose Spec cites the tokens {cited: "E-1 E-7 E-9"}
Given a register file that holds {held: "E-1 E-2"} and retires {retired: "E-7"}
When the shipped external-registers file runs as a rules file with the pattern for E-numbers and uncited {uncited: false}
Then the command exits {exitCode: 1}
Then the corpus findings carry the rule ids {ruleIds: "retired-token, unknown-token"}
```
