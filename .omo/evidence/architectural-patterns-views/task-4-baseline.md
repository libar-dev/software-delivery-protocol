# Task 4 baseline / failing Manual-QA proof

Subtask: mint `component:protocol.import` and `component:protocol.testing` (plan
todo 4). This slice authors **no** production anchors. Branch:
`feature/architectural-patterns-views` @ `723bf95`.

Did not edit source, tests, plan, Boulder, ledger. Did not commit or push.
No test edit is needed: the new behavior is graph-visible authoring and the
failing Manual-QA query is the seam.

## Target-Spec suitability (verify-before-author; no skip)

Both planned satisfies targets are already-implemented, ready behavior Specs.
Neither is a decision Spec or an unfinished idea-rung Spec.

### `spec:carrier.sdp-import` — MATCH

Authored text: convert a TypeScript-carrier Spec into an idiomatic `.sdp.md`
twin; `When importTypeScriptSpec runs` is the example-space When.

| Planned unit | Why the text matches |
|---|---|
| `src/import/import.ts` → `impl:protocol.sdp-import-core` + `component:protocol.import` | exports `importTypeScriptSpec` (L38), the function the example space names |
| `src/import/emit-markdown.ts` → `impl:protocol.sdp-import-markdown-emit` | exports `emitMarkdownSpec` (L195), the document emitter for that twin |
| existing `impl:protocol.sdp-import` gains `memberOf` import | CLI already satisfies this Spec (`anchored`); membership is the only missing fact |

Do not satisfy a decision Spec. Do not anchor `src/import/data-access.ts` or
`src/import/markdown-fidelity.ts` (plan Scope OUT / incidental plumbing).

### `spec:extraction.example-runner` — MATCH

Authored text: a bound example runs contract steps against a fresh world; core
entrypoints are `planExample` / `runExamplePlan` in `src/runner/index.ts`;
"creating a fresh world per example is the adapter's lifecycle, never the
core's."

Those core/adapter entrypoints are **already bound**:

- `component:protocol.runner` + `impl:protocol.example-runner` (`src/runner/index.ts` L92/L98)
- `component:protocol.adapters` + `impl:protocol.example-runner-adapter` (`src/adapters/vitest.ts` L18/L24)

`src/testing/index.ts` already realizes the adapter-lifecycle / oracle-comparison
clauses (`createRunnableExample` L31, `compareContractOutcome` L77,
`registerRunnableExample` L123 wrapping `bindExample`). Plan assigns
`component:protocol.testing` + `impl:protocol.example-testing-helpers` to this
same already-implemented Spec and forbids editing it. Additional `satisfies` on
the same Spec is coverage widening, not a retarget. No skip.

## Recipe 1 (verbatim catalog body; this session)

```
{
  "total": 0,
  "byFamily": {},
  "excludedReadyExamples": 66,
  "excludedReadyDecisions": 34,
  "excludedWithoutVerifier": []
}
```

Recipe 2 was not re-run in this slice (one `sdp:q` reserved for the failing
seam). Last capture on this branch after MD-34 (task-2-carrier): 3 drift alarms
(`spec:consumers.projections-model`, `spec:extraction.regenerability`,
`spec:model.core-model`), all `defined` with `floorReached: ready`.

## Validate (once)

