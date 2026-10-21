---
id: spec:consumers.obsidian-vault.vault-in-build-path-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.obsidian-vault
  verifies:
    target: spec:consumers.obsidian-vault
    exercises: [apartFromBuild, ownedFolder]
---
# A vault directory the build removes refuses the run and keeps a person's notes

## Intent
- outcome: Execute the refusal of a vault directory inside a projection root the shared build removes, and show that a person's notes there survive.

```gwt
Given an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}
Given the vault command names the vault directory {out: "generated/design-review"}
Given a vault whose generated folder holds {generated: "nothing"}
Given the vault holds {extra: "an intent note and Obsidian settings outside the generated folder"}
When the vault command runs at that root
Then the run exits {exitCode: 1}
Then the run refuses the vault directory as {placement: "overlapping a path the build owns"}
Then every file the person wrote is byte-identical: {personFilesKept: true}
```
