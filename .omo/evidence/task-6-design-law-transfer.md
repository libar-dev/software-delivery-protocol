# Task 6 — Register "architecturally significant unit" in CONTEXT.md

Plan: `design-law-transfer` · Todo 6
Branch: `design-law-transfer/todo-6`
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-6`
Task id: `st_01a023ba`

Scope honored: one glossary row inserted immediately after `anchor` in `## The other authored things`. No other row, header, or section changed.

## Baseline (failing-first, before lane edits)

Worktree started clean on `design-law-transfer/todo-6`. `node_modules/` was absent.

```
grep -n "architecturally significant unit" CONTEXT.md
GREP_EXIT=1
```

No glossary row. Hits in other files (carrier `specs/model/structural-patterns.sdp.md`, protocol rule text) do not count.

Three final gate commands as baseline (same worktree, before the CONTEXT.md edit):

```
npm run check:temporal
TEMPORAL_EXIT=0

npm run check:self-hosting-gates
GATES_EXIT=0

npx vitest run test/check-self-hosting-gates.test.ts
VITEST_EXIT=1
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vitest'
```

The missing glossary row is not a gate failure. Temporal and self-hosting-gates were already green. Vitest failed because dependencies were not installed. `npm ci` (201 packages) was a prerequisite so the focused suite could run; it is not a corpus finding.

## Edit

Inserted the planned row after the `anchor` row. Wording matches the carrier `model.terms` stem from `specs/model/structural-patterns.sdp.md` (`a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding`) plus the planned membership/uses/accepted-set clause.

## Commands and results (after edit)

```
grep -n "architecturally significant unit" CONTEXT.md
67:| **architecturally significant unit** | a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding — component membership, and uses declarations for its architectural dependencies; the accepted set is an owner-reviewed declaration, never derived from imports (carried by `spec:model.structural-patterns`) | "pattern" (refused, MD-34) |
GREP_EXIT=0
```

```
npm run check:temporal
TEMPORAL_EXIT=0

npm run check:self-hosting-gates
GATES_EXIT=0

npx vitest run test/check-self-hosting-gates.test.ts
Test Files  1 passed (1)
Tests  6 passed (6)
VITEST_EXIT=0
```

## Manual QA

```
grep -n -A2 -B2 "architecturally significant unit" CONTEXT.md
```

```
65-| **`Pack`** | ...
66-| **anchor** | ... | "marker" |
67:| **architecturally significant unit** | a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding — component membership, and uses declarations for its architectural dependencies; the accepted set is an owner-reviewed declaration, never derived from imports (carried by `spec:model.structural-patterns`) | "pattern" (refused, MD-34) |
68-
69-**Two grouping mechanisms, kept distinct:** ...
```

**PASS** — the row sits between `anchor` and the next table boundary (blank line, then prose). Byte-exact match to the planned row.

## Adversarial table (all 9 classes)

| Class | Probe | Result |
| --- | --- | --- |
| dirty_worktree | `git status --short` and `git diff --check` after the CONTEXT.md edit, before this evidence file | ` M CONTEXT.md` only. `git diff --check` exit 0. |
| misleading_success_output | Exact exit codes, not a skim of "ok" text | Baseline: grep 1, temporal 0, self-hosting-gates 0, vitest 1 (`ERR_MODULE_NOT_FOUND`). After edit + `npm ci`: grep 0 (one CONTEXT.md line, the new row), temporal 0, self-hosting-gates 0, vitest 0 (1 file / 6 tests). Manual QA also required the between-anchor-and-boundary placement and exact wording. |
| stale_state | Generated-cache / stale-artifact probe | N/A — no generated cache; this lane edits hand-authored `CONTEXT.md` only. |
| parser | Parser / extract surface | N/A — no parser work. |
| external_text | Ingest of untrusted external text | N/A — row text is the planned glossary line; no external ingest. |
| resumable_flow | Resume / checkpoint protocol | N/A — single insert, not a resumable flow. |
| long_process | Long-running process health | N/A — no long-running process. |
| timing_test | Timing / flake-prone wait | N/A — no timing test. |
| interruptible_operation | Mid-flight interrupt / cancel | N/A — no interruptible operation. |

## Changed-file list

- `CONTEXT.md` (one new glossary row after `anchor`)
- `.omo/evidence/task-6-design-law-transfer.md` (this file)

Not changed: any other glossary row, header, or section; `specs/`; `src/`; oracles; fixtures.

## Cleanup receipt

No temp assets were created. `npm ci` populated gitignored `node_modules/` so the focused vitest file could load. No `dist/` or `generated/` writes.

Final pre-commit `git status --short` (lane files only):

```
 M CONTEXT.md
?? .omo/evidence/task-6-design-law-transfer.md
```

`git diff --check` exit 0. No temp assets left in the worktree.

## Risks

- CONTEXT.md is copied into the self-hosting fixture (`test/check-self-hosting-gates.test.ts`); content is not pinned. The focused suite stayed green (6/6). If a later todo pins glossary bytes, this row must be transcribed there.
- The row cites MD-34 as the refused alias for `pattern`. That name already appears on the rejected ledger; temporal/self-hosting-gates still exit 0.
- Shared-roster / frozen-total work remains other todos' scope; this lane did not run the full self-hosting graph suite.
