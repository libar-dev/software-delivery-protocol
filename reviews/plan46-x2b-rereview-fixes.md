# Plan 46, lane x2b: re-review fixes

Read against `7dda71cabe41df99a4f9ee3537dae9e93f32ffdc` on `lane/46-fix-x2b`, from
`/tmp/plan46/reports/rereview-x2b.md`. The working tree was clean before this pass.
This record corrects the earlier close record in `reviews/plan46-x2b-fixes.md` where noted below.

The fix brief, `/tmp/plan46/briefs/21-fix-build.md`, says: "A finding that asks to change a
Spec's promise is reported, not applied." Findings 4, 5 and 8 ask for such changes. Their drift
is confirmed and the proposed text is recorded below; their carriers, oracles and bindings are
unchanged. The other six findings are fixed in the commit containing this record.

## Findings and evidence

| Finding | Disposition | Evidence |
| --- | --- | --- |
| 1. Finder file plus family case rename | Fixed. Pruning removes a directory holding only regular `.DS_Store` files, with those files, before writing the renamed family. Finder files in directories that still hold notes survive. | `test/x2b-cli.test.ts`, `keeps a note after a case-only rename of spec:Probe.member, Finder file: true`, first failed on the following vault run, exit 1 instead of 0. Both note-case and family-case tests now run with and without Finder files. They ran on this case-insensitive temporary volume; they skip on a case-sensitive volume. |
| 2. Planned use reaches only one design and names a Spec as its component | Fixed. Every planned box for the target component receives a dashed edge. Planned boxes carry an edge label naming the component and its design; the text equivalent uses it, including when a detailed drawing retains a planned box after folding. A realized target still uses its realized box. | `test/x2b-studio.test.ts`, `draws planned uses to every design of the named component and names the component in text`, first failed on the text equivalent. It checks both targets, both dashed edges and both component labels. Restricting the fixed lookup to its first result fails this test too. |
| 3. The `both-given` world compares fresh extractions rather than publication | Fixed the evidence. The world saves the exact graph bytes from a plain build, derives its expected Spec page paths from that graph, and compares both Studio runs' page paths and emitted graph bytes with those baselines. Existing input-byte, naming and full-publication comparisons remain. | `test/studio-s4.test.ts`, bound example `spec:consumers.spec-studio.data.inputs.both-given`. Appending renamed base Spec nodes to the publication's reader graph fails the page-set assertion. Appending them only to `generated/graph.json` fails the graph-byte assertion. Restoring the production implementation passes both checks. |
| 4. Staging promise includes unchanged registrars | Declined applying a promise change, as the fix brief requires. The earlier ruling and code skip unchanged siblings, while the carrier still promises to stage every sibling. | Confirmed against `spec:extraction.build-pipeline#rule.stagedPublication` and `src/cli/build-command.ts`. Proposed text is below. Existing unchanged-registrar inode, mtime and temporary-write regression remains green. |
| 5. Vault entries still promise regeneration of changed Bases | Declined applying promise changes, as the fix brief requires. The index banner, link rule and Base rules retain the universal wording. | Confirmed against `spec:consumers.obsidian-vault#design.indexNote`, `#rule.linksResolve`, and the Bases rules below. The existing changed-Base regression passes and demonstrates why those promises need qualification. The banner still uses its pinned text. |
| 6. Invalid `--runs` leaves a Studio watcher alive | Fixed. Argument parsing uses the shared placement and JSON reader before starting the watcher. Publication uses the same reader on each later cycle so inputs are reread. | `test/x2b-cli.test.ts`, `refuses a %s --runs input before starting the Studio watcher`, first failed for build-owned, missing and invalid-JSON inputs, returning 0 after stopping the watcher. Each case supplies a valid first report and invalid second report, checks exit 1, no watcher creation, the flag and path, and unchanged file bytes. |
| 7. Root alias plus outward input link lacks a regression | Fixed the evidence. Both input flags now exercise a root alias leading to a link physically inside the Studio output but targeting an external report. | `test/x2b-cli.test.ts`, `refuses direct and symbolic build-owned %s inputs without changing a file`. Removing the physical-parent candidate from `checkStudioInputPlacement` makes both flag cases fail. Restoring it passes; extraction never starts. |
| 8. Sharing still promises stakeholder and agent conduct | Declined changing the promise, as the fix brief requires. Confirmed an unrealized conduct promise; the earlier sharing promise-pass row was incomplete. | `spec:consumers.spec-studio.sharing`, Behavior rule 2. The satisfying set implements publishing, stamping and source-link mechanisms, but no unit realizes what a stakeholder, author and agent do. Proposed placement is below. |
| 9. Generate help says `cwd` | Fixed. The generate help now says `resolved against the working directory`. | `test/x2b-cli.test.ts`, `states the working-directory resolution of generate --vault in help`, failed before the wording change. The existing help-width tests pass. |

The first behavior run failed six tests: the Finder-family case, planned-use rendering, the three
watch-input cases and the help text. After the fixes, the five targeted suites passed all 167 tests.
The four mutation probes above were run separately and restored before validation. Their failures
were assertions about page paths, graph bytes, missing planned edges and incorrect input acceptance.
No mutation was left in the tree.

Re-run the targeted evidence with:

```sh
npm test -- test/x2b-cli.test.ts test/x2b-studio.test.ts test/studio-s4.test.ts test/vault.test.ts test/generate-cli.test.ts
```

For the input-page mutation, append base Spec nodes with an id suffix of `-from-base` to
`validated.graph.nodes` in the Studio publish step before `createStudioData`. For the emitted-graph
mutation, append those nodes only to the saved `generated/graph.json`. Run the `both-given` example
after each mutation. For the alias mutation, remove
`join(physicalPath(dirname(path)), basename(path))` from the placement candidates. For the edge
mutation, take only the first matching planned target. Run the named tests above and restore each
mutation before continuing.

## Spec amendments reported, not applied

These are proposed changes to intended truth for the coordinating thread to rule on. If accepted,
each carrier and its oracle entry must move together.

- `spec:extraction.build-pipeline#rule.stagedPublication`, replace with:
  "Before replacing current outputs, `sdp build` stages the graph, the owed contracts, the registrar
  manifest, each registrar sibling whose bytes differ from the file on disk, and the imports when
  `--imports` is supplied, in temporary locations; a sibling whose bytes are unchanged is left
  untouched, with no temporary write and no rename. It then publishes the staged set and removes
  registrar siblings no longer owed."
- `spec:consumers.obsidian-vault#design.indexNote`, replace the banner sentence with:
  "Every file under `sdp/` is regenerated, except a `.base` file you changed: write your own notes
  outside it, and intent notes in `intent/`." Keep the remainder of the entry.
- `spec:consumers.obsidian-vault#rule.linksResolve`, replace "a file the run wrote" with
  "a file the run wrote or kept". Keep the remainder of the rule.
- `spec:consumers.obsidian-vault.bases#rule.corpusBase`, replace with:
  "A corpus Base the command writes, `sdp/specs.base`, is over every Spec note, with the standing
  views `spec:consumers.obsidian-vault.bases#design.standingViews` lists; the index embeds it."
- `spec:consumers.obsidian-vault.bases#rule.packBase`, replace with:
  "A Pack Base the command writes beside its note selects the Spec notes whose `packs` property
  links the Pack, with the views `spec:consumers.obsidian-vault.bases#design.packViews` lists; the
  Pack's note embeds it."
- `spec:consumers.obsidian-vault.bases#rule.viewsMirrorSources`, replace with:
  "Each standing view of a Base the command writes selects, over one graph, exactly the Specs its
  source selects, as `spec:consumers.obsidian-vault.bases#design.viewSources` pairs them."
- `spec:consumers.spec-studio.sharing`, move Behavior rule 2 unchanged to the end of the narrative:
  "A stakeholder opens the link, navigates the Studio and composes intent, and the pull request's
  author hands that intent to an agent that edits the source." This follows the treatment of
  conduct already ruled for the vault iteration Spec. Until ruled, this is an unrealized promise,
  not an engine mechanism missing from phase 1.

## Binding recheck and remaining drift

No anchor, readiness statement or oracle changed in this pass. The changed satisfying units still
realize their existing mechanisms: `vault-sync` removes obsolete files and directories;
`studio-architecture-lens` draws planned boxes and their uses; `studio-diagrams` supplies the text
equivalent; `studio-base-input` and `studio-command` refuse unsafe or unreadable inputs before
extraction; `adopter-help` states the directory resolution. `studio-inputs-both-given` now checks the
reader's published page set and the saved graph, rather than two independent carrier extractions.

The sharing satisfying set, `stamp-command`, `studio-stamp` and `studio-preview-workflow`, does not
realize Behavior rule 2's conduct. This corrects the earlier report's "No missing mechanism" row.
Findings 4 and 5 are also confirmed intended-truth drift awaiting a ruling, even though conformance
and honesty checks do not flag them. A green gate does not resolve those promises.

## Gate and graph measurements

Re-derived at close. Re-run these at a later head rather than inheriting this record.

- `npm run check` passed, exit 0, with 2,766 tests in 117 main-suite files, 100 separate CLI tests,
  projection byte checks and clean-regeneration preflight. The new report was staged before the
  successful run because preflight refuses untracked files.
- `npm run typecheck` also passed in a separate invocation.
- Recipe 1 lists only `spec:consumers.edit-model` and `spec:consumers.intent-composition`.
  Recipe 2 reports no drift alarms. The validation report has no error and only the existing
  `honesty/gaps` warning on `spec:model.spec-sections`. The worked example has no finding.
- The final query's nine targets all state `ready` and have derived readiness `ready`:
  `spec:extraction.build-pipeline`, `spec:consumers.obsidian-vault`,
  `spec:consumers.obsidian-vault.bases`, `spec:consumers.spec-studio.lenses.architecture`,
  `spec:consumers.spec-studio.diagrams`, `spec:consumers.spec-studio.data.inputs`,
  `spec:consumers.spec-studio.data.inputs.both-given`, `spec:consumers.spec-studio.sharing` and
  `spec:consumers.command-line`. Each has a verifier binding; the example has no implementation
  binding, as expected for example evidence. These graph facts do not judge the promise
  completeness discussed above.

```sh
npm run check
npm run typecheck
pnpm --silent sdp:q 'return { backlog: await recipes(1), drift: await recipes(2), findings: report.findings }' --json
```
