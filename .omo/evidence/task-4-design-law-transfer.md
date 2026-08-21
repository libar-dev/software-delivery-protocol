# task-4 design-law-transfer evidence

Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-4`
Branch: `design-law-transfer/todo-4`
Scope: accepted-unit roster + derived `expectedMemberOfEdges` + coarse-grain coverage in `test/self-hosting-oracle/structural-edges.ts`; census assertion and `test:protocol.structural-self-binding` specTest in `test/self-hosting-graph.test.ts`; realization-grain + census-check rules on `spec:protocol.structural-self-binding` (readiness stays `defined`); lockstep descriptor `deliveryFacts: ["has-verifier"]` in `test/self-hosting-oracle/protocol.ts`. No shared anchors roster/frozen totals, no validators/specOracle, no significance derivation, no anchors on the three marginal files.

## Baseline (before edits)

Command:

```
npx vitest run test/self-hosting-graph.test.ts
```

Result: exit `0`. `26 passed`. Worktree had no `node_modules/` or `dist/`. `npm ci` then (later) `npm run build` were local bootstrap so vitest and `sdp` existed. Not a product edit.

## Failing-first

Assertion landed first. One accepted roster row was omitted (`src/adapters/vitest.ts#bindExample` / `impl:protocol.example-runner-adapter`).

Command:

```
npx vitest run test/self-hosting-graph.test.ts -t 'covers every accepted architecturally significant unit'
```

Result: exit `1`. Message:

```
AssertionError: structural self-binding coverage failed:
src/adapters/vitest.ts impl:protocol.example-runner-adapter → component:protocol.adapters: unrostered memberOf
```

The omitted unit's file and impl id are named. The row was restored before completing the Spec amendment, descriptor, and specTest.

## Final automated verification

Command:

```
npx vitest run test/self-hosting-graph.test.ts
```

Result: exit `1`. `4 failed | 23 passed`. The new census assertion passes. The four failures are the shared anchor/totals mismatches todo 8 owns:

- `holds the frozen corpus totals` — live `anchors: 176` vs frozen `175` (and node/edge totals move with the new verifier)
- `rosters exactly the authored Spec, Pack, and anchor node ids` — extra `test:protocol.structural-self-binding`
- `derives one binding edge per authored anchor` — extra `verifies` to `spec:protocol.structural-self-binding`
- `projects every anchor and code node at the line its declaration occupies` — extra Anchor in `test/self-hosting-graph.test.ts`

Declared-relations and pack-members assertions pass (this todo adds no declared relation or pack member). Protocol-family descriptors pass, including `deliveryFacts: ["has-verifier"]`.

Command:

```
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Result: exit `0`. `162 specs · 1 packs · 176 anchors → 339 nodes · 748 edges (0 errors, 0 warnings)`. `validate: 0 errors · 5 warnings` — the pinned `honesty/gaps` set. `spec:protocol.structural-self-binding` is not among them.

Command:

```
pnpm --silent sdp:q 'return g.specContext("spec:protocol.structural-self-binding").deliveryFacts'
```

Result: exit `0`. `[ 'has-verifier' ]`.

Live context probe: `statedReadiness: "defined"`, `implementations: 0`, one resolving verifier.

## Manual QA

Mutation probe: removed the `src/adapters/vitest.ts#bindExample` roster row, ran the exact focused test.

Command:

```
npx vitest run test/self-hosting-graph.test.ts -t 'covers every accepted architecturally significant unit'
```

Result: exit `1`. Same sorted named-unit failure:

```
structural self-binding coverage failed:
src/adapters/vitest.ts impl:protocol.example-runner-adapter → component:protocol.adapters: unrostered memberOf
```

Restored the row. Same focused command: exit `0`. `1 passed | 26 skipped`.

## Adversarial classes

1. **flaky_tests** — Probed. Deterministic mutation (omit one roster row) fails once naming that unit; single clean rerun after restore passes. Same output both omit runs.
2. **stale_state** — Probed via live `sdp:q` after validate wrote the graph. `deliveryFacts` is `["has-verifier"]`; readiness remains `defined`.
3. **dirty_worktree** — `git status --short` after product edits showed only the five owned files below plus this evidence file. `git diff --check` exit `0`. `generated/`, `dist/`, `node_modules/` are gitignored.
4. **misleading_success_output** — Baseline vitest exit `0`. Failing-first and mutation vitest exit `1` with the coverage prefix. Final census assertion exit `0`. Validate exit `0` with `0 errors` (five known warnings). Live query prints `[ 'has-verifier' ]`.
5. **parser** — N/A. No parser change.
6. **external_text** — N/A. Rule text is the plan sentences, not imported external prose.
7. **resumability** — N/A. No resumable session.
8. **long_process** — N/A. Commands completed in seconds.
9. **timing_test** — N/A. No timing assertion.
10. **generated_artifact** — N/A as an acceptance surface. Validate rewrote gitignored `generated/graph.json` and contracts; those were not committed or used as the lockstep oracle.
11. **interruptible_operation** — N/A. No interruptible watch/job.

## Changed files

- `test/self-hosting-oracle/structural-edges.ts` — `acceptedArchitecturalUnits` (76 rows, same membership pairs as before); `expectedMemberOfEdges` derived; `coarseGrainCoverage` for `runValidateWatch`, `assertMarkdownEmissionFidelity`, and the four value imports from `src/import/emit-markdown.ts:4` (`importData`, `importText`, `importTexts`, `targetsForRelationType`). `structuralMembershipExceptions` and `expectedUsesEdges` unchanged.
- `test/self-hosting-oracle/index.ts` — re-exports the two new rosters.
- `test/self-hosting-graph.test.ts` — census `it` plus `specTest` `test:protocol.structural-self-binding` imported from `@libar-dev/software-delivery-protocol` so extraction binds it.
- `specs/protocol/structural-self-binding.sdp.md` — rule 2 replaced with realization-grain wording; census-check rule appended; `readiness: defined` untouched.
- `test/self-hosting-oracle/protocol.ts` — rules transcription + `deliveryFacts: ["has-verifier"]`.
- `.omo/evidence/task-4-design-law-transfer.md` — this receipt.

Not changed: `test/self-hosting-oracle/anchors.ts`, frozen totals, declared-relations, pack-members, validators, specOracle, `src/` product behavior, the three marginal files (no manufactured anchors).

## Cleanup receipt

- `npm ci` and `npm run build` left gitignored `node_modules/` and `dist/` in this worktree.
- Validate left gitignored `generated/` outputs.
- No temp files, no edits in the main worktree, no stash.
- Tracked dirty set is only the files listed above.

## Risks

- Shared-oracle anchors roster and frozen totals stay stale until todo 8 (`175` → `176` anchors; `338` → `339` nodes; `747` → `748` edges). Expected.
- `specTest` must be imported from `@libar-dev/software-delivery-protocol`, not `../src/index.js`; a relative import is not a protocol-builder binding and confers no `has-verifier`.
- Coarse-grain `data-access.ts` rows are the four value imports at `emit-markdown.ts:4`. The type-only `ImportData` import on line 5 is not rostered (not a consumed runtime symbol).
