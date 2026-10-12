---
id: spec:consumers.obsidian-vault
kind: behavior
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:consumers.projections-model
    reason: a projection for a person who iterates on designs in a notes app
  decidedBy:
    target: spec:decisions.shipped-projections-frozen
    reason: the vault is a new root, since the four shipped projections stay frozen
---
# An Obsidian vault lets a person iterate on designs from the one graph

The Design Review renders on GitHub and diffs in git, but a person cannot follow a relation backward in it, filter a Pack's members, or jump from an entry address to its entry. The Spec Studio is designed for a reviewer who holds only a link. A person designing a capability in passes, with an agent editing the carriers, needs to move through the graph while the pass runs: see what a Spec rests on and what rests on it, filter a Pack by rung and design columns, open an entry from its address, and see the next edit arrive.

Obsidian already does that for linked Markdown notes with properties: backlinks, a graph view, search, and filterable tables it calls Bases. A prototype in `explorations/obsidian-vault/` generated a vault from the reader's values alone, with one note per Spec, Pack, code unit and Model term, every relation and checked mention written as a wikilink, entry addresses as block links, and Bases for each Pack's members and for the corpus's standing queries. Every link resolved, the Pack's members read as one sortable table, and nothing was computed outside the reader.

The principle is a linked-notes view regenerated from the one graph; Obsidian and its Bases are the representation chosen first. Like every projection, the vault states no truth, and two builds of one graph are byte-identical, so no note names a commit or a time: a publishing step may write a stamp beside the vault, as the Studio's sharing rule does. Intent is still written only in the carriers.

## Intent

- actor: A person in the repository who designs a capability in passes while an agent edits the carriers.
- problem: The Markdown Design Review cannot be navigated, filtered or followed backward, and the Studio serves a reviewer with only a link, so a designer has no view that moves through the graph while a pass is underway.
- outcome: Generate an Obsidian vault from the one graph, in which a person reads, navigates and filters the corpus and follows each pass's edits, while the carriers stay the only place intent is written.
- risk: A notes app invites editing, and an edit to a generated note is lost at the next regeneration without reaching the carrier.

### Open questions
- [blocking #studioRelation] Is the vault a projection of its own, or the Studio's local half beside the static page set a reviewer with only a link reads?
  - decider: owner
  - provisional: a projection of its own, written by its own verb under `generated/obsidian-vault/`, which the Studio's design pass may adopt as its local half
- [non-blocking #otherNotesTools] Does the vault keep to the wikilinks and properties other notes tools read, or use Obsidian's Bases freely?
  - provisional: notes and links stay plain Markdown with wikilinks any such tool reads, and the Bases are Obsidian's alone

## Behavior
