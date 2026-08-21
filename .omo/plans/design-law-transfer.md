# design-law-transfer - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** A ratified ruling (MD-35) that source comments never enter the graph — they promote into Specs instead; the engine's delivery-facts law moved out of a code comment and into its own reviewable, test-bound Spec as the worked example; the "every significant unit is bound" promise gains a real test that fails loudly when coverage slips; the glossary and decision links the PR reviewers found missing are filled in; and the remaining promotion candidates become a graph-visible backlog instead of chat history.

**Why this approach:** Two independent design reviews and a gap analysis all converged: promote-and-retarget exactly once (the one comment that is the unique carrier of a multi-surface law), keep everything else as recorded backlog, and keep the significant-unit set as owner-reviewed test state rather than a new validator — the shape the ratified base already forces.

**What it will NOT do:** No parsing of comments into the graph (that is the recorded refusal, not a feature); no sweep minting a Spec per file; no re-pointing of other anchors; no new relation types, validators, or projections; no readiness promotion of any existing Spec — `ready` stays your statement (the two *new* Specs are born `ready` under the mechanisms in Decisions (2) below).

**Effort:** Medium
**Risk:** Low-Medium — corpus authoring and test/oracle lockstep only, but the self-hosting oracle demands exact transcription and every corpus edit has a pinned twin.
**Decisions to sanity-check:** (1) The five frozen `decidedBy` candidate pairs in todo 5 — semantic attributions no validator can police, so strike any pair you disagree with before execution; each carries a verify-first bar and drops are recorded. (2) Readiness mechanics: the decision Spec is born `ready` under the registry-ratification precedent (MD-34 was born the same way, per the decision-readiness posture); the tracer behavior Spec is born `ready` because your approval of this plan — which carries the full Spec text verbatim, including `readiness: ready` — IS the human ready statement (a `defined` tracer would trip the implemented-and-not-ready drift alarm the moment its anchor re-targets); the self-binding Spec stays `defined` — its promotion remains your review act. (3) The branch is pushed and the PR #25 description updated in the final todo, per your "extend the current branch and PR" instruction.

Your next move: high-accuracy momus review runs now (required, default-on). Full execution detail follows below.

---

> TL;DR (machine): Medium effort, Low-Medium risk, 9 implementation todos + 4 final verifiers. Delivers the MD-35 refusal ruling + the delivery-facts tracer Spec + the self-binding census verifier + glossary registration + decidedBy fills + graph-visible promotion backlog. Only `src/` diff: one re-targeted anchor line and a demoted JSDoc.

