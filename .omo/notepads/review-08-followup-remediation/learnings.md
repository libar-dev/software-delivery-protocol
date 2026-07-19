# Learnings

## 2026-07-19 Session start
- Plan: review-08-followup-remediation — 13 review fixes, RED-first TDD, 9 todos in 3 waves
- setOwn helper: Object.defineProperty enumerable+writable+configurable — NO Map, NO Object.create(null)
- Import dedupe: dev+ino physical identity; ino===0 → path:realpath fallback
- Batch gate: error-severity only (warnings inform)
- Commits: one per todo, local only, no push
- Evidence: .omo/evidence/task-N-review-08-followup-remediation.md
- Final npm run check requires committed tree (preflight flags untracked)

## 2026-07-19 Task 1
- Markdown Model terms must use `setOwn` for author-controlled keys: assignment to `__proto__` invokes the inherited setter, drops primitive values, and defeats the existing own-property duplicate check.
- The existing `Object.hasOwn(terms, key)` uniqueness check is correct; `defineProperty` with enumerable, writable, and configurable descriptors restores plain-object behavior without `Object.create(null)` or `Map`.

## 2026-07-19 Task 2
- `statSync` must run before `realpathSync`: physical identity uses `dev+ino`, while the canonical path remains the first-wins display and import path.
- `ino === 0` must key by canonical path so Windows and network mounts preserve existing realpath dedupe instead of collapsing unrelated files.

## 2026-07-19 Task 3
- The import batch gate must inspect `Finding.severity`: warnings still render, but only error findings and operational failures block publication; the existing empty-plan guard keeps a warning-only empty import at exit 1.

## 2026-07-19 Task 4
- Publication is complete once the atomic hard link succeeds: temporary cleanup failures must use `removeArtifact`, warn about the stale temporary, and stay outside the rollback catch so the target remains current.
- A hard-link failure is a filesystem capability error, not an ordinary publication detail; wrapping it preserves rollback while naming the no-fallback requirement in both stderr and help.

## 2026-07-19 Task 5
- TS carrier section reification must use `setOwn` at both recursive/static object writes and sanitizer reconstruction: otherwise an authored `__proto__` string disappears, while an object value invokes the inherited setter before the sanitizer's preserved own-property guard can see it.
- Retaining normal plain-object semantics with `Object.defineProperty` keeps scalar and object `__proto__` keys enumerable, own, and prototype-safe without changing duplicate guards or envelope handling.

## 2026-07-19 Task 6
- A code span does not protect a GFM table row from a pipe delimiter: findings-table code cells need a dedicated renderer that escapes `|` and collapses whitespace before applying delimiter-safe inline-code rendering.
- CommonMark removes one matching pair of code-span boundary spaces, so literal edge spaces require an added padding pair; all-space values remain a documented display-only approximation.
