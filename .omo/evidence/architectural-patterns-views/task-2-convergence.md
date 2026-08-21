# Task 2 convergence (QA + landing)

Executor: combined QA/landing. Branch: `feature/architectural-patterns-views`.
Did not edit product files, task-1 evidence, plan, Boulder, ledger, shared
rosters, or frozen totals. Did not push.

## Scope match against plan todo 2

Inspected the complete scoped product diff. Exact match:

- Carrier `specs/decisions/architectural-significance-rides-primitives.sdp.md`
  (`git hash-object` `8556489d025e449b482420fa23cd179a8d4e2079`): envelope
  `id`/`kind`/`altitude`/`readiness: ready`, `refines: spec:model.anchors`,
  `dependsOn` the two plan ids, title/Intent/Decision prose copied from the
  plan. No `supersedes`. No authored `belongsTo`.
- MD-34 row appended after MD-33 in `docs/concept/DECISIONS.md`, verbatim plan
  text (name-first, `durable`, gloss, Spec pointer).
- Pack membership: one append of
  `spec:decisions.architectural-significance-rides-primitives` after
  `spec:decisions.planning-truths-placement` in `specs/self-hosting.pack.sdp.md`.
- Per-Spec oracle descriptor in `test/self-hosting-oracle/decisions.ts` (full
  `ExpectedSpec`, readiness `ready`, intent + decision sections).
- Pack-member id append in `test/self-hosting-oracle/pack-members.ts`.

Oracle-first red proof in `task-2-oracle-red.md` left intact: 26/26 green
before oracle edits; five precise red mismatches afterward. Not re-run as a
red proof.

## Combined automated gates

### validate

Command:

```
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Exit 0. Counts: `162 specs · 1 packs · 157 anchors → 320 nodes · 679 edges
(0 errors, 0 warnings)`. Exactly five standing `honesty/gaps` warnings, none
naming the new decision:

- `spec:carrier.markdown-authoring`
- `spec:extraction.claim-taxonomy`
- `spec:model.pack-aggregate`
- `spec:model.relations`
- `spec:model.spec-sections`

Closing line: `validate: 0 errors · 5 warnings (conformance + honesty over the one graph)`.

### tsc

Command: `npx tsc --noEmit -p tsconfig.json`

Exit 0. Empty stdout.

### prettier / whitespace

Command:

```
npx prettier --check specs/decisions/architectural-significance-rides-primitives.sdp.md docs/concept/DECISIONS.md specs/self-hosting.pack.sdp.md test/self-hosting-oracle/decisions.ts test/self-hosting-oracle/pack-members.ts
git diff --check -- specs/decisions/architectural-significance-rides-primitives.sdp.md docs/concept/DECISIONS.md specs/self-hosting.pack.sdp.md test/self-hosting-oracle/decisions.ts test/self-hosting-oracle/pack-members.ts
```

Prettier exit 0: `All matched files use Prettier code style!`
`git diff --check` exit 0, empty stdout.

### full graph suite (one run)

Command: `npx vitest run test/self-hosting-graph.test.ts`

```
Test Files  1 failed (1)
     Tests  3 failed | 23 passed (26)
  Duration  2.67s
