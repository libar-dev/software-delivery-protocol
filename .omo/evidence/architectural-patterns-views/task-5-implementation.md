# Task 5 implementation — Widen extract-family anchor coverage (lawful subset)

Branch: `feature/architectural-patterns-views` @ `723bf95c9975303cef5896c8b97f454e1786a3aa`
Captured: `2026-08-21T01:48:18Z`
Baseline: `.omo/evidence/architectural-patterns-views/task-5-baseline.md`

## Scope executed

Lawful units only (baseline Spec-text gate). Shared oracle rosters/totals deferred to todo 15.
No commit/push. No test/roster/state edits.

| File | Planned `satisfies` | Action |
|---|---|---|
| `src/extract/discover.ts` | `spec:extraction.excludes` | **anchored** |
| `src/extract/protocol-bindings.ts` | `spec:model.anchors` | **anchored** |
| `src/extract/carrier.ts` | `spec:extraction.runnable-modules` | **skipped** (target mismatch) |
| `src/extract/reify.ts` | `spec:extraction.runnable-modules` | **skipped** (target mismatch) |

## Diff (product only)

`src/extract/discover.ts` (+11):

- trusted imports: `codeAnchorId`, `componentAnchorId`, `ref` from `../ids.js`; `codeAnchor` from `../model/code-anchor.js`
- top-level const `discoverFilesAnchor` immediately above `normalizeExcludes`
- `id: impl:protocol.discover-files`
- `satisfies: spec:extraction.excludes`
- `component: component:protocol.extract`
- `void discoverFilesAnchor`
- no `uses`

`src/extract/protocol-bindings.ts` (+11):

- same trusted import style
- top-level const `protocolBindingsAnchor` immediately above `protocolBindingScopeFor`
- `id: impl:protocol.protocol-bindings`
- `satisfies: spec:model.anchors`
- `component: component:protocol.extract`
- `void protocolBindingsAnchor`
- no `uses`

Skipped files: **no edits**. `rg codeAnchor` on `carrier.ts` is empty; `reify.ts` only mentions `codeAnchorId` as ID-unwrap vocabulary (pre-existing).

## Automated gates

| Gate | Result |
|---|---|
| Prettier `--check` on both files | pass |
| ESLint on both files | exit 0 |
| `tsc --noEmit -p tsconfig.json` | exit 0 (no target-file errors) |
| LSP diagnostics on both files | **daemon unreachable** (`~/.omo/lsp-daemon/.../daemon.sock`); compensated by prettier + eslint + tsc file scope |
| `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` | **0 errors · 5 warnings** (pre-existing ready-without-verifier gaps, same five Specs as baseline) |

Validate pulse:

```
162 specs · 1 packs · 159 anchors → 322 nodes · 684 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings
```

Anchor count delta vs baseline green (157 anchors → 159) matches the two new bindings. Spec count 162 and warning set are branch-shared (todo 2 ruling and unrelated honesty gaps), not introduced by these two files.

## Manual QA — live `pnpm --silent sdp:q` (PASS)

Body (fresh derive; asserts CodeNodes, resolving `satisfies` + `memberOf`, locality ≤24, skipped files stay empty):

```js
const planned = [
  { file: "src/extract/discover.ts", id: "impl:protocol.discover-files",
    satisfies: "spec:extraction.excludes", site: "export function normalizeExcludes",
    constant: "discoverFilesAnchor" },
  { file: "src/extract/protocol-bindings.ts", id: "impl:protocol.protocol-bindings",
    satisfies: "spec:model.anchors", site: "export function protocolBindingScopeFor",
    constant: "protocolBindingsAnchor" },
];
const component = "component:protocol.extract";
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
for (const f of ["src/extract/carrier.ts", "src/extract/reify.ts"]) {
  if (codeNodes.some((n) => n.file === f)) throw new Error("unexpected anchors in " + f);
}
return {
  ok: true,
  results,
  skipped: ["src/extract/carrier.ts", "src/extract/reify.ts"],
  extractMemberCount: memberOf.filter((e) => e.to === component).length,
};
```

Observed (`--json`, exit 0):

```json
{
  "ok": true,
  "results": [
    {
      "id": "impl:protocol.discover-files",
      "file": "src/extract/discover.ts",
      "line": 35,
      "anchorLine": 35,
      "siteLine": 43,
      "locality": 8,
      "satisfies": "spec:extraction.excludes",
      "memberOf": "component:protocol.extract"
    },
    {
      "id": "impl:protocol.protocol-bindings",
      "file": "src/extract/protocol-bindings.ts",
      "line": 82,
      "anchorLine": 82,
      "siteLine": 90,
      "locality": 8,
      "satisfies": "spec:model.anchors",
      "memberOf": "component:protocol.extract"
    }
  ],
  "skipped": [
    "src/extract/carrier.ts",
    "src/extract/reify.ts"
  ],
  "extractMemberCount": 13
}
```

