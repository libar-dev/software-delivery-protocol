---
id: spec:consumers.obsidian-vault.notes
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:consumers.obsidian-vault
  dependsOn:
    target: spec:validation.prose-mentions
    reason: a mention can become a link because validation already refuses one that does not resolve
---
# Every Spec, Pack, code unit and term is a note, and every relation is a link

The prototype wrote a note for each Spec, Pack, code unit and test anchor, and for each term a Model section defines. A note carries the reader's values as flat properties, so Obsidian's tables filter on them, and the Spec's sections in authored order. Each declared relation became a wikilink in both directions with its reason, each mention in prose became a wikilink to its Spec or to its entry's block, and each keyed Design, UI, question and rule entry carried a block id named for its address. Backlinks and the graph view then show what rests on a Spec without a query.

Two findings shape the questions below. Obsidian refuses a colon in a note's name, so a note cannot be named by its id as written. And Obsidian renders a Spec id in a property as a link to an external address, because the namespace reads as a URL scheme.

## Intent

- outcome: Write one note per Spec, Pack, code unit and Model term, with the reader's values as properties and every relation and checked mention as a wikilink, so a person follows the graph in both directions.

### Open questions
- [blocking #noteNames] How is a note named, when Obsidian refuses a colon and a vault may also hold notes of another corpus?
  - decider: owner
  - provisional: the id without its namespace colon, as model.rule-keys, pack.design-iteration-v1 and impl.protocol.reader, with the id and the title as aliases
- [blocking #propertySet] Which reader values become properties?
  - decider: owner
  - provisional: kind, altitude, stated rung, floor reached, whether only the author's statement is missing, the delivery facts as booleans, the design columns as numbers, the Packs as links, the carrier's repository path, and tags for kind and stated rung; every value read from the reader, none computed by the generator
- [non-blocking #idProperty] Which property form keeps a Spec id plain text where Obsidian would render it as an external link?
- [non-blocking #termNotes] A term note comes only from a Model section, and no note links a term by matching words; does a term of the ratified glossary, which is not graph data, get a note too?
  - provisional: no; a glossary term gains a note when a Spec defines it in a Model section

## Behavior