```

Descriptor, family-id, pack membership/`belongsTo`, syntax, and node-roster
assertions passed. The three failures are frozen/shared-roster literals owned
by task 15 (this task must not edit those files):

1. `holds the frozen corpus totals` — first assertion:
   `result.counts` received `{ specs: 162, packs: 1, anchors: 157 }` vs frozen
   `{ specs: 161, packs: 1, anchors: 157 }`. Later pins in the same test did
   not run. They are also task-15: `expectedSpecs`/`expectedPackMembers` now
   length 162 vs frozen 161; live nodes 320 vs frozen 319; live edges 679 vs
   frozen 675 (same counts validate printed).
2. `derives exactly the authored declared relations` — live `Array(282)` vs
   expected `Array(279)`. The three extra declared edges are exactly:
   - `spec:decisions.architectural-significance-rides-primitives` `dependsOn`
     `spec:decisions.binding-not-liveness`
   - `spec:decisions.architectural-significance-rides-primitives` `dependsOn`
     `spec:decisions.structural-anchor-semantics`
   - `spec:decisions.architectural-significance-rides-primitives` `refines`
     `spec:model.anchors`
   Shared roster `test/self-hosting-oracle/declared-relations.ts` is task 15.
3. `holds the frozen stated-readiness distribution` — live `ready: 146` vs
   frozen `ready: 145` (`defined: 9`, `idea: 6`, `scoped: 1` unchanged). The
   histogram literal lives in `test/self-hosting-graph.test.ts` (task 15).

Exact deferred task-15 mismatch (primary frozen Spec-total literal):
`expected { specs: 161, packs: 1, anchors: 157 }`, received
`{ specs: 162, packs: 1, anchors: 157 }`.

### focused filters (independent, one run each)

Commands and counts:

```
npx vitest run test/self-hosting-graph.test.ts -t "carries the authored descriptors of the decisions family"
Test Files  1 passed (1)
     Tests  1 passed | 25 skipped (26)
Duration  2.56s
exit 0

npx vitest run test/self-hosting-graph.test.ts -t "derives the Pack membership edges from the manifest, in manifest order"
Test Files  1 passed (1)
     Tests  1 passed | 25 skipped (26)
