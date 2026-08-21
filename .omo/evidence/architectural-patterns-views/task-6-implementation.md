# Task 6 implementation — Widen graph, validate, and reader anchor coverage

Branch: `feature/architectural-patterns-views` @ `723bf95c9975303cef5896c8b97f454e1786a3aa`
Captured: `2026-08-21T01:52:17Z`
Baseline: `.omo/evidence/architectural-patterns-views/task-6-baseline.md`

## Scope executed

All five planned units (baseline Spec-text gate: 5/5 suitable). Shared oracle rosters/totals deferred to todo 15.
No commit/push. No test/roster/state edits.

| File | Planned `satisfies` / edge | Action |
|---|---|---|
| `src/graph/delivery-facts.ts` | `spec:extraction.derive-graph` · memberOf `component:protocol.graph` | **anchored** |
| `src/graph/example-space.ts` | `spec:extraction.executable-contracts` · memberOf `component:protocol.graph` | **anchored** |
| `src/validate/graph-index.ts` | `spec:validation.two-check-families` · memberOf `component:protocol.validate` | **anchored** |
| `src/validate/contracts.ts` | `spec:validation.two-check-families` · memberOf `component:protocol.validate` | **anchored** |
| `src/reader/reader.ts` (`readerComponentAnchor`) | `uses` → `component:protocol.model` | **extended** |

No other `uses` fields, no behavior changes, no skips.

## Diff (product only)

`src/graph/delivery-facts.ts` (+10):

- trusted imports: `codeAnchorId`, `componentAnchorId`, `ref` from `../ids.js`; `codeAnchor` from `../model/code-anchor.js`
- top-level const `deliveryFactsAnchor` immediately above `computeDeliveryFacts`
- `id: impl:protocol.delivery-facts`
- `satisfies: spec:extraction.derive-graph`
- `component: component:protocol.graph`
- `void deliveryFactsAnchor`
- no `uses`

`src/graph/example-space.ts` (+10):

- same trusted import style
- top-level const `exampleSpaceAnchor` immediately above `resolveExampleVocabulary`
- `id: impl:protocol.example-space`
- `satisfies: spec:extraction.executable-contracts`
- `component: component:protocol.graph`
- `void exampleSpaceAnchor`
- no `uses`

`src/validate/graph-index.ts` (+10):

- same trusted import style
- top-level const `graphIndexAnchor` immediately above `buildGraphIndex`
- `id: impl:protocol.graph-index`
- `satisfies: spec:validation.two-check-families`
- `component: component:protocol.validate`
- `void graphIndexAnchor`
- no `uses`

`src/validate/contracts.ts` (+10):

- same trusted import style
- top-level const `validationContractsAnchor` immediately above `validatorFamilies`
- `id: impl:protocol.validation-contracts`
- `satisfies: spec:validation.two-check-families`
- `component: component:protocol.validate`
- `void validationContractsAnchor`
- no `uses`

`src/reader/reader.ts` (+1):

- append `componentAnchorId("component:protocol.model")` to existing unique `uses` list on `readerComponentAnchor`
- no new CodeNode; no other uses invented

`git diff --stat` (product only):

```
 src/graph/delivery-facts.ts | 10 ++++++++++
 src/graph/example-space.ts  | 10 ++++++++++
 src/reader/reader.ts        |  1 +
 src/validate/contracts.ts   | 10 ++++++++++
 src/validate/graph-index.ts | 10 ++++++++++
 5 files changed, 41 insertions(+)
```

## Automated gates

| Gate | Result |
|---|---|
| Prettier `--check` on five files | pass (`All matched files use Prettier code style!`) |
| ESLint on five files | exit 0 |
| `tsc --noEmit -p tsconfig.json` | exit 0 |
| LSP diagnostics on five files | **daemon unreachable** (`~/.omo/lsp-daemon/.../daemon.sock`); compensated by prettier + eslint + tsc file scope |
| `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` | **0 errors · 5 warnings** (pre-existing ready-without-verifier gaps, same five Specs as baseline) |

Validate pulse:

```
162 specs · 1 packs · 163 anchors → 326 nodes · 693 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings
```

