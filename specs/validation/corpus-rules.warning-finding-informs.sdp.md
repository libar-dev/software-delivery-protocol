---
id: spec:validation.corpus-rules.warning-finding-informs
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.corpus-rules
  verifies:
    target: spec:validation.corpus-rules
    exercises: [exitCode]
---
# A warning from a corpus rule informs and passes

## Intent
- outcome: Execute the exit rule on one rules file that returns one warning finding over a corpus the Protocol finds clean.
- assumption: The world writes the probe corpus of the error example. The rules file's body returns `{ findings: [{ validatorId: "probe-rule", subjectId: "probe-subject", severity: "warning", message: "the probe rule reports its subject" }] }`. The world runs `sdp validate` on the probe root with that file named by `--rules` and reads the exit code and standard output.

```gwt
Given a probe corpus the Protocol's validators find clean
Given a first rules file that {first: "returns one warning finding"}
When the probe corpus is validated with the rules files named by --rules in that order
Then the command exits {exitCode: 0}
Then the Protocol summary line reads {protocolSummary: "validate: 0 errors · 0 warnings (conformance + honesty over the one graph)"}
Then the corpus summary line reads {corpusSummary: "corpus rules: 0 errors · 1 warnings · 0 of 1 files failed (the corpus's own rules)"}
```
