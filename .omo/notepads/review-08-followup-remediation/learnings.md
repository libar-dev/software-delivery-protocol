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