PASS criteria met: both CodeNodes present with file/line; both `satisfies` and `memberOf` resolve; locality 8 ≤ 24; extract membership 11 → 13; skipped files remain coverage-empty under the planned (mismatched) mapping.

## Graph test once (classification only — rosters not updated here)

Command: `npx vitest run test/self-hosting-graph.test.ts` (single run).

```
Tests  7 failed | 19 passed (26)
```

All seven failures are shared todo-15 roster/totals lockstep debt. None indicate product-behavior breakage from these anchors:

| Failure | Classification |
|---|---|
| holds the frozen corpus totals | expected `anchors: 157` → live `159` (+2 this task); also branch-shared `specs: 161` → `162` (todo 2 ruling, not this task) |
| rosters exactly the authored Spec, Pack, and anchor node ids | +`impl:protocol.discover-files`, +`impl:protocol.protocol-bindings` (this task); node list length 320 → 322 |
| derives exactly the authored declared relations | **not this task** — relation roster drift from parallel corpus work (no declared relations authored here) |
| holds the frozen stated-readiness distribution | **not this task** — readiness roster drift from parallel Spec edits |
| derives one binding edge per authored anchor | +2 satisfies bindings for the new impls (this task) |
| gives every owned impl/api CodeNode exactly one component | +2 `memberOf` → `component:protocol.extract` (this task) |
| projects every anchor and code node at the line its declaration occupies | +2 CodeNode projections at lines 35 / 82 (this task); oracle `expectedAnchors` still 157 |

**No other failure classes.** Locality invariant test did not fire on the new anchors because they are not yet on `expectedAnchors` (todo 15); Manual QA already proved locality 8 for both.

## Skips recorded (mismatches)

Per baseline Spec-text gate and plan QA-failure path:

1. **`src/extract/carrier.ts` → `spec:extraction.runnable-modules`** — Spec freezes adopter-facing derived runnable-module / registrar interface (codegen). `carrier.ts` reifies TypeScript carriers (`reifyTypeScriptCarrier`). No substitute Spec applied.
2. **`src/extract/reify.ts` → `spec:extraction.runnable-modules`** — same Spec; `reify.ts` is static AST reification of carriers/anchors, not registrar codegen. No substitute Spec applied.

Both files remain without new anchors after this task.

## UltraQA probes

| Probe | Result |
|---|---|
| **stale_state** | Manual QA used live `pnpm --silent sdp:q` (in-process derive). Validate rewrote `generated/` as a side effect; coverage claims did not read generated artifacts as authority. |
| **dirty_worktree** | Scoped product dirt: `M src/extract/discover.ts`, `M src/extract/protocol-bindings.ts` only. Skipped files clean. Evidence path untracked under `.omo/evidence/architectural-patterns-views/`. Pre-existing branch dirt outside this task’s scope left untouched. No commit. |
| **generated/cached** | `generated/graph.json` / contracts refreshed by validate; Manual QA re-derived. Not claimed as authority. |
| **malformed structural input** | Branded builders only (`codeAnchorId` / `componentAnchorId` / `ref`). Live graph resolves both satisfies targets and `component:protocol.extract`. No `uses` invented. Invalid bare-string ids were not authored; resolved-target proof is the Manual QA body above. |
| **flaky_tests** | Single vitest run; 7 deterministic roster mismatches, 19 pass. No timing/order flake observed. |
| **misleading_success_output** | Asserted on Manual QA JSON contents (ids, file/line, locality, edge presence, skip emptiness), not bare validate exit alone. Validate 0 coexists with expected oracle red until todo 15. |
| **wrong_location** | N/A — main checkout `/home/darkomijic/dev-libar/software-delivery-protocol` on `feature/architectural-patterns-views`. |
| **partial_commit / history rewrite** | N/A — no commit, reset, rebase, or push. |
| **secret / out-of-scope edit** | N/A — only the two lawful source files + this evidence file. |

### Probe N/A reasons (explicit)

- **wrong_location**: work stayed in the named checkout/branch; no alternate worktree.
- **partial_commit / history rewrite**: landing is serialized later; this step authors only.
- **secret / out-of-scope edit**: no credentials, no roster/test/plan/Boulder/ledger writes, no skipped-file force-map.

## Cleanup

No temp files, scratch anchors, or partial drafts left outside the two product files and this evidence path. No `git` mutations. `void` references keep lint clean without exports.

## Verdict

**IMPLEMENTATION PASS (lawful subset).**

- Two trusted top-level `codeAnchor` constants landed with component + satisfies only.
- Locality 8/8 (≤24); validate 0 errors; live graph Manual QA PASS.
- Two planned mismatches skipped and recorded; `carrier.ts` / `reify.ts` unchanged.
- Graph-test red is exclusively shared todo-15 roster/totals (plus parallel corpus drift on relations/readiness/specs), classified once.
- Diagnostics: prettier/eslint/tsc clean; LSP daemon unreachable (noted).
- Evidence + scoped product diff only. No commit.
