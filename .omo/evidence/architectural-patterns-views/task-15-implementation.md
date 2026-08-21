# Task 15 implementation — sync shared self-hosting oracles and frozen corpus totals

Subtask: shared lockstep only. Branch: `feature/architectural-patterns-views`.
HEAD at capture: `fd2d937df4faf85e10deb668b98f9dda42b5c56e`.
Captured: `2026-08-21T05:17:00Z`.
Graph facts re-derived live via `pnpm --silent sdp:q` after todos 2–9 landed. Stale evidence counts were not copied.

## Scope

Owned:

- `test/self-hosting-oracle/declared-relations.ts`
- `test/self-hosting-oracle/structural-edges.ts`
- `test/self-hosting-oracle/anchors.ts`
- `test/self-hosting-graph.test.ts`
- `.omo/evidence/architectural-patterns-views/task-15-implementation.md` — this file.

Not touched: per-Spec descriptor oracles, product/carriers/docs/state, `src/`, specs, recipes, skills. No commit/push.

## Baseline red (one run, before edits)

Command: `npx vitest run test/self-hosting-graph.test.ts --pool=forks --maxWorkers=1`

Result: `9 failed | 17 passed` (26). Exact failing titles:

1. `holds the frozen corpus totals`
2. `rosters exactly the authored Spec, Pack, and anchor node ids`
3. `derives exactly the authored declared relations`
4. `holds the frozen stated-readiness distribution`
5. `derives one binding edge per authored anchor`
6. `rosters exactly the accepted component set`
7. `gives every owned impl/api CodeNode exactly one component`
8. `derives exactly the sparse authored component uses edges`
9. `projects every anchor and code node at the line its declaration occupies`

First-failure received vs frozen pin: `{ specs: 162, packs: 1, anchors: 172 }` vs `{ specs: 161, packs: 1, anchors: 157 }`; declared 299 vs 279; readiness `{ defined: 11, idea: 4, ready: 146, scoped: 1 }` vs `{ defined: 9, idea: 6, ready: 145, scoped: 1 }`; components 13 vs 11.

## Final live literals (re-derived)

| Coordinate | Literal |
| --- | --- |
| specs | 162 |
| packs | 1 |
| anchors | 172 |
| nodes | 335 |
| edges | 731 |
| declared (claim `declared`, type ≠ `belongsTo`) | 299 |
| stated readiness | `{ defined: 11, idea: 4, ready: 146, scoped: 1 }` |
| components | 13 |
| memberOf | 73 |
| uses | 25 |
| expectedSpecs / expectedPackMembers length pins | 162 |
| expectedAnchors length pin | 172 |

Components (alphabetical, live = roster):

`component:protocol.adapters`, `cli`, `codegen`, `extract`, `graph`, `import`, `model`, `notation`, `projections`, `reader`, `runner`, `testing`, `validate`.

## Roster transcription

### declared-relations.ts — +20 relations (279 → 299)

From todos 2, 3, 8, 9 as present in the live graph (not the candidate list):

