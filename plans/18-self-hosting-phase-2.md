# Plan 18 — Self-hosting phase 2: carrier flip, decision fold, and corpus growth

> 🧭 DRAFTED
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

| TS refusal class | Same-class Markdown finding | Named non-claim | Checkout-forced cell | Evidence link |
|---|---|---|---|---|
| `extract/parse-error` | `extract/invalid-frontmatter` | named non-claim — YAML/parser recovery is not TypeScript parser parity | confirmed — no checkout source forces malformed syntax | confirmed — `markdown-support.ts:3-12`; 17b diagnostic matrix row 170 |
| `extract/non-static-envelope` | `extract/non-static-envelope` | named non-claim — Markdown has no executable-expression analogue | confirmed — all eleven checkout envelopes exercise static descriptor values | confirmed — `markdown.ts:173-196`; checkout evidence table |
| `extract/invalid-id` | `extract/invalid-id` | named non-claim — exact message and token location remain unpinned | confirmed — every checkout envelope supplies a `spec:` ID | confirmed — `markdown.ts:158-171`; checkout evidence table |
| `extract/duplicate-id` | `extract/duplicate-id` | named non-claim — cross-carrier reporting remains bounded by corpus roots | confirmed — migration's no-dual-ID atom is the forced duplicate case | confirmed — `reify.ts:53-64`; `validators.ts:204`; §1 ruling 4 |
| `extract/reserved-property` | `extract/reserved-property` | named non-claim — derived-vocabulary wording is not parity-pinned | confirmed — no checkout source authors a reserved property | confirmed — `markdown.ts:100-110`; `markdown-body-owner-support.ts:26-35` |
| `extract/non-static-section` | `extract/invalid-markdown-structure` | named non-claim — structural refusal is not expression-equivalence | confirmed — no checkout source contains executable section syntax | confirmed — `markdown-body.ts:35-37`; 17b diagnostic matrix row 171 |
| `extract/unowned-prose` | `extract/unowned-prose` | named non-claim — diagnostic wording need not share TS text | confirmed — checkout uses only ruled Intent and section-owned content | confirmed — `markdown-body-content.ts:233-241`; 17b diagnostic matrix row 173 |
| `extract/unrecognized-statement` | `extract/invalid-markdown-structure` | named non-claim — TS statement-class equivalence is out of scope | confirmed — checkout's rules, flows, lists, and fences are all ruled forms | confirmed — 17b rows 139-150 and diagnostic matrix row 171 |
| `extract/unrecognized-property` | `extract/unrecognized-property` | named non-claim — spelling and location parity remain unpinned | confirmed — all envelope keys and section fields are recognized | confirmed — `markdown.ts:100-110`; `markdown-body-owner-support.ts:26-35` |
| `extract/misplaced-authoring` | `extract/invalid-markdown-structure` | named non-claim — placement refusal is bounded, not CommonMark parity | confirmed — both example Specs force immediate `gwt` placement after Intent | confirmed — 17b row 144 and diagnostic matrix row 171; two example rows above |

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

### Fold ledger template

