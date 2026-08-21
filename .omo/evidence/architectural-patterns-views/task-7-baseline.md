# Task 7 baseline — Widen CLI anchor coverage

Evidence-only Manual-QA proof. No `src/`, test, plan, Boulder, or ledger edits in this step.
Branch: `feature/architectural-patterns-views` @ `723bf95c9975303cef5896c8b97f454e1786a3aa`
Captured: `2026-08-21T01:41:00Z`

`CONTEXT.md` (ratified glossary) was read before naming terms. Queries speak `Spec`, `Pack`, `claim`, delivery facts, stated vs derived readiness. Graph data outranks this file.

## Plan unit (task 7)

Add `codeAnchor` calls in:

| Source file | Planned `satisfies` |
|---|---|
| `src/cli/sdp.ts` | `spec:consumers.agent-surface` |
| `src/cli/census-command.ts` | `spec:consumers.census-page` |
| `src/cli/mermaid-command.ts` | `spec:consumers.mermaid-view` |
| `src/cli/gherkin-command.ts` | `spec:consumers.gherkin-view` |

Component membership for each new impl: `component:protocol.cli`.
Shared rosters deferred to todo 15.

**Planned skip (must remain skip):** `src/cli/new-spec-command.ts` — plan Scope OUT and todo 7 both state it has no realizing Spec. Confirmed below; no recommended id.

## Source-locality observations

None of the four planned target files currently import `codeAnchor` / `codeAnchorId` / `componentAnchorId` or declare an anchor constant. Source grep for `codeAnchor` on those four paths: **no matches**. `src/cli/new-spec-command.ts` likewise has **no** anchor.

| File | Role | Anchor present? |
|---|---|---|
| `src/cli/sdp.ts` | CLI entry / verb dispatcher (`runSdpCli`, help text, entrypoint) | **no** |
| `src/cli/census-command.ts` | `runCensus` — validate then wholesale-publish `generated/census/` | **no** |
| `src/cli/mermaid-command.ts` | `runMermaid` — validate then wholesale-publish `generated/mermaid/` | **no** |
| `src/cli/gherkin-command.ts` | `runGherkinView` — validate then wholesale-publish `generated/gherkin/` | **no** |
| `src/cli/new-spec-command.ts` (skip) | `runNewSpec` / `parseNewSpecArgs` idea-rung scaffolder | **no** (and no lawful Spec) |

### Pre-existing CLI-family anchors (live graph)

`memberOf` → `component:protocol.cli` (7 impl members + the component node itself):

| id | file:line | satisfies |
|---|---|---|
| `component:protocol.cli` | `src/cli/build-command.ts:24` | `spec:extraction.build-pipeline` |
| `impl:protocol.build-pipeline-emit` | `src/cli/build-command.ts:208` | `spec:extraction.build-pipeline` |
| `impl:protocol.wholesale-view-build-invalidation` | `src/cli/build-command.ts:202` | `spec:consumers.wholesale-view-rewrite` |
| `impl:protocol.extraction-determinism` | `src/cli/build-command.ts:214` | `spec:extraction.determinism` |
| `impl:protocol.regenerability` | `src/cli/build-command.ts:220` | `spec:extraction.regenerability` |
| `impl:protocol.build-pipeline-query` | `src/cli/q-command.ts:194` | `spec:extraction.build-pipeline` |
| `impl:protocol.diagnostic-rendering-cli` | `src/cli/output.ts:23` | `spec:validation.diagnostic-rendering` |
| `impl:protocol.wholesale-view-rewrite` | `src/cli/validate-view-command.ts:57` | `spec:consumers.wholesale-view-rewrite` |

Also under `src/cli/` but **not** a `component:protocol.cli` member (no `component:` field on the constant):

| id | file:line | satisfies | memberOf |
|---|---|---|---|
| `impl:protocol.sdp-import` | `src/cli/import-command.ts:71` | `spec:carrier.sdp-import` | `[]` |

