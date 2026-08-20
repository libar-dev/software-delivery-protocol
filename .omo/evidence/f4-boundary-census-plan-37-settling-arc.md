# Plan 37 historical commit-boundary census

Date: 2026-08-20

Verdict: `REJECT`

Audited range: commission parent `a8d5898f549778d5841653dc81730a0c5810e446` through committed HEAD `28ec9d133999faf6c0aa52679c8aedff0a10c409`, including every ancestry-path commit and both sides of merge `7b99baa`.

This is a fresh census. I did not inherit either prior F4 classification. The owner record closes exact B1 and B2. Two unaccepted boundary defects remain:

1. Todo 4's definition, tooling, QA captures, and task evidence landed in dedicated Wave 0 commit `c265f2d`, and its two core files changed again in dedicated commits `9218be9` and `dfb899b`. Todo 4 says all of that `Commit: N` state is "committed at close with the K record". Close `8e6a86b` contains none of those ten paths.
2. Todo 8 is `Commit: Y`, and the strategy requires one commit per Brief I lane. Its complete REFUSE deliverable exists only as `.omo/evidence/task-8-plan-37-settling-arc.md` inside consolidated Wave 1 evidence commit `065a18f`; no Todo 8 lane commit exists. Refusal is a complete outcome, but it does not convert Todo 8 into one of the listed evidence-only `Commit: N` lanes.

Both are historical placement defects, not current-byte or product-scope defects.

## Parsed boundary inventory

The plan has 13 Todo-level `Commit: Y` instructions, seven Todo-level `Commit: N` instructions, and two shared-writer `Commit: N` instructions. The extra `Commit: N` string in accepted-deviation prose is not an instruction.

| Owner | Required unit or ride target | Result |
| --- | --- | --- |
| Todo 1 | `Y`; own commission commit with Plan 37 stamp, Plan 36 line, `AGENTS.md`, discovery pin, and evidence; must not touch a suite/Spec/oracle/recipes | **ACCEPTED B1** only for Todo 2's sibling mixed into `1dae853`; named commission surfaces otherwise coherent. `370e360` is an exact Todo 1 temporal-wording correction with `task-1-fix` evidence. |
| Todo 2 | `Y`; suite + generated sibling + evidence | **ACCEPTED B1**: sibling in `1dae853`, suite/evidence in `e081071`; tracer pin continuation in `4a451e2` is B2. |
| Todo 3 | `N`; evidence rides next coherent commit | **COMPLIANT** in Wave 0 commission/checkpoint `1dae853`. |
| Todo 4 | `N`; exact target is close with K record | **UNACCEPTED**: ten paths in `c265f2d`, two changed in `9218be9`/`dfb899b`, none in close `8e6a86b`. |
| Todo 5 | `Y`; validator suite + 16 siblings + evidence | **COMPLIANT** in `cdc1431`. |
| Todo 6 | `Y`; Gherkin suite + 11 siblings + two refusals + evidence | **COMPLIANT** in `157a9da`. |
| Todo 7 | `Y`; pack suite + two siblings + evidence | **COMPLIANT** in `e07f374`. |
| Todo 8 | `Y`; one consumers lane commit, ADOPT or REFUSE complete | **UNACCEPTED**: all five lawfully refused, but evidence is mixed into `065a18f`; no Todo 8 lane commit/disposition. |
| Todo 9 | `Y`; import suite + sibling + evidence | **COMPLIANT** in `2e1b8a2`. |
| Todo 10 | `N`; packets ride checkpoint, applied diffs belong to 16 | **COMPLIANT** in Wave 1 checkpoint `065a18f`, updated in `7f768d1`. |
| Todo 11 | `N`; same as Todo 10 | **COMPLIANT** in `065a18f`, updated in `7f768d1`. |
| W1-B | `N`; lands with Wave 1 adoption commits | **ACCEPTED B2**: standalone `0b098a3`. |
| Todo 12 | `Y`; projections suite + ten siblings + refusal + evidence | **COMPLIANT** in `dddcd2d`; `b5bdc8c` is an evidenced typecheck correction, and `4851740` has the recorded refusal-comment correction plus exact P37-R1 fix. |
| Todo 13 | `Y`; extraction suite + five siblings + four refusals + evidence | **COMPLIANT** in `2788a2d`. |
| Todo 14 | `N`; packet rides checkpoint, application belongs to 16 | **COMPLIANT** in Wave 2 checkpoint `f78a74a`, updated in `7f768d1`. |
| Todo 15 | `N`; same as Todo 14 | **COMPLIANT** in `f78a74a`, updated in `7f768d1`. |
| W2-B | `N`; lands with Wave 2 adoption commits | **ACCEPTED B2**: standalone `07098f3`. |
| Todo 16 | `Y`; one ratified J application commit, exact amendment effects and evidence | **COMPLIANT** in `7f768d1`. |
| Todo 17 | `N`; K result committed with close at 18/20 | **COMPLIANT** in `8e6a86b`. |
| Todo 18 | `Y`; own close commit with I/J/K record, measurements, Todo 17 state | **COMPLIANT** in `8e6a86b`; it does not cure Todo 4. |
| Todo 19 | `Y`; own review-register commit and closure evidence | **COMPLIANT** in `a4a1468`; later verifier rides owner checkpoint `28ec9d1`. |
| Todo 20 | `Y`; after approvals/owner okay, check twice and synchronize statuses | **NOT YET APPLICABLE** at HEAD. It is unchecked and status remains EXECUTING. |

