# Task 3 implementation — enrich `spec:model.structural-patterns` to defined

Subtask: carrier enrichment only. Branch: `feature/architectural-patterns-views`.
Oracle post-state already red-locked in `task-3-oracle-red.md`; oracle not edited here.

## Scope

Owned:

- `specs/model/structural-patterns.sdp.md` — readiness `idea` → `defined`; title/outcome rewrite; `decidedBy` → MD-34; two model terms; open questions + heading removed.
- `.omo/evidence/architectural-patterns-views/task-3-implementation.md` — this file.

Not touched: oracle (`test/self-hosting-oracle/model.ts`), shared declared-relations/frozen totals, other Specs, plan/Boulder/ledger. No commit/push.

## Exact carrier diff

```diff
--- a/specs/model/structural-patterns.sdp.md
+++ b/specs/model/structural-patterns.sdp.md
@@ -2,19 +2,18 @@
 id: spec:model.structural-patterns
 kind: model
 altitude: feature
-readiness: idea
+readiness: defined
 relations:
   refines: spec:model.anchors
+  decidedBy: spec:decisions.architectural-significance-rides-primitives
 ---
-# Structural anchors can express architecturally significant patterns
+# Architecturally significant patterns dissolve into existing primitives

 ## Intent

-- outcome: Architecturally significant patterns and relationships in bound code are expressible through anchor structure so the graph answers architecture questions beyond component membership and uses edges.
-
-### Open questions
-
-- [blocking] Does a vocabulary beyond `component` and `uses` pass the ADR three-part test at all, and which carrier would hold it without promoting mechanical structure into curated intent — new anchor fields, `component:` namespace conventions, or relations on Specs?
-- [blocking] "Pattern" is not a ratified term in the language base; the concept needs a ratified name and a boundary against the anchor law's identity-only contract before any field is designed.
+- outcome: Patterns and their relationships are authored as decision/model-kind Specs, existing relations, and the satisfies→decidedBy join — no new vocabulary is needed beyond the structural anchors already in the graph.

 ## Model
+
+- **architecturally significant unit** — a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding.
+- **pattern** — not a ratified term — a named coordinate carried by decision/model-kind Specs and their decidedBy edges.
```

Id/kind preserved. No `ready` claim. No invented content beyond the plan's exact title, outcome, terms, and `decidedBy`.

## Automated gates

### Validate

Command: `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`

Result: exit 0 — `0 errors · 5 warnings` (pre-existing honesty/gaps on five ready Specs without verifiers; none involve this Spec).

### Focused model-family descriptor test

Command: `npx vitest run test/self-hosting-graph.test.ts -t "carries the authored descriptors of the model family"`

Result: green — `1 passed | 25 skipped` (exit 0). Oracle expectation matched; carrier no longer diverges.

### Format

`npx prettier --check specs/model/structural-patterns.sdp.md` — clean (exit 0).

### Full self-hosting graph suite (one run, classify only)

Command: `npx vitest run test/self-hosting-graph.test.ts`

Result: `7 failed | 19 passed` (26). Failures classified as **task-15-owned shared roster / frozen-total** (plus sibling-lane anchors already on the branch), not carrier-content defects:

| Failure | Delta vs frozen oracle | Owner |
| --- | --- | --- |
| holds the frozen corpus totals | specs 161→162, anchors 157→159 | task 15 (+ task 2 decision Spec; sibling anchors) |
| rosters exactly the authored Spec, Pack, and anchor node ids | +`impl:protocol.discover-files`, +`impl:protocol.protocol-bindings` (and Spec id already present) | task 15 / sibling lanes |
| derives exactly the authored declared relations | +MD-34 `dependsOn`×2 + `refines`; **+this task's** `structural-patterns decidedBy MD-34` | task 15 (declared-relations roster) |
| holds the frozen stated-readiness distribution | idea 6→5, defined 9→10, ready 145→146 | task 15 (this task idea→defined; task 2 ready decision) |
| derives one binding edge per authored anchor | +discover-files, +protocol-bindings satisfies | task 15 / sibling lanes |
| gives every owned impl/api CodeNode exactly one component | +memberOf for those impls | task 15 / sibling lanes |
| projects every anchor and code node at the line its declaration occupies | +two new CodeNode projections | task 15 / sibling lanes |

No failure names a content mismatch on `spec:model.structural-patterns` itself. Focused model-family case is among the 19 passed. Only task-15 shared roster/frozen-total changes would clear the 7; this lane must not edit them.

## Manual QA (exact channel)

