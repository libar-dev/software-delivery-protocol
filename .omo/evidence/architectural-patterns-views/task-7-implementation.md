# Task 7 implementation — Widen CLI anchor coverage

Branch: `feature/architectural-patterns-views` @ `723bf95c9975303cef5896c8b97f454e1786a3aa`
Captured: `2026-08-21T01:52:47Z`
Baseline: `.omo/evidence/architectural-patterns-views/task-7-baseline.md`

## Scope executed

All four planned units are lawful (baseline Spec-text gate). Shared oracle rosters/totals deferred to todo 15.
No commit/push. No test/roster/state edits. `src/cli/new-spec-command.ts` remains a planned skip (no realizing Spec).

| File | Planned `satisfies` | Action |
|---|---|---|
| `src/cli/sdp.ts` | `spec:consumers.agent-surface` | **anchored** |
| `src/cli/census-command.ts` | `spec:consumers.census-page` | **anchored** |
| `src/cli/mermaid-command.ts` | `spec:consumers.mermaid-view` | **anchored** |
| `src/cli/gherkin-command.ts` | `spec:consumers.gherkin-view` | **anchored** |
| `src/cli/new-spec-command.ts` | _(none — planned skip)_ | **skipped** (no realizing Spec; `spec:consumers.graph-first-planning` non-decision) |

## Diff (product only)

Each of the four files (+10 lines): trusted imports + one top-level `codeAnchor` constant + `void` keep-alive, no behavior change, no `uses`.

`src/cli/sdp.ts`:

- imports: `codeAnchorId`, `componentAnchorId`, `ref` from `../ids.js`; `codeAnchor` from `../model/code-anchor.js`
- top-level const `agentSurfaceCliAnchor` immediately above `runSdpCli`
- `id: impl:protocol.agent-surface-cli`
- `satisfies: spec:consumers.agent-surface`
- `component: component:protocol.cli`
- `void agentSurfaceCliAnchor`

`src/cli/census-command.ts`:

- same trusted import style
- top-level const `censusPageCliAnchor` immediately above `runCensus`
- `id: impl:protocol.census-page-cli`
- `satisfies: spec:consumers.census-page`
- `component: component:protocol.cli`
- `void censusPageCliAnchor`

`src/cli/mermaid-command.ts`:

- same trusted import style
- top-level const `mermaidViewCliAnchor` immediately above `runMermaid`
- `id: impl:protocol.mermaid-view-cli`
- `satisfies: spec:consumers.mermaid-view`
- `component: component:protocol.cli`
- `void mermaidViewCliAnchor`

`src/cli/gherkin-command.ts`:

- same trusted import style
- top-level const `gherkinViewCliAnchor` immediately above `runGherkinView`
- `id: impl:protocol.gherkin-view-cli`
- `satisfies: spec:consumers.gherkin-view`
- `component: component:protocol.cli`
- `void gherkinViewCliAnchor`

Skip file: **no edits**. `rg codeAnchor` on `src/cli/new-spec-command.ts` is empty.

`git diff --stat -- src/cli/`:

```
 src/cli/census-command.ts  | 10 ++++++++++
 src/cli/gherkin-command.ts | 10 ++++++++++
 src/cli/mermaid-command.ts | 10 ++++++++++
 src/cli/sdp.ts             | 10 ++++++++++
 4 files changed, 40 insertions(+)
```

## Automated gates

| Gate | Result |
|---|---|
| Prettier `--check` on four product files | pass (`All matched files use Prettier code style!`) |
| ESLint on four product files | exit 0 (silent) |
| `tsc --noEmit -p tsconfig.json` | exit 0 (no target-file errors; silent) |
| LSP diagnostics on four product files | **daemon unreachable** (`~/.omo/lsp-daemon/v0.1.0/daemon.sock`); compensated by prettier + eslint + tsc file scope |
| `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` | **0 errors · 5 warnings** (pre-existing ready-without-verifier gaps, same five Specs as baseline) |

Validate pulse:

```
162 specs · 1 packs · 167 anchors → 330 nodes · 701 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings
```

Anchor count vs baseline green (157 anchors → 167): **+4 this task** plus **+6 sibling-wave anchors** already on the branch (task 5 extract bindings and other concurrent widening units). Spec count 162 and the five-warning set are branch-shared, not introduced by these four files.

## Manual QA — live `pnpm --silent sdp:q` (PASS)

Body (fresh derive; asserts CodeNodes, resolving `satisfies` + `memberOf`, locality ≤24, skip file stays empty; also re-runs baseline coverage table):

