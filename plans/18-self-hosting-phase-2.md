# Plan 18 — Self-hosting phase 2: carrier flip, decision fold, and corpus growth

> **Status:** ✅ EXECUTED — phase-2 implementation complete; final audit passed. This is plan 18, the latest ✅ EXECUTED ground. Build state lives in **`plans/`** — read the highest **primary-numbered** plan's status header, plus any **active subplans it (or its parent family) explicitly designates as current**; ignore unnumbered files and letter-suffixed plans only when no primary/active plan designates them. If that plan is DRAFTED, also read the latest ✅ EXECUTED plan for settled ground.
>
> **Spec anchors:** [the phase-2 brief](18-self-hosting-phase-2-brief.md) · [plan 17](17-self-hosting-v1.md) · [the carrier ruling (MD-18)](../docs/concept/DECISIONS.md).

## (a) Status

This is the executable phase plan for the owner mandate recorded at plan 17 Gate 4. It is a
plan record, not graph content. Execution happens only on
`feature/protocol-self-application-phase-2`, never on `main`; each session closes with an owner
Design Review over the generated view.

## (b) Context

Phase 1 landed the Markdown parser, the first self-hosting corpus, and the phase-1 gates. The
interim carrier rule still permits three states: Markdown-canonical new IDs, TS-canonical
pre-existing IDs, and the TS checkout tracer. Phase 2 ends that interim rule in the ruled order
emitter -> checkout migration -> hardening baseline -> flip; it then grows the carrier-stable
corpus and folds durable decisions into `decision` Specs. The permanent constraints remain: one
canonical surface per ID, no mixing; delivery facts are derived; and checks enforce conformance
and honesty, not content quality or workflow.

## (c) Scope

1. **Tranche 1:** land `sdp import` as a refusal-honest TS-to-Markdown product verb, migrate all
   eleven checkout Specs in one atomic migration series, settle the bounded hardening baseline,
   then perform the operative-record flip.
2. **Tranche 2:** fold durable decision laws using the `spec:decisions.*` namespace and a
   relation-target map whose targets exist before each decision is authored.
3. **Tranche 3:** model core model, extraction/one graph, validation, and consumers in sequential,
   owner-gated waves. The fold may start after its target minimum exists; it is not a full-wave
   barrier.

Out of scope: per-document concept deletion, a systematic tests-to-executable-specs rewrite, the
editor-association gap, cosmetic repair outside the post-flip anti-misleading pass, and new
content-quality validators.

## (d) §1 Tranche-1 engineering rulings

1. **Import boundary.** `sdp import` consumes the reified authored form from the TS adapter and
   emits one Markdown document in the winning carrier. It is one-way and creates no second
   validation path. Its CLI contract, refusal findings, exit codes, write mode, deletion policy,
   and package-barrel disposition are ruled before implementation.
2. **Grammar before emitter.** The checkout grammar matrix in §2 is reviewed before emitter design.
   A matrix gap is either a recorded under-fire ruling or an explicit non-claim, never an emitter
   workaround or silent grammar expansion.
3. **Fidelity.** Semantic fidelity is graph equality under §7's pre-declared delta catalog. The
   authoring-surface fidelity bar is separate: emitted Markdown must be idiomatic under the ruled
   grammar and prose-ownership law at Design Review.
4. **Migration atom.** Each migrated checkout ID deletes its `.sdp.ts` carrier in the same change
   that adds its `.sdp.md` carrier. The pack manifest may remain TS while the Pack watch item is
   unfired. No green commit contains a dual-authored checkout ID.
5. **Hardening claim.** The parser's phase-1 refusal-parity non-claim resolves only after the
   bounded §3 matrix has evidence: either a like-for-like claim or a narrower named non-claim is
   recorded on the parser Specs.
6. **Flip atom.** The carrier ruling (MD-18), `CONTEXT.md`, `AGENTS.md`, relevant truth pins, and
   the post-flip anti-misleading inventory move together. The TS DSL survives as import source and
   lawful per-ID option; this phase invents no canonical-surface config unless a recorded ruling
   makes it an explicit deliverable.

## (e) §2 Checkout grammar matrix

This appendix is the migration inventory, seeded from the eleven real checkout Specs. `confirmed`
means the frozen plan-17b owner map accepts the row today; it is not a parity claim. No cell is
marked unconfirmed until a concrete source inspection identifies a gap.

