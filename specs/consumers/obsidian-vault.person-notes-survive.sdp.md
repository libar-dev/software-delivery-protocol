---
id: spec:consumers.obsidian-vault.person-notes-survive
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.obsidian-vault
  verifies:
    target: spec:consumers.obsidian-vault
    exercises: [ownedFolder, synchronize]
---
# A regeneration removes a note that left the graph and keeps a person's notes

## Intent
- outcome: Execute synchronization on a vault holding a person's intent note and Obsidian's settings while a Spec leaves the corpus.

```gwt
Given an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}
Given a vault whose generated folder holds {generated: "the files an earlier run wrote"}
Given the vault holds {extra: "an intent note and Obsidian settings outside the generated folder"}
Given the member {change: "leaves the corpus"}
When the vault command runs at that root
Then the run exits {exitCode: 0}
Then the member's note is present: {memberNote: false}
Then every file the person wrote is byte-identical: {personFilesKept: true}
Then every link a generated note writes resolves inside the vault: {linksResolve: true}
```
