---
id: spec:consumers.obsidian-vault.failed-extraction-recovered
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault
  verifies:
    target: spec:consumers.obsidian-vault
    exercises: [failedExtraction, guard]
---
# The run after a failed extraction passes the guard and restores the index

## Intent
- outcome: Execute the run that follows a failed extraction once the carrier is repaired: the guard accepts the warning index the failed run recorded, and the vault ends as a fresh one would.

```gwt
Given an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}
Given a vault whose generated folder holds {generated: "the files a run whose extraction failed left"}
Given the vault holds {extra: "an intent note and Obsidian settings outside the generated folder"}
Given the member {change: "stays in the corpus"}
When the vault command runs at that root
Then the run exits {exitCode: 0}
Then the index note warns that the last regeneration failed: {indexWarns: false}
Then the generated folder is byte-identical to a fresh vault's, the file list included: {matchesFresh: true}
Then every file the person wrote is byte-identical: {personFilesKept: true}
```