- `spec:decisions.architectural-significance-rides-primitives` `refines` `spec:model.anchors`
- `spec:decisions.architectural-significance-rides-primitives` `dependsOn` `spec:decisions.structural-anchor-semantics`
- `spec:decisions.architectural-significance-rides-primitives` `dependsOn` `spec:decisions.binding-not-liveness`
- `spec:model.structural-patterns` `decidedBy` `spec:decisions.architectural-significance-rides-primitives`
- `spec:protocol.structural-self-binding` `decidedBy` `spec:decisions.architectural-significance-rides-primitives`
- `spec:carrier.gherkin-authoring` `decidedBy` `spec:decisions.sdp-gherkin-extension`
- `spec:consumers.agent-surface` `decidedBy` `spec:decisions.agent-front-door`
- `spec:decisions.agent-front-door` `dependsOn` `spec:decisions.agent-surface-scripts-graph`
- `spec:decisions.carried-evidence` `dependsOn` `spec:decisions.kind-conditional-floor`
- `spec:decisions.carried-evidence` `dependsOn` `spec:decisions.content-only-sections`
- `spec:decisions.carrier-universality` `dependsOn` `spec:decisions.prose-ownership`
- `spec:decisions.carrier-universality` `dependsOn` `spec:decisions.pack-markdown-carrier`
- `spec:decisions.decision-readiness-posture` `dependsOn` `spec:decisions.kind-conditional-floor`
- `spec:decisions.example-realization-posture` `dependsOn` `spec:decisions.binding-not-liveness`
- `spec:decisions.structural-anchor-semantics` `dependsOn` `spec:decisions.binding-not-liveness`
- `spec:decisions.verification-posture-not-realization` `dependsOn` `spec:decisions.binding-not-liveness`
- `spec:model.anchors` `decidedBy` `spec:decisions.structural-anchor-semantics`
- `spec:model.core-model` `decidedBy` `spec:decisions.example-realization-posture`
- `spec:protocol.self-hosting` `decidedBy` `spec:decisions.plain-language-references`
- `spec:validation.warn-level-signals` `decidedBy` `spec:decisions.decision-readiness-posture`

Dropped by earlier todos (absent from the live graph, therefore not transcribed):

- `spec:decisions.carrier-universality` → `spec:decisions.carrier-ruling`
- `spec:decisions.mcp-deferred` → `spec:decisions.agent-surface-scripts-graph`
- `spec:decisions.planning-truths-placement` → `spec:decisions.shipped-projections-frozen`

### structural-edges.ts

- Accepted components: added `component:protocol.import` (after graph) and `component:protocol.testing` (after runner).
- Retired `impl:protocol.sdp-import` from `structuralMembershipExceptions` and the “import is not a seam” comment. Remaining exceptions: authoring-on-ramp, authoring-recipes, delivery-session-on-ramp.
- memberOf: 58 → 73. New rows grouped onto their component (cli / extract / graph / import / testing / validate). `impl:protocol.sdp-import` is now `memberOf` `component:protocol.import`.
- uses: 19 → 25. Added `cli→import`, `import→extract`, `import→model`, `reader→model`, `testing→adapters`, `testing→runner` in existing sort order.

### anchors.ts — +15 entries (157 → 172)

Components appended after adapters; impls appended at end. Constant/site resolve to the live file/line:

| id | file | line | constant | site |
| --- | --- | --- | --- | --- |
| `component:protocol.import` | `src/import/import.ts` | 40 | `importComponentAnchor` | `const sdpImportCoreAnchor` |
| `component:protocol.testing` | `src/testing/index.ts` | 33 | `testingComponentAnchor` | `const exampleTestingHelpersAnchor` |
| `impl:protocol.sdp-import-core` | `src/import/import.ts` | 49 | `sdpImportCoreAnchor` | `export function importTypeScriptSpec` |
| `impl:protocol.sdp-import-markdown-emit` | `src/import/emit-markdown.ts` | 197 | `sdpImportMarkdownEmitAnchor` | `export function emitMarkdownSpec` |
| `impl:protocol.example-testing-helpers` | `src/testing/index.ts` | 42 | `exampleTestingHelpersAnchor` | `export function createRunnableExample` |
| `impl:protocol.discover-files` | `src/extract/discover.ts` | 35 | `discoverFilesAnchor` | `export function normalizeExcludes` |
| `impl:protocol.protocol-bindings` | `src/extract/protocol-bindings.ts` | 82 | `protocolBindingsAnchor` | `export function protocolBindingScopeFor` |
| `impl:protocol.delivery-facts` | `src/graph/delivery-facts.ts` | 74 | `deliveryFactsAnchor` | `export function computeDeliveryFacts` |
| `impl:protocol.example-space` | `src/graph/example-space.ts` | 117 | `exampleSpaceAnchor` | `export function resolveExampleVocabulary` |
| `impl:protocol.graph-index` | `src/validate/graph-index.ts` | 28 | `graphIndexAnchor` | `export function buildGraphIndex` |
| `impl:protocol.validation-contracts` | `src/validate/contracts.ts` | 5 | `validationContractsAnchor` | `export const validatorFamilies` |
| `impl:protocol.agent-surface-cli` | `src/cli/sdp.ts` | 100 | `agentSurfaceCliAnchor` | `export function runSdpCli` |
| `impl:protocol.census-page-cli` | `src/cli/census-command.ts` | 65 | `censusPageCliAnchor` | `export function runCensus` |
| `impl:protocol.mermaid-view-cli` | `src/cli/mermaid-command.ts` | 81 | `mermaidViewCliAnchor` | `export function runMermaid` |
| `impl:protocol.gherkin-view-cli` | `src/cli/gherkin-command.ts` | 65 | `gherkinViewCliAnchor` | `export function runGherkinView` |

