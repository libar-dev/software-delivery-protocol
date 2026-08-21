# Task 5 — decidedBy fill tranche (design-law-transfer)

## Scope
Author verify-first `decidedBy` edges for the five frozen candidates in plan todo 5.
Shared `declared-relations.ts` lockstep is todo 8 (not this todo).
No cut sdp-import candidate, no other edges, no dependsOn, no supersedes.
Product carriers were landed in `655ece6`; this evidence file was remeasured and corrected in a follow-up evidence-only commit after adversarial verify found stale CLI measurement errors.

## Trusted measurement posture
All counts and recipe bodies below were produced by a **worktree-local** CLI:

1. `npm run build` in this checkout (real `dist/`, realpath
   `/home/darkomijic/dev-libar/software-delivery-protocol-design-law-transfer-5/dist`,
   not a symlink into another worktree).
2. `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`
3. `pnpm --silent sdp:q '…'` against that same `dist/cli/sdp.js`.

### Stale measurement that this rewrite retracts
The first evidence pass ran `sdp` through a foreign `dist` symlink (main checkout). That CLI under-extracted anchors and structure, producing false corpus claims:

- false: `86 anchors → 249 nodes · 547/551 edges`
- false: `0 memberOf`, `3 satisfies`
- false: recipe 17 cannot surface the fills / F3 structural-Spec caveat applies

Those claims are **withdrawn**. Product edges were always correct; only the evidence was wrong.

## Baseline (failing-first, product edges absent)
Before the product commit, each candidate subject had **no** `decidedBy` edge (queried live at authoring time; reconfirmed by the product diff which only *adds* four edges):

| Subject | decidedBy before |
| --- | --- |
| `spec:extraction.example-runner` | `[]` |
| `spec:extraction.derive-graph` | `[]` |
| `spec:validation.authored-honesty` | `[]` |
| `spec:consumers.reader` | `[]` |
| `spec:extraction.executable-contracts` | `[]` |

Pre-fill `decidedBy` total (live at authoring, carrier-declared only): **41**.
After four survivor fills: **45** (= 41 + 4).

## Gherkin tag mapping verification
File: `src/extract/gherkin.ts`
- `GHERKIN_RELATION_TAGS`: `"decided-by": "decidedBy"`
- `RESERVED_TAG_HEADS` includes `"decided-by"`
- Lawful head table includes `{ head: "decided-by", lawful: true }`
- Authoring form used: `@decided-by.spec:decisions.agent-surface-scripts-graph` beside
  `@refines.spec:consumers.agent-surface` on `specs/consumers/reader.sdp.gherkin`.
- No parser behavior added; existing mapping only.

## Verify-first analysis per candidate

### 1. `spec:extraction.example-runner` → `spec:decisions.binding-not-liveness` — DROP
- **Subject law** (example-runner Behavior): plan/run contract steps in authored order against a
  caller-supplied world; duplicate step text shares one handler; red steps name themselves in Spec
  words; missing/stale handlers are compile-time refusal via step-binding types; core contributes
  `unspecified`; entrypoints `planExample` / `runExamplePlan`.
- **Decision law** (MD-7): delivery facts record bindings and enabled-verifier existence; coverage
  gaps and human readiness stay explicit and never become graph facts.
- **Verdict:** Subject law is execution mechanics of bound contracts. It does not restate or descend
  from MD-7's delivery-fact / binding-not-liveness ruling. The only MD-7 mention is implementation
  JSDoc in `src/runner/index.ts` about placement of the executable half *below* the `specTest`
  anchor (execution confers no graph fact). That is binding-act / architectural placement around the
  runner, not the Spec's stated law — same misattribution class as the planning cut of
  `spec:carrier.sdp-import` → architectural-significance. `spec:extraction.runnable-modules` already
  carries the MD-7 execution-confers-no-fact rule in its own Behavior text.
- **Reason (exact):** subject's law is runner execution mechanics; MD-7 shaped placement of the
  executable half below the anchor, not the Spec's stated rules — edge would misattribute the
  ruling to the subject law.

### 2. `spec:extraction.derive-graph` → `spec:decisions.one-validation-path` — LAND
- **Subject law:** "Carrier reification feeds deriveGraph once; no consumer creates a second graph."
- **Decision law** (MD-14): validators consume the derived graph through one path — source,
  extraction, graph, then checks.
- **Verdict:** The one-derivation-seam rule is the extraction-side realization of the
  one-validation-path ruling. Lands.
- **Edit:** `specs/extraction/derive-graph.sdp.md` → `decidedBy: spec:decisions.one-validation-path`.

### 3. `spec:validation.authored-honesty` → `spec:decisions.binding-not-liveness` — LAND
- **Subject law:** machine truth is never authored; stated delivery facts must equal recomputed facts.
- **Decision law** (MD-7): delivery facts record bindings and enabled-verifier existence (not liveness).
- **Verdict:** The honesty recompute for delivery facts enforces MD-7's binding-derived model. Lands.
- **Edit:** `specs/validation/authored-honesty.sdp.md` → `decidedBy: spec:decisions.binding-not-liveness`.

