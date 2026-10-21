---
id: spec:validation.corpus-rules.unreadable-params-fail-one-file
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.corpus-rules
  verifies:
    target: spec:validation.corpus-rules
    exercises: [watchedParams]
---
# A parameter file that stops being JSON fails only its own rules file, and the watcher runs on

## Intent
- outcome: Execute the watched-parameters rule on a parameter file that holds text that is not JSON after the first cycle.
- assumption: The world writes the probe corpus, parameter file and rules files of the parameter-edit example and starts the watcher as that example does. After the first cycle it writes text that is not JSON to the parameter file, waits for the second cycle, reads its corpus summary line and, on standard error, the line `corpus rules <path> failed: its parameters cannot be read (<cause>)` for the first file, then checks that the process is still running before it stops the watcher.

```gwt
Given a probe corpus the Protocol's validators find clean
Given a first rules file that {first: "reads a parameter file that stops being JSON after the first cycle under --watch"}
Given a second rules file that returns one warning when the graph it receives holds no node
When the probe corpus is validated with the rules files named by --rules in that order
Then the second cycle's corpus summary line reads {corpusSummary: "corpus rules: 0 errors · 0 warnings · 1 of 2 files failed (the corpus's own rules)"}
Then the watcher is still running after the second cycle: {running: true}
```
