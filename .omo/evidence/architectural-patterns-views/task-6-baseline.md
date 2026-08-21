# Task 6 baseline — Widen graph, validate, and reader anchor coverage

Evidence-only Manual-QA proof. No `src/`, test, plan, Boulder, or ledger edits in this step.
Branch: `feature/architectural-patterns-views` @ `723bf95c9975303cef5896c8b97f454e1786a3aa`
Checkout: `/home/darkomijic/dev-libar/software-delivery-protocol`
Captured: `2026-08-21T01:42:00Z`

`CONTEXT.md` (ratified glossary) was read before naming terms. Queries speak `Spec`, `CodeNode`, `claim`, delivery facts, `memberOf` / `uses` / `satisfies`. Coverage claims come from live `pnpm --silent sdp:q` over the derived graph, not from parsing carriers by hand for graph facts.

## Plan unit (task 6)

Add `codeAnchor` calls in four source files and one structural `uses` edit on the reader component:

| Source file | Planned `satisfies` | Planned `memberOf` |
|---|---|---|
| `src/graph/delivery-facts.ts` | `spec:extraction.derive-graph` | `component:protocol.graph` |
| `src/graph/example-space.ts` | `spec:extraction.executable-contracts` | `component:protocol.graph` |
| `src/validate/graph-index.ts` | `spec:validation.two-check-families` | `component:protocol.validate` |
| `src/validate/contracts.ts` | `spec:validation.two-check-families` | `component:protocol.validate` |

Plus: add `uses` edge **`component:protocol.reader` → `component:protocol.model`** on the existing `readerComponentAnchor` in `src/reader/reader.ts`.

Shared rosters deferred to todo 15. Plan omits impl ids (recommend below for the later executor only).

## Source-locality observations

None of the four target files currently import `codeAnchor` / `codeAnchorId` / `componentAnchorId` or declare an anchor constant (`rg` over those paths: no matches).

| File | Role (exports / header) | Anchor present? |
|---|---|---|
| `src/graph/delivery-facts.ts` | One derivation of delivery facts: `computeDeliveryFacts`, `isResolvingTestAnchorVerify`, `isEnabledExampleVerify` (JSDoc cites derive-graph contract rows + core-model) | **no** |
| `src/graph/example-space.ts` | Example-space vocabulary resolution: `resolveExampleVocabulary`, `exampleMatchesParentVocabulary` (consumed by codegen + readiness-floor) | **no** |
| `src/validate/graph-index.ts` | Indexed view validators/reader share: `buildGraphIndex` / `GraphIndex` | **no** |
| `src/validate/contracts.ts` | Validation currency types: `validatorFamilies` (`conformance` \| `honesty`), `Finding`, `ValidationReport`, `Validator` | **no** |

### Existing component membership (none of the four files)

`component:protocol.graph` members (3):

```
impl:protocol.graph-claims                 src/graph/schema.ts:29
impl:protocol.oracle-target-eligibility    src/graph/oracle-bindings.ts:26
impl:protocol.schema-version               src/graph/schema.ts:9
```

`component:protocol.validate` members (13):

```
impl:protocol.authored-honesty-delivery-facts
impl:protocol.authored-honesty-shape
impl:protocol.claim-separation
impl:protocol.kind-evidence
impl:protocol.oracle-linkage
impl:protocol.orphan-signal
impl:protocol.pack-coherence
impl:protocol.readiness-floor
impl:protocol.referential-integrity
impl:protocol.validation-families          src/validate/validators.ts:49  → two-check-families
impl:protocol.verifier-gap-signal
impl:protocol.verifier-semantics
impl:protocol.verifies-linkage
```

`component:protocol.reader` members (3): `impl:protocol.agent-surface`, `impl:protocol.reader`, `impl:protocol.reader-impact` — all at `src/reader/reader.ts`.

### Current reader `uses` (live graph)

```json
{
  "from": "component:protocol.reader",
  "to": ["component:protocol.graph", "component:protocol.validate"],
  "readerToModel": false
}
```

Authored form at `src/reader/reader.ts:352–360`:

```ts
const readerComponentAnchor = codeAnchor({
  id: codeAnchorId("component:protocol.reader"),
  label: "Protocol reader seam",
  satisfies: ref("spec:consumers.reader"),
  uses: [
    componentAnchorId("component:protocol.graph"),
    componentAnchorId("component:protocol.validate"),
  ],
});
```

