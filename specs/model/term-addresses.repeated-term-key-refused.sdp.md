---
id: spec:model.term-addresses.repeated-term-key-refused
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:model.term-addresses
  verifies:
    target: spec:model.term-addresses
    exercises: [uniqueTermKeys, markerRefusals]
---
# A term key repeated in one Spec refuses its carrier

## Intent
- outcome: Execute the uniqueness refusal, and show that the address then names a missing Spec.

```gwt
Given a {carrier: "Markdown"} Spec carrier {specId: "spec:probe.subject"} whose Model terms read {terms: "- **step key** — [#stepKey] the key a step carries in its marker; - **term key** — [#stepKey] the key a Model term carries in its marker"}
Given a second Spec that names {address: "spec:probe.subject#term.stepKey"} in its narrative and declares dependsOn on the first
When the extractor reifies both carriers and the graph is validated
Then the first carrier is reified: {reified: false}
Then the first extraction finding's message contains {extractMessage: "is repeated; term keys must be unique within a Spec"}
Then the graph holds the term keys {keys: ""}
Then the report holds {mentionErrors: 1} prose-mention errors
```
