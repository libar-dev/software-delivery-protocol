---
id: spec:model.term-addresses.typescript-term-imports-keyed
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:model.term-addresses
  verifies:
    target: spec:model.term-addresses
    exercises: [termMarker, termAddress]
---
# A keyed TypeScript term keeps its address through import to Markdown

## Intent
- outcome: Execute the term marker in the TypeScript carrier: a keyed definition string is reified with its key, its address resolves, and importing the carrier to Markdown writes the marker and extracts to the same term keys and definitions.

```gwt
Given a {carrier: "TypeScript"} Spec carrier {specId: "spec:probe.subject"} whose Model terms read {terms: "- **step key** — [#stepKey] the key a step carries in its marker"}
Given a second Spec that names {address: "spec:probe.subject#term.stepKey"} in its narrative and declares dependsOn on the first
When the extractor reifies both carriers and the graph is validated
Then the first carrier is reified: {reified: true}
Then the first extraction finding's message contains {extractMessage: ""}
Then the graph holds the term keys {keys: "stepKey"}
Then the report holds {mentionErrors: 0} prose-mention errors
Then the first carrier imported to Markdown writes the entry {importedEntry: "- **step key** — [#stepKey] the key a step carries in its marker"} and keeps its term keys and definitions: {keptOnImport: true}
```
