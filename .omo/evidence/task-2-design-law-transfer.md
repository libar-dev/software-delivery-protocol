# task-2 design-law-transfer evidence

Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-2`
Branch: `design-law-transfer/todo-2`
Scope: append `comment promotion` after `promotion` on `spec:model.spec-sections`; lockstep `test/self-hosting-oracle/model.ts`. No dedicated Spec. Readiness unchanged (`ready`).

## Baseline (before edits)

Command:

```
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Result: exit `0`. `162 specs · 1 packs · 175 anchors → 338 nodes · 747 edges (0 errors, 0 warnings)`. `validate: 0 errors · 5 warnings` — the pinned `honesty/gaps` set, including `specs/model/spec-sections.sdp.md`.

Worktree had no `dist/` or `node_modules/`. `npm ci` then `npm run build` were required so the CLI existed. That is local bootstrap, not a product edit.

Command:

```
npx vitest run test/self-hosting-graph.test.ts -t 'model family'
```

Result: exit `0`. `1 passed | 25 skipped`.

## Failing-first

Carrier-only edit: appended the plan term immediately after `promotion` in `specs/model/spec-sections.sdp.md`. Oracle left unchanged.

Command:

```
npx vitest run test/self-hosting-graph.test.ts -t 'model family'
```

Result: exit `1`. Expected descriptor mismatch recorded:

```
AssertionError: expected [ …(13) ] to deeply equal [ …(13) ]
+           "comment promotion": "Source commentary that states rules other surfaces depend on is a promotion trigger: those rules promote into a standalone Spec under the promotion law, and the comment demotes to local commentary plus a Spec pointer; restating the promoted rules in the comment violates exclusive promotion.",
```

Oracle then transcribed that exact definition onto `spec:model.spec-sections`.

## Final automated verification

Same validate command: exit `0`. Same corpus counts (`162 / 1 / 175`, `338` nodes, `747` edges). `0 errors · 5 warnings` (same pinned `honesty/gaps` set). Spec count unchanged — no dedicated Spec minted.

Focused model-family test: exit `0`. `1 passed | 25 skipped`.

## Manual QA

Prescribed body:

```
pnpm --silent sdp:q 'return g.specContext("spec:model.spec-sections").sections.model.terms.filter((t)=>t.name==="comment promotion")' --json
```

Result: exit `1`. Live error: `sdp q: g.specContext(...).sections.model.terms.filter is not a function`.

`sections.model.terms` is a keyed object, not an array of `{name}`. Shape probe (`--json`, exit `0`) returned keys in authoring order, including exactly one `"comment promotion"` key, definition equal to the plan text.

Corrected live query (object entries, same name filter):

```
pnpm --silent sdp:q 'const terms = g.specContext("spec:model.spec-sections").sections.model.terms; const matches = Object.entries(terms).filter(([name]) => name === "comment promotion").map(([name, definition]) => ({ name, definition })); return { count: matches.length, matches, readiness: g.specContext("spec:model.spec-sections").statedReadiness };' --json
```

Result: exit `0`. `count: 1`. Definition is the plan sentence. `statedReadiness: "ready"`.

Manual QA: PASS on the rendering contract (exactly one term, plan text). The prescribed filter call is the wrong type for the live reader.

## Adversarial classes

1. **stale_state** — Probed via live `sdp:q` after the final validate write. Graph still has `162` specs; `spec:model.spec-sections` still `ready`; the new term is present once. Not stale relative to the edited carrier.
2. **dirty_worktree** — `git status --short` after product edits showed only `specs/model/spec-sections.sdp.md` and `test/self-hosting-oracle/model.ts`. `git diff --check` exit `0` (no whitespace errors). `generated/`, `dist/`, `node_modules/` are gitignored. Evidence file added next; no unrelated tracked edits.
3. **misleading_success_output** — Validate exit `0` with `0 errors` (warnings are the known five). Failing-first vitest exit `1`. Final vitest exit `0`. Prescribed QA query exit `1` (type error, not a silent empty array). Corrected QA query exit `0` with `count: 1`.
4. **parser** — N/A. No parser change.
5. **external_text** — N/A. Term text is the plan sentence, not imported external prose.
6. **resumability** — N/A. No resumable session.
7. **long_process** — N/A. Commands completed in seconds.
8. **timing_test** — N/A. No timing assertion.
9. **generated_artifact** — N/A as an acceptance surface. Validate rewrote gitignored `generated/graph.json` and contracts; those were not committed or used as the lockstep oracle.
10. **interruptible_operation** — N/A. No interruptible watch/job.

(Nine named classes covered; generated-artifact called out as N/A per the task list.)

## Changed files

- `specs/model/spec-sections.sdp.md` — one Model term after `promotion`.
- `test/self-hosting-oracle/model.ts` — same definition on `spec:model.spec-sections`.
- `.omo/evidence/task-2-design-law-transfer.md` — this receipt.

Not changed: readiness line, dedicated Spec, shared rosters, `src/`.

## Cleanup receipt

- `npm ci` and `npm run build` left gitignored `node_modules/` and `dist/` in this worktree.
- Validate left gitignored `generated/` outputs.
- No temp files, no edits in the main worktree, no stash.
- Tracked dirty set is only the files listed above.

## Risks

- Shared-oracle totals are unchanged (term-only edit). Todo 8 still owns roster sync if other wave-1 todos mint nodes.
- The plan's `terms.filter` QA body does not match the live reader (`terms` is a map). Future QA should query the keyed object.
- `spec:model.spec-sections` remains on the pinned `honesty/gaps` warning list (ready, no verifier). Expected; not introduced here.
