# F4 Plan 37 scope-fidelity audit

## Current final verdict at `28ec9d1`

`REJECT`

The owner disposition closes the two surfaced findings, F4-B1 and F4-B2, exactly as historical deviations. Re-audit found a third, unaccepted commit-strategy deviation: Todo 4 says its measurement tooling is `Commit: N` and will be committed at close with the K record, but dedicated commit `c265f2d` lands those files during Wave 0. The disposition says "These two, and no others" and does not authorize `c265f2d`.

Open findings: **1** (`F4-B3`). Closed by owner disposition: **2** (`F4-B1`, `F4-B2`).

## Re-audit at `28ec9d133999faf6c0aa52679c8aedff0a10c409`

### Owner closure of the original findings

Raw owner statement: `pprove historical boundary deviations`.

Normalized accepted choice: `Approve historical boundary deviations`.

The operational plan, primary Plan 37 record, and `.omo/evidence/plan-37-historical-boundary-disposition.md` all preserve the original rules and state that history was not rewritten. All five historical commits remain ancestors of HEAD with their original hashes.

| Finding | Exact accepted scope | Re-audit disposition |
| --- | --- | --- |
| F4-B1 | The bounded-parity sibling in `1dae853` and authored activation/evidence in `e081071` | **CLOSED** by owner acceptance as a real historical deviation, not declared compliant |
| F4-B2 | Standalone anchor-pin commits `4a451e2`, `0b098a3`, and `07098f3` | **CLOSED** by owner acceptance as real historical deviations, not declared compliant |

The original commit strategy remains visible at `.omo/plans/plan-37-settling-arc.md:265`. Todo 2's `Commit: Y` remains visible. W1-B and W2-B still say `Commit: N`. The new disposition authorizes no other commit-strategy or product-scope exception.

### Open finding F4-B3

| Commit and exact manifest | Violated clause | Owner coverage | Result |
| --- | --- | --- | --- |
| `c265f2d70c1a31ccd5976240e96ed8354a7bec13`, subject `chore(evidence): plan-37 wave-0 K measurement definition, census tooling, task-4 record`, introduces `census.mjs`, `definition.md`, the seven Todo-4 QA/validation captures, and `task-4-plan-37-settling-arc.md`, while modifying the operational plan. The close commit `8e6a86b` contains none of `census.mjs`, `definition.md`, or the Todo-4 record. | Todo 4 at `.omo/plans/plan-37-settling-arc.md:113`: `Commit: N (measurement tooling is .omo workspace state; committed at close with the K record)`. The dedicated Wave-0 evidence commit did not ride the close record. | The disposition names only F4-B1 and F4-B2 and says "These two, and no others". It contains no `c265f2d`, Todo 4, or measurement-tooling exception. | **OPEN - REJECT** |

This is another historical placement defect. The current K files remain within Brief K's authorized evidence paths, and no product bytes are implicated. Closing it requires an equally explicit owner disposition or a history correction; neither exists.

### Commit `28ec9d1`

Subject and footer are exact:

```text
docs(plans): record plan-37 historical boundary deviations

Plan: .omo/plans/plan-37-settling-arc.md
```

Its exact eight-path manifest is:

| Path | Change | Scope |
| --- | --- | --- |
| `.omo/evidence/f1-plan-37-settling-arc.md` | add | final-review evidence |
| `.omo/evidence/f2-plan-37-settling-arc.md` | add | final-review evidence |
| `.omo/evidence/f3-plan-37-settling-arc.md` | add | final-review evidence |
| `.omo/evidence/f4-plan-37-settling-arc.md` | add | original final-review evidence |
| `.omo/evidence/plan-37-historical-boundary-disposition.md` | add | exact owner disposition |
| `.omo/evidence/task-19-verification-plan-37-settling-arc.md` | add | review verification evidence |
| `.omo/plans/plan-37-settling-arc.md` | modify | orchestration checkboxes and bounded historical record |
| `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md` | modify | primary historical record |