| Checkout ID | Kind | Carrier section(s) required by the TS source | 17b support | Migration note |
|---|---|---|---|---|
| `spec:orders.order-management` | behavior | Intent; Behavior; relation envelope | confirmed — 17b rows 128, 138, and 139 cover its `decidedBy` envelope, Intent fields, and rules | confirmed — `order-management.sdp.ts:4-19` is epic/defined behavior with Intent and rules |
| `spec:orders.create-order` | behavior | Intent; Example space; multi-relation envelope | confirmed — 17b rows 128, 138, and 143 cover ordered `refines`/`constrainedBy`/`decidedBy`, Intent, and `gwt-vocabulary` | confirmed — `create-order.sdp.ts:10-44` is feature/defined behavior; parent `exampleSpace` uses the ruled vocabulary fence |
| `spec:orders.create-order.valid-cart` | example | Intent; immediate `gwt`; Verification | confirmed — 17b rows 128, 138, 144, and 149 cover relation envelope, Intent, immediate example fence, and executable Verification | confirmed — `create-order-valid-cart.sdp.ts:4-45` is story/ready with the bound happy-path point |
| `spec:orders.create-order.invalid-cart` | example | Intent; immediate `gwt`; Verification | confirmed — 17b rows 128, 138, 144, and 149 cover relation envelope, Intent, immediate example fence, and executable Verification | confirmed — `create-order-invalid-cart.sdp.ts:4-35` is story/defined; its partial bound point is lawful |
| `spec:orders.create-order.api-contract` | contract | Intent with blocking open question | confirmed — 17b rows 128 and 138 cover its `refines` envelope, Intent, and blocking Open question | confirmed — `create-order-api-contract.sdp.ts:4-22` is story/idea and uses no contract body |
| `spec:orders.order-total-rule` | rule | Intent; Rule | confirmed — 17b rows 128, 138, and 140 cover `refines`, Intent, and plain rule entries | confirmed — `order-total-rule.sdp.ts:4-19` is story/defined with two promoted rules |
| `spec:orders.order-inventory-rule` | rule | Intent; Rule | confirmed — 17b rows 128, 138, and 140 cover `refines`, Intent, and plain rule entries | confirmed — `order-inventory-rule.sdp.ts:4-19` is story/defined with two promoted rules |
| `spec:orders.order-placement-flow` | workflow | Intent; Workflow | confirmed — 17b rows 128, 138, and 141 cover `refines`/`dependsOn`, Intent, and flow entries | confirmed — `order-placement-flow.sdp.ts:4-25` is feature/scoped with flow-only evidence |
| `spec:orders.order-latency-constraint` | constraint | Intent; Constraints | confirmed — 17b rows 128, 138, and 145 cover `refines`, Intent, and the one-entry Constraints form | confirmed — `order-latency-constraint.sdp.ts:4-20` is story/defined with one constraint; no multi-entry claim |
| `spec:orders.order-model` | model | Intent; Model | confirmed — 17b rows 128, 138, and 146 cover `refines`, Intent, and repeated term definitions | confirmed — `order-model.sdp.ts:4-22` is story/defined with five domain terms |
| `spec:decisions.order-lifecycle` | decision | Intent; Decision | confirmed — 17b rows 128, 138, and 148 cover `refines`, Intent, decision, rationale, and consequences | confirmed — `order-lifecycle.sdp.ts:4-22` is feature/defined with one decision and its consequences |

**Matrix review rule.** A kind-by-section cell becomes `unconfirmed` only with the exact checkout
ID, source shape, and frozen-grammar mismatch named. The table-sugar watch item remains unfired
unless this real corpus forces a multi-point authoring surface.

## (f) §3 Hardening matrix

This is the bounded refusal-comparison skeleton. The TS class is the complete
`extractFindingIds` set in `src/extract/reify.ts`; the Markdown column names the closest current
finding family, not a claim of one-for-one diagnostic parity. Evidence links are filled when the
hardening session supplies a fixture and result.

