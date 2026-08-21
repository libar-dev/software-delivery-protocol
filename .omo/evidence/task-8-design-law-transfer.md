# task-8 design-law-transfer evidence

Worktree: `/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-8`
Branch: `design-law-transfer/todo-8`
Task id: `st_01a023d1`
Scope: shared-oracle sync only — `declared-relations.ts`, `pack-members.ts`, `anchors.ts`, frozen totals and readiness distribution in `test/self-hosting-graph.test.ts`. No per-Spec descriptor oracles, no carriers, no `expectedWarnings` edit.

## Worktree-local CLI

`node_modules/` and `dist/` were absent. `npm ci` (201 packages) then `npm run build` produced a real local binary:

```
realpath dist/cli/sdp.js
/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-8/dist/cli/sdp.js
```

Not a symlink. `find dist -type l` empty. All `sdp validate` / `sdp:q` runs used this binary via `pnpm --silent sdp` / `sdp:q`.

## Baseline (failing-first)

Integrated Wave 1 (todos 1, 3, 4, 5) already present; shared oracles still at the pre-Wave-1 checkpoint.

```
npx vitest run test/self-hosting-graph.test.ts
VITEST_EXIT=1
Test Files  1 failed (1)
Tests  7 failed | 20 passed (27)
```

The seven failures are exactly the planned shared-roster mismatches:

1. `holds the frozen corpus totals` — live `{ specs: 164, packs: 1, anchors: 177 }` vs frozen `{ specs: 162, packs: 1, anchors: 175 }`
2. `rosters exactly the authored Spec, Pack, and anchor node ids` — extra `test:protocol.delivery-facts`, `test:protocol.structural-self-binding`
3. `derives exactly the authored declared relations` — live 308 triples vs roster 299 (the nine Wave 1 edges below)
4. `holds the frozen stated-readiness distribution` — live `ready: 148` vs frozen `ready: 146`
5. `derives the Pack membership edges from the manifest, in manifest order` — live 164 vs 162 (`spec:extraction.delivery-facts`, `spec:decisions.jsdoc-graph-extraction-refused`)
6. `derives one binding edge per authored anchor` — retarget `impl:protocol.delivery-facts` → `spec:extraction.delivery-facts`; plus the two new `verifies` edges
7. `projects every anchor and code node at the line its declaration occupies` — extra Anchor nodes at `test/extract.test.ts:815` and `test/self-hosting-graph.test.ts:37`

Family-descriptor assertions passed. The census assertion passed. `expectedWarnings` stayed five. No unexpected failure.

## Live re-derivation (`sdp:q`, never plan arithmetic)

After worktree-local build, then again after `sdp validate` rewrote `generated/graph.json`:

```
pnpm --silent sdp:q --json 'return { specs, packs, anchors, nodes, edges, readiness, declared, belongsTo }'
```

| Literal | Live value |
| --- | --- |
| specs | `164` |
| packs | `1` |
| anchors | `177` (`CodeNode` 92 · `Anchor` 85) |
| nodes | `342` |
| edges | `760` |
| readiness | `{ defined: 11, idea: 4, ready: 148, scoped: 1 }` |
| declared relations (excl. `belongsTo`) | `308` |
| `belongsTo` / pack members | `164` |

Nine declared triples confirmed present:

| Source | Type | Target | From |
| --- | --- | --- | --- |
| `spec:decisions.jsdoc-graph-extraction-refused` | `refines` | `spec:model.anchors` | todo 1 |
| `spec:decisions.jsdoc-graph-extraction-refused` | `dependsOn` | `spec:decisions.one-validation-path` | todo 1 |
| `spec:decisions.jsdoc-graph-extraction-refused` | `dependsOn` | `spec:decisions.structural-anchor-semantics` | todo 1 |
| `spec:extraction.delivery-facts` | `refines` | `spec:extraction.derive-graph` | todo 3 |
| `spec:extraction.delivery-facts` | `decidedBy` | `spec:decisions.binding-not-liveness` | todo 3 |
| `spec:extraction.derive-graph` | `decidedBy` | `spec:decisions.one-validation-path` | todo 5 |
| `spec:validation.authored-honesty` | `decidedBy` | `spec:decisions.binding-not-liveness` | todo 5 |
| `spec:consumers.reader` | `decidedBy` | `spec:decisions.agent-surface-scripts-graph` | todo 5 |
| `spec:extraction.executable-contracts` | `decidedBy` | `spec:decisions.point-per-example` | todo 5 |

Todo 5 drop (`spec:extraction.example-runner` → `spec:decisions.binding-not-liveness`) remains absent.

Live pack inserts (manifest order): `spec:extraction.delivery-facts` after `spec:extraction.derive-graph`; `spec:decisions.jsdoc-graph-extraction-refused` after `spec:decisions.architectural-significance-rides-primitives`.

Live anchor identity / binding:

| id | nodeType | label | type | target | file | line | constant | site |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `impl:protocol.delivery-facts` | `CodeNode` | computes delivery facts from resolving binding edges | `satisfies` | `spec:extraction.delivery-facts` | `src/graph/delivery-facts.ts` | 44 | `deliveryFactsAnchor` | `export function computeDeliveryFacts` (unchanged) |
| `test:protocol.delivery-facts` | `Anchor` | verifies the delivery-fact conferral ladder and fail-closed posture | `verifies` | `spec:extraction.delivery-facts` | `test/extract.test.ts` | 815 | `deliveryFactsTestAnchor` | first `it(` of the ladder describe: `it("anchored-binding: the full ladder` |
| `test:protocol.structural-self-binding` | `Anchor` | verifies the accepted significant-unit set carries its declared membership | `verifies` | `spec:protocol.structural-self-binding` | `test/self-hosting-graph.test.ts` | 37 | `structuralSelfBindingTestAnchor` | `void structuralSelfBindingTestAnchor` |

