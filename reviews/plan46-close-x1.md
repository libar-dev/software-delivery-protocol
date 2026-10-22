# Plan 46 close lane X1

Worked on `lane/46-close-x1` from `c5d552a45aab15a4e56c6954dfd63c5a0e6691ae`, after all build
lanes merged. Plan 46 remains executing; its status lines are unchanged. The common build brief,
both integration records, plan rulings and S5 fix record were read before the promise pass.

## Catalog, skills and command guidance

- Audited recipes 17, 25, 26, 36, 38 and 44 through 51 against their carrying Specs. Their numbered
  headings, accepted parameters and bodies already agreed. Added missing answer-shape guidance,
  put each rules-file recipe's severity and findings beside its own use, and replaced the old
  nested-body filtering example with a call through `recipes`. The preamble names all five
  bindings. Recipe tests execute every catalog body unchanged and compare shipped bodies with it.
- Updated all three skills in their existing task and work-shape guidance. They teach the new
  recipes, stable step and term keys, named Studio inputs, Studio watch, stamps, vaults and all-root
  generation by citing the carrying Specs. The session design loop covers parts, statements,
  proposals and memos; review covers citations, registers and external runs. The upgrade-guide
  pointer sits beside capability adoption and rule-key proposals.
- README now presents the Studio's phase 1, flags, publishing step, preview workflow, vault and
  upgrade guide. AGENTS names the verbs, five bindings, five rewritten roots and separate vault.
  The stale statement that watch is validate-only is gone. No plan-status line changed.
- Audited every verb's `--help` against dispatch and argument parsing. The existing shared text
  already names current verbs, flags and semantics. The per-verb matrix tests early help before
  reads or extraction and exact agreement with top-level help, including `new` and `new spec`.
  No help behavior needed changing in this lane.

## Vocabulary for the owner's review

The integrations had already added **step key**, **term key** and **entry citation**, with carrying
Specs and locked-list entries. X1 retains them. The following rows are new; each has aliases to
avoid and is added to the locked list. The vault ambiguity is explicitly resolved by adopting
Obsidian's established noun. The owned-folder decision still awaits ratification.

| Term | Definition | Carrying Spec |
| --- | --- | --- |
| contract key | the name a generated contract, test handler and Then outcome use for a step: its step key when present, otherwise its skeleton, the text with each slot reduced to its name | `spec:carrier.step-keys#rule.contractKey` |
| term address | the entry address `spec:<id>#term.<key>` naming a keyed Model term's definition; glossary rows have no address | `spec:model.term-addresses` |
| change proposal | the addressed JSON hand-off of scoped changes against a named base commit, checked before an agent applies ordinary source edits | `spec:consumers.intent-composition.proposal` |
| proposal memo | the Markdown rendering of a change proposal a person reviews, including its exact JSON document, shared by recipe 49 and the composing panel | `spec:consumers.intent-composition.proposal.memo` |
| statement queue | the ordered answer of waiting readiness statements and a selected decider's questions, with the Specs they rest on first; it states no rung | `spec:consumers.readiness-planner` |
| upgrade kit | the recipes and guide that measure capability adoption and propose rule keys for an agent's edit, without editing carriers or stating readiness | `spec:consumers.upgrade-kit` |
| capability adoption | the per-corpus, Pack and Spec counts of places a Protocol capability is used and could apply, with its carrying Spec; a report without a score or quota | `spec:consumers.upgrade-kit.capability-adoption` |
| stamp | the publishing metadata in `stamp.json` beside a Studio page set, written after the build with its engine, corpus commit, UTC publishing time and optional source template; never graph data | `spec:consumers.spec-studio.sharing` |
| run evidence | caller-supplied CTRF test results shown beside verifier bindings at test-file grain, labelled with their input and commit; never a verdict on one verifier or a delivery fact | `spec:observation.run-evidence` |
| Pack export | one self-contained HTML file holding a Pack page and its members in authored order, with inline style and diagrams, no script and no external loads | `spec:consumers.spec-studio.export` |
| text equivalent | the words beside a Studio diagram that state every box and edge, retained when the drawing exceeds its bound | `spec:consumers.spec-studio.diagrams` |
| vault | Obsidian's folder of linked notes; the Protocol synchronizes its generated notes and Bases in the owned `sdp/` folder, beside a person's notes | `spec:consumers.obsidian-vault` |

The existing evaluation-sink row now names `recipes`; the step-contract row uses contract keys,
and the graph-only qualification names Protocol validators and the four frozen projections.

## Decisions awaiting the owner

