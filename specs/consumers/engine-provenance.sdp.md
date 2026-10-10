---
id: spec:consumers.engine-provenance
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.adopter-on-ramp
  constrainedBy: spec:extraction.determinism
---
# The CLI names the engine that produced a result

## Intent
- problem: An adopter pinned to a build of the Protocol cannot ask the CLI which build it is: `sdp --version` prints the usage text and the package version is `0.0.0` at every commit, so when a check changes with no Spec changed, nothing tells the engine moving from the corpus moving.
- outcome: Let `sdp --version` name the package version and the commit the build came from, without putting either into the graph.

## Behavior
- rule: `sdp --version` prints one line, `sdp <version> (<commit>)`, and exits 0. The version is the package's own version; the commit is the full hash the build was made from, or `unknown` when the build could not read one.
- rule: The build records the commit in a file beside the compiled CLI, and the CLI reads that file; it never runs git at run time.
- rule: Neither the version nor the commit enters the graph, a projection or a generated contract, so a derived artifact stays a function of the corpus alone.
- rule: The realizing sites are `src/cli/sdp.ts` and the build step that records the commit.