Anchor-count reading: baseline green was 157 anchors; parallel unlanded wave work already present in the worktree (task 5 extract anchors and sibling CLI/etc.) moves the live count. This task authors **four** new `codeAnchor` constants + one structural `uses` edge on an existing component. Spec count 162 and the five honesty/gaps warnings are branch-shared, not introduced by these five files.

## Manual QA — live `pnpm --silent sdp:q` (PASS)

Body (fresh derive; asserts four CodeNodes, resolving `satisfies` + `memberOf`, locality ≤24, reader→model uses):

```js
const planned = [
  { file: "src/graph/delivery-facts.ts", id: "impl:protocol.delivery-facts",
    satisfies: "spec:extraction.derive-graph", component: "component:protocol.graph",
    site: "export function computeDeliveryFacts", constant: "deliveryFactsAnchor" },
  { file: "src/graph/example-space.ts", id: "impl:protocol.example-space",
    satisfies: "spec:extraction.executable-contracts", component: "component:protocol.graph",
    site: "export function resolveExampleVocabulary", constant: "exampleSpaceAnchor" },
  { file: "src/validate/graph-index.ts", id: "impl:protocol.graph-index",
    satisfies: "spec:validation.two-check-families", component: "component:protocol.validate",
    site: "export function buildGraphIndex", constant: "graphIndexAnchor" },
  { file: "src/validate/contracts.ts", id: "impl:protocol.validation-contracts",
    satisfies: "spec:validation.two-check-families", component: "component:protocol.validate",
    site: "export const validatorFamilies", constant: "validationContractsAnchor" },
];
const fs = await import("node:fs");
const codeNodes = graph.nodes.filter((n) => n.nodeType === "CodeNode");
const memberOf = graph.edges.filter((e) => e.type === "memberOf");
const satisfies = graph.edges.filter((e) => e.type === "satisfies");
const uses = graph.edges.filter((e) => e.type === "uses");
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
  if (!memberOf.some((e) => e.from === p.id && e.to === p.component))
    throw new Error(p.id + " missing memberOf");
  if (!graph.nodes.some((n) => n.id === p.satisfies))
    throw new Error("unresolved " + p.satisfies);
  if (!graph.nodes.some((n) => n.id === p.component))
    throw new Error("unresolved component " + p.component);
  results.push({
    id: p.id, file: node.file, line: node.line,
    anchorLine, siteLine, locality,
    satisfies: p.satisfies, memberOf: p.component,
  });
}
const readerToModel = uses.some(
  (e) => e.from === "component:protocol.reader" && e.to === "component:protocol.model",
);
if (!readerToModel) throw new Error("missing reader→model uses");
if (!graph.nodes.some((n) => n.id === "component:protocol.model"))
  throw new Error("unresolved component:protocol.model");
const readerUses = uses
  .filter((e) => e.from === "component:protocol.reader")
  .map((e) => e.to)
  .sort();
return {
  ok: true,
  results,
  readerUses,
  readerToModel,
  graphMemberCount: memberOf.filter((e) => e.to === "component:protocol.graph").length,
  validateMemberCount: memberOf.filter((e) => e.to === "component:protocol.validate").length,
};
```

Observed (`--json`, exit 0):

```json
{
  "ok": true,
  "results": [
    {
      "id": "impl:protocol.delivery-facts",
      "file": "src/graph/delivery-facts.ts",
      "line": 74,
      "anchorLine": 74,
      "siteLine": 82,
      "locality": 8,
      "satisfies": "spec:extraction.derive-graph",
      "memberOf": "component:protocol.graph"
    },
    {
      "id": "impl:protocol.example-space",
      "file": "src/graph/example-space.ts",
      "line": 122,
      "anchorLine": 122,
      "siteLine": 130,
      "locality": 8,
      "satisfies": "spec:extraction.executable-contracts",
      "memberOf": "component:protocol.graph"
    },
    {
      "id": "impl:protocol.graph-index",
      "file": "src/validate/graph-index.ts",
      "line": 28,
      "anchorLine": 28,
      "siteLine": 36,
      "locality": 8,
      "satisfies": "spec:validation.two-check-families",
      "memberOf": "component:protocol.validate"
    },
    {
      "id": "impl:protocol.validation-contracts",
      "file": "src/validate/contracts.ts",
      "line": 5,
      "anchorLine": 5,
      "siteLine": 13,
      "locality": 8,
      "satisfies": "spec:validation.two-check-families",
      "memberOf": "component:protocol.validate"
    }
  ],
  "readerUses": [
    "component:protocol.graph",
    "component:protocol.model",
    "component:protocol.validate"
  ],
  "readerToModel": true,
  "graphMemberCount": 5,
  "validateMemberCount": 15
}
```

