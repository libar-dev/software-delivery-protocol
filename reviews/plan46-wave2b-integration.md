# Plan 46 wave 2b integration

Integrated on `lane/46-integrate-2b` from `8f45f877a6d3f912f2ed1180d5605e79a4369071`.
This closes integration of S2, S3, S4, V and U only. Plan 46 remains executing.
Each lane was reviewed by Opus 5.5 and fixed before integration. Nothing was pushed.

| Order | Lane | Reviewed and fixed lane head | Merge commit |
| --- | --- | --- | --- |
| 1 | S2 | `b87420cde534c0b449ad458187d12378629afb3a` | `803f3f8` |
| 2 | S3 | `3c9218ac901f2aeee1dd4e4376e6e45835d0911b` | `7fb44c6` |
| 3 | S4 | `c6b5e3f739e9bd069a111f76f527761c82f7d5f5` | `25d9837` |
| 4 | V | `86b1211daab78b78144f0ed09413db44adaeb500` | `6a7a359` |
| 5 | U | `db83ded24fe73bb8f424b7020d73875f67247dce` | `f4c2cf5` |

Every merge used `--no-ff`, the requested message and co-author trailer. Each merge result was
built and generated, then passed `npm run typecheck` and the self-hosting suites before its
commit was recorded. All five merge commits therefore typecheck. The additional selected suites
and the self-hosting suites together passed as follows:

| Merge | Suites | Tests |
| --- | --- | --- |
| S2 | 28 | 238 |
| S3 | 33 | 339 |
| S4 | 36 | 821 |
| V | 32 | 346 |
| U | 31 | 726 |

These are checkpoints, not inherited close measurements. Re-run the commands below at the
commit being reviewed. The first all-up gate caught two worked-example CLI assertions that the
integration count-update script had incorrectly changed with the self-hosting warning count.
Close restores their original zero-warning expectations. The self-hosting assertion remains 11.
S3 through U were typecheck and self-hosting checkpoints, not full-gate checkpoints.

## Conflict resolutions

There were 37 file-level conflicts across 19 paths: 11 in S3, 16 in S4, 5 in V and 5 in U.
S2 merged without conflicts. This table accounts for every conflicted path and merge. No test
was dropped. Where an assertion needed the combined behavior, it still checks the original
promise and the incoming lane's addition.

| File | Conflicting merges | Resolution |
| --- | --- | --- |
| `contract-dependent-suites.mjs` | S4 | Kept S2's suites and registrars beside S4's run, input and sharing examples. S3, V and U additions merged automatically and remain. |
| `src/cli/build-args.ts` | S4 | Kept S3's base parsing and refusals, added repeatable runs, and returned both the loaded base and run paths. |
| `src/cli/help.ts` | S4, V | Combined Studio base and runs usage and paragraphs, retained the base-output restriction, kept both stamp and vault help, and replaced the pending generate seam with guarded vault synchronization. Generate still explains that Studio has no optional inputs in that command. |
| `src/cli/studio-command.ts` | S4 | Reads runs before extraction and passes `{ ...parsed.studioInputs, runs }` to both independent renders. The base is retained. |
| `src/projections/studio/pages/frame.ts` | S4 | Kept all S3 entries and conditional Diff, then placed conditional Runs after Diff. |
| `src/projections/studio/pages/html.ts` | S4 | Kept S2's component-link resolution check and S4's source marks together. Missing components stay text. |
| `src/projections/studio/pages/index.ts` | S4 | Publishes all S3 registers, queue, glossary and conditional diff beside S4's conditional runs page. |
| `src/projections/studio/pages/pack-page.ts` | S3, S4 | Keeps S2's maturity map after the summary, S3's change section after it, the findings element, and S4's conditional run-evidence sentence. Every build retains the graph's binding limit and `never runs`; the no-run clause appears only without runs. |
| `src/projections/studio/pages/spec-page.ts` | S3, S4 | Keeps one keyed Model renderer with term locations, all S2 panels, composing slots and citations, S3's change note, and S4's source marks. |
| `src/projections/studio/pages/tests-page.ts` | S4 | Keeps S4's per-Spec result counts and input-naming sentences with S2's settled `data-filter` spelling. |
| `src/projections/studio/recipes.ts` | S3, S4 | Keeps S2's recipe 51, S3's recipe 46 and whole-corpus/per-Pack recipe 35 calls, and S4's conditional recipe 45. The shared input type stays in S3's `inputs.ts`; S4's duplicate declaration is removed. |
| `src/projections/studio/studio.css` | S3 | Keeps S2's custom-element, citation and maturity-map rules and S3's current-navigation and statement-list rules. |
| `test/cli.test.ts` | S3, S4, V, U | Adds each lane's self-hosting warning reduction against the common base. Close restores the two unrelated worked-example assertions to zero. |
| `test/integration-review.test.ts` | S3 | Retains the handoff test as an assertion that recipes 46 and 51 are now evaluated, replacing the obsolete future-lane comment check. |
| `test/self-hosting-graph.test.ts` | S3, S4, V, U | Adds the lanes' independent anchor, binding, structural, readiness and graph deltas against `8f45f87`. Corrects S3's explanatory edge-count comment to the actual authored delta. |
| `test/self-hosting-oracle/anchors.ts` | S3, S4, V, U | Keeps the union of anchors, binding edges and comment-anchor ids, including V's corrected CLI help and vault bindings. The queue's reference changes to satisfies only after its ruling and promise pass. |
| `test/self-hosting-oracle/index.ts` | S3, S4, U | Removes the union of gaps whose Specs gained resolving verifiers. V's gap removals merged automatically. All other warnings remain. |
| `test/self-hosting-oracle/structural-edges.ts` | S3, S4, V, U | Keeps every accepted unit, membership, exception and use. S3's removed false intra-component uses stay removed; recipe 13's original oracle remains intact. |
| `test/studio-s1.test.ts` | S3 | Keeps reader/report identity, one evaluator and no evaluation while rendering, and expands the expected calls to include recipes 46 and 51 and conditional base comparisons. |

