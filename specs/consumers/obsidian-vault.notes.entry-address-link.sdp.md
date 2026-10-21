---
id: spec:consumers.obsidian-vault.notes.entry-address-link
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.obsidian-vault.notes
  verifies:
    target: spec:consumers.obsidian-vault.notes
    exercises: [noteNames, idInAliases, blockIds, mentionLinks]
---
# An entry address in prose opens the entry's block in its Spec's note

## Intent
- outcome: Execute note naming, the id alias and a mention of an entry address rendered as a block link.

```gwt
Given a corpus holding the Spec {source: "spec:probe.source"} whose narrative mentions {mention: "spec:probe.target#design.limit"}
Given the Spec {target: "spec:probe.target"} keys the Design entry {key: "limit"}
When the vault command writes the vault
Then the mentioning Spec's note is {notePath: "sdp/specs/probe/spec.probe.source.md"}
Then the mention renders as {rendered: "[[sdp/specs/probe/spec.probe.target.md#^design-limit|spec:probe.target#design.limit]]"}
Then the note's aliases open with {alias: "spec:probe.source"}
Then no property but aliases holds a value Obsidian reads as an address: {plainProperties: true}
```