The wave-gate rule makes merged waves natural evidence checkpoints, but does not override exact ride targets such as Todo 4 or W1-B/W2-B. The queued service governs generation order, not permission for standalone commits. The evidence-only ride list is exact: 3, 4, 10, 11, 14, 15, 17. It excludes Todo 8. Todo 16 and P37-R1 amend product scope only; neither amends history boundaries.

## Complete ancestry commit table

All 26 commits are classified below. Counts are first-parent manifest paths. `Plan:` means the exact `.omo/plans/plan-37-settling-arc.md` footer; "none" means no body/footer.

| # | Commit | Subject; body/footer | Manifest/owner | Classification |
| ---: | --- | --- | --- | --- |
| 1 | `1dae853` | commission Plan 37; none | 11: commission, Todo 3 state, Boulder/draft/plan, Todo 2 sibling | **ACCEPTED B1** for sibling; rest compliant |
| 2 | `e081071` | adopt markdown-parser tracer; none | 2: Todo 2 evidence + suite | **ACCEPTED B1** |
| 3 | `c265f2d` | Wave 0 K definition/tooling/task record; none | 11: ten Todo 4 artifacts + plan checkbox | **UNACCEPTED** |
| 4 | `370e360` | correct AGENTS temporal wording; none | 2: `AGENTS.md` + task-1-fix evidence | **COMPLIANT correction** |
| 5 | `4a451e2` | flip tracer anchor pin; none | 2: anchor + evidence | **ACCEPTED B2** |
| 6 | `cdc1431` | adopt validators; none | 18: Todo 5 evidence/suite/16 siblings | **COMPLIANT** |
| 7 | `157a9da` | adopt/refuse Gherkin; none | 13: Todo 6 evidence/suite/11 siblings | **COMPLIANT** |
| 8 | `e07f374` | adopt pack Markdown; none | 4: Todo 7 evidence/suite/two siblings | **COMPLIANT** |
| 9 | `2e1b8a2` | adopt SDP import; none | 3: Todo 9 evidence/suite/sibling | **COMPLIANT** |
| 10 | `0b098a3` | Wave 1 anchor pins; none | 2: anchor + wave evidence | **ACCEPTED B2** |
| 11 | `065a18f` | Wave 1 dispositions/packets; none | 11: Todos 10/11, Todo 8 evidence, Boulder/plan | **UNACCEPTED** for Todo 8; rest compliant |
| 12 | `dddcd2d` | adopt/refuse projections; none | 12: Todo 12 evidence/suite/ten siblings | **COMPLIANT** |
| 13 | `2788a2d` | adopt/refuse extraction; none | 7: Todo 13 evidence/suite/five siblings | **COMPLIANT** |
| 14 | `07098f3` | Wave 2 anchor pins; none | 2: anchor + wave evidence | **ACCEPTED B2** |
| 15 | `f78a74a` | Wave 2 dispositions/packets; none | 5: Todos 14/15 + plan checkpoint | **COMPLIANT** |
| 16 | `b5bdc8c` | projections typing fix; none | 2: Todo 12 suite + exact fix evidence | **COMPLIANT correction** |
| 17 | `bdd9bfa` | owner ratification bundle; none | 1: ratification bundle | **COMPLIANT checkpoint** |
| 18 | `0f91ebf` | sync confirmed checkpoints; `Plan:` | 1: operational plan | **COMPLIANT checkpoint** |
| 19 | `4851740` | cover registrars in clean clones; `Plan:` | 3: P37-R1 config pair + Todo 12 comment correction | **COMPLIANT amendment/correction** |
| 20 | `9218be9` | K census closer fix; A2 body + Cursor co-author | 2: `census.mjs`, `definition.md` | **UNACCEPTED** placement |
| 21 | `dfb899b` | K scratch/prettier fix; A3 body | 2: `census.mjs`, `definition.md` | **UNACCEPTED** placement |
| 22 | `7b99baa` | merge PR #21; one-line Plan 37 body | 102 vs first parent; zero vs second; tree equals `dfb899b` | **MERGE MECHANICS** |
| 23 | `7f768d1` | apply owner-ratified J rungs; `Plan:` | 22: Todo 16 product/evidence/amendment/packets | **COMPLIANT** |
| 24 | `8e6a86b` | Plan 37 close record; `Plan:` | 14: Todo 17 K results, Todo 18 evidence/records | **COMPLIANT 17/18**, no Todo 4 cure |
| 25 | `a4a1468` | independent review register; `Plan:` | 4: Todo 18 verifier, Todo 19 register, plans | **COMPLIANT** |
| 26 | `28ec9d1` | historical boundary disposition; `Plan:` | 8: F1-F4, owner record, Todo 19 verifier, plans | **COMPLIANT checkpoint** |