None of the four planned files appear in the tables above. Live `CodeNode` count at each planned path: **0**.

Convention observed for dual realization (projection/core already bound, CLI also binds): suffix `-cli` on the concern (`impl:protocol.diagnostic-rendering-cli`). Component anchor form in `build-command.ts`:

```ts
const cliComponentAnchor = codeAnchor({
  id: codeAnchorId("component:protocol.cli"),
  label: "Protocol CLI seam",
  satisfies: ref("spec:extraction.build-pipeline"),
  uses: [ /* component ids */ ],
});
```

Impl member form (exemplar `output.ts`):

```ts
const diagnosticCliAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.diagnostic-rendering-cli"),
  label: "…",
  satisfies: ref("spec:validation.diagnostic-rendering"),
  component: componentAnchorId("component:protocol.cli"),
});
void diagnosticCliAnchor;
```

## Target Spec suitability (text verified before accepting mapping)

Live `g.specContext` for each planned target. **No silent substitution.**

### 1. `src/cli/sdp.ts` → `spec:consumers.agent-surface` — **SUITABLE (lawful)**

- Title: "Agents script a visible typed graph"
- Kind/altitude/readiness: `behavior` / `feature` / stated+derived `ready`
- Delivery facts already: `implemented`, `has-verifier`
- Intent outcome: obtain/compose graph context without rebuilding joins or a fixed verb wall.
- Behavior rule (verbatim, CLI-bearing): *"The agent surface exposes a visible, self-describing typed graph through the CLI; the schema is the contract and agents script the graph directly."*
- Existing implementer: only `impl:protocol.agent-surface` @ `src/reader/reader.ts:361` (reader/adapters) — **not** the CLI dispatcher.
- `sdp.ts` owns `runSdpCli`, the help surface that documents `sdp q`, and the process entrypoint — the CLI front of the agent surface. Mapping is lawful under the plan; the CLI binding does not replace the reader binding.

### 2. `src/cli/census-command.ts` → `spec:consumers.census-page` — **SUITABLE (lawful)**

- Title: "Census renders the runtime taxonomy without becoming a registry"
- Kind/altitude/readiness: `behavior` / `feature` / stated+derived `ready`
- Delivery facts already: `implemented`, `has-verifier`
- Behavior rules name the explicit publication surface: *"`Publication uses the explicit \`sdp census\` surface and owns only \`generated/census/\`."* and *"`sdp census --check-clean` …"*
- Existing implementer: only `impl:protocol.census-page` @ `src/projections/census.ts:21` (pure `renderCensus`) — **not** the CLI publisher.
- `runCensus` is exactly that publication command (validate → render → wholesale tmp-to-rename). Mapping lawful.

### 3. `src/cli/mermaid-command.ts` → `spec:consumers.mermaid-view` — **SUITABLE (lawful)**

- Title: "Mermaid renders bounded one-hop and Pack diagrams without becoming a graph browser"
- Kind/altitude/readiness: `behavior` / `feature` / stated+derived `ready`
- Delivery facts already: `implemented`, `has-verifier`
- Behavior rules name *"`sdp mermaid`"*, ownership of `generated/mermaid/`, and `--check-clean`.
- Existing implementer: only `impl:protocol.mermaid-view` @ `src/projections/mermaid.ts:16`.
- `runMermaid` is the named publication command. Mapping lawful.

### 4. `src/cli/gherkin-command.ts` → `spec:consumers.gherkin-view` — **SUITABLE (lawful)**

- Title: "Gherkin view renders any Spec as a disposable read shape"
- Kind/altitude/readiness: `behavior` / `feature` / stated+derived `ready`
- Delivery facts already: `implemented`, `has-verifier`
- Behavior rules name *"`sdp gherkin`"*, ownership of `generated/gherkin/`, and `--check-clean`.
- Existing implementer: only `impl:protocol.gherkin-view` @ `src/projections/gherkin-view.ts:21`.
- `runGherkinView` is the named publication command. Mapping lawful.

