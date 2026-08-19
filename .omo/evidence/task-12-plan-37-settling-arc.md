# Task 12 — I-3 projections: adopt-or-refuse 11 sites / 5 families

Status: complete for the lane-safe path after one AdversarialVerify NEEDS-FIX (composed-location newline + bindExample census). Serialized byte-gates (`npm run check:self-hosting`, `npm run preflight`, `generate:*`, `sdp build`, `npm run check`) were **not** run — this wave forbids them.

Task: `st_01a01b21` · lane `w2-t12` · file owner `test/self-hosting-projections.test.ts`

## Final disposition (unambiguous)

**10 ADOPT / 1 REFUSE** across five families. The only remaining `bindExample(` is the recorded refusal of `consumers.binding-language-views.bound-spec-page`. All 10 adopted siblings are tracked. The refused sibling stays untracked.

The refusal is a registrar-completeness failure, not a product-call failure: the generated sibling hardcodes parent-space `requiredConditions: ["specId", "bindings", "packId"]` while the authored point omits `packId`. Attempted adoption failed with the exact oracle-comparison refuse quoted below. That is the same freeze-friction shape as Wave-1 `consumers.agent-surface` / `consumers.reader`.

## Outcome summary

| Family | Sites | Disposition |
| --- | --- | --- |
| `consumers.design-review` | `pure-projection` | **ADOPT** |
| `consumers.derived-readiness-banner` | `dishonest-divergence`, `honest-headroom` | **ADOPT** both |
| `consumers.binding-language-views` | `bound-spec-page`, `pack-member-table` | **SPLIT: REFUSE / ADOPT** |
| `consumers.wholesale-view-rewrite` | `stale-page-removed`, `late-stale-page`, `failed-run-view-removed`, `build-invalidates-view` | **ADOPT** all 4 |
| `validation.diagnostic-rendering` | `composed-location`, `table-cell-location` | **ADOPT** both |

Accounting: **10 adopted + 1 refused = 11 examples**.

## Per-family ledger

### 1. `consumers.design-review` — ADOPT

Evidence: `createProjectionWorld(point)` materializes a fresh `consumer-surface` extract corpus and records the Given facts (spec ids, pack ids, the one warning). When is the authored render law: two independent `renderDesignReview(createReader(extract({ root }).graph))` runs plus a post-render fingerprint. Oracle Then is the index-page set; pack-page / finding-as-data / byte-identity / root-untouched joins live in `assertions` via `paramsForStep`. `temporaryRoots` is a cleanup registry, not a shared world.

Sibling: `test/consumers.design-review.pure-projection.test.generated.ts` (`registerPureProjection`).

### 2. `consumers.derived-readiness-banner` — ADOPT

Evidence: shared `createBannerWorld(point)` mints a fresh in-memory probe from `specId` / `statedReadiness` / `structure`. When is one `renderDesignReview(createReader(deriveFixtureGraph(...)))`. Oracle Then is the rendered floor reached, read from the page (`observe` returns the product string, not the expected argument). Banner-raised + first-unmet-clause joins live in `assertions`. Honest-headroom has no clause Then; its assertions only join the banner pair.

Siblings: `test/consumers.derived-readiness-banner.dishonest-divergence.test.generated.ts` (`registerDishonestDivergence`), `test/consumers.derived-readiness-banner.honest-headroom.test.generated.ts` (`registerHonestHeadroom`).

### 3. `consumers.binding-language-views` — SPLIT

`pack-member-table` **ADOPT**: sibling point is complete (`specId`, `bindings`, `packId`). `createBindingWorld(point)` owns the probe; When is one `renderDesignReview`. Oracle Then is the bound member-row repeat, observed from the actual pack table. Unbound-member `| none | none |` join + delivery-fact-name absence ride `assertions`.

`bound-spec-page` **REFUSE**: sibling registration shape (verbatim):

```ts
registerRunnableExample(
  boundSpecPageContract,
  {
    specId: "spec:probe.bound-surface",
    bindings: "an implementing code anchor and a verifying test anchor",
  },
  ["specId", "bindings", "packId"],
  adapters,
  bindings,
);
```