| TS refusal class | Executed Markdown result | Matrix disposition | Checkout-forced cell | Evidence link |
|---|---|---|---|---|
| `extract/parse-error` | `extract/invalid-frontmatter` | named non-claim — YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue | confirmed — no checkout source forces malformed syntax | [task-19 matrix](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.matrix.md) · [RED](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.red.log) |
| `extract/non-static-envelope` | `extract/non-static-envelope` | same-class finding | confirmed — all eleven checkout envelopes exercise static descriptor values | [task-19 matrix](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.matrix.md) |
| `extract/invalid-id` | `extract/invalid-id` | same-class finding | confirmed — every checkout envelope supplies a `spec:` ID | [task-19 matrix](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.matrix.md) |
| `extract/duplicate-id` | `extract/duplicate-id` at both sites after the pair enters one extraction root | same-class finding | confirmed — migration's no-dual-ID atom is the forced duplicate case | [task-19 matrix](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.matrix.md) |
| `extract/reserved-property` | `extract/reserved-property` | same-class finding | confirmed — no checkout source authors a reserved property | [task-19 matrix](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.matrix.md) |
| `extract/non-static-section` | `extract/invalid-markdown-structure` | named non-claim — TS drops one optional property while Markdown deliberately refuses a malformed document whole | confirmed — no checkout source contains executable section syntax | [task-19 matrix](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.matrix.md) · [carrier granularity](../docs/concept/04-authoring-and-binding.md#the-static-data-constraint-p5) |
| `extract/unowned-prose` | `extract/unowned-prose` | same-class finding | confirmed — checkout uses only ruled Intent and section-owned content | [task-19 matrix](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.matrix.md) |
| `extract/unrecognized-statement` | `extract/invalid-markdown-structure` | named non-claim — Markdown owns prose and structures, not TypeScript statement recognition | confirmed — checkout's rules, flows, lists, and fences are all ruled forms | [task-19 matrix](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.matrix.md) |
| `extract/unrecognized-property` | `extract/unrecognized-property` | same-class finding | confirmed — all envelope keys and section fields are recognized | [task-19 matrix](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.matrix.md) |
| `extract/misplaced-authoring` | `extract/invalid-markdown-structure` | named non-claim — Markdown has no executable authoring-call surface; equivalent placement is document structure | confirmed — both example Specs force immediate `gwt` placement after Intent | [task-19 matrix](../.omo/evidence/self-hosting-phase-2/task-19-self-hosting-phase-2.matrix.md) |

## (g) §4 Tranche-2 fold design

The fold distils durable law, not diary chronology. Every row receives one disposition in the
fold ledger; execution context remains in this plan and git. A new decision refines its most
specific available target and shaped Specs author `decidedBy` back-edges. The following 19-row map
is the refine-target template; `target to create` means tranche 3 must create the parent before
the fold row can land.

| Fold source | Ratified law / carrying item | Refine target | Target status | Intended disposition |
|---|---|---|---|---|
| MD-1 | executable meta-model | `spec:protocol.self-hosting` | phase-level | decision spec |
| MD-2 | adopt the nouns, reject the gates | `spec:protocol.self-hosting` | phase-level | decision spec |
| MD-4 | one primitive, named coordinates | `spec:model.core-model` | S5 | decision spec |
| MD-5 | protocol naming | `spec:protocol.self-hosting` | phase-level | decision spec |
| MD-7 | binding, never liveness | `spec:model.anchors` | S5 | decision spec |
| MD-10 | content-only sections | `spec:model.spec-sections` | S5 | decision spec |
| MD-11 | typing law | `spec:model.spec-sections` | S5 | decision spec |
| MD-12 | kind-conditional floor | `spec:validation.readiness-floor` | exists | decision spec |
| MD-14 | one validation path | `spec:validation.two-check-families` | S5 | decision spec |
| MD-15 | `.sdp.ts` extension | `spec:carrier.markdown-authoring` | exists | decision spec |
| MD-16 | carried evidence | `spec:validation.readiness-floor` | exists | decision spec |
| MD-17 | point-per-example | `spec:model.spec-sections` | S5 | decision spec |
| MD-18 | carrier ruling | `spec:carrier.markdown-authoring` | exists | decision spec |
| MD-19 | prose-ownership law | `spec:carrier.prose-ownership-rule` | exists | decision spec |
| MD-20 | strict consumer-exclusion contract | `spec:extraction.excludes` | S7 | decision spec |
| MD-21 | envelope-grammar ownership posture | `spec:carrier.envelope-contract` | exists | decision spec |
| D3 | Pack reified | `spec:model.pack-aggregate` | S5 | decision spec |
| D5 | agent surface scripts the graph | `spec:consumers.agent-surface` | S5 | decision spec |
| D6 | MCP-deferred no | `spec:consumers.projections-model` | S5 | decision spec |

### Fold-target verification (todo 27)

The 19-row refine-target map is ready for the fold: every immediate target exists after wave 1,
and MD-20 alone waits for its explicitly scheduled S7 target. No row falls back to the phase-level
parent merely because a more specific target is deferred.

| Fold source | Ratified law / carrying item | Refine target | Target status | Intended disposition |
|---|---|---|---|---|
| MD-1 | executable meta-model | `spec:protocol.self-hosting` | exists — phase-level | decision spec |
| MD-2 | adopt the nouns, reject the gates | `spec:protocol.self-hosting` | exists — phase-level | decision spec |
| MD-4 | one primitive, named coordinates | `spec:model.core-model` | exists — S5 wave 1a | decision spec |
| MD-5 | protocol naming | `spec:protocol.self-hosting` | exists — phase-level | decision spec |
| MD-7 | binding, never liveness | `spec:model.anchors` | exists — S5 wave 1a | decision spec |
| MD-10 | content-only sections | `spec:model.spec-sections` | exists — S5 wave 1a | decision spec |
| MD-11 | typing law | `spec:model.spec-sections` | exists — S5 wave 1a | decision spec |
| MD-12 | kind-conditional floor | `spec:validation.readiness-floor` | exists — pre-S5 | decision spec |
| MD-14 | one validation path | `spec:validation.two-check-families` | exists — S5 wave 1b | decision spec |
| MD-15 | `.sdp.ts` extension | `spec:carrier.markdown-authoring` | exists — pre-S5 | decision spec |
| MD-16 | carried evidence | `spec:validation.readiness-floor` | exists — pre-S5 | decision spec |
| MD-17 | point-per-example | `spec:model.spec-sections` | exists — S5 wave 1a | decision spec |
| MD-18 | carrier ruling | `spec:carrier.markdown-authoring` | exists — pre-S5 | decision spec |
| MD-19 | prose-ownership law | `spec:carrier.prose-ownership-rule` | exists — pre-S5 | decision spec |
| MD-20 | strict consumer-exclusion contract | `spec:extraction.excludes` | lands at S7 — todo 35 | decision spec at S7 |
| MD-21 | envelope-grammar ownership posture | `spec:carrier.envelope-contract` | exists — pre-S5 | decision spec |
| D3 | Pack reified | `spec:model.pack-aggregate` | exists — S5 wave 1a | decision spec |
| D5 | agent surface scripts the graph | `spec:consumers.agent-surface` | exists — S5 wave 1b | decision spec |
| D6 | MCP-deferred no | `spec:consumers.projections-model` | exists — S5 wave 1b | decision spec |

### Born-spec pre-verdicts (todo 27)

| Born spec | Current refine target | Pre-verdict | Relation action |
|---|---|---|---|
| `spec:decisions.plain-language-references` | `spec:protocol.self-hosting` | keep — genuinely phase-level | no change; revisit only if the owner overrules at todo 32 |
| `spec:decisions.concept-docs-dissolve` | `spec:protocol.self-hosting` | keep — genuinely phase-level | no change; revisit only if the owner overrules at todo 32 |

### Fold ledger

| Source row | Disposition | Carrying spec or surface | Refine target / back-edges | Evidence / review note |
|---|---|---|---|---|
| MD-1 | decision spec | `spec:decisions.executable-meta-model` | refines `spec:protocol.self-hosting`; `decidedBy` back-edge landed | three-part test: executable contract, not workflow tooling |
| MD-2 | decision spec | `spec:decisions.adopt-the-nouns` | refines `spec:protocol.self-hosting`; `decidedBy` back-edge landed | three-part test: familiar nouns without state gates |
| MD-4 | decision spec | `spec:decisions.one-primitive` | refines `spec:model.core-model`; `decidedBy` back-edge landed | three-part test: one identity across coordinates |
| MD-5 | decision spec | `spec:decisions.protocol-naming` | refines `spec:protocol.self-hosting`; `decidedBy` back-edge landed | three-part test: conformance contract naming |
| MD-7 | decision spec | `spec:decisions.binding-not-liveness` | refines `spec:model.anchors`; `decidedBy` back-edge landed | three-part test: binding evidence stays honest |
| MD-8 | folded | `src/model/anchors.ts:7-13` | n/a | “one builder over the implementation-flavored code namespaces”; “binding only, never system-truth content” |
| MD-9 | folds | `src/model/sections.ts:28-31`; `src/validate/readiness-floor.ts`; `02` §3 | n/a | “An open question is prose, or an object flaggable `blocking`”; floor and core-model relation retain its home |
| MD-10 | decision spec | `spec:decisions.content-only-sections` | refines `spec:model.spec-sections`; `decidedBy` back-edge landed | three-part test: content and relations remain exclusive |
| MD-11 | decision spec | `spec:decisions.typing-law` | refines `spec:model.spec-sections`; `decidedBy` back-edge landed | three-part test: floor-read shape guardrails |
| MD-12 | decision spec | `spec:decisions.kind-conditional-floor` | refines `spec:validation.readiness-floor`; `decidedBy` back-edge landed | three-part test: natural evidence by kind |
| MD-13 | folds | `05` §3 Representation note; `src/validate/readiness-floor.ts` header | n/a | table and generic evaluator remain representation evidence, never re-author |
| MD-14 | decision spec | `spec:decisions.one-validation-path` | refines `spec:validation.two-check-families`; `decidedBy` back-edge landed | three-part test: one graph truth, no parallel seam |
| MD-15 | decision spec | `spec:decisions.sdp-ts-extension` | refines `spec:carrier.markdown-authoring`; `decidedBy` back-edge landed | three-part test: carrier identity and test-glob trade-off |
| MD-16 | decision spec | `spec:decisions.carried-evidence` | refines `spec:validation.readiness-floor`; `decidedBy` back-edge landed | three-part test: promoted evidence cannot be empty |
| MD-17 | decision spec | `spec:decisions.point-per-example` | refines `spec:model.spec-sections`; `decidedBy` back-edge landed | three-part test: witness semantics and surface sugar trade-off |
| MD-18 | decision spec | `spec:decisions.carrier-ruling` | refines `spec:carrier.markdown-authoring`; `decidedBy` back-edges landed | three-part test: all-kind carrier and owned-tooling trade-off |
| MD-19 | decision spec | `spec:decisions.prose-ownership` | refines `spec:carrier.prose-ownership-rule`; `decidedBy` back-edge landed | three-part test: graph-owned prose and re-parse trade-off |
| MD-20 | decision spec at S7 — todo 38 | `spec:decisions.exclusion-contract` | refines `spec:extraction.excludes`; `decidedBy` back-edge at S7 | waits for specific target |
| MD-21 | decision spec | `spec:decisions.envelope-grammar-posture` | refines `spec:carrier.envelope-contract`; `decidedBy` back-edge landed | three-part test: owned grammar and parser representation trade-off |
| D1 | carried by ordinary spec | `spec:model.core-model:19` | n/a | “delivery fact … is never authored readiness” |
| D2 | carried by ordinary spec | `spec:model.spec-sections:16` | n/a | “Every section read by a readiness-floor clause has a closed typed shape” |
| D3 | decision spec | `spec:decisions.pack-reified` | refines `spec:model.pack-aggregate`; `decidedBy` back-edge landed | three-part test: truth-free aggregate distinct from refinement |
| D4 | carried by ordinary spec | `spec:consumers.design-review:15-18` | n/a | “renders a Spec or Pack in context”; “pure projection” |
| D5 | decision spec | `spec:decisions.agent-surface-scripts-graph` | refines `spec:consumers.agent-surface`; `decidedBy` back-edge landed | three-part test: graph contract, not verb wall |
| D6 | decision spec | `spec:decisions.mcp-deferred` | refines `spec:consumers.projections-model`; `decidedBy` back-edge landed | three-part test: caller-bound integration deferral |
| measured: ~⅕ tokens | landed at S5 | `spec:consumers.agent-surface` | n/a | measured multi-probe context-efficiency evidence |
| measured: single-digit to ~25% | landed at S5 | `spec:consumers.projections-model` | n/a | measured curated-selection evidence |
| measured: < ~50 specs | lands at S7 | `spec:extraction.regenerability` | n/a | retained in lean registry until S7 |
| measured: ~10k+ nodes | lands at S7 | `spec:extraction.regenerability` | n/a | retained in lean registry until S7 |
| born: plain-language references | keep | `spec:decisions.plain-language-references` | refines `spec:protocol.self-hosting` unchanged | genuinely phase-level; no owner override |
| born: concept-documents dissolve | keep | `spec:decisions.concept-docs-dissolve` | refines `spec:protocol.self-hosting` unchanged | genuinely phase-level; no owner override |

## (h) §5 Tranche-3 wave design

Waves execute in this order: core model (`02`), extraction and the one graph (`03`), validation
(`05`), then consumers (`06`). Each wave creates only Specs with real typed content: altitude is
chosen by the actual scope, validators are `rule` Specs only when their law needs independent
identity, relation laws are decisions only when they pass the durable-ruling rubric, and anchors
appear only on entrypoints that honestly claim realization. An executable example is added only
where the verification loop is cheap.

### Coverage ledger template

| Concept path | Spec ID | Readiness | Anchor/verifier status | Disposition note |
|---|---|---|---|---|
| `02 §1-2 primitive and descriptors` | `spec:model.core-model` | defined | `src/model/spec.ts` and `src/model/descriptors.ts` code anchors; no verifier | wave 1a refine target and shared vocabulary carrier |
| `02 §3 sections` | `spec:model.spec-sections` | defined | `src/model/sections.ts` and `src/validate/readiness-floor.ts` code anchors; no verifier | wave 1a section, typing-law, and verifier-semantics model |
| `02 §6 relations` | `spec:model.relations` | defined | `src/model/relations.ts` code anchor; no verifier | wave 1a relation vocabulary |
| `02 §5 stable identity` | `spec:model.stable-ids` | defined | `src/ids.ts` code anchor at `parseId`; no verifier | wave 1a stable-ID rule |
| `02 §4 Pack` | `spec:model.pack-aggregate` | defined | `src/model/pack.ts` code anchor; no verifier | wave 1a Pack aggregate model |
| `04 §2 generic source anchors` | `spec:model.anchors` | defined | `src/model/anchors.ts` and `src/extract/anchors.ts` code anchors; no verifier | wave 1a binding and extraction model |
| `05 §1 two check families and layered enforcement` | `spec:validation.two-check-families` | defined | `src/validate/validators.ts` code anchor at `graphValidatorIds`; no verifier | wave 1b validation parent and MD-14 refine target |
| `06 §1-2 projections taxonomy and two surfaces` | `spec:consumers.projections-model` | defined | `src/projections/design-review.ts` code anchor at `DesignReviewPage`; no verifier | wave 1b projections model and D6 refine target |
| `06 §3 agent surface` | `spec:consumers.agent-surface` | defined | `src/reader/reader.ts` code anchor at `createReader`; no verifier | wave 1b typed agent-surface behavior and measured-context carrier |
| `06 §5 Design Review` | `spec:consumers.design-review` | defined | `src/projections/design-review.ts` code anchor at `renderDesignReview`; no verifier | wave 1b flagship human projection and D4 carrying surface |
| `05 §2 MVP graph validators` | `spec:validation.referential-integrity` | defined | `checkReferentialIntegrity` named in the Rule; no verifier | check `conformance/referential-integrity`; sibling of readiness-floor, whose floor clauses confirm this rule's defined evidence |
| `05 §2 MVP graph validators` | `spec:validation.claim-separation` | defined | `checkClaimSeparation` named in the Rule; no verifier | check `conformance/claim-separation`; sibling of readiness-floor, whose floor clauses confirm this rule's defined evidence |
| `05 §2 MVP graph validators` | `spec:validation.verification-linkage` | defined | `checkVerifiesLinkage` and `checkOracleLinkage` named in the Rule; no verifier | bundles `conformance/verifies-linkage` and `conformance/oracle-linkage` because one law governs resolving verification traces; sibling of readiness-floor |
| `05 §2 MVP graph validators` | `spec:validation.pack-coherence` | defined | `checkPackCoherence` named in the Rule; no verifier | check `conformance/pack-coherence`; sibling of readiness-floor, whose floor clauses confirm this rule's defined evidence |
| `05 §2 MVP graph validators` | `spec:validation.authored-honesty` | defined | `checkAuthoringShape` and `checkDeliveryFacts` named in the Rule; no verifier | bundles `honesty/authoring-shape` and `honesty/delivery-facts` because one law rejects authored machine truth; sibling of readiness-floor |
| `05 §2 MVP graph validators` | `spec:validation.warn-level-signals` | defined | `checkOrphans` and `checkGaps` named in the Rule; no verifier | bundles `conformance/orphans` and `honesty/gaps` because one law keeps informative signals non-failing; sibling of readiness-floor |
| `06 §3 reader` | `spec:consumers.reader` | defined | `src/reader/reader.ts` code anchors at `createReader` and `BlastRadius`; no verifier | wave 3 thin typed loader, entry adapters, and honest file-level impact surface |
| `06 §4 edit model` | `spec:consumers.edit-model` | defined | no anchor or verifier | wave 3 intent-composition design intent; no single realizing entrypoint exists, so no decorative binding |
| `03 §1 exclusion surface` | `spec:extraction.excludes` | defined | `src/extract/index.ts` code anchor at `ExtractOptions`; no verifier | wave 4 strict consumer exclusion over exact root-relative POSIX prefixes |
| `03 §3 claim taxonomy` | `spec:extraction.claim-taxonomy` | defined | `src/graph/schema.ts` code anchor at `graphClaims`; no verifier | wave 4 epistemic model keeps declared, anchored, and inferred distinct |
| `03 §4 regenerability and no-second-store rule` | `spec:extraction.regenerability` | defined | `src/cli/sdp.ts` code anchor at `runBuild`; no verifier | wave 4 carrier for regenerability; it carries both measured figures |
| `03 §6 minimal schema versioning` | `spec:extraction.schema-versioning` | defined | `src/graph/schema.ts` code anchor at `schemaVersion`; no verifier | wave 4 MVP version presence and readability rule |
| `plan 13 A2 executable contracts` | `spec:extraction.executable-contracts` | defined | `src/codegen/contracts.ts` code anchor at `generateContracts`; no verifier | wave 4 graph-derived step and space contract behavior |

## (i) §6 Watch items and under-fire rulings

| Watch item | Trigger | Ruling rule | Current state |
|---|---|---|---|
| table-sugar syntax | checkout migration needs multi-point authoring | record syntax; preserve MD-17 static sibling expansion | watch — unfired: checkout models multi-case as sibling `example` Specs, not tables. |
| single-literal vocabulary form | emitted vocabulary cannot express a real slot cleanly | rule only with a concrete fixture | watch — unfired: emitted vocabulary was idiomatic and no concrete slot needed a single-literal form. |
| multi-entry constraint form | a real migrated constraint requires more than one entry | rule carrier syntax and parity evidence together | watch — unfired: the migrated constraint uses the one-entry form and no real constraint needed more than one entry. |
| array-section prose sub-owner | prose ownership becomes ambiguous in an array section | record owner and rejection boundary | watch — unfired: no ambiguous prose-ownership case appeared in the migrated sections. |
| Markdown Pack syntax | a Pack needs Markdown authoring for a real caller | rule separately; Pack is not a kind | watch — unfired: no Pack caller forced Markdown authoring; Pack remains a TS manifest. |

Under fire, a ruling records the trigger, alternatives, outcome, three-part-test disposition, carrying
Spec, and applicable matrix/ledger cells. Unfired items remain named here at phase close.

### Session 2 rulings under fire

| Trigger | Alternatives considered | Owner outcome | Three-part-test disposition | Carrying Spec / ledger cells |
|---|---|---|---|---|
| Design Review dynamic-key ordering followed insertion order and escaping stopped at narrative/description prose slots (review-06) | (1) escape every rendered field uniformly and sort dynamic keys lexicographically at render; (2) escape prose slots only and sort keys; (3) accept trusted-authored rendering and change nothing | **Option 1 ruled.** Every rendered field uses one escaping policy, including titles, rules, terms, criteria, open-bag keys/values, and other authored labels; model/open-bag dynamic keys sort lexicographically at render time. Permuted graph insertion orders now render byte-identically. Ordering and escaping are the only output changes; information content is preserved. | Not admitted as a durable decision Spec: this is a mechanically reversible projection representation fix, so it fails the hard-to-reverse part of the three-part test. The regression suite is the execution record. | Planned carrier: `spec:consumers.design-review` (S5). §8 rows “Design Review dynamic-key ordering”, “Design Review escaping outside prose slots”, and “Design Review cluster” are `done s2`. |

No other todo 13 to 15 activity triggered an under-fire ruling: the checkout migration and README
walkthrough used the ruled grammar without a forced gap.

### Session 3 rulings under fire

| Trigger | Alternatives considered | Owner outcome | Three-part-test disposition | Carrying Spec / ledger cells |
|---|---|---|---|---|
| YAML accepted an exact `...` document-end marker before the carrier's later exact `---` closer | (1) accept YAML's document-end token inside the envelope; (2) reject it and retain the frozen one-closer carrier grammar | **Option 2 ruled.** An exact `...` line anywhere before the required closing `---` refuses. The carrier has one envelope closer and never embeds a second YAML document boundary. | Not admitted as a durable decision Spec: this restores the already-frozen 17b grammar and is mechanically reversible, so it fails the surprising-new-trade-off part of the three-part test. | `spec:carrier.envelope-contract`; §8 “Frontmatter `...` document end”. |
| Depth and node breaches consumed the 100-finding budget with repeated identical diagnostics | (1) report every offending descendant; (2) stop traversal at the first breach; (3) emit one summary per breached limit per document while continuing traversal for independent findings | **Option 3 ruled.** Depth and node limits each emit at most one finding per document; traversal continues so unrelated authored-fidelity findings remain visible. | Not admitted as a durable decision Spec: this is a bounded diagnostic policy, not a hard-to-reverse domain law. | `spec:carrier.envelope-contract`; §8 “Depth and node cap finding flood”. |
| Review-06 exposed body-parser drift from the frozen trim and immediate-placement rules | (1) retain permissive fence placement and closing-marker interpretation; (2) restore the frozen behavior | **Option 2 ruled.** An example `gwt` fence is the final nonblank Intent block; trailing ASCII whitespace is trimmed from `### Open questions`; terminal `#` characters are literal heading text, with H2 text still passing through owner recognition. | Not admitted as a durable decision Spec: these are repairs to the frozen 17b representation, not new durable trade-offs. | `spec:carrier.markdown-parser`; §8 GWT and heading rows. |

### Session 3 hardening-claim disposition

**Option (a) ruled.** The executed §3 matrix contains only six same-class findings and four named
non-claims, so `spec:carrier.markdown-parser` carries a like-for-like bounded refusal-parity claim
backed by `test/extract-parity.test.ts` and the task-19 matrix evidence. It does not claim full
parity. The named non-claims remain explicit:

1. `extract/parse-error` — YAML/frontmatter parsing has no TypeScript parser-diagnostic analogue.
2. `extract/non-static-section` — TypeScript degrades optional section properties; Markdown refuses malformed documents whole.
3. `extract/unrecognized-statement` — Markdown owns prose and structures, not TypeScript statement recognition.
4. `extract/misplaced-authoring` — Markdown has no executable authoring-call surface.

## (j) §7 Done-record and delta catalog

The done-record is process evidence, never graph content. A session appends its commit SHA,
Design Review outcome, corrections, fired rulings, matrix evidence, and any scope delta. The
round-trip catalog is declared before implementation and may change only by an explicit ruling.

| Delta | Comparison treatment | Why lawful | Evidence state |
|---|---|---|---|
| `.sdp.ts` to `.sdp.md` file suffix | normalize `file` path before graph comparison | physical carrier path is not semantic intent | done — migration round-trip evidence confirms normalized graph equality |
| physical Markdown envelope syntax | compare reified authored content, not formatting tokens | envelope representation differs lawfully | done — migration round-trip evidence confirms reified authored equality |
| TS source comments | omit from graph comparison | comments are not graph content | done — migration round-trip evidence confirms comments do not affect the graph |
| delivery facts under the same anchor set | compare after both sides use identical anchors | facts remain derived from bindings | done — migration round-trip evidence confirms identical recomputed facts |

### Whole-phase done-record

- **Executed delta catalog:** the importer preserves authored `ReifiedSpec.data` with zero prose normalization. The graph comparison normalizes only the carrier file suffix from `.sdp.ts` to `.sdp.md`; physical envelopes and TypeScript source comments remain outside graph content; delivery facts are recomputed under the same anchor set; and `schemaVersion` remains unchanged. The semantic equality gate and the emitted-Markdown authoring-surface review both passed.
- **Executed delivery:** `sdp import` landed as the durable, fs-free import seam with the CLI write-beside and `--dry-run` boundary; all eleven checkout Specs migrated atomically to Markdown; the canonical-default carrier rule replaced the interim rule; the bounded parser refusal-parity claim, decision-spec fold, and four honest corpus waves landed. The resulting self-hosting graph holds 58 Specs, 1 Pack, and 36 anchors, with 7 `ready` and 51 `defined` Specs.
- **Session SHA summary:** G1 is `f06f14d`; G2 is `df444f2`; G3 is `0bb200a`; G4, G5, G6, and G8 are consolidated at `67cfda7` under the continuation directive; G7 remains `b471189034e1ee238394f3364c349937be6bebed` because its corpus and fold-completion evidence was accepted independently before the whole-phase close.
- **Watch items:** all five terminal states are unfired. Table sugar was not forced because waves used existing sibling Specs and ruled body forms. The single-literal vocabulary form was unnecessary beyond the ruled literal syntax. No wave required a multi-entry constraint. New prose stayed under existing typed section owners, leaving the array-section sub-owner unfired. The Pack remains a TypeScript manifest, with no caller requiring Markdown Pack authoring.
- **Docket close:** the twelfth preflight leg and decision-spec namespace divergence are done; the indirect `then` key and the Model term named `description` are verified; and the checkout duplicate-carrier fixture exemption remains an explicit preserved test-fixture exception.
- **Deferred tail:** no-reparse spy coverage remains deferred because named-import interception is weaker than an injected read seam. Temporal token assembly remains deferred because the sanctioned temporal-guard pattern still applies; its comment can be narrowed later.
- **Lean registry rulings:** the phase admitted `spec:decisions.*` records for the executable meta-model, naming and one-primitive laws, binding and section ownership, the typing and readiness-floor laws, one validation path, the `.sdp.ts` extension and carrier ruling, prose ownership, point-per-example, and the exclusion and envelope-grammar contracts. The Pack, agent-surface, and deferred-MCP decisions joined them; D1, D2, and D4 remain carried by their ordinary Specs. Each admission passed the three-part durability test and is linked from the lean registry.
- **Close evidence:** the acceptance assembly, adversarial-review remediation, and clean-clone and installed-package proofs are recorded in [task 40](../.omo/evidence/self-hosting-phase-2/task-40-self-hosting-phase-2.acceptance.md), [task 41](../.omo/evidence/self-hosting-phase-2/task-41-self-hosting-phase-2.review.md), and [task 42](../.omo/evidence/self-hosting-phase-2/task-42-self-hosting-phase-2.final-proofs.log).

## (k) §8 Docket ledger

Planned disposition is not execution evidence. Every row starts pending and closes as `done`,
`deferred`, or `dropped` with a reason; the table continues the plan-17 docket format.

| Docket item (origin) | Planned disposition | Execution state |
|---|---|---|
| Markdown reifier catch-all totality (review-06) | Adopt with hardening baseline | done s3 — the public Markdown reifier now converts every unexpected throw into one `extract/invalid-frontmatter` finding, mirroring the TS boundary |
| YAML 1.2 scalar spellings (review-06) | Adopt with grammar hardening | done s3 — plain exponent, hexadecimal, and signed-infinity spellings classify as non-string YAML scalars; quoted scalars remain strings |
| YAML parser line-number mismatch (review-06) | Adopt with grammar hardening | done s3 — YAML-native diagnostic text and structured `finding.line` now share carrier-relative line numbers |
| Frontmatter `...` document end (review-06) | Adopt with grammar hardening | done s3 — an exact document-end line before the required `---` closer refuses under the §6 stricter ruling |
| Non-mapping-root accumulated findings (review-06) | Adopt with grammar hardening | done s3 — mapping-root refusal preserves prior parser, warning, and directive findings before capping |
| Depth and node cap finding flood (review-06) | Adopt with grammar hardening | done s3 — the §6 bounded policy emits one summary per breached limit per document and preserves traversal |
| GWT fence placement in Intent (review-06) | Adopt with grammar hardening | done s3 — example `gwt` is terminal within Intent, immediately following the authored Intent block |
| Heading trailing whitespace and trailing `#` titles (review-06) | Adopt with grammar hardening | done s3 — H3 trailing ASCII whitespace trims; terminal `#` is literal H1/H2 text before owner recognition |
| Duplicate `When` reporting and dead `mapOwner` branch (review-06) | Adopt with grammar hardening | done s3 — a duplicate `When` emits one finding and the unreachable owner fallback is removed |
| Windows absolute excludes and `--exclude --foo` diagnostics (review-06) | Adopt with exclude/CLI cluster | done s1 — reject Windows drive-letter absolutes as invalid rather than normalize them, preserving MD-20 root-relative POSIX scope; a flag operand names itself in the CLI usage error |
| Path-prefix matcher coverage (review-06) | Adopt with exclude/CLI cluster | done s1 — focused regression proves `foo` excludes only `foo` and its slash-delimited descendants, never `foobar` |
| Library-seam exclusion wording (review-06) | Adopt with exclude/CLI cluster | done s1 — `normalizeExcludes` owns library diagnostics; `parseBuildArgs` translates them into `sdp <cmd>` usage wording |
| Design Review dynamic-key ordering (review-06) | Rule at migration/flip | done s2 — Option 1 sorts model/open-bag dynamic keys lexicographically at render; shuffled insertion orders produce byte-identical pages |
| Design Review escaping outside prose slots (review-06) | Rule at migration/flip | done s2 — Option 1 applies one escaping policy to every rendered field, including titles, rules, terms, criteria, labels, and open-bag data |
| Row-3 enrichment delta (review-06) | Record in delta catalog | done s2: recorded in the migration/delta catalog for G2 close. |
| Bound example reports only a count (review-06) | Verify during migration evidence | done s2: migration evidence verified the bound example reports only its count. |
| Fixture-to-live byte identity (review-06) | Preserve through migration regression | done s2: the migration regression preserved fixture-to-live byte identity. |
| No-reparse spy coverage (review-06) | Carry forward as deferred polish | deferred — named-import interception remains weaker than an injected read seam |
| Carrier-truth comment and temporal token assembly (review-06) | Records cluster adopts comment; token assembly deferred | done — comment now states only blockquote stripping and whitespace collapse; temporal token assembly remains deferred under the sanctioned temporal-guard pattern |
| Stale provenance wording and plan-16 evidence dispositions (review-06) | Adopt with records cluster | REPAIRED — approval artifact wording aligns with CONTEXT; plan-16 repair items dispositioned below |
| Twelfth preflight leg and decision-spec namespace divergence (review-06) | Verify preflight; resolve namespace in fold | done — the recorded preflight chain delta is benign, and the `spec:decisions.*` namespace fold landed |
| Indirect assembly of the `then` graph key (review-06) | Verify remediation remains intact | verified — phase-1 remediation names the `then` key directly |
| Model term named `description` (review-06) | Verify remediation remains intact | verified — phase-1 remediation preserves the Model term named `description` |
| Checkout duplicate-carrier fixture exemption (review-06) | Preserve as explicit fixture exception | preserved as explicit fixture exception — the deliberate dual-carrier fixture remains outside the one-canonical-surface product rule |
| Exclude/CLI cluster (brief §6) | Land in tranche 1 | done s1 — loud Windows absolute rejection, flag-operand usage diagnostics, segment-boundary coverage, and library/CLI wording separation landed |
| Grammar-hardening cluster (brief §6) | Land with parity baseline | done s3 — all eight RED→GREEN items landed with focused public-reifier regressions and stable finding IDs |
| Design Review cluster (brief §6) | Rule at migration/flip | done s2 — owner ruled Option 1; deterministic ordering and uniform escaping landed RED-first with focused projection regressions |
| Records cluster (brief §6) | Land with decision fold | REPAIRED — lean registry, measured evidence routing, record wording, and audit comment landed |
| README (plan-16 §6) | Doc-repair disposition | REPAIRED — anti-misleading carrier pass |
| `00` (plan-16 §6) | Doc-repair disposition | REPAIRED — anti-misleading carrier pass |
| `01` (plan-16 §6) | Doc-repair disposition | REPAIRED — anti-misleading carrier pass |
| `02` (plan-16 §6) | Doc-repair disposition | REPAIRED — anti-misleading carrier pass |
| `03` (plan-16 §6) | Doc-repair disposition | REPAIRED — anti-misleading carrier pass |
| `04` (plan-16 §6) | Doc-repair disposition | REPAIRED — anti-misleading carrier pass |
| `05` (plan-16 §6) | Doc-repair disposition | REPAIRED — approval artifact wording and floor records cleanup |
| `06` (plan-16 §6) | Doc-repair disposition | REPAIRED — consumer evidence routed to carrying Specs |
| `07` (plan-16 §6) | Doc-repair disposition | SUPERSEDED — S7 extraction work owns remaining scale evidence |
| CONTEXT/DECISIONS (plan-16 §6) | Doc-repair disposition | REPAIRED — glossary-consistent approval artifact and lean registry |
| Table-sugar syntax (watch item) | Rule only if checkout forces it | done s2: unfired, multi-case checkout behavior uses sibling `example` Specs, not tables. |
| Single-literal vocabulary form (watch item) | Rule only if corpus forces it | done s2: unfired, idiomatic emitted vocabulary required no single-literal slot form. |
| Multi-entry constraint form (watch item) | Rule only if corpus forces it | done s2: unfired, the migrated constraint uses the ruled one-entry form. |
| Array-section prose sub-owner (watch item) | Rule only if corpus forces it | done s2: unfired, migrated sections produced no ambiguous prose-ownership case. |
| Markdown Pack syntax (watch item) | Rule only if a Pack caller forces it | done s2: unfired, no caller forced Markdown Pack authoring; the Pack remains a TS manifest. |

## (l) §9 Commit strategy

1. Keep all work on `feature/protocol-self-application-phase-2`; never use a stash and never
   commit to `main`.
2. Land a behavioral change with its direct tests and Spec/anchor changes in the same atomic
   commit. Order foundations before callers: carrier/emitter seam, CLI surface, migration, parser
   hardening, operative records, then waves and fold.
3. The migration may be a tight series, but no commit admitted by `npm run check` may contain both
   canonical carriers for one checkout ID. Gate-affecting work includes a clean-snapshot and
   clean-clone proof before owner acceptance.

## (m) §10 Gate ledger G1-G8

This ledger is git process evidence, never graph content. It records owner gates and evidence;
its rows are not validators and do not alter readiness. `check-self-hosting-gates.mjs` verifies
the ledger's complete, non-empty G1-G8 structure while this plan exists.

| Gate | Meaning | Entry condition | Evidence / owner disposition |
|---|---|---|---|
| G1 | emitter contract and grammar freeze | §2 matrix reviewed before emitter design | accepted — 2026-07-18 — `f06f14d` |
| G2 | importer fidelity | imported fixture graph equals source under §7 catalog | accepted — 2026-07-18 — df444f2 |
| G3 | hardening baseline | §3 classes have evidence or named non-claim | accepted — 2026-07-18 — 0bb200a |
| G4 | canonical-default flip | operative records and post-flip truth pins agree | accepted — 2026-07-19 — 67cfda7; accepted by consolidation at the whole-phase close under the continuation directive |
| G5 | first corpus-wave targets | core model, validation, and consumers parents exist | accepted — 2026-07-19 — 67cfda7; accepted by consolidation at the whole-phase close under the continuation directive |
| G6 | decision fold | every fold source has one ledger disposition | accepted — 2026-07-19 — 67cfda7; accepted by consolidation at the whole-phase close under the continuation directive |
| G7 | corpus waves 2–4 + fold completion | coverage ledger complete and fold ledger terminal | accepted — 2026-07-19 — `b471189034e1ee238394f3364c349937be6bebed` |
| G8 | whole-phase close | full gate, clean-clone proof, review remediation, owner acceptance | accepted — 2026-07-19 — 67cfda7; accepted by consolidation at the whole-phase close under the continuation directive |

## (n) Acceptance criteria and final verification wave

1. The flip is total and recorded: no TS-canonical product Spec remains under the blessed roots;
   Pack manifests and fixture exemptions are named; post-flip records agree.
2. Every migrated checkout ID passes graph equality under §7 and the authoring-surface fidelity
   review. `sdp import` has pinned CLI behavior and installed-package smoke evidence.
3. The parser hardening non-claim resolves into bounded evidence or a named, narrower non-claim.
4. Every durable registry row, D1-D6, and measured-evidence item has one fold disposition; new
   decision Specs pass the durable-law rubric and all references remain resolvable.
5. All four corpus waves carry honest readiness, precise anchors where realization is claimed, and
   a §5 coverage-ledger row. No filler kinds or decorative anchors are accepted.
6. Every fired watch item has a ruling; every unfired item remains named in §6.
7. The docket is fully dispositioned, each session has an owner Design Review, and the final wave
   runs the full `npm run check`, clean-snapshot check, clean-clone check, installed-package proof
   for changed public surfaces, adversarial review, remediation verification, and G8 owner gate.