### Suitability summary

| File | Planned target | Verdict | Baseline action for executor |
|---|---|---|---|
| `sdp.ts` | `spec:consumers.agent-surface` | suitable | add impl memberOf cli satisfying agent-surface |
| `census-command.ts` | `spec:consumers.census-page` | suitable | add impl memberOf cli satisfying census-page |
| `mermaid-command.ts` | `spec:consumers.mermaid-view` | suitable | add impl memberOf cli satisfying mermaid-view |
| `gherkin-command.ts` | `spec:consumers.gherkin-view` | suitable | add impl memberOf cli satisfying gherkin-view |

Lawful planned units for the later executor: **4 of 4**. All four are currently uncovered at file grain under `component:protocol.cli`.

## Planned skip proof — `src/cli/new-spec-command.ts`

Plan Scope OUT and todo 7: *"no realizing Spec exists"* / *SKIP (record)*.

Live graph facts:

```json
{
  "file": "src/cli/new-spec-command.ts",
  "codeNodes": [],
  "satisfiesTargets": [],
  "candidateSpecsByTitleOrId": []
}
```

Corpus law that mints **no** Spec for this command:

- `spec:consumers.graph-first-planning` behavior rule (verbatim): *"The E2 placement ruling for `sdp new spec` and `sdp validate --watch` is a lawful non-decision that failed the ADR three-part test; it lives in the plan record and mints no Spec."*
- `spec:consumers.authoring-on-ramp` mentions `sdp new spec` as the cheap-capture starting step, but that Spec’s intent is the authoring on-ramp behavior, not a realization target for the scaffolder module. Forcing `satisfies` onto it would manufacture coverage the plan forbids.

**Confirm: `new-spec-command.ts` has no lawful realizing Spec and remains a planned skip.** No recommended anchor id. Do not invent a Spec in this todo.

## Recommended impl ids (convention only — not authored)

Repo convention: `impl:protocol.<kebab-concern>` via `codeAnchorId(...)`, with `component: componentAnchorId("component:protocol.cli")`. When a non-CLI realization already owns the bare concern id, CLI dual-binds with a `-cli` suffix (see `impl:protocol.diagnostic-rendering-cli`).

| File | Suggested id | Suggested label seed | `satisfies` | `component` |
|---|---|---|---|---|
| `src/cli/sdp.ts` | `impl:protocol.agent-surface-cli` | CLI verb dispatcher and agent-surface front of the package CLI | `spec:consumers.agent-surface` | `component:protocol.cli` |
| `src/cli/census-command.ts` | `impl:protocol.census-page-cli` | publishes the census through the explicit `sdp census` surface | `spec:consumers.census-page` | `component:protocol.cli` |
| `src/cli/mermaid-command.ts` | `impl:protocol.mermaid-view-cli` | publishes Mermaid through the explicit `sdp mermaid` surface | `spec:consumers.mermaid-view` | `component:protocol.cli` |
| `src/cli/gherkin-command.ts` | `impl:protocol.gherkin-view-cli` | publishes the Gherkin view through the explicit `sdp gherkin` surface | `spec:consumers.gherkin-view` | `component:protocol.cli` |

No `uses` invented here (plan todo 7 does not require CLI uses edges). Locality: place each constant within the locality bound of the realizing export (`runSdpCli` / `runCensus` / `runMermaid` / `runGherkinView`), matching existing CLI anchors. **No source edits in this baseline.**

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

Exit `0`. None of the three alarms are the planned CLI targets (those Specs are already `ready` via projection/reader bindings).

### Validate baseline

```sh
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

```
162 specs · 1 packs · 157 anchors → 320 nodes · 679 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