The authored example supplies only `{ specId, bindings }`. Missing dimension is `packId`. Natural mapping absent the completeness check would be: `createWorld: createBindingWorld`, `invoke: renderBindingGraph`, `observe` the implementation-binding Outcome, `expected` the first Then, `assertions` the verifier / observation / index / fact-name joins. The frozen completeness check refuses oracle comparison before that mapping can run.

Attempted adoption (then restored) failed:

```text
Error: at step: Then the spec page renders the implementation binding as present
scenario spec:consumers.binding-language-views.bound-spec-page: oracle comparison refused for incomplete point; missing Conditions: "packId"
```

Sibling adopted: `test/consumers.binding-language-views.pack-member-table.test.generated.ts` (`registerPackMemberTable`).
Sibling refused (untracked): `test/consumers.binding-language-views.bound-spec-page.test.generated.ts`.

### 4. `consumers.wholesale-view-rewrite` — ADOPT

Evidence: `createViewWorld(point)` owns a fresh `mkdtempSync` root, writes the authored or refused carrier, and plants the stale page when `planted === "before the run"`. When is one public command selected by `point.command`: `runView` or `runBuild`. Late planting rides that command's `extract` hook (the authored clock), not a second publisher after invoke. Oracle Then is the actual `exitCode`. View / current-page / stale-page / `.tmp` existence joins live in `assertions`. Cleanup registry `temporaryRoots` is not a shared world.

Siblings:

- `test/consumers.wholesale-view-rewrite.stale-page-removed.test.generated.ts` (`registerStalePageRemoved`)
- `test/consumers.wholesale-view-rewrite.late-stale-page.test.generated.ts` (`registerLateStalePage`)
- `test/consumers.wholesale-view-rewrite.failed-run-view-removed.test.generated.ts` (`registerFailedRunViewRemoved`)
- `test/consumers.wholesale-view-rewrite.build-invalidates-view.test.generated.ts` (`registerBuildInvalidatesView`)

### 5. `validation.diagnostic-rendering` — ADOPT

Evidence: `createDiagnosticWorld(point)` holds the finding + renderer. When is the authored "once per location shape" formatting: one renderer (`formatFinding` or `renderFindings`) applied to file+line / file-only / neither, stored on the world. Oracle Then is the file+line render. `observeComposedLocation` returns the stored product string with its trailing newline stripped so the Outcome payload matches the Spec Then (which does not include `\n`). `assertComposedLocation` then reads `withLocation` from the contract via `paramsForStep` and asserts `world.withLocation === `${withLocation}\n`` — so a renderer that dropped the newline still fails. File-only / neither degradations and the single-occurrence path join ride the same assertions. Observe returns the actual formatted text, not the expected parameter.

Siblings: `test/validation.diagnostic-rendering.composed-location.test.generated.ts` (`registerComposedLocation`), `test/validation.diagnostic-rendering.table-cell-location.test.generated.ts` (`registerTableCellLocation`).

## Per-example product-call table

| Example | Thens that must be satisfied | Product calls required by those Thens | Disposition |
| --- | --- | --- | --- |
| `pure-projection` | index page set; pack members in context; finding as data; second-render byte-identity; root untouched | Given extract+validate to name the corpus; When is two independent extract+`renderDesignReview` runs (the authored identity law) | **ADOPT** |
| `dishonest-divergence` | floor reached; banner raised; first unmet clause | one `renderDesignReview` over `createReader(deriveFixtureGraph)` | **ADOPT** |
| `honest-headroom` | floor reached; banner raised | one `renderDesignReview` over `createReader(deriveFixtureGraph)` | **ADOPT** |
| `bound-spec-page` | implementation / verifier / observation lines; index repeats; fact-name absent | one `renderDesignReview` would suffice, but the sibling refuses the incomplete point before any adapter can run | **REFUSE** |
| `pack-member-table` | member table repeats; fact-name absent | one `renderDesignReview` | **ADOPT** |
| `stale-page-removed` | exit; view survives; current page; stale gone; tmp gone | one `runView` | **ADOPT** |
| `late-stale-page` | exit; view survives; current page; stale gone; tmp gone | one `runView` (late plant is an extract hook inside that call) | **ADOPT** |
| `failed-run-view-removed` | exit; view gone; stale gone; tmp gone | one `runView` | **ADOPT** |
| `build-invalidates-view` | exit; view gone; stale gone; tmp gone | one `runBuild` | **ADOPT** |
| `composed-location` | file+line render; file-only; neither | one `formatFinding` applied to the three location shapes named by the When | **ADOPT** |
| `table-cell-location` | file+line row; file-only row; neither row | one `renderFindings` applied to the three location shapes named by the When | **ADOPT** |

