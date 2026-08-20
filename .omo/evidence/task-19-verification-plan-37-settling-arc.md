# Todo 19 independent adversarial verification

```json
{
  "AdversarialVerify": {
    "taskId": "st_01a01e3b",
    "commit": "a4a1468f59d199a1d381b23837ebcda9488f8614",
    "verdict": "confirmed",
    "reason": "Commit identity, four-file manifest, P37-R1 56=56 inventory, lint override boundary, owner amendment, fresh closure gates, and one current-tree ADOPT/REFUSE re-measure all hold. Todo 19 stays unchecked."
  }
}
```

I did not author the arc review or its finding closure. I read Todo 19, Plans 32/35/36/37, the operational plan, Todo-18 verification, the full Todo-19 register, the primary appended register, the owner amendment, and the parent-to-commit diff. Then I recomputed P37-R1 from current bytes and re-ran the named gates.

## Verdict

`confirmed`

P37-R1 is one ACCEPT finding, CLOSED, with owner statement `Approve Brief-I exception`. Current inventory and lint bytes fit that bound. The review commit is documentation plus the recorded amendment. Status stays EXECUTING. Todo 20 is not claimed.

## Commit and scope

HEAD is `a4a1468f59d199a1d381b23837ebcda9488f8614`.

Parent is exact: `8e6a86bf946dd28958a01d5034ce849d97d88731`.

Subject bytes are exact ASCII, no em dash:

`docs(plans): plan-37 independent review register and closures`

Footer is exact:

`Plan: .omo/plans/plan-37-settling-arc.md`

Manifest is the required four paths:

```text
A  .omo/evidence/task-18-verification-plan-37-settling-arc.md
A  .omo/evidence/task-19-plan-37-settling-arc.md
M  .omo/plans/plan-37-settling-arc.md
M  plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md
```

`4 files changed, 408 insertions(+), 1 deletion(-)`.

The operational-plan hunk is one frozen-guardrail line. It appends the P37-R1 owner amendment. It does not check Todo 19 or Todo 20. The primary-plan hunk only appends the independent-review register after the close record. Status header remains `🔄 EXECUTING`.

No Spec, test, oracle, runtime, package, recipe, generated, `AGENTS.md`, or status-header edit.

Unrelated dirt stayed out of the commit:

```text
 M .omo/boulder.json
?? .omo/drafts/sdp-skills-gen1-parity.md
?? .omo/evidence/task-1-sdp-skills-gen1-parity.md
?? .omo/evidence/task-1-sdp-skills-gen1-parity-verification.md
?? .omo/evidence/ulw-20260820-081346.05dmOx.md
?? .omo/plans/sdp-skills-gen1-parity.md
```

## P37-R1 recomputation

### 56 = 56 inventory

Independent sets, current tree, not inherited:

- `git ls-files -- 'test/*.test.generated.ts'` = 56 unique tracked generated siblings.
- `contract-dependent-suites.mjs` root `testPaths` = 71 unique paths. 56 of those end in `.test.generated.ts`. 15 are authored suites or the shared helper.
- Tracked generated set equals inventory generated set. Empty only-in-inventory. Empty only-tracked. No duplicates.
- All 56 generated files import `generated/contracts`.
- `test/self-hosting-graph.test.ts` and `test/self-hosting-contracts.test.ts` are absent from the inventory.
- `generated/registrars.json` `files.length` = 68. Tracked-not-owed is empty. Owed-not-tracked is exactly 12 files, all on disk and gitignored.

The 15 non-generated inventory rows all import `generated/contracts` except `test/helpers/generated-contract.ts`, which the inventory file itself names for `dist/` runner types. That is not a generated-file leak.

### Lint override boundary

`eslint.config.js` has one `@typescript-eslint/no-redundant-type-constituents` occurrence, `off`, inside the existing override whose `files` are `[...rootContractDependentSuite.testPaths]`. That list is 71 unique paths.

The base rule remains `error` in `typescript-eslint` `strictTypeChecked` / `strictTypeChecked-only`. This repo spreads those configs over `typedTsFiles` before the contract-dependent override.