The registry explicitly defines `held` for a decision at `defined`; the annotations arc used it
at `ea9c550`. X1 follows that practice in a separate pending table, outside the ratified rows:
MD-43, the build renders Studio views; MD-44, the engine lays out Studio diagrams; and MD-45,
the vault owns one folder. All three carrying Specs remain `defined`. No decision was ratified.

## Mechanical S5 questions

| Entry or question | Resolution and evidence |
| --- | --- |
| `spec:consumers.spec-studio.components#design.composeAction` | Admits a Pack id, rendered `members` and the `Change applies to` choice, matching `intent-panel#rule.packScope`. The consumer oracle rejected the old carrier. S5's existing DOM test checks both member scope and excluded Pack framing. |
| `spec:consumers.spec-studio.components#design.scenarioEditor` | The build now writes escaped, labelled steps in a no-script fallback outside the inert template. The same editor markup supplies the dialog's enhancement. New edit/propose regressions each failed before the fix; S5's DOM tests still check exact gathered steps. |
| `spec:consumers.spec-studio.lenses.tests#rule.coverageRows` | Corrected the tests-lens link from the older verifier heading to `#panel.verification`. The bound coverage-row regression failed before the correction. |
| S5's applying-caller parents | Remain references, with their precise outstanding promises below. |
| S5's large one-file Pack export | Retains the explicit promise in `spec:consumers.spec-studio.export#rule.exportPerPack`. Partitioning or a new format needs a design pass; X1 introduces neither. |

## Whole-promise binding pass

Read every rule, Design entry and UI entry of each named backlog Spec against the merged code and
tests. The following twelve now have a complete realization set. Existing references became
`satisfies`; added bindings name the component's actual rendering, interaction and one-script
units, and the parent's data and publication units. Decision references stay references.
No readiness statement changed. The oracle first rejected the expected binding changes before
source anchors were edited.

| Spec | Promises assessed | Evidence suites |
| --- | --- | --- |
| `spec:consumers.spec-studio` | Package delivery, complete static page set, offline operation, reproducibility, reader-only values, scoped hand-off, named inputs and independent projections. | `studio-publisher`, `studio-pages`, `studio-s1` through `studio-s5` |
| `spec:consumers.spec-studio.components` | All ten element declarations, subject attributes, script-free content, classic bundle, bounded SVG and enhancing interactions. | `studio-elements`, `studio-s1`, `studio-s2`, `studio-s5` |
| `spec:consumers.spec-studio.data.inputs` | Both inputs and flags, pre-extraction refusals, pages and sections, naming without paths, unchanged graph/input bytes and repeat-render determinism. | `studio-s3`, `studio-s4`, `studio-publisher` |
| `spec:consumers.spec-studio.data.recipe-answers` | Every named evaluation and parameter set, shared reader/report, once per build and no recipe work during rendering. | `studio-s1`, `integration-review` |
| `spec:consumers.spec-studio.lenses` | Four ordered lens pages, reader and named recipe values, read-only pages with composing hand-off. | `studio-s1`, `studio-s3`, `studio-s5` |
| `spec:consumers.spec-studio.lenses.tests` | Coverage and binding rows, verification-panel links, file-grain run counts, filters and summaries. | `studio-s1`, `studio-s4`, `studio-elements` |
| `spec:consumers.spec-studio.navigation` | Ordered entries, conditional Diff/Runs, current-page attributes and underline, task routes from the index. | `studio-s3`, `studio-s4`; current-page CSS inspected |
| `spec:consumers.spec-studio.runs-page` | Conditional page and links, metadata and absences, results per file, unjoined rows, diagnostics and Pack-page sentence. | `studio-s4` |
| `spec:consumers.spec-studio.sharing` | Separate stamp and lifetime, reusable artifact workflow, guarded deployment, source marks and stamp-created links. | `studio-s4`, `studio-s2` |
| `spec:consumers.spec-studio.spec-page` | Five open panels, section actions, term ids, citations, realization/runtime/impact detail and base-change note. | `studio-s2`, `studio-s3`, `studio-s4`, `studio-s5` |
| `spec:consumers.spec-studio.verification-panels` | Binding-only example cards, coverage, constraint targets, intent actions, not-tracked evidence and file results under verifiers. | `studio-s2`, `studio-s4`, `studio-s5` |
| `spec:observation.run-evidence` | CTRF fields, normalized longest-suffix file join, direct/enabled-example scope, unjoined/invalid reports, commit labels and unchanged graph facts. | `recipes`, `studio-s4` |

The following are the satisfying sets after the pass. Each abbreviated Studio anchor below has
its full `impl:protocol.studio-` prefix unless a namespace is written explicitly.

