# Task 9 oracle-first red proof

Subtask: characterization + oracle post-state expectation for
`spec:protocol.structural-self-binding` before any carrier edit. Branch:
`feature/architectural-patterns-views`.

## Baseline characterization (unchanged carrier/oracle)

### Graph capture (live `sdp:q --json`)

`spec:protocol.structural-self-binding` at HEAD before oracle edit:

| Field | Value |
| --- | --- |
| title | The engine's structural self-binding covers its architecturally significant units |
| outcome | Every architecturally significant engine unit carries component membership and uses declarations so structural recipes and the census answer architecture questions about the engine itself. |
| statedReadiness | idea |
| floorFailures | [] |
| openQuestions | 1 blocking (significance criterion / which anchors outside current memberships) |
| sections | intent, behavior |
| behavior.rules | 1 rule — structural edges stay identity-only under structural anchor semantics |
| relationsOut | `refines` → `spec:protocol.self-hosting` (resolved) |
| deliveryFacts | [] |

Task-2 decision present and ready:

| Field | Value |
| --- | --- |
| id | `spec:decisions.architectural-significance-rides-primitives` |
| readiness | ready |
| relationsIn | `decidedBy` from `spec:model.structural-patterns` only (no decidedBy from structural-self-binding yet — carrier not edited) |
| relationsOut | `dependsOn` → binding-not-liveness; `dependsOn` → structural-anchor-semantics; `refines` → model.anchors |

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

### Focused protocol-family test (baseline green)

Command: `npx vitest run test/self-hosting-graph.test.ts -t "carries the authored descriptors of the protocol family"`

Result: green (1 passed | 25 skipped). Known task-15 shared-roster deferrals do not touch this family descriptor assertion.

## Failing Manual-QA (live `sdp q`, carrier unchanged)

Body (fixed): look up `spec:protocol.structural-self-binding`; throw
`structural-self-binding not defined under MD-34` unless stated readiness is
`defined`, floorFailures empty, open questions empty, behavior rules exactly
match the two planned rules, and a resolved `decidedBy` targets
`spec:decisions.architectural-significance-rides-primitives`; otherwise return
the decoded coordinates.

Command: `pnpm --silent sdp:q --json '<body>'`

Result (before oracle edit; repeated after oracle edit — carrier still idea):

```
sdp q: structural-self-binding not defined under MD-34
```

Exit code: `1`

Exact sentinel: `structural-self-binding not defined under MD-34`

## Changed files (this subtask)

- `test/self-hosting-oracle/protocol.ts` — only the
  `spec:protocol.structural-self-binding` per-Spec descriptor updated to the
  planned post-task state. Declared relations stay out of this module
  (`ExpectedSpec` has no relations field; shared roster is task 15).
- `.omo/evidence/architectural-patterns-views/task-9-oracle-red.md` — this file.

No Spec carrier, shared rosters, frozen totals, plan, Boulder, or ledger edits.

## Exact oracle diff (`test/self-hosting-oracle/protocol.ts`)

```diff
@@ -27,7 +27,7 @@ export const protocolSpecs = [
     id: "spec:protocol.structural-self-binding",
     specKind: "behavior",
     altitude: "story",
-    readiness: "idea",
+    readiness: "defined",
     file: "specs/protocol/structural-self-binding.sdp.md",
     title: "The engine's structural self-binding covers its architecturally significant units",
     narrative: null,
@@ -35,17 +35,11 @@ export const protocolSpecs = [
       intent: {
         outcome:
           "Every architecturally significant engine unit carries component membership and uses declarations so structural recipes and the census answer architecture questions about the engine itself.",
-        openQuestions: [
-          {
-            question:
-              "Which anchors outside the current component memberships are architecturally significant, and by what criterion — public surface, cross-component reach, or another boundary the owner ratifies?",
-            blocking: true,
-          },
-        ],
       },
       behavior: {
         rules: [
-          "Structural edges stay identity-only under the structural anchor semantics ruling; wider coverage confers no intent, delivery fact, or readiness effect.",
+          "The significance criterion for engine self-binding is exported public surface plus cross-component reach.",
+          "Every architecturally significant unit carries component membership; it also carries uses declarations for each component it architecturally depends on, so structural recipes answer dependency questions about the engine itself.",
         ],
       },
     },
```