Task 5 units `src/extract/carrier.ts` and `src/extract/reify.ts` are not in the live graph (skipped upstream) and were not added.

### self-hosting-graph.test.ts frozen pins

```
{ specs: 162, packs: 1, anchors: 172 }
expectedSpecs/expectedPackMembers: 162
expectedAnchors: 172
nodes: 335
edges: 731
readiness: { defined: 11, idea: 4, ready: 146, scoped: 1 }
```

Literals stay literals. No assertion was weakened or replaced with a dynamic expectation.

## Automated gates

| Command | Result |
| --- | --- |
| `npx vitest run test/self-hosting-graph.test.ts --pool=forks --maxWorkers=1` | **26/26 passed** (one run) |
| `npx vitest run test/recipes.test.ts` | **22/22 passed** (task 11 later adds tests) |
| `npx tsc --noEmit` | clean |
| `npx prettier --check` on the four owned files | clean |
| `npx eslint` on the four owned files | clean |
| `git diff --check` on the four owned files | clean |

`git diff --stat` (owned files): `4 files changed, 234 insertions(+), 11 deletions(-)`.

## Manual QA

Independent `pnpm --silent sdp:q --json` vs the literals/rosters above:

| Query | Live | Pin/roster | Match |
| --- | --- | --- | --- |
| specs | 162 | 162 | PASS |
| packs | 1 | 1 | PASS |
| anchors (Anchor ∪ CodeNode) | 172 | 172 | PASS |
| nodes | 335 | 335 | PASS |
| edges | 731 | 731 | PASS |
| declared ≠ belongsTo | 299 | 299 | PASS |
| readiness | defined 11, idea 4, ready 146, scoped 1 | same | PASS |
| components | 13, ids as roster | 13 | PASS |
| memberOf | 73 | 73 | PASS |
| uses | 25 | 25 | PASS |

Exact equality of declared triples, memberOf pairs, uses pairs, component ids, and per-anchor id/type/target/file/line is the 26/26 graph suite (those assertions compare live extract to the authored arrays). Verdict: **PASS**.

## Cleanup

- No generated artifacts written.
- No commit, no push.
- Pre-existing dirty paths left untouched: `.omo/boulder.json`, `.omo/plans/architectural-patterns-views.md`, `.omo/start-work/ledger.jsonl`, untracked `.omo/evidence/architectural-patterns-views/task-1-normal-branch.md`.
- No stale “sixteen”, no dynamic pins, no `impl:protocol.sdp-import` exception remainder.

## Risks

- Recipe 17–19 ground-truth `it` blocks remain task 11. Current recipes suite is the 22-test baseline.
- Three task-8 `dependsOn` candidates and two task-5 extract files are absent from the graph; re-adding them here would have been a false transcription.
- `anchors.ts` / `declared-relations.ts` remain pure-data-table oracles well above 250 LOC; no split (existing convention).
