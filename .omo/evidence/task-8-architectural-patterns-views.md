# Task 8 — Inter-decision dependsOn tranche and decidedBy fills

Plan: `architectural-patterns-views` · Task 8
Branch: `feature/architectural-patterns-views`
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol`
Captured: `2026-08-21T01:56:00Z`
Baseline: `.omo/evidence/architectural-patterns-views/task-8-baseline.md`

Scope honored: frontmatter of the exact source Specs for 15 accepted edges only;
no `declared-relations.ts`, no prose/section edits, no supersedes, no commit/push.
Shared roster lockstep remains task 15.

## Adjudication (from baseline)

Genuineness bar (MD-34 + MD-33): source carrier text unintelligible/incomplete without
target; not reaffirmation, planner gloss, or a relation already carried by `refines`;
not scheduling-flavored.

- **Accepted dependsOn: 9**
- **Dropped dependsOn: 3** (reasons below)
- **Accepted decidedBy: 6**
- **supersedes authored: 0**

## Authored dependsOn (9)

| # | from | to | source file |
|---|---|---|---|
| 1 | `spec:decisions.carrier-universality` | `spec:decisions.prose-ownership` | `specs/decisions/carrier-universality.sdp.md` |
| 2 | `spec:decisions.carrier-universality` | `spec:decisions.pack-markdown-carrier` | `specs/decisions/carrier-universality.sdp.md` |
| 3 | `spec:decisions.agent-front-door` | `spec:decisions.agent-surface-scripts-graph` | `specs/decisions/agent-front-door.sdp.md` |
| 4 | `spec:decisions.structural-anchor-semantics` | `spec:decisions.binding-not-liveness` | `specs/decisions/structural-anchor-semantics.sdp.md` |
| 5 | `spec:decisions.verification-posture-not-realization` | `spec:decisions.binding-not-liveness` | `specs/decisions/verification-posture-not-realization.sdp.md` |
| 6 | `spec:decisions.example-realization-posture` | `spec:decisions.binding-not-liveness` | `specs/decisions/example-realization-posture.sdp.md` |
| 7 | `spec:decisions.carried-evidence` | `spec:decisions.kind-conditional-floor` | `specs/decisions/carried-evidence.sdp.md` |
| 8 | `spec:decisions.carried-evidence` | `spec:decisions.content-only-sections` | `specs/decisions/carried-evidence.sdp.md` |
| 9 | `spec:decisions.decision-readiness-posture` | `spec:decisions.kind-conditional-floor` | `specs/decisions/decision-readiness-posture.sdp.md` |

## Authored decidedBy fills (6)

| # | from (subject) | to (decision) | source file |
|---|---|---|---|
| 10 | `spec:consumers.agent-surface` | `spec:decisions.agent-front-door` | `specs/consumers/agent-surface.sdp.md` |
| 11 | `spec:validation.warn-level-signals` | `spec:decisions.decision-readiness-posture` | `specs/validation/warn-level-signals.sdp.md` |
| 12 | `spec:model.core-model` | `spec:decisions.example-realization-posture` | `specs/model/core-model.sdp.md` |
| 13 | `spec:protocol.self-hosting` | `spec:decisions.plain-language-references` | `specs/protocol/self-hosting.sdp.md` |
| 14 | `spec:carrier.gherkin-authoring` | `spec:decisions.sdp-gherkin-extension` | `specs/carrier/gherkin-authoring.sdp.md` |
| 15 | `spec:model.anchors` | `spec:decisions.structural-anchor-semantics` | `specs/model/anchors.sdp.md` |

## Dropped dependsOn candidates (3) — absent from graph

| from | to | reason |
|---|---|---|
| `spec:decisions.carrier-universality` | `spec:decisions.carrier-ruling` | Reaffirmation of MD-18 default, not semantic need of MD-18's full content. Lineage already exists via `refines` chain (`carrier-universality → gherkin-carrier-option → carrier-ruling`). Plan-named drop candidate. |
| `spec:decisions.mcp-deferred` | `spec:decisions.agent-surface-scripts-graph` | Carrier supplies no quoted need of scripts-graph; planner coherence gloss ≠ unintelligibility. Source already `refines → projections-model` and is `decidedBy` that subject. |
| `spec:decisions.planning-truths-placement` | `spec:decisions.shipped-projections-frozen` | Source fully states reopen-via-`supersedes` without naming MD-32. Target is a prior instance; generalization does not `dependsOn` its instance. Would manufacture a ceremonial edge. |

## Measured graph pulse (live `sdp:q`, post-edit)

| Field | Baseline | After |
|---|---|---|
| inter-decision `dependsOn` | 3 | **12** (= 3 prior + 9 accepted) |
| inter-decision `supersedes` | 0 | **0** |
| accepted edges present | 0 / 15 | **15 / 15** |
| dropped edges present | 0 / 3 | **0 / 3** |
| unresolved accepted targets | — | **0** |
| `decidedBy` total (all kinds) | 34 | 40 (= +6 fills; includes pre-existing structural-patterns edge from sibling work) |

All 12 inter-decision `dependsOn` edges (claim `declared`):

1. `architectural-significance-rides-primitives` → `binding-not-liveness` (pre)
2. `architectural-significance-rides-primitives` → `structural-anchor-semantics` (pre)
3. `sdp-gherkin-extension` → `sdp-ts-extension` (pre)
4. `agent-front-door` → `agent-surface-scripts-graph` (new)
5. `carried-evidence` → `content-only-sections` (new)
6. `carried-evidence` → `kind-conditional-floor` (new)
7. `carrier-universality` → `pack-markdown-carrier` (new)
8. `carrier-universality` → `prose-ownership` (new)
9. `decision-readiness-posture` → `kind-conditional-floor` (new)
10. `example-realization-posture` → `binding-not-liveness` (new)
11. `structural-anchor-semantics` → `binding-not-liveness` (new)
12. `verification-posture-not-realization` → `binding-not-liveness` (new)

## Validate

```sh
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

