---
id: spec:consumers.obsidian-vault.iteration.watch-rewrites-changed-notes
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.obsidian-vault.iteration
  verifies:
    target: spec:consumers.obsidian-vault.iteration
    exercises: [watch, inPlace]
---
# A carrier edit under watch rewrites only the notes it changes

## Intent
- outcome: Execute the vault's watch on one carrier edit and show that every note the edit leaves alone keeps its modification time.

```gwt
Given a vault the vault command wrote from an extraction root and now watches
When the Spec {specId: "spec:probe.member"} is edited by {edit: "a title change in its carrier"}
Then the note of that Spec shows the new title: {shown: true}
Then every note whose bytes the change leaves alone keeps its modification time: {othersUntouched: true}
Then the watch process stays alive and exits {exitCode: 0} on SIGINT
```