PASS criteria met:

- all four CodeNodes present with file/line
- all four `satisfies` and `memberOf` resolve
- locality 8/8/8/8 (≤24)
- `component:protocol.reader` → `component:protocol.model` uses present and target resolves
- graph membership 3 → 5 (+delivery-facts, +example-space); validate membership 13 → 15 (+graph-index, +validation-contracts) relative to baseline component lists (live counts may also include parallel wave anchors already in the worktree)

Baseline failing sentinel `graph-validate-reader coverage missing` no longer applies: the five missing facts are present.

## Graph test once (classification only — rosters not updated here)

Command: `npx vitest run test/self-hosting-graph.test.ts` (single run).

```
Tests  8 failed | 18 passed (26)
```

Exit 1. All eight failures are shared todo-15 roster/totals lockstep debt and/or current sibling unlanded wave deltas. None indicate product-behavior breakage from these anchors:

| Failure | Classification |
|---|---|
| holds the frozen corpus totals | expected anchor/node/edge inflation from this task (+4 anchors, +4 nodes, +memberOf×4 +satisfies×4 +uses×1) plus sibling unlanded wave anchors already in the worktree; also branch-shared `specs: 161` → `162` (todo 2 ruling, not this task) |
| rosters exactly the authored Spec, Pack, and anchor node ids | +`impl:protocol.delivery-facts`, +`impl:protocol.example-space`, +`impl:protocol.graph-index`, +`impl:protocol.validation-contracts` (this task); plus sibling wave ids (e.g. CLI mermaid, extract protocol-bindings) not owned by this task |
| derives exactly the authored declared relations | **not this task** — relation roster drift from parallel corpus work (no declared relations authored here) |
| holds the frozen stated-readiness distribution | **not this task** — readiness roster drift from parallel Spec edits |
| derives one binding edge per authored anchor | +4 satisfies bindings for the new impls (this task) + sibling wave bindings |
| gives every owned impl/api CodeNode exactly one component | +4 `memberOf` (2→graph, 2→validate) from this task + sibling wave memberships |
| derives exactly the sparse authored component uses edges | +1 uses edge `component:protocol.reader` → `component:protocol.model` (this task); oracle sparse uses list not yet updated (todo 15) |
| projects every anchor and code node at the line its declaration occupies | +4 CodeNode projections at lines 74 / 122 / 28 / 5 (this task); oracle `expectedAnchors` still frozen |

**No other failure classes.** Locality invariant test did not fire on the new anchors because they are not yet on `expectedAnchors` (todo 15); Manual QA already proved locality 8 for all four.

## UltraQA probes

| Probe | Result |
|---|---|
| **stale_state** | Manual QA used live `pnpm --silent sdp:q` (in-process derive). Validate rewrote `generated/` as a side effect; coverage claims did not read generated artifacts as authority. HEAD still `723bf95c9975303cef5896c8b97f454e1786a3aa` (no commit). |
| **dirty_worktree** | Scoped product dirt: `M src/graph/delivery-facts.ts`, `M src/graph/example-space.ts`, `M src/validate/graph-index.ts`, `M src/validate/contracts.ts`, `M src/reader/reader.ts` only for this task. Evidence path untracked under `.omo/evidence/architectural-patterns-views/`. Sibling unlanded wave dirt outside this task’s five files left untouched. No commit. |
| **generated/cached** | `generated/graph.json` / contracts refreshed by validate; Manual QA re-derived. Not claimed as authority. |
| **malformed structural input** | Branded builders only (`codeAnchorId` / `componentAnchorId` / `ref`). Live graph resolves all four satisfies targets, both components (`component:protocol.graph`, `component:protocol.validate`), and `component:protocol.model` for the new uses edge. No bare-string ids authored; no invented extra `uses` on the four new impls. Resolved-target proof is the Manual QA body above. |
| **flaky_tests** | Single vitest run; 8 deterministic roster/uses mismatches, 18 pass. No timing/order flake observed. |
| **misleading_success_output** | Asserted on Manual QA JSON contents (ids, file/line, locality, edge presence, readerUses including model), not bare validate exit alone. Validate 0 coexists with expected oracle red until todo 15. Baseline green validate is not coverage. |
| **wrong_location** | N/A — main checkout `/home/darkomijic/dev-libar/software-delivery-protocol` on `feature/architectural-patterns-views`. |
| **partial_commit / history rewrite** | N/A — no commit, reset, rebase, or push (serialized landing on one normal checkout). |
| **secret / out-of-scope edit** | N/A — only the five planned source files + this evidence file. No tests/shared oracles/totals/state/plan/Boulder/ledger writes. |

