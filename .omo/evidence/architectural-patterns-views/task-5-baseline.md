# Task 5 baseline — Widen extract-family anchor coverage

Evidence-only Manual-QA proof. No `src/`, test, plan, Boulder, or ledger edits in this step.
Branch: `feature/architectural-patterns-views` @ `723bf95c9975303cef5896c8b97f454e1786a3aa`
Captured: `2026-08-21T01:39:23Z`

## Plan unit (task 5)

Add `codeAnchor` calls in:

| Source file | Planned `satisfies` |
|---|---|
| `src/extract/carrier.ts` | `spec:extraction.runnable-modules` |
| `src/extract/reify.ts` | `spec:extraction.runnable-modules` |
| `src/extract/discover.ts` | `spec:extraction.excludes` |
| `src/extract/protocol-bindings.ts` | `spec:model.anchors` |

Component membership for each new impl: `component:protocol.extract`.
Shared rosters deferred to todo 15. Scope OUT incidental plumbing does **not** list these four files.

## Source-locality observations

None of the four target files currently import `codeAnchor` / `codeAnchorId` / `componentAnchorId` or declare an anchor constant.

| File | Role (from exports / header) | Anchor present? |
|---|---|---|
| `src/extract/carrier.ts` (92 LOC) | TypeScript carrier boundary: `reifyTypeScriptCarrier`; re-exports Markdown/Gherkin reifiers | **no** |
| `src/extract/reify.ts` (1734 LOC) | Static AST reification of `*.sdp.ts` carriers and anchor-constant forms (`reifySourceFile`, builder/id reifiers) | **no** (mentions `codeAnchorId` only as ID-unwrap vocabulary) |
| `src/extract/discover.ts` (166 LOC) | Discovery + exclusion: `normalizeExcludes`, `discoverFiles` | **no** |
| `src/extract/protocol-bindings.ts` (162 LOC) | Protocol builder-import trust: `protocolBindingScopeFor`, `collectProtocolBindings` | **no** |

Existing `component:protocol.extract` membership (11 impl CodeNodes, **none** of the four files):

```
impl:protocol.anchor-extraction          src/extract/anchors.ts:41       → spec:model.anchors
impl:protocol.derive-graph               src/extract/derive.ts:115       → spec:extraction.derive-graph
impl:protocol.duplicate-id-exclusion     src/extract/index.ts:88         → spec:validation.duplicate-ids
impl:protocol.envelope-contract          src/extract/markdown.ts:18      → spec:carrier.envelope-contract
impl:protocol.exclusion-surface          src/extract/index.ts:39         → spec:extraction.excludes
impl:protocol.extract                    src/extract/index.ts:192        → spec:extraction.derive-graph
impl:protocol.gherkin-authoring          src/extract/gherkin.ts:1225     → spec:carrier.gherkin-authoring
impl:protocol.markdown-authoring         src/extract/markdown.ts:50      → spec:carrier.markdown-authoring
impl:protocol.markdown-pack-authoring    src/extract/markdown-pack.ts:115 → spec:carrier.markdown-pack-authoring
impl:protocol.markdown-parser            src/extract/markdown.ts:57      → spec:carrier.markdown-parser
impl:protocol.prose-ownership            src/extract/markdown.ts:32      → spec:carrier.prose-ownership-rule
```

Component node itself: `component:protocol.extract` at `src/extract/index.ts:180` (label "Protocol extraction seam"), satisfies `spec:extraction.derive-graph`.

Live `g.byFile` on each planned path (empty → coverage-unknown for file-level impact):

```json
{
  "src/extract/carrier.ts": { "nodes": [], "specs": [] },
  "src/extract/reify.ts": { "nodes": [], "specs": [] },
  "src/extract/discover.ts": { "nodes": [], "specs": [] },
  "src/extract/protocol-bindings.ts": { "nodes": [], "specs": [] }
}
```

## Target Spec suitability (text verified before accepting mapping)

Graph `g.specContext` + carrier prose under `specs/`. **No silent substitution** of planned targets.

### 1. `src/extract/discover.ts` → `spec:extraction.excludes` — **SUITABLE (lawful)**

