---
id: spec:model.term-addresses
kind: rule
altitude: story
readiness: ready
relations:
  refines:
    target: spec:model.spec-sections
    reason: extends entry addresses to the terms a Model section defines
  dependsOn:
    - target: spec:model.stable-ids
      reason: a term address extends the Spec entry-address grammar
    - target: spec:model.rule-keys
      reason: the term-key design follows the rule-entry address pattern
    - target: spec:extraction.entry-locations
      reason: adds a row per Model term to the location table
  decidedBy:
    - target: spec:decisions.checked-mentions
      reason: a term address joins the address law that decision rules
    - target: spec:decisions.shipped-projections-frozen
      reason: term keys stay off the frozen projections, which read the definition unchanged
---
# A Model term may carry a key that addresses it

A Model section defines a Spec's terms, and prose names those terms by word. A word is not a checked entry address, so a view cannot resolve it to one authored definition, and a renamed term leaves every sentence that names it silently stale. Design, UI, question and rule entries already carry keys that a mention addresses and validation checks; a key gives a Model term the same. The key is authored in a marker, as a rule's is, rather than derived from the term: a derived key would change, and break every address, whenever the term is reworded. The address segment is `term`, because an address names the kind of entry it reaches, as `question` and `rule` do, and the Model section's own prose is not an entry. The ratified glossary stays a document, beside the graph and outside it, so its terms gain no address; a term gains one where a Spec defines it.

## Intent
- problem: Prose that names a concept a Model section defines has no checked way to point at that definition, so a view cannot link it and a renamed term breaks its readers silently.
- outcome: Let a Model term carry a key, addressed as `spec:<id>#term.<key>`, so prose cites a concept as a checked mention and every view links it exactly.

