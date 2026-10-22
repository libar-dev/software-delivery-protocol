---
id: spec:consumers.obsidian-vault.notes
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault
  dependsOn:
    - target: spec:validation.prose-mentions
      reason: a mention can become a link because validation already refuses one that does not resolve
    - target: spec:consumers.binding-language-views
      reason: rendered binding labels must state existence rather than liveness
    - target: spec:model.term-addresses
      reason: a term note exists for a Model term that carries a key and so an address
---
# Every Spec, Pack, code unit and keyed term is a note, and every relation is a link

A note carries the reader's values as flat properties, so Obsidian's tables filter on them, and the Spec's sections in the graph's order. Each declared relation is a wikilink in both directions with its reason, each mention in prose is a wikilink to its Spec or to its entry's block, and each keyed entry carries a block id named for its address. Backlinks and the graph view then show what rests on a Spec without a query.

Two findings from the prototypes shape the names and properties. Obsidian refuses a colon in a note's name, so a note cannot be named by its id as written. And Obsidian renders a text or list property as a link to an external address whenever its value holds no space and parses as a URL, which `spec:` followed by a path does, while it renders an alias as plain text. Every link also names the note's `.md` extension, so an id whose last segment reads like another file type's extension, such as `base`, still links to its note.

## Intent
- outcome: Write one note per Spec, Pack, code unit, test anchor, oracle anchor and keyed Model term, with graph and reader values as properties and every declared relation and checked mention as a wikilink, so a person follows the graph in both directions.