`package.json` `check` still runs `generate:self-hosting` then `typecheck` (`tsc --noEmit -p tsconfig.json`). Lint does not replace later typecheck.

### Full-arc check/config scope

Range `a8d5898f549778d5841653dc81730a0c5810e446..HEAD`. Commission parent is `a8d5898`. Commission commit is `1dae853`.

Check/config implementation diffs in that range are only:

1. Todo 1 discovery pin in `test/check-self-hosting-gates.test.ts`: `number: 36` / plan-36 filename to `number: 37` / plan-37 filename.
2. Commit `4851740` `fix(checks): cover plan-37 registrars in clean clones`: add the later-tranche generated siblings to `contract-dependent-suites.mjs`, and add the one `no-redundant-type-constituents` `off` line inside the existing override.

`check-self-hosting-gates.mjs`, `preflight.mjs`, `vitest-test.mjs`, `package.json`, and `tsconfig.json` have no arc diff.

`4851740` also rewrote one projections comment from an old bindExample-refused note to `// Refused: generated sibling requires unused packId.`. That is a test comment, not check configuration. Census commits `9218be9` and `dfb899b` touch `.omo/evidence/plan-37-k-measurement/census.mjs` only.

## Fresh closure gates

Serialized. I did not run `npm run check`.

| Command | Result |
| --- | --- |
| `npm run lint` | exit 0 |
| `npm test -- test/self-hosting-carrier.test.ts` | exit 0; 1 file, 3/3 |
| `cd /tmp && node $REPO/vitest-test.mjs test/self-hosting-carrier.test.ts` | exit 1; `Generated contracts required by the selected test suite are missing.` Recovery exactly `` `npm run build && npm run generate:self-hosting` `` |
| `npm run generate:self-hosting` | exit 0; `156 specs · 1 packs · 157 anchors → 314 nodes · 660 edges`; `validate: 0 errors · 5 warnings`; generated status stayed clean |
| `npm run check:self-hosting` | exit 0; generated status stayed clean |
| `npm run typecheck` | exit 0 |
| `node check-self-hosting-gates.mjs .` | exit 0; `currentRecord.status` `EXECUTING`; current plan file is `plans/37-adoption-tranches-drift-maturation-and-bundle-measurement.md` |
| `npx prettier --check` on the four committed markdown files | exit 0 |
| `git diff --check 8e6a86bf..a4a1468` | exit 0 |

`npm run preflight` exit 1. Semantic diff is only `.omo/boulder.json`. Nonignored runtime garbage is the five untracked parity/ultrawork/draft files listed above. No `tracked adopted registrar drift`. No `generated drift`. No tracked writes inside generated paths. That is unrelated named orchestration state, not registrar/product/generated drift.

Generate warning subjects were:

- `spec:carrier.markdown-authoring`
- `spec:extraction.claim-taxonomy`
- `spec:model.pack-aggregate`
- `spec:model.relations`
- `spec:model.spec-sections`

Those are the five READY rows, not a sixth warning and not an error.

## Verified-row re-measure

Not inherited from Todo 19 prose.

**ADOPT `carrier.markdown-parser.bounded-parity`.** `registerBoundedParity` is live at `test/self-hosting-carrier.test.ts:142`. Sibling `test/carrier.markdown-parser.bounded-parity.test.generated.ts` is tracked mode `100644`, 2759 bytes, sha256 `16020a61b7945c6a2994860dc8e0153ab98e47c1a8a757b92b8e7cb338f7ffbb`. The registrar point is `{ probe: "unrecognized-property" }` with required `["probe"]`. Split TypeScript/Markdown severity and count Thens remain in `assertions: assertParity`.

**REFUSE `consumers.binding-language-views.bound-spec-page`.** Authored site is still `bindExample` at `test/self-hosting-projections.test.ts:751`. Current generated sibling is gitignored and untracked, 3519 bytes, sha256 `45031e00aa0509539ea012e40711c10577074a277f3d8f387041ae8d45b8431f`. `registerRunnableExample` requiredConditions are `["specId", "bindings", "packId"]`. The generated point supplies only `specId` and `bindings`.