Footer count: 17 no-body commits + six `Plan:` footer commits + `9218be9` A2/co-author + `dfb899b` A3 + merge body = 26. Classification count: 16 compliant ordinary + 5 accepted + 4 unaccepted + 1 merge = 26.

## Path-centric creation/change walk

The first-parent arc touches 134 unique paths. Independent `git log --follow --reverse` walks produce 39 exact history keys. The table has 40 rows because the mixed `add 1dae853` key is partitioned into compliant and B1 paths. `pre` existed at the commission parent; `add` was introduced by the first hash. Later hashes changed it again. The merge is omitted because it equals its second parent. `C` is compliant, `A` accepted, `U` unaccepted, `O` unrelated/mixed bookkeeping.

### Wave 0/shared

| History | Outcome | Paths |
| --- | --- | --- |
| add `1dae853` | C | `.omo/drafts/plan-37-settling-arc.md`; `.omo/evidence/plan-37-j-packets/TEMPLATE.md`; `.omo/evidence/task-1-plan-37-settling-arc.md`; `.omo/evidence/task-3-plan-37-settling-arc.md` |
| add `1dae853` | A/B1 | `test/carrier.markdown-parser.bounded-parity.test.generated.ts` |
| pre `1dae853` | C | `plans/36-adoption-tranches-maturation-and-bundle-evidence-briefs.md`; `test/check-self-hosting-gates.test.ts` |
| pre `1dae853>370e360` | C | `AGENTS.md` |
| pre `1dae853>065a18f` | O | `.omo/boulder.json` |
| add `1dae853>8e6a86b>a4a1468>28ec9d1` | C | `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md` |
| add `1dae853>c265f2d>065a18f>f78a74a>0f91ebf>7f768d1>8e6a86b>a4a1468>28ec9d1` | C administrative path | `.omo/plans/plan-37-settling-arc.md` |
| add `e081071` | A/B1 | `.omo/evidence/task-2-plan-37-settling-arc.md` |
| pre `e081071` | A/B1 | `test/self-hosting-carrier.test.ts` |
| add `370e360` | C | `.omo/evidence/task-1-fix-plan-37-settling-arc.md` |
| add `4a451e2` | A/B2 | `.omo/evidence/task-2-fix-plan-37-settling-arc.md` |
| pre `4a451e2>0b098a3>07098f3` | A/B2 | `test/self-hosting-oracle/anchors.ts` |

