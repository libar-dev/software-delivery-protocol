---
id: spec:consumers.obsidian-vault.hidden-file-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault
  verifies:
    target: spec:consumers.obsidian-vault
    exercises: [guard]
---
# A person's file under a temporary's name refuses the regeneration

## Intent
- outcome: Execute the guard on a file whose name begins with a dot and reads as a temporary of a generated note, but whose bytes the file list does not record.

```gwt
Given an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}
Given a vault whose generated folder holds {generated: "the files an earlier run wrote"}
Given the vault holds {extra: "a file a person wrote inside the generated folder under a temporary's name"}
Given the member {change: "stays in the corpus"}
When the vault command runs at that root
Then the run exits {exitCode: 1}
Then the run refuses the path {refusedPath: "sdp/specs/probe/.spec.probe.member.md.sdp-tmp"} as {refusal: "unknown"}
Then every file the person wrote is byte-identical: {personFilesKept: true}
```
