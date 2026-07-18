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
| `spec:orders.order-management` | behavior | Intent; Behavior; relation envelope | confirmed — Intent and `## Behavior` map are frozen | parent behavior rules |
| `spec:orders.create-order` | behavior | Intent; Example space; multi-relation envelope | confirmed — `## Example space` and ordered relation lists are frozen | parent `exampleSpace` forces vocabulary fence |
| `spec:orders.create-order.valid-cart` | example | Intent; immediate `gwt`; Verification | confirmed — example fence and Verification owner are frozen | bound happy-path point |
| `spec:orders.create-order.invalid-cart` | example | Intent; immediate `gwt`; Verification | confirmed — example fence and Verification owner are frozen | partial bound point remains lawful |
| `spec:orders.create-order.api-contract` | contract | Intent with blocking open question | confirmed — Intent/Open questions owner is frozen | no contract body in current source |
| `spec:orders.order-total-rule` | rule | Intent; Rule | confirmed — `## Rule` owner is frozen | promoted rule child |
| `spec:orders.order-inventory-rule` | rule | Intent; Rule | confirmed — `## Rule` owner is frozen | promoted rule child |
| `spec:orders.order-placement-flow` | workflow | Intent; Workflow | confirmed — `## Workflow` owner is frozen | scoped flow-only evidence |
| `spec:orders.order-latency-constraint` | constraint | Intent; Constraints | confirmed — one-entry Constraints form is frozen | one constraint entry, no multi-entry claim |
| `spec:orders.order-model` | model | Intent; Model | confirmed — `## Model` owner is frozen | domain vocabulary terms |
| `spec:decisions.order-lifecycle` | decision | Intent; Decision | confirmed — `## Decision` owner is frozen | decision/rationale/consequences |

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
| `extract/parse-error` | `extract/invalid-frontmatter` | parser syntax recovery is not TS parser parity | no checkout source forces it | pending fixture |
| `extract/non-static-envelope` | `extract/invalid-frontmatter` | Markdown has no executable-expression analogue | no checkout source forces it | pending rationale |
| `extract/invalid-id` | `extract/invalid-id` | exact message and token location are not yet parity claims | every checkout envelope ID | pending fixture |
| `extract/duplicate-id` | `extract/duplicate-id` | cross-carrier duplicate reporting remains bounded by corpus roots | migration dual-carrier refusal | pending fixture |
| `extract/reserved-property` | `extract/unrecognized-property` | derived-vocabulary wording is not parity-pinned | no checkout source forces it | pending fixture |
| `extract/non-static-section` | `extract/invalid-markdown-structure` | Markdown structural refusal is not an expression-equivalence claim | no checkout source forces it | pending rationale |
| `extract/unowned-prose` | `extract/invalid-markdown-structure` | prose-owner diagnostics need not share TS text | all emitted prose owners | pending fixture |
| `extract/unrecognized-statement` | `extract/invalid-markdown-structure` | every TS statement class is not in scope | emitted structured lists and fences | pending fixture |
| `extract/unrecognized-property` | `extract/unrecognized-property` | property spelling and location parity are not yet claimed | checkout envelopes and owner keys | pending fixture |
| `extract/misplaced-authoring` | `extract/unrecognized-heading` | placement-refusal family is bounded, not full CommonMark parity | immediate example `gwt` placement | pending fixture |

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
| table-sugar syntax | checkout migration needs multi-point authoring | record syntax; preserve MD-17 static sibling expansion | watch — expected, never quota |
| single-literal vocabulary form | emitted vocabulary cannot express a real slot cleanly | rule only with a concrete fixture | watch |
| multi-entry constraint form | a real migrated constraint requires more than one entry | rule carrier syntax and parity evidence together | watch |
| array-section prose sub-owner | prose ownership becomes ambiguous in an array section | record owner and rejection boundary | watch |
| Markdown Pack syntax | a Pack needs Markdown authoring for a real caller | rule separately; Pack is not a kind | watch |

Under fire, a ruling records the trigger, alternatives, outcome, three-part-test disposition, carrying
Spec, and applicable matrix/ledger cells. Unfired items remain named here at phase close.

## (j) §7 Done-record and delta catalog