### Todo 4 K tooling

| History | Outcome | Paths |
| --- | --- | --- |
| add `c265f2d` | U | `.omo/evidence/plan-37-k-measurement/qa-nonexistent.stderr`; `.omo/evidence/plan-37-k-measurement/qa-nonexistent.stdout`; `.omo/evidence/plan-37-k-measurement/qa-truncated.jsonl`; `.omo/evidence/plan-37-k-measurement/qa-truncated.stderr`; `.omo/evidence/plan-37-k-measurement/qa-truncated.stdout`; `.omo/evidence/plan-37-k-measurement/validation-plan35-session-01a0054c.txt`; `.omo/evidence/plan-37-k-measurement/validation-plan35-session-01a005f2.txt`; `.omo/evidence/task-4-plan-37-settling-arc.md` |
| add `c265f2d>9218be9>dfb899b` | U | `.omo/evidence/plan-37-k-measurement/census.mjs`; `.omo/evidence/plan-37-k-measurement/definition.md` |

### Wave 1

| History | Outcome | Paths |
| --- | --- | --- |
| add `cdc1431` | C | `.omo/evidence/task-5-plan-37-settling-arc.md`; `test/validation.authored-honesty.section-authored-fact.test.generated.ts`; `test/validation.authored-honesty.unearned-stated-fact.test.generated.ts`; `test/validation.claim-separation.collapsed-edge-claim.test.generated.ts`; `test/validation.claim-separation.unratified-descriptor.test.generated.ts`; `test/validation.oracle-target-eligibility.missing-space-refused.test.generated.ts`; `test/validation.oracle-target-eligibility.rule-space-accepted.test.generated.ts`; `test/validation.pack-coherence.incoherent-aggregate.test.generated.ts`; `test/validation.readiness-floor.blocking-open-question.test.generated.ts`; `test/validation.readiness-floor.unrelated-scoped-spec.test.generated.ts`; `test/validation.referential-integrity.dangling-target.test.generated.ts`; `test/validation.referential-integrity.did-you-mean.test.generated.ts`; `test/validation.two-check-families.split-report.test.generated.ts`; `test/validation.verification-linkage.unbound-example.test.generated.ts`; `test/validation.verification-linkage.unresolved-oracle.test.generated.ts`; `test/validation.warn-level-signals.orphan-signal.test.generated.ts`; `test/validation.warn-level-signals.ready-gap-signal.test.generated.ts` |
| pre `cdc1431` | C | `test/self-hosting-validators.test.ts` |
| add `157a9da` | C | `.omo/evidence/task-6-plan-37-settling-arc.md`; `test/carrier.gherkin-authoring.authored-fact-refused.test.generated.ts`; `test/carrier.gherkin-authoring.description-location-refused.test.generated.ts`; `test/carrier.gherkin-authoring.duplicate-surface-refused.test.generated.ts`; `test/carrier.gherkin-authoring.example-space-extraction.test.generated.ts`; `test/carrier.gherkin-authoring.malformed-relation-refused.test.generated.ts`; `test/carrier.gherkin-authoring.missing-id-refused.test.generated.ts`; `test/carrier.gherkin-authoring.multi-finding-bounded.test.generated.ts`; `test/carrier.gherkin-authoring.parent-child-extraction.test.generated.ts`; `test/carrier.gherkin-authoring.step-less-scenario-refused.test.generated.ts`; `test/carrier.gherkin-authoring.unknown-tag-refused.test.generated.ts`; `test/carrier.gherkin-authoring.unsupported-construct-refused.test.generated.ts` |
| pre `157a9da` | C | `test/self-hosting-carrier-gherkin.test.ts` |
| add `e07f374` | C | `.omo/evidence/task-7-plan-37-settling-arc.md`; `test/carrier.markdown-pack-authoring.markdown-ts-parity.test.generated.ts`; `test/carrier.markdown-pack-authoring.spec-envelope-refused.test.generated.ts` |
| pre `e07f374` | C | `test/self-hosting-pack-markdown.test.ts` |
| add `2e1b8a2` | C | `.omo/evidence/task-9-plan-37-settling-arc.md`; `test/carrier.sdp-import.round-trip.test.generated.ts` |
| pre `2e1b8a2` | C | `test/self-hosting-sdp-import.test.ts` |
| add `0b098a3` | A/B2 | `.omo/evidence/wave-1-anchor-pins-plan-37-settling-arc.md` |
| add `065a18f` | C/U | `.omo/evidence/task-10-plan-37-settling-arc.md` C; `.omo/evidence/task-11-plan-37-settling-arc.md` C; `.omo/evidence/task-8-plan-37-settling-arc.md` U |
| add `065a18f>7f768d1` | C | `.omo/evidence/plan-37-j-packets/extraction/claim-taxonomy.md`; `.omo/evidence/plan-37-j-packets/extraction/regenerability.md`; `.omo/evidence/plan-37-j-packets/model/core-model.md`; `.omo/evidence/plan-37-j-packets/model/pack-aggregate.md`; `.omo/evidence/plan-37-j-packets/model/relations.md`; `.omo/evidence/plan-37-j-packets/model/spec-sections.md` |