### Site deviation (traced, not suppressed)

The plan named the census `it("covers every accepted architecturally significant unit"` as the structural-self-binding site. That string is unique and live at line 294. The const is at line 37. `|294 - 37| = 257 > 24` (the locality bound). Using the plan site failed `keeps every anchor beside the site it binds` after the rest of the suite was green (26 passed / 1 failed). The oracle site was then set to the unique keep-alive beside the live const (`void structuralSelfBindingTestAnchor`, line 42, distance 5). The census `it(` was not used. The const was not moved (out of scope).

`expectedWarnings` left untouched. Live validate still emits exactly those five `honesty/gaps` subjects: `spec:carrier.markdown-authoring`, `spec:extraction.claim-taxonomy`, `spec:model.pack-aggregate`, `spec:model.relations`, `spec:model.spec-sections`. No sixth warning (the tracer carries a verifier; the decision Spec is kind-exempt).

## Final automated verification

```
npx vitest run test/self-hosting-graph.test.ts
VITEST_EXIT=0
Test Files  1 passed (1)
Tests  27 passed (27)
```

```
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
VALIDATE_EXIT=0
164 specs · 1 packs · 177 anchors → 342 nodes · 760 edges (0 errors, 0 warnings)
validate: 0 errors · 5 warnings
```

Warning identities match `expectedWarnings` exactly.

## Manual QA

Live `sdp:q` after validate (regenerate-before-query) returned the same counts as the frozen literals and as `generated/graph.json` (see generated-artifact probe). Pack membership order matches the live `belongsTo` walk. The nine triples are present; the dropped example-runner fill is not.

## Adversarial classes (nine)

| # | Class | Probe | Result |
| --- | --- | --- | --- |
| 1 | `stale_state` | Worktree-local `dist` realpath (not a foreign symlink). After `npm run build`, validate rewrote `generated/graph.json`; `sdp:q` was re-run against the same local `dist/cli/sdp.js`. | PASS — realpath is this worktree. Post-regenerate query equals the committed literals (`164 / 1 / 177`, `342` nodes, `760` edges, readiness `{ defined: 11, idea: 4, ready: 148, scoped: 1 }`, declared `308`, `belongsTo` `164`). |
| 2 | `dirty_worktree` | `git status --short`, `git diff --stat`, `git diff --name-only`, `git diff --check` | PASS — four owned files only. `git diff --check` exit 0. No carriers, no per-Spec descriptors, no `index.ts` warning pin. |
| 3 | `generated_or_cached_artifacts` | Parsed `generated/graph.json` after validate and compared every count/histogram to the live `sdp:q` result | PASS — identical (`164 / 1 / 177 / 342 / 760`, same readiness, `308` declared, `164` belongsTo). Claims use live query, not the generated file as authority. |
| 4 | `misleading_success_output` | Exact vitest and validate identities | PASS — baseline `7 failed | 20 passed (27)` exit 1. Final `27 passed (27)` exit 0. Validate exit 0, `0 errors · 5 warnings`, five named `honesty/gaps` subjects, no sixth. |
| 5 | `parser` | No parser or extractor change | N/A — oracle transcription only. |
| 6 | `external_text` | No foreign corpus ingested | N/A — literals from this worktree's live graph. |
| 7 | `resumable_flow` | No resumable session or watch loop | N/A. |
| 8 | `long_process` | Commands completed in seconds | N/A. |
| 9 | `timing_test` / `interruptible_operation` | No clocks, sleeps, or interrupt-sensitive jobs | N/A. |

## Changed-file list

- `test/self-hosting-oracle/declared-relations.ts` — nine Wave 1 triples (todo 1 × 3, todo 3 × 2, todo 5 × 4)
- `test/self-hosting-oracle/pack-members.ts` — refusal decision + delivery-facts Spec, in live manifest order
- `test/self-hosting-oracle/anchors.ts` — retarget `impl:protocol.delivery-facts`; add both test anchors with live identity/binding/site
- `test/self-hosting-graph.test.ts` — frozen totals `{ specs: 164, packs: 1, anchors: 177 }`, lengths `164 / 164 / 177`, nodes `342`, edges `760`, readiness `{ defined: 11, idea: 4, ready: 148, scoped: 1 }`
- `.omo/evidence/task-8-design-law-transfer.md` — this file

Not changed: per-Spec descriptor oracles, carriers, `expectedWarnings`, `src/`.

## Cleanup receipt

- `npm ci` / `npm run build` left gitignored `node_modules/` and `dist/` in this worktree.
- Validate left gitignored `generated/` (graph + 102 contract modules). Not staged.
- No temp product files. `git diff --check` exit 0. Prettier check on the four product files exit 0.
- Main worktree and todo-7 worktree untouched.

## Risks

- The structural-self-binding oracle site is the keep-alive beside the const, not the census `it(` the plan named. Moving the const next to the census `it(` would restore the planned site under the 24-line locality law; that edit is out of this todo's scope.
- Shared-oracle sync assumes Wave 1 product edges stay as measured. A later todo-7 open-question edit must not change these totals; it only touches per-Spec descriptors.
- Future evidence must keep CLI `dist/` realpath inside this worktree.