Exit `0`. Warnings are pre-existing ready-without-verifier gaps on unrelated Specs (`carrier.markdown-authoring`, `extraction.claim-taxonomy`, `model.pack-aggregate`, `model.relations`, `model.spec-sections`).

**Green validate is not CLI file coverage.** It is the misleading-success baseline the Manual QA below falsifies.

## Failing Manual QA (live graph, decisive pre-edit red)

Requirement under test: each of the four planned source files has at least one implementation CodeNode that is `memberOf` `component:protocol.cli` and `satisfies` its planned Spec.

Exact body (fresh `pnpm --silent sdp:q`, no generated-graph authority):

```js
const planned = [
  { file: "src/cli/sdp.ts", satisfies: "spec:consumers.agent-surface" },
  { file: "src/cli/census-command.ts", satisfies: "spec:consumers.census-page" },
  { file: "src/cli/mermaid-command.ts", satisfies: "spec:consumers.mermaid-view" },
  { file: "src/cli/gherkin-command.ts", satisfies: "spec:consumers.gherkin-view" },
];
const component = "component:protocol.cli";
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
  throw new Error("cli anchor coverage missing");
}
return { ok: true };
```

Command:

```sh
pnpm --silent sdp:q '<body above>'
```

Observed:

```
sdp q: cli anchor coverage missing
```

Exit code: **`1`**

Exact sentinel: **`cli anchor coverage missing`**

Stdout empty. No partial JSON success.

### Precise current / missing facts (companion inspect body, same live graph)

```json
{
  "missing": [
    {
      "file": "src/cli/sdp.ts",
      "target": "spec:consumers.agent-surface",
      "nodesOnFile": []
    },
    {
      "file": "src/cli/census-command.ts",
      "target": "spec:consumers.census-page",
      "nodesOnFile": []
    },
    {
      "file": "src/cli/mermaid-command.ts",
      "target": "spec:consumers.mermaid-view",
      "nodesOnFile": []
    },
    {
      "file": "src/cli/gherkin-command.ts",
      "target": "spec:consumers.gherkin-view",
      "nodesOnFile": []
    }
  ],
  "plannedPresent": [
    { "file": "src/cli/sdp.ts", "target": "spec:consumers.agent-surface", "present": false },
    { "file": "src/cli/census-command.ts", "target": "spec:consumers.census-page", "present": false },
    { "file": "src/cli/mermaid-command.ts", "target": "spec:consumers.mermaid-view", "present": false },
    { "file": "src/cli/gherkin-command.ts", "target": "spec:consumers.gherkin-view", "present": false }
  ],
  "cliMemberCount": 7,
  "preExistingCliMemberIds": [
    "impl:protocol.build-pipeline-emit",
    "impl:protocol.build-pipeline-query",
    "impl:protocol.diagnostic-rendering-cli",
    "impl:protocol.extraction-determinism",
    "impl:protocol.regenerability",
    "impl:protocol.wholesale-view-build-invalidation",
    "impl:protocol.wholesale-view-rewrite"
  ],
  "existingTargetImplementations": {
    "spec:consumers.agent-surface": [
      { "codeId": "impl:protocol.agent-surface", "file": "src/reader/reader.ts", "line": 361 }
    ],
    "spec:consumers.census-page": [
      { "codeId": "impl:protocol.census-page", "file": "src/projections/census.ts", "line": 21 }
    ],
    "spec:consumers.mermaid-view": [
      { "codeId": "impl:protocol.mermaid-view", "file": "src/projections/mermaid.ts", "line": 16 }
    ],
    "spec:consumers.gherkin-view": [
      { "codeId": "impl:protocol.gherkin-view", "file": "src/projections/gherkin-view.ts", "line": 21 }
    ]
  }
}
```

### Decisive pre-edit failure for lawful units

