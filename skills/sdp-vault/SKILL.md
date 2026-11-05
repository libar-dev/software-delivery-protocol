---
name: sdp-vault
description: Keep an Obsidian vault of the project's Spec graph and turn what a person writes in it into checked carrier edits. Use when placing, running or watching `sdp vault`, recovering a refused or failed run, or applying intent notes from the vault.
metadata:
  realizes: spec:consumers.vault-on-ramp
---

# Keep the Obsidian vault

`sdp vault` writes the graph as linked notes and Bases into `sdp/`, the one folder it owns in the
vault (`spec:decisions.vault-owned-folder`). Everything else is the person's: notes, intent
notes under `intent/`, Obsidian's settings. The vault is a projection: edit the carrier, Pack
manifest or source file a note's banner names. Flags, where a vault may lie and what the watch
follows: `sdp vault --help`. Recipes not named here sit in the catalog's categories under the
installed package root, such as `docs/agent-surface/recipes.md#citations-and-checks` and
`docs/agent-surface/recipes.md#change-and-proposals`.

## Hazards

- Save every word the person wrote, outside `sdp/`, before you delete a refused path or `sdp/`
  itself: the next run regenerates what you delete, never what they wrote.
- The default vault lies under `generated/`, usually git-ignored, where a clean checkout loses every
  intent note. For notes worth keeping, pass `--out` a directory of the person's own.
- `sdp vault` enters the shared build and removes the five page roots; `sdp generate --vault DIR`
  publishes both.
- An index that opens with "The last regeneration failed" means every note shows an older graph,
  and only the index says so.

## Place and recover

Tell the person to open DIR itself as the vault, never `sdp/`: links and Base filters resolve from
DIR. A refused run writes nothing (`spec:consumers.obsidian-vault#rule.guard`). For each path:

- `(changed)`: move the person's edits into an intent note, then delete the file.
- `(unknown)`: move a person's note out of `sdp/`; delete a stray `.<name>.sdp-tmp`.
- `(not a file)`: remove it.
- `(malformed)`: save the person's files under `sdp/`, then delete `sdp/` whole.

Keep or delete a changed Base with the person.

## Turn intent notes into carrier edits

The vault writes no carrier and no proposal
(`spec:consumers.obsidian-vault.iteration#rule.handOff`): you write the proposal
(`spec:consumers.intent-composition`) and, after its check, the edits.

1. Before the person reads, record in an intent note the commit the vault shows them: `HEAD` on
   a clean tree. Pending carrier edits are committed only under the session's commit authority;
   without it, ask the person to commit them or to name the base. That commit is the proposal's
   base, never the latest synchronization: `--watch` refreshes the notes, and a check against the
   newer graph reports an entry that moved under the person as unmoved.
2. Convert each link back to what it names
   (`spec:consumers.obsidian-vault.notes#rule.addressRoundTrip`): a note name restores the colon
   after its namespace (`spec.model.rule-keys` is `spec:model.rule-keys`), a term note
   `term.<path>.<key>` is `spec:<path>#term.<key>`, and a block id `^<section>-<key>` in a Spec's
   note is `spec:<id>#<section>.<key>`.
3. Check them from the project root, `<skill-dir>` being this skill's directory. Recipe 25,
   Address resolution (`dist/recipes/25-address-resolution.js`), calls a bare id malformed, so
   this body looks ids up apart. The example's two links are the Protocol's own, which
   `--protocol` selects; check your converted links without it:

   ```sh
   node <skill-dir>/../sdp-agent-surface/scripts/q.mjs 'const ids = new Set(graph.nodes.map((n) => n.id)); const { rows } = await recipes(25, { addresses: params.refs.filter((r) => r.includes("#")) }); return [...params.refs.filter((r) => !r.includes("#")).map((r) => `${r}: ${ids.has(r) ? "found" : "unknown"}`), ...rows.map((r) => `${r.address}: ${r.resolves ? `${r.file}:${r.line}` : r.reason}`)]' --params '{"refs":["spec:model.rule-keys","spec:consumers.obsidian-vault#rule.guard"]}' --protocol
   ```

4. Write the proposal against the base, with its memo for the person to confirm, then check and
   apply it as `spec:consumers.delivery-session-on-ramp#rule.receiveProposal` states, in
   [proposals.md](../sdp-sessions/references/proposals.md).