### 4. `spec:consumers.reader` → `spec:decisions.agent-surface-scripts-graph` — LAND
- **Subject law:** thin typed loader (`createReader`) returns composable graph context.
- **Decision law:** agents script the typed graph through a thin reader surface.
- **Verdict:** The reader *is* that surface. Lands.
- **Edit:** `specs/consumers/reader.sdp.gherkin` → `@decided-by.spec:decisions.agent-surface-scripts-graph`.

### 5. `spec:extraction.executable-contracts` → `spec:decisions.point-per-example` — LAND
- **Subject law:** "An example is one point, so the step contract and the bound point derive from
  the same first complete entry…"
- **Decision law** (MD-17): an example binds exactly one point.
- **Verdict:** One-point contract generation descends directly from the ruling. Lands.
- **Edit:** `specs/extraction/executable-contracts.sdp.md` → `decidedBy: spec:decisions.point-per-example`.

### Cut at planning (not re-added)
- `spec:carrier.sdp-import` → `spec:decisions.architectural-significance-rides-primitives` — ruling
  shaped the component-binding act, not the import Spec's law.

## Drops summary
| Candidate | Result | Exact reason |
| --- | --- | --- |
| example-runner → binding-not-liveness | DROP | subject law is runner execution mechanics; MD-7 only shaped placement below the anchor, not the Spec's stated rules |
| derive-graph → one-validation-path | LAND | one-derivation-seam realizes one-validation-path |
| authored-honesty → binding-not-liveness | LAND | delivery-fact honesty recompute enforces MD-7 binding-derived facts |
| reader → agent-surface-scripts-graph | LAND | reader is the thin scripts-the-graph surface |
| executable-contracts → point-per-example | LAND | one-point contract generation descends from MD-17 |
| sdp-import → architectural-significance (planning cut) | not added | binding-act misattribution |

**Survivor count: 4**

## After-edit proof (trusted local CLI)

### Validate
```
pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
→ exit 0
→ 162 specs · 1 packs · 175 anchors → 338 nodes · 751 edges (0 errors, 0 warnings)
→ validate: 0 errors · 5 warnings (pinned honesty/gaps set only)
```

### Trusted graph structure counts (live)
```
decidedBy: 45
memberOf:  76
satisfies: 92
uses:      35
nodes:     338
edges:     751
byType:    Primitive 162 · Pack 1 · CodeNode 92 · Anchor 83
```

`decidedBy` **45** = baseline **41** + survivor count **4**. PASS.

### Exact subject relations (live)
```
spec:extraction.example-runner
  decidedBy: []   (dropped)
  satisfiesFrom: component:protocol.adapters, impl:protocol.example-runner-adapter,
                 component:protocol.runner, impl:protocol.example-runner,
                 component:protocol.testing, impl:protocol.example-testing-helpers

spec:extraction.derive-graph
  decidedBy: [{ to: 'spec:decisions.one-validation-path', claim: 'declared' }]
  satisfiesFrom: impl:protocol.carrier-reification, impl:protocol.derive-graph,
                 component:protocol.extract, impl:protocol.extract, impl:protocol.delivery-facts

spec:validation.authored-honesty
  decidedBy: [{ to: 'spec:decisions.binding-not-liveness', claim: 'declared' }]
  satisfiesFrom: impl:protocol.authored-honesty-shape, impl:protocol.authored-honesty-delivery-facts

spec:consumers.reader
  decidedBy: [{ to: 'spec:decisions.agent-surface-scripts-graph', claim: 'declared' }]
  satisfiesFrom: impl:protocol.reader-impact, component:protocol.reader, impl:protocol.reader

spec:extraction.executable-contracts
  decidedBy: [{ to: 'spec:decisions.point-per-example', claim: 'declared' }]
  satisfiesFrom: impl:protocol.executable-contracts, impl:protocol.example-space
```

### Recipe 17 — architecture map (live body from docs/agent-surface/recipes.md)
All four surviving fills appear on component `shapingDecisions` rows. Relevant component rows
(survivor subjects only called out; other pre-existing shaping decisions on the same rows omitted
from the hit table but present in the full query):

| Component | Survivor shapingDecision | subjects (survivor) |
| --- | --- | --- |
| `component:protocol.codegen` | `spec:decisions.point-per-example` | `spec:extraction.executable-contracts` |
| `component:protocol.extract` | `spec:decisions.one-validation-path` | `spec:extraction.derive-graph` |
| `component:protocol.graph` | `spec:decisions.one-validation-path` | `spec:extraction.derive-graph` |
| `component:protocol.graph` | `spec:decisions.point-per-example` | `spec:extraction.executable-contracts` |
| `component:protocol.reader` | `spec:decisions.agent-surface-scripts-graph` | `spec:consumers.reader` (also pre-existing `spec:consumers.agent-surface`) |
| `component:protocol.validate` | `spec:decisions.binding-not-liveness` | `spec:validation.authored-honesty` |