The done-record is process evidence, never graph content. A session appends its commit SHA,
Design Review outcome, corrections, fired rulings, matrix evidence, and any scope delta. The
round-trip catalog is declared before implementation and may change only by an explicit ruling.

| Delta | Comparison treatment | Why lawful | Evidence state |
|---|---|---|---|
| `.sdp.ts` to `.sdp.md` file suffix | normalize `file` path before graph comparison | physical carrier path is not semantic intent | pending |
| physical Markdown envelope syntax | compare reified authored content, not formatting tokens | envelope representation differs lawfully | pending |
| TS source comments | omit from graph comparison | comments are not graph content | pending |
| delivery facts under the same anchor set | compare after both sides use identical anchors | facts remain derived from bindings | pending |

## (k) §8 Docket ledger

Planned disposition is not execution evidence. Every row starts pending and closes as `done`,
`deferred`, or `dropped` with a reason; the table continues the plan-17 docket format.

| Docket item (origin) | Planned disposition | Execution state |
|---|---|---|
| Markdown reifier catch-all totality (review-06) | Adopt with hardening baseline | pending |
| YAML 1.2 scalar spellings (review-06) | Adopt with grammar hardening | pending |
| YAML parser line-number mismatch (review-06) | Adopt with grammar hardening | pending |
| Frontmatter `...` document end (review-06) | Adopt with grammar hardening | pending |
| Non-mapping-root accumulated findings (review-06) | Adopt with grammar hardening | pending |
| Depth and node cap finding flood (review-06) | Adopt with grammar hardening | pending |
| GWT fence placement in Intent (review-06) | Adopt with grammar hardening | pending |
| Heading trailing whitespace and trailing `#` titles (review-06) | Adopt with grammar hardening | pending |
| Duplicate `When` reporting and dead `mapOwner` branch (review-06) | Adopt with grammar hardening | pending |
| Windows absolute excludes and `--exclude --foo` diagnostics (review-06) | Adopt with exclude/CLI cluster | pending |
| Path-prefix matcher coverage (review-06) | Adopt with exclude/CLI cluster | pending |
| Library-seam exclusion wording (review-06) | Adopt with exclude/CLI cluster | pending |
| Design Review dynamic-key ordering (review-06) | Rule at migration/flip | pending |
| Design Review escaping outside prose slots (review-06) | Rule at migration/flip | pending |
| Row-3 enrichment delta (review-06) | Record in delta catalog | pending |
| Bound example reports only a count (review-06) | Verify during migration evidence | pending |
| Fixture-to-live byte identity (review-06) | Preserve through migration regression | pending |
| No-reparse spy coverage (review-06) | Carry forward as deferred polish | pending |
| Carrier-truth comment and temporal token assembly (review-06) | Records cluster adopts comment; token assembly deferred | pending |
| Stale provenance wording and plan-16 evidence dispositions (review-06) | Adopt with records cluster | pending |
| Twelfth preflight leg and decision-spec namespace divergence (review-06) | Verify preflight; resolve namespace in fold | pending |
| Indirect assembly of the `then` graph key (review-06) | Verify remediation remains intact | pending |
| Model term named `description` (review-06) | Verify remediation remains intact | pending |
| Checkout duplicate-carrier fixture exemption (review-06) | Preserve as explicit fixture exception | pending |
| Exclude/CLI cluster (brief §6) | Land in tranche 1 | pending |
| Grammar-hardening cluster (brief §6) | Land with parity baseline | pending |
| Design Review cluster (brief §6) | Rule at migration/flip | pending |
| Records cluster (brief §6) | Land with decision fold | pending |
| Table-sugar syntax (watch item) | Rule only if checkout forces it | pending |
| Single-literal vocabulary form (watch item) | Rule only if corpus forces it | pending |
| Multi-entry constraint form (watch item) | Rule only if corpus forces it | pending |
| Array-section prose sub-owner (watch item) | Rule only if corpus forces it | pending |
| Markdown Pack syntax (watch item) | Rule only if a Pack caller forces it | pending |

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
| G1 | emitter contract and grammar freeze | §2 matrix reviewed before emitter design | pending — CLI, source-adapter, write-semantics ruling |
| G2 | importer fidelity | imported fixture graph equals source under §7 catalog | pending — fixture and Design Review packet |
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
