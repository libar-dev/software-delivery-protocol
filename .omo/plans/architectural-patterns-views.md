# architectural-patterns-views - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** A ratified decision (MD-34) that architectural significance rides existing primitives, closing the vocabulary question; the engine's architecturally significant units become graph-visible through widened component/uses anchor coverage; three live-derived `sdp q` recipes (17-19) replace grep-style codebase investigation; and the agent-surface skills + AGENTS.md highlight the new views.

**Why this approach:** It rides existing primitives — no new relation types, anchor fields, or reader methods — consistent with the MD-30/MD-33 refusal shape. The three recipe bodies were pre-verified by live execution during planning, so they need zero engine surface.

**What it will NOT do:** No symbol-level blast radius (file-level only); no `ready` promotion of the two enriched Specs (human statement, your review); no committed renderings of architecture views (derived on demand, MD-32 freeze intact); no new `plans/` file.

**Effort:** Medium
**Risk:** Low-Medium — docs and anchor annotations only, but the self-hosting oracle lockstep requires exact transcription precision; census churn is expected and harmless.
**Decisions to sanity-check:** (1) Minting `component:protocol.import` and `component:protocol.testing` reverses plan-35's deliberate no-import-component choice — user-approved. (2) The 12-edge `dependsOn` tranche leaves `supersedes` at zero; deferred candidates are explicitly out of scope. (3) Readiness stays at `defined` for both enriched Specs; `ready` is left to your review.

Your next move: high-accuracy momus review (required). Full execution detail follows below.

---

> TL;DR (machine): Medium effort, Low-Medium risk, 15 implementation todos + 4 final verifiers. Delivers MD-34 ruling + structural self-binding coverage + 3 architecture recipes + on-ramp highlights. No engine behavior changes.

## Scope
### Must have
1. Feature branch `feature/architectural-patterns-views` created before any change.
2. The ruling: new decision Spec `spec:decisions.architectural-significance-rides-primitives` (full text supplied in todo 2), MD-34 registry row in `docs/concept/DECISIONS.md`, Pack manifest + oracle lockstep.
3. `spec:model.structural-patterns` enriched: both blocking open questions resolved by the ruling, `model.terms` written, `decidedBy` wired to the new decision, readiness `idea` → `defined` (floor verified: model-kind defined = non-empty model.terms; refines target `spec:model.anchors` is ready).
4. Anchor widening under the ratified criterion (exported public surface + cross-component reach): mint `component:protocol.import` and `component:protocol.testing` (user-approved Q1), widen `component`/`uses` coverage for the whitelisted units (tables in todos 4-7), oracle rosters updated in lockstep.
5. Inter-decision relations: 12 `dependsOn` edges (exact list in todo 8) + 6 inbound `decidedBy` fills. `supersedes` stays at ZERO — no genuine replacement exists (MD-33 forbids manufacturing edges).
6. `spec:protocol.structural-self-binding` enriched once coverage lands: criterion question resolved by the ruling, `decidedBy` wired, readiness `idea` → `defined` (floor verified: a behavior rule is already present; refines target `spec:protocol.self-hosting` is defined).
7. Recipes 17 (architecture map), 18 (decision map), 19 (planning slice) appended to `docs/agent-surface/recipes.md` — bodies supplied verbatim in todo 10, pre-verified by live `sdp q` execution during planning.
8. Test lockstep: `test/recipes.test.ts` per-recipe ground-truth blocks + sessions ordinal loop extension.
9. On-ramp highlights: `.agents/skills/sdp-agent-surface/SKILL.md`, `.agents/skills/sdp-sessions/SKILL.md`, `AGENTS.md` (lines 79, 125 + key-decision named list), `README.md` (lines 31, 147).
10. Gate: `npm run check` exit 0; counts re-measured at close and labeled re-derived; coherent-boundary commits on the branch.
### Must NOT have (guardrails, anti-slop, scope boundaries)
- NO new relation types, anchor fields, reader methods, or `component:` naming semantics. If a recipe join proves impossible with the current surface, STOP and surface — never mint reader surface (second-caller bar).
- NO `supersedes` edges and NO scheduling-flavored edges (MD-33); independence is absence of an edge.
- NO anchors satisfying decision Specs (MD-26) or unfinished idea-rung Specs (recipe-2 drift); new anchors only where the unit already realizes an already-implemented Spec — verify the target Spec's text first, skip + record on mismatch, never force.
- NO anchors on incidental plumbing: `src/index.ts` barrel, `src/model/code-anchor.ts`, `src/extract/markdown-body-*.ts`, `src/extract/markdown-{support,types,yaml-policy,envelope,frontmatter}.ts`, `src/extract/{serialize,set-own,gherkin-kind-honesty}.ts`, `src/cli/{artifacts,build-args,import-publish,import-scan,validate-watch}.ts`, `src/projections/{owned-prose,diagnostic-banner,design-review-markdown,design-review-section-content,design-review-sections}.ts`, `src/import/{data-access,markdown-fidelity}.ts`, `src/cli/new-spec-command.ts` (no realizing Spec exists).
- NO committed renderings of the new views — recipes are derived on demand (MD-32 projections freeze intact).
- NO `ready` promotion of the two enriched Specs — `ready` is a human statement, left to the user's review.
- NO engine `src/` behavior changes — diffs under `src/` are `codeAnchor` declarations only.
- NO new `plans/` file — plan 38 stays the arc pointer; the graph carries the backlog. The open question on `spec:consumers.graph-first-planning` remains part of the broader arc boundary and is explicitly out of scope for this execution slice.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after in the same commit — recipe bodies were already verified by live execution during planning against the then-current corpus; `test/recipes.test.ts` gains ground-truth `it` blocks mirroring recipes 12-16, and F3 re-runs recipes 17-19 against the post-change graph. The self-hosting oracle suite (`test/self-hosting-graph.test.ts` + `test/self-hosting-oracle/*`) is updated in lockstep with every corpus edit. Framework: vitest via `npm test`; full gate `npm run check`.
- Evidence: `.omo/evidence/task-<N>-architectural-patterns-views.md` per todo (this session is not inside ulw-loop, so `.omo/evidence/` is the root).

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.

