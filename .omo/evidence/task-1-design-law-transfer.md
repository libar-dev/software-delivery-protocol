# Task 1 — Refuse source-commentary extraction into the graph (MD-35)

Plan: `design-law-transfer` · Todo 1
Branch: `design-law-transfer/todo-1`
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-1`
Task id: `st_01a023b5`

Scope honored: new decision Spec, MD-35 registry row, pack decisions-block membership, per-Spec oracle descriptor only.
No edits to `declared-relations.ts`, `pack-members.ts`, `anchors.ts`, frozen totals, other decision Specs, or any `supersedes` edge.

## Baseline (before lane edits)

Worktree started clean on `design-law-transfer/todo-1`. `dist/` was absent; `npm ci` then `npm run build` were required before any graph command could run (prerequisite, not a corpus finding).

Baseline validate (after build, before corpus edits):

```
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
VALIDATE_EXIT=0
162 specs · 1 packs · 175 anchors → 338 nodes · 747 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

The five warnings are the pinned `honesty/gaps` set (markdown-authoring, claim-taxonomy, pack-aggregate, relations, spec-sections).

## Failing-first proof

Exact lookup for the new id, captured before the Spec existed:

```
pnpm --silent sdp:q 'const c=g.specContext("spec:decisions.jsdoc-graph-extraction-refused"); return {readiness:c.statedReadiness, relationCount:c.relations.length}'
LOOKUP_EXIT=1
sdp q: Cannot read properties of undefined (reading 'statedReadiness')
```

`g.specContext(...)` returned `undefined` because `spec:decisions.jsdoc-graph-extraction-refused` was absent from the graph. That is the expected pre-change absence.

## Commands and results (after edits)

### Validate

