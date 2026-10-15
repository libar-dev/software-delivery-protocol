---
id: spec:validation.corpus-rules.error-finding-fails
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.corpus-rules
  verifies:
    target: spec:validation.corpus-rules
    exercises: [exitCode]
---
# An error from a corpus rule fails validation and leaves the Protocol's line alone

## Intent
- outcome: Execute the exit rule on one rules file that returns one error finding over a corpus the Protocol finds clean.
- assumption: The world writes a probe corpus of two story-altitude behavior Specs stating `idea`, each with an Intent outcome, the second declaring `refines` on the first, so the Protocol's validators report no finding. The rules file's body returns `{ findings: [{ validatorId: "probe-rule", subjectId: "probe-subject", severity: "error", message: "the probe rule reports its subject" }] }`. The world runs `sdp validate` on the probe root with that file named by `--rules` and reads the exit code and standard output.

```gwt
Given a probe corpus the Protocol's validators find clean
Given a first rules file that {first: "returns one error finding"}
When the probe corpus is validated with the rules files named by --rules in that order
Then the command exits {exitCode: 1}
Then the Protocol summary line reads {protocolSummary: "validate: 0 errors · 0 warnings (conformance + honesty over the one graph)"}
Then the corpus summary line reads {corpusSummary: "corpus rules: 1 errors · 0 warnings · 0 of 1 files failed (the corpus's own rules)"}
```