- Wave 1: todo 1 (branch — blocks everything).
- Wave 2: todo 2 (the ruling — the new decision Spec must exist before anything wires to it).
- Wave 3 (7 parallel): todos 3, 4, 5, 6, 7, 8, 10. Each todo edits only its own Spec or `src/` files; shared oracle rosters are intentionally NOT updated here to avoid parallel file collisions.
- Wave 4 (3 parallel): todos 9 (needs W3 coverage landed), 12, 13.
- Wave 5: todo 15 (oracle sync — transcribes all shared rosters and frozen totals once, after todos 3-9 have landed).
- Wave 6: todo 11 (tests — needs oracle sync and all corpus work landed).
- Wave 7: todo 14 (gate + re-measure + close).

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | — | all | — |
| 2 | 1 | 3, 4, 5, 6, 7, 8, 9, 15 | — |
| 3 | 2 | 15 | 4, 5, 6, 7, 8, 10 |
| 4 | 2 | 9, 15 | 3, 5, 6, 7, 8, 10 |
| 5 | 2 | 9, 15 | 3, 4, 6, 7, 8, 10 |
| 6 | 2 | 9, 15 | 3, 4, 5, 7, 8, 10 |
| 7 | 2 | 9, 15 | 3, 4, 5, 6, 8, 10 |
| 8 | 2 | 15 | 3, 4, 5, 6, 7, 10 |
| 9 | 4, 5, 6, 7 | 15 | 3, 8, 10, 12, 13 |
| 10 | 1 | 11, 12, 13 | 3, 4, 5, 6, 7, 8, 9 |
| 11 | 3, 4, 5, 6, 7, 8, 9, 10, 15 | 14 | — |
| 12 | 10 | 14 | 9, 11, 13, 15 |
| 13 | 10 | 14 | 9, 11, 12, 15 |
| 14 | all | — | — |
| 15 | 3, 4, 5, 6, 7, 8, 9 | 11 | 12, 13 |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [x] 1. Create feature branch
  What to do: `git checkout -b feature/architectural-patterns-views` from current HEAD. Must NOT commit from an unsafe dirty baseline; do not push unless user explicitly requests.
  Parallelization: Wave 1 | Blocked by: — | Blocks: all
  References: AGENTS.md (SSH transport, commit discipline)
  Acceptance criteria: `git branch --show-current` returns `feature/architectural-patterns-views`
  QA happy: branch exists, HEAD is clean. QA failure: dirty baseline — abort and record dirty paths in evidence.
  Commit: N
  Recommended task executor category: git

- [x] 2. Author ruling — decision Spec + MD-34 + pack manifest + per-Spec oracle lockstep
  What to do: Write `specs/decisions/architectural-significance-rides-primitives.sdp.md` (full text below). Add MD-34 row to `docs/concept/DECISIONS.md`. Append the new decision to `specs/self-hosting.pack.sdp.md`. Update per-Spec oracles: `test/self-hosting-oracle/decisions.ts` (full descriptor), `test/self-hosting-oracle/pack-members.ts` (append id). Shared rosters (`declared-relations.ts`, `structural-edges.ts`, `anchors.ts`, frozen totals) are updated in todo 15, not here. Must NOT change other decision Specs; do not add supersedes or belongsTo edges.
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: 3, 4, 5, 6, 7, 8, 9
  References:
  - Exemplar decision Spec: `specs/decisions/structural-anchor-semantics.sdp.md`
  - MD registry rows: `docs/concept/DECISIONS.md:41-44`
  - Pack manifest: `specs/self-hosting.pack.sdp.md` (decisions list)
  - Oracles: `test/self-hosting-oracle/decisions.ts`, `test/self-hosting-oracle/pack-members.ts`
  - Decision Spec text to copy:
    ```yaml
    ---
    id: spec:decisions.architectural-significance-rides-primitives
    kind: decision
    altitude: feature
    readiness: ready
    relations:
      refines: spec:model.anchors
      dependsOn:
        - spec:decisions.structural-anchor-semantics
        - spec:decisions.binding-not-liveness
    ---
    # Architectural significance rides existing primitives
    ## Intent
    - outcome: Rule that architecturally significant patterns and their relationships are authored on the existing Spec primitive, relation vocabulary, and structural anchors, so the graph answers architecture questions without a second architecture vocabulary.
    ## Decision
    - context: `spec:model.structural-patterns` asked whether a vocabulary beyond `component` and `uses` passes the ADR three-part test, and "pattern" is not a ratified term; gen-1's tag-registry drift (~50→~26 tags) is the recorded failure of an open structural vocabulary (MD-30 cites it).
    - decision: Architectural significance is authored on existing primitives, in order. First, a pattern is a `decision`-kind or `model`-kind Spec; no "pattern" term or kind is ratified. Second, relationships between patterns are the existing relations — `dependsOn`, `supersedes`, `refines`, `decidedBy` — with `dependsOn` reserved for genuine semantic need and `supersedes` for actual replacement under the ADR test; scheduling-flavored edges stay refused (MD-33). Third, code linkage rides the `satisfies` → `decidedBy` join: a component or member anchor satisfies the Spec it realizes, and that Spec names its shaping decisions by `decidedBy`; code never satisfies a decision Spec directly (MD-26). Fourth, grouping is derived from id families and the component graph, not new Packs. Fifth, the significance criterion for engine self-binding is exported public surface plus cross-component reach; under it `component:protocol.import` and `component:protocol.testing` enter the accepted component set.
    - rationale: Hard to reverse — it permanently closes the vocabulary question and sets the grain at which architecture is authored; surprising without context — the concept "pattern" dissolves into named coordinates rather than gaining a word; real trade-off — CodeNode-grain pattern roles and machine-checked forbidden dependencies are given up to preserve one graph language.
    - consequence: The two blocking open questions on `spec:model.structural-patterns` resolve: no vocabulary beyond `component`/`uses` passes the ADR test, and no "pattern" term is ratified.
    - consequence: Two documented grain limits stand as named limits, not holes: pattern membership is Spec-grain (one `codeAnchor` carries one `satisfies`), and negative constraints are claimable but not enforced until the deferred architecture-enforcement validator family lands.
    - consequence: New `codeAnchor`s minted under this ruling satisfy only Specs the unit already realizes; anchors are never pointed at decision Specs or unfinished Specs to manufacture coverage.
    - consequence: `component:protocol.import` and `component:protocol.testing` join the accepted component set; the structural-edges oracle's import exception comment is retired by this ruling.
    - alternative: A dedicated pattern layer (`participatesIn` fields, `pattern:` ids, an architecture validator) was refused — it recreates the MD-30/MD-33-refused engine surface and the gen-1 taxonomy drift.
    - alternative: Deriving architecture from imports stays refused (MD-30): structural edges are authored declarations, never inference.
    ```
  - MD-34 row to append:
    `| MD-34 | architectural significance rides existing primitives | durable | Patterns are decision/model-kind Specs linked by the existing relations, code linkage rides the satisfies → decidedBy join, and grouping is derived — no pattern vocabulary is admitted. | [Spec](../../specs/decisions/architectural-significance-rides-primitives.sdp.md) (`spec:decisions.architectural-significance-rides-primitives`) |`
  Acceptance criteria: `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` exits 0; the new decision appears in `g.specs().filter(s => s.id === "spec:decisions.architectural-significance-rides-primitives")` with readiness `ready` and 3 relations.
  QA happy: new Spec extracted, oracle suite passes. QA failure: extraction error or oracle mismatch — fix frontmatter or transcription.
  Commit: Y | feat(specs): rule architectural significance rides existing primitives (MD-34)
  Recommended task executor category: unspecified-high