| Source row | Disposition | Carrying spec or surface | Refine target / back-edges | Evidence / review note |
|---|---|---|---|---|
| MD-1 | pending | — | `spec:protocol.self-hosting` | three-part test rechecked |
| MD-9 | carried by code/tests — verify surface | `src/model/sections.ts`; readiness floor | n/a | folds row, no re-authoring |
| MD-13 | carried by code/tests — verify surface | `src/validate/readiness-floor.ts`; concept 05 | n/a | folds row, no re-authoring |
| D1/D2/D4 | ordinary spec | tranche-3 coverage ledger | selected by wave | structural shorthand remains registry residue |
| measured evidence | pending | named tranche-3 spec | selected by evidence claim | dispose every figure exactly once |

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
| `02 §1-2 primitive and descriptors` | `spec:model.core-model` | pending | target entrypoints not yet selected | earliest fold target |
| `02 §3 sections` | `spec:model.spec-sections` | pending | target entrypoints not yet selected | target to create |
| `02 §6 relations` | `spec:model.relations` | pending | target entrypoints not yet selected | target to create |
| `02 stable identity` | `spec:model.stable-ids` | pending | target entrypoints not yet selected | target to create |
| `02 §4 Pack` | `spec:model.pack-aggregate` | pending | target entrypoints not yet selected | target to create |
| `04 anchors` | `spec:model.anchors` | pending | target entrypoints not yet selected | target to create |
| `05 two check families` | `spec:validation.two-check-families` | pending | validator anchors to be named | target to create |
| `06 projections` | `spec:consumers.projections-model` | pending | projection anchors to be named | target to create |
| `06 agent surface` | `spec:consumers.agent-surface` | pending | agent-surface anchors to be named | target to create |
| `06 Design Review` | `spec:consumers.design-review` | pending | projection anchors to be named | target to create |
| `05 referential integrity` | `spec:validation.referential-integrity` | pending | validator anchors to be named | target to create |
| `05 claim separation` | `spec:validation.claim-separation` | pending | validator anchors to be named | target to create |
| `05 verification linkage` | `spec:validation.verification-linkage` | pending | validator anchors to be named | target to create |
| `05 Pack coherence` | `spec:validation.pack-coherence` | pending | validator anchors to be named | target to create |
| `05 authored honesty` | `spec:validation.authored-honesty` | pending | validator anchors to be named | target to create |
| `05 warn-level signals` | `spec:validation.warn-level-signals` | pending | validator anchors to be named | target to create |
| `06 reader` | `spec:consumers.reader` | pending | reader anchors to be named | target to create |
| `06 edit model` | `spec:consumers.edit-model` | pending | consumer anchors to be named | target to create |
| `03 extraction exclusions` | `spec:extraction.excludes` | pending | extractor entrypoints to be named | target to create |
| `03 claim taxonomy` | `spec:extraction.claim-taxonomy` | pending | extractor entrypoints to be named | target to create |
| `03 regenerability` | `spec:extraction.regenerability` | pending | extractor entrypoints to be named | target to create |
| `03 schema versioning` | `spec:extraction.schema-versioning` | pending | extractor entrypoints to be named | target to create |
| `03 executable contracts` | `spec:extraction.executable-contracts` | pending | extractor entrypoints to be named | target to create |

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
| No-reparse spy coverage (review-06) | Carry forward as deferred polish | pending |
| Carrier-truth comment and temporal token assembly (review-06) | Records cluster adopts comment; token assembly deferred | pending |
| Stale provenance wording and plan-16 evidence dispositions (review-06) | Adopt with records cluster | pending |
| Twelfth preflight leg and decision-spec namespace divergence (review-06) | Verify preflight; resolve namespace in fold | pending |
| Indirect assembly of the `then` graph key (review-06) | Verify remediation remains intact | pending |
| Model term named `description` (review-06) | Verify remediation remains intact | pending |
| Checkout duplicate-carrier fixture exemption (review-06) | Preserve as explicit fixture exception | pending |
| Exclude/CLI cluster (brief §6) | Land in tranche 1 | done s1 — loud Windows absolute rejection, flag-operand usage diagnostics, segment-boundary coverage, and library/CLI wording separation landed |
| Grammar-hardening cluster (brief §6) | Land with parity baseline | done s3 — all eight RED→GREEN items landed with focused public-reifier regressions and stable finding IDs |
| Design Review cluster (brief §6) | Rule at migration/flip | done s2 — owner ruled Option 1; deterministic ordering and uniform escaping landed RED-first with focused projection regressions |
| Records cluster (brief §6) | Land with decision fold | pending |
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
| G3 | checkout migration | all eleven Specs Markdown-canonical with no dual IDs | pending — migration check and example walkthrough |
| G4 | hardening baseline | §3 classes have evidence or named non-claim | pending — parity matrix and parser-Spec disposition |
| G5 | canonical-default flip | operative records and post-flip truth pins agree | pending — one tight record series and audit map |
| G6 | first corpus-wave targets | core model, validation, and consumers parents exist | pending — coverage ledger and generated Design Review |
| G7 | decision fold | every fold source has one ledger disposition | pending — lean registry review and relation evidence |
| G8 | whole-phase close | full gate, clean-clone proof, review remediation, owner acceptance | pending — final verification wave and accepted SHA |

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
