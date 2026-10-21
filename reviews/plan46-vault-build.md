# Plan 46, wave 2, lane V

The vault publisher realizes the four carrying behavior Specs. The owned-folder decision stays
`defined` for the owner. The lane starts from `8f45f877a6d3f912f2ed1180d5605e79a4369071` on
`lane/46-build-v`.

## Built

| Spec | Realization and binding |
| --- | --- |
| `spec:consumers.obsidian-vault` | `impl:protocol.vault-command`, `.vault-sync` and `.vault-notes` satisfy it. The verb checks directory placement and the owned-file guard before the shared build, synchronizes through transitional hashes and atomic replacements, and retains prior notes behind a warning index after failed extraction. |
| `spec:consumers.obsidian-vault.notes` | `impl:protocol.vault-notes`, `.vault-sections` and `.vault-text` satisfy it. Spec, Pack, code, test, oracle and keyed-term notes carry reader properties, declared relations in both directions, resolved mention links and entry blocks. |
| `spec:consumers.obsidian-vault.bases` | `impl:protocol.vault-bases` and `.vault-notes` satisfy it. Corpus and Pack Bases use the closed filter grammar and binding formulas. Tests evaluate the written filters against recipes 1, 20, 31 and 33 and the reader. |
| `spec:consumers.obsidian-vault.iteration` | `impl:protocol.vault-watch`, `.vault-sync` and `.vault-text` satisfy it. The existing coalescing watcher accepts carrier and source events for the vault while validate keeps its existing carrier scope. The acceptance procedure documents intent-note handoff through the existing proposal workflow. |
| `spec:decisions.vault-owned-folder` | The command and synchronization anchors reference it. No code satisfies the decision and its readiness is unchanged. |
| `spec:consumers.command-line` | `impl:protocol.generate-command`, `.adopter-help` and `.agent-surface-cli` together satisfy it. The named seam synchronizes the vault before publishing any root, with preflight before build invalidation; `--vault` selects its directory, and check mode leaves it alone. |

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
npm test -- test/vault.test.ts test/vault-windows.test.ts test/vault-examples.test.ts
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
skill publisher lists, glossary and decision registry updates. Those documentation files stay with integration. The shared build now owns the path list the vault
checks, including registrar siblings; `projection-suite.mjs` still certifies the same five roots.

The accepted graph measurements and the final gate are re-derived at close, not inherited from
this record. Git records the lane's final commit.


## Review fixes

The review read `230e545`. Every functional regression below failed against that implementation
before its fix. The binding oracle also failed against the old anchors. For test-only findings,
the named mutation failed before the production code was restored.

| Finding | Response and evidence |
| --- | --- |
| 1. Case-variant build output | Fixed. Placement cases `generated/Design-Review` and `generated/CONTRACTS/new` fail before the build changes any file. Physical paths use the native realpath function and overlap compares ignore case, including paths that do not exist. |
| 2. Saves during extraction | Fixed. Successful and failed vault cycles, failed generate cycles, and direct synchronization reject a stale snapshot before writing the transitional list. Tests retain the saved bytes and the rest of the vault. |
| 3. Help binding | Fixed. The help composer and dispatcher now satisfy `consumers.command-line` alongside generate. The independent binding-edge oracle failed before the anchor corrections. |
| 4. Rule block ids | Fixed. Example-space prose starts after a blank line and a heading. A rendering test and a malformed-target test failed first; both link checkers now reject lazy paragraph continuations after block ids. |
| 5. Family-directory case collisions | Fixed. The check includes every path prefix. The `Probe.one` versus `probe.two` CLI test failed first and checks that the whole root stays unchanged. |
| 6. Failed-extraction index | Fixed. The build returns its extraction report, and vault and generate render only each error's relative file and message. Both exact-index tests failed first. Stderr's summaries, validator ids and warnings no longer become note content. |
| 7. Windows containment | Fixed. The parent traversal test uses the platform separator. The Windows-path probe failed first and now accepts a separate output directory. |
| 8a. Unresolved mention observation | Fixed. The example observes the exact narrative token from the note, independently of its expectation. Replacing the unresolved token with a code span fails that example. |
| 8b. Blocking questions | Fixed. The Base test reads each question's own blocking flag from recipe 20, and its idea Spec has a non-blocking question. Replacing the note's blocking count with its total question count fails the example. |
| 8c. Pruning | Fixed. A test checks stale nested folders and unrelated empty nested folders. Removing `prune(folder)` fails it. |
| 8d. SIGINT temporaries | Fixed. Each watch example creates a recognized whole temporary immediately before SIGINT and checks its removal. Disabling stop cleanup fails both examples. |
| 9. Bindings, help wrap and Spec drift | Fixed the iteration and Bases bindings and wrapped generate help. The binding oracle and help-width test failed first. Reported the missing `vault` in `consumers.command-line#design.helpVerbs` for integration, without changing the carrier, as the fix brief requires. |
| 10. Build-owned paths | Fixed. The shared build owns the paths used by both invalidation and vault preflight. Prior and newly generated registrar siblings and their temporaries are included. The prior-registrar overlap test failed first. |

The proposed Spec correction for integration is to add `vault` after `studio` in
`spec:consumers.command-line#design.helpVerbs`. Its rule already promises help for every verb,
and `vault --help` already answers; the pinned list omits it. No carrier promise or readiness
statement was changed in this fix pass.

The review-fix platform measurement at `b038bd4` reproduced 439 files, 431 Markdown notes,
7 Bases and 5,438 resolving links. Initial generation took 2.749 s, refusal 0.505 s, and
regeneration 1.382 s while the repository gate also ran. All 438 content files were unchanged
on regeneration, and the intent note retained the same SHA-256. Re-run the measurement script
in a fresh disposable clone for current timings.