## Anchor-pin flip table

`test/self-hosting-oracle/anchors.ts` was read only. Do **not** edit it in this lane. Boundary writer applies the 10 adopted replacements. The refused pin stays `bindExample`.

| Anchor id | Current `site:` | Replacement `site:` |
| --- | --- | --- |
| `test:protocol.design-review.pure-projection` | `bindExample(pureProjectionContract` | `registerPureProjection(` |
| `test:protocol.derived-readiness-banner.dishonest-divergence` | `bindExample(dishonestDivergenceContract` | `registerDishonestDivergence(` |
| `test:protocol.derived-readiness-banner.honest-headroom` | `bindExample(honestHeadroomContract` | `registerHonestHeadroom(` |
| `test:protocol.binding-language-views.bound-spec-page` | `bindExample(boundSpecPageContract` | **REFUSED** — retain `bindExample(boundSpecPageContract` |
| `test:protocol.binding-language-views.pack-member-table` | `bindExample(packMemberTableContract` | `registerPackMemberTable(` |
| `test:protocol.wholesale-view-rewrite.stale-page-removed` | `bindExample(stalePageRemovedContract` | `registerStalePageRemoved(` |
| `test:protocol.wholesale-view-rewrite.late-stale-page` | `bindExample(lateStalePageContract` | `registerLateStalePage(` |
| `test:protocol.wholesale-view-rewrite.failed-run-view-removed` | `bindExample(failedRunViewRemovedContract` | `registerFailedRunViewRemoved(` |
| `test:protocol.wholesale-view-rewrite.build-invalidates-view` | `bindExample(buildInvalidatesViewContract` | `registerBuildInvalidatesView(` |
| `test:protocol.diagnostic-rendering.composed-location` | `bindExample(composedLocationContract` | `registerComposedLocation(` |
| `test:protocol.diagnostic-rendering.table-cell-location` | `bindExample(tableCellLocationContract` | `registerTableCellLocation(` |

## Freshness (`stale_state`)

Last `specs/` commit: `Sun Aug 16 04:29:28 2026 +0200` `a35b31d42b8640dfdf779972e5f1e40bd8a4706c` (epoch `1786847368`).

All 10 adopted sibling mtimes are `2026-08-19 19:45:07 +0200` (epoch `1787161507`), delta `+314139` seconds. No adopted sibling is stale relative to the last specs commit.

`git ls-files` is non-empty for all 10 adopted siblings (count = 10). The refused sibling is not tracked.

Worktree SHA-256 of adopted siblings:

```text
cece9ec3813d6f2432939e4d833e6ccca017f52c937af0ac749cdd02ea5b87ec  test/consumers.design-review.pure-projection.test.generated.ts
fd156c16ec8d5be8a41179c5db206b02570dbc37bdbba94571ebd5463d778893  test/consumers.derived-readiness-banner.dishonest-divergence.test.generated.ts
398b732cc78b6d9e0fa76ea0128010ba4dbfa0faba0e3e341034b1c057ba62a4  test/consumers.derived-readiness-banner.honest-headroom.test.generated.ts
d060ea4226ecd69bd50cba0278e1076bf998633d0935348c0821c3bb50db4636  test/consumers.binding-language-views.pack-member-table.test.generated.ts
1fdb3e8e2977c669830291d4cfb214523d495a0a3576ec628b0f57eea5f28366  test/consumers.wholesale-view-rewrite.stale-page-removed.test.generated.ts
3164b5873e389c34bb7f285ab636917df95257933fa0bfcd8b9397761dba9c8a  test/consumers.wholesale-view-rewrite.late-stale-page.test.generated.ts
43940d5e4fe77a400beaeadb02b42f0274f482f763c0c84c5e70a5a535fd3010  test/consumers.wholesale-view-rewrite.failed-run-view-removed.test.generated.ts
2420f9cdfc0bf8df519f36bf60ddac77eb64b84b5059a4a6191e4df3b72375e2  test/consumers.wholesale-view-rewrite.build-invalidates-view.test.generated.ts
906dfd57ecdd86e9ea7c1e5008a96edf923b1f16098093433cf25479877ac711  test/validation.diagnostic-rendering.composed-location.test.generated.ts
794eced28231d11e1271ffb1a03c075bfd0ddef95d577865f1b7b010baca2b4d  test/validation.diagnostic-rendering.table-cell-location.test.generated.ts
```

