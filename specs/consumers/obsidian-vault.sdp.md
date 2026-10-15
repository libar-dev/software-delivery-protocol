---
id: spec:consumers.obsidian-vault
kind: behavior
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:consumers.projections-model
    reason: a projection for a person who iterates on designs in a notes app
  dependsOn:
    target: spec:consumers.reader
    reason: the generator reads the graph through the reader's joined values
  decidedBy:
    target: spec:decisions.shipped-projections-frozen
    reason: the vault is a new root, since the four shipped projections stay frozen
---
# An Obsidian vault lets a person iterate on designs from the one graph

The Design Review links a Spec's relations both ways and gives keyed Pack questions a separate carrier-line link, but it offers no built-in filtering of a Pack or navigation from arbitrary prose mentions to their entries. The Spec Studio is designed for both a person who iterates on a design in the repository and a pull request reviewer who holds only a link. A linked-notes view would let a person follow relations, filter members by rung and design columns, open entries by address and see each pass's edits arrive. It is a projection of its own, not the Studio's local half: the Studio's page set serves a reader who holds a link, the vault serves a person who iterates in a notes app, and each has its own verb and root. It waits for a reader who asks for it once the Studio's page set exists.

Obsidian already does that for linked Markdown notes with properties: backlinks, a graph view, search, and filterable tables it calls Bases. The prototype in `explorations/obsidian-vault/` wrote notes from dumped graph and reader values, with relations and checked mentions as wikilinks, entry addresses as block links, and Bases for Pack members and standing queries. Pack members could be read as a sortable table. The prototype joined relation lists and computed flat properties itself, and its dump renamed `statedNextRungFailures` to `nextRungFailures`; those shortcuts are evidence for the product design, not the reader's contract.

The principle is a linked-notes view regenerated from the one graph; Obsidian and its Bases are the representation chosen first. Like every projection, the vault states no truth, and two builds of one graph are byte-identical, so no note names a commit or a time: a publishing step may write a stamp beside the vault, as the Studio's sharing rule does. Intent is still written only in the carriers.

## Intent

- actor: A person in the repository who designs a capability in passes while an agent edits the carriers.
- problem: The Markdown Design Review offers no built-in Pack filters or navigation from arbitrary prose mentions to their entries, so a person iterating on a design still reads carrier files alongside it.
- outcome: Generate an Obsidian vault from the one graph, in which a person reads, navigates and filters the corpus and follows each pass's edits, while the carriers stay the only place intent is written.
- risk: A notes app invites editing, and an edit to a generated note is lost at the next regeneration without reaching the carrier.

### Open questions
- [non-blocking #otherNotesTools] Does the vault keep to the wikilinks and properties other notes tools read, or use Obsidian's Bases freely?
  - decider: owner
  - provisional: notes and links stay plain Markdown with wikilinks any such tool reads, and the Bases are Obsidian's alone
- [blocking #regenerationScope] Which files does the generator own, how are stale generated files removed, and where do Obsidian settings and a person's intent notes live so that regeneration and build invalidation never remove them?
  - decider: owner
  - provisional: the generator owns only its generated note folders and Bases; Obsidian settings and authored intent notes sit outside that owned set, and a completed regeneration removes stale generated notes
  - trigger: a person asks for a vault beside the Studio's static page set

## Behavior
- rule: [#ownProjection] The vault is a projection of its own, written by its own verb under `generated/obsidian-vault/`, and no part of the Studio's page set.
