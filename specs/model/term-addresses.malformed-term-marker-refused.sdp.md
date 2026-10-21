---
id: spec:model.term-addresses.malformed-term-marker-refused
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:model.term-addresses
  verifies:
    target: spec:model.term-addresses
    exercises: [termMarker, markerRefusals]
---
# A term marker whose key is off the grammar refuses its carrier

## Intent
- outcome: Execute the marker refusal on a definition that opens with a marker whose key is not lower-camel ASCII.

```gwt
Given a {carrier: "Markdown"} Spec carrier {specId: "spec:probe.subject"} whose Model terms read {terms: "- **step key** — [#step-key] the key a step carries in its marker"}
Given a second Spec that names {address: "spec:probe.subject#term.stepKey"} in its narrative and declares dependsOn on the first
When the extractor reifies both carriers and the graph is validated
Then the first carrier is reified: {reified: false}
Then the first extraction finding's message contains {extractMessage: "term key markers must be [#<lower-camel ASCII key>] followed by one space and text"}
Then the graph holds the term keys {keys: ""}
Then the report holds {mentionErrors: 1} prose-mention errors
```
