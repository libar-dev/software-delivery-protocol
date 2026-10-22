---
name: sdp-vault
description: Keep the Protocol's Obsidian vault of the graph and apply the notes a person writes in it. Use when choosing a vault directory, running or watching `sdp vault`, recovering a refused or failed synchronization, keeping a changed Base, or turning intent notes from the vault into carrier edits.
---

# Keep an Obsidian vault of the graph

`sdp vault` writes the one graph as linked Markdown notes and Obsidian Bases into the folder
`sdp/`, which it owns inside a vault directory (`spec:consumers.obsidian-vault`). A person reads,
filters and follows the design there and writes intent in notes of their own; the carriers stay
the only place intent is written. This skill realizes `spec:consumers.vault-on-ramp`. It cites the
vault's Specs for law; `sdp vault --help` owns the flags.

## Choose the vault directory

```sh
pnpm exec sdp vault . --out ../design-vault
pnpm exec sdp vault . --out ../design-vault --watch
pnpm exec sdp generate . --vault ../design-vault
```

In this source checkout the first run is:

```sh
pnpm --silent sdp vault . --exclude explorations --exclude examples --exclude test/fixtures/import/parity --out ../sdp-vault
```

- Without `--out` the vault is `<root>/generated/obsidian-vault/`. Discovery skips it, and an
  adopter usually keeps `generated/` out of git, so point `--out` at a directory of the person's
  own when they want to keep their intent notes.
- `--out` resolves against the working directory, not the root.
- A vault inside the root lies under a directory discovery skips (`generated/`, `node_modules/`,
  `dist/`, `coverage/` or a dot-directory) or under an excluded prefix, and apart from every path
  the build writes or removes (`spec:consumers.obsidian-vault#design.buildOwnedPaths`). The run
  refuses any other directory before the build, writing nothing.
- Open the vault directory itself in Obsidian, never its `sdp/` folder: every link and Base filter
  names its target by a path from that directory.

## Keep the person's notes apart

- The command writes, moves and removes files only under `sdp/`. Obsidian's settings, a person's
  notes and their intent notes, by convention under `intent/` at the top of the vault, lie outside
  it and stay as they are (`spec:decisions.vault-owned-folder`).
- Each generated note opens with a banner naming the carrier, Pack manifest or source file to edit
  instead. An edit to a generated note never reaches the carrier, and the next run refuses while
  that note is changed.

## Synchronize and watch

- A run validates, then rewrites only the files whose bytes changed, removes the notes whose node
  left the graph, and records what it wrote in `sdp/.sdp-vault.json`. It prints
  `Wrote <dir>/sdp (<n> files: …)` and returns validate's exit code: findings show on their notes
  and on the index, and never withhold the vault.
- `sdp vault` enters the shared build, so it removes the five page roots. When those must be
  published too, run `sdp generate --vault DIR`: it synchronizes the vault first, then publishes
  every root, and under `--check-clean` leaves the vault alone. The vault has no check mode.
- `--watch` runs again after each create, change, delete or rename of a carrier or of a `.ts` or
  `.tsx` source other than a `.d.ts`, outside the skipped directories, the exclusions, the vault
  and the build's own paths. Events during a run coalesce into one more run, and SIGINT exits 0.
  Obsidian reloads a rewritten note in place, and every other note keeps its bytes
  (`spec:consumers.obsidian-vault.iteration#rule.watch`). `sdp validate --watch` follows no source
  files.
- When the index opens with
  `The last regeneration failed, and the notes show the graph of the last one that succeeded.`,
  extraction failed and every note shows an older graph. Fix the errors listed under that line and
  run again.

## Recover a refused run

A refused run writes and removes nothing. It prints one line per path, then
`sdp vault: nothing was written or removed; keep what you wrote outside sdp/, then delete each refused path, or delete sdp/ whole`,
and exits 1 (`spec:consumers.obsidian-vault#rule.guard`). Save the person's words before you delete
anything:

| The line ends with | It names                                                                | Do                                                                   |
| ------------------ | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `(changed)`        | a generated note someone edited                                         | move the edited words into a note under `intent/`, then delete it    |
| `(unknown)`        | a file under `sdp/` the command did not write, or a temporary cut short | move a person's note out of `sdp/`; delete a stray `.<name>.sdp-tmp` |
| `(not a file)`     | a symbolic link or special file under `sdp/`                            | remove it                                                            |
| `(malformed)`      | a file list the command did not write                                   | save what a person wrote under `sdp/`, then delete `sdp/` whole      |

The next run regenerates every file you deleted. Three more cases:

- A changed `.base` file is kept, not refused: the run warns
  `sdp vault: warning: sdp/<path> has changed; delete it to regenerate` and goes on. Leave it while
  the person wants their Base; delete it to take the generated one back.
- Two notes whose paths differ only in case refuse the run before it writes, naming both ids.
  Renaming one id is a carrier edit, made through `sdp-authoring`.
- A run stopped part way leaves files the next run recognizes and completes.

## Turn intent notes into carrier edits

A person answers a design pass in notes under `intent/`, citing entries by block link or by entry
address. The vault writes no carrier and no proposal; you write both, through a checked change
proposal (`spec:consumers.obsidian-vault.iteration`):

1. Convert each link back to what it names
   (`spec:consumers.obsidian-vault.notes#rule.addressRoundTrip`). A note's name is its id with the
   colon after the namespace written as a dot, and a block id `^<section>-<key>` in a Spec's note
   is the entry `#<section>.<key>`: `spec.<path>.md#^design-limit` names
   `spec:<path>#design.limit`. A term note `term.<path>.<key>` names `spec:<path>#term.<key>`.
2. Establish the commit whose graph the person read; it is the proposal's base. At the start of a
   design pass, commit pending carrier edits, record that commit in a note under `intent/`, run
   `sdp build` and copy `generated/graph.json` outside `generated/`. Otherwise write the graph
   with that commit's own engine, as the design diff's catalog entry (recipe 35) shows: the
   catalog is `docs/agent-surface/recipes.md` in the Protocol repository and
   `node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md` in an
   adopter. A later
   synchronization does not change this base: under `--watch` the vault can refresh after the
   person began writing, and checking against the newer graph hides what changed in between. Use
   the current graph only when the person confirms it is the version their intent addresses and
   its carriers match the named commit. When the reading base cannot be established, ask the
   person to review the current design and restate the intent against a known commit before you
   write a proposal.
3. Write the change proposal against that base, following the shipped schema
   `schemas/sdp-proposal-1.schema.json`, and render its memo with the proposal memo (recipe 49)
   for the person to confirm.
4. Run the proposal check (recipe 38). In this source checkout the same body runs through
   `pnpm --silent sdp:q`:

   ```sh
   pnpm exec sdp q 'return await recipes(38, params)' --params proposal=@proposal.json --params base=@../base-graph.json --json
   ```

5. If `schemaProblems` is non-empty, the answer has no change rows: return the proposal for
   correction. Send a change to the person when its `moved` is `true` or `null`, which the check
   could not compare, when any `scope` item has `resolvesAtHead: false`, or when its
   `relationTarget` has `resolvesAtHead: false`. Apply only the remaining `moved: false` changes,
   as ordinary carrier edits through `sdp-authoring`, from a worktree `sdp validate` reports no
   error on (`spec:consumers.intent-composition#rule.changedScope`). Under `--watch` the person
   sees each edit arrive in its note.

The graph outranks this skill. If a note, a recipe or this skill disagrees with the carrying Spec,
report the skill as drift and follow the Spec.
