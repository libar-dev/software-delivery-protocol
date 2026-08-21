# Task 14 evidence — close gate (green)

Plan: `architectural-patterns-views` · Task 14
Branch: `feature/architectural-patterns-views`
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol`
HEAD: `1f09c390ee9176303ee7536cec51c49d7170aaac`
HEAD subject: `chore: checkpoint architecture views close state`
Captured: `2026-08-21T04:18:00Z` (inventory) / `2026-08-21T04:19:30Z` (single `npm run check`, ~84s) / `2026-08-21T04:20:51Z` (remeasurement)
Scope honored: only this evidence file written. No product, tests, plan, Boulder, ledger, commit, push, stash, or second full-gate run.

## Prior-failure-to-recovery lineage

First close attempt (HEAD `0a8912b`, dirty orchestrator tree) ran `npm run check` once and failed at `format:check` (`prettier --check .`) on committed `.cursor/plans/architectural_patterns_arc_7a1015f0.plan.md`. Stages after format never ran. Orchestrator dirt was classified and was not the failing stage. That record lived in this path and was checkpointed.

User-authorized recovery:

| Commit | Role |
| --- | --- |
| `77c6655ac2bf341a403da7ef7feb0bb404660475` | `style: format architectural patterns Cursor plan` — one-file Prettier recovery |
| `1f09c390ee9176303ee7536cec51c49d7170aaac` | `chore: checkpoint architecture views close state` — clean orchestration checkpoint |

This resume required a clean worktree before the gate and did not retry the failed format run.

## Inventory (before check)

```text
$ git branch --show-current
feature/architectural-patterns-views

$ git rev-parse HEAD
1f09c390ee9176303ee7536cec51c49d7170aaac

$ git log -3 --format='%H %s'
1f09c390ee9176303ee7536cec51c49d7170aaac chore: checkpoint architecture views close state
77c6655ac2bf341a403da7ef7feb0bb404660475 style: format architectural patterns Cursor plan
0a8912bba5b13d97f1eab5e63492e63eaafefbac test(recipes): ground-truth assertions for architecture recipes 17–19

$ git status -sb
## feature/architectural-patterns-views

