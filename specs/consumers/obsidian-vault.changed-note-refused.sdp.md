---
id: spec:consumers.obsidian-vault.changed-note-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault
  verifies:
    target: spec:consumers.obsidian-vault
    exercises: [guard]
---
# A generated note a person changed refuses the regeneration and keeps the edit

## Intent
- outcome: Execute the guard on a generated note whose bytes a person changed after the command wrote it.

```gwt
Given an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}
Given a vault whose generated folder holds {generated: "the files an earlier run wrote"}
Given the vault holds {extra: "a generated note a person changed"}
Given the member {change: "stays in the corpus"}
When the vault command runs at that root
Then the run exits {exitCode: 1}
Then the run refuses the path {refusedPath: "sdp/specs/probe/spec.probe.member.md"} as {refusal: "changed"}
Then every file the person wrote is byte-identical: {personFilesKept: true}
```
