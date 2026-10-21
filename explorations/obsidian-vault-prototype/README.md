# explorations/obsidian-vault-prototype: the designed vault, checked on two corpora

> **Exploration record, evidence only, nothing ratified.** A throwaway prototype from 2026-10-21,
> written by the vault's design pass at `dfeabee` to check the design `pack:obsidian-vault-v1` now
> carries. The Specs are the design; this folder is the evidence they cite. Never promote this code
> into the product: the build writes the vault in `src/` from the Specs, not from this script.

## What it is

- `vault.mjs` derives the graph with the built engine (`dist/`), renders the vault the Specs
  describe (notes, properties, links, block ids, Bases, the index), and synchronizes the
  generated folder `sdp/` under a vault directory with the edit guard and the file list
  `.sdp-vault.json`.
- `check.mjs` renders twice and checks what the Specs promise, then exercises the guard in a
  scratch vault.

```sh
npm run build
node explorations/obsidian-vault-prototype/vault.mjs . /tmp/vault --exclude explorations --exclude examples --exclude test/fixtures/import/parity
node explorations/obsidian-vault-prototype/check.mjs . /tmp/vault-checks --exclude explorations --exclude examples --exclude test/fixtures/import/parity --simulate-term-keys
node explorations/obsidian-vault-prototype/check.mjs ../platform-chunk45 /tmp/vault-checks-platform --simulate-term-keys
```

`--simulate-term-keys` coins a key for every Model term, because no term carries a key until the
term-address design (`spec:model.term-addresses`) is built; it exercises term notes and `^term-`
block links, nothing more.

## What it measured

Both runs read their corpus only; every file written lies under the scratch directory.

| Check | This repository at `dfeabee` plus this pass | libar-platform at `b038bd4` |
| --- | --- | --- |
| Files under `sdp/` | 721: 290 Spec notes, 339 code notes, 76 term notes, 7 Pack notes with 7 Bases, `specs.base`, `index.md` | 541: 243 Spec notes, 181 code notes, 103 term notes, 6 Pack notes with 6 Bases, `specs.base`, `index.md` |
| Two renders byte-identical | yes | yes |
| Paths distinct ignoring case | yes | yes |
| Links outside code that resolve | 4,820 of 4,820, 243 of them block links | 4,614 of 4,614, 125 of them block links |
| Properties other than `aliases` free of URL-like values | yes | yes |
| Bases inside the closed clause grammar | 8 of 8 | 7 of 7 |
| Build backlog, design backlog, nothing blocks, blocking questions, decisions: view equals source | 0, 21, 32, 8, 42, all equal | 0, 80, 221, 10, 22, all equal |
| Each Pack's Base selects its members | 7 of 7 | 6 of 6 |
| Regenerating one graph writes nothing and keeps modification times | yes | yes |
| A Spec that left the graph loses its note; an intent note and `.obsidian/` survive | yes | yes |
| A note a person wrote under `sdp/` refuses the run, which writes nothing | yes | yes |
| A generated note a person changed refuses the run and keeps the edit | yes | yes |

A render and synchronization of the platform's vault took about one second; a second run over the
same graph wrote no file.

## What it found

- The first link check failed on the Specs' own Design entries, which show link forms inside code
  spans. Obsidian reads no link inside a code span or a fenced block, so the check, and the rule
  `spec:consumers.obsidian-vault#rule.linksResolve`, now leave code out.
- An example's `exercises` keys name rules of the verified Spec, so on the verified Spec's note the
  block link points into that same note; the first draft pointed it at the example.
- Obsidian 1.14.4's own code (`app.js` in `obsidian-1.14.4.asar`, read, not run) renders a text or
  list property value as an external link when the value holds no space and `new URL(value)`
  parses, which `spec:consumers.reader` does, and the same values become URL values in a Base. The
  `aliases` property renders each value with `setText`, as plain text. That settles
  `idProperty`: an id with its colon lives in `aliases` only.
- A Base's list `contains` compares by `looseEquals`, and a link compares by the file it resolves
  to, so `packs.contains(link("sdp/packs/<note>.md"))` selects a Pack's members.

## What it does not show

- Nothing here ran Obsidian. The Bases were parsed as YAML and their filters evaluated by the
  check's own reading of the closed clause grammar, not by Obsidian. The plan's acceptance opens
  the vault built from a copy of the platform in Obsidian.
- The watch loop is not prototyped; `synchronize` is the step each watch cycle runs.
- Term notes use simulated keys.
