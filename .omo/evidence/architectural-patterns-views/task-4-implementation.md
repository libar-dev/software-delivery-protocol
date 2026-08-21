# Task 4 implementation — mint `component:protocol.import` and `component:protocol.testing`

Subtask: plan todo 4. Branch: `feature/architectural-patterns-views` @ `9e22212359da2f4648b895893c267a14bd8e94b0`
(baseline was `723bf95`; HEAD advanced by sibling `feat(anchors): widen CLI coverage`).
Captured: `2026-08-21T02:17:15Z`
Baseline: `.omo/evidence/architectural-patterns-views/task-4-baseline.md`

Failing baseline sentinel `import-testing structural anchors missing` (5 nodes + 14 edges absent) is **cleared**. Both satisfies targets remain already-implemented ready behavior Specs (`spec:carrier.sdp-import`, `spec:extraction.example-runner`); no skip.

## Scope executed

Owned (product):

- `src/import/import.ts` — component + impl
- `src/import/emit-markdown.ts` — impl
- `src/testing/index.ts` — component + impl
- `src/cli/import-command.ts` — existing CLI impl gains `component`
- `src/cli/build-command.ts` — existing CLI component `uses` gains import
- `.omo/evidence/architectural-patterns-views/task-4-implementation.md` — this file

Not touched: `src/import/data-access.ts`, `src/import/markdown-fidelity.ts`, other source, tests, shared rosters/totals/state, Specs, plan, Boulder, ledger. No commit/push. No runtime behavior change — trusted `codeAnchor` constants + `void` keep-alives only.

| File | Planned unit | Action |
|---|---|---|
| `src/import/import.ts` | `component:protocol.import` satisfies `spec:carrier.sdp-import`, uses `[model, extract]`; `impl:protocol.sdp-import-core` satisfies same, memberOf import | **anchored** |
| `src/import/emit-markdown.ts` | `impl:protocol.sdp-import-markdown-emit` satisfies sdp-import, memberOf import | **anchored** |
| `src/cli/import-command.ts` | existing `impl:protocol.sdp-import` gains `component: protocol.import` | **extended** |
| `src/testing/index.ts` | `component:protocol.testing` satisfies `spec:extraction.example-runner`, uses `[adapters, runner]`; `impl:protocol.example-testing-helpers` satisfies same, memberOf testing | **anchored** |
| `src/cli/build-command.ts` | existing `component:protocol.cli` unique uses `component:protocol.import` | **extended** |

Out of scope (untouched, still unanchored): `src/import/data-access.ts`, `src/import/markdown-fidelity.ts`.

## Diff (product only)

`git diff --stat` (these five files):

```
 src/cli/build-command.ts    |  1 +
 src/cli/import-command.ts   |  3 ++-
 src/import/emit-markdown.ts | 10 ++++++++++
 src/import/import.ts        | 22 +++++++++++++++++++++-
 src/testing/index.ts        | 20 ++++++++++++++++++++
 5 files changed, 54 insertions(+), 2 deletions(-)
```

Trusted import style in new sites: `codeAnchorId` / `componentAnchorId` / `ref` from `../ids.js`; `codeAnchor` from `../model/code-anchor.js`. Existing CLI files already imported those builders.

Anchors sit immediately above the realizing export (locality ≤24). No JSDoc was interposed.

## Automated gates

| Gate | Result |
|---|---|
| Prettier `--check` on five product files | pass (`All matched files use Prettier code style!`) |
| ESLint on five product files | exit 0 (silent) |
| `tsc --noEmit -p tsconfig.json` | exit 0 (silent; no target-file errors) |
| LSP diagnostics on five product files | **daemon unreachable** (`~/.omo/lsp-daemon/v0.1.0/daemon.sock`); compensated by prettier + eslint + tsc file scope |
| `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` | **0 errors · 5 warnings** (pre-existing honesty/gaps on the same five ready-without-verifier Specs; none name import or testing) |

Validate pulse:

```
162 specs · 1 packs · 172 anchors → 335 nodes · 730 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings
```

Vs task-4 baseline green (167 anchors → 330 nodes · 701 edges): **+5 anchors / +5 nodes** match the five minted CodeNodes. Edge inflation is the 14 planned facts plus sibling-wave uses/memberOf already in the worktree (task 6 reader→model and others). Spec count 162 and the five-warning set are branch-shared, not introduced here.