There is no product, test, generated, package, AGENTS, or public-status edit. Parent is exactly `a4a1468f59d199a1d381b23837ebcda9488f8614`; no rewrite occurred.

### Current tree and prior path table

The prior 128-path table was rechecked. Product/config bytes at current HEAD are identical to `a4a1468`: zero delta under `src/`, `specs/`, `test/`, `generated/`, package files, `.agents/`, AGENTS, recipes, P37-R1 config, and all frozen surfaces. Its Must NOT closure therefore remains current. The six newly tracked evidence paths listed above are authorized review/disposition records; the two modified plan paths were already classified and remain within orchestration/primary-record ownership. No dirty product path exists.

At committed HEAD `28ec9d1`, F2 and F3 are checked and APPROVE while F1, F4, Todo 20, and F5 are unchecked. During this audit, the concurrent F1 reviewer revised F1 to APPROVE and checked F1 in the uncommitted operational plan. The current worktree therefore no longer satisfies the requested "F1 unchecked" snapshot; F4, Todo 20, and F5 remain unchecked. Plan 37 and AGENTS remain EXECUTING, and Plan 36 remains DRAFTED. No generation, test, build, validate, preflight, or full check was run in this re-audit.

## Original audit at `a4a1468` preserved below

### Original verdict

`REJECT`

The final tree stays inside Plan 37's product scope and every Must NOT surface remains closed. The rejection is for commit-boundary fidelity. Plan 37 requires each Brief I lane to commit its suite and force-added generated siblings together, and marks the shared anchor-pin batches `Commit: N` so they ride the adoption commits. The history does neither for the tracer or the anchor batches.

## Audit boundary and baseline reconstruction

- Exact baseline: `a8d5898f549778d5841653dc81730a0c5810e446`, the parent of Todo 1's commission commit.
- Todo 1 evidence at `.omo/evidence/task-1-plan-37-settling-arc.md` records the baseline as 156 Specs, 1 Pack, 157 anchors, 314 nodes, 660 edges, zero findings, eight drift alarms, and 58 `bindExample` sites across eight suites.
- Commission commit: `1dae853a6f51bdcb8c4bde16d84dafda611e0fca`.
- Audited committed head: `a4a1468f59d199a1d381b23837ebcda9488f8614`.
- The ancestry path contains 24 ordinary commits plus merge `7b99baa`. The merge is byte-empty against its second parent `dfb899b`; against first parent `a8d5898` it integrates the already-inspected Plan 37 branch. It introduces no third version of a hunk.
- Current attributable state adds only `.omo/evidence/task-19-verification-plan-37-settling-arc.md` and the Todo 19 checkbox in `.omo/plans/plan-37-settling-arc.md`. The public status remains EXECUTING.
- `.omo/boulder.json`, the parity-plan draft/plan/evidence, and the ultrawork note are unrelated orchestration state as directed by the audit brief. They are not charged to Plan 37.

## Reject findings

| ID | Commit and exact path/hunk | Violated clause | Result |
| --- | --- | --- | --- |
| F4-B1 | `1dae853`, `test/carrier.markdown-parser.bounded-parity.test.generated.ts`: the complete 71-line generated sibling is added by the commission commit. The authored activation does not land until `e081071`, whose manifest has only `.omo/evidence/task-2-plan-37-settling-arc.md` and `test/self-hosting-carrier.test.ts`. Thus the registrar sibling and its suite activation are split across two commits. | `.omo/plans/plan-37-settling-arc.md:265`: "One commit per I-lane todo (suite + force-added siblings land together)" and Todo 2's `Commit: Y` boundary. The same section forbids a dirty baseline that mixes lanes. | **REJECT** |
| F4-B2 | `4a451e2`, `test/self-hosting-oracle/anchors.ts`: one tracer site flip lands as its own commit. `0b098a3` lands 30 Wave 1 site flips as its own commit. `07098f3` lands 15 Wave 2 site flips as its own commit. | W1-B and W2-B each say `Commit: N (lands with Wave-1/Wave-2 adoption commits)`. The tracer pin is likewise a continuation of Todo 2, whose suite/sibling unit was already split by F4-B1. | **REJECT** |