## Five-adapter friction (verbatim; freeze not reopened)

1. **One-kind comparator vs multi-Then kinds.** `compareContractOutcome` matches only the Then whose skeleton equals `expected.kind` and no-ops the others. Every adopted family puts only the first Then through `expected`/`observe`. Extra Then params live in `assertions` via `paramsForStep`.
2. **`observe` returns product values.** Banner floor, pack-member repeat, view exit code, and diagnostic renders are read from the world after invoke. They are not copies of the expected-function arguments.
3. **Cleanup registries are not shared worlds.** `temporaryRoots` only lets `afterEach` remove roots `createWorld` minted. Each example gets a fresh world object.
4. **`createWorld` owns materialization.** Extract-corpus copy, temp view trees, early stale-page plant, and in-memory probe assembly live in `createWorld(point)`. Incomplete points return empty worlds and never cast `Partial` to `Conditions`.
5. **No second product call on adopted examples.** Extra Thens are pure reads/joins. Late stale-page planting is a hook inside the one `runView`/`runBuild` call. Diagnostic "once per location shape" applies the same renderer three times inside invoke, then observe/assertions only read stored strings.
6. **Registrar completeness is a refuse, not an adapter gap.** `bound-spec-page` cannot invent `packId`; supplying one would change the example's world (a pack page the bound-spec Thens do not require). Refusal is complete.

## Happy path — focused vitest

Command: `npx vitest run test/self-hosting-projections.test.ts`

Final run after the composed-location newline restore:

```text
 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol


 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  20:26:33
   Duration  1.10s (transform 455ms, setup 0ms, import 861ms, tests 110ms, environment 0ms)
```

Exit: `0`. 11 tests = 10 newly adopted + 1 remaining `bindExample` activation.

Scoped checks:

- `./node_modules/.bin/eslint test/self-hosting-projections.test.ts` — clean (exit 0)
- `./node_modules/.bin/prettier --check test/self-hosting-projections.test.ts` — clean
- `git diff --check -- test/self-hosting-projections.test.ts` — clean
- `rg -n '^bindExample\(' test/self-hosting-projections.test.ts` — one remaining activation, the recorded refusal:

```text
736:bindExample(boundSpecPageContract, bindingWorld, bindingLanguageBindings);
```

Unanchored `rg -n 'bindExample\('` matches two lines because the refusal comment on line 735 contains the token. Activations are counted with `^bindExample\(`.

## Failure QA

Wrong-import probe against the adopted `registerPureProjection` sibling (temporary `.test.generated.broken.js` path):

```text
 FAIL  test/self-hosting-projections.test.ts [ test/self-hosting-projections.test.ts ]
Error: Cannot find module './consumers.design-review.pure-projection.test.generated.broken.js' imported from /home/darkomijic/dev-libar/software-delivery-protocol/test/self-hosting-projections.test.ts
 ❯ test/self-hosting-projections.test.ts:74:1
Test Files  1 failed (1)
      Tests  no tests
WRONG_IMPORT_EXIT:1
```

Import restored; focused run returned `11 passed (11)` exit `0`.

Refusal-path probe (temporary `registerBoundSpecPage` adoption, then restored) produced the exact completeness error quoted in family 3. That is the lane-safe substitute for the plan-todo's serialized `preflight` tamper probe.

## Tracking receipt

Force-add used the required lock retry around exactly the 10 adopted paths:

```text
for i in 1 2 3 4 5; do
  git add -f "${files[@]}" && break
  sleep 1
done
```

Succeeded on attempt 1. `git ls-files` count = 10. Refused sibling `test/consumers.binding-language-views.bound-spec-page.test.generated.ts` remains untracked.

## Adversarial notes

