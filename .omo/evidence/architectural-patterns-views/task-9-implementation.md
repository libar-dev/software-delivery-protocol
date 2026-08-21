# Task 9 implementation — enrich `spec:protocol.structural-self-binding` to defined

Subtask: carrier enrichment only. Branch: `feature/architectural-patterns-views`.
HEAD at capture: `cb8b3d19373c950e1b3cf02091f0634a4ae4b846`.
Captured: `2026-08-21T02:57:00Z`.
Oracle post-state already red-locked in `task-9-oracle-red.md`; oracle not edited here.

## Scope

Owned:

- `specs/protocol/structural-self-binding.sdp.md` — readiness `idea` → `defined`; `decidedBy` → MD-34; two planned behavior rules; criterion open question + heading removed.
- `.omo/evidence/architectural-patterns-views/task-9-implementation.md` — this file.

Not touched: oracle (`test/self-hosting-oracle/protocol.ts` remains the red-locked expectation from the oracle-red subtask), shared declared-relations/frozen totals/rosters/state, other Specs, plan/Boulder/ledger. No commit/push.

## Exact carrier diff

```diff
--- a/specs/protocol/structural-self-binding.sdp.md
+++ b/specs/protocol/structural-self-binding.sdp.md
@@ -2,20 +2,18 @@
 id: spec:protocol.structural-self-binding
 kind: behavior
 altitude: story
-readiness: idea
+readiness: defined
 relations:
   refines: spec:protocol.self-hosting
+  decidedBy: spec:decisions.architectural-significance-rides-primitives
 ---
 # The engine's structural self-binding covers its architecturally significant units

 ## Intent

 - outcome: Every architecturally significant engine unit carries component membership and uses declarations so structural recipes and the census answer architecture questions about the engine itself.

-### Open questions
-
-- [blocking] Which anchors outside the current component memberships are architecturally significant, and by what criterion — public surface, cross-component reach, or another boundary the owner ratifies?
-
 ## Behavior

-- rule: Structural edges stay identity-only under the structural anchor semantics ruling; wider coverage confers no intent, delivery fact, or readiness effect.
+- rule: The significance criterion for engine self-binding is exported public surface plus cross-component reach.
+- rule: Every architecturally significant unit carries component membership; it also carries uses declarations for each component it architecturally depends on, so structural recipes answer dependency questions about the engine itself.
```

Product hash: `git hash-object specs/protocol/structural-self-binding.sdp.md` → `922310b316d9059418641eba2e208f8826cfd975`.

`git diff --stat -- specs/protocol/structural-self-binding.sdp.md`: `1 file changed, 4 insertions(+), 6 deletions(-)`.

Id/kind preserved. No `ready` claim. No invented content beyond the plan's exact two rules and `decidedBy`.

## Automated gates

### Validate

Command: `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`

Result: exit 0 — `0 errors · 5 warnings` (pre-existing honesty/gaps on five ready Specs without verifiers; none involve this Spec).

### Focused protocol-family descriptor test

Command: `npx vitest run test/self-hosting-graph.test.ts -t "carries the authored descriptors of the protocol family"`

Result: green — `1 passed | 25 skipped` (exit 0). Oracle expectation matched; carrier no longer diverges on readiness/rules/openQuestions.

### Format / whitespace

- `npx prettier --check specs/protocol/structural-self-binding.sdp.md` — clean (exit 0).
- `git diff --check -- specs/protocol/structural-self-binding.sdp.md` — clean (exit 0).

### Full self-hosting graph suite (one run, classify only)

Command: `npx vitest run test/self-hosting-graph.test.ts`

Result: `9 failed | 17 passed` (26). Failures classified as **task-15-owned shared roster / frozen-total** (plus sibling-lane anchors/components already on the branch), not carrier-content defects on this Spec:

| Failure | Delta vs frozen oracle (representative) | Owner |
| --- | --- | --- |
| holds the frozen corpus totals | specs 161→162, anchors 157→172 | task 15 (+ task 2 decision Spec; sibling anchors) |
| rosters exactly the authored Spec, Pack, and anchor node ids | +import/testing components and many impl anchors | task 15 / sibling lanes |
| derives exactly the authored declared relations | +MD-34 edges; **+this task's** `structural-self-binding decidedBy MD-34`; +task-3 structural-patterns decidedBy; other sibling decidedBy/dependsOn fills | task 15 (declared-relations roster) |
| holds the frozen stated-readiness distribution | idea 6→4, defined 9→11, ready 145→146 | task 15 (this task + task 3 idea→defined; task 2 ready decision) |
| derives one binding edge per authored anchor | +many sibling satisfies edges | task 15 / sibling lanes |
| rosters exactly the accepted component set | +`component:protocol.import`, +`component:protocol.testing` | task 15 (MD-34 consequence) |
| gives every owned impl/api CodeNode exactly one component | membership deltas for newly anchored units | task 15 / sibling lanes |
| derives exactly the sparse authored component uses edges | +uses involving import/testing and other new memberships | task 15 / sibling lanes |
| projects every anchor and code node at the line its declaration occupies | +new CodeNode projections | task 15 / sibling lanes |