### Wave 2

| History | Outcome | Paths |
| --- | --- | --- |
| add `dddcd2d` | C | `.omo/evidence/task-12-plan-37-settling-arc.md`; `test/consumers.binding-language-views.pack-member-table.test.generated.ts`; `test/consumers.derived-readiness-banner.dishonest-divergence.test.generated.ts`; `test/consumers.derived-readiness-banner.honest-headroom.test.generated.ts`; `test/consumers.design-review.pure-projection.test.generated.ts`; `test/consumers.wholesale-view-rewrite.build-invalidates-view.test.generated.ts`; `test/consumers.wholesale-view-rewrite.failed-run-view-removed.test.generated.ts`; `test/consumers.wholesale-view-rewrite.late-stale-page.test.generated.ts`; `test/consumers.wholesale-view-rewrite.stale-page-removed.test.generated.ts`; `test/validation.diagnostic-rendering.composed-location.test.generated.ts`; `test/validation.diagnostic-rendering.table-cell-location.test.generated.ts` |
| pre `dddcd2d>b5bdc8c>4851740` | C | `test/self-hosting-projections.test.ts` |
| add `b5bdc8c` | C | `.omo/evidence/task-12-typecheck-fix-plan-37-settling-arc.md` |
| add `2788a2d` | C | `.omo/evidence/task-13-plan-37-settling-arc.md`; `test/extraction.build-pipeline.same-invocation.test.generated.ts`; `test/extraction.example-runner.red-step-naming.test.generated.ts`; `test/extraction.excludes.refused-path.test.generated.ts`; `test/extraction.excludes.segment-boundary.test.generated.ts`; `test/extraction.schema-versioning.declared-version.test.generated.ts` |
| pre `2788a2d` | C | `test/self-hosting-extraction.test.ts` |
| add `07098f3` | A/B2 | `.omo/evidence/wave-2-anchor-pins-plan-37-settling-arc.md` |
| add `f78a74a` | C | `.omo/evidence/task-14-plan-37-settling-arc.md`; `.omo/evidence/task-15-plan-37-settling-arc.md` |
| add `f78a74a>7f768d1` | C | `.omo/evidence/plan-37-j-packets/carrier/markdown-authoring.md`; `.omo/evidence/plan-37-j-packets/consumers/projections-model.md` |
| add `bdd9bfa>7f768d1` | C | `.omo/evidence/plan-37-j-packets/RATIFICATION-BUNDLE.md` |
| pre `4851740` | C/P37-R1 | `contract-dependent-suites.mjs`; `eslint.config.js` |

### Todo 16 through disposition