S3's new filters also use `data-filter`, retaining S2's carrier and element contract. Their tests
still assert both Pack filters, the ordered floor filter and populated row attributes. S2's
citation observer now requires S4's source attributes while still comparing the exact cited file
and line through the generated example comparator. Its Pack-sentence test retains the binding
limit and now checks S4's required no-run clause too.

## Rulings applied

These are the executing thread's rulings on the owner's delegation and await the owner's review.
They are also recorded in plan 46. Carrier text and the independent consumer oracle moved together.
No readiness statement changed during integration beyond those already authored by the lanes.

| Ruling | Carrying entry | Regression evidence |
| --- | --- | --- |
| A second view of one subject inserts its view name into the diagram ids. The realization view uses `diagram.<subject>.realization.text` and `.realization.arrow`; the trace graph keeps unqualified ids. | `spec:consumers.spec-studio.diagrams#design.elementIds` | `test/self-hosting-graph.test.ts`, `permits a named second diagram view in the authored element-id contract`, failed on the old one-view wording. `test/studio-s2.test.ts`, `keeps trace and realization description and arrow ids distinct for one Spec subject`, checks all four ids and both descriptions. S2's renderer is unchanged. |
| The owner queue reads provisional readings from reader questions by Spec and key, with authored position for an unkeyed question. Recipe 46 keeps its shape. | `spec:consumers.spec-studio.owner-queue#rule.ownerQuestions` | The carrier regression failed on the absent lookup wording. `test/studio-s3.test.ts`, `reads each owner question's provisional reading from its reader Spec and key`, failed on the missing labelled line. It checks repeated keys across Specs, reversed reader order, keyed identity independent of index, an unkeyed question, absent readings, escaped code and unchanged recipe answers. |
| The help contract names `vault` and `stamp` beside the other verbs. | `spec:consumers.command-line#design.helpVerbs` | The authored-contract regression failed on both absent names. `test/generate-cli.test.ts` now includes both in its per-verb matrix, checking exact top-level/per-verb agreement, early help before argument parsing, no extraction or reads, and no files written. |

The owner-queue promise pass covers all six rules and both UI entries: recipe 46 supplies the
page and order; statement rows carry the pinned fields and dependency links; reader questions
supply provisional readings; summaries read the recipe's totals; both lists keep Pack filters
and statements keep floor filters; and the page only orders and links. Both row shapes are built.
`impl:protocol.studio-owner-queue` therefore changes from `references` to `satisfies`. Its Spec now
derives `implemented` and `has-verifier`, states `ready` and reaches `ready`. This swaps one
binding edge's type and adds no node or edge.

## Shared integration work

- Wired S2's verification panel to S4's `runRows(ctx, spec.id)`. The new
  `places the shared external file rows inside the Spec verification panel` test first failed
  because the panel omitted the shared section. It now checks the exact shared output, all
  result rows and absence on an unrelated Spec.
- Added `accepts the preview workflow's base and run flags together` in `test/studio-s4.test.ts`.
  It invokes the real CLI with the preview's flags, checks both pages, their base/run content,
  navigation order and unchanged run input. S4's workflow tests retain the caller's `diff: true`,
  run artifact, permissions, optional evidence, failed-validation publication and host guard.
- Kept S4's source marks in shared renderers and added them to S2's source/citation rows and
  S3's declaration citations.
- Kept recipe 45's pointers in both skills. Taught recipes 47 and 48 in the reading skill's task
  table and the sessions skill, with the upgrade-guide pointer. Restored the whole-catalog task
  table and sessions checks. Both restored checks failed before the missing teaching was added.
  Neither exempts a recipe or substitutes the guide for skill coverage.
