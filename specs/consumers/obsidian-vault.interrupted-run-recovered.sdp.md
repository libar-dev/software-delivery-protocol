---
id: spec:consumers.obsidian-vault.interrupted-run-recovered
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault
  verifies:
    target: spec:consumers.obsidian-vault
    exercises: [interruptedRun, synchronize]
---
# A run after a stopped synchronization finishes it

## Intent
- outcome: Execute the recovery from a run stopped at its first rename, which left the file list recording both contents and a whole temporary beside its target.

```gwt
Given an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}
Given a vault whose generated folder holds {generated: "the files a run stopped at its first rename left"}
Given the vault holds {extra: "an intent note and Obsidian settings outside the generated folder"}
Given the member {change: "changes its title"}
When the vault command runs at that root
Then the run exits {exitCode: 0}
Then the generated folder is byte-identical to a fresh vault's, the file list included: {matchesFresh: true}
Then every file the person wrote is byte-identical: {personFilesKept: true}
```
