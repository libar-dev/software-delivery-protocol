# Task 3 oracle-first red proof

Subtask: characterization + oracle post-state expectation for
`spec:model.structural-patterns` before any carrier edit. Branch:
`feature/architectural-patterns-views`.

## Baseline characterization (unchanged carrier/oracle)

### Graph capture (live `sdp:q --json`)

`spec:model.structural-patterns` at HEAD before oracle edit:

| Field | Value |
| --- | --- |
| title | Structural anchors can express architecturally significant patterns |
| outcome | Architecturally significant patterns and relationships in bound code are expressible through anchor structure so the graph answers architecture questions beyond component membership and uses edges. |
| statedReadiness | idea |
| floorReached | idea |
| unmetFloorClauses | [] |
| openQuestions | 2 blocking (vocabulary beyond component/uses; "pattern" not ratified) |
| sections | intent, model |
| model | `{}` (empty terms) |
| relationsOut | `refines` → `spec:model.anchors` (resolved) |
| relationsIn | [] |
| deliveryFacts | [] |

Task-2 decision present and ready:

| Field | Value |
| --- | --- |
| id | `spec:decisions.architectural-significance-rides-primitives` |
| readiness | ready |
| floorReached | ready |
| relationsOut | `dependsOn` → binding-not-liveness; `dependsOn` → structural-anchor-semantics; `refines` → model.anchors |
| relationsIn | [] (no decidedBy from structural-patterns yet — carrier not edited) |

### Recipe 1 / recipe 2 (verbatim catalog bodies via `pnpm --silent sdp:q`)

Recipe 1 (build backlog), before and after oracle edits — identical:

```
{
  total: 0,
  byFamily: {},
  excludedReadyExamples: 66,
  excludedReadyDecisions: 34,
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

(`excludedReadyDecisions: 34` includes the ready MD-34 decision from task 2.)

### Focused model-family test (baseline green)

Command: `npx vitest run test/self-hosting-graph.test.ts -t "carries the authored descriptors of the model family"`

Result: green (1 passed | 25 skipped). Known task-15 shared-roster deferrals do not touch this family descriptor assertion.

## Failing Manual-QA (live `sdp q`, carrier unchanged)

Body (fixed): look up `spec:model.structural-patterns`; throw
`structural-patterns not defined under MD-34` unless stated readiness is
`defined`, model terms are non-empty, open questions are empty, and a resolved
`decidedBy` targets `spec:decisions.architectural-significance-rides-primitives`;
otherwise return `{ id, title, statedReadiness, termKeys, openQuestions, decidedBy }`.

Command: `pnpm --silent sdp:q --json '<body>'`

Result (before oracle edit; repeated after oracle edit — carrier still idea):

```
sdp q: structural-patterns not defined under MD-34
```

Exit code: `1`

Exact sentinel: `structural-patterns not defined under MD-34`

## Changed files (this subtask)

- `test/self-hosting-oracle/model.ts` — only the
  `spec:model.structural-patterns` per-Spec descriptor updated to the planned
  post-task state. Declared relations stay out of this module (`ExpectedSpec`
  has no relations field; shared roster is task 15).
- `.omo/evidence/architectural-patterns-views/task-3-oracle-red.md` — this file.

No Spec carrier, shared rosters, frozen totals, plan, Boulder, or ledger edits.

## Exact oracle diff (`test/self-hosting-oracle/model.ts`)

```diff
@@ -388,28 +388,23 @@ export const modelSpecs = [
     id: "spec:model.structural-patterns",
     specKind: "model",
     altitude: "feature",
-    readiness: "idea",
+    readiness: "defined",
     file: "specs/model/structural-patterns.sdp.md",
-    title: "Structural anchors can express architecturally significant patterns",
+    title: "Architecturally significant patterns dissolve into existing primitives",
     narrative: null,
     sections: {
       intent: {
         outcome:
-          "Architecturally significant patterns and relationships in bound code are expressible through anchor structure so the graph answers architecture questions beyond component membership and uses edges.",
-        openQuestions: [
-          {
-            question:
-              "Does a vocabulary beyond `component` and `uses` pass the ADR three-part test at all, and which carrier would hold it without promoting mechanical structure into curated intent — new anchor fields, `component:` namespace conventions, or relations on Specs?",
-            blocking: true,
-          },
-          {
-            question:
-              '"Pattern" is not a ratified term in the language base; the concept needs a ratified name and a boundary against the anchor law\'s identity-only contract before any field is designed.',
-            blocking: true,
-          },
-        ],
+          "Patterns and their relationships are authored as decision/model-kind Specs, existing relations, and the satisfies→decidedBy join — no new vocabulary is needed beyond the structural anchors already in the graph.",
+      },
+      model: {
+        terms: {
+          "architecturally significant unit":
+            "a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding.",
+          pattern:
+            "not a ratified term — a named coordinate carried by decision/model-kind Specs and their decidedBy edges.",
+        },
       },
-      model: {},
     },
     deliveryFacts: [],
   },