| Spec | Satisfying anchors |
| --- | --- |
| `spec:consumers.spec-studio` | `command`, `data`, `frame` |
| `spec:consumers.spec-studio.components` | `component:protocol.studio-elements`, `compose`, `diagram-element`, `filter`, `intent-panel-element`, `maturity-map`, `pack-page`, `scenario-editor`, `search-results`, `spec-structure`, `verification-panels`, `view-elements` |
| `spec:consumers.spec-studio.data.inputs` | `base-input`, `command` |
| `spec:consumers.spec-studio.data.recipe-answers` | `recipes` |
| `spec:consumers.spec-studio.lenses` | `architecture-lens`, `evidence-lens`, `frame`, `tests-lens` |
| `spec:consumers.spec-studio.lenses.tests` | `tests-lens` |
| `spec:consumers.spec-studio.navigation` | `frame`, `index-page` |
| `spec:consumers.spec-studio.runs-page` | `run-rows`, `runs-page` |
| `spec:consumers.spec-studio.sharing` | `impl:protocol.stamp-command`, `preview-workflow`, `stamp` |
| `spec:consumers.spec-studio.spec-page` | `spec-page`, `spec-structure` |
| `spec:consumers.spec-studio.verification-panels` | `run-rows`, `verification-panels` |
| `spec:observation.run-evidence` | `impl:protocol.run-evidence-recipe`, `runs-page` |

Three genuine verifier bindings close the remaining Studio gaps: the existing publisher suite
now verifies the parent; the S5 composing suite verifies components; and a new navigation anchor
binds S3's existing page-order, current-page and task-route checks. Existing generated examples
and registrars are retained; X1 adds no example or registrar.

The Studio parent's four manual acceptance criteria remain work for the adopter acceptance pass.
Its implementation and verifier facts claim code realization and test existence only. X1 did not
perform the first-adopter reader tasks, enable a host or run a hosted preview.

### Precise backlog left for the next arc

| Entry address | Promise no unit realizes | Why the references remain |
| --- | --- | --- |
| `spec:consumers.edit-model#rule.agentEdits` | An agent edits source as a human would; git records the edit and the same conformance/honesty checks evaluate it. | The Studio gathers and hands off; no applying-agent unit performs the edit and git record. |
| `spec:consumers.edit-model#rule.lifecycleEdits` | Splitting, combining, refining and deleting are ordinary source/git edits. | The browser writes no canonical source. This belongs to the applying caller. |
| `spec:consumers.intent-composition#rule.changedScope` | After the proposal check, route each moved scope to a person, apply the other changes independently, and land only from an error-free validated worktree. | Recipe 38 reports movement. No applying-agent unit performs routing, edits and landing. |

The two edit-model keys were added solely to give these existing promises durable citations;
their text, readiness and oracle meaning are unchanged. Browser units retain references to both
parents by the delegated ruling. These are the only remaining entries from recipe 1.

### Verifier gap left

`spec:model.spec-sections` remains the owner's `honesty/gaps` warning, explicitly excluded from
this lane. No other ready Spec lacks a resolving verifier after this pass. A verifier binding says
one exists, not that every promise passed a test or that manual acceptance ran.

## Pruning and evidence

Removed the two replaced prototype folders. Only the three diagram measurement JSON files and
the vault README's measurement section survive in
[the measurement archive](assets/plan46-prototypes/README.md). It names the source commits, and
historical measurements are not presented as current engine evidence. The two citing Specs and
their oracles now point there. A tracked-text scan found no remaining link to either removed
folder. The earlier, separate vault exploration is outside this removal request.

`test/integration-review.test.ts` retains its actual Studio recipe-evaluation check and measurement
script execution. Its catalog-heading, glossary-prose and historical-command assertions were
removed. Behavioral tests, measurements and the self-hosting oracle remain.

## Re-measure

```sh
npm run check
npm run typecheck
pnpm --silent sdp:q 'return { backlog: await recipes(1), drift: await recipes(2), findings: report.findings }' --json
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Close measurements, re-derived rather than inherited:

- `npm run check` and standalone `npm run typecheck` pass. The main suite passes 2,719 tests in
  115 files; the separate CLI suite passes 100 tests. Projection checks and preflight pass.
- `sdp validate` reports 0 errors and the one retained `honesty/gaps` warning on
  `spec:model.spec-sections`; the worked example reports 0 errors and 0 warnings.
- Recipe 1 lists two Specs, the applying-caller parents above. Recipe 2 returns
  `{ total: 0, alarms: [] }`.
- The self-hosting oracle checks 403 Specs, 7 Packs, 538 anchors, 676 binding edges, 948 nodes and
  2,536 edges. No stated readiness changed in this lane.

Re-run the commands at the head instead of inheriting these close measurements.