```bash
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Exit 0:

```
162 specs · 1 packs · 167 anchors → 330 nodes · 701 edges (0 errors, 0 warnings)
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/graph.json
Wrote /home/darkomijic/dev-libar/software-delivery-protocol/generated/contracts (102 modules)
validate: 0 errors · 5 warnings (conformance + honesty over the one graph)
```

Five standing `honesty/gaps` warnings (markdown-authoring, claim-taxonomy,
pack-aggregate, relations, spec-sections). None name import or testing.

Anchor/node/edge counts are above the post-MD-34 carrier snapshot (157 anchors
→ 320 nodes · 679 edges) because sibling wave-3 todos have in-progress anchors
on extract/graph/validate/cli files. Task-4 target files are not among those
dirty paths and contributed none of the new nodes.

## Pre-existing import CLI anchor and current component set

Captured inside the same `sdp:q` invocation (logged immediately before the
throw). Passing facts on unchanged task-4 code:

- `impl:protocol.sdp-import` exists: label "plans, refuses, and publishes
  TypeScript-to-Markdown Spec imports", file `src/cli/import-command.ts` L71,
  claim `anchored`.
- Sole edge: `satisfies` → `spec:carrier.sdp-import`. **No** `memberOf`, **no**
  `component`, **no** `uses`.
- `spec:carrier.sdp-import` implementations: that one CLI impl only.
- `component:protocol.cli` uses (anchored): extract, reader, projections,
  codegen, validate. **Not** import.
- Current components (11; neither import nor testing):

```
component:protocol.adapters     src/adapters/vitest.ts:18
component:protocol.cli          src/cli/build-command.ts:24
component:protocol.codegen      src/codegen/contracts.ts:962
component:protocol.extract      src/extract/index.ts:180
component:protocol.graph        src/graph/schema.ts:22
component:protocol.model        src/model/anchors.ts:71
component:protocol.notation     src/notation/slots.ts:256
component:protocol.projections  src/projections/design-review.ts:27
component:protocol.reader       src/reader/reader.ts:352
component:protocol.runner       src/runner/index.ts:92
component:protocol.validate     src/validate/validators.ts:55
```

## Source locality observations (unchanged files)

| File | Current CodeNodes | Realizing site | Locality note |
|---|---|---|---|
| `src/import/import.ts` | none | `importTypeScriptSpec` L38 | Place component + impl immediately above L38. File-top would scrape the 24-line cap. |
| `src/import/emit-markdown.ts` | none | `emitMarkdownSpec` L195 | **Must** sit immediately above L195. File-top is ~195 lines away (would fail locality). |
| `src/testing/index.ts` | none | `createRunnableExample` L31 | Place component + impl above L31. `registerRunnableExample` L123 is 92 lines later — do not treat that as the site for a single impl. |
| `src/cli/import-command.ts` | `impl:protocol.sdp-import` L71 | `runImport` L79 | 8 lines; adding `component: protocol.import` to the existing object keeps locality. |
| `src/cli/build-command.ts` | `component:protocol.cli` L24 (+ wholesale-view / build-pipeline-emit / determinism / regenerability impls) | CLI component declaration | Adding `component:protocol.import` to the existing `uses` array does not move the site. |
| `src/import/data-access.ts` | none | — | Scope OUT; do not anchor. |
| `src/import/markdown-fidelity.ts` | none | — | Scope OUT; do not anchor. |

Convention to copy: `src/model/anchors.ts` L71 (`component:protocol.model` +
member `impl:protocol.anchor-model`); `src/cli/import-command.ts` L71 already
uses `codeAnchor` / `codeAnchorId` / `ref` (no `componentAnchorId` yet).

## Failing Manual QA (exact channel)

```bash
pnpm --silent sdp:q '<body>' --json
```

Body (operator-authored; not corpus text): look up the five planned CodeNodes
and the planned `satisfies` / `memberOf` / `uses` facts (including
`component:protocol.cli` → `component:protocol.import`); `console.log` the
baseline + missing set; `throw new Error("import-testing structural anchors missing")`
when any fact is absent.

Result on unchanged task-4 code:

- stdout: JSON `{ baseline, missing }` (full dump below)
- stderr: `sdp q: import-testing structural anchors missing`
- exit: **1**
- exact sentinel: `import-testing structural anchors missing`

### Exact absent facts

**Missing nodes (5):**

- `component:protocol.import`
- `component:protocol.testing`
- `impl:protocol.sdp-import-core`
- `impl:protocol.sdp-import-markdown-emit`
- `impl:protocol.example-testing-helpers`

**Missing edges (14):**

- `satisfies` `component:protocol.import` → `spec:carrier.sdp-import`
- `satisfies` `impl:protocol.sdp-import-core` → `spec:carrier.sdp-import`
- `satisfies` `impl:protocol.sdp-import-markdown-emit` → `spec:carrier.sdp-import`
- `satisfies` `component:protocol.testing` → `spec:extraction.example-runner`
- `satisfies` `impl:protocol.example-testing-helpers` → `spec:extraction.example-runner`
- `memberOf` `impl:protocol.sdp-import-core` → `component:protocol.import`
- `memberOf` `impl:protocol.sdp-import-markdown-emit` → `component:protocol.import`
- `memberOf` `impl:protocol.sdp-import` → `component:protocol.import`
- `memberOf` `impl:protocol.example-testing-helpers` → `component:protocol.testing`
- `uses` `component:protocol.import` → `component:protocol.model`
- `uses` `component:protocol.import` → `component:protocol.extract`
- `uses` `component:protocol.testing` → `component:protocol.adapters`
- `uses` `component:protocol.testing` → `component:protocol.runner`
- `uses` `component:protocol.cli` → `component:protocol.import`

Pre-existing `impl:protocol.sdp-import` `satisfies` `spec:carrier.sdp-import`
is **present** (not in the missing set).

### Captured JSON (stdout before throw)

```
{
  "missing": {
    "nodes": [
      "component:protocol.import",
      "component:protocol.testing",
      "impl:protocol.sdp-import-core",
      "impl:protocol.sdp-import-markdown-emit",
      "impl:protocol.example-testing-helpers"
    ],
    "edges": [
      { "type": "satisfies", "from": "component:protocol.import", "to": "spec:carrier.sdp-import" },
      { "type": "satisfies", "from": "impl:protocol.sdp-import-core", "to": "spec:carrier.sdp-import" },
      { "type": "satisfies", "from": "impl:protocol.sdp-import-markdown-emit", "to": "spec:carrier.sdp-import" },
      { "type": "satisfies", "from": "component:protocol.testing", "to": "spec:extraction.example-runner" },
      { "type": "satisfies", "from": "impl:protocol.example-testing-helpers", "to": "spec:extraction.example-runner" },
      { "type": "memberOf", "from": "impl:protocol.sdp-import-core", "to": "component:protocol.import" },
      { "type": "memberOf", "from": "impl:protocol.sdp-import-markdown-emit", "to": "component:protocol.import" },
      { "type": "memberOf", "from": "impl:protocol.sdp-import", "to": "component:protocol.import" },
      { "type": "memberOf", "from": "impl:protocol.example-testing-helpers", "to": "component:protocol.testing" },
      { "type": "uses", "from": "component:protocol.import", "to": "component:protocol.model" },
      { "type": "uses", "from": "component:protocol.import", "to": "component:protocol.extract" },
      { "type": "uses", "from": "component:protocol.testing", "to": "component:protocol.adapters" },
      { "type": "uses", "from": "component:protocol.testing", "to": "component:protocol.runner" },
      { "type": "uses", "from": "component:protocol.cli", "to": "component:protocol.import" }
    ]
  }
}
```

(`baseline` object omitted here for size; it is the component set / CLI uses /
`impl:protocol.sdp-import` record in the section above, logged in the same
stdout payload.)

## File scope

This slice created:

- `.omo/evidence/architectural-patterns-views/task-4-baseline.md` (this file)

No `src/`, test, Spec, oracle, plan, Boulder, or ledger edits.

## Adversarial (UltraQA)

- **stale_state**: PASS. `sdp q` derives the graph in-process and does not read
  `generated/graph.json`. The missing set was taken from that live derivation;
  source grep of the five target files shows no planned ids. Unchanged task-4
  code cannot mint those CodeNodes.
- **dirty_worktree**: PASS. This worker did not touch tracked product files.
  Start-of-slice / concurrent dirt (not this worker):
  - `.omo/boulder.json` `032d4effd020c0f6bceecf72904d0aa813cdfcd5`
  - `.omo/plans/architectural-patterns-views.md` `a68aeb18164ed1a97a9a13d313470f8ac030975b`
  - `.omo/start-work/ledger.jsonl` `5b45ef30f53553ea9008db058254fb1cc8145c1f`
  - sibling wave-3 paths: `docs/agent-surface/recipes.md`,
    `specs/model/structural-patterns.sdp.md`, `src/cli/{census,gherkin,mermaid,sdp}.ts`,
    `src/extract/{discover,protocol-bindings}.ts`, `src/graph/{delivery-facts,example-space}.ts`,
    `src/reader/reader.ts`, `src/validate/{contracts,graph-index}.ts`,
    `test/self-hosting-oracle/model.ts`
  - untracked sibling evidence under `.omo/evidence/architectural-patterns-views/`
  Task-4 targets (`src/import/import.ts`, `src/import/emit-markdown.ts`,
  `src/testing/index.ts`, `src/cli/import-command.ts`, `src/cli/build-command.ts`)
  were **not** dirty.
- **generated_or_cached_artifacts**: PASS. Manual QA used live `pnpm --silent sdp:q`
  (writes nothing). Validate's documented sink wrote gitignored
  `generated/graph.json` and `generated/contracts` (`.gitignore:17`); those paths
  were not read as the graph source.
- **misleading_success_output**: PASS. The failing seam is query exit 1 plus
  exact sentinel `import-testing structural anchors missing` plus the 5+14
  missing facts. Validate exit 0 is the unchanged-code extraction baseline, not
  the Manual-QA pass criterion.
- **flaky_tests**: N/A — no tests run or edited; the seam is one deterministic
  graph query.
- **race_condition**: N/A — no concurrent writers on the five task-4 target
  files; query is a single-process derivation.
- **time_dependent**: N/A — no clocks, sleeps, or wall-clock assertions.

## Cleanup receipt

- No temp files, no product edits, no generated files kept as evidence.
- Validate's `generated/` output is gitignored and was left as the ordinary
  validate sink (not cleaned; not treated as graph truth).
- Working tree change from this worker: this evidence file only.