| History | Outcome | Paths |
| --- | --- | --- |
| add `7f768d1` | C | `.omo/evidence/task-16-plan-37-settling-arc.md`; `.omo/evidence/task-16-scope-adjudication-plan-37-settling-arc.md` |
| pre `7f768d1` | C | `specs/carrier/markdown-authoring.sdp.md`; `specs/extraction/claim-taxonomy.sdp.md`; `specs/model/pack-aggregate.sdp.md`; `specs/model/relations.sdp.md`; `specs/model/spec-sections.sdp.md`; `test/self-hosting-graph.test.ts`; `test/self-hosting-oracle/carrier.ts`; `test/self-hosting-oracle/extraction.ts`; `test/self-hosting-oracle/index.ts`; `test/self-hosting-oracle/model.ts` |
| add `8e6a86b` | C | `.omo/evidence/plan-37-k-measurement/candidate-session-paths.txt`; `.omo/evidence/plan-37-k-measurement/census-run-1.txt`; `.omo/evidence/plan-37-k-measurement/census-run-2.txt`; `.omo/evidence/plan-37-k-measurement/excluded-session-paths.txt`; `.omo/evidence/plan-37-k-measurement/inventory.md`; `.omo/evidence/plan-37-k-measurement/manual-adjudication.md`; `.omo/evidence/plan-37-k-measurement/qa-missing-record.txt`; `.omo/evidence/plan-37-k-measurement/verdict.md`; `.omo/evidence/task-16-verification-plan-37-settling-arc.md`; `.omo/evidence/task-17-plan-37-settling-arc.md`; `.omo/evidence/task-17-verification-plan-37-settling-arc.md`; `.omo/evidence/task-18-plan-37-settling-arc.md` |
| add `a4a1468` | C | `.omo/evidence/task-18-verification-plan-37-settling-arc.md`; `.omo/evidence/task-19-plan-37-settling-arc.md` |
| add `28ec9d1` | C | `.omo/evidence/f1-plan-37-settling-arc.md`; `.omo/evidence/f2-plan-37-settling-arc.md`; `.omo/evidence/f3-plan-37-settling-arc.md`; `.omo/evidence/f4-plan-37-settling-arc.md`; `.omo/evidence/plan-37-historical-boundary-disposition.md`; `.omo/evidence/task-19-verification-plan-37-settling-arc.md` |

Count balance: 134 arc-touched paths = 133 Plan 37 paths + one Boulder path. The 133 classify as 115 compliant, seven implicated only in accepted B1/B2, and eleven implicated in unaccepted findings. `115 + 7 + 11 = 133`; adding Boulder gives 134. The seven accepted paths are Todo 2 sibling/suite/evidence plus anchor and three pin-evidence files. The eleven unaccepted paths are ten Todo 4 paths plus Todo 8 evidence. Every path appears once above.

## Complete unaccepted-deviation register

| ID | Exact commits/paths | Violated clause | Why uncovered | Lawful closure |
| --- | --- | --- | --- | --- |
| `F4-B3-K-CLOSE-RIDE` | `c265f2d70c1a31ccd5976240e96ed8354a7bec13` introduces `plan-37-k-measurement/{census.mjs,definition.md,qa-nonexistent.stderr,qa-nonexistent.stdout,qa-truncated.jsonl,qa-truncated.stderr,qa-truncated.stdout,validation-plan35-session-01a0054c.txt,validation-plan35-session-01a005f2.txt}` and `task-4-plan-37-settling-arc.md`; `9218be999f1a1fcaad5a92019fe2b3d0836e6b1a` and `dfb899be41687a7b2aa6ff15b181c6754320f793` change the first two. `8e6a86b` has none. All paths are under `.omo/evidence/`. | Todo 4 exact `Commit: N`: "committed at close with the K record". Generic checkpoints cannot weaken this exact target. | B1 is only Todo 2. B2 is only three pin commits. Owner says "These two, and no others." A2/A3 justify byte corrections, not their dedicated placement. | Exact owner disposition naming all three hashes, ten paths, and clause; or deliberate rewrite moving the complete Todo 4 history into close while preserving final bytes. A new additive commit cannot cure first placement. |
| `F4-B4-TODO8-Y` | `065a18f6120a266df0fab20927421d9967a2c7a6` introduces `.omo/evidence/task-8-plan-37-settling-arc.md` with Todo 10/11 state. `test/self-hosting-consumers.test.ts` has no arc commit because all sites were restored/refused. No Todo 8 commit exists. | Todo 8 `Commit: Y`; "One commit per I-lane todo"; exact evidence-only list excludes 8. | Neither B1 nor B2 names Todo 8, `065a18f`, or its all-REFUSE record. | Exact owner disposition naming Todo 8, `065a18f`, and the evidence-only REFUSE outcome; or rewrite splitting that evidence into its own lane commit. A later empty/duplicate commit cannot cure first placement. |