```
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
VALIDATE_EXIT=0
163 specs · 1 packs · 175 anchors → 339 nodes · 751 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

Same five pinned `honesty/gaps` warnings. No new findings. Counts moved by exactly this Spec: +1 spec, +1 node, +4 edges (3 authored relations + 1 `belongsTo`).

### Exact specified query

```
pnpm --silent sdp:q 'const c=g.specContext("spec:decisions.jsdoc-graph-extraction-refused"); return {readiness:c.statedReadiness, relationCount:c.relations.length}'
EXACT_LOOKUP_EXIT=1
sdp q: Cannot read properties of undefined (reading 'length')
```

`specContext` now resolves (the pre-change failure was `statedReadiness` on `undefined`). The remaining throw is a stale accessor: live `SpecContext` exposes `relationsOut` / `relationsIn`, not `relations`.

### Live-API query that measures the acceptance bar

```
pnpm --silent sdp:q 'const c=g.specContext("spec:decisions.jsdoc-graph-extraction-refused"); return {readiness:c.statedReadiness, relationCount:c.relationsOut.length}'
RELATIONS_OUT_EXIT=0
{ readiness: 'ready', relationCount: 3 }
```

Resolved relations (all `declared`):

- `dependsOn` → `spec:decisions.one-validation-path`
- `dependsOn` → `spec:decisions.structural-anchor-semantics`
- `refines` → `spec:model.anchors`

No `supersedes` edge.

### Self-hosting graph suite

```
npx vitest run test/self-hosting-graph.test.ts
VITEST_EXIT=1
Test Files  1 failed (1)
Tests  4 failed | 22 passed (26)
```

The decisions-family descriptor assertion passed. The four failures are only the shared-roster / frozen-total mismatches todo 8 owns (see below). No descriptor transcription error.

## Manual QA

Query used for the pass bar (live field name `relationsOut`):

```
pnpm --silent sdp:q 'const c=g.specContext("spec:decisions.jsdoc-graph-extraction-refused"); return {readiness:c.statedReadiness, relationCount:c.relationsOut.length}'
```

Result: `{ readiness: 'ready', relationCount: 3 }` · exit 0.

**PASS** — readiness is `ready` and relationCount is 3.

The specified body using `c.relations.length` cannot pass against the current reader; that is recorded as `stale_state` on the query text, not a Spec defect.

## Adversarial table (all 9 classes)

| Class | Probe | Result |
| --- | --- | --- |
| stale_state | Live corpus query for the new id after edits; specified query body vs live `SpecContext` fields | Spec is present, `statedReadiness=ready`, `relationsOut.length=3`. Specified `c.relations` is stale against `src/reader/reader.ts` (`relationsOut`/`relationsIn`). |
| dirty_worktree | `git status --short` and `git diff --check` after edits, before evidence | Three modified tracked files + one new Spec. `git diff --check` exit 0 (no whitespace errors). |
| misleading_success_output | Recorded exit codes and exact query/validate/vitest output | Validate exit 0 with 0 errors. Exact specified query exit 1 (stale `.relations`). Live `relationsOut` query exit 0 with `{ readiness: 'ready', relationCount: 3 }`. Vitest exit 1 with exactly four planned roster failures, 22 passes. |
| parser | No parser work in this lane | N/A |
| external_text | No external text ingested | N/A |
| resumable_flow | No resumable flow | N/A |
| long_process | No long-running process | N/A |
| timing_test | No timing test | N/A |
| interruptible_operation | No interruptible operation | N/A |

## Allowed shared-roster test mismatches

`npx vitest run test/self-hosting-graph.test.ts` — 4 failed / 22 passed. All four failures are the shared rosters and frozen totals todo 8 syncs:

1. `holds the frozen corpus totals` — live `{ specs: 163, packs: 1, anchors: 175 }` vs frozen `{ specs: 162, packs: 1, anchors: 175 }` (also expectedSpecs length 163 vs frozen 162; nodes 339 / edges 751 vs 338 / 747).
2. `derives exactly the authored declared relations` — live 302 triples vs roster 299; added the three new edges from `spec:decisions.jsdoc-graph-extraction-refused`.
3. `holds the frozen stated-readiness distribution` — live `ready: 147` vs frozen `ready: 146`.
4. `derives the Pack membership edges from the manifest, in manifest order` — live 163 `belongsTo` edges vs `expectedPackMembers` length 162; added `spec:decisions.jsdoc-graph-extraction-refused` → `pack:self-hosting-v1`.

No family-descriptor mismatch. No unexpected failure.

## Changed-file list

- `specs/decisions/jsdoc-graph-extraction-refused.sdp.md` (new; plan text)
- `docs/concept/DECISIONS.md` (MD-35 row after MD-34)
- `specs/self-hosting.pack.sdp.md` (id after `spec:decisions.architectural-significance-rides-primitives`)
- `test/self-hosting-oracle/decisions.ts` (full descriptor, transcribed from live extraction)
- `.omo/evidence/task-1-design-law-transfer.md` (this file)

Not changed: `declared-relations.ts`, `pack-members.ts`, `anchors.ts`, frozen totals, any other decision Spec.

## Cleanup receipt

No temp assets were created. `node_modules/`, `dist/`, and `generated/` are gitignored and were used only to run the CLI and tests.

Final pre-commit `git status --short` (lane files only; no temps):

```
 M docs/concept/DECISIONS.md
 M specs/self-hosting.pack.sdp.md
 M test/self-hosting-oracle/decisions.ts
?? specs/decisions/jsdoc-graph-extraction-refused.sdp.md
?? .omo/evidence/task-1-design-law-transfer.md
```

`git diff --check` exit 0. No temp assets left in the worktree.

## Risks

- Shared-roster / frozen-total assertions stay red until todo 8. That is planned, not a lane defect.
- The task's exact `c.relations` query body is stale against the live reader. Agents or later todos that copy it verbatim will see exit 1 even when the Spec is correct; use `relationsOut`.
- Decision is born `ready` under the registry-ratification precedent (MD-26 / MD-34). No verifier is required; kind `decision` stays off the honesty/gaps warning list.