`component:protocol.model` is present (`src/model/anchors.ts:71`). Reader source imports model modules (`descriptors`, `sections`, `code-anchor`) but the structural `uses` edge to model is **absent**.

### Live `g.byFile` (empty → coverage-unknown for file-level impact)

```json
{
  "src/graph/delivery-facts.ts": { "nodes": [], "specs": [] },
  "src/graph/example-space.ts": { "nodes": [], "specs": [] },
  "src/validate/graph-index.ts": { "nodes": [], "specs": [] },
  "src/validate/contracts.ts": { "nodes": [], "specs": [] }
}
```

`src/reader/reader.ts` already has four CodeNodes (component + three impls) and specs `spec:consumers.reader` / `spec:consumers.agent-surface` — the gap on that file is the **missing uses→model**, not missing membership.

## Target Spec suitability (text verified before accepting mapping)

Graph `g.specContext` for the three distinct planned targets. **No silent substitution.**

### 1. `src/graph/delivery-facts.ts` → `spec:extraction.derive-graph` — **SUITABLE**

| Field | Live value |
|---|---|
| title | Carrier reification derives the one graph |
| stated / derived readiness | `ready` / `ready` |
| floorFailures | `[]` |
| deliveryFacts | `implemented`, `has-verifier` |
| outcome | Expose one carrier-neutral derivation seam. |
| file | `specs/extraction/derive-graph.sdp.md` |

Load-bearing behavior rule (verbatim from graph): *"Delivery facts are computed node facts: a resolving `satisfies` edge contributes `implemented`, and an enabled direct verifier contributes `has-verifier` only to its target."*

That rule is exactly what `computeDeliveryFacts` implements; extract/`deriveGraph` and honesty checks call it. Existing implementers are extract-family only:

- `component:protocol.extract` @ `src/extract/index.ts:180`
- `impl:protocol.derive-graph` @ `src/extract/derive.ts:115`
- `impl:protocol.extract` @ `src/extract/index.ts:192`

**No CodeNode at `delivery-facts.ts`.** Subject matter matches the Spec’s delivery-fact clause; not a domain mismatch. Accept mapping.

### 2. `src/graph/example-space.ts` → `spec:extraction.executable-contracts` — **SUITABLE (supporting unit)**

| Field | Live value |
|---|---|
| title | The build derives executable contracts from graph examples |
| stated / derived readiness | `ready` / `ready` |
| floorFailures | `[]` |
| deliveryFacts | `implemented`, `has-verifier` |
| outcome | Give bound tests typed step and example-space contracts without reading authored Specs directly. |
| named realizing entrypoint | `generateContracts` in `src/codegen/contracts.ts` (already `impl:protocol.executable-contracts`) |

Spec rules also bind vocabulary resolution and space-contract honesty (concreteness / separate vocabulary gate). `example-space.ts` is the graph-side vocabulary resolver (`resolveExampleVocabulary`) imported by codegen and readiness-floor. Named primary entrypoint is already anchored; this file is the supporting graph unit the plan whitelists. **Not** a carrier→runnable-modules style domain mismatch. Accept mapping; do not invent a different Spec.

### 3. `src/validate/graph-index.ts` → `spec:validation.two-check-families` — **SUITABLE (supporting unit)**

| Field | Live value |
|---|---|
| title | Validation separates well-formedness from non-pretending |
| stated / derived readiness | `ready` / `ready` |
| floorFailures | `[]` |
| deliveryFacts | `implemented`, `has-verifier` |
| named realizing entrypoints | `graphValidatorIds` and `validateGraph` in `src/validate/validators.ts` |

Named entrypoints already anchored (`component:protocol.validate`, `impl:protocol.validation-families`). Spec also requires the one derived-graph validation path and family-bearing findings. `buildGraphIndex` is the pure index every validator/reader pass builds — supporting infrastructure under the same Spec, plan-mapped. Accept mapping.

### 4. `src/validate/contracts.ts` → `spec:validation.two-check-families` — **SUITABLE**