```

## Exact red test failure

Command (one run after oracle edit):
`npx vitest run test/self-hosting-graph.test.ts -t "carries the authored descriptors of the model family"`

Result: red for carrier mismatch only.

```
Test Files  1 failed (1)
     Tests  1 failed | 25 skipped (26)
```

Failure: `carries the authored descriptors of the model family` —
live descriptor still has readiness `idea`, old title, old outcome, two blocking
`openQuestions`, and empty `model: {}`; oracle expects readiness `defined`, new
title/outcome, no open questions, and the two planned model terms.

No TypeScript, syntax, or formatting failures. No frozen-total / roster / pack
failures (this focused filter skips those cases).

## Diagnostics / format / type

- `npx prettier --check test/self-hosting-oracle/model.ts` — clean (write was a no-op).
- `npx eslint test/self-hosting-oracle/model.ts` — clean (exit 0).
- `npx tsc --noEmit -p tsconfig.json` — clean (exit 0).

## Dirty-worktree inventory

Before this subtask:

- `M .omo/boulder.json`
- `M .omo/plans/architectural-patterns-views.md`
- `M .omo/start-work/ledger.jsonl`
- `?? .omo/evidence/architectural-patterns-views/task-1-normal-branch.md`

(Task-2 evidence files already present on disk from prior work; not newly
introduced here.)

After this subtask: those paths unchanged, plus:

- `M test/self-hosting-oracle/model.ts`
- `?? .omo/evidence/architectural-patterns-views/task-3-oracle-red.md`

No other paths touched. Carrier `specs/model/structural-patterns.sdp.md`
untouched.

## Adversarial (UltraQA)

- **stale_state**: PASS. Recipes 1 and 2 re-run after oracle edit matched the
  pre-edit outputs. Live Manual-QA still throws the same sentinel. Graph is
  derived in-process each invocation; no cached graph artifact was consulted.
- **dirty_worktree**: PASS. Inventory above; only in-scope oracle + this
  evidence file added to the pre-existing dirty set. No plan/Boulder/ledger
  edits by this subtask.
- **generated_or_cached_artifacts**: PASS. Manual-QA used live
  `pnpm --silent sdp:q`; no generated graph artifact was read or written.
  `dist/` pre-existed and was not regenerated.
- **flaky_tests**: PASS. One deterministic baseline green (1/1 focused), then
  one deterministic red (1 failed / 25 skipped) after the oracle edit. No
  reruns to chase green or red.
- **misleading_success_output**: PASS. Live query prints the exact sentinel
  `structural-patterns not defined under MD-34` and exits 1. Test mismatch
  names the structural-patterns title/outcome/readiness/openQuestions/terms
  divergence only.
- **race_condition**: N/A — no concurrent writers or shared mutable runtime.
- **time_dependent**: N/A — no clocks, sleeps, or wall-clock assertions.
- **environment_dependent**: N/A — local extractor over this checkout only.
- **network**: N/A — no network calls.
- **incomplete_cleanup**: N/A — no temp files or background processes started.
- **wrong_file / scope_creep**: N/A — diffs limited to the model-family oracle
  descriptor plus this evidence file.
- **silent_catch**: N/A — no error-handling code added.

## Cleanup receipt

- Background jobs: none (`jobs` empty).
- Temp files created by this subtask: none.
- Generated artifacts created by this subtask: none.
- No commit, no push.

## Completion condition

- Baseline focused test green: yes (model family 1/1).
- Desired live scenario red with exact sentinel
  `structural-patterns not defined under MD-34`: yes.
- Oracle post-state expectation added for
  `spec:model.structural-patterns`: yes (title, outcome, readiness `defined`,
  model terms, open questions removed; decidedBy not represented here).
- Focused test red only for carrier mismatch: yes.
- TS diagnostics/format/type clean: yes.
- No out-of-scope edit: yes.
- Evidence file exists: yes.