This is the complete unaccepted set. One bounded owner disposition can name both rows without broadening B1/B2 or claiming the original rules were met.

## Accepted deviations and exact limits

| Record | Accepted scope | No coverage for new rows |
| --- | --- | --- |
| F1-COMMIT-BOUNDARY / F4-B1 | Todo 2 sibling in `1dae853`, suite/evidence in `e081071` | Names no K file, Todo 4 clause, Todo 8, `065a18f`, `9218be9`, or `dfb899b`. |
| F4-B2 | Standalone pin batches `4a451e2`, `0b098a3`, `07098f3` | Limited to `anchors.ts`, three pin evidence files, and named commits. It does not authorize evidence/tooling commits or a missing Todo 8 lane. |

The controlling sentence is "These two, and no others." P37-R1 is a product-scope amendment for two config changes, not a historical boundary disposition.

## Completeness proof

- Ancestry command returns 26; table has 26; `16 + 5 + 4 + 1 = 26`.
- `7b99baa^{tree}` and `dfb899b^{tree}` both equal `46f4874a13e628240accce95e908ba9fea4162c4`; second-parent diff is empty; first-parent integration has 102 already-classified paths.
- Every subject, body/footer, manifest, and intended owner was inspected.
- First-parent manifest union is 134 paths. Independent follow walks yield 39 history keys and the same 134 paths; the outcome table has 40 rows because one mixed key is split. There are no renames.
- All 20 Todos, both shared writers, 13 Y instructions, seven Todo N instructions, and two writer N instructions are accounted for.
- Completed Y: nine compliant, Todos 1/2 accepted, Todo 8 unaccepted; Todo 20 pending. Exact Todo 1/Todo 12 corrections and owner amendments were checked.
- N: Todo 3 rides Wave 0; 10/11 Wave 1; 14/15 Wave 2; 17 close; Todo 4 fails close; W1-B/W2-B are accepted B2.
- Named recheck: `c265f2d`, `9218be9`, `dfb899b` fail; `065a18f` passes 10/11 but fails 8; `f78a74a` and `0f91ebf` are lawful checkpoints; `8e6a86b`, `a4a1468`, `28ec9d1` are coherent. No records-only commit passed merely for being records-only.
- No product gate was run. The census is read-only except for this artifact.

## Current status, attribution, and cleanup

Opening HEAD was `28ec9d133999faf6c0aa52679c8aedff0a10c409` on `feature/sdp-skills`. Pre-existing dirty state was:

- `.omo/boulder.json`: active Plan 37 session plus paused parity orchestration.
- `.omo/evidence/f1-plan-37-settling-arc.md`: concurrent F1 re-audit to APPROVE.
- `.omo/evidence/f4-plan-37-settling-arc.md`: prior B3-only F4 re-audit, not edited or trusted here.
- `.omo/plans/plan-37-settling-arc.md`: concurrent F1 checkbox update only.
- Untracked `.omo/drafts/sdp-skills-gen1-parity.md`, `.omo/plans/sdp-skills-gen1-parity.md`, `.omo/evidence/task-1-sdp-skills-gen1-parity.md`, `.omo/evidence/task-1-sdp-skills-gen1-parity-verification.md`, and `.omo/evidence/ulw-20260820-081346.05dmOx.md`: unrelated parity/orchestration state.

This census created only `.omo/evidence/f4-boundary-census-plan-37-settling-arc.md`. It did not edit, stage, commit, restore, reset, stash, clean, build, test, generate, or run a product gate. No temporary file, worktree, process, or scratch resource was created. All pre-existing dirty state remains preserved.