## Rule
- [#termMarker] A Model term may carry an optional key in a marker that opens its definition, after the bold term and the em dash, as in `- **step key** — [#stepKey] the key a step carries`; the TypeScript carrier writes the same marker at the start of the definition string. The key follows the entry-address key grammar, and an unkeyed term stays lawful and has no address. Importing a TypeScript carrier to Markdown writes the marker on the term that carries the key.
- [#authoredKey] The key is authored and never derived from the term, so rewording a term or its definition keeps its address, while renaming or removing the key fails validation in every Spec that addresses it.
- [#uniqueTermKeys] A term key is unique among the Model terms of one Spec. Term keys and the Spec's Design, UI, question and rule keys sit under different address segments and stay apart.
- [#markerRefusals] A definition that opens with `[#` and does not continue as a marker is refused at its term, and a repeated term key is refused at each term that carries it; a refused Markdown carrier is refused whole, as for every structure refusal, and in the TypeScript carrier the key drops at each site and the Spec stays.
- [#termAddress] A keyed term is addressed as `spec:<id>#term.<key>`. The address parses, is refused in every id slot as every entry address is, and resolves while the Spec's `model.termKeys` carries the key; a mention of a term key the Spec does not carry is a prose-mentions error.
- The ratified glossary stays a document, so its terms gain no address; a term gains one where a Spec defines it in a Model section.
- [#termLocations] The location table records every Model term its carrier locates, keyed or not, as `term[<i>]`, with `<i>` the term's position among the Spec's terms in authored order and `key` beside a keyed term.
- [#termReaders] Address resolution resolves a `term` address to the term's definition with its file and line, entry search gives a keyed term its address and matches term keys as it matches rule keys, and the mention audit reports a term key the Spec does not carry as a missing entry.
- A term key mints no edge, confers no delivery fact and moves no readiness floor, and `exercises` names rule keys only. A term promoted to a `model` Spec of its own leaves its address behind, because promotion moves the content out, and every mention of the address fails until it names the new Spec.

## Example space
The world writes two carriers in one extraction root. The first is a story-altitude model Spec stating `scoped`, with an Intent outcome and a Model section holding the entries the terms slot joins with a semicolon and a space, in the carrier the slot names: in Markdown one line each, as written, and in TypeScript a `.sdp.ts` carrier whose `model.terms` object maps each entry's term to its definition, marker included. The second is a Markdown story-altitude rule Spec stating `idea`, with an Intent outcome and one rule; its narrative names the address, and it declares `dependsOn` on the first. A finding read is the first extraction finding, and an empty slot value means the extraction reports none; the term keys of every Spec in the graph are joined by a comma and a space. `resolved` is true when address resolution gives the address a resolving row whose `value` is the definition without its marker and whose `file` and `line` are those of the term's row in the location table. `found` is true when entry search for the words of the term that carries the address's key returns a row with that address and that line. The audit reason is the `reason` of the mention audit's unresolved row for the address, and empty when it lists none. The import reads the first carrier as written in TypeScript: the world imports it to Markdown, reads the emitted Model entry of its first term, extracts the imported carrier in a fresh root, and compares its term keys and definitions with the TypeScript graph's.

```gwt-vocabulary
Given a {carrier:"Markdown"|"TypeScript"} Spec carrier {specId:string} whose Model terms read {terms:string}
Given a second Spec that names {address:string} in its narrative and declares dependsOn on the first
When the extractor reifies both carriers and the graph is validated
Then the first carrier is reified: {reified:boolean}
Then the first extraction finding's message contains {extractMessage:string}
Then the graph holds the term keys {keys:string}
Then the report holds {mentionErrors:number} prose-mention errors
Then address resolution resolves the address to the marker-free definition at its recorded term location: {resolved:boolean}
Then entry search for the addressed term's words finds it at that same address and line: {found:boolean}
Then the mention audit lists the address as unresolved with reason {auditReason:string}
Then the first carrier imported to Markdown writes the entry {importedEntry:string} and keeps its term keys and definitions: {keptOnImport:boolean}
```

## Design
- termMarker: `- **<term>** — [#<key>] <definition>` is a keyed Model entry in Markdown and `terms: { "<term>": "[#<key>] <definition>" }` in TypeScript; `<key>` matches `^[a-z][A-Za-z0-9]*$`, and a marker later in the definition is plain text.
- termKeysField: `model.termKeys` maps each key to the term it names, as authored, in authored order; the definitions hold the text with the marker removed; a Spec with no keyed term carries no `termKeys`, and the serialized graph writes it after `terms`.
- markerRefusal: `term key markers must be [#<lower-camel ASCII key>] followed by one space and text` is the message, as the finding `extract/unrecognized-property` at severity error, at path `model.terms.<term>`.
- repeatedKey: `term key "<key>" is repeated; term keys must be unique within a Spec` is the message, as the same finding, at each term that carries the key.
- addressSections: `ENTRY_ADDRESS_SECTIONS` is `["design", "ui", "question", "rule", "term"]`, and `parseId` refuses any other segment with `entry address must be <section>.<key> with section design, ui, question, rule, or term`.
- missingTerm: `Mention in "<spec>" at <path> points to missing entry "term.<key>" of "<target>".` is the prose-mentions error for a term key the target does not carry.
- termLocation: `{ spec, file, entry: "term[<i>]", key?, line }` is a term's row in the location table; a mention in a definition, at `model.terms.<term>`, takes that row's line.
- resolutionRow: address resolution (recipe 25) reads `term` through `model.termKeys`; a resolving row gives the marker-free definition as `value` and its recorded file and line. A `section` or `entry` miss gives the available term keys sorted in code-unit order. The grammar text is `spec:<id>#<section>.<key>, section design, ui, question, rule, or term; key lower-camel ASCII`.
- searchRow: entry search (recipe 23) gives a matching keyed term, in section `model` and entry `terms.<term>`, the address `spec:<id>#term.<key>` and the line of its `term[<i>]` row, matches the term key as it matches a rule key, and never walks `termKeys` as content.
- importEmitter: the TypeScript-to-Markdown import writes a keyed term as `- **<term>** — [#<key>] <definition>`, so a keyed TypeScript term imports keyed.