No failure names a content mismatch on `spec:protocol.structural-self-binding` itself. Focused protocol-family case is among the 17 passed. Only task-15 shared roster/frozen-total changes would clear the 9; this lane must not edit them.

## Manual QA (exact channel)

Body (fixed): look up `spec:protocol.structural-self-binding`; require stated readiness `defined`, floorFailures empty, open questions empty, behavior rules exactly the two planned strings, and exactly one resolved declared `decidedBy` targeting `spec:decisions.architectural-significance-rides-primitives`; otherwise throw `structural-self-binding not defined under MD-34`.

Command: `pnpm --silent sdp:q --json '<body>'`

Result: exit 0 — PASS.

```json
{
  "id": "spec:protocol.structural-self-binding",
  "title": "The engine's structural self-binding covers its architecturally significant units",
  "outcome": "Every architecturally significant engine unit carries component membership and uses declarations so structural recipes and the census answer architecture questions about the engine itself.",
  "statedReadiness": "defined",
  "derivedReadiness": "ready",
  "floorFailures": [],
  "openQuestions": [],
  "rules": [
    "The significance criterion for engine self-binding is exported public surface plus cross-component reach.",
    "Every architecturally significant unit carries component membership; it also carries uses declarations for each component it architecturally depends on, so structural recipes answer dependency questions about the engine itself."
  ],
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

PASS criteria met: `defined`, `floorFailures` empty, exact two rules, no open questions, one resolved declared `decidedBy`.

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

Unchanged from task-9 oracle-red baseline (this Spec was already outside the operational backlog as idea; promoting it to defined without implementation still keeps it out of recipe 1's ready∧¬implemented operational slice because it is not ready).

## Adversarial (UltraQA)

- **stale_state**: PASS. Live `sdp:q` re-derived the graph after the carrier edit; Manual QA and focused test both read the working-tree carrier, not a cached blob. Recipe 1/2 re-run post-edit.
- **dirty_worktree**: PASS for this slice's product files. Owned: `M specs/protocol/structural-self-binding.sdp.md` and this evidence file (new). Oracle was already dirty from the oracle-red subtask and was not edited here. Sibling dirty/untracked paths from parallel todos were not edited. No commit.
- **generated_or_cached_artifacts**: PASS. Validate wrote `generated/graph.json` and contracts as its normal side effect; Manual QA used live `pnpm --silent sdp:q` (in-process derive), not the generated artifact as authority. No hand-edit of generated output.
- **flaky_tests**: PASS. Focused protocol-family once green (1/1). Full suite once, 9 failed / 17 passed — failures are deterministic roster/total deltas, not intermittent.
- **misleading_success_output**: PASS. Focused green means protocol-family descriptor match only. Validate 0 means no graph errors. Full-suite failures remain and are classified as task-15; not claimed green.
- **race_condition**: N/A — no concurrent writers owned by this slice.
- **time_dependent**: N/A — no clocks/sleeps.
- **environment_dependent**: N/A — local extractor over this checkout.
- **network**: N/A — no network calls.
- **incomplete_cleanup**: PASS — see cleanup receipt.
- **wrong_file / scope_creep**: PASS — only the carrier + this evidence file written by this slice. Oracle/shared rosters/totals/state untouched.
- **silent_catch**: N/A — no error-handling code added.

## Cleanup receipt

- Background jobs: none.
- Temp files: `/tmp/recipe1.js`, `/tmp/recipe2.js` (recipe body extracts for one-shot recipe runs) — discarded after use; not in the repo.
- Generated artifacts: validate's normal `generated/` rewrite only; no extra overlay.
- No commit, no push.

## Completion gates for this implementation slice

- readiness idea → defined: **yes**.
- decidedBy → `spec:decisions.architectural-significance-rides-primitives`: **yes** (resolved).
- Behavior exactly the two planned rules: **yes**.
- Criterion open question + empty Open questions heading removed: **yes**.
- id/kind preserved; no ready claim: **yes**.
- validate exit 0: **yes**.
- focused protocol-family descriptor test green: **yes**.
- prettier + diff --check clean: **yes**.
- Manual QA live specContext PASS (defined, floorFailures empty, exact two rules, no OQ, one resolved decidedBy): **yes**.
- Full graph suite once; failures only task-15 roster/totals (+ sibling-lane anchors): **yes**.
- Oracle not weakened: **yes**.
- Evidence file exists: **yes**.
- No commit/push: **yes**.