These are history-boundary defects, not unauthorized final bytes. No destructive history operation was performed.

## Commit manifest and ownership audit

| Commit | Scope owner | Boundary result |
| --- | --- | --- |
| `1dae853` | commission plus riding Todo 3 evidence and one Brief I sibling | **FAIL**: Brief I sibling separated from suite |
| `e081071` | Brief I tracer suite | **FAIL**: atomic suite/sibling unit incomplete |
| `c265f2d` | Brief K definition/tooling | pass |
| `370e360` | commission AGENTS wording correction | pass |
| `4a451e2` | Brief I tracer anchor pin | **FAIL**: standalone `Commit: N` continuation |
| `cdc1431` | Brief I validators | pass |
| `157a9da` | Brief I Gherkin | pass |
| `e07f374` | Brief I pack Markdown | pass |
| `2e1b8a2` | Brief I SDP import | pass |
| `0b098a3` | Brief I Wave 1 anchor integration | **FAIL**: W1-B says ride adoption commits |
| `065a18f` | Brief J Wave 1 evidence/orchestration | pass |
| `dddcd2d` | Brief I projections | pass |
| `2788a2d` | Brief I extraction | pass |
| `07098f3` | Brief I Wave 2 anchor integration | **FAIL**: W2-B says ride adoption commits |
| `f78a74a` | Brief J Wave 2 evidence | pass |
| `b5bdc8c` | Brief I projections continuation | pass |
| `bdd9bfa` | Brief J owner packet | pass |
| `0f91ebf` | orchestration checkpoint sync | pass |
| `4851740` | Brief I P37-R1 plus refusal-comment correction | pass under owner amendment |
| `9218be9` | Brief K census bugfix A2 | pass |
| `dfb899b` | Brief K census bugfix A3 | pass |
| `7b99baa` | PR integration merge | pass; empty against second parent |
| `7f768d1` | Brief J promotions and Todo-16 amendment | pass |
| `8e6a86b` | close record | pass |
| `a4a1468` | review register and P37-R1 amendment | pass |

Suite-file ownership otherwise holds. Each authored suite belongs to its named Brief I lane. Later edits to `test/self-hosting-projections.test.ts` are continuations of that same lane. `test/self-hosting-oracle/anchors.ts` has one shared integration writer, but its commit placement violates the explicit `Commit: N` boundaries above. Brief J product edits are confined to Todo 16. Brief K writes only evidence files.

## Owner amendments

### Todo 16

- Five carrier diffs are each one line, `readiness: defined` to `readiness: ready`.
- Family oracle changes are the same five readiness values.
- `test/self-hosting-graph.test.ts` changes only `{ defined: 14, idea: 3, ready: 138, scoped: 1 }` to `{ defined: 9, idea: 3, ready: 143, scoped: 1 }`.
- `test/self-hosting-oracle/index.ts` replaces the empty warning list with five full, ordered `honesty/gaps` objects. The consumer remains exact `toEqual(expectedWarnings)`.
- Structural pins at `test/self-hosting-graph.test.ts:142-147` remain byte-identical: `156 / 1 / 157 -> 314 / 660`.
- The only changed Spec content is those five readiness lines. There is no demotion or invented body content.

### P37-R1

The current root inventory has 71 unique paths. Exactly 56 are tracked `test/*.test.generated.ts` siblings, with no duplicate, missing, or extra path compared with `git ls-files`. The baseline already had 10; `4851740` adds the other 46.

The effective configuration consequences are bounded but broader than one literal line:

1. `vitest-test.mjs` consumes the shared inventory, so selecting any newly listed registrar now requires the root generated-contract tree. This is the authorized check dependency-discovery effect.
2. The existing ESLint override consumes the same 71-path list. All six pre-existing missing-contract exemptions, plus the new `no-redundant-type-constituents` exemption, therefore apply to the 46 newly listed registrars. The effect is confined to the exact contract-dependent inventory.
3. No other config or check implementation changed. `package.json`, `tsconfig.json`, `vitest-test.mjs`, `check-self-hosting-gates.mjs`, `preflight.mjs`, `src/validate/`, and `specs/validation/` have zero arc diff. Todo 1's discovery-pin test is the separately authorized commission edit.

## Must NOT closure

| Forbidden area | Read-only proof | Result |
| --- | --- | --- |
| Default-carrier flip | No diff in carrier rulings, decisions, package/API, or carrier selection code; the one `.sdp.gherkin` tracked suffix count is unchanged. | closed |
| Gherkin expansion, Packs, DocStrings, DataTables | No diff in Gherkin carrier Spec, fixtures, parser/source, or decisions. Added registrars contain none of those constructs. | closed |
| `implements` slot | No source/schema/Spec diff introducing an `implements:` field. | closed |
| Registrar interface, five adapters, helper edits | `src/testing/`, `src/runner/`, runnable-modules Spec, and both shared helpers are byte-clean. | closed |
| O5 and Scenario Outline execution | No `src/` diff and no added Scenario Outline token in test/generated code. | closed |
| Projection re-specification | Projection product code and projections-model Spec are clean. Test edits only replace existing bindings with registrar activations. | closed |
| `bySymbol`, impact graph, suffix, query verb, reader accessor | No `src/`, export, reader, or CLI diff; no added forbidden API token. | closed |
| E2, E3, H reopening | Decision Specs and Plan 36 substantive content are clean; only its commissioned-plan line changed. | closed |
| Bundle implementation and product K code | K changes live only under `.omo/evidence/`; census writes stdout/stderr only. `src/` and `package.json` are clean. | closed |
| Validator/floor/check beyond P37-R1 | Validator/floor code and Specs are clean. Config delta is the exact inventory plus one ESLint rule line. | closed |
| Unratified readiness | Five READY ids match `Ratify proposed set`; the other three carriers remain `defined`. | closed |
| Spec demotion/content invention | Complete `specs/` diff is five one-line promotions. | closed |
| Old tranche-one registrar byte touches | All ten baseline/current blob IDs are identical. | closed |
| Recipe/helper/structural-pin changes | Recipes and helpers are clean; only owner-amended readiness histogram changed in graph suite. | closed |
| AGENTS drive-bys | Only commission status addition and immediate temporal wording correction. Plan 37 remains EXECUTING. | closed |

Read-only AST checks parsed all 60 changed TypeScript files without syntax diagnostics. Each of the 46 added registrars has one `register*` export, one generated-contract import, one authored-suite importer, and one activation. Across the eight suites, `specTest` counts and point-id sets are unchanged. No skip, only, or todo marker was added.

## Path-by-path scope table

