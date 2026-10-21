---
id: spec:model.term-addresses.keyed-term-resolves
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:model.term-addresses
  verifies:
    target: spec:model.term-addresses
    exercises: [termMarker, termAddress, termLocations, termReaders]
---
# A keyed term is reified and its address resolves

## Intent
- outcome: Execute the term marker and the term address on one keyed term beside an unkeyed one, and show that address resolution and entry search find the term at the line the location table records.

```gwt
Given a {carrier: "Markdown"} Spec carrier {specId: "spec:probe.subject"} whose Model terms read {terms: "- **step key** — [#stepKey] the key a step carries in its marker; - **slot** — one typed placeholder in a step"}
Given a second Spec that names {address: "spec:probe.subject#term.stepKey"} in its narrative and declares dependsOn on the first
When the extractor reifies both carriers and the graph is validated
Then the first carrier is reified: {reified: true}
Then the first extraction finding's message contains {extractMessage: ""}
Then the graph holds the term keys {keys: "stepKey"}
Then the report holds {mentionErrors: 0} prose-mention errors
Then address resolution resolves the address to the marker-free definition at its recorded term location: {resolved: true}
Then entry search for the addressed term's words finds it at that same address and line: {found: true}
```
