# Plan 46, wave 2, lane V

The vault publisher realizes the four carrying behavior Specs. The owned-folder decision stays
`defined` for the owner. The lane starts from `8f45f877a6d3f912f2ed1180d5605e79a4369071` on
`lane/46-build-v`.

## Built

| Spec | Realization and binding |
| --- | --- |
| `spec:consumers.obsidian-vault` | `impl:protocol.vault-command`, `.vault-sync` and `.vault-notes` satisfy it. The verb checks directory placement and the owned-file guard before the shared build, synchronizes through transitional hashes and atomic replacements, and retains prior notes behind a warning index after failed extraction. |
| `spec:consumers.obsidian-vault.notes` | `impl:protocol.vault-notes`, `.vault-sections` and `.vault-text` satisfy it. Spec, Pack, code, test, oracle and keyed-term notes carry reader properties, declared relations in both directions, resolved mention links and entry blocks. |
| `spec:consumers.obsidian-vault.bases` | `impl:protocol.vault-bases` satisfies it. Corpus and Pack Bases use the closed filter grammar and binding formulas. Tests evaluate the written filters against recipes 1, 20, 31 and 33 and the reader. |
| `spec:consumers.obsidian-vault.iteration` | `impl:protocol.vault-watch` satisfies it. The existing coalescing watcher accepts carrier and source events for the vault while validate keeps its existing carrier scope. The acceptance procedure documents intent-note handoff through the existing proposal workflow. |
| `spec:decisions.vault-owned-folder` | The command and synchronization anchors reference it. No code satisfies the decision and its readiness is unchanged. |
| `spec:consumers.command-line` | `impl:protocol.generate-command` now satisfies the whole Spec. The named seam synchronizes the vault before publishing any root, with preflight before build invalidation; `--vault` selects its directory, and check mode leaves it alone. |

All sixteen example Specs in `pack:obsidian-vault-v1` are bound in `test/vault-examples.test.ts`
and state `ready`. Their anchors are `test:protocol.consumers.obsidian-vault.<suffix>`, matching
the example's path. Four `oracle:protocol.vault*` anchors bind the parent spaces. The Base and
two watch examples adopt and commit their generated registrars. No command-line example was
waiting for a binding in this base; its existing examples remain bound.

Additional tests cover build-owned paths and their temporary siblings, a vault containing
`generated/`, malformed lists, dot files, links and special files, partial temporaries, every
Obsidian escape, case collisions before any build mutation, findings, all platform links,
and the vault's generate/check-mode behavior.

## Spec questions and readings

- The parent and notes Example spaces intentionally bind different subsets of their vocabulary.
  Generated registrars require every parent condition and refuse these partial points. Their
  thirteen examples therefore use the documented lower-level `bindExample` adapter with the
  generated step contracts. The three complete points use generated registrars. No carrier
  content or registrar runtime was changed to fill unused dimensions.
- At `spec:consumers.obsidian-vault#rule.interruptedRun`, the injected stopped-run probe fails
  the first content-file rename after the transitional file list is installed. It asserts both
  recorded hashes and the complete note temporary, then compares recovery with a fresh vault.
  File-list replacements use their own atomic rename, and their canonical temporary is also
  recognized by the guard.
- At `spec:consumers.obsidian-vault#design.summaryLine`, the summary counts content files. The
  file list is control metadata and is counted separately in the measurement's total on disk.
- At `spec:consumers.obsidian-vault.iteration#rule.handOff`, handoff uses the existing agent
  proposal workflow. The publisher writes no proposal or carrier; the opening procedure explains
  how the person gives an intent note to an agent.

## Evidence to rerun

```sh
npm test -- test/vault.test.ts test/vault-examples.test.ts
npm test -- test/self-hosting-graph.test.ts test/recipes.test.ts test/skills.test.ts
npm run check
```

Mutating the first Then result in each of the sixteen generated contracts made all sixteen
examples fail. The contracts were restored. This checks authored expected parameters as well as
observed results. The original fresh-vault test failed before the verb existed. Review-driven
probes also failed before the case-collision preflight and escape fixes.

The [acceptance procedure](assets/plan46-vault/README.md) gives the clone, measurement and
Obsidian opening commands. Its [measurement script](assets/plan46-vault/measure.mjs) and
[recorded result](assets/plan46-vault/platform-measurement.json) carry the platform measurement.
The clone's generated folder contains only the generator's files. The person's intent note
survives the refused and successful runs byte for byte.

## Left for integration

Open the generated vault in Obsidian, verify Bases in the app, and capture screenshots. The
owner still ratifies `spec:decisions.vault-owned-folder`. The integration lane owns the README,
skill publisher lists, glossary and decision registry updates. This lane changes none of those
files, the five-root invalidation list or `projection-suite.mjs`.

The accepted graph measurements and the final gate are re-derived at close, not inherited from
this record. Git records the lane's final commit.
