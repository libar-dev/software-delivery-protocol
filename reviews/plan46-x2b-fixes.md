# Plan 46 close, part B

Worked from `eec3226` on `lane/46-fix-x2b`. The implementation and tests are in
`eb2cc28e52b1eedee6f20ef29faabf46416ad7aa`. The common build brief, both adversarial reports, the design-honesty report,
plan 46 and its rulings were read before the work. No other worktree, `.omo/`, workflow,
recipe or memo implementation was changed.

## Findings and failing-first evidence

The commit column names the implementation commit. Every behavior change has a regression that
failed against the previous behavior. A test added for already-correct behavior was run against
the review's surviving mutation instead. The mutations were restored before validation.

| Item | Change and first failing test | Commit |
| --- | --- | --- |
| 1. Vault watch | `x2b-cli`: `leaves unchanged registrar bytes, inode and temporary path untouched` failed on a temporary write and inode churn. `idles with a bound example and preserves a Studio written beside the watched vault` produced 22 vault summaries in its first idle window with the original build/watch code, against one expected. The final test also changes a registrar and checks that the source watcher ignores it and preserves the Studio bytes. Unchanged registrars now incur neither a temporary write nor a rename; the watcher retains the previous and next build-owned paths. A further failing-first test keeps watch alive after a malformed-manifest refusal. The iteration watch rule excludes build writes. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |
| 2. Case-only rename | `x2b-cli`: `keeps a note after a case-only rename` failed because the new note was absent. The family-case variant also failed on the following regeneration. Stale listed files and empty directories now leave before the new set is written. Both variants pass on this case-insensitive temporary volume and skip on case-sensitive volumes. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |
| 3. Physical path identity | `x2b-cli`: case-alias tests for duplicate `--rules`, Studio `--base` and `--runs` all failed against the previous behavior. CLI identity comparisons now use `realpathSync.native`, including the shared helper used by the vault. Case-alias tests skip on case-sensitive temporary volumes. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |
| 4. Build-owned inputs | `x2b-cli`: `refuses direct and symbolic build-owned --runs inputs without changing a file` failed against the previous behavior. Both flags now share a pre-extraction placement check. Tests cover direct paths, file aliases, every build-owned root and temporary, and a prospective registrar sibling. The direct/alias tests assert that extraction never starts and compare every file's bytes. Added `data.inputs#rule.inputPlacement` and its oracle entry together. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |
| 5. Bases and tool files | `x2b-cli`: changed-Base and `.DS_Store` tests initially returned 1. Changed listed Bases now survive with their original recorded hashes, a warning naming the path and `delete it to regenerate`; ordinary notes still regenerate. A second run still preserves the customization, and deletion permits regeneration. `.DS_Store` files are ignored. The guard, synchronization and interruption wording and owned-folder decision agree; the decision stays `defined`. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |
| 6. Iteration promises | `handOff` now promises only that the vault writes no carrier or proposal. Narrative describes per-change proposal findings, moved scopes going to a person and the remaining edits being applied. `carriersOnlyForValidate` includes named rules and parameter files and excludes ordinary source. This is a carrier/oracle correction, not a change to validation behavior. The vault iteration promise pass is recorded below. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |
| 7. Generate output and help | `generateOutput` names the vault line between summaries and publishers, with the check-mode exception. The Spec and help say that `--vault DIR` resolves against the working directory. Existing output behavior is retained; `x2b-cli` rejects the original help wording, pins the resolution text, and `vault.test` checks its line width. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |
| 8. Studio test gaps | All six mutations listed below now fail. `studio-s4` binds `data.inputs.both-given` through `registerBothGiven`: two members and a verifier, a saved build graph outside the root, a third Spec, one CTRF report and two Studio runs. It compares every published byte, input bytes and graph data, and checks named inputs without their paths. Changing the Spec's expected `byteIdentical` to false failed in `compareContractOutcome`; the original point was restored. Recipe 9 allowed `ready`, then the carrier and oracle moved together. The adopted registrar is committed and listed in `contract-dependent-suites.mjs`. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |
| 9. Pack members | `x2b-studio`: the page-level member test rejects an empty `members`; the unresolved-Pack test first failed on the unresolved id, then failed again when filtering alone still produced a proposal. The page now sends resolved members and whether all manifest members resolve. The DOM test submits that page's action and checks that the handoff retains the request as scoped-intent text. The component and intent-record declarations name the new completeness field. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |
| 10. Duplicate planned component | `x2b-studio`: `keys and names each design planning the same unanchored component` initially found two boxes with the component id. Each box now uses its design Spec id when the component has multiple designs, and names that design in its words. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |
| 11. Binding recheck | Every rule, Design entry and UI entry of the twelve named Specs was read against the current satisfying set. No in-scope page or panel promise remains unrealized. The sets below retain `satisfies`; manual acceptance and explicit deferrals are stated separately. | `eb2cc28e52b1eedee6f20ef29faabf46416ad7aa` |