Same Spec as (3). This module **defines** `validatorFamilies = ["conformance", "honesty"]` and the `Finding` / `ValidationReport` / `Validator` currency the Spec’s “two families are load-bearing” / “every finding names the family” rules ride on. Public package export. Accept mapping.

### 5. Reader `uses` → model — **SUITABLE (structural)**

Not a `satisfies` mapping. Reader already depends on model types at compile time; graph currently records only `uses` → graph and validate. Plan requires the missing architectural edge. Accept.

### Suitability summary

| Unit | Planned target | Verdict | Baseline action for executor |
|---|---|---|---|
| `delivery-facts.ts` | `spec:extraction.derive-graph` | suitable | add impl memberOf graph satisfying derive-graph |
| `example-space.ts` | `spec:extraction.executable-contracts` | suitable (supporting) | add impl memberOf graph satisfying executable-contracts |
| `graph-index.ts` | `spec:validation.two-check-families` | suitable (supporting) | add impl memberOf validate satisfying two-check-families |
| `contracts.ts` | `spec:validation.two-check-families` | suitable | add impl memberOf validate satisfying two-check-families |
| `readerComponentAnchor` uses | → `component:protocol.model` | suitable | append model to existing `uses` array |

**0 of 5 units skipped** under the Spec-text gate. All planned facts are currently missing.

## Recommended impl ids (convention only — not authored)

Repo convention: `impl:protocol.<kebab-concern>` via `codeAnchorId(...)`, top-level `const … = codeAnchor({…}); void …;`, package-trusted relative import of `codeAnchor` / ids. Plan omits ids; live graph + filename seeds:

| File | Suggested id | Suggested label seed | `satisfies` | `component` |
|---|---|---|---|---|
| `src/graph/delivery-facts.ts` | `impl:protocol.delivery-facts` | computes delivery facts from resolving binding edges | `spec:extraction.derive-graph` | `component:protocol.graph` |
| `src/graph/example-space.ts` | `impl:protocol.example-space` | resolves example-space vocabulary for contracts and floors | `spec:extraction.executable-contracts` | `component:protocol.graph` |
| `src/validate/graph-index.ts` | `impl:protocol.graph-index` | builds the one-graph index validators and the reader share | `spec:validation.two-check-families` | `component:protocol.validate` |
| `src/validate/contracts.ts` | `impl:protocol.validation-contracts` | conformance/honesty family currency and finding shapes | `spec:validation.two-check-families` | `component:protocol.validate` |

Reader edit (existing id, no new CodeNode): keep `component:protocol.reader`; extend `uses` to

```ts
uses: [
  componentAnchorId("component:protocol.graph"),
  componentAnchorId("component:protocol.validate"),
  componentAnchorId("component:protocol.model"),
],
```

Lawful form samples already in-tree:

- Graph member: `impl:protocol.graph-claims` @ `src/graph/schema.ts` — `codeAnchor({ id, label, satisfies, component })` + `void`
- Validate member: `impl:protocol.validation-families` @ `src/validate/validators.ts:49` — same shape, `satisfies: ref("spec:validation.two-check-families")`
- Reader component: `component:protocol.reader` @ `src/reader/reader.ts:352` — `codeAnchor({ id, label, satisfies, uses })` + `void`

Avoid id collisions: `impl:protocol.derive-graph` (extract), `impl:protocol.executable-contracts` (codegen), `impl:protocol.validation-families` (validators) already exist.

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

Exit `0`. None of the three alarms are the planned graph/validate/reader targets (those Specs are already `ready` via other files).

### Validate baseline

```sh
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

```
162 specs · 1 packs · 157 anchors → 320 nodes · 679 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

Exit `0`. Warnings are pre-existing ready-without-verifier gaps on unrelated Specs (`carrier.markdown-authoring`, `extraction.claim-taxonomy`, `model.pack-aggregate`, `model.relations`, `model.spec-sections`). Validate also wrote `generated/graph.json` / contracts as a side effect — not used as coverage authority.

**Green validate is not graph/validate/reader coverage.** It is the misleading-success baseline the Manual QA below falsifies.

## Failing Manual QA (live graph, decisive pre-edit red)

Requirement under test:

1. Each of the four planned source files has ≥1 CodeNode that is `memberOf` its planned component **and** `satisfies` its planned Spec.
2. `component:protocol.reader` has an anchored `uses` edge to `component:protocol.model`.