| Class | Disposition |
| --- | --- |
| `stale_state` | Exercised. Sibling mtimes 19:45:07 all newer than last specs commit Aug 16 04:29:28. Registrar export names and requiredConditions read from the siblings themselves. |
| `misleading_success_output` | Exercised. Happy transcript pasted; 11 tests still execute semantics (10 registrar + 1 bindExample). Wrong-import went red then restored green. Refusal probe went red with the quoted completeness error then restored. AdversarialVerify found a composed-location newline regression (observe stripped `\n` and assertions no longer checked the file+line trailing newline); restored `assertComposedLocation` to `world.withLocation === `${withLocation}\n``. |
| `dirty_worktree` | Exercised. Concurrent Wave-2 dirt (`test/self-hosting-extraction.test.ts`, extraction siblings, J packets, plan file) was left untouched. This lane wrote only the owned suite, the 10 force-added siblings, and this evidence file. |
| `generated_artifacts` | Exercised: 10 adopted siblings force-added; refused sibling not added. |
| `flaky_tests` | N/A — no timing waits or polling; focused run is deterministic filesystem + in-memory render. |
| `malformed_input` | N/A — no parser surface added. |
| `prompt_injection` | N/A — no agent-facing prompt surface added. |
| `cancel_resume` | N/A — no cancel/resume behavior exists in this family. |
| `hung_commands` | N/A — no watcher or long-running command introduced. |
| `repeated_interruptions` | N/A — no interruptible product loop introduced. |

## AdversarialVerify correction

Verdict on first review: NEEDS-FIX (0.98). Two bounded corrections applied; the ADOPT 10 / REFUSE 1 split and the `packId` refusal stand.

1. `assertComposedLocation` now reads `withLocation` from `composedLocationContract` and asserts `world.withLocation === `${withLocation}\n``. Observer still returns the Outcome payload without the newline (Spec Then text). The assertion is what catches a renderer dropping it.
2. Activation census uses `rg -n '^bindExample\('` (one hit at line 736). The comment on line 735 is not an activation.

## Cleanup

Temporary extract and view roots are removed by the existing `afterEach` over `temporaryRoots`. Wrong-import and refusal-probe edits were restored. No scratch files, commits, pushes, or forbidden commands (`build`, `generate:*`, `check:self-hosting`, `check:example`, `preflight`, full `npm run check`) were run. Projection publishers, specs, J carrier, `anchors.ts`, helpers, and `generated/` were not touched. This correction did not run any git operations.

## DoneClaim

```json
{
  "task": "st_01a01b21",
  "changed_files": [
    "test/self-hosting-projections.test.ts",
    "test/consumers.design-review.pure-projection.test.generated.ts",
    "test/consumers.derived-readiness-banner.dishonest-divergence.test.generated.ts",
    "test/consumers.derived-readiness-banner.honest-headroom.test.generated.ts",
    "test/consumers.binding-language-views.pack-member-table.test.generated.ts",
    "test/consumers.wholesale-view-rewrite.stale-page-removed.test.generated.ts",
    "test/consumers.wholesale-view-rewrite.late-stale-page.test.generated.ts",
    "test/consumers.wholesale-view-rewrite.failed-run-view-removed.test.generated.ts",
    "test/consumers.wholesale-view-rewrite.build-invalidates-view.test.generated.ts",
    "test/validation.diagnostic-rendering.composed-location.test.generated.ts",
    "test/validation.diagnostic-rendering.table-cell-location.test.generated.ts",
    ".omo/evidence/task-12-plan-37-settling-arc.md"
  ],
  "tests": "npx vitest run test/self-hosting-projections.test.ts: 11 passed after newline restore; ESLint, Prettier, and diff checks clean",
  "manual_qa": "Wrong generated-sibling import failed with exit 1 then restoration passed 11/11; bound-spec-page registrar attempt failed missing Conditions packId and was restored to bindExample; composed-location now asserts file+line trailing newline; bindExample census uses ^bindExample(",
  "cleanup": "Temporary roots cleaned by afterEach; probes restored; no commit or push; no git operations in the correction pass; unrelated worktree dirt preserved",
  "risks": "anchors.ts retains pre-adoption site strings except the 10 recorded flips for the boundary writer; bound-spec-page stays on bindExample because the generated sibling requires unused packId"
}
```
