# Task 7 — Record the promotion worklist as graph-visible backlog

Plan: `design-law-transfer` · Todo 7
Branch: `design-law-transfer/todo-7`
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-7`
Task id: `st_01a023d0`

Scope honored: exactly one `[non-blocking]` Open questions entry under Intent on each of the six planned family-parent carriers; matching per-Spec descriptors in `test/self-hosting-oracle/{validation,extraction,consumers}.ts`. No readiness line changed. No `[blocking]` flags. Shared rosters / frozen totals not touched.

## Worktree-local CLI

```
npm install   # 201 packages (node_modules absent at checkout)
npm run build
realpath dist/cli/sdp.js
→ /home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-7/dist/cli/sdp.js
```

CLI belongs to this worktree (not main, not todo-8).

## Baseline (before lane edits)

```
npm run sdp -- validate --exclude explorations --exclude examples --exclude test/fixtures/import/parity
VALIDATE_EXIT=0
164 specs · 1 packs · 177 anchors → 342 nodes · 760 edges
validate: 0 errors · 5 warnings (honesty/gaps pinned set only)
```

Live six-id query (readiness + openQuestions):

```
pnpm --silent sdp:q 'return ["spec:validation.two-check-families","spec:validation.readiness-floor","spec:extraction.example-runner","spec:extraction.executable-contracts","spec:consumers.projections-model","spec:extraction.build-pipeline"].map(id=>{const n=g.graph.nodes.find(x=>x.id===id); const ctx=g.specContext(id); return {id, readiness: ctx.statedReadiness, openQuestions: n?.sections?.intent?.openQuestions ?? null}})'
```

```
[
  { id: 'spec:validation.two-check-families', readiness: 'ready', openQuestions: null },
  { id: 'spec:validation.readiness-floor', readiness: 'ready', openQuestions: null },
  { id: 'spec:extraction.example-runner', readiness: 'ready', openQuestions: null },
  { id: 'spec:extraction.executable-contracts', readiness: 'ready', openQuestions: null },
  { id: 'spec:consumers.projections-model', readiness: 'defined', openQuestions: null },
  { id: 'spec:extraction.build-pipeline', readiness: 'ready', openQuestions: null }
]
Q_EXIT=0
```

Family descriptor tests (pre-edit):

```
npx vitest run test/self-hosting-graph.test.ts -t "validation family|extraction family|consumers family"
Test Files  1 passed (1)
Tests  3 passed | 24 skipped (27)
```

Note: `spec:consumers.projections-model` stated readiness is `defined` (not `ready`) both before and after — readiness lines were not touched. Plan acceptance wording "all six still ready" is read as "readiness unchanged / still clears its floor"; five carriers remain `ready`, projections-model remains `defined`.

## Failing-first (carriers updated, oracles not yet)

Carriers received the planned `### Open questions` / `- [non-blocking] …` entries. Oracles still lacked `openQuestions`.

```
npx vitest run test/self-hosting-graph.test.ts -t "validation family|extraction family|consumers family"
Test Files  1 failed (1)
Tests  3 failed | 24 skipped (27)
```

Expected descriptor mismatches (Received had openQuestions, Expected did not):

| Family | Spec id | Received openQuestions[0] |
| --- | --- | --- |
| validation | `spec:validation.two-check-families` | blocking:false · one-validation-path registry law… |
| validation | `spec:validation.readiness-floor` | blocking:false · remaining law in readiness-floor.ts… |
| extraction | `spec:extraction.executable-contracts` | blocking:false · concreteness-refusal… |
| extraction | `spec:extraction.example-runner` | (same pattern; family fail covers the three parents) |
| extraction | `spec:extraction.build-pipeline` | (same pattern) |
| consumers | `spec:consumers.projections-model` | blocking:false · pure-projection binding-language… |

All six questions match the plan wording byte-for-byte; all `blocking: false`.

## Oracle lockstep

Updated only the six per-Spec descriptors:

- `test/self-hosting-oracle/validation.ts` — two-check-families, readiness-floor
- `test/self-hosting-oracle/extraction.ts` — example-runner, executable-contracts, build-pipeline
- `test/self-hosting-oracle/consumers.ts` — projections-model

Shape mirrors `spec:consumers.impact-graph` (`question` + `blocking: false`).

## Final commands and results

```
npm run sdp -- validate --exclude explorations --exclude examples --exclude test/fixtures/import/parity
VALIDATE_EXIT=0
164 specs · 1 packs · 177 anchors → 342 nodes · 760 edges
validate: 0 errors · 5 warnings (same honesty/gaps set)
```

Live six-id query:

```
[
  {
    id: 'spec:validation.two-check-families',
    readiness: 'ready',
    openQuestions: [{
      question: 'Does the one-validation-path registry law stated in the src/validate/validators.ts file header promote here or to a story-altitude child under comment promotion?',
      blocking: false
    }]
  },
  {
    id: 'spec:validation.readiness-floor',
    readiness: 'ready',
    openQuestions: [{
      question: 'Does any remaining law in the src/validate/readiness-floor.ts file header promote here under comment promotion?',
      blocking: false
    }]
  },
  {
    id: 'spec:extraction.example-runner',
    readiness: 'ready',
    openQuestions: [{
      question: 'Do the every-step-and-only-the-steps and fresh-world-per-example laws stated in the runner and vitest-adapter commentary promote here or to story-altitude children under comment promotion?',
      blocking: false
    }]
  },
  {
    id: 'spec:extraction.executable-contracts',
    readiness: 'ready',
    openQuestions: [{
      question: 'Do the concreteness-refusal and no-guessing outcome-identity laws stated in src/codegen/contracts.ts commentary promote here or to a story-altitude child under comment promotion?',
      blocking: false
    }]
  },
  {
    id: 'spec:consumers.projections-model',
    readiness: 'defined',
    openQuestions: [{
      question: 'Does the pure-projection binding-language law stated in src/projections/design-review.ts commentary promote here or to a story-altitude child under comment promotion?',
      blocking: false
    }]
  },
  {
    id: 'spec:extraction.build-pipeline',
    readiness: 'ready',
    openQuestions: [{
      question: 'Does the derive-in-process freshness law stated in src/cli/q-command.ts commentary promote here or to a story-altitude child under comment promotion?',
      blocking: false
    }]
  }
]
Q_EXIT=0
```

