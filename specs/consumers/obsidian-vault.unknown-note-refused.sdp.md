---
id: spec:consumers.obsidian-vault.unknown-note-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault
  verifies:
    target: spec:consumers.obsidian-vault
    exercises: [guard]
---
# A note a person wrote inside the generated folder refuses the regeneration

## Intent
- outcome: Execute the guard on a file the command never wrote, left inside its generated folder.

```gwt
Given an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}
Given a vault whose generated folder holds {generated: "the files an earlier run wrote"}
Given the vault holds {extra: "a note a person wrote inside the generated folder"}
Given the member {change: "leaves the corpus"}
When the vault command runs at that root
Then the run exits {exitCode: 1}
Then the run refuses the path {refusedPath: "sdp/specs/probe/mine.md"} as {refusal: "unknown"}
Then the member's note is present: {memberNote: true}
Then every file the person wrote is byte-identical: {personFilesKept: true}
```