- Title: "Extraction exclusions are strict consumer input"
- Kind/altitude/readiness: `rule` / `feature` / stated+derived `ready`
- Intent outcome: "Keep consumer-selected omissions precise without changing the extractor's canonical discovery rules."
- Carrier Rule clause (verbatim intent): *"The realizing entrypoints are `normalizeExcludes` and `discoverFiles` in `src/extract/discover.ts`."*
- Both named exports exist in that file (`normalizeExcludes` L32, `discoverFiles` L154).
- Current implementers (graph): only `impl:protocol.exclusion-surface` @ `src/extract/index.ts:39` — **not** the realizing file the Spec names.
- Delivery facts already `implemented` + `has-verifier` via the index surface; discover itself still has zero CodeNodes.

### 2. `src/extract/protocol-bindings.ts` → `spec:model.anchors` — **SUITABLE (lawful)**

- Title: "Source anchors bind code without carrying intent"
- Kind/altitude/readiness: `model` / `feature` / stated+derived `ready`
- Model clause **Protocol builder binding** / **untrusted builder** ends with: *"The realizing entrypoints are `protocolBindingScopeFor` and `collectProtocolBindings` in `src/extract/protocol-bindings.ts`."*
- Both named exports exist (`protocolBindingScopeFor` L79, `collectProtocolBindings` L130).
- Current implementers: `impl:protocol.anchor-extraction` @ `src/extract/anchors.ts:41`, `impl:protocol.anchor-model` @ `src/model/anchors.ts:76` — binding-file itself unanchored.
- Delivery facts already `implemented` + `has-verifier` via other files; protocol-bindings still has zero CodeNodes.

### 3. `src/extract/carrier.ts` → `spec:extraction.runnable-modules` — **MISMATCH (not lawful under plan mapping)**

- Spec title: "Derived runnable modules freeze the registrar interface"
- Outcome: freeze the **adopter-facing derived-runnable-module / registrar** interface (codegen registrars, five adapters, three-way comparator, authored→generated import direction).
- Existing implementers: `component:protocol.codegen` and `impl:protocol.runnable-modules`, both @ `src/codegen/contracts.ts` (L962 / L977).
- `carrier.ts` realizes TypeScript **carrier reification** (`reifyTypeScriptCarrier`), not registrar codegen. Spec prose never names carrier reification, `carrier.ts`, or extract-family AST boundaries.
- **Do not anchor under this mapping.** Plan QA failure path: skip unit, record here. No substitute Spec authored or applied in this baseline (a nearer corpus neighbor is `spec:extraction.derive-graph` — "Carrier reification derives the one graph" — recorded only as an observation, not a mapping change).

### 4. `src/extract/reify.ts` → `spec:extraction.runnable-modules` — **MISMATCH (not lawful under plan mapping)**

- Same Spec as (3); same registrar/codegen subject matter.
- `reify.ts` is static AST reification of carriers and anchor constants (`reifySourceFile`, protocol-callee resolution, static id/section reification) — extract-time reading, not derived runnable modules.
- Spec prose never names `reify.ts` or static reification.
- **Do not anchor under this mapping.** Skip unit; no silent substitute (neighbor observations only: derive-graph / anchor reification clauses on `spec:model.anchors`).

### Suitability summary

| File | Planned target | Verdict | Baseline action for executor |
|---|---|---|---|
| `discover.ts` | `spec:extraction.excludes` | suitable | add impl memberOf extract satisfying excludes |
| `protocol-bindings.ts` | `spec:model.anchors` | suitable | add impl memberOf extract satisfying anchors |
| `carrier.ts` | `spec:extraction.runnable-modules` | **mismatch** | **skip** (do not force) |
| `reify.ts` | `spec:extraction.runnable-modules` | **mismatch** | **skip** (do not force) |

Lawful planned units for the later executor: **2 of 4**. Both lawful units are currently uncovered.

## Recommended impl ids (convention only — not authored)

Repo convention is `impl:protocol.<kebab-concern>` via `codeAnchorId(...)`, with `component: componentAnchorId("component:protocol.extract")`. Plan does not supply ids; live graph paths + Spec-named entrypoints suggest:

| File | Suggested id | Suggested label seed | `satisfies` | `component` |
|---|---|---|---|---|
| `src/extract/discover.ts` | `impl:protocol.discover-files` | realizes exclusion-aware discovery (`normalizeExcludes` / `discoverFiles`) | `spec:extraction.excludes` | `component:protocol.extract` |
| `src/extract/protocol-bindings.ts` | `impl:protocol.protocol-bindings` | Protocol builder-import trust (`protocolBindingScopeFor` / `collectProtocolBindings`) | `spec:model.anchors` | `component:protocol.extract` |

Optional `uses` only where architectural (plan); baseline does not invent edges. Mismatched files get **no** recommended id under the planned (wrong) target.

## Baseline green outputs

### Recipe 1 — build backlog (verbatim catalog body)

```sh
pnpm --silent sdp:q '<recipe 1 body>' --json
```

```json
{
  "total": 0,
  "byFamily": {},
  "excludedReadyExamples": 66,
  "excludedReadyDecisions": 34,
  "excludedWithoutVerifier": []
}
```

Exit `0`.

### Recipe 2 — drift alarm (verbatim catalog body)

```sh
pnpm --silent sdp:q '<recipe 2 body>' --json
```

```json
{
  "total": 3,
  "alarms": [
    {
      "id": "spec:consumers.projections-model",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 2
    },
    {
      "id": "spec:extraction.regenerability",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 1
    },
    {
      "id": "spec:model.core-model",
      "statedReadiness": "defined",
      "floorReached": "ready",
      "firstUnmetClause": null,
      "implementationBindings": 3
    }
  ]
}
```

Exit `0`. None of the three alarms are the planned extract-family targets (those targets are already `ready` via other files).

### Validate baseline

```sh
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

```
162 specs · 1 packs · 157 anchors → 320 nodes · 679 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

Exit `0`. Warnings are pre-existing ready-without-verifier gaps on unrelated Specs (`carrier.markdown-authoring`, `extraction.claim-taxonomy`, `model.pack-aggregate`, `model.relations`, `model.spec-sections`).

Live graph pulse after validate:

```json
{ "ok": true, "specs": 162, "nodes": 320, "edges": 679, "reportErrors": 0 }
```

**Green validate is not extract-family coverage.** It is the misleading-success baseline the Manual QA below falsifies.

## Failing Manual QA (live graph, decisive pre-edit red)

Requirement under test: each of the four planned source files has at least one implementation CodeNode that is `memberOf` `component:protocol.extract` and `satisfies` its planned Spec.

Exact body (fresh `pnpm --silent sdp:q`, no generated-graph read):

```js
const planned = [
  { file: "src/extract/carrier.ts", satisfies: "spec:extraction.runnable-modules" },
  { file: "src/extract/reify.ts", satisfies: "spec:extraction.runnable-modules" },
  { file: "src/extract/discover.ts", satisfies: "spec:extraction.excludes" },
  { file: "src/extract/protocol-bindings.ts", satisfies: "spec:model.anchors" },
];
const component = "component:protocol.extract";
const codeNodes = graph.nodes.filter((n) => n.nodeType === "CodeNode");
const memberOf = graph.edges.filter((e) => e.type === "memberOf");
const satisfies = graph.edges.filter((e) => e.type === "satisfies");

const missing = [];
for (const p of planned) {
  const nodesAt = codeNodes.filter((n) => n.file === p.file);
  const qualifying = nodesAt.filter((n) => {
    const isMember = memberOf.some((e) => e.from === n.id && e.to === component);
    const satOk = satisfies.some((e) => e.from === n.id && e.to === p.satisfies);
    return isMember && satOk;
  });
  if (qualifying.length === 0) {
    missing.push({
      file: p.file,
      plannedSatisfies: p.satisfies,
      codeNodeIdsAtFile: nodesAt.map((n) => n.id),
    });
  }
}
if (missing.length > 0) {
  throw new Error("extract-family anchor coverage missing");
}
return { ok: true };
```

Command:

```sh
pnpm --silent sdp:q '<body above>'
```

Observed:

```
sdp q: extract-family anchor coverage missing
```

Exit code: **`1`**

Exact sentinel: **`extract-family anchor coverage missing`**

### Precise current / missing facts (companion inspect body, same live graph)

