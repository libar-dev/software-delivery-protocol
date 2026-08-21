# Task 2 pack-manifest slice

Subtask: append `spec:decisions.architectural-significance-rides-primitives` once to
the decisions list in `specs/self-hosting.pack.sdp.md`, preserving established
authored order. Branch: `feature/architectural-patterns-views`.

Did not edit the decision carrier, registry, tests, shared rosters, plan,
Boulder, ledger, or other files. Did not commit or push.

## Recipe 1 / recipe 2 (verbatim catalog bodies via `pnpm --silent sdp:q`)

Recipe 1 (build backlog):

```
{
  total: 0,
  byFamily: {},
  excludedReadyExamples: 66,
  excludedReadyDecisions: 33,
  excludedWithoutVerifier: []
}
```

Recipe 2 (drift alarm):

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

## Automated verification

Commands:

```bash
npx prettier --check specs/self-hosting.pack.sdp.md
git diff --check -- specs/self-hosting.pack.sdp.md
```

Results:

- prettier: `All matched files use Prettier code style!` (exit 0)
- `git diff --check`: empty output (exit 0)

Repository validate was **not** run: sibling carrier
`specs/decisions/architectural-significance-rides-primitives.sdp.md` is absent
(this Pack slice must not fail solely because a concurrently owned carrier has
not landed). A later convergence worker will prove the derived `belongsTo` edge.

## Manual QA (manifest decisions tail)

Exact channel: workspace `read` after the edit reported `file length (0 lines)`
for `specs/self-hosting.pack.sdp.md` (tool snapshot lag on a just-edited path).
The same tail was therefore inspected with Grep (content + line numbers) and
confirmed by `git diff -- specs/self-hosting.pack.sdp.md`.

**PASS.** The new id appears exactly once, after
`spec:decisions.planning-truths-placement`, with surrounding entries and body
prose unchanged.

Exact list tail (lines 161–168):

```
  - spec:decisions.structural-anchor-semantics
  - spec:decisions.adopted-registrars-committed
  - spec:decisions.shipped-projections-frozen
  - spec:decisions.planning-truths-placement
  - spec:decisions.architectural-significance-rides-primitives
modelRefs:
  - spec:model.protocol-domain
  - spec:model.core-model
```

Occurrence count of `spec:decisions.architectural-significance-rides-primitives`
in the manifest: 1.

H1 and framing body remain:

```
# Self-hosting

The Protocol authors and validates its own delivery model.
```

## Product diff (this slice)

`git diff -- specs/self-hosting.pack.sdp.md`:

```
@@ -162,6 +162,7 @@ specs:
   - spec:decisions.adopted-registrars-committed
   - spec:decisions.shipped-projections-frozen
   - spec:decisions.planning-truths-placement
+  - spec:decisions.architectural-significance-rides-primitives
 modelRefs:
   - spec:model.protocol-domain
   - spec:model.core-model
```

One appended list item only.

## Dependency note

- Upstream oracle red proof: `.omo/evidence/architectural-patterns-views/task-2-oracle-red.md` (not edited).
- Concurrently owned sibling Spec carrier not present at verify time; Pack membership is authored here; derived `belongsTo` is deferred to convergence.
- Concurrent dirty paths not owned by this slice: `.omo/boulder.json`, `.omo/plans/architectural-patterns-views.md`, `.omo/start-work/ledger.jsonl`, `docs/concept/DECISIONS.md`, `test/self-hosting-oracle/decisions.ts`, `test/self-hosting-oracle/pack-members.ts`, other files under `.omo/evidence/architectural-patterns-views/`.

## Adversarial (UltraQA)

- **dirty_worktree**: PASS. This slice’s product diff is the one appended list
  item in `specs/self-hosting.pack.sdp.md` shown above. Other dirty/untracked
  paths are concurrent owners (or this evidence file).
- **stale_state**: PASS. After the edit, the new id occurs once in the
  manifest (Grep line 165 only).
- **misleading_success_output**: PASS. Authored order/content inspected: prior
  decision ids through `planning-truths-placement` are unchanged; `modelRefs`
  and body prose are unchanged; prettier/diff-check success is on this file
  only, not a graph green.
- **generated_or_cached_artifacts**: deferred to convergence — this slice
  authors the source Pack manifest; no generated graph/projection was treated
  as proof of membership.
- **flaky_tests**: N/A — no tests run or added (oracle red is upstream;
  this slice does not add tests).
- **race_condition**: N/A — no concurrent writers on this Pack file; sibling
  carrier absence is recorded, not raced around.
- **time_dependent**: N/A — no clocks or wall-clock assertions.
- **environment_dependent**: N/A — local file edit and format/diff checks only.
- **network**: N/A — no network calls.
- **incomplete_cleanup**: N/A — no temp files, background processes, or
  generated resources left by this slice.
- **wrong_file / scope_creep**: N/A — only the Pack manifest (plus this
  evidence file) was written by this slice.
- **silent_catch**: N/A — no error-handling code added.

## Cleanup receipt

- Background jobs: none.
- Temp files created by this subtask: none remaining.
- Generated artifacts created by this subtask: none.
- No commit, no push.

## Completion condition

- Exact id appended once in authored order: yes.
- Format/diff checks clean: yes.
- Evidence file exists: yes (this file).
- No out-of-scope edit by this slice: yes.
- Validate not required solely because sibling carrier has not landed: recorded.