$ git status --porcelain | wc -l
0
```

Clean-tree requirement: **met**. No orchestrator dirt. Gate started only after that proof.

## `npm run check` — one run, no retry

Command: `npm run check`
Working directory: repository root
Overall exit: **0** (~84029 ms)

| Stage | Exit | Notes |
| --- | --- | --- |
| `check:temporal` | 0 | `node ./check-temporal.mjs` |
| `lint` | 0 | `eslint .` |
| `format:check` | 0 | `All matched files use Prettier code style!` (the prior failing Cursor plan is formatted at `77c6655`) |
| `build` | 0 | tsup success. Standing toolchain line: CJS `empty-import-meta` at `src/extract/protocol-bindings.ts:56` (`import.meta` empty under CJS). Not a validation finding; historically present on green gates; does not fail `check`. |
| `generate:self-hosting` | 0 | Banner `162 specs · 1 packs · 172 anchors → 335 nodes · 731 edges (0 errors, 0 warnings)` then `validate: 0 errors · 5 warnings` — five `honesty/gaps` (listed below) |
| `generate:example` | 0 | Banner `11 specs · 1 packs · 5 anchors → 17 nodes · 32 edges` then `validate: 0 errors · 1 warnings` — one `conformance/verifies-linkage` |
| `typecheck` | 0 | `tsc --noEmit -p tsconfig.json` |
| `typecheck:examples` | 0 | `tsc --noEmit -p tsconfig.examples.json` |
| `test` | 0 | Completed; later stages ran. Exact vitest file/test totals were truncated in this capture; no second `npm test` or full-gate retry was run. |
| `check:self-hosting-gates` | 0 | Printed the phase ledger JSON |
| `check:self-hosting` | 0 | `--check-clean`; same five `honesty/gaps` |
| `check:example` | 0 | `--check-clean`; same one `verifies-linkage` |
| `preflight` | 0 | `preflight: semantic diff summary` / `clean` |

### Intentional validation warnings (not failures)

Self-hosting (`honesty/gaps`, five, warning):

1. `spec:carrier.markdown-authoring`
2. `spec:extraction.claim-taxonomy`
3. `spec:model.pack-aggregate`
4. `spec:model.relations`
5. `spec:model.spec-sections`

Each: `states readiness "ready" with no resolving verifier — a gap, informative only (ready never requires delivery facts).`

Example (`conformance/verifies-linkage`, one, warning):

- Example `spec:orders.create-order.invalid-cart` declares verifies → `spec:orders.create-order` but is not an enabled verifier (no test anchor), so the spec↔test trace is incomplete and it confers no `has-verifier`.

No other validation warning class appeared. The tsup CJS `empty-import-meta` line is a build toolchain warning, not a graph finding.

## Remeasurement (re-derived)

All bodies ran through `pnpm --silent sdp:q --json` after the green gate (fresh in-process derive; not generated JSON as source of truth). `g.anchors` is not a reader method; Anchor vs CodeNode split is from `graph.nodes`. Validate banner `172 anchors` = 83 `Anchor` nodes + 89 `CodeNode`s.

### Counts (re-derived)

```json
{
  "specs": 162,
  "packs": 1,
  "anchors": 83,
  "codeNodes": 89,
  "primitives": 162,
  "packNodes": 1,
  "nodes": 335,
  "edges": 731
}
```

Matches frozen corpus totals `specs: 162, packs: 1, anchors: 172` / `nodes 335` / `edges 731`.

### Readiness distribution (re-derived)

```json
{
  "stated": { "ready": 146, "defined": 11, "idea": 4, "scoped": 1 },
  "derived": { "ready": 158, "scoped": 3, "idea": 1 },
  "count": 162
}
```

Stated and derived remain independent coordinates; they disagree (do not collapse).

### Declared edges excluding `belongsTo` (re-derived)

```json
{
  "declaredExcludingBelongsTo": 299,
  "belongsToDeclared": 162,
  "byType": {
    "refines": 160,
    "decidedBy": 41,
    "verifies": 68,
    "dependsOn": 29,
    "constrainedBy": 1
  }
}
```

No declared `supersedes`. `decidedBy` **41** (plan upper bound).

### Inter-decision `dependsOn` / `supersedes` (re-derived)

- Decision Specs: **34**
- Inter-decision `dependsOn`: **12** (all `declared`)
- Inter-decision `supersedes`: **0**

Pairs (all `claim: declared`):

1. `agent-front-door` → `agent-surface-scripts-graph`
2. `architectural-significance-rides-primitives` → `binding-not-liveness`
3. `architectural-significance-rides-primitives` → `structural-anchor-semantics`
4. `carried-evidence` → `content-only-sections`
5. `carried-evidence` → `kind-conditional-floor`
6. `carrier-universality` → `pack-markdown-carrier`
7. `carrier-universality` → `prose-ownership`
8. `decision-readiness-posture` → `kind-conditional-floor`
9. `example-realization-posture` → `binding-not-liveness`
10. `sdp-gherkin-extension` → `sdp-ts-extension`
11. `structural-anchor-semantics` → `binding-not-liveness`
12. `verification-posture-not-realization` → `binding-not-liveness`

### Components / `memberOf` / `uses` (re-derived)

- Components: **13** (`component:protocol.{adapters,cli,codegen,extract,graph,import,model,notation,projections,reader,runner,testing,validate}`)
- `memberOf`: **73**, claim `anchored`
- `uses`: **25**, claim `anchored`

## Recipe QA (catalog bodies, `--json`)

Bodies taken verbatim from `docs/agent-surface/recipes.md` fences 17–19. Recipe 19 unknown-id substituted only the opening `const id`.

### Recipe 17 architecture map (re-derived)

Exit 0. `components.length === 13`. Member counts sum to 73 (`memberOf`). Summaries (not whole member arrays):

| Component | members | fanIn | fanOut |
| --- | --- | --- | --- |
| `component:protocol.adapters` | 1 | 1 | 1 |
| `component:protocol.cli` | 11 | 0 | 6 |
| `component:protocol.codegen` | 2 | 1 | 2 |
| `component:protocol.extract` | 13 | 2 | 3 |
| `component:protocol.graph` | 5 | 5 | 1 |
| `component:protocol.import` | 3 | 1 | 2 |
| `component:protocol.model` | 7 | 6 | 0 |
| `component:protocol.notation` | 1 | 1 | 1 |
| `component:protocol.projections` | 10 | 1 | 2 |
| `component:protocol.reader` | 3 | 2 | 3 |
| `component:protocol.runner` | 1 | 2 | 1 |
| `component:protocol.testing` | 1 | 0 | 2 |
| `component:protocol.validate` | 15 | 3 | 1 |

Non-empty, no throw.

### Recipe 18 decision map (re-derived)

Exit 0. `total === 34`. Ranking fan-in sums to 12 (equals inter-decision `dependsOn`). `supersedes` / `supersededBy` empty on every decision. Top ranking:

```json
[
  { "id": "spec:decisions.binding-not-liveness", "fanIn": 4 },
  { "id": "spec:decisions.kind-conditional-floor", "fanIn": 2 },
  { "id": "spec:decisions.agent-surface-scripts-graph", "fanIn": 1 },
  { "id": "spec:decisions.content-only-sections", "fanIn": 1 },
  { "id": "spec:decisions.pack-markdown-carrier", "fanIn": 1 },
  { "id": "spec:decisions.prose-ownership", "fanIn": 1 },
  { "id": "spec:decisions.sdp-ts-extension", "fanIn": 1 },
  { "id": "spec:decisions.structural-anchor-semantics", "fanIn": 1 }
]
```

Remaining 26 decisions rank at `fanIn: 0`.

### Recipe 19 planning slice (re-derived)

Catalog subject `spec:consumers.agent-surface`. Exit 0. Exact return:

```json
{
  "id": "spec:consumers.agent-surface",
  "found": true,
  "refinementNeighborhood": {
    "parents": ["spec:consumers.projections-model"],
    "children": [
      "spec:consumers.agent-surface.authoring-recipes",
      "spec:consumers.agent-surface.demand-map-entries",
      "spec:consumers.agent-surface.scripted-context-body",
      "spec:consumers.reader",
      "spec:decisions.agent-front-door",
      "spec:decisions.agent-surface-scripts-graph"
    ]
  },
  "constrainingDecisions": [
    { "id": "spec:decisions.agent-front-door", "subjects": ["spec:consumers.agent-surface"] },
    { "id": "spec:decisions.agent-surface-scripts-graph", "subjects": ["spec:consumers.agent-surface"] },
    { "id": "spec:decisions.mcp-deferred", "subjects": ["spec:consumers.projections-model"] }
  ],
  "abstractions": [
    { "id": "impl:protocol.agent-surface", "claim": "anchored", "file": "src/reader/reader.ts", "line": 362 },
    { "id": "impl:protocol.agent-surface-cli", "claim": "anchored", "file": "src/cli/sdp.ts", "line": 100 }
  ],
  "components": [
    {
      "id": "component:protocol.cli",
      "label": "Protocol CLI seam",
      "file": "src/cli/build-command.ts",
      "line": 24,
      "directlySatisfies": false,
      "abstractions": ["impl:protocol.agent-surface-cli"]
    },
    {
      "id": "component:protocol.reader",
      "label": "Protocol reader seam",
      "file": "src/reader/reader.ts",
      "line": 352,
      "directlySatisfies": false,
      "abstractions": ["impl:protocol.agent-surface"]
    }
  ],
  "verifiers": [
    {
      "id": "spec:consumers.agent-surface.demand-map-entries",
      "via": "example",
      "claim": "declared",
      "enabled": true,
      "file": "specs/consumers/agent-surface.demand-map-entries.sdp.md",
      "line": null
    },
    {
      "id": "spec:consumers.agent-surface.scripted-context-body",
      "via": "example",
      "claim": "declared",
      "enabled": true,
      "file": "specs/consumers/agent-surface.scripted-context-body.sdp.md",
      "line": null
    }
  ],
  "blastRadiusLimit": "file-level graph-recorded paths only; no symbol-level impact graph"
}
```

Seven `blastRadiusEntryPoints` (spec + two implementations + two components + two example verifiers). Non-empty, no throw.

### Recipe 19 unknown id (re-derived)

`const id = "spec:does-not-exist.unknown"`:

```json
{ "id": "spec:does-not-exist.unknown", "found": false }
```

Exit 0; catalog contract (`{ found: false }` rather than failing) holds.

## Repository validate (AGENTS.md exact command)

```text
$ pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
162 specs · 1 packs · 172 anchors → 335 nodes · 731 edges (0 errors, 0 warnings)
Wrote .../generated/graph.json
Wrote .../generated/contracts (102 modules)
specs/carrier/markdown-authoring.sdp.md — [warning] honesty/gaps — ...
specs/extraction/claim-taxonomy.sdp.md — [warning] honesty/gaps — ...
specs/model/pack-aggregate.sdp.md — [warning] honesty/gaps — ...
specs/model/relations.sdp.md — [warning] honesty/gaps — ...
specs/model/spec-sections.sdp.md — [warning] honesty/gaps — ...
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

