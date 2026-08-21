# F2 Plan Recipe-19 Sync

Verdict: **plan recipe-19 JS body is byte-exact with the remediated catalog body.**

Owned paths only: `.omo/plans/architectural-patterns-views.md` and this evidence file. Catalog, tests, corpus, Boulder, ledger, and orchestration state were not edited. No stage, commit, push, or stash.

## Finding

`.omo/plans/architectural-patterns-views.md` todo 10 still promised recipes 17–19 "supplied verbatim" while the embedded recipe-19 JavaScript retained the pre-remediation `abstractions` keys, unguarded `component.label/file/line` reads, and the filtered top-level list. Catalog `docs/agent-surface/recipes.md` heading 19 already shipped the corrected body.

## Parser

Same extraction as `parseRecipes` in `test/recipes.test.ts` for the catalog (`## N.` heading, then ` ```js ` … ` ``` `). Plan bodies are the 4-space-indented ```` fences under todo 10, heading line dropped, trailing empty lines stripped. Comparison is raw string equality of those JS bodies.

## Before (plan recipe 19 vs catalog)

| Body | Bytes | SHA-256 | `abstractions` | `component?.` | equals catalog 19 |
| --- | --- | --- | --- | --- | --- |
| catalog 17 | 2860 | `5b5e5b5a635b81dcd7542fa9b66b72e90ee810138abac1b5e2dc7afd9bed0a9f` | — | — | n/a |
| plan 17 | 2860 | `5b5e5b5a635b81dcd7542fa9b66b72e90ee810138abac1b5e2dc7afd9bed0a9f` | — | — | yes (17) |
| catalog 18 | 2475 | `e2a4164f68998e0627383f28f547ac269fcb1efd9120e70a0088bb12cb3d60d8` | — | — | n/a |
| plan 18 | 2475 | `e2a4164f68998e0627383f28f547ac269fcb1efd9120e70a0088bb12cb3d60d8` | — | — | yes (18) |
| catalog 19 | 3984 | `9e2b1cdf2c093667ed6a7d7af8603bef9af43dd0abb2e29b673cca0e0054c50e` | 0 | 3 | — |
| plan 19 | 4023 | `d72d5b8457027a23456fc314090d143cf84f61579a99511fcf7afe8efde58bc2` | 6 | 0 | **no** |

First mismatch was line 45 of the JS bodies (`abstractions: new Set()` vs `implementations: new Set()`). Plan 19 also used `component.label` / `component.file` / `component.line` and `abstractions: implementations.filter((binding) => !componentIds.has(binding.codeId))`.

## Sync

Replaced only the indented recipe-19 JavaScript inside the existing todo-10 ```` fence. Heading `## 19. Planning slice`, recipes 17/18 fences, checklist, and all other prose were left as already present in the working tree. The inserted bytes are the catalog heading-19 ` ```js ` body with the same 4-space indent used by recipes 17 and 18 (rebuild of 17/18 with that rule is identity).

## After

| Body | Bytes | SHA-256 | equals catalog |
| --- | --- | --- | --- |
| plan 17 | 2860 | `5b5e5b5a635b81dcd7542fa9b66b72e90ee810138abac1b5e2dc7afd9bed0a9f` | yes (unchanged vs before) |
| plan 18 | 2475 | `e2a4164f68998e0627383f28f547ac269fcb1efd9120e70a0088bb12cb3d60d8` | yes (unchanged vs before) |
| plan 19 | 3984 | `9e2b1cdf2c093667ed6a7d7af8603bef9af43dd0abb2e29b673cca0e0054c50e` | **yes, `plan_js[19] == catalog_js[19]`** |

Plan file now contains zero `abstractions` tokens. Recipe 19 uses `component?.label ?? null` / `component?.file ?? null` / `component?.line ?? null` and unfiltered top-level `implementations: implementations`.

Checklist retained: F1 checked, F2 unchecked, F3 checked, F4 checked.

## Checks

| Check | Result |
| --- | --- |
| Deterministic parser equality plan 19 == catalog 19 | PASS, 3984 bytes, SHA-256 `9e2b1cdf2c093667ed6a7d7af8603bef9af43dd0abb2e29b673cca0e0054c50e` |
| Plan 17/18 SHA-256 unchanged vs pre-sync | PASS |
| F1/F3/F4 `[x]`, F2 `[ ]` | PASS |
| `npx prettier --check .omo/plans/architectural-patterns-views.md` | All matched files use Prettier code style; exit 0 |
| `git diff --check -- .omo/plans/architectural-patterns-views.md` | exit 0, no whitespace errors |

No product tests: catalog and engine are unchanged.

## Cleanup

- No stage, commit, push, or stash.
- Pre-existing dirty tree outside these two owned paths left untouched.