```json
{
  "plannedCoverage": [
    {
      "file": "src/extract/carrier.ts",
      "plannedSatisfies": "spec:extraction.runnable-modules",
      "codeNodesAtFile": [],
      "qualifyingImplIds": [],
      "covered": false
    },
    {
      "file": "src/extract/reify.ts",
      "plannedSatisfies": "spec:extraction.runnable-modules",
      "codeNodesAtFile": [],
      "qualifyingImplIds": [],
      "covered": false
    },
    {
      "file": "src/extract/discover.ts",
      "plannedSatisfies": "spec:extraction.excludes",
      "codeNodesAtFile": [],
      "qualifyingImplIds": [],
      "covered": false
    },
    {
      "file": "src/extract/protocol-bindings.ts",
      "plannedSatisfies": "spec:model.anchors",
      "codeNodesAtFile": [],
      "qualifyingImplIds": [],
      "covered": false
    }
  ],
  "missingFiles": [
    "src/extract/carrier.ts",
    "src/extract/reify.ts",
    "src/extract/discover.ts",
    "src/extract/protocol-bindings.ts"
  ],
  "extractMemberCount": 11
}
```

### Decisive pre-edit failure for lawful units

| Lawful unit | Missing fact |
|---|---|
| `src/extract/discover.ts` | zero CodeNodes at file; no `memberOf`→`component:protocol.extract`; no `satisfies`→`spec:extraction.excludes` from this file (only index’s `impl:protocol.exclusion-surface` binds the Spec today) |
| `src/extract/protocol-bindings.ts` | zero CodeNodes at file; no `memberOf`→`component:protocol.extract`; no `satisfies`→`spec:model.anchors` from this file (anchors.ts + model/anchors.ts bind the Spec today) |

Mismatched units (`carrier.ts`, `reify.ts`) also trip the same sentinel under the planned mapping, but the plan’s QA-failure path is **skip + record**, not force-anchor. Post-edit green for task 5 is therefore defined over the **two lawful** units; the sentinel body above remains the full planned-table red proof for this baseline.

## UltraQA probes

| Probe | Result |
|---|---|
| **stale_state** | Manual QA and inspect used live `pnpm --silent sdp:q` (derives graph in-process). Cross-check of `generated/graph.json` after validate also shows `[]` CodeNodes for all four files and the same 11 extract members — live and generated agree on the gap. |
| **dirty_worktree** | Pre-existing dirt at capture (not introduced by this evidence step): `M .omo/boulder.json`, `M .omo/plans/architectural-patterns-views.md`, `M .omo/start-work/ledger.jsonl`, `M test/self-hosting-oracle/model.ts`, plus prior evidence untracked under `.omo/evidence/architectural-patterns-views/`. No `src/extract/{carrier,reify,discover,protocol-bindings}.ts` dirty. This file is the only new path for task 5 baseline. |
| **generated-or-cached** | Validate wrote `generated/graph.json` and contracts as a side effect of the green baseline; coverage claim does **not** read that artifact as authority — `sdp:q` re-derives. Recipe/validate greens are not cached Manual-QA results. |
| **misleading_success_output** | Asserted on **contents and sentinel text**, not bare exit codes of green tools. Validate exit `0` / `0 errors` coexists with Manual QA exit `1` and exact message `extract-family anchor coverage missing`. Recipe 1 `total: 0` does not speak to structural self-binding coverage of these files. |
| **wrong_location** | N/A — queries and files are under the main checkout `/home/darkomijic/dev-libar/software-delivery-protocol` on `feature/architectural-patterns-views`. |
| **partial_commit / history rewrite** | N/A — no commit, reset, rebase, or push. |
| **secret / product edit** | N/A — evidence-only; no product/source/test/plan/Boulder/ledger write in this step. |

## Cleanup

No temp files, no scratch anchors, no partial `codeAnchor` drafts. No `git` mutations. Evidence path only:

`.omo/evidence/architectural-patterns-views/task-5-baseline.md`

## Verdict

**BASELINE RED (decisive).**

- Validate and recipes 1/2 are green (corpus healthy).
- Planned extract-family file coverage is absent for **all four** planned paths.
- Spec-text gate: **2 lawful** units (`discover.ts`, `protocol-bindings.ts`) must gain anchors; **2 mismatched** units (`carrier.ts`, `reify.ts` → `runnable-modules`) must be **skipped**, not force-mapped.
- Exact failing sentinel for the full planned table: `extract-family anchor coverage missing` (exit 1).