- [x] 3. Enrich spec:model.structural-patterns to defined
  What to do: Edit `specs/model/structural-patterns.sdp.md`: rewrite the title and outcome so they do not assert that patterns live "beyond component membership and uses edges" — MD-34 rules they dissolve into existing primitives. Remove/resolve the two blocking open questions. Add `model.terms` content. Add `decidedBy` relation to the new decision Spec. Change readiness `idea` → `defined`. Update per-Spec oracle: `test/self-hosting-oracle/model.ts` (readiness, sections). Shared rosters are updated in todo 15. Must NOT change the Spec id or kind; do not claim ready.
  Parallelization: Wave 3 | Blocked by: 2 | Blocks: 15
  References: `specs/model/structural-patterns.sdp.md`, `test/self-hosting-oracle/model.ts:388+`
  - Title/outcome rewrite target: title becomes "Architecturally significant patterns dissolve into existing primitives"; outcome becomes "Patterns and their relationships are authored as decision/model-kind Specs, existing relations, and the satisfies→decidedBy join — no new vocabulary is needed beyond the structural anchors already in the graph."
  - `model.terms` to add:
    ```
    ## Model
    - architecturally significant unit: a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding.
    - pattern: not a ratified term — a named coordinate carried by decision/model-kind Specs and their decidedBy edges.
    ```
  Acceptance criteria: `pnpm --silent sdp validate ...` exits 0; `g.specContext("spec:model.structural-patterns").statedReadiness === "defined"` and floorFailures empty. Also delete the now-empty `### Open questions` heading in the Spec file.
  QA happy: derived readiness matches stated. QA failure: floor failure (e.g. model.terms empty) — add terms.
  Commit: Y | docs(specs): resolve structural-patterns blocking questions
  Recommended task executor category: unspecified-low

- [x] 4. Mint component:protocol.import and component:protocol.testing
  What to do: Add `codeAnchor` calls in `src/import/import.ts`, `src/import/emit-markdown.ts`, `src/testing/index.ts`; edit `src/cli/import-command.ts` to add `component: protocol.import` to its existing anchor. Add component anchors in `src/import/import.ts` and `src/testing/index.ts`. Add `uses` edges: import → [model, extract]; testing → [adapters, runner]; add `component:protocol.import` to `component:protocol.cli` uses (edit `src/cli/build-command.ts` anchor). `component:protocol.testing` satisfies the existing `spec:extraction.example-runner` text; do not edit that Spec. Shared rosters (`structural-edges.ts`, `anchors.ts`, frozen totals) are updated in todo 15, not here. Must NOT anchor on `src/import/data-access.ts` or `src/import/markdown-fidelity.ts` (incidental plumbing); do not satisfy decision Specs.
  Parallelization: Wave 3 | Blocked by: 2 | Blocks: 9, 15
  References: `src/import/import.ts`, `src/import/emit-markdown.ts`, `src/testing/index.ts`, `src/cli/import-command.ts`, `src/cli/build-command.ts`; exemplar component anchor: `src/model/anchors.ts:71`
  - New anchors to mint:
    - `src/import/import.ts`: component `component:protocol.import` (satisfies `spec:carrier.sdp-import`); impl `impl:protocol.sdp-import-core` (satisfies `spec:carrier.sdp-import`, memberOf import).
    - `src/import/emit-markdown.ts`: impl `impl:protocol.sdp-import-markdown-emit` (satisfies `spec:carrier.sdp-import`, memberOf import).
    - `src/cli/import-command.ts`: existing `impl:protocol.sdp-import` gains `component: protocol.import`.
    - `src/testing/index.ts`: component `component:protocol.testing` (satisfies `spec:extraction.example-runner`); impl `impl:protocol.example-testing-helpers` (satisfies `spec:extraction.example-runner`, memberOf testing).
  Acceptance criteria: validate exits 0; `g.specContext("spec:carrier.sdp-import").implementations` includes the new import impls; graph query shows `component:protocol.import` and `component:protocol.testing` as CodeNodes with memberOf edges.
  QA happy: oracle suite passes after roster updates. QA failure: locality invariant (>24 lines between anchor declaration and site) — move anchor or adjust site.
  Commit: Y | feat(structure): mint import and testing components
  Recommended task executor category: unspecified-high