Body (fixed): look up `spec:model.structural-patterns`; require stated readiness `defined`, non-empty model terms, empty open questions, empty floorFailures, and exactly one resolved declared `decidedBy` targeting `spec:decisions.architectural-significance-rides-primitives`; otherwise throw `structural-patterns not defined under MD-34`.

Command: `pnpm --silent sdp:q --json '<body>'`

Result: exit 0 — PASS.

```json
{
  "id": "spec:model.structural-patterns",
  "title": "Architecturally significant patterns dissolve into existing primitives",
  "outcome": "Patterns and their relationships are authored as decision/model-kind Specs, existing relations, and the satisfies→decidedBy join — no new vocabulary is needed beyond the structural anchors already in the graph.",
  "statedReadiness": "defined",
  "floorFailures": [],
  "modelTerms": {
    "architecturally significant unit": "a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding.",
    "pattern": "not a ratified term — a named coordinate carried by decision/model-kind Specs and their decidedBy edges."
  },
  "openQuestions": [],
  "decidedBy": [
    {
      "type": "decidedBy",
      "claim": "declared",
      "otherId": "spec:decisions.architectural-significance-rides-primitives",
      "resolved": true,
      "otherNodeType": "Primitive",
      "otherTitle": "Architectural significance rides existing primitives"
    }
  ]
}
```

PASS criteria met: exact planned title/outcome/terms, `defined`, `floorFailures` empty, no open questions, one resolved declared `decidedBy`.

Note: `derivedReadiness` is `ready` (floor clears the higher rung) while stated remains `defined` — intentional; this task does not claim ready.

## Recipes 1 / 2 (after change, verbatim catalog bodies)

Recipe 1 (build backlog):

```
{
  total: 0,
  byFamily: {},
  excludedReadyExamples: 66,
  excludedReadyDecisions: 34,
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

Identical to the task-3 oracle-red baseline (this Spec is not implemented, so the idea→defined move does not enter either recipe).

## Dirty-worktree inventory (this subtask)

Pre-existing (not owned here):

- `M .omo/boulder.json`
- `M .omo/plans/architectural-patterns-views.md`
- `M .omo/start-work/ledger.jsonl`
- `M test/self-hosting-oracle/model.ts` (task-3 oracle-red)
- evidence files from prior tasks under `.omo/evidence/architectural-patterns-views/`

This subtask added/changed:

- `M specs/model/structural-patterns.sdp.md`
- `?? .omo/evidence/architectural-patterns-views/task-3-implementation.md`

No other paths touched by this lane.

## Adversarial (UltraQA)

- **stale_state**: PASS. Live `sdp:q` derives the graph in-process each call; Manual QA and recipes re-run after the carrier write. No cached graph consulted as authority.
- **dirty_worktree**: PASS. Inventory above; only in-scope carrier + this evidence file added to the pre-existing dirty set. No plan/Boulder/ledger/oracle/shared-roster edits.
- **generated_or_cached_artifacts**: PASS. Manual QA / recipes used live `pnpm --silent sdp:q`. Validate wrote `generated/graph.json` and contracts as its normal side effect; those are not the read model for claims. No reliance on pre-edit generated bytes.
- **flaky_tests**: PASS. Focused model-family: one deterministic green (1 passed / 25 skipped). Full suite: one run only, failures classified, no rerun chase.
- **misleading_success_output**: PASS. Manual QA returns the exact planned fields and exit 0 only when all PASS predicates hold. Validate reports 0 errors. Focused test names the model-family descriptor case.
- **race_condition**: N/A — no concurrent writers owned by this lane; sibling dirty paths inventoried and left alone.
- **time_dependent**: N/A — no clocks or sleeps.
- **environment_dependent**: N/A — local extractor over this checkout.
- **network**: N/A — no network calls.
- **incomplete_cleanup**: PASS — see cleanup receipt.
- **wrong_file / scope_creep**: PASS — diffs limited to the structural-patterns carrier + this evidence file.
- **silent_catch**: N/A — no error-handling code added.
- **oracle_weakened**: PASS — `test/self-hosting-oracle/model.ts` not edited; focused test green against the pre-existing red oracle.

## Cleanup receipt

- Background jobs: none.
- Temp files created by this subtask: none.
- No commit, no push (landing serialized after independent verification; sibling lanes share one normal checkout).

## Completion condition

- Carrier exact planned state: yes.
- Focused model-family test green 1/25 skipped: yes.
- Validate exit 0: yes.
- Live query PASS (defined, empty floorFailures, no open questions, one resolved declared decidedBy): yes.
- Full suite failures only task-15 deferrals (+ sibling-lane roster noise): yes.
- Evidence exists: yes.
- Scoped diff only: yes.
- No commit: yes.
