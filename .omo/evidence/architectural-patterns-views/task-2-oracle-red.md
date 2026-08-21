# Task 2 oracle-first red proof

Subtask: add per-Spec oracle expectations for
`spec:decisions.architectural-significance-rides-primitives` before any production
carrier, docs, or pack edits. Branch: `feature/architectural-patterns-views`.

## Baseline characterization (unchanged product/oracle)

Command: `npx vitest run test/self-hosting-graph.test.ts`

Result: green.

```
Test Files  1 passed (1)
     Tests  26 passed (26)
  Duration  2.84s
```

No narrower seam exists: `test/self-hosting-graph.test.ts` is the only suite that
imports `decisionsSpecs` and `expectedPackMembers`.

## Recipe 1 / recipe 2 (verbatim catalog bodies via `pnpm --silent sdp:q`)

Recipe 1 (build backlog), before and after oracle edits — identical:

```
{
  total: 0,
  byFamily: {},
  excludedReadyExamples: 66,
  excludedReadyDecisions: 33,
  excludedWithoutVerifier: []
}
```

Recipe 2 (drift alarm), before and after oracle edits — identical:

```
{
  total: 3,
  alarms: [
    { id: 'spec:consumers.projections-model', statedReadiness: 'defined', floorReached: 'ready', firstUnmetClause: null, implementationBindings: 2 },
    { id: 'spec:extraction.regenerability', statedReadiness: 'defined', floorReached: 'ready', firstUnmetClause: null, implementationBindings: 1 },
    { id: 'spec:model.core-model', statedReadiness: 'defined', floorReached: 'ready', firstUnmetClause: null, implementationBindings: 3 }
  ]
}
```

## Failing Manual-QA (live `sdp q`, no generated graph)

Body (fixed): look up `spec:decisions.architectural-significance-rides-primitives`;
throw `missing architectural-significance decision` when absent; otherwise return
`{ id, readiness, relationCount }`.

Command: `pnpm --silent sdp:q --json '<body>'`

Result (before production carrier; repeated after oracle edits):

```
sdp q: missing architectural-significance decision
```

Exit code: `1`

Exact sentinel: `missing architectural-significance decision`

## Changed files (this subtask)

- `test/self-hosting-oracle/decisions.ts` — appended the full per-Spec descriptor
  (readiness `ready`, intent + decision sections, transcribed from the plan).
  Declared relations stay out of this module (`ExpectedSpec` has no relations
  field; shared roster is task 15).
- `test/self-hosting-oracle/pack-members.ts` — appended
  `spec:decisions.architectural-significance-rides-primitives` after
  `spec:decisions.planning-truths-placement` (authored-order append).
- `.omo/evidence/architectural-patterns-views/task-2-oracle-red.md` — this file.

No Spec carrier, pack manifest, `DECISIONS.md`, shared rosters, frozen totals,
plan, Boulder, or ledger edits.

## Exact red test failure

Command (one run after oracle edits): `npx vitest run test/self-hosting-graph.test.ts`

Result: red for missing authored facts.

```
Test Files  1 failed (1)
     Tests  5 failed | 21 passed (26)
```

Failures (all name the absent decision / pack member; frozen-total pin is the
task-15 corollary of the same oracle growth):

1. `holds the frozen corpus totals` — `expectedSpecs` length 162 vs frozen `161`
   (`result.counts.specs` still 161; live corpus unchanged).
2. `rosters exactly the authored Spec, Pack, and anchor node ids` — live node
   ids missing `spec:decisions.architectural-significance-rides-primitives`.
3. `carries the authored descriptors of the decisions family` — live decisions
   family missing the new descriptor (file
   `specs/decisions/architectural-significance-rides-primitives.sdp.md`).
4. `leaves no authored Spec outside the families` — family ids include the new
   id; primitive nodes do not.
5. `derives the Pack membership edges from the manifest, in manifest order` —
   live `belongsTo` edges missing
   `spec:decisions.architectural-significance-rides-primitives` →
   `pack:self-hosting-v1`.

No TypeScript, syntax, or formatting failures.

## Diagnostics / format / type

- LSP daemon unreachable at `daemon.sock` (proxy; not a file diagnostic).
- `npx prettier --check test/self-hosting-oracle/decisions.ts test/self-hosting-oracle/pack-members.ts` — clean after one in-scope prettier write (quote style on the new descriptor only).
- `npx eslint test/self-hosting-oracle/decisions.ts test/self-hosting-oracle/pack-members.ts` — clean.
- `npx tsc --noEmit -p tsconfig.json` — clean.

## Adversarial (UltraQA)

- **stale_state**: PASS. Recipes 1 and 2 re-run after oracle edits matched the
  pre-edit outputs exactly. Live `sdp:q` still throws the same sentinel. Graph
  is derived in-process each invocation.
- **dirty_worktree**: PASS. Before this subtask: `M .omo/boulder.json`,
  `M .omo/plans/architectural-patterns-views.md`,
  `M .omo/start-work/ledger.jsonl`,
  `?? .omo/evidence/architectural-patterns-views/task-1-normal-branch.md`.
  After: those four paths unchanged, plus the two oracle files and this
  evidence file. No other paths touched.
- **generated_or_cached_artifacts**: PASS. Manual-QA used live `pnpm --silent
  sdp:q`; no generated graph artifact was read or written. `dist/` pre-existed
  and was not regenerated.
- **flaky_tests**: PASS. One deterministic baseline green (26/26), then one
  deterministic red (5 failed / 21 passed) after oracle edits. No reruns to
  chase green or red.
- **misleading_success_output**: PASS. Live query prints the exact sentinel
  `missing architectural-significance decision` and exits 1. Test mismatches
  name `spec:decisions.architectural-significance-rides-primitives` and the
  missing pack `belongsTo` row.
- **race_condition**: N/A — no concurrent writers or shared mutable runtime.
- **time_dependent**: N/A — no clocks, sleeps, or wall-clock assertions.
- **environment_dependent**: N/A — local extractor over this checkout only.
- **network**: N/A — no network calls.
- **incomplete_cleanup**: N/A — no temp files or background processes started.
- **wrong_file / scope_creep**: N/A — diffs limited to the two oracle files
  plus this evidence file.
- **silent_catch**: N/A — no error-handling code added.

## Cleanup receipt

- Background jobs: none (`jobs` empty).
- Temp files created by this subtask: none.
- Generated artifacts created by this subtask: none.
- No commit, no push.

## Completion condition

- Baseline test green: yes (26/26).
- Target live query fails with exact absent-decision sentinel: yes.
- Two oracle files contain the new expectations: yes.
- Focused test deterministically red only because production authored facts
  are absent: yes.
- Diagnostics/format/type for edited TS clean: yes.
- Evidence file exists: yes.