- [x] 5. Widen extract-family anchor coverage
  What to do: Add `codeAnchor` calls in `src/extract/{carrier.ts, reify.ts, discover.ts, protocol-bindings.ts}` with `component: protocol.extract`, `satisfies` targets, and `uses` where architectural. Verify each target Spec text before authoring. Shared rosters are updated in todo 15, not here. Must NOT anchor on incidental plumbing (Scope OUT list).
  Parallelization: Wave 3 | Blocked by: 2 | Blocks: 9, 15
  References: `src/extract/carrier.ts`, `src/extract/reify.ts`, `src/extract/discover.ts`, `src/extract/protocol-bindings.ts`; oracles same as todo 4.
  - Satisfies targets (verify before authoring; skip on mismatch):
    - `src/extract/carrier.ts` → `spec:extraction.runnable-modules`
    - `src/extract/reify.ts` → `spec:extraction.runnable-modules`
    - `src/extract/discover.ts` → `spec:extraction.excludes`
    - `src/extract/protocol-bindings.ts` → `spec:model.anchors`
  Acceptance criteria: validate exits 0; graph shows new impl CodeNodes with memberOf to extract.
  QA happy: oracle passes. QA failure: target Spec mismatch — skip unit, record in evidence.
  Commit: Y | feat(anchors): widen extract coverage
  Recommended task executor category: unspecified-low

- [x] 6. Widen graph, validate, and reader anchor coverage
  What to do: Add `codeAnchor` calls in `src/graph/{delivery-facts.ts, example-space.ts}`, `src/validate/{graph-index.ts, contracts.ts}`, and add `uses` edge `reader → model` on the `component:protocol.reader` anchor in `src/reader/reader.ts`. Verify target Specs; skip on mismatch. Shared rosters are updated in todo 15, not here.
  Parallelization: Wave 3 | Blocked by: 2 | Blocks: 9, 15
  References: `src/graph/delivery-facts.ts`, `src/graph/example-space.ts`, `src/validate/graph-index.ts`, `src/validate/contracts.ts`, `src/reader/reader.ts`; oracles same.
  - Satisfies targets (verify before authoring; skip on mismatch):
    - `src/graph/delivery-facts.ts` → `spec:extraction.derive-graph`
    - `src/graph/example-space.ts` → `spec:extraction.executable-contracts`
    - `src/validate/graph-index.ts` → `spec:validation.two-check-families`
    - `src/validate/contracts.ts` → `spec:validation.two-check-families`
  Acceptance criteria: validate exits 0; graph shows new impls with memberOf.
  QA happy: oracle passes. QA failure: skip + record.
  Commit: Y | feat(anchors): widen graph/validate/reader coverage
  Recommended task executor category: unspecified-low

- [x] 7. Widen CLI anchor coverage
  What to do: Add `codeAnchor` calls in `src/cli/{sdp.ts, census-command.ts, mermaid-command.ts, gherkin-command.ts}` with `component: protocol.cli` and satisfies targets. `src/cli/new-spec-command.ts` has no realizing Spec → SKIP (record). Shared rosters are updated in todo 15, not here.
  Parallelization: Wave 3 | Blocked by: 2 | Blocks: 9, 15
  References: `src/cli/sdp.ts`, `src/cli/census-command.ts`, `src/cli/mermaid-command.ts`, `src/cli/gherkin-command.ts`; oracles same.
  - Satisfies targets (verify before authoring; skip on mismatch):
    - `src/cli/sdp.ts` → `spec:consumers.agent-surface`
    - `src/cli/census-command.ts` → `spec:consumers.census-page`
    - `src/cli/mermaid-command.ts` → `spec:consumers.mermaid-view`
    - `src/cli/gherkin-command.ts` → `spec:consumers.gherkin-view`
  Acceptance criteria: validate exits 0; graph shows new cli impls.
  QA happy: oracle passes. QA failure: skip + record.
  Commit: Y | feat(anchors): widen CLI coverage
  Recommended task executor category: unspecified-low