### Probe N/A reasons (explicit)

- **wrong_location**: work stayed in the named checkout/branch; no alternate worktree.
- **partial_commit / history rewrite**: landing is serialized later; this step authors only.
- **secret / out-of-scope edit**: no credentials; no roster/test/plan/Boulder/ledger writes; no extra uses or behavior changes beyond the five planned facts.

## Cleanup

No temp files, scratch anchors, or partial drafts left outside the five product files and this evidence path. No `git` mutations. `void` references keep lint clean without exports. No force-map of mismatched Specs (none skipped).

## Verdict

**IMPLEMENTATION PASS (all five planned facts).**

- Four trusted top-level `codeAnchor` constants landed with component + satisfies only.
- Reader component `uses` extended uniquely with `component:protocol.model`.
- Locality 8/8/8/8 (≤24); validate 0 errors; live graph Manual QA PASS with resolved satisfies/memberOf/uses and file/line.
- Graph-test red is exclusively shared todo-15 roster/totals (plus parallel corpus/sibling-wave drift on relations/readiness/specs/uses), classified once.
- Diagnostics: prettier/eslint/tsc clean; LSP daemon unreachable (noted).
- Evidence + scoped product diff only. No commit.

## Residual correction — JSDoc adjacency on `example-space.ts`

Captured: `2026-08-21T02:08:28Z`

### Residual

Independent review: the new `exampleSpaceAnchor` was inserted **between** the existing JSDoc block and `export function resolveExampleVocabulary`, so TypeScript attached that JSDoc to the `const` instead of the function.

### Fix (single product file)

`src/graph/example-space.ts` only — moved the anchor block **above** the JSDoc so the comment is again immediately adjacent to the function. Id / satisfies / memberOf / label unchanged. No other product file touched.

Order after fix:

```
117|const exampleSpaceAnchor = codeAnchor({
...
123|void exampleSpaceAnchor;
124|
125|/**
126| * Resolve an example's used step skeletons ...
129| */
130|export function resolveExampleVocabulary(
```

### Re-gates

| Gate | Result |
|---|---|
| Prettier `--check src/graph/example-space.ts` | pass |
| ESLint `src/graph/example-space.ts` | exit 0 |
| `tsc --noEmit -p tsconfig.json` | exit 0 |
| `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` | **0 errors · 5 warnings** (same five honesty/gaps) |

### Live `sdp:q` (example-space fact + JSDoc adjacency)

```json
{
  "ok": true,
  "id": "impl:protocol.example-space",
  "file": "src/graph/example-space.ts",
  "line": 117,
  "anchorLine": 117,
  "siteLine": 130,
  "locality": 13,
  "jsdocOpen": 125,
  "jsdocImmediatelyAboveFn": true,
  "anchorBeforeJsdoc": true,
  "satisfies": "spec:extraction.executable-contracts",
  "memberOf": "component:protocol.graph"
}
```

Proofs:

- `jsdocImmediatelyAboveFn: true` — line immediately above the export is `*/`
- `anchorBeforeJsdoc: true` — anchor at 117, JSDoc opens at 125
- locality **13** ≤ 24 (was 8 when anchor sat between JSDoc and fn)
- graph line projection **117**; satisfies/memberOf still resolve

Other four facts from the main implementation section are unchanged (delivery-facts / graph-index / validation-contracts / reader→model).

### Cleanup

No temp files; no commit/push; only `src/graph/example-space.ts` + this evidence append.
