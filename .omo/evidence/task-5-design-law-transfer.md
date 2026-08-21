# Task 5 — decidedBy fill tranche (design-law-transfer)

## Scope
Author verify-first `decidedBy` edges for the five frozen candidates in plan todo 5.
Shared `declared-relations.ts` lockstep is todo 8 (not this todo).
No cut sdp-import candidate, no other edges, no dependsOn, no supersedes.

## Baseline (before edits)
- Command: `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity`
- Result: exit 0 — `162 specs · 1 packs · 86 anchors → 249 nodes · 547 edges (0 errors, 0 warnings)`; validate report `0 errors · 5 warnings` (pinned honesty/gaps set).
- `pnpm --silent sdp:q 'return graph.edges.filter(e=>e.type==="decidedBy").length'` → **41**
- Recipe 17 body (architecture map): `componentsWithCandidateDecisions: []` — no component row carried any of the four candidate decision ids (corpus condition: 0 `memberOf` edges; only 3 `satisfies` edges, none targeting candidate subjects).
- Per-subject shaping-decision relation **absence** (failing-first / manual proof before edit):

| Subject | decidedBy before | other relations |
| --- | --- | --- |
| `spec:extraction.example-runner` | `[]` | refines → executable-contracts; belongsTo pack |
| `spec:extraction.derive-graph` | `[]` | refines → self-hosting; constrainedBy → determinism; belongsTo pack |
| `spec:validation.authored-honesty` | `[]` | refines → two-check-families; belongsTo pack |
| `spec:consumers.reader` | `[]` | refines → agent-surface; belongsTo pack |
| `spec:extraction.executable-contracts` | `[]` | refines → build-pipeline; belongsTo pack |

## Gherkin tag mapping verification
File: `src/extract/gherkin.ts`
- `GHERKIN_RELATION_TAGS`: `"decided-by": "decidedBy"` (line 27)
- `RESERVED_TAG_HEADS` includes `"decided-by"` (line 46)
- Lawful head table includes `{ head: "decided-by", lawful: true }` (line 65)
- Authoring form used: `@decided-by.spec:decisions.agent-surface-scripts-graph` beside `@refines.spec:consumers.agent-surface` on the feature carrier (`specs/consumers/reader.sdp.gherkin`).
- No parser behavior added; existing mapping only.

## Verify-first analysis per candidate

### 1. `spec:extraction.example-runner` → `spec:decisions.binding-not-liveness` — DROP
- **Subject law** (example-runner Behavior): plan/run contract steps in authored order against a caller-supplied world; duplicate step text shares one handler; red steps name themselves in Spec words; missing/stale handlers are compile-time refusal via step-binding types; core contributes `unspecified`; entrypoints `planExample` / `runExamplePlan`.
- **Decision law** (MD-7): delivery facts record bindings and enabled-verifier existence; coverage gaps and human readiness stay explicit and never become graph facts.
- **Verdict:** Subject law is execution mechanics of bound contracts. It does not restate or descend from MD-7's delivery-fact / binding-not-liveness ruling. The only MD-7 mention is implementation JSDoc in `src/runner/index.ts` about placement of the executable half *below* the `specTest` anchor (execution confers no graph fact). That is binding-act / architectural placement around the runner, not the Spec's stated law — same misattribution class as the planning cut of `spec:carrier.sdp-import` → architectural-significance. `spec:extraction.runnable-modules` already carries the MD-7 execution-confers-no-fact rule in its own Behavior text.
- **Reason (exact):** subject's law is runner execution mechanics; MD-7 shaped placement of the executable half below the anchor, not the Spec's stated rules — edge would misattribute the ruling to the subject law.

### 2. `spec:extraction.derive-graph` → `spec:decisions.one-validation-path` — LAND
- **Subject law:** "Carrier reification feeds deriveGraph once; no consumer creates a second graph." Flat typed nodes/edges; declared relations Primitive→Primitive; delivery facts computed from resolving bindings.
- **Decision law** (MD-14): validators consume the derived graph through one path — source, extraction, graph, then checks; a parallel import-time path can approve values absent from the graph.
- **Verdict:** The one-derivation-seam rule is the extraction-side realization of the one-validation-path ruling. Subject law genuinely descends from the decision.
- **Edit:** `specs/extraction/derive-graph.sdp.md` frontmatter `decidedBy: spec:decisions.one-validation-path`.