- [x] 8. Author inter-decision dependsOn tranche and decidedBy fills
  What to do: Edit frontmatter of the listed Specs to add the exact relations. The 12 candidate dependsOn edges:
    1. `spec:decisions.carrier-universality` → `spec:decisions.prose-ownership` (universality's prose lawfulness rides MD-19's owners)
    2. `spec:decisions.carrier-universality` → `spec:decisions.pack-markdown-carrier` ("Packs stay under MD-25")
    3. `spec:decisions.carrier-universality` → `spec:decisions.carrier-ruling` (reaffirms MD-18 default; drop if it cannot survive the "genuinely needs the other" bar)
    4. `spec:decisions.agent-front-door` → `spec:decisions.agent-surface-scripts-graph` (front door instantiates scripts-graph contract)
    5. `spec:decisions.mcp-deferred` → `spec:decisions.agent-surface-scripts-graph` (deferral coherent because scripted surface exists)
    6. `spec:decisions.structural-anchor-semantics` → `spec:decisions.binding-not-liveness` (specializes MD-7's claim boundary)
    7. `spec:decisions.verification-posture-not-realization` → `spec:decisions.binding-not-liveness` (realization stays binding-derived)
    8. `spec:decisions.example-realization-posture` → `spec:decisions.binding-not-liveness` (implemented stays anchor-derived)
    9. `spec:decisions.carried-evidence` → `spec:decisions.kind-conditional-floor` (natural evidence is the kind-conditional clause)
    10. `spec:decisions.carried-evidence` → `spec:decisions.content-only-sections` (polices promoted content)
    11. `spec:decisions.decision-readiness-posture` → `spec:decisions.kind-conditional-floor` (registry ratification is the decision kind's natural evidence)
    12. `spec:decisions.planning-truths-placement` → `spec:decisions.shipped-projections-frozen` (generalizes the frozen-reopen pattern)
  The 6 decidedBy fills:
    - `spec:consumers.agent-surface` → `spec:decisions.agent-front-door`
    - `spec:validation.warn-level-signals` → `spec:decisions.decision-readiness-posture`
    - `spec:model.core-model` → `spec:decisions.example-realization-posture`
    - `spec:protocol.self-hosting` → `spec:decisions.plain-language-references`
    - `spec:carrier.gherkin-authoring` → `spec:decisions.sdp-gherkin-extension`
    - `spec:model.anchors` → `spec:decisions.structural-anchor-semantics`
  Must NOT add supersedes; do not add scheduling-flavored edges; do not add edges without the quoted justification. If a candidate edge does not survive the "genuinely needs the other" bar, drop it and record the reason in `.omo/evidence/task-8-architectural-patterns-views.md`. Shared rosters are updated in todo 15, not here.
  Parallelization: Wave 3 | Blocked by: 2 | Blocks: 15
  References: `specs/decisions/*.sdp.md` frontmatter; `test/self-hosting-oracle/declared-relations.ts`; MD-33 (`spec:decisions.planning-truths-placement`) forbids scheduling edges.
  Acceptance criteria: `pnpm --silent sdp validate ...` exits 0; a graph query for inter-decision `dependsOn` returns the measured count of authored edges (expected up to 15, including the pre-existing edge and the 2 edges on the new decision Spec from todo 2), not a hardcoded number.
  QA happy: the authored edges match the candidate list minus any dropped entries. QA failure: dangling target — fix frontmatter.
  Commit: Y | feat(specs): inter-decision dependsOn tranche and decidedBy fills
  Recommended task executor category: unspecified-low

- [x] 9. Enrich spec:protocol.structural-self-binding to defined
  What to do: Edit `specs/protocol/structural-self-binding.sdp.md`: resolve the criterion open question (answered by MD-34), add `decidedBy` to the new decision Spec, enrich behavior rules if needed, change readiness `idea` → `defined`. Update per-Spec oracle: `test/self-hosting-oracle/protocol.ts` (readiness, sections). Shared rosters are updated in todo 15, not here. Must NOT claim ready.
  Parallelization: Wave 4 | Blocked by: 4, 5, 6, 7 | Blocks: 15
  References: `specs/protocol/structural-self-binding.sdp.md`, `test/self-hosting-oracle/protocol.ts:27+`, `test/self-hosting-oracle/declared-relations.ts`
  - Behavior rules to add:
    ```
    ## Behavior
    - rule: The significance criterion for engine self-binding is exported public surface plus cross-component reach.
    - rule: Every architecturally significant unit carries component membership; it also carries uses declarations for each component it architecturally depends on, so structural recipes answer dependency questions about the engine itself.
    ```
  Acceptance criteria: validate exits 0; `g.specContext("spec:protocol.structural-self-binding").statedReadiness === "defined"` and floorFailures empty.
  QA happy: derived readiness matches stated. QA failure: floor failure — add rules/examples.
  Commit: Y | docs(specs): enrich structural-self-binding after coverage lands
  Recommended task executor category: unspecified-low

- [x] 10. Append recipes 17–19 to docs/agent-surface/recipes.md
  What to do: Append the three recipes in the established shape (heading, need line, ` ```js ` body, trailing prose). Update the intro parameterized list (line ~35): "Recipes 3, 6, 9, and 14" → "Recipes 3, 6, 9, 14, and 19". The bodies are supplied verbatim below. Must NOT use single quotes inside recipe bodies (test forbids `'`); do not add imports/exports.
  Parallelization: Wave 3 | Blocked by: 1 | Blocks: 11, 12, 13
  References: `docs/agent-surface/recipes.md` (template: recipe 12 at lines 464-499); `test/recipes.test.ts:229-233,343-368,371-380`; intro line ~35.
  - Recipe 17 — Architecture map:
    ````
    ## 17. Architecture map
    const nodes = graph.nodes;
    const edges = graph.edges;
    const codeNodesById = new Map(
      nodes
        .filter((node) => node.nodeType === "CodeNode")
        .map((node) => [node.id, node]),
    );
    const componentIds = new Set(
      [...codeNodesById.keys()].filter((id) => id.startsWith("component:")),
    );
    const membersByComponent = new Map();
    const ownerByMember = new Map();
    
    for (const edge of edges.filter((edge) => edge.type === "memberOf")) {
      const members = membersByComponent.get(edge.to) ?? [];
      members.push(edge.from);
      membersByComponent.set(edge.to, members);
      ownerByMember.set(edge.from, edge.to);
    }
    
    const ownerOf = (id) => componentIds.has(id) ? id : ownerByMember.get(id);
    const usesOutByComponent = new Map();
    const usedByByComponent = new Map();
    
    for (const edge of edges.filter((edge) => edge.type === "uses")) {
      const from = ownerOf(edge.from);
      const to = ownerOf(edge.to);
      if (from === undefined || to === undefined) continue;
      const outgoing = usesOutByComponent.get(from) ?? new Set();
      outgoing.add(to);
      usesOutByComponent.set(from, outgoing);
      const incoming = usedByByComponent.get(to) ?? new Set();
      incoming.add(from);
      usedByByComponent.set(to, incoming);
    }
    
    const decisionsBySubject = new Map();
    for (const edge of edges.filter((edge) => edge.type === "decidedBy")) {
      const decisions = decisionsBySubject.get(edge.from) ?? new Set();
      decisions.add(edge.to);
      decisionsBySubject.set(edge.from, decisions);
    }
    
    const components = [...componentIds].sort().map((id) => {
      const memberIds = [...new Set(membersByComponent.get(id) ?? [])].sort();
      const anchors = [id, ...memberIds];
      const satisfiedSpecs = [...new Set(
        edges
          .filter((edge) => edge.type === "satisfies" && anchors.includes(edge.from))
          .map((edge) => edge.to),
      )].sort();
      const decisionSubjects = new Map();
    
      for (const specId of satisfiedSpecs) {
        for (const decisionId of decisionsBySubject.get(specId) ?? []) {
          const subjects = decisionSubjects.get(decisionId) ?? [];
          subjects.push(specId);
          decisionSubjects.set(decisionId, subjects);
        }
      }
    
      const usesOut = [...(usesOutByComponent.get(id) ?? [])].sort();
      const usedBy = [...(usedByByComponent.get(id) ?? [])].sort();
    
      return {
        id,
        members: memberIds.map((memberId) => {
          const member = codeNodesById.get(memberId);
          return {
            id: memberId,
            label: member.label ?? null,
            file: member.file ?? null,
            line: member.line ?? null,
          };
        }),
        fanOut: usesOut.length,
        fanIn: usedBy.length,
        usesOut,
        usedBy,
        satisfiedSpecs,
        shapingDecisions: [...decisionSubjects]
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([decisionId, subjects]) => ({
            id: decisionId,
            subjects: [...new Set(subjects)].sort(),
          })),
      };
    });
    
    return { components };
    ````
  - Recipe 18 — Decision map:
    ````
    ## 18. Decision map
    const decisionNodes = graph.nodes
      .filter(
        (node) =>
          node.nodeType === "Primitive" &&
          node.specKind === "decision" &&
          typeof node.id === "string",
      )
      .sort((left, right) => left.id.localeCompare(right.id));
    const decisionIds = new Set(decisionNodes.map((node) => node.id));
    const interDecisionEdges = graph.edges.filter(
      (edge) =>
        (edge.type === "dependsOn" || edge.type === "supersedes") &&
        decisionIds.has(edge.from) &&
        decisionIds.has(edge.to),
    );
    const subjectsByDecision = new Map();
    
    for (const edge of graph.edges.filter(
      (edge) => edge.type === "decidedBy" && decisionIds.has(edge.to),
    )) {
      const subjects = subjectsByDecision.get(edge.to) ?? [];
      subjects.push(edge.from);
      subjectsByDecision.set(edge.to, subjects);
    }
    
    const familyOf = (id) => {
      const unprefixed = id.startsWith("spec:") ? id.slice("spec:".length) : id;
      return unprefixed.split(".")[0] || "unknown";
    };
    const decisions = decisionNodes.map((node) => {
      const outgoing = interDecisionEdges.filter((edge) => edge.from === node.id);
      const incoming = interDecisionEdges.filter((edge) => edge.to === node.id);
      const decidedSubjectsByFamily = {};
    
      for (const subjectId of [...new Set(subjectsByDecision.get(node.id) ?? [])].sort()) {
        const family = familyOf(subjectId);
        decidedSubjectsByFamily[family] = decidedSubjectsByFamily[family] ?? [];
        decidedSubjectsByFamily[family].push(subjectId);
      }
    
      return {
        id: node.id,
        title: node.title ?? null,
        fanIn: incoming.length,
        fanInByType: {
          dependsOn: incoming.filter((edge) => edge.type === "dependsOn").length,
          supersedes: incoming.filter((edge) => edge.type === "supersedes").length,
        },
        dependsOn: outgoing
          .filter((edge) => edge.type === "dependsOn")
          .map((edge) => edge.to)
          .sort(),
        dependedOnBy: incoming
          .filter((edge) => edge.type === "dependsOn")
          .map((edge) => edge.from)
          .sort(),
        supersedes: outgoing
          .filter((edge) => edge.type === "supersedes")
          .map((edge) => edge.to)
          .sort(),
        supersededBy: incoming
          .filter((edge) => edge.type === "supersedes")
          .map((edge) => edge.from)
          .sort(),
        decidedSubjectsByFamily,
      };
    });
    const ranking = decisions
      .map((decision) => ({ id: decision.id, fanIn: decision.fanIn }))
      .sort((left, right) => right.fanIn - left.fanIn || left.id.localeCompare(right.id));
    
    return { total: decisions.length, ranking, decisions };
    ````
  - Recipe 19 — Planning slice:
    ````
    ## 19. Planning slice
    const id = "spec:consumers.agent-surface";
    const context = g.specContext(id);
    
    if (context === undefined) {
      return { id, found: false };
    }
    
    const implementations = context.implementations;
    const verifiers = context.verifiers;
    const parents = [...new Set(
      graph.edges
        .filter((edge) => edge.type === "refines" && edge.from === id)
        .map((edge) => edge.to),
    )].sort();
    const children = [...new Set(
      graph.edges
        .filter((edge) => edge.type === "refines" && edge.to === id)
        .map((edge) => edge.from),
    )].sort();
    const neighborhoodIds = new Set([id, ...parents, ...children]);
    const decisionsById = new Map();
    
    for (const edge of graph.edges.filter(
      (edge) => edge.type === "decidedBy" && neighborhoodIds.has(edge.from),
    )) {
      const subjects = decisionsById.get(edge.to) ?? [];
      subjects.push(edge.from);
      decisionsById.set(edge.to, subjects);
    }
    
    const codeNodesById = new Map(
      graph.nodes
        .filter((node) => node.nodeType === "CodeNode")
        .map((node) => [node.id, node]),
    );
    const componentIds = new Set(
      [...codeNodesById.keys()].filter((nodeId) => nodeId.startsWith("component:")),
    );
    const componentsById = new Map();
    
    for (const binding of implementations) {
      if (componentIds.has(binding.codeId)) {
        const bound = componentsById.get(binding.codeId) ?? {
          direct: false,
          abstractions: new Set(),
        };
        bound.direct = true;
        componentsById.set(binding.codeId, bound);
        continue;
      }
    
      for (const edge of graph.edges.filter(
        (edge) => edge.type === "memberOf" && edge.from === binding.codeId,
      )) {
        const bound = componentsById.get(edge.to) ?? {
          direct: false,
          abstractions: new Set(),
        };
        bound.abstractions.add(binding.codeId);
        componentsById.set(edge.to, bound);
      }
    }
    
    const components = [...componentsById]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([componentId, bound]) => {
        const component = codeNodesById.get(componentId);
        return {
          id: componentId,
          label: component.label ?? null,
          file: component.file ?? null,
          line: component.line ?? null,
          directlySatisfies: bound.direct,
          abstractions: [...bound.abstractions].sort(),
        };
      });
    const entryPoints = [];
    const addEntryPoint = (role, subjectId, file, line) => {
      if (typeof file !== "string") return;
      entryPoints.push({ role, id: subjectId, file, line: line ?? null });
    };
    
    addEntryPoint("spec", id, context.file);
    for (const binding of implementations) {
      addEntryPoint("implementation", binding.codeId, binding.file, binding.line);
    }
    for (const binding of verifiers) {
      addEntryPoint("verifier", binding.verifierId, binding.file, binding.line);
    }
    for (const component of components) {
      addEntryPoint("component", component.id, component.file, component.line);
    }
    
    const uniqueEntryPoints = [...new Map(
      entryPoints.map((entry) => [`${entry.role}:${entry.id}:${entry.file}:${entry.line}`, entry]),
    ).values()].sort(
      (left, right) =>
        left.file.localeCompare(right.file) ||
        left.role.localeCompare(right.role) ||
        String(left.id).localeCompare(String(right.id)),
    );
    
    return {
      id,
      found: true,
      refinementNeighborhood: { parents, children },
      constrainingDecisions: [...decisionsById]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([decisionId, subjects]) => ({
          id: decisionId,
          subjects: [...new Set(subjects)].sort(),
        })),
      abstractions: implementations
        .filter((binding) => !componentIds.has(binding.codeId))
        .map((binding) => ({
          id: binding.codeId,
          claim: binding.claim,
          file: binding.file ?? null,
          line: binding.line ?? null,
        })),
      components,
      verifiers: verifiers.map((binding) => ({
        id: binding.verifierId,
        via: binding.via,
        claim: binding.claim,
        enabled: binding.enabled,
        file: binding.file ?? null,
        line: binding.line ?? null,
      })),
      blastRadiusEntryPoints: uniqueEntryPoints,
      blastRadiusLimit: "file-level graph-recorded paths only; no symbol-level impact graph",
    };
    ````
  Acceptance criteria: `npx vitest run test/recipes.test.ts` generic body rules pass (return present, no quotes, no import/export); headings are contiguous 1-19.
  QA happy: all 19 recipes execute via `runSdpCli` with exit 0 and non-null JSON. QA failure: body syntax error or quote violation — fix body.
  Commit: Y | feat(agent-surface): add architecture-slice recipes 17–19
  Recommended task executor category: quick

