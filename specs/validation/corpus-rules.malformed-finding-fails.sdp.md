---
id: spec:validation.corpus-rules.malformed-finding-fails
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.corpus-rules
  verifies:
    target: spec:validation.corpus-rules
    exercises: [brokenRuleFails]
---
# A finding with no subject fails its rules file

## Intent
- outcome: Execute the broken-rule rule on one rules file whose only finding carries no subject.
- assumption: The world writes the probe corpus of the error example. The rules file's body returns `{ findings: [{ validatorId: "probe-rule", severity: "warning", message: "the probe rule forgets its subject" }] }`, a warning that would pass if it were well formed. The world runs `sdp validate` on the probe root with that file named by `--rules`, reads the exit code and standard output, and reads on standard error the failure line naming the first finding's `subjectId`.

```gwt
Given a probe corpus the Protocol's validators find clean
Given a first rules file that {first: "returns a finding with no subject"}
When the probe corpus is validated with the rules files named by --rules in that order
Then the command exits {exitCode: 1}
Then the Protocol summary line reads {protocolSummary: "validate: 0 errors · 0 warnings (conformance + honesty over the one graph)"}
Then the corpus summary line reads {corpusSummary: "corpus rules: 0 errors · 0 warnings · 1 of 1 files failed (the corpus's own rules)"}
```