Exit **0**. Same five honesty/gaps; no extra class.

## Plan close-out literals vs re-derived

| Plan success-criteria field | Re-derived |
| --- | --- |
| components | 13 |
| decision Specs | 34 |
| inter-decision `dependsOn` | 12 (within “up to 15”) |
| `supersedes` | 0 |
| `decidedBy` | 41 |
| recipes 17–19 | execute green (plus unknown-id `{found:false}`) |

## Adversarial classes

| Class | Observation |
| --- | --- |
| stale | Inventory + live `npm run check` on `1f09c390`; live `sdp:q` after gate, not cached green from `0a8912b` |
| dirty | Pre-gate porcelain empty. Post-measure porcelain empty until this evidence rewrite. Checkpoint absorbed prior orchestrator dirt. |
| generated | `generate:*` / `--check-clean` / preflight `clean`. Queries derived in-process. Generated writes are script-owned / ignored. |
| hung | Check ~84s then returned; queries ~10s; no hung process |
| flaky | Single full gate; no retry |
| misleading | Exit 0 with classified warnings; tsup CJS line not sold as validation; `has-verifier` not read as tests-pass; `implemented` not claimed live; stated≠derived reported |
| repeated-interruptions | None on this resume |

## Cleanup

Removed `/tmp/recipe-17.js`, `/tmp/recipe-18.js`, `/tmp/recipe-19.js`, `/tmp/recipe-19-unknown.js`, `/tmp/r17-summary.json`, `/tmp/r18-summary.json`, `/tmp/r19.json`, `/tmp/r19u.json`. `.tmp-scratch` empty after preflight. No check subprocess left. No product/test/plan/Boulder/ledger edit. No commit/push/stash. Residual working-tree change: this evidence file only.