- [x] 11. Extend recipes.test.ts for 17–19 ground truth
  What to do: Extend `test/recipes.test.ts`: sessions ordinal loop `[12,13,14,15,16]` → `[12,13,14,15,16,17,18,19]` (line 365-367); phrase pins (line 355-363) add "architecture map", "decision map", "planning slice"; add three `it` blocks mirroring 12-16 pattern. Must NOT hardcode "sixteen" or "nineteen" (count is dynamic from heading count).
  Parallelization: Wave 6 | Blocked by: 3, 4, 5, 6, 7, 8, 9, 10, 15 | Blocks: 14
  References: `test/recipes.test.ts:355-367`; existing per-recipe ground-truth blocks for 12-16.
  - Ground-truth assertions (recompute expected values from the live `graph` inside the test, mirroring the existing 12-16 blocks; do not hardcode post-change counts):
    - recipe 17: `result.components` contains `component:protocol.import` and `component:protocol.testing`; every component's `fanIn`/`fanOut` recompute from `graph.edges`; total component count equals the live graph's component count.
    - recipe 18: `result.total` equals the live graph's decision count; ranking is descending by fanIn; the top-ranked decision has the measured fanIn (no hardcoded `=== 4`).
    - recipe 19: default id returns `found: true` with expected neighborhood; unknown-id substitution returns `{found: false}` (follow existing parameterized-recipe test pattern).
  Acceptance criteria: `npx vitest run test/recipes.test.ts` passes.
  QA happy: green suite. QA failure: assertion mismatch because graph state changed — recompute the expected value from the live graph inside the assertion, mirroring the existing recipe 12-16 ground-truth pattern.
  Commit: Y | test(recipes): ground-truth assertions for architecture recipes 17–19
  Recommended task executor category: unspecified-high

