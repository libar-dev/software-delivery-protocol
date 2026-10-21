---
id: spec:consumers.obsidian-vault.iteration.watch-source-anchor
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault.iteration
  verifies:
    target: spec:consumers.obsidian-vault.iteration
    exercises: [watch, inPlace]
---
# An anchor added in a source file under watch rewrites the Spec's note

## Intent
- outcome: Execute the vault's watch on a source-file edit, which `sdp validate --watch` ignores, and show the Spec's note gaining its binding while every other note keeps its bytes.

```gwt
Given a vault the vault command wrote from an extraction root and now watches
When the Spec {specId: "spec:probe.member"} is edited by {edit: "an anchor added in a source file"}
Then the note of that Spec shows an implementation binding: {bindingShown: true}
Then every note whose bytes the change leaves alone keeps its modification time: {othersUntouched: true}
Then the watch process stays alive and exits {exitCode: 0} on SIGINT
```