```
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

Exit **0**. Warnings are the standing ready-without-verifier gaps (unchanged owners).

## Manual QA (live `sdp:q`)

Body: baseline Manual QA body plus guards that dropped edges stay absent, inter-decision
`dependsOn === 12`, `interSupersedes === 0`, `acceptedPresent === 15`, all accepted targets resolve.

Result:

- Exit **0**
- Sentinel `architectural relation tranche missing` **cleared**
- `acceptedMissing: []`
- `droppedPresent: []`
- `missingDropped` lists the three dropped pairs (absent as required)
- `unresolvedAccepted: []`

## Format / scoped diff

```sh
npx prettier --check <13 source Specs>
# All matched files use Prettier code style!  exit 0
```

Scoped frontmatter-only diff (task 8 authored paths):

```
 specs/carrier/gherkin-authoring.sdp.md                      | 1 +
 specs/consumers/agent-surface.sdp.md                        | 4 +++-
 specs/decisions/agent-front-door.sdp.md                     | 1 +
 specs/decisions/carried-evidence.sdp.md                     | 3 +++
 specs/decisions/carrier-universality.sdp.md                 | 3 +++
 specs/decisions/decision-readiness-posture.sdp.md           | 1 +
 specs/decisions/example-realization-posture.sdp.md          | 1 +
 specs/decisions/structural-anchor-semantics.sdp.md          | 1 +
 specs/decisions/verification-posture-not-realization.sdp.md | 1 +
 specs/model/anchors.sdp.md                                  | 4 +++-
 specs/model/core-model.sdp.md                               | 4 +++-
 specs/protocol/self-hosting.sdp.md                          | 1 +
 specs/validation/warn-level-signals.sdp.md                  | 1 +
 13 files changed, 23 insertions(+), 3 deletions(-)
```

No body/section prose touched. No `test/self-hosting-oracle/declared-relations.ts` edit.

## Full graph test (once)

`pnpm exec vitest run test/self-hosting-graph.test.ts` — 8 failed / rest passed.

Expected task-15 / sibling deltas only:

- frozen corpus totals (specs/anchors counts)
- rostered Spec/Pack/anchor node ids
- **declared relations** (exactly the +15 edges this task authored, plus sibling deltas)
- stated-readiness distribution
- binding edges / component membership / uses / line projections (sibling anchor work)

No new failure mode unique to malformed task-8 edges (validate 0; Manual QA 0; all targets resolve).

## UltraQA probes

| Probe | Result |
|---|---|
| **stale_state** | Manual QA and pulse used live `pnpm --silent sdp:q` (in-process derive). Counts match 3 prior + 9 new = 12. |
| **dirty_worktree** | Pre-existing sibling dirt retained (structural-patterns, src/, boulder, ledger, other evidence). Task-8 touch set = 13 Spec frontmatters + this evidence file. Accidental prettier write to `.cursor/plans/...` was reverted immediately; not part of the claim. |
| **generated-or-cached** | Validate rewrote `generated/graph.json` as a side effect; coverage claims read live `sdp:q`, not that artifact. |
| **misleading_success_output** | Asserted on accepted-edge set equality, dropped-edge absence, measured inter-dependsOn 12, supersedes 0, and resolved targets — not bare green validate alone. |
| **wrong_location** | Main checkout on `feature/architectural-patterns-views`. |
| **partial_commit / history rewrite** | No commit, reset, rebase, or push. Landing serialized per plan. |
| **secret / out-of-scope edit** | No `declared-relations.ts`, no supersedes, no dropped edges, no prose, no tests/totals. |
| **test edit seam** | None — relations are authored graph facts; task 15 owns shared roster lockstep. |

## Cleanup

- No temp files left.
- No partial frontmatter drafts.
- Accidental prettier side-effect on `.cursor/plans/architectural_patterns_arc_7a1015f0.plan.md` reverted via `git checkout --`.
- No git commit/push.
- Evidence paths for this task:
  - `.omo/evidence/architectural-patterns-views/task-8-baseline.md` (characterization)
  - `.omo/evidence/task-8-architectural-patterns-views.md` (this file — plan-required drop log + completion)

## Verdict

**DONE.**

- Exactly **15** accepted edges authored and present (claim `declared`).
- Exactly **3** dropped candidates absent, reasons recorded.
- Inter-decision `dependsOn` measured **12** (= 3 + 9); inter-`supersedes` **0**; all targets resolved.
- Validate exit **0**; Manual QA exit **0**.
- Scoped diff = 13 Spec frontmatters + evidence only (task-8 claim surface).
- No commit; landing serialized.
