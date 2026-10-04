---
id: spec:model.open-question-keys
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:model.spec-sections
  dependsOn: spec:carrier.markdown-body-grammar
  decidedBy: spec:decisions.checked-mentions
---
# An open question may carry a key that addresses it

## Intent
- problem: An open question has no identity but its position and its text, so a register or a decision that cites one breaks silently when a question above it moves, closes, or is reworded.
- outcome: Let an author give an open question an optional key, so `spec:<id>#question.<key>` names it, resolves while it stands, and fails validation where it is renamed or removed.

## Rule
- An open question is prose, or an object with `question`, an optional `blocking` flag, and an optional `key`. A key matches `^[a-z][A-Za-z0-9]*$`, the grammar of a Design key, and is unique among the open questions of one Spec. An unkeyed question stays lawful and has no address.
- In the Markdown carrier the key follows the flag inside the marker, after one space and `#`, as in `- [blocking #aggregateReach] Does the owner widen the aggregate?` or `- [non-blocking #pageHome] Where does the page live?`. A marker whose key text is empty or off the grammar is refused with `open question keys must be lower-camel ASCII`, and a key that repeats an earlier key of the same Spec is refused with `open question keys must be unique`, each as the structure finding `extract/invalid-markdown-structure` at the line of the entry, and the carrier is refused whole as for every structure refusal.
- In the TypeScript carrier the key is the `key` property of the question object. A key that is not a string on the grammar, or that repeats an earlier key of the same Spec, is refused with the finding `extract/unrecognized-property` at severity error and the message `property "intent.openQuestions[<n>].key" is refused: open question keys must be lower-camel ASCII` or `property "intent.openQuestions[<n>].key" is refused: open question keys must be unique`, with `<n>` the zero-based position; only the key drops, and the question and the Spec stay.
- The serialized graph writes a question object's fields in the order `question`, `blocking`, `key`, omitting an absent one. The import emitter writes a keyed question's marker as `[<flag> #<key>]`, so a keyed TypeScript question round-trips into Markdown.
- The entry address gains the section `question`: `spec:<id>#question.<key>` parses, is refused in every id slot as every entry address is, and resolves when the Spec exists and one of its open questions carries that key. A mention whose question key no open question carries is the prose-mentions error for a missing entry, so renaming or removing a key fails validation in every Spec that addresses it.
- The open-question register reports each question's key, or null for an unkeyed question. The mention audit and entry search read the `question` address as they read a `design` or `ui` address, and entry search gives a keyed question's text the address `spec:<id>#question.<key>`.
- The realizing sites are `IntentOpenQuestion` in `src/model/sections.ts`, the open-question marker in `src/extract/markdown-body-owner-behavior.ts`, the question shape in `src/extract/reify.ts`, `canonicalOpenQuestion` in `src/extract/serialize.ts`, the Intent emission in `src/import/emit-markdown.ts`, the entry-address grammar in `src/ids.ts`, and `hasAddressedEntry` in `src/validate/validators.ts`.

## Example space
```gwt-vocabulary
Given a Markdown Spec carrier {specId:string} whose open questions read {questions:string}
Given a second Spec that names {address:string} in its narrative and declares dependsOn on the first
When the extractor reifies both carriers and the graph is validated
Then the first carrier is reified: {reified:boolean}
Then the extraction findings name {extractMessage:string}
Then the graph holds the question keys {keys:string}
Then the report holds {mentionErrors:number} prose-mention errors
```
