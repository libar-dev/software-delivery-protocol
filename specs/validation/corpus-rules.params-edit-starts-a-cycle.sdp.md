---
id: spec:validation.corpus-rules.params-edit-starts-a-cycle
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.corpus-rules
  verifies:
    target: spec:validation.corpus-rules
    exercises: [watchedParams]
---
# Editing a parameter file starts a cycle that reads the new parameters

## Intent
- outcome: Execute the watched-parameters rule on a parameter file, outside the probe root, that gains a key after the first cycle.
- assumption: The world writes the probe corpus of the error example, a parameter file outside the probe root holding `{ "one": 1 }`, a first rules file whose body returns one warning finding for each key of its `params`, named by `--rules` and followed by `--params @PATH` naming that file, and the second rules file of the copy example. It starts the watcher as the rules-edit example does and, after the first cycle, writes `{ "one": 1, "two": 2 }` to the parameter file, then reads the second cycle's corpus summary line and stops the watcher.

```gwt
Given a probe corpus the Protocol's validators find clean
Given a first rules file that {first: "reads a parameter file that gains a key after the first cycle under --watch"}
Given a second rules file that returns one warning when the graph it receives holds no node
When the probe corpus is validated with the rules files named by --rules in that order
Then the second cycle's corpus summary line reads {corpusSummary: "corpus rules: 0 errors · 2 warnings · 0 of 2 files failed (the corpus's own rules)"}
```