## Manual QA — live `pnpm --silent sdp:q` (PASS)

Channel: `pnpm --silent sdp:q "$(cat /tmp/task4-qa.js)" --json` (operator-authored body; not corpus text). Fresh in-process derive. Throws the baseline sentinel `import-testing structural anchors missing` if any planned node/edge/locality/unresolved/duplicate fact is absent.

Asserted: five CodeNodes; all 14 `satisfies` / `memberOf` / `uses` facts; component uses import→model/extract, testing→adapters/runner, cli→import (existing CLI uses preserved); exact file/line matching the `const` declaration; locality ≤24; no duplicate edges; every endpoint resolves; no decision-Spec satisfies from owned ids; data-access and markdown-fidelity stay empty of CodeNodes; `g.specContext("spec:carrier.sdp-import").implementations` includes the new import impls.

Observed (`--json`, **exit 0**):

```json
{
  "ok": true,
  "sentinelCleared": "import-testing structural anchors missing",
  "results": [
    {
      "id": "component:protocol.import",
      "file": "src/import/import.ts",
      "line": 40,
      "claim": "anchored",
      "anchorLine": 40,
      "siteLine": 58,
      "locality": 18,
      "satisfies": "spec:carrier.sdp-import",
      "memberOf": null
    },
    {
      "id": "impl:protocol.sdp-import-core",
      "file": "src/import/import.ts",
      "line": 49,
      "claim": "anchored",
      "anchorLine": 49,
      "siteLine": 58,
      "locality": 9,
      "satisfies": "spec:carrier.sdp-import",
      "memberOf": "component:protocol.import"
    },
    {
      "id": "impl:protocol.sdp-import-markdown-emit",
      "file": "src/import/emit-markdown.ts",
      "line": 197,
      "claim": "anchored",
      "anchorLine": 197,
      "siteLine": 205,
      "locality": 8,
      "satisfies": "spec:carrier.sdp-import",
      "memberOf": "component:protocol.import"
    },
    {
      "id": "component:protocol.testing",
      "file": "src/testing/index.ts",
      "line": 33,
      "claim": "anchored",
      "anchorLine": 33,
      "siteLine": 51,
      "locality": 18,
      "satisfies": "spec:extraction.example-runner",
      "memberOf": null
    },
    {
      "id": "impl:protocol.example-testing-helpers",
      "file": "src/testing/index.ts",
      "line": 42,
      "claim": "anchored",
      "anchorLine": 42,
      "siteLine": 51,
      "locality": 9,
      "satisfies": "spec:extraction.example-runner",
      "memberOf": "component:protocol.testing"
    }
  ],
  "edges": [
    { "type": "satisfies", "from": "component:protocol.import", "to": "spec:carrier.sdp-import", "claim": "anchored" },
    { "type": "satisfies", "from": "impl:protocol.sdp-import-core", "to": "spec:carrier.sdp-import", "claim": "anchored" },
    { "type": "satisfies", "from": "impl:protocol.sdp-import-markdown-emit", "to": "spec:carrier.sdp-import", "claim": "anchored" },
    { "type": "satisfies", "from": "component:protocol.testing", "to": "spec:extraction.example-runner", "claim": "anchored" },
    { "type": "satisfies", "from": "impl:protocol.example-testing-helpers", "to": "spec:extraction.example-runner", "claim": "anchored" },
    { "type": "memberOf", "from": "impl:protocol.sdp-import-core", "to": "component:protocol.import", "claim": "anchored" },
    { "type": "memberOf", "from": "impl:protocol.sdp-import-markdown-emit", "to": "component:protocol.import", "claim": "anchored" },
    { "type": "memberOf", "from": "impl:protocol.sdp-import", "to": "component:protocol.import", "claim": "anchored" },
    { "type": "memberOf", "from": "impl:protocol.example-testing-helpers", "to": "component:protocol.testing", "claim": "anchored" },
    { "type": "uses", "from": "component:protocol.import", "to": "component:protocol.model", "claim": "anchored" },
    { "type": "uses", "from": "component:protocol.import", "to": "component:protocol.extract", "claim": "anchored" },
    { "type": "uses", "from": "component:protocol.testing", "to": "component:protocol.adapters", "claim": "anchored" },
    { "type": "uses", "from": "component:protocol.testing", "to": "component:protocol.runner", "claim": "anchored" },
    { "type": "uses", "from": "component:protocol.cli", "to": "component:protocol.import", "claim": "anchored" }
  ],
  "importImplementations": [
    "component:protocol.import",
    "impl:protocol.sdp-import",
    "impl:protocol.sdp-import-core",
    "impl:protocol.sdp-import-markdown-emit"
  ],
  "testingNewImplementations": [
    "component:protocol.testing",
    "impl:protocol.example-testing-helpers"
  ],
  "importUses": ["component:protocol.extract", "component:protocol.model"],
  "testingUses": ["component:protocol.adapters", "component:protocol.runner"],
  "cliUses": [
    "component:protocol.codegen",
    "component:protocol.extract",
    "component:protocol.import",
    "component:protocol.projections",
    "component:protocol.reader",
    "component:protocol.validate"
  ],
  "existingCliImpl": { "file": "src/cli/import-command.ts", "line": 71 },
  "cliComponent": { "file": "src/cli/build-command.ts", "line": 24 }
}
```