## Exact red test failure

Command (one run after oracle edit):
`npx vitest run test/self-hosting-graph.test.ts -t "carries the authored descriptors of the protocol family"`

Result: red for carrier mismatch only.

```
Test Files  1 failed (1)
     Tests  1 failed | 25 skipped (26)
```

Failure: `carries the authored descriptors of the protocol family` —
live descriptor still has readiness `idea`, one identity-only behavior rule,
and the blocking criterion open question; oracle expects readiness `defined`,
no open questions, and the exact two planned behavior rules.

No TypeScript, syntax, or formatting failures. No frozen-total / roster / pack
failures (this focused filter skips those cases).

## Diagnostics / format / type

- `npx prettier --check test/self-hosting-oracle/protocol.ts` — clean.
- `npx eslint test/self-hosting-oracle/protocol.ts` — clean (exit 0).
- `npx tsc --noEmit -p tsconfig.json` — clean (exit 0).

## Dirty-worktree inventory

Before this subtask (representative; concurrent siblings may have added paths):

- `M .omo/boulder.json`
- `M .omo/plans/architectural-patterns-views.md`
- `M .omo/start-work/ledger.jsonl`
- `M AGENTS.md`
- `M README.md`
- `?? .omo/evidence/architectural-patterns-views/task-1-normal-branch.md`
- `?? .omo/evidence/architectural-patterns-views/task-13-implementation.md`
- (and other pre-existing staged/unstaged sibling paths outside this scope)

After this subtask: those paths unchanged by this subtask, plus:

- `M test/self-hosting-oracle/protocol.ts`
- `?? .omo/evidence/architectural-patterns-views/task-9-oracle-red.md`

No other paths touched by this subtask. Carrier
`specs/protocol/structural-self-binding.sdp.md` untouched.

## Adversarial (UltraQA)

- **stale_state**: PASS. Recipes 1 and 2 re-run after oracle edit matched the
  pre-edit outputs. Live Manual-QA still throws the same sentinel. Graph is
  derived in-process each invocation; no cached graph artifact was consulted.
- **dirty_worktree**: PASS. Inventory above; only in-scope oracle + this
  evidence file added by this subtask. No plan/Boulder/ledger edits by this
  subtask.
- **generated_or_cached_artifacts**: PASS. Manual-QA used live
  `pnpm --silent sdp:q`; no generated graph artifact was read or written.
  `dist/` pre-existed and was not regenerated.
- **flaky_tests**: PASS. One deterministic baseline green (1/1 focused), then
  one deterministic red (1 failed / 25 skipped) after the oracle edit. No
  reruns to chase green or red.
- **misleading_success_output**: PASS. Live query prints the exact sentinel
  `structural-self-binding not defined under MD-34` and exits 1. Test mismatch
  names the structural-self-binding readiness/openQuestions/rules divergence
  only.
- **race_condition**: N/A — no concurrent writers or shared mutable runtime.
- **time_dependent**: N/A — no clocks, sleeps, or wall-clock assertions.
- **environment_dependent**: N/A — local extractor over this checkout only.
- **network**: N/A — no network calls.
- **incomplete_cleanup**: N/A — no temp files or background processes started.
- **wrong_file / scope_creep**: N/A — diffs limited to the protocol-family
  oracle descriptor plus this evidence file.
- **silent_catch**: N/A — no error-handling code added.

## Cleanup receipt

- Background jobs: none (`jobs` empty).
- Temp files created by this subtask: none.
- Generated artifacts created by this subtask: none.
- No commit, no push.

## Completion condition

- Baseline focused test green: yes (protocol family 1/1).
- Desired live scenario red with exact sentinel
  `structural-self-binding not defined under MD-34`: yes.
- Oracle post-state expectation added for
  `spec:protocol.structural-self-binding`: yes (readiness `defined`, criterion
  open question removed, exact two planned behavior rules; decidedBy not
  represented here — shared task 15).
- Focused test red only for carrier mismatch: yes.
- TS diagnostics/format/type clean: yes.
- No out-of-scope edit: yes.
- Evidence file exists: yes.