```js
const planned = [
  { file: "src/cli/sdp.ts", id: "impl:protocol.agent-surface-cli",
    satisfies: "spec:consumers.agent-surface", site: "export function runSdpCli",
    constant: "agentSurfaceCliAnchor" },
  { file: "src/cli/census-command.ts", id: "impl:protocol.census-page-cli",
    satisfies: "spec:consumers.census-page", site: "export function runCensus",
    constant: "censusPageCliAnchor" },
  { file: "src/cli/mermaid-command.ts", id: "impl:protocol.mermaid-view-cli",
    satisfies: "spec:consumers.mermaid-view", site: "export function runMermaid",
    constant: "mermaidViewCliAnchor" },
  { file: "src/cli/gherkin-command.ts", id: "impl:protocol.gherkin-view-cli",
    satisfies: "spec:consumers.gherkin-view", site: "export function runGherkinView",
    constant: "gherkinViewCliAnchor" },
];
const component = "component:protocol.cli";
const fs = await import("node:fs");
const codeNodes = graph.nodes.filter((n) => n.nodeType === "CodeNode");
const memberOf = graph.edges.filter((e) => e.type === "memberOf");
const satisfies = graph.edges.filter((e) => e.type === "satisfies");
const results = [];
for (const p of planned) {
  const node = codeNodes.find((n) => n.id === p.id);
  if (!node) throw new Error("missing " + p.id);
  if (node.file !== p.file) throw new Error("file mismatch " + p.id);
  const lines = fs.readFileSync(p.file, "utf8").split("\n");
  const anchorLine = lines.findIndex((l) => l.includes("const " + p.constant)) + 1;
  const siteLine = lines.findIndex((l) => l.includes(p.site)) + 1;
  const locality = Math.abs(anchorLine - siteLine);
  if (locality > 24) throw new Error(p.id + " locality " + locality);
  if (!satisfies.some((e) => e.from === p.id && e.to === p.satisfies))
    throw new Error(p.id + " missing satisfies");
  if (!memberOf.some((e) => e.from === p.id && e.to === component))
    throw new Error(p.id + " missing memberOf");
  if (!graph.nodes.some((n) => n.id === p.satisfies))
    throw new Error("unresolved " + p.satisfies);
  if (!graph.nodes.some((n) => n.id === component))
    throw new Error("unresolved component");
  results.push({
    id: p.id, file: node.file, line: node.line,
    anchorLine, siteLine, locality,
    satisfies: p.satisfies, memberOf: component,
  });
}
const skipFile = "src/cli/new-spec-command.ts";
if (codeNodes.some((n) => n.file === skipFile)) throw new Error("unexpected anchors in " + skipFile);
const missing = [];
for (const p of planned) {
  const nodesAt = codeNodes.filter((n) => n.file === p.file);
  const qualifying = nodesAt.filter((n) => {
    const isMember = memberOf.some((e) => e.from === n.id && e.to === component);
    const satOk = satisfies.some((e) => e.from === n.id && e.to === p.satisfies);
    return isMember && satOk;
  });
  if (qualifying.length === 0) missing.push(p.file);
}
if (missing.length > 0) throw new Error("cli anchor coverage missing: " + missing.join(","));
return {
  ok: true,
  results,
  skipped: [skipFile],
  cliMemberCount: memberOf.filter((e) => e.to === component).length,
  newSpecCodeNodes: codeNodes.filter((n) => n.file === skipFile).map((n) => n.id),
};
```

Observed (`--json`, exit 0):

```json
{
  "ok": true,
  "results": [
    {
      "id": "impl:protocol.agent-surface-cli",
      "file": "src/cli/sdp.ts",
      "line": 100,
      "anchorLine": 100,
      "siteLine": 114,
      "locality": 14,
      "satisfies": "spec:consumers.agent-surface",
      "memberOf": "component:protocol.cli"
    },
    {
      "id": "impl:protocol.census-page-cli",
      "file": "src/cli/census-command.ts",
      "line": 65,
      "anchorLine": 65,
      "siteLine": 74,
      "locality": 9,
      "satisfies": "spec:consumers.census-page",
      "memberOf": "component:protocol.cli"
    },
    {
      "id": "impl:protocol.mermaid-view-cli",
      "file": "src/cli/mermaid-command.ts",
      "line": 81,
      "anchorLine": 81,
      "siteLine": 90,
      "locality": 9,
      "satisfies": "spec:consumers.mermaid-view",
      "memberOf": "component:protocol.cli"
    },
    {
      "id": "impl:protocol.gherkin-view-cli",
      "file": "src/cli/gherkin-command.ts",
      "line": 65,
      "anchorLine": 65,
      "siteLine": 74,
      "locality": 9,
      "satisfies": "spec:consumers.gherkin-view",
      "memberOf": "component:protocol.cli"
    }
  ],
  "skipped": [
    "src/cli/new-spec-command.ts"
  ],
  "cliMemberCount": 11,
  "newSpecCodeNodes": []
}
```

PASS criteria met: four CodeNodes present with file/line; both `satisfies` and `memberOf` resolve for each; locality 14/9/9/9 ≤ 24; CLI membership 7 → 11 (+4); `new-spec-command.ts` remains coverage-empty; baseline sentinel `cli anchor coverage missing` no longer fires.

## Graph test once (classification only — rosters not updated here)

Command: `pnpm exec vitest run test/self-hosting-graph.test.ts` (single run).

```
Tests  8 failed | 18 passed (26)
```