PASS criteria met: five nodes present; all fourteen facts present with `claim: "anchored"`; locality 18/9/8/18/9 (≤24); existing `impl:protocol.sdp-import` still at L71 with memberOf import (site `runImport` L79, locality 8); CLI uses uniquely include import and keep the five prior targets; no duplicate/unresolved edges. Baseline sentinel no longer fires.

## Recipes 1 / 2 (after change, verbatim catalog bodies)

Recipe 1 (build backlog):

```
{
  "total": 0,
  "byFamily": {},
  "excludedReadyExamples": 66,
  "excludedReadyDecisions": 34,
  "excludedWithoutVerifier": []
}
```

Recipe 2 (drift alarm):

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

Unchanged vs baseline recipe 1 / last captured recipe 2. These two Specs were already `implemented`; additional `satisfies` is coverage widening, not a new drift alarm.

## Graph test once (classification only — rosters not updated here)

Command: `npx vitest run test/self-hosting-graph.test.ts` (single run).

```
Tests  9 failed | 17 passed (26)
```

Exit 1. All nine failures are shared todo-15 roster/totals lockstep debt and/or current sibling unlanded wave deltas. None indicate product-behavior breakage from these anchors:

| Failure | Classification |
|---|---|
| holds the frozen corpus totals | expected `anchors: 157` → `172` (this task +5; sibling wave the rest) and branch-shared `specs: 161` → `162` (todo 2 ruling, not this task) |
| rosters exactly the authored Spec, Pack, and anchor node ids | +`component:protocol.import`, +`component:protocol.testing`, +`impl:protocol.sdp-import-core`, +`impl:protocol.sdp-import-markdown-emit`, +`impl:protocol.example-testing-helpers` (this task); plus sibling-wave ids (CLI mermaid/census/gherkin/agent-surface, extract discover/protocol-bindings, graph delivery-facts/example-space, validate graph-index/validation-contracts) |
| derives exactly the authored declared relations | **not this task** — relation roster drift from parallel corpus work (no declared relations authored here) |
| holds the frozen stated-readiness distribution | **not this task** — readiness roster drift from parallel Spec edits |
| derives one binding edge per authored anchor | +5 satisfies bindings for the new component/impls (this task) + sibling wave bindings |
| rosters exactly the accepted component set | +`component:protocol.import` + `component:protocol.testing` (this task; plan Q1). Oracle still frozen at 11; todo 15 retires the import exception |
| gives every owned impl/api CodeNode exactly one component | `impl:protocol.sdp-import` now has membership 1 (was the import exception with 0). Intentional; oracle exception list is todo 15. Other new impls also add memberOf (this task + sibling) |
| derives exactly the sparse authored component uses edges | +import→model, +import→extract, +testing→adapters, +testing→runner, +cli→import (this task); +reader→model and other sibling uses. Sparse uses list not yet updated (todo 15) |
| projects every anchor and code node at the line its declaration occupies | +5 CodeNode projections at lines 40 / 49 / 197 / 33 / 42 (this task); oracle `expectedAnchors` still frozen |