### 3. `spec:validation.authored-honesty` → `spec:decisions.binding-not-liveness` — LAND
- **Subject law:** machine truth is never authored; Specs/Packs must not author derived edges, claims, or delivery facts; any stated delivery facts must equal the graph's recomputed facts (`checkAuthoringShape` / `checkDeliveryFacts`).
- **Decision law** (MD-7): delivery facts record bindings and enabled-verifier existence (not liveness).
- **Verdict:** The honesty recompute for delivery facts exists because MD-7 made those facts binding-derived signals rather than authored readiness or liveness claims. Subject law enforces that model. Lands.
- **Edit:** `specs/validation/authored-honesty.sdp.md` frontmatter `decidedBy: spec:decisions.binding-not-liveness`.

### 4. `spec:consumers.reader` → `spec:decisions.agent-surface-scripts-graph` — LAND
- **Subject law:** thin typed loader (`createReader`) decodes graph joins, claims, delivery facts, derived readiness, findings; concept/file/changeset entries return composable data without persisting state.
- **Decision law:** the typed graph is the visible contract; agents script it directly through a thin reader surface; verb walls refused.
- **Verdict:** The reader *is* the thin reader surface the decision mandates. Subject law descends directly.
- **Edit:** `specs/consumers/reader.sdp.gherkin` feature tag `@decided-by.spec:decisions.agent-surface-scripts-graph` (mapping verified above).

### 5. `spec:extraction.executable-contracts` → `spec:decisions.point-per-example` — LAND
- **Subject law:** per-example step contracts and per-parent space contracts from the graph; "An example is one point, so the step contract and the bound point derive from the same first complete entry; a further structured entry is named rather than left silently inert."
- **Decision law** (MD-17): an example binds exactly one point; table sugar expands statically to siblings; graph never stores multi-point examples.
- **Verdict:** One-point contract generation is a direct descent of the point-per-example ruling. Lands.
- **Edit:** `specs/extraction/executable-contracts.sdp.md` frontmatter `decidedBy: spec:decisions.point-per-example`.

### Cut at planning (not re-added)
- `spec:carrier.sdp-import` → `spec:decisions.architectural-significance-rides-primitives` — ruling shaped the component-binding act, not the import Spec's law.

## Drops summary
| Candidate | Result | Exact reason |
| --- | --- | --- |
| example-runner → binding-not-liveness | DROP | subject law is runner execution mechanics; MD-7 only shaped placement below the anchor / non-conferral of execution, not the Spec's stated rules |
| derive-graph → one-validation-path | LAND | one-derivation-seam realizes one-validation-path |
| authored-honesty → binding-not-liveness | LAND | delivery-fact honesty recompute enforces MD-7 binding-derived facts |
| reader → agent-surface-scripts-graph | LAND | reader is the thin scripts-the-graph surface |
| executable-contracts → point-per-example | LAND | one-point contract generation descends from MD-17 |
| sdp-import → architectural-significance (planning cut) | not added | binding-act misattribution |

**Survivor count: 4**

## After-edit proof
- Validate: exit 0 — `162 specs · 1 packs · 86 anchors → 249 nodes · 551 edges` (+4 edges); `0 errors · 5 warnings` (same honesty/gaps set).
- `decidedBy` count: **45** = baseline 41 + survivor count 4. PASS.
- Exact subject relations after edit:

```
spec:extraction.example-runner       decidedBy: []   (dropped)
spec:extraction.derive-graph         decidedBy: [{ to: 'spec:decisions.one-validation-path', claim: 'declared' }]
spec:validation.authored-honesty     decidedBy: [{ to: 'spec:decisions.binding-not-liveness', claim: 'declared' }]
spec:consumers.reader                decidedBy: [{ to: 'spec:decisions.agent-surface-scripts-graph', claim: 'declared' }]
spec:extraction.executable-contracts decidedBy: [{ to: 'spec:decisions.point-per-example', claim: 'declared' }]
```

