---
id: spec:consumers.obsidian-vault.fresh-vault
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault
  verifies:
    target: spec:consumers.obsidian-vault
    exercises: [verb, ownedFolder, deterministic, linksResolve]
---
# A fresh vault is written the same way twice and every link resolves

## Intent
- outcome: Execute the verb, the generated folder, determinism and link resolution on a vault the command writes for the first time.

```gwt
Given an extraction root holding a Pack and its member Specs, among them {member: "spec:probe.member"}
Given a vault whose generated folder holds {generated: "nothing"}
Given the vault holds {extra: "no other file"}
Given the member {change: "stays in the corpus"}
When the vault command runs at that root
Then the run exits {exitCode: 0}
Then a second run over the same graph leaves every generated file byte-identical: {byteIdentical: true}
Then the member's note is present: {memberNote: true}
Then every link a generated note writes resolves inside the vault: {linksResolve: true}
```
