---
id: spec:consumers.obsidian-vault.failed-extraction-keeps-notes
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.obsidian-vault
  verifies:
    target: spec:consumers.obsidian-vault
    exercises: [failedExtraction]
---
# A failed extraction keeps the notes and says so on the index

## Intent
- outcome: Execute a run whose extraction fails over a vault an earlier run wrote, which keeps every note, rewrites the index with a warning and records it in the file list.

```gwt
Given an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}
Given a vault whose generated folder holds {generated: "the files an earlier run wrote"}
Given the vault holds {extra: "an intent note and Obsidian settings outside the generated folder"}
Given the member {change: "has a carrier the extractor refuses"}
When the vault command runs at that root
Then the run exits {exitCode: 1}
Then the member's note is present: {memberNote: true}
Then the index note warns that the last regeneration failed: {indexWarns: true}
Then every generated file matches a content the file list records for it: {listMatches: true}
Then every file the person wrote is byte-identical: {personFilesKept: true}
```
