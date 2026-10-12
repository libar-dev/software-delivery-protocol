---
id: spec:consumers.obsidian-vault.notes
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:consumers.obsidian-vault
  dependsOn:
    - target: spec:validation.prose-mentions
      reason: a mention can become a link because validation already refuses one that does not resolve
    - target: spec:consumers.binding-language-views
      reason: rendered binding labels must state existence rather than liveness
---
# Every Spec, Pack, code unit and term is a note, and every relation is a link

The prototype wrote a note for each Spec, Pack, code unit and test anchor, and for each term a Model section defines. A note carries the reader's values as flat properties, so Obsidian's tables filter on them, and the Spec's sections in authored order. Each declared relation became a wikilink in both directions with its reason, each mention in prose became a wikilink to its Spec or to its entry's block, and each keyed Design, UI, question and rule entry carried a block id named for its address. Backlinks and the graph view then show what rests on a Spec without a query.

Two findings shape the questions below. Obsidian refuses a colon in a note's name, so a note cannot be named by its id as written. And Obsidian renders a Spec id in a property as a link to an external address, because the namespace reads as a URL scheme.

## Intent

- outcome: Write one note per Spec, Pack, code unit, test anchor, oracle anchor and Model term, with graph and reader values as properties and every declared relation and checked mention as a wikilink, so a person follows the graph in both directions.

### Open questions
- [blocking #noteNames] How is a note named, when Obsidian refuses a colon and a vault may also hold notes of another corpus?
  - decider: owner
  - provisional: within one corpus, preserve the full id and replace its namespace colon with a dot, as spec.model.rule-keys, pack.design-iteration-v1 and impl.protocol.reader, keeping the full id and title as aliases; filenames must remain distinct on the target filesystem, and naming across multiple corpora remains open
- [blocking #propertySet] Which reader values become properties?
  - decider: owner
  - provisional: kind, altitude, stated rung, floor reached, `statedNextRung` and `statedNextRungFailures` under their reader names, internal delivery-fact booleans whose rendered labels are Implementation binding and Verifier binding, each displayed as present or none under spec:consumers.binding-language-views, design columns, Pack links and the repository-relative carrier path; a Base may select where `statedNextRung` is present and `statedNextRungFailures` is empty, while semantic joins and floor computation stay with the reader
- [non-blocking #idProperty] Which property form keeps a Spec id plain text where Obsidian would render it as an external link?
- [non-blocking #termNotes] A term note comes only from a Model section, and no note links a term by matching words; does a term of the ratified glossary, which is not graph data, get a note too?
  - provisional: no; a glossary term gains a note when a Spec defines it in a Model section
- [blocking #termNoteGrain] Does a term defined in several Specs get one note per defining Spec and term, or one note that explicitly lists every defining Spec and its definition?
  - decider: owner
  - provisional: one note per defining Spec and term, so each definition retains its authored owner; term-address syntax and keys remain the separate term-addresses design
- [blocking #mentionSource] Prose mentions reach no reader value: the validator checks them and recipe 22 lists their pairs by section and entry. Which value turns a mention into a wikilink, a mention scanner the validator and the vault share, or recipe 22's rows?
  - decider: owner
  - provisional: one mention scanner the validator and the vault share

## Behavior