Exact body (fresh `pnpm --silent sdp:q`, no generated-graph read):

```js
const planned = [
  {
    file: "src/graph/delivery-facts.ts",
    component: "component:protocol.graph",
    satisfies: "spec:extraction.derive-graph",
  },
  {
    file: "src/graph/example-space.ts",
    component: "component:protocol.graph",
    satisfies: "spec:extraction.executable-contracts",
  },
  {
    file: "src/validate/graph-index.ts",
    component: "component:protocol.validate",
    satisfies: "spec:validation.two-check-families",
  },
  {
    file: "src/validate/contracts.ts",
    component: "component:protocol.validate",
    satisfies: "spec:validation.two-check-families",
  },
];

const codeNodes = graph.nodes.filter((n) => n.nodeType === "CodeNode");
const memberOf = graph.edges.filter((e) => e.type === "memberOf");
const satisfies = graph.edges.filter((e) => e.type === "satisfies");
const uses = graph.edges.filter((e) => e.type === "uses");

const missing = [];
for (const p of planned) {
  const nodesAt = codeNodes.filter((n) => n.file === p.file);
  const qualifying = nodesAt.filter((n) => {
    const isMember = memberOf.some((e) => e.from === n.id && e.to === p.component);
    const satOk = satisfies.some((e) => e.from === n.id && e.to === p.satisfies);
    return isMember && satOk;
  });
  if (qualifying.length === 0) {
    missing.push({
      file: p.file,
      plannedComponent: p.component,
      plannedSatisfies: p.satisfies,
      codeNodeIdsAtFile: nodesAt.map((n) => n.id),
    });
  }
}

const readerToModel = uses.some(
  (e) => e.from === "component:protocol.reader" && e.to === "component:protocol.model",
);
if (!readerToModel) {
  missing.push({
    kind: "uses",
    from: "component:protocol.reader",
    to: "component:protocol.model",
  });
}

if (missing.length > 0) {
  throw new Error("graph-validate-reader coverage missing");
}
return { ok: true };
```

Command:

```sh
pnpm --silent sdp:q '<body above>'
```

Observed:

```
sdp q: graph-validate-reader coverage missing
```

Exit code: **`1`**

Exact sentinel: **`graph-validate-reader coverage missing`**

### Precise current / missing facts (companion inspect body, same live graph)

```json
{
  "missing": [
    "file:src/graph/delivery-facts.ts memberOf→component:protocol.graph satisfies→spec:extraction.derive-graph",
    "file:src/graph/example-space.ts memberOf→component:protocol.graph satisfies→spec:extraction.executable-contracts",
    "file:src/validate/graph-index.ts memberOf→component:protocol.validate satisfies→spec:validation.two-check-families",
    "file:src/validate/contracts.ts memberOf→component:protocol.validate satisfies→spec:validation.two-check-families",
    "uses:component:protocol.reader→component:protocol.model"
  ],
  "missingCount": 5,
  "fileFacts": [
    {
      "file": "src/graph/delivery-facts.ts",
      "expectedComponent": "component:protocol.graph",
      "expectedSatisfies": "spec:extraction.derive-graph",
      "codeNodeIds": [],
      "coveredIds": [],
      "ok": false
    },
    {
      "file": "src/graph/example-space.ts",
      "expectedComponent": "component:protocol.graph",
      "expectedSatisfies": "spec:extraction.executable-contracts",
      "codeNodeIds": [],
      "coveredIds": [],
      "ok": false
    },
    {
      "file": "src/validate/graph-index.ts",
      "expectedComponent": "component:protocol.validate",
      "expectedSatisfies": "spec:validation.two-check-families",
      "codeNodeIds": [],
      "coveredIds": [],
      "ok": false
    },
    {
      "file": "src/validate/contracts.ts",
      "expectedComponent": "component:protocol.validate",
      "expectedSatisfies": "spec:validation.two-check-families",
      "codeNodeIds": [],
      "coveredIds": [],
      "ok": false
    }
  ],
  "readerUses": [
    "component:protocol.graph",
    "component:protocol.validate"
  ],
  "readerToModel": false
}
```

### Decisive pre-edit failure set

