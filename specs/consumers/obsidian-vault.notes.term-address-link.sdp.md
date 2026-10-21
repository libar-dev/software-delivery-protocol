---
id: spec:consumers.obsidian-vault.notes.term-address-link
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:consumers.obsidian-vault.notes
  verifies:
    target: spec:consumers.obsidian-vault.notes
    exercises: [oneNotePer, blockIds, mentionLinks]
---
# A keyed Model term gets a note, and its address in prose opens the term's block

## Intent
- outcome: Execute the term note, the term's block id and a mention of a term address rendered as a block link.

```gwt
Given a corpus holding the Spec {source: "spec:probe.source"} whose narrative mentions {mention: "spec:probe.target#term.limit"}
Given the Spec {termSpec: "spec:probe.target"} defines a Model term with the key {termKey: "limit"}
When the vault command runs over that corpus
Then the term's note is {termNotePath: "sdp/terms/term.probe.target.limit.md"}
Then the defining Spec's note carries the block id {blockId: "term-limit"}
Then the mention renders as {rendered: "[[sdp/specs/probe/spec.probe.target.md#^term-limit|spec:probe.target#term.limit]]"}
```
