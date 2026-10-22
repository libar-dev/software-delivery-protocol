---
id: spec:validation.corpus-rules.rules-edit-starts-a-cycle
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:validation.corpus-rules
  verifies:
    target: spec:validation.corpus-rules
    exercises: [watchReruns]
---
# Rewriting a rules file under node_modules starts a cycle that runs the new body

## Intent
- outcome: Execute the watch rule on a rules file that lives under a directory discovery skips and is rewritten after the first cycle.
- assumption: The world writes the probe corpus of the error example, a first rules file under the probe root's `node_modules/probe/` whose body returns one warning finding, and the second rules file of the copy example. It starts `sdp validate --watch` on the probe root with the two files named by `--rules` in that order, waits for the first cycle, rewrites the first file to return one error finding in place of the warning, waits for the second cycle, reads its corpus summary line and stops the watcher.

```gwt
Given a probe corpus the Protocol's validators find clean
Given a first rules file that {first: "is rewritten to return one error finding after the first cycle under --watch"}
Given a second rules file that returns one warning when the graph it receives holds no node
When the probe corpus is validated with the rules files named by --rules in that order
Then the second cycle's corpus summary line reads {corpusSummary: "corpus rules: 1 errors · 0 warnings · 0 of 2 files failed (the corpus's own rules)"}
```