Runtime probe against `dist/testing` `createRunnableExample` + `compareContractOutcome` with that point and required list:

```json
{
  "missingConditions": ["packId"],
  "expectedCalled": false,
  "threw": "scenario spec:consumers.binding-language-views.bound-spec-page: oracle comparison refused for incomplete point; missing Conditions: \"packId\""
}
```

No regression on either row.

Live authored accounting, rebuilt from current `test/self-hosting-*.test.ts`: `bindExample(` = 12 (projections 1, gherkin 2, extraction 4, consumers 5). Generated `register*` activations = 56. `self-hosting-graph.test.ts` has five extra `registerExample(` calls that are not generated-registrar activations; they are not part of the 56.

## Review honesty

The Todo-19 register covers I ledger, J dispositions, K verdict, close measurements, scope, test weakening, and the status boundary. Current-tree evidence that I actually re-ran supports the closed P37-R1 claim and the I/J rows I re-measured.

Challenge, not a fail: the register's phrase `56 register* calls` is the generated-registrar count. A naive `register[` scan of every `self-hosting-*.test.ts` file is 61 because of graph `registerExample`. The 56 number is still the right activation count.

Challenge, not a fail: I did not re-run recipes 1/2/8 or the frozen K census. Generate/validate currently reprints the close-record graph identity and the five honesty warnings. That is enough to refuse a stale close number. It is not a second K hash.

Operational amendment and primary register agree. Both say ACCEPT, CLOSED, 56 siblings, one lint disable inside the existing override, no other check/config change. Neither carries open or needs-fix text. The operational line still states the original `No validator, floor, or check changes` guardrail and then records the dated P37-R1 exception. That is sequential law, not a split brain.

Exact owner statement `Approve Brief-I exception` is in the Todo-19 register and in the primary appended register. The operational file records the same exception as `Owner amendment (2026-08-20, P37-R1)` without repeating that five-word phrase. Substance matches.

No skip / `.only` / `.todo` markers in the arc test diff. A first `xit(` grep hit `ViewExit(`; a tighter scan is clean.

## Status boundary

| Surface | Current |
| --- | --- |
| `plans/37` header | EXECUTING |
| `plans/36` header | DRAFTED |
| `AGENTS.md` | `plan 37 is EXECUTING`; `plan 36 is DRAFTED` |
| Todo 19 checkbox | `[ ]` |
| Todo 20 checkbox | `[ ]` |
| F1-F5 | unchecked |

Todo 20 green-twice is not claimed. I did not flip status.

## Adversarial classes

| Class | Result |
| --- | --- |
| `stale_state` | HEAD `a4a1468`, current files, fresh lint/wrapper/generate/check-clean/typecheck/records/preflight. |
| `dirty_worktree` | Opening and final porcelain are the six unrelated `.omo` paths. None entered the commit. Preflight names the same set. |
| `misleading_success_output` | Missing-dependency exit 1 and preflight exit 1 are expected. Generate's first-line `0 warnings` is the derivation split; honesty then adds five. Exit codes were not treated as enough. |
| `verified_row_regression` | ADOPT bounded-parity and REFUSE bound-spec-page re-measured from current registrar bytes and a live incomplete-point probe. |
| `generated_cached_artifacts` | Generate then check-clean; `git status -- generated` stayed empty. |
| `test_weakening` | No skip/only/todo introduced. Wrapper still 3/3. The `4851740` projections edit is a comment. |
| `scope_creep` | Four-file manifest. Owner amendment is the ACCEPT closure, not a product edit. Full-arc check/config is the commissioned pin plus the authorized inventory/lint pair. |
| `malformed_input` | Not applicable. Todo 19 added no parser. |
| `prompt_injection` | Not applicable. No corpus text was executed as a query body. |
| `cancel_resume` | No command cancelled or resumed. |
| `hung_or_long_commands` | Every command finished inside its timeout. |
| `flaky_tests` | Carrier wrapper passed once. No retry, sleep, or poll. |
| `repeated_interruptions` | None. |

## Cleanup

Generated roots are clean. Preflight's empty `.tmp-scratch` was removed after the run. No process or extra scratch file from this verification remains. This file is the only write.
