---
id: spec:model.term-addresses.unknown-term-key-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:model.term-addresses
  verifies:
    target: spec:model.term-addresses
    exercises: [authoredKey, termAddress, termReaders]
---
# An address that names a term key no term carries is an error

## Intent
- outcome: Execute the missing-entry error on a term address whose key the target no longer carries, after the key was renamed and the address was not.

```gwt
Given a {carrier: "Markdown"} Spec carrier {specId: "spec:probe.subject"} whose Model terms read {terms: "- **step key** — [#stepLabel] the key a step carries in its marker"}
Given a second Spec that names {address: "spec:probe.subject#term.stepKey"} in its narrative and declares dependsOn on the first
When the extractor reifies both carriers and the graph is validated
Then the first carrier is reified: {reified: true}
Then the first extraction finding's message contains {extractMessage: ""}
Then the graph holds the term keys {keys: "stepLabel"}
Then the report holds {mentionErrors: 1} prose-mention errors
Then the mention audit lists the address as unresolved with reason {auditReason: "entry"}
```