Family descriptor tests (post-oracle):

```
npx vitest run test/self-hosting-graph.test.ts -t "validation family|extraction family|consumers family"
Test Files  1 passed (1)
Tests  3 passed | 24 skipped (27)
```

Full self-hosting graph suite was not required for this lane (todo 8 owns shared rosters / frozen totals). Relevant family descriptor assertions are green. Any shared-roster failures outside these three family tests would be pre-existing relative to this lane and owned by todo 8.

## Manual QA

Exact six-id live query (command above) returning readiness + openQuestions text/flag.

**PASS** criteria applied:

- Exactly six entries returned (one per planned id, same order).
- Each entry has exactly one open question.
- Every question text matches the plan wording exactly.
- Every flag is `blocking: false` (non-blocking).
- Readiness unchanged from baseline: five `ready`, projections-model `defined` (not lowered, not raised; readiness lines untouched).

A blocking flag on any of these would fail the defined floor on projections-model and the ready floor on the other five — not observed.

## Adversarial table (all 9 classes)

| Class | Probe | Result |
| --- | --- | --- |
| dirty_worktree | `git status --short` and `git diff --check` after carrier+oracle edits, before evidence | Nine modified paths (six carriers + three oracle files). `git diff --check` exit 0. No untracked temp junk. |
| misleading_success_output | Exact exit codes and structural match, not skimmed "ok" | Baseline validate 0; family tests 3/3 pass. Failing-first: 3/3 family tests fail with openQuestions present-in-graph / absent-in-oracle. Final: validate 0; family tests 3/3 pass; live query shows six ids, one non-blocking question each, readiness unchanged. |
| stale_state | Worktree-local `dist/cli/sdp.js` + in-process `extract({ root, exclude })` from the same dist | `realpath dist/cli/sdp.js` resolves inside this worktree. In-process extract of the six ids yields the same readiness + single non-blocking question each as `sdp:q` (`STALE_OK true`). No cross-worktree CLI. |
| parser | Parser / extract surface | N/A — no parser code change; carriers use the existing `### Open questions` / `[non-blocking]` form already pinned by `markdown-body-owner-behavior.ts:88-96` and the impact-graph exemplar. |
| external_text | Ingest of untrusted external text | N/A — question text is the planned backlog wording, not external ingest. |
| resumable_flow | Resume / checkpoint protocol | N/A — single lockstep edit, not a resumable multi-step flow. |
| long_process | Long-running process health | N/A — no long-running process. |
| timing_test | Timing / flake-prone wait | N/A — no timing test; descriptor equality is pure. |
| interruptible_operation | Mid-flight interrupt / cancel | N/A — no interruptible operation. |

## Changed-file list

Carriers (one Open questions subsection each):

- `specs/validation/two-check-families.sdp.md`
- `specs/validation/readiness-floor.sdp.md`
- `specs/extraction/example-runner.sdp.md`
- `specs/extraction/executable-contracts.sdp.md`
- `specs/consumers/projections-model.sdp.md`
- `specs/extraction/build-pipeline.sdp.md`

Oracles (matching openQuestions descriptors):

- `test/self-hosting-oracle/validation.ts`
- `test/self-hosting-oracle/extraction.ts`
- `test/self-hosting-oracle/consumers.ts`

Evidence:

- `.omo/evidence/task-7-design-law-transfer.md` (this file)

Not changed: readiness lines; shared rosters (`declared-relations.ts`, `pack-members.ts`, `anchors.ts`); frozen totals in `self-hosting-graph.test.ts`; any Spec outside the six; blocking flags.

## Cleanup receipt

No temp assets created. `npm install` / `npm run build` populated gitignored `node_modules/` and `dist/`. Validate wrote gitignored `generated/` artifacts (graph.json, contracts) — not staged.

Final pre-commit `git status --short` (lane files only):

```
 M specs/consumers/projections-model.sdp.md
 M specs/extraction/build-pipeline.sdp.md
 M specs/extraction/example-runner.sdp.md
 M specs/extraction/executable-contracts.sdp.md
 M specs/validation/readiness-floor.sdp.md
 M specs/validation/two-check-families.sdp.md
 M test/self-hosting-oracle/consumers.ts
 M test/self-hosting-oracle/extraction.ts
 M test/self-hosting-oracle/validation.ts
?? .omo/evidence/task-7-design-law-transfer.md
```

`git diff --check` exit 0.

## Risks

- Plan acceptance prose says "all six still `ready`"; `spec:consumers.projections-model` is authored at `defined` and stays there. Floor still clears because the new question is non-blocking. Todo 8 must not re-interpret this as a readiness raise.
- Shared-roster / frozen-total sync remains todo 8. This lane did not run or green the full `self-hosting-graph.test.ts` suite beyond the three family descriptor tests.
- Question wording is backlog only; comment-promotion disposition is deferred human work, not claimed resolved here.
