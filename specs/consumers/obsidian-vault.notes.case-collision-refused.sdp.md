---
id: spec:consumers.obsidian-vault.notes.case-collision-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault.notes
  verifies:
    target: spec:consumers.obsidian-vault.notes
    exercises: [caseCollision]
---
# Two Specs whose notes differ only in case refuse the run

## Intent
- outcome: Execute the case-collision refusal on two Spec ids that differ only in the case of one letter.

```gwt
Given a corpus holding the Specs {first: "spec:probe.Member"} and {second: "spec:probe.member"}
When the vault command runs over that corpus
Then the run exits {exitCode: 1}
Then the refusal names {named: "spec:probe.Member and spec:probe.member"}
Then nothing under the generated folder was written: {nothingWritten: true}
```