- Recipe 17 (architecture map) after edit: still `shapingDecisions: []` on every component for these fills.
  - Cause (re-derived, not assumed): corpus has **0** `memberOf` edges and only **3** `satisfies` edges (`impl:protocol.authoring-on-ramp`, `impl:protocol.delivery-session-on-ramp`, `impl:protocol.authoring-recipes`) — none target the four survivor subjects. Recipe 17 joins `decidedBy` only through Specs that component members `satisfies`. Overlap of all `satisfies` targets with all `decidedBy` subjects is `[]` even for pre-existing decidedBy edges.
  - Honest status: edges are present and queryable; they surface on the **decision map** (recipe 18 reverse join), not on recipe 17 component rows, until those subjects gain component-realized `satisfies` bindings. Plan F3 anticipates this class ("a ruling whose subjects are structural Specs, not realized carrier Specs, belongs to the decision map — recipe 18 — not the component join").
- Recipe 18 reverse join (live) confirming survivors:

```
spec:decisions.one-validation-path:
  - spec:extraction.derive-graph          ← NEW
  - spec:validation.two-check-families
spec:decisions.binding-not-liveness:
  - spec:consumers.binding-language-views
  - spec:model.anchors
  - spec:validation.authored-honesty      ← NEW
spec:decisions.agent-surface-scripts-graph:
  - spec:consumers.agent-surface
  - spec:consumers.reader                 ← NEW
spec:decisions.point-per-example:
  - spec:extraction.executable-contracts  ← NEW
  - spec:model.spec-sections
```

## Manual QA
1. Pre-edit absence of each candidate decidedBy: confirmed via `sdp:q` (table above).
2. Post-edit exact edges: four declared edges, drop remains empty.
3. Count arithmetic: 41 + 4 = 45, matches live query.
4. Validate exit 0 with unchanged warning set.
5. Gherkin tag extracted to declared `decidedBy` (claim `declared`) — confirms mapping.
6. Recipe 17 component-row presence: **not met for any survivor** under current corpus structure (documented above); reverse join via recipe 18 confirms the four fills.
7. Diff scope: exactly four carrier files, one line each; no oracle, no src parser, no other relation types.

## Adversarial classes (nine)

| # | Class | Probe | Result |
| --- | --- | --- | --- |
| 1 | stale_state | Live `sdp validate` + `sdp:q` decidedBy count and per-subject rows after edit (not cached notes) | PASS — count 45; four exact edges present |
| 2 | dirty_worktree | `git status` / `git diff` | PASS — only the four intended carrier files modified (+ evidence untracked until commit); no oracle/src edits |
| 3 | misleading_success_output | Exact edge count 45 = 41+4; per-subject rows listed; recipe 17 empty rows recorded honestly rather than claimed green | PASS — numbers and rows match; recipe 17 limitation not papered over |
| 4 | malformed_input | N/A — no new parser; Gherkin tag uses existing mapping | N/A |
| 5 | external_text | N/A — no external corpus or clipboard path | N/A |
| 6 | resumability | N/A — single atomic authoring tranche, no multi-step resume surface | N/A |
| 7 | generated_state | `generated/` gitignored; validate rewrote graph.json locally; not staged | N/A / clean |
| 8 | long_commands | N/A — standard `sdp validate` / `sdp:q` only | N/A |
| 9 | timing_interrupts | N/A — no watches, sleeps, or interrupt-sensitive loops | N/A |

## Cleanup receipt
- Removed temporary worktree symlinks `dist` → main `dist` and `node_modules` → main `node_modules` used only to run the local CLI (worktree had neither).
- No leftover scratch files under `.tmp-scratch`.
- Evidence path: `.omo/evidence/task-5-design-law-transfer.md`.
- Working tree at commit time: four carrier edits + this evidence file only.

## Risks
- Recipe 17 will not show these fills on component rows until the subjects are realized via component-member `satisfies` (and `memberOf` structure exists). Downstream todo 9 / F3 must not claim component-row rendering for these four without re-deriving.
- Todo 8 must add the four new declared relations to `test/self-hosting-oracle/declared-relations.ts` (and frozen totals); this todo intentionally left that oracle untouched per plan parallelization.
- Drop of example-runner→MD-7 is a semantic judgment; if an owner later promotes an explicit "execution confers no delivery fact" rule onto the example-runner Spec itself, the edge could be reconsidered — today that law lives on runnable-modules / delivery-facts, not example-runner.

## Commit
`feat(specs): decidedBy fills so rulings surface in the architecture map`