Survivor → component hit map (complete):
```
spec:extraction.derive-graph
  → component:protocol.extract / spec:decisions.one-validation-path
  → component:protocol.graph   / spec:decisions.one-validation-path

spec:validation.authored-honesty
  → component:protocol.validate / spec:decisions.binding-not-liveness

spec:consumers.reader
  → component:protocol.reader / spec:decisions.agent-surface-scripts-graph

spec:extraction.executable-contracts
  → component:protocol.codegen / spec:decisions.point-per-example
  → component:protocol.graph   / spec:decisions.point-per-example
```

**PASS:** every surviving fill appears on the relevant component row(s)
(`codegen`, `extract`, `graph`, `reader`, `validate`).

### Recipe 18 — decision map reverse join (live)
```
spec:decisions.one-validation-path:
  - spec:extraction.derive-graph          ← NEW fill
  - spec:validation.two-check-families

spec:decisions.binding-not-liveness:
  - spec:consumers.binding-language-views
  - spec:model.anchors
  - spec:validation.authored-honesty      ← NEW fill

spec:decisions.agent-surface-scripts-graph:
  - spec:consumers.agent-surface
  - spec:consumers.reader                 ← NEW fill

spec:decisions.point-per-example:
  - spec:extraction.executable-contracts  ← NEW fill
  - spec:model.spec-sections
```

## Manual QA
1. Pre-edit absence of each candidate `decidedBy`: confirmed at authoring time; product diff only adds the four edges.
2. Post-edit exact edges on trusted CLI: four declared edges; drop remains empty.
3. Count arithmetic: 41 + 4 = 45, matches live `decidedBy` query.
4. Validate exit 0 on trusted local `dist`; warning set unchanged (5 honesty/gaps).
5. Gherkin tag extracts to declared `decidedBy` (claim `declared`).
6. Recipe 17: all four survivors present on `codegen` / `extract` / `graph` / `reader` / `validate` rows.
7. Recipe 18: reverse join lists each new subject under its decision.
8. Product diff scope: exactly four carrier files, one line each; no oracle, no src parser, no other relation types. Evidence-only follow-up touches this file alone.

## Adversarial classes (nine)

| # | Class | Probe | Result |
| --- | --- | --- | --- |
| 1 | stale_state | First evidence pass used a foreign `dist` symlink and reported false 0/`memberOf` and empty recipe 17. Remediation: `npm run build` in this worktree; re-ran validate + recipes against realpath-local `dist/cli/sdp.js`. Live trusted counts: 175 anchors, 76 memberOf, 92 satisfies, decidedBy 45, recipe 17 hits on five components. | PASS after remediation — prior evidence failed this class; corrected here |
| 2 | dirty_worktree | `git status` / `git diff` after product commit clean; evidence-only follow-up stages only this file | PASS |
| 3 | misleading_success_output | Exact `decidedBy` 45 = 41+4; per-subject rows listed; recipe 17 component rows named with decision ids and subjects — not inferred, not claimed empty | PASS — numbers and rows match the trusted graph |
| 4 | malformed_input | N/A — no new parser; Gherkin tag uses existing mapping | N/A |
| 5 | external_text | N/A — no external corpus path | N/A |
| 6 | resumability | N/A — single authoring tranche + evidence remeasure | N/A |
| 7 | generated_state | `generated/` gitignored; validate rewrote graph.json locally; not staged | N/A / clean |
| 8 | long_commands | N/A — standard `sdp validate` / `sdp:q` / `npm run build` | N/A |
| 9 | timing_interrupts | N/A — no watches, sleeps, or interrupt-sensitive loops | N/A |

## Cleanup receipt
- Worktree-local `dist/` produced by `npm run build` (gitignored); used for trusted remeasure.
- `node_modules` may be a symlink into the main checkout for packages only; CLI binary is local `dist/`.
- No product Spec/oracle/src edits in the evidence follow-up.
- Evidence path: `.omo/evidence/task-5-design-law-transfer.md`.

## Risks
- Todo 8 must add the four new declared relations to `test/self-hosting-oracle/declared-relations.ts` (and frozen totals); this todo intentionally left that oracle untouched per plan parallelization.
- Drop of example-runner→MD-7 is a semantic judgment; if an owner later promotes an explicit "execution confers no delivery fact" rule onto the example-runner Spec itself, the edge could be reconsidered — today that law lives on runnable-modules / delivery-facts, not example-runner.
- Future evidence must keep CLI `dist/` realpath inside the active worktree; foreign `dist` silently under-extracts anchors and corrupts structural recipe output.

## Commits
1. `feat(specs): decidedBy fills so rulings surface in the architecture map` (`655ece6`) — product edges.
2. `fix(evidence): remeasure decidedBy fills on the trusted graph` — this evidence rewrite only.