- [x] 12. Highlight architecture recipes in sdp-agent-surface and sdp-sessions skills
  What to do: Update `.agents/skills/sdp-agent-surface/SKILL.md:88-93`: `sixteen`→`nineteen`, `Recipes 1-16`→`Recipes 1-19`, append "architecture map, decision map, and the planning slice" to the catalog list; add a short architecture-questions pointer paragraph containing the exact phrases "architecture map", "decision map", "planning slice". Update `.agents/skills/sdp-sessions/SKILL.md`: Design shape points at "planning slice (recipe 19)"; Implement shape points at recipe 19 (understand before implementing); Review shape points at "architecture map (recipe 17)" and "decision map (recipe 18)". Ensure literal strings "recipe 17", "recipe 18", "recipe 19" appear.
  Parallelization: Wave 4 | Blocked by: 10 | Blocks: 14
  References: `.agents/skills/sdp-agent-surface/SKILL.md:88-93`; `.agents/skills/sdp-sessions/SKILL.md:47-71`; `test/skills.test.ts:194-220`
  Acceptance criteria: `npx vitest run test/skills.test.ts` passes (count-word sync is dynamic, so no structural edits needed; verify green).
  QA happy: skills test suite green. QA failure: missing string literal — add.
  Commit: Y | docs(skills): highlight architecture recipes 17–19
  Recommended task executor category: writing