**No other failure classes.** Locality invariant test did not fire on the new anchors because they are not yet on `expectedAnchors` (todo 15); Manual QA already proved locality ≤18.

## UltraQA probes

| Probe | Result |
|---|---|
| **stale_state** | PASS. Manual QA used live `pnpm --silent sdp:q` (in-process derive; does not read `generated/graph.json`). Validate rewrote `generated/` as a documented sink; coverage claims did not treat it as authority. HEAD `9e22212` (no commit from this worker). |
| **dirty_worktree** | PASS for this worker's product scope. Scoped product dirt: `M src/import/import.ts`, `M src/import/emit-markdown.ts`, `M src/testing/index.ts`, `M src/cli/import-command.ts`, `M src/cli/build-command.ts`. Evidence path untracked under `.omo/evidence/architectural-patterns-views/`. Sibling unlanded wave dirt (graph/validate/reader/recipes, boulder/plan/ledger) left untouched. `src/import/data-access.ts` and `src/import/markdown-fidelity.ts` have empty diffs. No commit. |
| **generated_or_cached_artifacts** | PASS. Manual QA used live `sdp:q` (writes nothing). Validate's sink wrote gitignored `generated/graph.json` and `generated/contracts` (`.gitignore:17`); those paths were not read as the graph source. |
| **malformed structural input** | PASS. Branded builders only (`codeAnchorId` / `componentAnchorId` / `ref`). Live graph resolves all five nodes, all 14 edges, both Spec targets, and every uses/memberOf endpoint. No bare-string ids; no invented extra uses; no satisfies of decision Specs. Duplicate-edge count 0. Resolved-target proof is the Manual QA body above. |
| **flaky_tests** | Single vitest run; 9 deterministic roster/uses/component-set mismatches, 17 pass. No timing/order flake. Manual QA is one deterministic graph query. |
| **misleading_success_output** | PASS. Asserted on Manual QA JSON contents (five ids, file/line, locality, 14 edges, uses sets, implementations), not bare validate exit alone. Validate 0 coexists with expected oracle red until todo 15. Baseline green validate was the unchanged-code extraction baseline, not the Manual-QA pass criterion. |
| **wrong_location** | N/A — main checkout `/home/darkomijic/dev-libar/software-delivery-protocol` on `feature/architectural-patterns-views`. |
| **partial_commit / history rewrite** | N/A — no commit, reset, rebase, or push (serialized landing after independent verify). |
| **secret / out-of-scope edit** | N/A — only the five planned source files + this evidence file. No tests/shared oracles/totals/state/plan/Boulder/ledger writes. |
| **race_condition** | N/A — no concurrent writers on the five task-4 target files during this slice; query is a single-process derivation. |
| **time_dependent** | N/A — no clocks, sleeps, or wall-clock assertions. |

### Probe N/A reasons (explicit)

- **wrong_location**: work stayed in the named checkout/branch; no alternate worktree.
- **partial_commit / history rewrite**: landing is serialized later; this step authors only.
- **secret / out-of-scope edit**: no credentials; no roster/test/plan/Boulder/ledger writes; no extra uses or behavior changes beyond the planned facts.
- **race_condition**: single-process extract; task-4 files were not sibling-owned.
- **time_dependent**: graph identity is source text, not time.

## Cleanup

Removed operator QA/recipe body temps `/tmp/task4-qa.js`, `/tmp/task4-recipe1.js`, `/tmp/task4-recipe2.js` after capture. No scratch anchors or partial drafts left outside the five product files and this evidence path. No `git` mutations. `void` references keep lint clean without exports. Validate's `generated/` output is gitignored and was left as the ordinary validate sink (not treated as graph truth).

## Verdict

**IMPLEMENTATION PASS (five nodes, fourteen facts).**

- Two new components and three new impls landed as trusted top-level `codeAnchor` constants.
- Existing CLI import impl gained `memberOf` import; CLI component uses uniquely include import.
- Locality 18/9/8/18/9 (≤24); validate 0 errors; live graph Manual QA PASS with resolved satisfies/memberOf/uses, exact file/line, no duplicates/unresolved.
- Graph-test red is exclusively shared todo-15 roster/totals (plus sibling-wave deltas), classified once.
- Diagnostics: prettier/eslint/tsc clean; LSP daemon unreachable (noted).
- Evidence + scoped product diff only. No commit.