- Replaced pending-vault wording in README, AGENTS and the skills with the built synchronization
  behavior. README and AGENTS name vault and stamp. CONTEXT no longer describes the vault as an
  unbuilt idea or term addresses as an unbuilt candidate; ratifying vault as Protocol vocabulary
  remains the owner's question.
- Kept V's generate seam and validation-report reuse. The existing generate test checks one
  extraction, one validation and vault synchronization before publishing.

## Oracle and close measurements

The oracle is a transcription of authored lane changes, not copied extraction output. The
following deltas come from each lane's source oracle against `8f45f87`:

| Lane | Anchors | Binding edges | Membership edges | Uses edges | Comment anchors | Ready statements | Graph edges |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S2 | +9 | +15 | +4 | 0 | +4 | +2 | +19 |
| S3 | +13 | +15 | +5 | 0 | +5 | +4 | +20 |
| S4 | +14 | +18 | +3 | +1 | +3 | +5 | +22 |
| V | +27 | +34 | +7 | +2 | +7 | +16 | +43 |
| U | +9 | +9 | 0 | 0 | 0 | +3 | +9 |

Re-derived at close, not numbers to inherit: 403 Specs, 7 Packs, 520 anchors, 635 binding edges,
160 membership edges, 48 uses edges and 86 comment anchors; 930 graph nodes and 2,488 graph edges.
Stated readiness is 389 ready, 8 defined, 5 idea and 1 scoped. The graph schema stays 0.11.0.
The queue binding swap leaves these totals unchanged.

The main test suite passes 2,687 tests across 114 files; the dedicated CLI suite passes all 100.
The close gate is `npm run check`, followed by standalone `npm run typecheck`, at the commit
carrying this record. Validation reports 0 errors and 11 expected warnings. The worked example
reports 0 errors and 0 warnings. Recipe 2 returns `{ total: 0, alarms: [] }`.

Every retained warning is `honesty/gaps`, informative and pinned by the self-hosting oracle:

| Subject |
| --- |
| `spec:consumers.edit-model` |
| `spec:consumers.intent-composition.proposal.memo` |
| `spec:consumers.intent-composition` |
| `spec:consumers.spec-studio.components` |
| `spec:consumers.spec-studio.export` |
| `spec:consumers.spec-studio.intent-panel` |
| `spec:consumers.spec-studio.navigation` |
| `spec:consumers.spec-studio.publisher.watch` |
| `spec:consumers.spec-studio.responsive` |
| `spec:consumers.spec-studio` |
| `spec:model.spec-sections` |

Re-measure from a built checkout with:

```sh
npm run check
npm run typecheck
pnpm --silent sdp:q 'return recipes(2)' --json
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
pnpm --silent sdp:q 'return report.findings.map(({validatorId, subjectId, severity}) => ({validatorId, subjectId, severity}))' --json
```

The self-hosting checkpoints are reproducible with `npm test -- test/self-hosting`, after build
and both generation scripts. The focused integration evidence lives in `test/studio-s1.test.ts`,
`test/studio-s2.test.ts`, `test/studio-s3.test.ts`, `test/studio-s4.test.ts`,
`test/generate-cli.test.ts`, `test/skills.test.ts`, `test/recipes.test.ts` and the self-hosting oracle.

## Left for S5, close or the owner

| Item | Why it remains |
| --- | --- |
| S5's composing controls and panel, proposal memo recipe 49, Pack export, print and Studio watch | This wave integrates five supplied lanes. Empty composing slots remain for S5; it does not build that lane. |
| Broader whole-Spec binding reviews | The required mechanical connections for run evidence, runs pages, inputs and navigation are built and tested. Their broader reference bindings remain as supplied; only the requested owner-queue promise pass promotes a binding here. Sharing and recipe-answer completion also depend on S5's composing/export promises. Close must review each whole Spec before changing those bindings. |
| S3's defensive parser readings | Repeated or blank base labels and option-looking values remain refused as its fix report records. No additional carrier ruling was requested for them. |
| Other lane readings | S2's single-Then comparator pattern and the inherited trace-relation priority reading remain as reported. Integration does not claim to have changed them. |
| Platform acceptance, new captures and hosted preview evidence | Lane measurements retain their original source commits. This pass tests the combined CLI and workflow locally; it neither re-measures the platform nor presents old captures as head evidence. It performs no hosted workflow run. |
| Owner decisions | Public hosting, the platform's statements and Pack-page policy, decision ratification, merging and any release remain the owner's. No host was enabled and no PR or package was published. Vault vocabulary adoption still awaits owner review. |
| Earlier history | Wave 2a's non-typechecking K-through-BQ merge commits remain documented in its integration record. This wave rewrites no history and does not repair those ancestors. |

The work stays in this worktree. No `git stash`, push, platform write, other-worktree write or
`.omo/` access was performed. The closing commit leaves the tracked tree clean.