- [x] 13. Update recipe counts and key-decision list in AGENTS.md and README.md
  What to do: `AGENTS.md:79`: "sixteen runnable `sdp q` bodies" → "nineteen". `AGENTS.md:125-126`: "The sixteen runnable recipe bodies" → "nineteen". Add lean named key-decision list near the DECISIONS.md pointer (names first, per the plain-language references decision): the executable meta-model (MD-1), one primitive named coordinates (MD-4), the carrier ruling (MD-18), the agent front door (MD-22), structural anchors confer nothing (MD-30), the shipped projections stay frozen (MD-32), planning truths live in ruled graph homes (MD-33), and architectural significance rides existing primitives (MD-34). `README.md:31`: "sixteen graph-first recipes" → "nineteen". `README.md:147`: "the sixteen recipe bodies" → "nineteen". Must NOT add more than the named list; do not restructure the Where-to-look table.
  Parallelization: Wave 4 | Blocked by: 10 | Blocks: 14
  References: `AGENTS.md:79,125`; `README.md:31,147`; `docs/concept/DECISIONS.md` registry table.
  Acceptance criteria: `grep -n "nineteen" AGENTS.md README.md` shows the updated lines; `test/skills.test.ts` green.
  QA happy: no stale "sixteen" remains in AGENTS.md or README.md. QA failure: grep still finds "sixteen" — fix missed line.
  Commit: Y | docs: update recipe counts and key-decision highlights
  Recommended task executor category: quick

- [ ] 14. Run npm run check, re-measure graph, and close
  What to do: Run `npm run check` on the branch. Re-measure counts with `pnpm --silent sdp:q` and label them re-derived. Record close-out evidence at `.omo/evidence/task-14-architectural-patterns-views.md`. Commit any final coherence. No new plans/ file. Must NOT ignore intentional warnings (5 `honesty/gaps` + 1 `verifies-linkage` are expected).
  Parallelization: Wave 7 | Blocked by: all | Blocks: —
  References: `package.json` check script; AGENTS.md gate description.
  Acceptance criteria: `npm run check` exits 0.
  QA happy: gate green with expected warnings. QA failure: unexpected validation error — trace to the offending todo and fix (do not suppress).
  Commit: Y | chore: re-measured counts and gate close
  Recommended task executor category: quick

- [x] 15. Sync shared self-hosting oracles and frozen corpus totals
  What to do: After all corpus edits in todos 3-9 have landed, update the shared oracle rosters and frozen totals in ONE pass: `test/self-hosting-oracle/declared-relations.ts` (add all new relations from todos 2, 3, 8, 9), `test/self-hosting-oracle/structural-edges.ts` (add new component ids, remove `impl:protocol.sdp-import` exception, add memberOf/uses rows from todos 4-7), `test/self-hosting-oracle/anchors.ts` (add all new anchor entries and bump the count pin at `test/self-hosting-graph.test.ts:145`), and `test/self-hosting-graph.test.ts:140-147` (frozen totals: specs, anchors, nodes, edges). State the final literal values in the evidence file, not scattered across todos. Must NOT edit per-Spec descriptor oracles here (those were handled in their respective todos).
  Parallelization: Wave 5 | Blocked by: 3, 4, 5, 6, 7, 8, 9 | Blocks: 11
  References: `test/self-hosting-oracle/declared-relations.ts`, `test/self-hosting-oracle/structural-edges.ts`, `test/self-hosting-oracle/anchors.ts`, `test/self-hosting-graph.test.ts:140-147`
  Acceptance criteria: `npx vitest run test/self-hosting-graph.test.ts` passes with the updated rosters and totals.
  QA happy: all self-hosting oracle assertions green. QA failure: a roster mismatch — read the test failure, update the corresponding oracle file, re-run.
  Commit: Y | chore: sync self-hosting oracles and frozen totals
  Recommended task executor category: unspecified-high


## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit
  Verify every todo's acceptance evidence file exists and matches the acceptance criteria. Confirm the dependency matrix was respected (no todo started before its blockers). Confirm no file outside Scope IN was edited except for oracle lockstep. Audit the commit history on the branch for coherent messages.
  Recommended task executor category: unspecified-high
- [ ] F2. Code quality review
  Review Spec prose for ratified terminology (no invented terms), ADR-test coverage in the new decision Spec, and anchor locality (≤24 lines per anchor). Confirm no single quotes in recipe bodies. Confirm no stale "sixteen" in AGENTS.md/README.md/skills.
  Recommended task executor category: unspecified-high
- [ ] F3. Real manual QA
  Run recipes 17, 18, 19 via `pnpm --silent sdp:q` and eyeball output for sanity (non-empty, no throws). Run `sdp validate` on the branch. Spot-check `generated/census/` and Design Review binding tables for new components/decisions.
  Recommended task executor category: unspecified-high
- [ ] F4. Scope fidelity
  Diff against Scope IN/OUT: confirm no engine `src/` behavior changes (only `codeAnchor` declarations), no new relation types, no reader methods, no ready promotion, no new plans file. Confirm `supersedes` remains 0.
  Recommended task executor category: unspecified-high

## Commit strategy
Commits at coherent boundaries on `feature/architectural-patterns-views`:
- After todo 2: `feat(specs): rule architectural significance rides existing primitives (MD-34)`
- After todo 3: `docs(specs): resolve structural-patterns blocking questions` (or fold into the above if batched)
- After todos 4-9 and todo 15: `feat(structure): widen structural self-binding and decision relations, sync oracles`
- After todo 9: `docs(specs): enrich structural-self-binding after coverage lands`
- After todos 10-13: `feat(agent-surface): architecture-slice recipes 17-19 + on-ramp highlights`
- After todo 14: `chore: re-measured counts and gate close`
Per-todo commit lines are listed in each todo; the worker may batch adjacent todos into a single commit when they share a coherent scope, but never mix unrelated domains in one commit.

## Success criteria
- `npm run check` exits 0 on the branch (5 intentional `honesty/gaps` + 1 `verifies-linkage` warnings are expected and do not fail the gate).
- Re-derived graph counts (labeled re-derived in close-out evidence): 13 components, 34 decision Specs, up to 15 inter-decision `dependsOn` (1 pre-existing + up to 14 new), 0 `supersedes`, 41 `decidedBy` edges, 19 recipe headings executing green.
- Both `spec:model.structural-patterns` and `spec:protocol.structural-self-binding` enriched to `defined` with blocking questions resolved.
- No `src/` behavior changes: git diff under `src/` shows only `codeAnchor` declarations (no logic changes).
- No new `plans/` file authored; plan 38 remains the arc pointer.
