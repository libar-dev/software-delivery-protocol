---
id: spec:consumers.obsidian-vault.notes.unresolved-mention-stays
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault.notes
  verifies:
    target: spec:consumers.obsidian-vault.notes
    exercises: [mentionLinks]
---
# A mention of an entry that does not exist stays as written

## Intent
- outcome: Execute the mention rule on an entry address whose key its Spec does not carry, which validation reports and the vault leaves unlinked.

```gwt
Given a corpus holding the Spec {source: "spec:probe.source"} whose narrative mentions {mention: "spec:probe.target#design.missing"}
Given the Spec {target: "spec:probe.target"} keys the Design entry {key: "limit"}
When the vault command runs over that corpus
Then the mention renders as {rendered: "spec:probe.target#design.missing"}
```
