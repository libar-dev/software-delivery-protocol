---
id: spec:validation.corpus-rules.copies-contain-changes
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.corpus-rules
  verifies:
    target: spec:validation.corpus-rules
    exercises: [copiesPerFile, namedOrder]
---
# A rules file that empties its graph leaves the next file's graph whole

## Intent
- outcome: Execute the copy rule on two rules files, the first changing the graph it receives and the second reading its own.
- assumption: The world writes the probe corpus of the error example. The first rules file's body sets the length of `graph.nodes` and of `graph.edges` to zero and returns `{ findings: [] }`. The second rules file's body returns one warning finding when `graph.nodes` is empty and `{ findings: [] }` otherwise. The world runs `sdp validate` on the probe root with the first file, then the second, named by `--rules`, and reads the exit code and standard output.

```gwt
Given a probe corpus the Protocol's validators find clean
Given a first rules file that {first: "empties the graph it receives"}
Given a second rules file that returns one warning when the graph it receives holds no node
When the probe corpus is validated with the rules files named by --rules in that order
Then the command exits {exitCode: 0}
Then the Protocol summary line reads {protocolSummary: "validate: 0 errors · 0 warnings (conformance + honesty over the one graph)"}
Then the corpus summary line reads {corpusSummary: "corpus rules: 0 errors · 0 warnings · 0 of 2 files failed (the corpus's own rules)"}
```