| Path | Attribution | Result |
| --- | --- | --- |
| `.omo/boulder.json` | unrelated Boulder bookkeeping | not charged |
| `.omo/drafts/plan-37-settling-arc.md` | commission planning | authorized |
| `.omo/evidence/plan-37-j-packets/RATIFICATION-BUNDLE.md` | Brief J | authorized |
| `.omo/evidence/plan-37-j-packets/TEMPLATE.md` | Brief J | authorized |
| `.omo/evidence/plan-37-j-packets/carrier/markdown-authoring.md` | Brief J | authorized |
| `.omo/evidence/plan-37-j-packets/consumers/projections-model.md` | Brief J | authorized |
| `.omo/evidence/plan-37-j-packets/extraction/claim-taxonomy.md` | Brief J | authorized |
| `.omo/evidence/plan-37-j-packets/extraction/regenerability.md` | Brief J | authorized |
| `.omo/evidence/plan-37-j-packets/model/core-model.md` | Brief J | authorized |
| `.omo/evidence/plan-37-j-packets/model/pack-aggregate.md` | Brief J | authorized |
| `.omo/evidence/plan-37-j-packets/model/relations.md` | Brief J | authorized |
| `.omo/evidence/plan-37-j-packets/model/spec-sections.md` | Brief J | authorized |
| `.omo/evidence/plan-37-k-measurement/candidate-session-paths.txt` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/census-run-1.txt` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/census-run-2.txt` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/census.mjs` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/definition.md` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/excluded-session-paths.txt` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/inventory.md` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/manual-adjudication.md` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/qa-missing-record.txt` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/qa-nonexistent.stderr` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/qa-nonexistent.stdout` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/qa-truncated.jsonl` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/qa-truncated.stderr` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/qa-truncated.stdout` | Brief K | authorized |
| `.omo/evidence/plan-37-k-measurement/validation-plan35-session-01a0054c.txt` | Brief K validation | authorized |
| `.omo/evidence/plan-37-k-measurement/validation-plan35-session-01a005f2.txt` | Brief K validation | authorized |
| `.omo/evidence/plan-37-k-measurement/verdict.md` | Brief K | authorized |
| `.omo/evidence/task-1-fix-plan-37-settling-arc.md` | commission | authorized |
| `.omo/evidence/task-1-plan-37-settling-arc.md` | commission | authorized |
| `.omo/evidence/task-10-plan-37-settling-arc.md` | Brief J | authorized |
| `.omo/evidence/task-11-plan-37-settling-arc.md` | Brief J | authorized |
| `.omo/evidence/task-12-plan-37-settling-arc.md` | Brief I projections | authorized |
| `.omo/evidence/task-12-typecheck-fix-plan-37-settling-arc.md` | Brief I projections continuation | authorized |
| `.omo/evidence/task-13-plan-37-settling-arc.md` | Brief I extraction | authorized |
| `.omo/evidence/task-14-plan-37-settling-arc.md` | Brief J | authorized |
| `.omo/evidence/task-15-plan-37-settling-arc.md` | Brief J | authorized |
| `.omo/evidence/task-16-plan-37-settling-arc.md` | Brief J | authorized |
| `.omo/evidence/task-16-scope-adjudication-plan-37-settling-arc.md` | Todo-16 amendment | authorized |
| `.omo/evidence/task-16-verification-plan-37-settling-arc.md` | Brief J verification | authorized |
| `.omo/evidence/task-17-plan-37-settling-arc.md` | Brief K | authorized |
| `.omo/evidence/task-17-verification-plan-37-settling-arc.md` | Brief K verification | authorized |
| `.omo/evidence/task-18-plan-37-settling-arc.md` | close | authorized |
| `.omo/evidence/task-18-verification-plan-37-settling-arc.md` | close verification | authorized |
| `.omo/evidence/task-19-plan-37-settling-arc.md` | review | authorized |
| `.omo/evidence/task-2-fix-plan-37-settling-arc.md` | Brief I tracer | boundary fail F4-B2 |
| `.omo/evidence/task-2-plan-37-settling-arc.md` | Brief I tracer | boundary fail F4-B1 |
| `.omo/evidence/task-3-plan-37-settling-arc.md` | Brief J evidence riding checkpoint | authorized |
| `.omo/evidence/task-4-plan-37-settling-arc.md` | Brief K | authorized |
| `.omo/evidence/task-5-plan-37-settling-arc.md` | Brief I validators | authorized |
| `.omo/evidence/task-6-plan-37-settling-arc.md` | Brief I Gherkin | authorized |
| `.omo/evidence/task-7-plan-37-settling-arc.md` | Brief I pack Markdown | authorized |
| `.omo/evidence/task-8-plan-37-settling-arc.md` | Brief I consumers refusal | authorized |
| `.omo/evidence/task-9-plan-37-settling-arc.md` | Brief I SDP import | authorized |
| `.omo/evidence/wave-1-anchor-pins-plan-37-settling-arc.md` | Brief I shared writer | boundary fail F4-B2 |
| `.omo/evidence/wave-2-anchor-pins-plan-37-settling-arc.md` | Brief I shared writer | boundary fail F4-B2 |
| `.omo/plans/plan-37-settling-arc.md` | orchestration/amendments/close/review | authorized |
| `AGENTS.md` | commission | authorized |
| `contract-dependent-suites.mjs` | P37-R1 | authorized |
| `eslint.config.js` | P37-R1 | authorized |
| `plans/36-adoption-tranches-maturation-and-bundle-evidence-briefs.md` | commission | authorized |
| `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md` | commission/close/review | authorized |
| `specs/carrier/markdown-authoring.sdp.md` | Brief J promotion | authorized |
| `specs/extraction/claim-taxonomy.sdp.md` | Brief J promotion | authorized |
| `specs/model/pack-aggregate.sdp.md` | Brief J promotion | authorized |
| `specs/model/relations.sdp.md` | Brief J promotion | authorized |
| `specs/model/spec-sections.sdp.md` | Brief J promotion | authorized |
| `test/carrier.gherkin-authoring.authored-fact-refused.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.gherkin-authoring.description-location-refused.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.gherkin-authoring.duplicate-surface-refused.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.gherkin-authoring.example-space-extraction.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.gherkin-authoring.malformed-relation-refused.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.gherkin-authoring.missing-id-refused.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.gherkin-authoring.multi-finding-bounded.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.gherkin-authoring.parent-child-extraction.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.gherkin-authoring.step-less-scenario-refused.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.gherkin-authoring.unknown-tag-refused.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.gherkin-authoring.unsupported-construct-refused.test.generated.ts` | Brief I Gherkin | authorized |
| `test/carrier.markdown-pack-authoring.markdown-ts-parity.test.generated.ts` | Brief I pack Markdown | authorized |
| `test/carrier.markdown-pack-authoring.spec-envelope-refused.test.generated.ts` | Brief I pack Markdown | authorized |
| `test/carrier.markdown-parser.bounded-parity.test.generated.ts` | Brief I tracer | boundary fail F4-B1 |
| `test/carrier.sdp-import.round-trip.test.generated.ts` | Brief I SDP import | authorized |
| `test/check-self-hosting-gates.test.ts` | commission pin | authorized |
| `test/consumers.binding-language-views.pack-member-table.test.generated.ts` | Brief I projections | authorized |
| `test/consumers.derived-readiness-banner.dishonest-divergence.test.generated.ts` | Brief I projections | authorized |
| `test/consumers.derived-readiness-banner.honest-headroom.test.generated.ts` | Brief I projections | authorized |
| `test/consumers.design-review.pure-projection.test.generated.ts` | Brief I projections | authorized |
| `test/consumers.wholesale-view-rewrite.build-invalidates-view.test.generated.ts` | Brief I projections | authorized |
| `test/consumers.wholesale-view-rewrite.failed-run-view-removed.test.generated.ts` | Brief I projections | authorized |
| `test/consumers.wholesale-view-rewrite.late-stale-page.test.generated.ts` | Brief I projections | authorized |
| `test/consumers.wholesale-view-rewrite.stale-page-removed.test.generated.ts` | Brief I projections | authorized |
| `test/extraction.build-pipeline.same-invocation.test.generated.ts` | Brief I extraction | authorized |
| `test/extraction.example-runner.red-step-naming.test.generated.ts` | Brief I extraction | authorized |
| `test/extraction.excludes.refused-path.test.generated.ts` | Brief I extraction | authorized |
| `test/extraction.excludes.segment-boundary.test.generated.ts` | Brief I extraction | authorized |
| `test/extraction.schema-versioning.declared-version.test.generated.ts` | Brief I extraction | authorized |
| `test/self-hosting-carrier-gherkin.test.ts` | Brief I Gherkin | authorized |
| `test/self-hosting-carrier.test.ts` | Brief I tracer | boundary fail F4-B1 |
| `test/self-hosting-extraction.test.ts` | Brief I extraction | authorized |
| `test/self-hosting-graph.test.ts` | Todo-16 histogram amendment | authorized |
| `test/self-hosting-oracle/anchors.ts` | Brief I shared writer | boundary fail F4-B2 |
| `test/self-hosting-oracle/carrier.ts` | Brief J descriptor | authorized |
| `test/self-hosting-oracle/extraction.ts` | Brief J descriptor | authorized |
| `test/self-hosting-oracle/index.ts` | Todo-16 warnings | authorized |
| `test/self-hosting-oracle/model.ts` | Brief J descriptors | authorized |
| `test/self-hosting-pack-markdown.test.ts` | Brief I pack Markdown | authorized |
| `test/self-hosting-projections.test.ts` | Brief I projections | authorized |
| `test/self-hosting-sdp-import.test.ts` | Brief I SDP import | authorized |
| `test/self-hosting-validators.test.ts` | Brief I validators | authorized |
| `test/validation.authored-honesty.section-authored-fact.test.generated.ts` | Brief I validators | authorized |
| `test/validation.authored-honesty.unearned-stated-fact.test.generated.ts` | Brief I validators | authorized |
| `test/validation.claim-separation.collapsed-edge-claim.test.generated.ts` | Brief I validators | authorized |
| `test/validation.claim-separation.unratified-descriptor.test.generated.ts` | Brief I validators | authorized |
| `test/validation.diagnostic-rendering.composed-location.test.generated.ts` | Brief I projections | authorized |
| `test/validation.diagnostic-rendering.table-cell-location.test.generated.ts` | Brief I projections | authorized |
| `test/validation.oracle-target-eligibility.missing-space-refused.test.generated.ts` | Brief I validators | authorized |
| `test/validation.oracle-target-eligibility.rule-space-accepted.test.generated.ts` | Brief I validators | authorized |
| `test/validation.pack-coherence.incoherent-aggregate.test.generated.ts` | Brief I validators | authorized |
| `test/validation.readiness-floor.blocking-open-question.test.generated.ts` | Brief I validators | authorized |
| `test/validation.readiness-floor.unrelated-scoped-spec.test.generated.ts` | Brief I validators | authorized |
| `test/validation.referential-integrity.dangling-target.test.generated.ts` | Brief I validators | authorized |
| `test/validation.referential-integrity.did-you-mean.test.generated.ts` | Brief I validators | authorized |
| `test/validation.two-check-families.split-report.test.generated.ts` | Brief I validators | authorized |
| `test/validation.verification-linkage.unbound-example.test.generated.ts` | Brief I validators | authorized |
| `test/validation.verification-linkage.unresolved-oracle.test.generated.ts` | Brief I validators | authorized |
| `test/validation.warn-level-signals.orphan-signal.test.generated.ts` | Brief I validators | authorized |
| `test/validation.warn-level-signals.ready-gap-signal.test.generated.ts` | Brief I validators | authorized |

## Current worktree reconciliation

| Current path | Attribution |
| --- | --- |
| `.omo/plans/plan-37-settling-arc.md` | attributable Todo 19 checkbox; public status remains EXECUTING |
| `.omo/evidence/task-19-verification-plan-37-settling-arc.md` | attributable Todo 19 verification |
| `.omo/boulder.json` | unrelated Boulder/parity orchestration |
| `.omo/drafts/sdp-skills-gen1-parity.md` | unrelated parity plan |
| `.omo/evidence/task-1-sdp-skills-gen1-parity-verification.md` | unrelated parity plan |
| `.omo/evidence/task-1-sdp-skills-gen1-parity.md` | unrelated parity plan |
| `.omo/evidence/ulw-20260820-081346.05dmOx.md` | unrelated ultrawork note |
| `.omo/plans/sdp-skills-gen1-parity.md` | unrelated parity plan |

Plan 37's stamp and AGENTS entry both remain EXECUTING. Plan 36 remains DRAFTED lineage. Todo 20 and F1-F5 remain unchecked. This audit did not run generation, tests, builds, validate, preflight, or a full check.
