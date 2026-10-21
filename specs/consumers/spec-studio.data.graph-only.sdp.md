---
id: spec:consumers.spec-studio.data.graph-only
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.data
  verifies:
    target: spec:consumers.spec-studio.data
    exercises: [namedInputs, sameInputsSameBytes]
---
# Without inputs the page set is the graph's alone

## Intent
- outcome: Execute the graph-only build: no input, no input page, and the same bytes twice.
- assumption: The world writes a root with one Pack of two member Specs, runs the studio command twice with no input flag, and compares the two page sets file by file; it reads every page for the words `base graph` and `run evidence`, which no page may hold without an input.

```gwt
Given an extraction root holding a Pack and its member Specs
Given the studio command is given the base graph {base: "none"} and the run records {runs: "none"}
When the studio command runs twice with those inputs
Then the two runs wrote byte-identical files: {byteIdentical: true}
Then the page set holds the diff page: {diffPage: false}
Then the page set holds the runs page: {runsPage: false}
Then every page that shows an input names it and holds no input path: {inputsNamed: true}
```