Duration  2.54s
exit 0
```

## Manual QA (live `sdp:q --json`)

Exact channel: `pnpm --silent sdp:q '<body>' --json`

Body: look up `spec:decisions.architectural-significance-rides-primitives`;
return `id`, `readiness` (`statedReadiness`), `relationsOut` as
`{ type, other, claim, resolved }`, and all `belongsTo` edges for that id.

Exact JSON:

```
{
  "id": "spec:decisions.architectural-significance-rides-primitives",
  "readiness": "ready",
  "relations": [
    {
      "type": "dependsOn",
      "other": "spec:decisions.binding-not-liveness",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "dependsOn",
      "other": "spec:decisions.structural-anchor-semantics",
      "claim": "declared",
      "resolved": true
    },
    {
      "type": "refines",
      "other": "spec:model.anchors",
      "claim": "declared",
      "resolved": true
    }
  ],
  "belongsTo": [
    {
      "from": "spec:decisions.architectural-significance-rides-primitives",
      "to": "pack:self-hosting-v1",
      "type": "belongsTo",
      "claim": "declared"
    }
  ]
}
```

**PASS.** Readiness `ready`; exactly three resolved declared relations; exactly
one declared `belongsTo` edge to `pack:self-hosting-v1`.

### Recipe 1 / recipe 2 (verbatim catalog bodies)

Recipe 1:

```
{
  "total": 0,
  "byFamily": {},
  "excludedReadyExamples": 66,
  "excludedReadyDecisions": 34,
  "excludedWithoutVerifier": []
}
```

`excludedReadyDecisions` 34 is the new ready decision (33 → 34 in
`task-2-carrier.md`).

Recipe 2:

```
{
  "total": 3,
  "alarms": [
    { "id": "spec:consumers.projections-model", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 2 },
    { "id": "spec:extraction.regenerability", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 1 },
    { "id": "spec:model.core-model", "statedReadiness": "defined", "floorReached": "ready", "firstUnmetClause": null, "implementationBindings": 3 }
  ]
}
```

Unchanged from the oracle-red / carrier / registry / pack evidence.

## Scope / staging allowlist

Product (5):

- `specs/decisions/architectural-significance-rides-primitives.sdp.md`
- `docs/concept/DECISIONS.md`
- `specs/self-hosting.pack.sdp.md`
- `test/self-hosting-oracle/decisions.ts`
- `test/self-hosting-oracle/pack-members.ts`

Task-2 evidence (5):

- `.omo/evidence/architectural-patterns-views/task-2-oracle-red.md`
- `.omo/evidence/architectural-patterns-views/task-2-carrier.md`
- `.omo/evidence/architectural-patterns-views/task-2-registry.md`
- `.omo/evidence/architectural-patterns-views/task-2-pack.md`
- `.omo/evidence/architectural-patterns-views/task-2-convergence.md`

Must not stage (preserved dirt):

- `.omo/boulder.json`
- `.omo/plans/architectural-patterns-views.md`
- `.omo/start-work/ledger.jsonl`
- `.omo/evidence/architectural-patterns-views/task-1-normal-branch.md`

## Adversarial (UltraQA)

- **stale_state**: PASS. Fresh validate after the first run: same 162/1/157 →
  320/679, 0 errors, same five `honesty/gaps` warnings, exit 0. Fresh
  `sdp:q --json` returned `readiness: "ready"`, `relationCount: 3`,
  `allResolved: true`, `belongsToCount: 1`, `belongsToTarget:
  "pack:self-hosting-v1"`, `belongsToClaim: "declared"`. Graph is derived
  in-process each invocation.
- **dirty_worktree**: PASS. Inventory at convergence start:
  `M .omo/boulder.json`, `M .omo/plans/architectural-patterns-views.md`,
  `M .omo/start-work/ledger.jsonl`, `M docs/concept/DECISIONS.md`,
  `M specs/self-hosting.pack.sdp.md`, `M test/self-hosting-oracle/decisions.ts`,
  `M test/self-hosting-oracle/pack-members.ts`,
  `?? .omo/evidence/architectural-patterns-views/`,
  `?? specs/decisions/architectural-significance-rides-primitives.sdp.md`.
  Staging uses explicit allowlisted paths only (not the evidence directory).
- **generated_or_cached_artifacts**: PASS. Manual QA used live
  `pnpm --silent sdp:q` (writes nothing). Validate wrote gitignored
  `generated/graph.json` and `generated/contracts` (`.gitignore:17`); those
  paths were not read as the graph source and are not staged.
  `belongsTo` in the query is a live derived edge.
- **flaky_tests**: PASS. Each focused `-t` filter passed in a single run
  (1 passed / 25 skipped). Full suite one run: 3 failed / 23 passed, all three
  failures identical task-15 frozen/shared-roster literals. No reruns to chase
  green or red.
- **misleading_success_output**: PASS. PASS is the Manual-QA fields
  (`readiness === "ready"`, three `resolved: true` declared relations, one
  declared `belongsTo` to `pack:self-hosting-v1`), warning classification
  (five `honesty/gaps` only), test failure identity (the three task-15
  literals named above), and staged-path allowlist — not exit codes alone.
- **repeated_interruptions**: N/A — no command was interrupted.
- **race_condition**: N/A — no concurrent writers on the ten allowlisted
  files during this convergence; no shared mutable runtime.
- **time_dependent**: N/A — no clocks, sleeps, or wall-clock assertions.
- **environment_dependent**: N/A — local extractor over this checkout only.
- **network**: N/A — no network calls.
- **incomplete_cleanup**: N/A — no temp files or background processes started
  by this executor that remain.
- **wrong_file / scope_creep**: N/A — this executor created only this evidence
  file; product diffs are the five task-2 files.
- **silent_catch**: N/A — no error-handling code added.
- **malformed_input**: N/A — no parser input synthesized.
- **prompt_injection**: N/A — no untrusted document treated as instructions
  beyond the assigned plan/task text.
- **cancel_resume**: N/A — one uninterrupted convergence.
- **hung_commands**: N/A — validate, tsc, prettier, vitest, git diff --check,
  and sdp:q all returned.

## Cleanup receipt

- Background jobs: none (`jobs` empty; no leftover `sdp`/`vitest`/`prettier`/
  `tsc` processes).
- Temp files created by this executor: none.
- Generated artifacts: only validate's gitignored sink
  (`generated/graph.json`, `generated/contracts`).
- Commit: planned as `feat(specs): rule architectural significance rides existing primitives (MD-34)`
  with the ten allowlisted paths. No push.