## Behavior
- rule: [#oneNotePer] The vault holds one note per Spec, Pack, code unit, test anchor and oracle anchor, and one per Model term that carries a key, which `spec:model.term-addresses` gives an address; a term without a key appears only in its Spec's note, since no address can name it, and a ratified glossary term gains a note only where a Spec's Model section defines it with a key.
- rule: [#termNoteGrain] A term defined in several Specs gets one note per defining Spec and term, so each definition keeps its authored owner; the term's aliases bring the notes together when a person types it.
- rule: [#noteNames] A note is named by its id with the colon after the namespace replaced by a dot, and a term note by `term.`, its Spec's path, a dot and its key; one vault holds the notes of one corpus.
- rule: [#caseCollision] Two notes whose paths differ only in case refuse the run before it writes, naming both ids, so no two names collide on a file system that ignores case; the run writes and removes nothing and exits 1.
- rule: [#idInAliases] A note's id, colon included, is written as plain text only in its `aliases` property and in the code span of its head line, since Obsidian shows an alias as plain text; a property that names another node holds a link to its note, and no other property value the generator composes is an id or an entry address. Authored text in a property, such as a title or a label, is written as authored, and the generator never treats one that looks like an address as an address.
- rule: [#readerProperties] A Spec note's properties are the reader's values for that Spec, listed under `spec:consumers.obsidian-vault.notes#design.specProperties`; every join, delivery fact, floor and rung among them is one the reader computed, and the generator computes none.
- rule: [#bindingProperties] A Spec's bindings are two booleans, `implementationBinding` true where the reader's delivery facts hold `implemented` and `verifierBinding` true where they hold `has-verifier`, and the note's body renders the four binding lines `spec:consumers.binding-language-views` states, so no rendered label is a delivery-fact name.
- rule: [#relationsBothWays] Each declared relation whose two ends have notes is a link on the notes at both ends, with its type, its reason, and for an example's `verifies` a link to the block of each rule it exercises in the verified Spec's note; an end with no note, such as a target that does not resolve, and an exercised key the verified Spec does not carry, appear on the source note as their id or key in a code span, with no link.
- rule: [#blockIds] Each keyed Design and UI entry, keyed open question, keyed rule or flow, and keyed Model term ends its line in its Spec's note with the block id `^<section>-<key>`, with section `design`, `ui`, `question`, `rule` or `term`.
- rule: [#mentionLinks] A mention in any text the vault renders from the graph, found by the scanner the prose-mention validator uses, becomes a link when its Spec resolves and, for an entry address, its entry does; a mention that does not resolve stays as written. A code span holding exactly one mention becomes that link, and any other code span stays code.
- rule: [#textEscaped] Text from the graph renders as written, except that the generator escapes what Obsidian would read as a link, an embed, a tag, a block id, a comment, a highlight or math, so no note holds a link, tag or block id the graph does not.
- rule: [#addressRoundTrip] Every note name and block id converts back to what it names: a note name to its id by restoring the colon after the namespace, a term note's name to its term address, and a block id in a Spec's note to its entry address, so an agent reading a link a person wrote names the entry it cites.

## Design
- noteName: `<namespace>.<path>` for an id `<namespace>:<path>`, as `spec.model.rule-keys`, `pack.design-iteration-v1` and `impl.protocol.reader`; `term.<path>.<key>` for the term address `spec:<path>#term.<key>`.
- linkForm: `[[<path from the vault>.md|<id or address>]]`, with `#^<block id>` after `.md` for an entry; every link names the file's extension, and an embedded Base is `![[sdp/packs/<note>.base]]` or `![[sdp/specs.base]]`.
- blockId: `<section>-<key>`, written as ` ^<section>-<key>` at the end of the entry's line, so `spec:<id>#design.limit` opens as `[[sdp/specs/<family>/<note>.md#^design-limit|spec:<id>#design.limit]]`.
- propertyEncoding: the properties sit between two `---` lines at the top of the note, one per line as `<key>: <JSON value>`, in the order listed below; a property the graph does not hold is left out.
- specProperties: `aliases` (the id, then the title), `title`, `specKind`, `altitude`, `statedReadiness`, `derivedReadiness` (`none` when no rung derives), `statedNextRung` (left out when the Spec states `ready`), `statedNextRungFailures` (the failing clause ids), `implementationBinding`, `verifierBinding`, `designEntries`, `declarations`, `openQuestions` (a count), `blockingQuestions`, `decisions` (links to the notes of the resolving decisions the design columns name), `packs` (links to the Pack notes), `carrier` (the root-relative carrier path).
- packProperties: `aliases` (the id, then the title), `title`, `manifest` (the root-relative manifest path).
- codeProperties: `aliases` (the id), `label`, `role`, `layer`, `context`, `component` (a link to the component's note), `sourceFile` (root-relative), `sourceLine`.
- termProperties: `aliases` (the term, then its address), `definedIn` (a link to the defining Spec's note).
- banner: the first line after the properties, `` > [!info] Generated by `sdp vault` from the graph. Edit the <carrier|Pack manifest|source file> `<root-relative path>`, never this note: a regeneration refuses while a note it wrote has changed. ``, naming the Spec's carrier, the Pack's manifest or the unit's source file.
- headLine: under a Spec note's title, `` `<id>` · <kind display label> · <altitude> · stated <rung> · floor <rung or none> ``, then ` · <stated next rung>: <failing clause ids, or nothing blocks>` when the Spec states less than `ready`.
- specNoteBody: the banner, `# <title>`, the head line, the narrative's paragraphs, each section under `## <Section>` in the graph's order with Intent's open questions under `### Open questions` and an example's steps or an example space's vocabulary in a fenced `gherkin` block, then `## Relations` with `### From this Spec` and `### Toward this Spec`, `## Bindings`, `## Packs` and `## Findings`, each heading left out when it has nothing under it.
- bindingLines: under `## Bindings`, `- Implementation binding: present` or `none` with each realizing unit, the units that reference the Spec, `- Verifier binding: present` or `none` with each verifier, `- Expected-outcome oracle: present` or `none`, and `- Runtime observation: not tracked`.
- packNoteBody: the banner, `# <title>`, the framing, `## Members, filterable` with the Pack's Base embedded, `## Members, in reading order` as a numbered list in manifest order, each a link with its stated rung, floor and stated next rung or `nothing blocks`, then `## Boundary` with the reader's four boundary lists and `## Findings`.
- codeNoteBody: the banner, `# <id>`, the label, `` `<file>:<line>` ``, then link lists under `## Member of`, `## Members`, `## Uses`, `## Used by`, `## Satisfies`, `## References`, `## Verifies` and `## Models`, each left out when empty.
- termNoteBody: the banner, `# <term>`, the definition, and `Defined in [[<Spec note>.md#^term-<key>|<term address>]].`
- caseCollisionMessage: `sdp vault: <first id> and <second id> name notes whose paths differ only in case; nothing was written`, one line per colliding pair, the ids in code-unit order.
- escapes: a backslash before `[[`, `%%`, `==`, `$`, a `#` that opens a tag after a space or at a line's start, and a `^` that would end a line as a block id; text inside a code span is left as written.

## Example space
The world writes a probe corpus whose Specs mention each other, runs the vault command, and reads the mentioning Spec's note from disk. A keyed Model term is written as `spec:model.term-addresses` states.

```gwt-vocabulary
Given a corpus holding the Spec {source:string} whose narrative mentions {mention:string}
Given a corpus holding the Specs {first:string} and {second:string}
Given the Spec {target:string} keys the Design entry {key:string}
Given the Spec {termSpec:string} defines a Model term with the key {termKey:string}
When the vault command runs over that corpus
Then the run exits {exitCode:number}
Then the refusal names {named:string}
Then nothing under the generated folder was written: {nothingWritten:boolean}
Then the mentioning Spec's note is {notePath:string}
Then the mention renders as {rendered:string}
Then the term's note is {termNotePath:string}
Then the defining Spec's note carries the block id {blockId:string}
Then the note's aliases open with {alias:string}
Then no property but aliases holds an id or an entry address as plain text: {plainProperties:boolean}
```