The six reviewed mutations were tested separately with `npx vitest run test/x2b-studio.test.ts -t
'<test name>'`. The print mutation also rebuilt the browser bundle before the test and restored it
afterward.

| Mutation | Regression that failed |
| --- | --- |
| Replace the external SVG link's `<g>` preservation with code text | `retains the linked SVG box geometry and label when its target leaves the export` |
| Render export member pages with `data` instead of `graphOnly` | `renders export member pages from the graph alone with meaningful base and run inputs` |
| Return the undrawn planned target's id instead of `undefined` | `draws no edge to an undrawn planned-use target`, including its text equivalent |
| Point the folded context box at `#main` | `targets each folded context box at its detailed drawing` |
| Write `members=""` on the Pack action | `puts the resolved rendered members on the Pack page composing action` |
| Remove the diagram's print reset | `prints a diagram whole and restores its zoom after printing`, including repeated `beforeprint` and listener removal |

## Whole-Spec promise pass

Each row was re-read against this tree, rather than inherited from X1's close record. `studio-`
anchor names below abbreviate the `impl:protocol.studio-` prefix. Decision bindings remain
`references`. Each satisfying unit realizes a promise in its Spec; its set covers the remaining
promises. No binding was changed solely to move a graph count.

| Spec | Current realization and evidence | Unrealized promises |
| --- | --- | --- |
| `spec:consumers.spec-studio` | `studio-command`, `studio-data`, `studio-frame`: packaged static page set, offline assets, reproducibility, reader-derived values, intent handoff, named inputs and independent publishers. `studio-publisher`, `studio-pages`, S1 through S5 and the new export/input regressions exercise these. | No missing page or panel. The four manual adopter-reader acceptance criteria were not rerun in this lane. |
| `spec:consumers.spec-studio.components` | `component:protocol.studio-elements` and `studio-compose`, `studio-diagram-element`, `studio-filter`, `studio-intent-panel-element`, `studio-maturity-map`, `studio-pack-page`, `studio-scenario-editor`, `studio-search-results`, `studio-spec-structure`, `studio-verification-panels`, `studio-view-elements`: all ten elements, subject attributes, build-rendered fallback, one classic script and interactions. X1's scenario fallback remains outside the template. Element, S1, S2, S5 and new Pack/print tests pass. | None. |
| `spec:consumers.spec-studio.data.inputs` | `studio-base-input`, `studio-command`: flags, all pre-extraction refusals, input pages and naming, untouched inputs/graph and deterministic bytes. S3, S4, publisher and the new placement/case tests cover the revised contract. | None. `both-given` is bound and `ready`. |
| `spec:consumers.spec-studio.data.recipe-answers` | `studio-recipes`: every named evaluation, exact parameter set, one shared answer per build and no browser recipe computation. S1, S4 and integration-review cover the recipe/page seams. | None. |
| `spec:consumers.spec-studio.lenses` | `studio-architecture-lens`, `studio-evidence-lens`, `studio-frame`, `studio-tests-lens`: four ordered pages, reader/recipe values and read-only handoff. S1, S3, S5 and the architecture regressions cover them. | None. Evidence absences follow the explicit plan deferrals below. |
| `spec:consumers.spec-studio.lenses.tests` | `studio-tests-lens`: id-ordered non-example rows, enabled verifier and rule coverage, uncovered/unbound slot values, verification-panel links, file-grain external counts, summaries and filters. S1, S4 and element tests cover the set. | None. |
| `spec:consumers.spec-studio.navigation` | `studio-frame`, `studio-index-page`: lens/register/queue/glossary order, conditional Diff/Runs, current-page mark and underline, search and index task routes. S3 and S4 exercise the routes and conditions. | None. |
| `spec:consumers.spec-studio.runs-page` | `studio-run-rows`, `studio-runs-page`: conditional page, input metadata/absence labels, file results, unjoined records, diagnostics, commit display and the Pack sentence. S4 and the meaningful-input export test pass. | None. |
| `spec:consumers.spec-studio.sharing` | `impl:protocol.stamp-command`, `studio-preview-workflow`, `studio-stamp`: separate stamp/lifetime, reusable artifact workflow, caller-controlled deployment, source marks and stamp-created links. S2 and S4 exercise the mechanisms. | No missing mechanism. Enabling a public host remains the owner's decision at plan line 186. |
| `spec:consumers.spec-studio.spec-page` | `studio-spec-page`, `studio-spec-structure`: core additions, all five open panels, term ids, citations, source text, realization/runtime neighborhood, impact and base-change note. S2 through S5 cover the panels and interactions. | None beyond the plan's explicit absence labels. |
| `spec:consumers.spec-studio.verification-panels` | `studio-run-rows`, `studio-verification-panels`: example cards and unwritten steps, binding-only language, keyed/unkeyed coverage, slot grid, target/unset-target actions, external file rows and evidence labels. S2, S4 and S5 cover the set. | None beyond the plan's explicit absence labels. |
| `spec:observation.run-evidence` | `impl:protocol.run-evidence-recipe`, `studio-runs-page`: the pinned CTRF fields and answer shapes, normalized longest-suffix joins at file grain, enabled-example scopes, unjoined/invalid inputs, commit labels and unchanged graph facts. Recipes and S4 cover them; no recipe code was changed in this lane. | None. Bound-file freshness remains the stated non-blocking question, not a promised computation. |
| `spec:consumers.obsidian-vault.iteration` | `impl:protocol.vault-watch`, `impl:protocol.vault-sync`, `impl:protocol.vault-text`: source/carrier watch with build-output exclusions, live refusals and SIGINT cleanup, unchanged note times, banners/guard, no carrier/proposal writes and no writes outside the owned folder. Vault examples and the new idle/rename/Base/refusal tests pass. Named rules/parameter watching is realized by the existing validate watcher, not widened by vault watch. | None after the ruled text corrections. |