| Lawful unit | Missing fact |
|---|---|
| `src/cli/sdp.ts` | zero CodeNodes at file; no `memberOf`→`component:protocol.cli`; no `satisfies`→`spec:consumers.agent-surface` from this file (only reader’s `impl:protocol.agent-surface` binds the Spec today) |
| `src/cli/census-command.ts` | zero CodeNodes at file; no CLI membership/satisfies for `spec:consumers.census-page` (only `src/projections/census.ts`) |
| `src/cli/mermaid-command.ts` | zero CodeNodes at file; no CLI membership/satisfies for `spec:consumers.mermaid-view` (only `src/projections/mermaid.ts`) |
| `src/cli/gherkin-command.ts` | zero CodeNodes at file; no CLI membership/satisfies for `spec:consumers.gherkin-view` (only `src/projections/gherkin-view.ts`) |

Post-edit green for task 7 is defined over these **four lawful** units under `component:protocol.cli`. The skip path for `new-spec-command.ts` must stay unanchored.

## UltraQA probes

| Probe | Result |
|---|---|
| **stale_state** | Manual QA and inspect used live `pnpm --silent sdp:q` (derives graph in-process every invocation). `src/cli/{sdp,census-command,mermaid-command,gherkin-command,new-spec-command}.ts` are clean vs `HEAD` (`git diff --stat HEAD -- src/cli/` empty). Working-tree and `HEAD` agree the four files have no anchors. |
| **dirty_worktree** | Pre-existing dirt at capture (not introduced by this evidence step): `M .omo/boulder.json`, `M .omo/plans/architectural-patterns-views.md`, `M .omo/start-work/ledger.jsonl`, `M test/self-hosting-oracle/model.ts`, plus prior evidence untracked under `.omo/evidence/architectural-patterns-views/`. No planned CLI source path is dirty. This file is the only new path for task 7 baseline. |
| **generated-or-cached** | Validate wrote `generated/graph.json` (mtime moved during the validate window) as a side effect of the green baseline; coverage claim does **not** read that artifact as authority — `sdp:q` re-derives. `dist/cli/sdp.js` exists (mtime 2026-08-20 20:50) and was used by the wrapper; source CLI files are older and unchanged. Recipe/validate greens are not cached Manual-QA results. |
| **misleading_success_output** | Asserted on **contents and sentinel text**, not bare exit codes of green tools. Validate exit `0` / `0 errors` and recipe 1 `total: 0` coexist with Manual QA exit `1` and exact message `cli anchor coverage missing`. Existing `implemented` on the four target Specs (via projection/reader files) is **not** file-grain CLI coverage under `component:protocol.cli`. |
| **wrong_location** | N/A — queries and files are under the main checkout `/home/darkomijic/dev-libar/software-delivery-protocol` on `feature/architectural-patterns-views`. |
| **partial_commit / history rewrite** | N/A — no commit, reset, rebase, or push. |
| **flaky_tests** | N/A — no test suite was the failing channel; Manual QA is a single live `sdp:q` throw. |
| **secret / product edit** | N/A — evidence-only; no product/source/test/plan/Boulder/ledger write in this step. |

## Cleanup

Removed `/tmp/sdp-task7-sentinel.out` and `/tmp/sdp-task7-sentinel.err` after capturing the sentinel. No scratch anchors, no partial `codeAnchor` drafts. No `git` mutations. Evidence path only:

`.omo/evidence/architectural-patterns-views/task-7-baseline.md`

## Verdict

**BASELINE RED (decisive).**

- Validate and recipes 1/2 are green (corpus healthy).
- Planned CLI file coverage is absent for **all four** planned paths under `component:protocol.cli`.
- Spec-text gate: **4 lawful** units must gain anchors; `new-spec-command.ts` remains a **planned skip** (lawful non-decision mints no Spec — `spec:consumers.graph-first-planning`).
- Exact failing sentinel for the full planned table: `cli anchor coverage missing` (exit 1).
- Recommended convention-consistent ids only; **no source edits** in this slice.