## Scope
### Must have
1. The refusal ruling: new decision Spec `spec:decisions.jsdoc-graph-extraction-refused` (full text in todo 1), MD-35 registry row in `docs/concept/DECISIONS.md`, pack manifest + per-Spec oracle lockstep.
2. The comment-promotion filter lands as one advisory term on `spec:model.spec-sections` (the MD-10 promotion law applied to law-carrying source commentary) — no dedicated grain-rule Spec (MD-33 meta-taxonomy refusal).
3. The delivery-facts tracer, atomic: new `spec:extraction.delivery-facts` (behavior, story, ready; full text in todo 3) carrying the ten conferral rules now living only in `src/graph/delivery-facts.ts` JSDoc; the anchor `impl:protocol.delivery-facts` re-targets its `satisfies` to the new Spec; the JSDoc demotes to pointer-only (MD-10 exclusive promotion); a direct `specTest` binding (`test:protocol.delivery-facts`) keeps the Spec off the honesty/gaps warning list; stale test-commentary pointers retarget.
4. The self-binding verifier: `test/self-hosting-oracle/structural-edges.ts` gains the `acceptedArchitecturalUnits` roster (unit → anchorId → componentId, membership edges derived from it) and the `coarseGrainCoverage` roster for the three unbindable marginal files; `test/self-hosting-graph.test.ts` gains the census assertion with a sorted aggregate failure contract; a `specTest` (`test:protocol.structural-self-binding`) binds the suite to the Spec; `spec:protocol.structural-self-binding` gains the realization-grain amendment and the census-check rule, staying `defined` (ready remains the user's statement).
5. Owner act (a): register "architecturally significant unit" in `CONTEXT.md`.
6. Owner act (b): the `decidedBy` fill tranche (five frozen candidates in todo 5, verify-first with drop-recording) so genuine shaping rulings surface in the architecture map's join where the attribution is honest.
7. The promotion worklist becomes graph-visible backlog: one `[non-blocking]` open question on each of the six coarse family-parent carrier Specs (todo 7).
8. Shared-oracle sync in ONE pass after all graph-changing todos land (declared relations, pack members, frozen totals, readiness distribution), then the full gate `npm run check` exit 0, counts re-measured and labeled re-derived, PR #25 description forward-section update, branch pushed (user authorized extending the PR).
### Must NOT have (guardrails, anti-slop, scope boundaries)
- NO JSDoc/doc-comment extraction into the graph — that is the recorded refusal (todo 1), never an implementation.
- NO JSDoc-compiler sweep: no per-file Spec minting beyond the delivery-facts tracer; no Spec whose payload is the grain rule itself.
- NO bulk `satisfies` re-targeting: only `impl:protocol.delivery-facts` moves; the other four `derive-graph` bindings keep the seam target.
- NO new relation types, anchor fields, reader methods, projections, or validator families; the MD-32 projection freeze stays intact.
- NO significance classifier derived from exports/imports (MD-30/MD-34: structural edges are authored declarations; the accepted set is owner-reviewed oracle state).
- NO manufactured anchors on units with no honest `satisfies` target (`src/cli/validate-watch.ts`, `src/import/markdown-fidelity.ts`, `src/import/data-access.ts` get coarse-grain coverage roster rows only).
- NO `specOracle` for the self-binding verifier (`models` confers nothing; the Spec carries no example space).
- NO readiness promotion of `spec:protocol.structural-self-binding` or `spec:model.structural-patterns` to `ready` — readiness is a human statement, left to the user's review (recipe 9).
- NO new `plans/` file — plan 38 stays the arc pointer.
- NO engine `src/` behavior changes: the only `src/` diff is the re-targeted `satisfies` line and the demoted JSDoc in `src/graph/delivery-facts.ts`.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after in the same commit — repo discipline is self-hosting oracle lockstep with every corpus edit; the tracer's conferral behavior is already exercised by existing ladder/fail-closed tests (`test/extract.test.ts:816-849`, `test/reader.test.ts:679-706,736-765`), so todo 3 adds a binding, not duplicate behavior tests. Framework: vitest via `npx vitest run <file>` per suite; full gate `npm run check`.
- Per-todo acceptance runs `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` (exit 0) plus the named vitest suites; the shared-oracle suite goes green at todo 8 and the full gate at todo 9.
- Evidence: `.omo/evidence/task-<N>-design-law-transfer.md` per todo (this session is not inside ulw-loop, so `.omo/evidence/` is the root).

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.

- Wave 1 (6 parallel): todos 1, 2, 3, 4, 5, 6. Each edits only its own Spec/oracle/test files; shared rosters (`declared-relations.ts`, `pack-members.ts`, `anchors.ts`, frozen totals, readiness distribution) are intentionally NOT updated here to avoid parallel file collisions — todos 3 and 4 both need `anchors.ts` entries, so every `anchors.ts` edit lands in todo 8's single sync pass.
- Wave 2 (2 parallel): todo 7 (needs todo 3's `extraction.ts` descriptor landed to avoid a collision) and todo 8 (the sync pass — needs every graph-changing todo landed).
- Wave 3: todo 9 (gate + re-measure + PR/branch close).

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | — | 8 | 2, 3, 4, 5, 6 |
| 2 | — | — | 1, 3, 4, 5, 6 |
| 3 | — | 7, 8 | 1, 2, 4, 5, 6 |
| 4 | — | 8 | 1, 2, 3, 5, 6 |
| 5 | — | 8 | 1, 2, 3, 4, 6 |
| 6 | — | — | 1, 2, 3, 4, 5 |
| 7 | 3 | — | 8 |
| 8 | 1, 3, 4, 5 | 9 | 7 |
| 9 | all | — | — |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [x] 1. Author the refusal ruling — decision Spec + MD-35 + pack manifest + per-Spec oracle lockstep
  What to do: Write `specs/decisions/jsdoc-graph-extraction-refused.sdp.md` (full text below). Append the MD-35 row to `docs/concept/DECISIONS.md` (after the MD-34 row, line 45). Append `spec:decisions.jsdoc-graph-extraction-refused` to the decisions block of `specs/self-hosting.pack.sdp.md` (after `spec:decisions.architectural-significance-rides-primitives`). Add the full descriptor to `test/self-hosting-oracle/decisions.ts` (transcribe the sections exactly, mirroring the existing entries' shape). Shared rosters (`declared-relations.ts`, `pack-members.ts`, frozen totals) are updated in todo 8, not here. Must NOT change other decision Specs; no `supersedes` edges.
  Parallelization: Wave 1 | Blocked by: — | Blocks: 8
  References:
  - Exemplar decision Spec + descriptor: `specs/decisions/structural-anchor-semantics.sdp.md`, `test/self-hosting-oracle/decisions.ts`
  - MD registry rows: `docs/concept/DECISIONS.md:41-45`
  - Pack manifest decisions block: `specs/self-hosting.pack.sdp.md:132-136`
  - Refusal evidence: `docs/lineage/v0-design/04-authoring-surfaces.md:295-320` (§2.4 "markers are read-only pointers from code to spec, never the reverse"), `specs/model/anchors.sdp.md` (decorator and JSDoc forms remain unextracted representations), `spec:decisions.one-validation-path` (MD-14), `spec:decisions.structural-anchor-semantics` (MD-30)
  - Decision Spec text to copy:
    ```yaml
    ---
    id: spec:decisions.jsdoc-graph-extraction-refused
    kind: decision
    altitude: feature
    readiness: ready
    relations:
      refines: spec:model.anchors
      dependsOn:
        - spec:decisions.one-validation-path
        - spec:decisions.structural-anchor-semantics
    ---
    # Source commentary never enters the graph
    ## Intent
    - outcome: Rule that JSDoc, doc comments, and other source commentary never author graph nodes, relations, membership, or Spec intent, so the statically reified anchor constant remains the only write path from code into the graph.
    ## Decision
    - context: The v0 lineage supported three marker styles — decorators, JSDoc tags, and marker constants — all extracted (docs/lineage/v0-design/04-authoring-surfaces.md §2, 06-extraction-and-validation.md). The landed corpus keeps only the statically reified anchor constant; decorator and JSDoc forms remain unextracted representations (`spec:model.anchors`). Law-grade prose now sits in some engine file headers (for example `src/graph/delivery-facts.ts`), which raises whether the extractor should parse that prose into the graph. The ratified base rules which binding syntaxes extract (`spec:model.anchors`, MD-30); whether comment prose may author graph content is unruled until this decision, and the PR #25 review session genuinely deliberated that fork — this rules an open question, it does not repair drift.
    - decision: Ordinary JSDoc and local commentary never author graph content — no nodes, no relations, no component membership, no delivery facts, no Spec intent. The only write path from source into the graph is the statically reified anchor constant under `spec:model.anchors`, and it is identity only. When a comment states rules other surfaces depend on, those rules promote into a Spec under the promotion law (`spec:model.spec-sections`) and the comment demotes to local commentary plus a Spec pointer.
    - rationale: Hard to reverse — a comment-parsing write path would become a contract for source, extractor, and validators. Surprising without context — the lineage tool extracted identity tags from JSDoc, so the obvious parity move looks like extracting prose too; this refusal is about prose, not identity. Real trade-off — comment-prose extraction would make implementation files authoritative for intent (lineage 04 §2.4: markers are read-only pointers from code to spec, never the reverse) and would create a second, silently divergent read model beside the one extraction path (MD-14); giving that up keeps one graph language.
    - consequence: The extractor never reads comment content; a comment's presence, absence, or wording produces no graph finding.
    - consequence: A comment may explain the implementation and point at a Spec id; it confers nothing, and restating promoted law in the comment violates exclusive promotion (MD-10).
    - alternative: Extracting identity tags from JSDoc (the v0 JSDoc marker style) stays refused with the decorator form — both are unextracted representations, and the anchor constant is the single binding syntax.
    - alternative: Parsing law-grade prose comments into Spec sections was refused — it inverts the separation of intent from binding and recreates a shadow intent carrier beside the Specs.
    ```
  - MD-35 row to append:
    `| MD-35 | source commentary never enters the graph | durable | JSDoc and doc comments author no graph content; the statically reified anchor constant is the only write path from code, and law-carrying comments promote into Specs. | [Spec](../../specs/decisions/jsdoc-graph-extraction-refused.sdp.md) (`spec:decisions.jsdoc-graph-extraction-refused`) |`
  Acceptance criteria: `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` exits 0; `pnpm --silent sdp:q 'return g.specContext("spec:decisions.jsdoc-graph-extraction-refused").statedReadiness'` returns `ready` with 3 relations.
  QA happy: new Spec extracted; `npx vitest run test/self-hosting-graph.test.ts` shows ONLY the expected shared-roster mismatches that todo 8 resolves (declared relations, pack members, anchors roster, frozen totals). QA failure: extraction error or descriptor mismatch — fix frontmatter or transcription, never suppress. Evidence `.omo/evidence/task-1-design-law-transfer.md`.
  Commit: Y | feat(specs): refuse source-commentary extraction into the graph (MD-35)
  Recommended task executor category: unspecified-high

- [x] 2. Land the comment-promotion filter on spec:model.spec-sections
  What to do: Edit `specs/model/spec-sections.sdp.md`: append one term to the `## Model` section, after the **promotion** term:
    `- **comment promotion** — Source commentary that states rules other surfaces depend on is a promotion trigger: those rules promote into a standalone Spec under the promotion law, and the comment demotes to local commentary plus a Spec pointer; restating the promoted rules in the comment violates exclusive promotion.`
  Update the per-Spec oracle descriptor in `test/self-hosting-oracle/model.ts` (the `spec:model.spec-sections` entry's model terms — transcribe exactly). Must NOT add a dedicated grain-rule Spec (MD-33); do not touch the readiness line.
  Parallelization: Wave 1 | Blocked by: — | Blocks: —
  References: `specs/model/spec-sections.sdp.md` (Model section), `test/self-hosting-oracle/model.ts` (spec-sections descriptor), MD-10 (`spec:decisions.content-only-sections`), `docs/lineage/v0-design/04-authoring-surfaces.md` §2.4
  Acceptance criteria: `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` exits 0; `npx vitest run test/self-hosting-graph.test.ts -t 'model family'` passes with the updated descriptor.
  QA happy: descriptor matches extraction. QA failure: descriptor mismatch — fix transcription. Evidence `.omo/evidence/task-2-design-law-transfer.md`.
  Commit: Y | docs(specs): land the comment-promotion filter on spec-sections
  Recommended task executor category: quick

- [x] 3. Run the delivery-facts tracer — new Spec + anchor re-target + JSDoc demotion + specTest + oracle lockstep
  What to do (atomic, one commit):
  (a) Write `specs/extraction/delivery-facts.sdp.md` (full text below). Append its id to the extraction block of `specs/self-hosting.pack.sdp.md`.
  (b) Re-target the anchor in `src/graph/delivery-facts.ts:74-79`: `satisfies: ref("spec:extraction.derive-graph")` → `ref("spec:extraction.delivery-facts")`. Nothing else in `src/` changes behaviorally.
  (c) Demote the file JSDoc in `src/graph/delivery-facts.ts` to pointer-only. KEEP: a one-line pointer to `spec:extraction.delivery-facts`; per-function descriptions of what each exported predicate returns; which internal consumers call each predicate (why it is exported); the first-carrier implementation commentary; a short "implements the Spec's ladder order" note near fact emission. DROP: the full definitions of `implemented`/`has-verifier`/enabled-example/directness/`observed`; the MD-7 rationale and normative fail-closed law; "one derivation path" restated as law; long contract-row explanations now owned by the Spec.
  (d) Add the direct test binding at top level in `test/extract.test.ts` beside the existing delivery-facts ladder tests (lines 816-849): `const deliveryFactsTestAnchor = specTest({ id: testAnchorId("test:protocol.delivery-facts"), label: "verifies the delivery-fact conferral ladder and fail-closed posture", verifies: ref("spec:extraction.delivery-facts") }); void deliveryFactsTestAnchor;` (imports already exist in that file — mirror `test/census.test.ts:148-153` if not).
  (e) Retarget stale commentary pointers that cite `spec:extraction.derive-graph` as the delivery-fact eligibility source: `test/extract.test.ts:816`, `test/reader.test.ts:680-681,737-739`, `test/design-review.test.ts:428-431` → cite `spec:extraction.delivery-facts`.
  (f) Oracle lockstep in this todo: new descriptor in `test/self-hosting-oracle/extraction.ts` (transcribe the Spec exactly; `deliveryFacts: ["implemented","has-verifier"]`). Shared rosters (`declared-relations.ts`, `pack-members.ts`, the `anchors.ts` retarget of `impl:protocol.delivery-facts` plus the new `test:protocol.delivery-facts` entry, frozen totals) are updated in todo 8, not here — todo 4 also needs an `anchors.ts` entry, so every `anchors.ts` edit lands in the single sync pass.
  Must NOT re-target any other `satisfies` edge; must NOT add examples to the new Spec (rules are its kind evidence); must NOT restate the rules in the demoted JSDoc (MD-10).
  Parallelization: Wave 1 | Blocked by: — | Blocks: 7, 8
  References: `src/graph/delivery-facts.ts:1-80` (the law source), `specs/extraction/derive-graph.sdp.md` (parent), `spec:decisions.binding-not-liveness` (MD-7), `test/self-hosting-oracle/extraction.ts` (descriptor shape), `specs/validation/readiness-floor.sdp.md` (ready floor: relations resolve + targets >= defined + anchors resolve)
  - Spec text to copy:
    ```yaml
    ---
    id: spec:extraction.delivery-facts
    kind: behavior
    altitude: story
    readiness: ready
    relations:
      refines: spec:extraction.derive-graph
      decidedBy: spec:decisions.binding-not-liveness
    ---
    # Resolving bindings confer direct delivery facts
    ## Intent
    - outcome: State the one delivery-fact conferral law shared by the extractor, the delivery-facts honesty check, and the reader's enabled decode, so the three surfaces can never disagree.
    ## Behavior
    - rule: Delivery facts are derived from resolving graph edges and are never authored.
    - rule: `implemented` is conferred only by an anchored `satisfies` edge that resolves to the Spec — its source is a CodeNode present in the graph; a dangling or off-contract binding confers nothing.
    - rule: `has-verifier` is conferred by an anchored `verifies` edge that resolves to the Spec from an Anchor node present in the graph, or by a declared `verifies` edge from an enabled example that resolves to it.
    - rule: An enabled example is an example-kind Spec that is itself the target of a resolving anchored `verifies` edge; a declared verifier that is not enabled confers nothing — binding, never liveness.
    - rule: Both facts are direct and per-target; neither propagates through `refines`.
    - rule: `observed` is never computed; it remains the aspirational liveness rung.
    - rule: An edge the claim-separation check would reject confers no fact, so any graph producer other than the extractor is fail-closed.
    - rule: A duplicate-id verifier keys the same first carrier exactly as the graph index keys it, and the duplicate-ids check reports the ambiguity loudly.
    - rule: The extractor, the delivery-facts honesty check, and the reader's enabled decode share the one conferral computation and its two eligibility predicates, so the three surfaces can never disagree.
    - rule: Facts are emitted in ladder order — `implemented`, then `has-verifier`.
    ```
  Acceptance criteria: validate exits 0; `pnpm --silent sdp:q 'const c = g.specContext("spec:extraction.delivery-facts"); return { readiness: c.statedReadiness, facts: c.deliveryFacts, implementations: c.implementations.length, verifiers: c.verifiers.length }'` returns readiness `ready`, facts `["implemented","has-verifier"]`, 1 implementation, 1 verifier; `pnpm --silent sdp:q 'return g.specContext("spec:extraction.derive-graph").deliveryFacts'` still returns both facts (parent keeps 4 other implementations + its test anchor).
  QA happy: `npx vitest run test/extract.test.ts test/reader.test.ts test/design-review.test.ts` green; `npx vitest run test/self-hosting-graph.test.ts` shows ONLY the shared-roster mismatches todo 8 resolves (declared relations, pack members, anchors roster, frozen totals). QA failure: floor failure or dangling anchor — fix the Spec or the anchor, never suppress. Evidence `.omo/evidence/task-3-design-law-transfer.md`.
  Commit: Y | feat(specs): promote delivery-fact conferral law to spec:extraction.delivery-facts
  Recommended task executor category: unspecified-high

- [x] 4. Give the self-binding universal its verifier — oracle census rosters + suite assertion + specTest + Spec amendment
  What to do:
  (a) Restructure `test/self-hosting-oracle/structural-edges.ts`: introduce `acceptedArchitecturalUnits` — rows `{ unit: "<path>#<exportedSymbol>", anchorId, componentId }` covering every row of today's `expectedMemberOfEdges` (same values, one roster); export `expectedMemberOfEdges` derived from it (`map` to `[anchorId, componentId]`) so membership stays a single oracle statement, never re-transcribed. Add `coarseGrainCoverage` — rows `{ unit, coveredBy, componentId, rationale }`, with `unit` ALWAYS in `<path>#<exportedSymbol>` form — for exactly these units: `src/cli/validate-watch.ts#runValidateWatch` → coveredBy `impl:protocol.agent-surface-cli` / `component:protocol.cli` (dispatched at `src/cli/sdp.ts:198-201`); `src/import/markdown-fidelity.ts#assertMarkdownEmissionFidelity` → coveredBy `impl:protocol.sdp-import-markdown-emit` / `component:protocol.import` (consumed at `src/import/emit-markdown.ts:4-7,197-205`); and for `src/import/data-access.ts`, ONE row per exported symbol the covering realization actually consumes — read the import statement at `src/import/emit-markdown.ts:4-5` and roster exactly that imported set (expected members include `importData`, `importText`, `importTexts`, `targetsForRelationType` — verify, never assume), each coveredBy `impl:protocol.sdp-import-markdown-emit` / `component:protocol.import`. Keep `structuralMembershipExceptions` and `expectedUsesEdges` unchanged.
  (b) Extend `test/self-hosting-graph.test.ts`: a new `it` block ("covers every accepted architecturally significant unit") asserting per roster row: (1) `anchorId` resolves to a CodeNode; (2) its graph `file` matches the rostered path; (3) exactly one `memberOf` edge exists from it; (4) its target equals `componentId`; (5) the target is one of `expectedComponentIds`; plus (6) no graph `memberOf` source exists outside the roster and `structuralMembershipExceptions`; and per coarse-grain row: the covering anchor resolves and is a member of the named component. Mismatches aggregate into sorted mismatch objects (by unit, then anchorId, then target) and fail once with a human message of the form `structural self-binding coverage failed:` followed by one line per mismatch — the assertion is over the structured objects; the text is only the vitest message.
  (c) Add the binding at top level in `test/self-hosting-graph.test.ts`: `const structuralSelfBindingTestAnchor = specTest({ id: testAnchorId("test:protocol.structural-self-binding"), label: "verifies the accepted significant-unit set carries its declared membership", verifies: ref("spec:protocol.structural-self-binding") }); void structuralSelfBindingTestAnchor;` (mirror the file's existing imports/anchor style). The `anchors.ts` roster entry for this anchor lands in todo 8's single sync pass (todo 3 touches the same file).
  (d) Amend `specs/protocol/structural-self-binding.sdp.md`: replace rule 2 with the realization-grain wording below and append the census-check rule below. Readiness STAYS `defined` — `ready` is the user's statement (recipe 9). Update the descriptor in `test/self-hosting-oracle/protocol.ts` (rules text + `deliveryFacts: ["has-verifier"]`).
    - replacement rule 2: `Every architecturally significant unit is covered at Spec-realization grain: it carries component membership through the anchor of the Spec it honestly realizes, or — for an implementation helper with no honest satisfies target of its own — through the nearest honest realization anchor that consumes it; it also carries uses declarations for each component it architecturally depends on, so structural recipes answer dependency questions about the engine itself.`
    - appended rule: `The accepted set of architecturally significant units is an owner-reviewed declaration recorded in the self-hosting oracle, never derived from imports or exports; the suite census-checks that every accepted unit carries its declared membership and that no unrostered membership edge exists.`
  Must NOT mint a Protocol validator family; must NOT derive significance from exports/imports; must NOT use `specOracle`; must NOT manufacture anchors for the three marginal files.
  Parallelization: Wave 1 | Blocked by: — | Blocks: 8
  References: `test/self-hosting-oracle/structural-edges.ts` (current rosters), `test/self-hosting-graph.test.ts:230-275` (membership/uses assertions), `specs/protocol/structural-self-binding.sdp.md`, `src/model/anchors.ts:21-26` (satisfies is mandatory), `docs/lineage/v0-design/04-authoring-surfaces.md` §2.5 (marker-required lint — the designed shape), MD-30 consequence (anchor-required lint stays warn-level, never a gate)
  Acceptance criteria: `npx vitest run test/self-hosting-graph.test.ts` passes EXCEPT the roster/totals assertions todo 8 owns (declared relations, pack members, anchors roster, frozen totals); the new census assertion passes; validate exits 0; `pnpm --silent sdp:q 'return g.specContext("spec:protocol.structural-self-binding").deliveryFacts'` returns `["has-verifier"]`.
  QA happy: remove one roster row locally → the new assertion fails with the sorted message naming the unit; restore. QA failure: a roster row's anchor does not resolve — fix the roster, never the assertion. Evidence `.omo/evidence/task-4-design-law-transfer.md`.
  Commit: Y | test(structure): census-check the accepted significant-unit set
  Recommended task executor category: unspecified-high

- [ ] 5. Author the decidedBy fill tranche
  What to do: Add the candidate `decidedBy` edges, verify-first: read BOTH the subject Spec's text and the decision Spec's text; the edge lands only when the subject's law genuinely descends from the ruling; otherwise drop the candidate and record the reason in the evidence file. `decidedBy` attributes the Spec's LAW — a ruling that shaped only the binding act around a Spec is not an edge. Candidates:
    1. `spec:extraction.example-runner` → `spec:decisions.binding-not-liveness` (the runner's binding-never-liveness law descends from MD-7)
    2. `spec:extraction.derive-graph` → `spec:decisions.one-validation-path` (the one-derivation-seam rule realizes the one-validation-path ruling)
    3. `spec:validation.authored-honesty` → `spec:decisions.binding-not-liveness` (the honesty recompute exists because bindings confer facts and liveness is never claimed)
    4. `spec:consumers.reader` → `spec:decisions.agent-surface-scripts-graph` (the reader is the typed loader of the scripts-the-graph surface). CARRIER MECHANICS: this Spec is a `.sdp.gherkin` carrier — relations are feature-level tags, not YAML frontmatter; author `@decided-by.spec:decisions.agent-surface-scripts-graph` beside the existing `@refines.spec:consumers.agent-surface` tag (`specs/consumers/reader.sdp.gherkin:4`), and verify the exact tag spelling against the tag mapping in `src/extract/gherkin.ts` before authoring.
    5. `spec:extraction.executable-contracts` → `spec:decisions.point-per-example` (per-example contract generation descends from the point-per-example ruling)
  CUT AT PLANNING (do not re-add): `spec:carrier.sdp-import` → `spec:decisions.architectural-significance-rides-primitives` — the ruling shaped the component-binding act, not the import Spec's law, so the edge would be a misattribution.
  Markdown-carrier subjects take the edge in frontmatter (`decidedBy:` list); the Gherkin carrier takes the tag form above. Shared `declared-relations.ts` lockstep is todo 8, not here. Must NOT add edges beyond the surviving candidates; no `dependsOn`, no `supersedes`.
  Parallelization: Wave 1 | Blocked by: — | Blocks: 8
  References: the six subject Specs under `specs/`; the decision Specs under `specs/decisions/`; recipe 17's shapingDecisions join (`docs/agent-surface/recipes.md` recipe 17)
  Acceptance criteria: validate exits 0; `pnpm --silent sdp:q 'return graph.edges.filter(e=>e.type==="decidedBy").length'` reflects exactly the surviving fills on top of the current count; each dropped candidate is recorded with its reason in the evidence file.
  QA happy: run the recipe 17 body via `pnpm --silent sdp:q` — every surviving fill appears on its components' shapingDecisions rows. QA failure: dangling target — fix frontmatter or the Gherkin tag. Evidence `.omo/evidence/task-5-design-law-transfer.md`.
  Commit: Y | feat(specs): decidedBy fills so rulings surface in the architecture map
  Recommended task executor category: unspecified-low

- [x] 6. Register "architecturally significant unit" in CONTEXT.md
  What to do: Insert one row into the `## The other authored things` glossary table in `CONTEXT.md`, immediately after the **anchor** row (lines 61-67):
    `| **architecturally significant unit** | a code unit with exported public surface or cross-component reach that warrants graph-visible structural binding — component membership, and uses declarations for its architectural dependencies; the accepted set is an owner-reviewed declaration, never derived from imports (carried by ` + "`" + `spec:model.structural-patterns` + "`" + `) | "pattern" (refused, MD-34) |`
  Must NOT change any other row, header, or section; the term's definition must match `spec:model.structural-patterns`' `model.terms` wording.
  Parallelization: Wave 1 | Blocked by: — | Blocks: —
  References: `CONTEXT.md:61-67` (the table), `specs/model/structural-patterns.sdp.md` (model.terms definition), `test/check-self-hosting-gates.test.ts:45-54` (CONTEXT.md is copied into the self-hosting fixture — content is not pinned, but the gate must stay green)
  Acceptance criteria: `grep -n "architecturally significant unit" CONTEXT.md` shows the new row; `npm run check:temporal` exits 0 (CONTEXT.md is NOT date-excluded — the row must carry no ISO dates, plan-N, or session tokens); `npm run check:self-hosting-gates` exits 0 (the gate bans plan-status wording in CONTEXT.md and DECISIONS.md); `npx vitest run test/check-self-hosting-gates.test.ts` passes.
  QA happy: gate test green. QA failure: table malformed — fix the row. Evidence `.omo/evidence/task-6-design-law-transfer.md`.
  Commit: Y | docs(glossary): register architecturally significant unit
  Recommended task executor category: quick

- [ ] 7. Record the promotion worklist as graph-visible backlog
  What to do: Add a `### Open questions` subsection under `## Intent` of each carrier Spec below, with exactly one `- [non-blocking]` entry (format: `src/extract/markdown-body-owner-behavior.ts:88-96`; exemplar: `specs/consumers/impact-graph.sdp.md:15-16`). Lockstep each Spec's oracle descriptor (exemplar for an intent with openQuestions: the `spec:consumers.impact-graph` entry in `test/self-hosting-oracle/consumers.ts`). Entries:
    1. `specs/validation/two-check-families.sdp.md`: `- [non-blocking] Does the one-validation-path registry law stated in the src/validate/validators.ts file header promote here or to a story-altitude child under comment promotion?`
    2. `specs/validation/readiness-floor.sdp.md`: `- [non-blocking] Does any remaining law in the src/validate/readiness-floor.ts file header promote here under comment promotion?`
    3. `specs/extraction/example-runner.sdp.md`: `- [non-blocking] Do the every-step-and-only-the-steps and fresh-world-per-example laws stated in the runner and vitest-adapter commentary promote here or to story-altitude children under comment promotion?`
    4. `specs/extraction/executable-contracts.sdp.md`: `- [non-blocking] Do the concreteness-refusal and no-guessing outcome-identity laws stated in src/codegen/contracts.ts commentary promote here or to a story-altitude child under comment promotion?`
    5. `specs/consumers/projections-model.sdp.md`: `- [non-blocking] Does the pure-projection binding-language law stated in src/projections/design-review.ts commentary promote here or to a story-altitude child under comment promotion?`
    6. `specs/extraction/build-pipeline.sdp.md`: `- [non-blocking] Does the derive-in-process freshness law stated in src/cli/q-command.ts commentary promote here or to a story-altitude child under comment promotion?`
  Must NOT flag any entry `[blocking]` (a blocking question fails the carrier's stated floor); must NOT touch readiness lines.
  Parallelization: Wave 2 | Blocked by: 3 (shares `test/self-hosting-oracle/extraction.ts`) | Blocks: —
  References: `src/extract/markdown-body-owner-behavior.ts:88-96`, `specs/consumers/impact-graph.sdp.md:15-16`, `test/self-hosting-oracle/{validation,extraction,consumers}.ts`
  Acceptance criteria: validate exits 0; `pnpm --silent sdp:q 'return ["spec:validation.two-check-families","spec:validation.readiness-floor","spec:extraction.example-runner","spec:extraction.executable-contracts","spec:consumers.projections-model","spec:extraction.build-pipeline"].map(id=>({id, readiness: g.specContext(id).statedReadiness}))'` shows all six still `ready`; the per-family oracle suites pass.
  QA happy: descriptors match extraction. QA failure: floor failure from a misformatted flag — fix the entry. Evidence `.omo/evidence/task-7-design-law-transfer.md`.
  Commit: Y | docs(specs): record the comment-promotion worklist as backlog
  Recommended task executor category: unspecified-low

- [ ] 8. Sync shared self-hosting oracles and frozen corpus totals
  What to do: After todos 1, 3, 4, 5 have landed, update in ONE pass: `test/self-hosting-oracle/declared-relations.ts` (todo 1's 3 relations + todo 3's 2 + todo 5's surviving fills), `test/self-hosting-oracle/pack-members.ts` (+2: the refusal decision and the delivery-facts Spec), `test/self-hosting-oracle/anchors.ts` (retarget the `impl:protocol.delivery-facts` entry at lines 1681-1688 to `target: "spec:extraction.delivery-facts"`; add the `test:protocol.delivery-facts` entry — nodeType Anchor, file `test/extract.test.ts`, constant `deliveryFactsTestAnchor`, site = the first `it(` of the ladder describe block; add the `test:protocol.structural-self-binding` entry — nodeType Anchor, file `test/self-hosting-graph.test.ts`, constant `structuralSelfBindingTestAnchor`, site = the census `it(` block; Anchor-row shape exemplar: lines 160-168), and `test/self-hosting-graph.test.ts` frozen totals + readiness distribution (lines 138-147 and the distribution assertion near lines 188-197). RE-DERIVE every literal from the live graph with `pnpm --silent sdp:q` (specs/packs/anchors counts, node/edge totals, readiness histogram) — never transcribe from this plan's arithmetic. Verify `expectedWarnings` in `test/self-hosting-oracle/index.ts:52-86` still pins exactly five warnings (the tracer carries a verifier and the decision Spec is exempt; if a sixth appears, trace it — do not pin a warning you cannot explain). State the final literal values in the evidence file.
  Must NOT edit per-Spec descriptor oracles here (handled in their own todos); must NOT suppress a genuine mismatch.
  Parallelization: Wave 2 | Blocked by: 1, 3, 4, 5 | Blocks: 9
  References: `test/self-hosting-oracle/declared-relations.ts`, `test/self-hosting-oracle/pack-members.ts`, `test/self-hosting-oracle/anchors.ts:160-168,1681-1688`, `test/self-hosting-oracle/index.ts:52-86`, `test/self-hosting-graph.test.ts:138-147,188-197`
  Acceptance criteria: `npx vitest run test/self-hosting-graph.test.ts` passes fully.
  QA happy: all self-hosting oracle assertions green. QA failure: a roster mismatch — read the failure, fix the oracle, re-run. Evidence `.omo/evidence/task-8-design-law-transfer.md`.
  Commit: Y | chore: sync self-hosting oracles and frozen totals
  Recommended task executor category: unspecified-high

- [ ] 9. Run the full gate, re-measure, and close the branch/PR slice
  What to do: Run `npm run check` on the branch (expected warnings only: the pinned `honesty/gaps` set and the intentional `verifies-linkage` example warning). Re-measure with `pnpm --silent sdp:q` — corpus counts, recipe 17 spot-check (every surviving todo-5 fill renders on its components' shapingDecisions rows), recipe 1 backlog unchanged apart from intended moves — and label every number re-derived in the close evidence. Update the PR #25 description's forward section with this slice via `gh pr edit 25`. PR-description wording guards: the verifier claim must carry the grain caveat — the census checks the ACCEPTED SET's conformance, never significance discovery (acceptance stays a human act) — and the recipe-17 claim names only the surviving fills, never pre-committed decision ids. Push the branch: `git push origin feature/architectural-patterns-views` (SSH transport per AGENTS.md — the user authorized extending this PR). Record close evidence.
  Must NOT ignore or pin unexplained warnings; must NOT force-push; must NOT merge the PR.
  Parallelization: Wave 3 | Blocked by: all | Blocks: —
  References: `package.json` check script; AGENTS.md (gate description, SSH transport); `docs/agent-surface/recipes.md` recipes 1, 17
  Acceptance criteria: `npm run check` exits 0; the PR description forward section names this slice; `git log origin/feature/architectural-patterns-views..HEAD` is empty after the push.
  QA happy: gate green with expected warnings; re-derived counts recorded; `gh pr view 25 --json body` shows the forward-section marker string for this slice. QA failure: unexpected validation error — trace to the offending todo and fix there, never suppress. Evidence `.omo/evidence/task-9-design-law-transfer.md`.
  Commit: Y | chore: re-measured counts and design-law transfer close
  Recommended task executor category: quick

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit
  Verify every todo's evidence file exists at `.omo/evidence/task-<N>-design-law-transfer.md` and matches its acceptance criteria. Confirm the dependency matrix was respected (todo 7 after todo 3; todo 8 after todos 1, 3, 4, 5; todo 9 last). Confirm no file outside Scope IN was edited. Audit the branch's commit messages for coherent boundaries (one domain per commit; todo 1's Spec + MD-35 row in the same commit).
  Recommended task executor category: unspecified-high
- [ ] F2. Code quality review
  Verify the two new Specs and the amended ones speak ratified terminology (CONTEXT.md; no invented terms — "comment promotion" cites the promotion law). Verify the demoted JSDoc in `src/graph/delivery-facts.ts` restates none of the ten rules (MD-10 exclusive promotion). Verify the refusal Spec passes the ADR three-part test in its own text. Verify CONTEXT.md carries no temporal/plan-status tokens. Verify the decidedBy fills that landed are exactly the surviving candidates with evidence-file reasons for any drops.
  Recommended task executor category: unspecified-high
- [ ] F3. Real manual QA
  Run the recipe 17 body via `pnpm --silent sdp:q` and confirm every surviving todo-5 fill appears on its components' shapingDecisions rows; for any candidate that failed its verify-first bar, confirm the evidence file records the reason. Record honestly in the close evidence which rulings still do not surface on component rows (a ruling whose subjects are structural Specs, not realized carrier Specs, belongs to the decision map — recipe 18 — not the component join). Run recipe 19 on `spec:extraction.delivery-facts` and confirm the implementation, verifier, and parent neighborhood render. Run `pnpm --silent sdp validate . --exclude explorations --exclude examples --exclude test/fixtures/import/parity` (exit 0). Spot-check `generated/design-review/spec/extraction.delivery-facts.md` exists after regeneration.
  Recommended task executor category: unspecified-high
- [ ] F4. Scope fidelity
  Diff the branch against Scope IN/OUT: exactly one re-targeted `satisfies` edge (`git diff main -- src/` shows only the anchor line and JSDoc demotion in `src/graph/delivery-facts.ts`); no new relation types, reader methods, projections, or validator families; no anchors on the three marginal files; no `[blocking]` open questions added; `spec:protocol.structural-self-binding` and `spec:model.structural-patterns` still `defined`; no new `plans/` file.
  Recommended task executor category: unspecified-high

## Commit strategy
Commits at coherent boundaries on `feature/architectural-patterns-views`, one domain per commit:
- After todo 1: `feat(specs): refuse source-commentary extraction into the graph (MD-35)` — the Spec and the MD-35 registry row land in the SAME commit (decision-readiness-posture ratification evidence).
- After todo 2: `docs(specs): land the comment-promotion filter on spec-sections`
- After todo 3: `feat(specs): promote delivery-fact conferral law to spec:extraction.delivery-facts`
- After todo 4: `test(structure): census-check the accepted significant-unit set`
- After todo 5: `feat(specs): decidedBy fills so rulings surface in the architecture map`
- After todo 6: `docs(glossary): register architecturally significant unit`
- After todo 7: `docs(specs): record the comment-promotion worklist as backlog`
- After todo 8: `chore: sync self-hosting oracles and frozen totals`
- After todo 9: `chore: re-measured counts and design-law transfer close`
Per-todo commit lines are authoritative; the worker may batch adjacent todos into one commit only when they share a coherent scope, never mixing unrelated domains. The push happens once in todo 9 after the gate is green.

## Success criteria
- `npm run check` exits 0 on the branch (only the pinned `honesty/gaps` set and the intentional `verifies-linkage` example warning).
- `spec:extraction.delivery-facts` stands at `ready` with `implemented` + `has-verifier`, one implementation (`impl:protocol.delivery-facts`), one verifier (`test:protocol.delivery-facts`); `spec:extraction.derive-graph` keeps both delivery facts via its four remaining bindings.
- `spec:decisions.jsdoc-graph-extraction-refused` stands at `ready` with its MD-35 registry row; the refusal is answerable by graph query.
- The self-binding census assertion passes over the accepted-unit roster, and removing a roster row fails the suite naming the unit (verified in todo 4's QA).
- Recipe 17's shapingDecisions join renders every surviving todo-5 fill on its components' rows; the six carrier Specs each carry one `[non-blocking]` comment-promotion question.
- `CONTEXT.md` registers "architecturally significant unit"; `npm run check:temporal` and `npm run check:self-hosting-gates` exit 0.
- Re-derived corpus counts are recorded in the close evidence (labeled re-derived, never transcribed from plan arithmetic).
- No `src/` behavior changes: the `src/` diff is exactly the re-targeted `satisfies` line and the demoted JSDoc in `src/graph/delivery-facts.ts`.
- No new `plans/` file; PR #25's description forward section names this slice; the branch is pushed.
