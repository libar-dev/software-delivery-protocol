---
id: spec:consumers.spec-studio.data.inputs.both-given
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.data.inputs
  verifies:
    target: spec:consumers.spec-studio.data.inputs
    exercises: [namedInputs, inputFlags, inputPages, inputNaming, inputsNeverGraph, sameInputsSameBytes]
---
# Both inputs add their pages, named, and the same inputs write the same bytes

## Intent
- outcome: Execute the two named inputs: each adds its page, each page names its input without its path, and two runs with the same inputs write the same bytes.
- assumption: The world writes a root with one Pack of two member Specs and a test anchor verifying the first, writes the root's graph with `sdp build` and keeps it outside the root as the base, adds a third Spec, writes one CTRF report whose one test names the anchored test file, and runs the studio command twice with both inputs and the label `before`. It reads the diff and runs pages for the label and the tool name, checks that no file in the page set holds either input's path, and checks that the graph the build derived holds no node or edge from either input.

```gwt
Given an extraction root holding a Pack and its member Specs
Given the studio command is given the base graph {base: "an earlier graph of the root"} and the run records {runs: "one CTRF report"}
When the studio command runs twice with those inputs
Then the two runs wrote byte-identical files: {byteIdentical: true}
Then the page set holds the diff page: {diffPage: true}
Then the page set holds the runs page: {runsPage: true}
Then every page that shows an input names it and holds no input path: {inputsNamed: true}
```