Plan 46 line 108 states the phase-1 boundary. Lines 224 and 225 defer runtime observation and the
`observed` fact until a deployed system is observed, and build attestations, deployments and
SBOMs until a Spec designs their source. Their pages and panel labels are built. No runtime source
was invented. The manual adopter-reader tasks and host enablement are not claimed as performed.

## Spec questions and scope

- `data.inputs#rule.inputPlacement` has to refuse before extraction knows the next registrar set.
  The guard therefore treats the registrar suffix under the extraction root as build-owned,
  including its temporary sibling, as well as the shared build's fixed paths. Aliases use native
  physical paths, while a link physically located beneath a removed root is refused even when
  its target lies outside it.
- A kept, changed Base keeps its original recorded hash. Adopting its customized bytes as fresh
  generated content would allow a following run to overwrite it; the tests check another run
  before deleting it to regenerate.
- CLI review item 4, the merge/head CI trade-off, and Studio review item 6, memo request grammar,
  are outside this part's executing list. No workflow or memo change was made. Part A owns the
  engine, recipes and memo; the coordinating close owns any remaining CI ruling.
- The owned-folder decision remains `defined`. No owner decision, plan status or handbook
  status was changed, no host enabled, and nothing pushed or merged.

## Measurements and gate

Re-derived at close, not inherited. Run the commands again at a later head.

- `npm run check`: `passes, including 2,760 main-suite tests in 117 files, all 100 separate CLI tests, projection byte checks and preflight`.
- `npm run typecheck`: `passes in a separate invocation after the full gate`.
- The self-hosting oracle checks 403 Specs, 7 Packs, 539 anchors, 677 binding edges, 949 nodes and
  2,537 edges. The stated distribution is 394 `ready`, 3 `defined`, 5 `idea` and 1 `scoped`.
- Recipe 1 lists only `spec:consumers.edit-model` and `spec:consumers.intent-composition`, the
  applying-caller work; all 209 excluded ready examples have verifier bindings. Recipe 2 returns
  no drift alarms. The validation report retains only the owner's `honesty/gaps` warning on
  `spec:model.spec-sections`. The worked example reports no errors or warnings.

```sh
npm run check
npm run typecheck
pnpm --silent sdp:q 'return { backlog: await recipes(1), drift: await recipes(2), findings: report.findings }' --json
npx vitest run test/x2b-cli.test.ts test/x2b-studio.test.ts test/studio-s4.test.ts
```