| Planned unit | Missing fact |
|---|---|
| `src/graph/delivery-facts.ts` | zero CodeNodes at file; no `memberOf`→graph; no `satisfies`→derive-graph from this file (extract’s `impl:protocol.derive-graph` binds the Spec today) |
| `src/graph/example-space.ts` | zero CodeNodes at file; no `memberOf`→graph; no `satisfies`→executable-contracts from this file (codegen’s `impl:protocol.executable-contracts` binds the Spec today) |
| `src/validate/graph-index.ts` | zero CodeNodes at file; no `memberOf`→validate; no `satisfies`→two-check-families from this file |
| `src/validate/contracts.ts` | zero CodeNodes at file; no `memberOf`→validate; no `satisfies`→two-check-families from this file (validators.ts holds the named entrypoint anchors today) |
| reader → model | `uses` from `component:protocol.reader` reaches only graph + validate; **model absent** |

## UltraQA probes

| Probe | Result |
|---|---|
| **stale_state** | Manual QA and inspect used live `pnpm --silent sdp:q` (derives graph in-process every invocation). Spec contexts and `byFile` empties agree with source `rg` (no `codeAnchor` in the four files) and with the reader `uses` block at L352–360. HEAD `723bf95c9975303cef5896c8b97f454e1786a3aa` matches the branch tip used for all captures. |
| **dirty_worktree** | Pre-existing dirt at capture (not introduced by this evidence step): `M .omo/boulder.json`, `M .omo/plans/architectural-patterns-views.md`, `M .omo/start-work/ledger.jsonl`, `M test/self-hosting-oracle/model.ts`, plus prior untracked evidence under `.omo/evidence/architectural-patterns-views/` (`task-1-normal-branch.md`, `task-3-oracle-red.md`, `task-5-baseline.md`, `task-10-baseline.md`, …). **No** dirty paths under `src/graph/{delivery-facts,example-space}.ts`, `src/validate/{graph-index,contracts}.ts`, or `src/reader/reader.ts`. This file is the only new path for task 6 baseline. |
| **generated-or-cached** | Validate wrote `generated/graph.json` (mtime moved during the validate window) and contracts as a side effect of the green baseline; coverage claim does **not** read that artifact as authority — `sdp:q` re-derives. `dist/cli/sdp.js` exists (mtime 2026-08-20 20:50); queries used that built CLI. Recipe/validate greens are not cached Manual-QA results. |
| **misleading_success_output** | Asserted on **contents and sentinel text**, not bare exit codes of green tools. Validate exit `0` / `0 errors` and recipe 1 `total: 0` coexist with Manual QA exit `1` and exact message `graph-validate-reader coverage missing`. Target Specs already showing `implemented` via *other* files is not file-level coverage of the four planned paths or reader→model. |
| **locality** | PASS — planned facts are absent *at the planned files/component edges*, while sibling anchors on the same Specs (extract derive-graph, codegen executable-contracts, validators two-check-families) remain present. Failure is local to the five missing facts, not a corpus-wide validation collapse. |
| **wrong_location** | N/A — queries and files are under the main checkout `/home/darkomijic/dev-libar/software-delivery-protocol` on `feature/architectural-patterns-views`. |
| **partial_commit / history rewrite** | N/A — no commit, reset, rebase, or push. |
| **secret / product edit** | N/A — evidence-only; no product/source/test/plan/Boulder/ledger write in this step. |
| **flaky_tests** | N/A — no test suite was the failing channel; one-shot live `sdp:q` body threw the sentinel. |

## Cleanup

No temp files, no scratch anchors, no partial `codeAnchor` drafts. No `git` mutations. Evidence path only:

`.omo/evidence/architectural-patterns-views/task-6-baseline.md`

## Verdict

**BASELINE RED (decisive).**

- Validate and recipes 1/2 are green (corpus healthy).
- Planned graph/validate file coverage is absent for **all four** planned paths (`byFile` nodes `[]`).
- Planned reader→model `uses` is **absent** (reader uses only graph + validate).
- Spec-text gate: **5/5 units suitable** (four file anchors + reader uses); none skipped.
- Exact failing sentinel: `graph-validate-reader coverage missing` (exit 1).
- Exact pre-edit failure: the five-entry `missing` set above.
