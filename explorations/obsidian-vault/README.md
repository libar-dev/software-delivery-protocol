# explorations/obsidian-vault: the graph as an Obsidian vault

> **Exploration record, illustrative, nothing ratified.** A throwaway prototype from 2026-10-12, run
> against the corpus at `9d22675` (PR 31's head). It fed the `idea` captures in
> `pack:obsidian-vault-v1`; those Specs carry the intent and the open questions, and this folder
> is the evidence they cite. Never promote this code into the product.

## What it is

Two files turn the one graph into an Obsidian vault:

- `dump.body.js` is an `sdp q` body that returns the reader's values for every Spec, Pack, code
  unit and edge.
- `vault.mjs` writes the vault from that dump. It reads nothing else: no carrier, no source file.

```sh
pnpm --silent sdp:q "$(cat explorations/obsidian-vault/dump.body.js)" --json > corpus.json
node explorations/obsidian-vault/vault.mjs corpus.json <vault-dir> "$(git rev-parse HEAD)"
```

Open `<vault-dir>` as a vault in Obsidian 1.9 or later, which reads Bases. Start at `Start here`.

## What the vault holds

- A note per Spec under `Specs/<family>/`, named by its id without the namespace colon. Its
  properties are reader values: kind, altitude, stated rung, floor reached, whether only the
  author's statement is missing, delivery facts, design columns and Packs. Its body is the
  sections in authored order, then relations both ways with their reasons, bindings and Packs.
- A note per code unit and test anchor under `Code/`, with membership, uses, and the Specs it
  satisfies, references or verifies.
- A note per term a Model section defines, under `Concepts/`, linked from the defining Spec.
- Per Pack, a note listing the members in reading order and a `.base` file with three views.
- `SDP.base` at the root, with the standing queries as views: build backlog, design backlog,
  waiting for the author, blocking questions, decisions.

Relations and prose mentions became wikilinks, and entry addresses became block links
(`#^design-<key>`, `#^question-<key>`, `#^rule-<key>`, `#^ui-<key>`).

## What it showed, measured at `9d22675`

- 624 files: 253 Spec notes, 287 code notes, 74 concept notes, 4 Pack notes with 4 Bases.
- 3,334 wikilinks, none unresolved, and every block link resolves to a block id the vault wrote.
- In Obsidian, `pack.design-iteration-v1.base` renders the Pack's 11 members as one sortable,
  filterable table with the delivery facts as checkboxes (`pack-base-in-obsidian.png`); the
  impact graph is the one member ticked as waiting for its author.

## Findings the Specs carry

- Obsidian refuses `:` in a note name, so ids lose their namespace colon
  (`spec:consumers.obsidian-vault.notes#question.noteNames`).
- Obsidian renders a Spec id in a property as an external link, because the namespace reads as a
  URL scheme (`#question.idProperty` on the same Spec).
- The prototype wrote the commit into every note's banner and carrier link. That breaks the
  projection's determinism; the parent Spec moves any stamp beside the vault instead.
- A Base only applies custom column names when the property carries the `note.` prefix.
- Regeneration must leave `.obsidian/` alone, or an open vault loses its settings.
- Linking a term by matching words was left out on purpose: concepts link only where a Model
  section defines them (`spec:model.term-addresses` would give them addresses).