All eight failures are shared todo-15 roster/totals lockstep debt plus current sibling-wave deltas. None indicate product-behavior breakage from these anchors:

| Failure | Classification |
|---|---|
| holds the frozen corpus totals | expected `anchors: 157` → live `167` (**+4 this task**, +6 sibling waves); also branch-shared `specs: 161` → `162` (todo 2 ruling, not this task) |
| rosters exactly the authored Spec, Pack, and anchor node ids | +`impl:protocol.agent-surface-cli`, +`impl:protocol.census-page-cli`, +`impl:protocol.mermaid-view-cli`, +`impl:protocol.gherkin-view-cli` (this task); plus sibling ids already live (`discover-files`, `protocol-bindings`, `graph-index`, `validation-contracts`, …); node list length 320 → 330 |
| derives exactly the authored declared relations | **not this task** — relation roster drift from parallel corpus work (no declared relations authored here) |
| holds the frozen stated-readiness distribution | **not this task** — readiness roster drift from parallel Spec edits |
| derives one binding edge per authored anchor | +4 satisfies bindings for the new CLI impls (this task) plus sibling bindings |
| gives every owned impl/api CodeNode exactly one component | +4 `memberOf` → `component:protocol.cli` (this task) plus sibling memberships |
| derives exactly the sparse authored component uses edges | **not this task** — no `uses` fields authored on these four constants; sibling-wave `uses` delta |
| projects every anchor and code node at the line its declaration occupies | +4 CodeNode projections at lines 100 / 65 / 81 / 65 (this task); oracle `expectedAnchors` still 157 |

**No other failure classes.** Locality invariant test did not fire on the new anchors because they are not yet on `expectedAnchors` (todo 15); Manual QA already proved locality ≤24 for all four.

## Skip recorded

Per baseline Spec-text gate and plan Scope OUT:

1. **`src/cli/new-spec-command.ts`** — no realizing Spec exists. `spec:consumers.graph-first-planning` records the E2 placement ruling for `sdp new spec` as a lawful non-decision that mints no Spec. File remains without any `codeAnchor`. No substitute Spec applied.

## UltraQA probes

| Probe | Result |
|---|---|
| **stale_state** | Manual QA used live `pnpm --silent sdp:q` (in-process derive). Validate rewrote `generated/` as a side effect; coverage claims did not read generated artifacts as authority. Working-tree source CLI files match the Manual QA file/line numbers. |
| **dirty_worktree** | Scoped product dirt: `M src/cli/sdp.ts`, `M src/cli/census-command.ts`, `M src/cli/mermaid-command.ts`, `M src/cli/gherkin-command.ts` only. Skip file clean. Evidence path untracked under `.omo/evidence/architectural-patterns-views/`. Pre-existing branch dirt outside this task’s scope left untouched. No commit. |
| **generated/cached** | `generated/graph.json` / contracts refreshed by validate; Manual QA re-derived. Not claimed as authority. |
| **malformed structural input** | Branded builders only (`codeAnchorId` / `componentAnchorId` / `ref`). Live graph resolves all four satisfies targets and `component:protocol.cli`. No `uses` invented. Invalid bare-string ids were not authored; resolved-target proof is the Manual QA body above. |
| **flaky_tests** | Single vitest run; 8 deterministic roster mismatches, 18 pass. No timing/order flake observed. |
| **misleading_success_output** | Asserted on Manual QA JSON contents (ids, file/line, locality, edge presence, skip emptiness), not bare validate exit alone. Validate 0 coexists with expected oracle red until todo 15. Baseline coverage sentinel inverted from exit 1 → exit 0 with `ok: true`. |
| **wrong_location** | N/A — main checkout `/home/darkomijic/dev-libar/software-delivery-protocol` on `feature/architectural-patterns-views`. |
| **partial_commit / history rewrite** | N/A — no commit, reset, rebase, or push. |
| **secret / out-of-scope edit** | N/A — only the four lawful source files + this evidence file. `new-spec-command.ts` untouched. |

### Probe N/A reasons (explicit)

- **wrong_location**: work stayed in the named checkout/branch; no alternate worktree.
- **partial_commit / history rewrite**: landing is serialized later; this step authors only.
- **secret / out-of-scope edit**: no credentials, no roster/test/plan/Boulder/ledger writes, no skip-file force-map.

## Cleanup

No temp files, scratch anchors, or partial drafts left outside the four product files and this evidence path. No `git` mutations. `void` references keep lint clean without exports.

## Verdict

**IMPLEMENTATION PASS (exact four anchors).**

- Four trusted top-level `codeAnchor` constants landed with component + satisfies only.
- Locality 14/9/9/9 (≤24); validate 0 errors; live graph Manual QA PASS.
- Planned skip preserved: `new-spec-command.ts` has no new anchor.
- Graph-test red is exclusively shared todo-15 roster/totals plus sibling-wave deltas, classified once.
- Diagnostics: prettier/eslint/tsc clean; LSP daemon unreachable (noted).
- Evidence + scoped product diff only. No commit.
