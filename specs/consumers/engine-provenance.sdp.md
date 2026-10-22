---
id: spec:consumers.engine-provenance
kind: behavior
altitude: story
readiness: ready
relations:
  refines:
    target: spec:consumers.authoring-on-ramp
    reason: an adopter names the engine used to author and check its corpus
  dependsOn:
    target: spec:consumers.adopter-on-ramp
    reason: an adopter pinned to a build asks the CLI the adopter on-ramp points it to which build it runs
  constrainedBy: spec:extraction.determinism
---
# The CLI names the engine that produced a result

## Intent
- problem: An adopter pinned to a build of the Protocol needs to name that build: the package version alone does not change between commits, so when a check changes with no Spec changed, nothing tells the engine moving from the corpus moving.
- outcome: Let `sdp --version` name the package version and the commit the build came from, without putting either into the graph.

## Behavior
- rule: `sdp --version` prints one line, `sdp <version> (<commit>)`, and exits 0. The version is the package's own version; the commit is the full hash the build was made from, or `unknown` when the build could not read one; a build from a checkout with uncommitted changes names the commit checked out when it ran.
- rule: The build records the commit in a file beside the compiled CLI, and the CLI reads that file; it never runs git at run time.
- rule: The build reads the commit from git first. When git gives no full commit, it reads the archive's substituted commit file; a full commit there names the archived revision, and an absent, unsubstituted or malformed file leaves the commit `unknown`.
- rule: Neither the version nor the commit enters the graph, a projection or a generated contract, so a derived artifact stays a function of the corpus alone.

## Design
- archiveCommit: `.git-archive-commit` contains `$Format:%H$` in a checkout and is marked `export-subst` in `.gitattributes`, so git archives carry their full commit. The build reads the trimmed file only as a full Git object name, never as a command or an abbreviated hash.
