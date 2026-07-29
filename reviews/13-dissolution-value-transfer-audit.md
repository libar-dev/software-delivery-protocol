# 13 - Dissolution value-transfer audit

**Reviewed:** the three dissolved concept docs — `02 — Core Model` (deleted at `fb1a14a`),
`03 — The One Graph` (deleted at `d5af001`), `05 — Validation & Honesty` (deleted at `9f2b069`) —
and the folded `DECISIONS.md` diary bodies (removed across `3bcfa45`, `2e9d5a6`, `b471189`),
each mapped to its current carriers with a gap check, at the owner's request (2026-07-29, on
`feature/protocol-self-application-phase-6`).

**Method:** four parallel agents, one per deleted artifact. Each recovered the deleted content
from git at the commit before its deletion, enumerated every content unit (sections, laws, tables,
shape sketches, clauses, rulings, open questions), then located and **read** each claimed carrier —
a matching heading was not accepted as a match; the substance was compared. Verdicts:
**CARRIED** (carrier named) · **PARTIAL** (core carried, named substance missing) ·
**DROPPED-DELIBERATE** (temporal/summary/history content consistent with the lean-registry
doctrine: "historical rationale lives in git, plans, and the Specs themselves") · **GAP**
(substantive design content found nowhere current).

| Deleted artifact | Recovered from | Units traced | GAP | PARTIAL |
| --- | --- | --- | --- | --- |
| `docs/concept/02-core-model.md` | `fb1a14a^` | 43 | 0 | 3 |
| `docs/concept/03-the-one-graph.md` | `d5af001^` | 26 | 0 | 1 |
| `docs/concept/05-validation-and-honesty.md` | `9f2b069^` | 25 | 0 | 1 |
| DECISIONS.md diary bodies (MD-1..MD-21 + aux blocks) | each commit's parent | 19 decisions + 5 blocks | 0 | 2 |

**Overall verdict: zero GAP-class losses.** Every law, rule, table row, enum, clause, and ruling in
the deleted material has a live carrier — a Spec, a surviving concept doc, `CONTEXT.md`, or a named
`src/` file. Several units were *sharpened* after dissolution rather than merely copied (duplicate-ID
exclusion semantics, tie-silent "did you mean" suggestions, oracle linkage rules, the split-report
family rule, regenerability thresholds). What dropped to git is consistently evidence detail —
line counts, corpus figures, war stories, reviewer provenance — exactly what the lean-registry
doctrine assigns there.

**Seven PARTIALs survive for review** (all prose guidance / rationale, no lost laws), listed at the
end with suggested re-homing targets. Their disposition is recorded in plan 25's close record
(`plans/25`); the quoted carrier text below is the audit-time snapshot, not the current tree.

---

## 1. `02 — Core Model` → the `spec:model.*` family

| # | Unit | Class | Carried by | Notes |
| --- | --- | --- | --- | --- |
| 1 | Spec definition; enrich-in-place; one truth-primitive | CARRIED | `CONTEXT.md`, `specs/model/core-model.sdp.md`, `docs/concept/01` (P4), `docs/concept/04` | |
| 2 | Spec TS envelope shape | CARRIED | `src/model/descriptors.ts`, `src/model/sections.ts` | Protocol-as-code is the canonical shape now |
| 3 | Envelope stability contract (L9) | CARRIED | `docs/concept/01` L9 | "MINOR change" semver framing dropped; substance intact |
| 4 | Carrier note — `relations: {}` physical vs logical | CARRIED | `specs/carrier/envelope-contract.sdp.md`, `src/import/emit-markdown.ts:213` | |
| 5 | No Requirement/ImplementedRequirement split; Pack + anchor non-truth | CARRIED | `CONTEXT.md`, `specs/model/protocol-domain.sdp.md` | |
| 6 | Three-descriptor table; independence (P8) | CARRIED | `CONTEXT.md`, `docs/concept/01` (incl. "linear pipeline cannot represent this") | |
| 7 | `SpecKind` 8 values + display labels | CARRIED | `src/model/descriptors.ts`, `CONTEXT.md` | |
| 8 | **One-kind rule** — "straddling fact = two specs + a relation" | **PARTIAL** | type system only | Prose authoring rule absent — item P1 below |
| 9 | Altitude ladder; above-epic deferred; Scenario ≠ altitude | CARRIED | `CONTEXT.md` | |
| 10 | Readiness rung meanings | CARRIED | `CONTEXT.md`, `specs/validation/readiness-floor.sdp.md` | Floor spec is clause-level, more precise than the doc |
| 11 | **Non-linear progression; child born above parent** | **PARTIAL** | floor bound carried | Affirmative permission absent — item P2 below |
| 12 | "Why the enums" — 4 rationale points | CARRIED | `CONTEXT.md` named-coordinates table + rejected-terms ledger | |
| 13 | Delivery-fact table; hand-authoring = honesty violation | CARRIED | `CONTEXT.md`, core-model spec, `specs/validation/authored-honesty.sdp.md` | |
| 14 | Build backlog / drift alarm queries | CARRIED | `CONTEXT.md` | Updated by MD-24 (`kind≠example`) — deliberate evolution |
| 15 | Floor checks structure-to-derive, never the fact | CARRIED | readiness-floor spec, `specs/decisions/verification-posture-not-realization.sdp.md` | |
| 16 | Liveness ladder; binding never liveness | CARRIED | `specs/decisions/binding-not-liveness.sdp.md`, `CONTEXT.md` | |
| 17 | Sections table (8 sections, field detail) | CARRIED | `src/model/sections.ts` (full typed shapes) | |
| 18 | narrative/description ownership; constraints exception | CARRIED | `specs/carrier/prose-ownership-rule.sdp.md`, MD-19 spec | |
| 19 | Decision section carries no `status` | CARRIED | `src/model/sections.ts:95`, `CONTEXT.md` rejected list | |
| 20 | Typing law (MD-11) | CARRIED | `specs/decisions/typing-law.sdp.md`, spec-sections spec | |
| 21 | Section⟷kind duality; inline vs promote | CARRIED | `CONTEXT.md`, spec-sections spec | |
| 22 | Content-only sections (MD-10); promoted children count as evidence | CARRIED | MD-10 spec, `specs/validation/kind-evidence.sdp.md` | |
| 23 | `modelRefs` → standalone model specs only | CARRIED | pack-aggregate + pack-coherence specs | |
| 24 | Worked CreateOrder example | CARRIED | `examples/checkout-v1/` | Live example replaces two-snapshot pedagogy; TS DSL form superseded by MD-18 |
| 25 | No code/test fields on Spec; anchor → `satisfies` → `implemented` | CARRIED | `CONTEXT.md`, `docs/concept/04` §2, `specs/model/anchors.sdp.md` | |
| 26 | `exemplifies` dropped; verification = mode+criteria | CARRIED | `CONTEXT.md`, sections.ts | |
| 27 | Verifier semantics — direct, per-spec, non-transitive | CARRIED | spec-sections spec, `specs/validation/verification-linkage.sdp.md` | |
| 28 | Pack = truth-free aggregate; never reconciled against members | CARRIED | `specs/model/pack-aggregate.sdp.md`, `CONTEXT.md` | |
| 29 | Many packs per spec; `belongsTo` declared, no 4th claim | CARRIED | pack-aggregate spec, `CONTEXT.md` | |
| 30 | Pack coherence check list | CARRIED | `specs/validation/pack-coherence.sdp.md` | |
| 31 | Refinement vs aggregate; Pack = Design Review unit | CARRIED | pack-aggregate spec, `docs/concept/06` | |
| 32 | ID grammar + `#sub`; MVP namespaces | CARRIED | `specs/model/stable-ids.sdp.md` (now more precise), `src/ids.ts` | |
| 33 | `spec:decisions.*` convention; `doc:` external-only | CARRIED | stable-ids spec | |
| 34 | String IDs never imports; `spec-ids` union deferred (L8) | CARRIED | stable-ids spec, referential-integrity spec, `docs/concept/01` | |
| 35 | IDs carry no history | CARRIED | stable-ids spec | |
| 36 | Relation table (6 authored relations) | CARRIED | `specs/model/relations.sdp.md`, `CONTEXT.md` | |
| 37 | `supersedes` decision-only, both extant | CARRIED | `src/validate/validators.ts:449-455`, `CONTEXT.md` | |
| 38 | UML alignment («refine»/«trace»/«verify») | CARRIED | `CONTEXT.md` relations table "Industry anchor" column | |
| 39 | **`constrainedBy`/`decidedBy` ≠ generic `dependsOn` — why** | **PARTIAL** | `CONTEXT.md` gloss only | Rationale absent — item P3 below |
| 40 | `doc:` relation targets = named deferral (MD-16) | CARRIED | stable-ids spec, MD-16 spec | |
| 41 | `satisfies` derived, anchored; old `satisfiedBy` inversion note | CARRIED / DROPPED | current semantics carried; migration history → git | |
| 42 | Claims never merged into declared relations | CARRIED | `specs/validation/claim-separation.sdp.md` | |
| 43 | Blocking `openQuestions` blocks `defined`+ (MD-9) | CARRIED | `src/model/sections.ts:28-31`, readiness-floor `defined` clause | |

## 2. `03 — The One Graph` → the `spec:extraction.*` family

| Unit | Class | Carried by | Notes |
| --- | --- | --- | --- |
| Graph = projection of repo at a commit, never a second source | CARRIED | `specs/extraction/derive-graph.sdp.md`, `docs/concept/01` | |
| Two-pure-steps pipeline (`graph = f(repo)`, `output = f(graph)`) | CARRIED | derive-graph + `specs/extraction/build-pipeline.sdp.md`, `docs/concept/06` §1 | |
| Discovery by suffix, exclusion rules | CARRIED | `src/extract/discover.ts`, `specs/extraction/excludes.sdp.md`, MD-15 spec | |
| Anchor = identity + label + one target, no intent | CARRIED | `specs/model/anchors.sdp.md` — substantially deepened | |
| Inferred layer designed-in, empty in MVP; first producer = impact graph | CARRIED | derive-graph rule 5, `specs/consumers/impact-graph.sdp.md` (idea) | |
| Flat graph: arrays only, hierarchy via edges | CARRIED | derive-graph rule 2 | Rationale prose dropped — cosmetic |
| JSON sketch, schema `0.4.0` shapes | CARRIED | `src/graph/schema.ts` (code is the carrier) | |
| `nodeType` vs `specKind` split | CARRIED | `CONTEXT.md:105`, schema.ts | |
| Prose fields on singular owners; fixed key order | CARRIED | `specs/carrier/prose-ownership-rule.sdp.md`, `src/extract/serialize.ts` | |
| Consolidated edge-contract table | DROPPED-DELIBERATE | rows dissolved across relations / derive-graph / referential-integrity / readiness-floor / verification-linkage / pack specs | Every row's law verified individually carried; only the single-table *presentation* is gone |
| `decidedBy` `doc:` target = named deferral | CARRIED | `specs/decisions/carried-evidence.sdp.md` | |
| Delivery facts computed from edges, never propagated up `refines` | CARRIED | derive-graph rules 3–4, claim-taxonomy spec | |
| Determinism: byte-identical, sort orders, no timestamps | CARRIED | `specs/extraction/determinism.sdp.md` (measurable, sha256) | |
| `--check-clean` = independent rebuild self-comparison | CARRIED | determinism rule 2, `docs/concept/07` | |
| Two-tier non-static handling; MD all-or-nothing asymmetry | CARRIED | determinism rule 3, `docs/concept/04` §1 | |
| Claim table + authority; inferred never authoritative | CARRIED | claim-taxonomy spec, `CONTEXT.md`, `docs/concept/01` P3 | |
| Claim inheritance, no 4th claim | CARRIED | claim-taxonomy spec ("derivation is a mechanism, not a fourth claim") | |
| Ambiguity is loud (L2) | CARRIED | `docs/concept/01`, duplicate-ids + claim-separation specs | |
| `observed` aspirational; run results not ingested | CARRIED | spec-sections spec, `specs/observation/` | |
| `generated/` disposable; delete-and-rebuild same bytes | CARRIED | `specs/extraction/regenerability.sdp.md` rules 1–2 | |
| No-second-store (R2) with source-location carve-out | CARRIED | regenerability rule 2 (exact carve-out preserved) | |
| Graph DB deferred until measured pain | CARRIED | regenerability rules 3–5 — strengthened with thresholds | |
| Git is event log (all four bullets) | CARRIED | `docs/concept/01` near-verbatim | |
| **Graph diff = two projections** (`graph(A)` vs `graph(B)`) | **PARTIAL** | parts implied by determinism + 01; MVP impact is file-level | Item P4 below |
| Schema versioning: self-described; SemVer deferred; additive growth | CARRIED | `specs/extraction/schema-versioning.sdp.md` (all four clauses) | |

## 3. `05 — Validation & Honesty` → the `spec:validation.*` family

| # | Unit | Class | Carried by | Notes |
| --- | --- | --- | --- | --- |
| 1 | Framing; "checked, never workflow-gated"; both honesty guardrails | CARRIED | `CONTEXT.md` (verbatim), MD-1 spec, two-check-families spec | |
| 2 | Two check families with example lists | CARRIED | `specs/validation/two-check-families.sdp.md` + `.split-report` child | Sharpened beyond the doc |
| 3 | Error-fails-build vs gap-informs; `validator`/`gap`/`orphan` nouns | CARRIED | two-check-families rule 2, warn-level-signals spec, `CONTEXT.md` | |
| 4 | Layered-by-mechanism table; P7 | CARRIED | two-check-families rule 3, `docs/concept/07` (aspirational layers), `01` P7 | |
| 5 | One validation path (MD-14); phantom evaluated-form argument | CARRIED | MD-14 spec (rationale survives explicitly) | |
| 6 | Referential integrity + "did you mean" | CARRIED | referential-integrity spec + children | Sharpened: suggestion silent on two-candidate tie |
| 7 | Duplicate IDs, never auto-merged | CARRIED | duplicate-ids spec + `.dual-carrier` | Redesigned stronger: extraction-time exclusion |
| 8 | Claim separation; kind-typed edge-endpoint contracts | CARRIED | claim-separation spec + relations spec + `src/validate/validators.ts` | |
| 9 | `verifies` linkage; wrong-kind verifier confers nothing | CARRIED | verification-linkage spec + children | Extended with oracle traces |
| 10 | Authoring-shape honesty | CARRIED | authored-honesty spec + `.section-authored-fact` | |
| 11 | Derived-facts honesty; faked fact never silences gap check | CARRIED | authored-honesty (+ `.unearned-stated-fact`), warn-level-signals rule 2 | |
| 12 | Honest readiness against floor | CARRIED | readiness-floor spec + children | |
| 13 | Orphans + ready-gap as warnings; severity override deferred | CARRIED | warn-level-signals spec + children (deferral restated) | |
| 14 | Cross-cutting L2 / L3 | CARRIED | `docs/concept/01` (L2, L3 survive) | L3 has no dedicated validation Spec; principle doc is the carrier |
| 15 | Kind-blind floor clause table; cumulative; floor-not-quota | CARRIED | readiness-floor spec — clause-for-clause match | |
| 16 | Per-kind evidence table (all 7 rows incl. contract interim) | CARRIED | kind-evidence spec — row-for-row match | |
| 17 | Three table laws (monotonic, promotion-neutral, honest convergence) | CARRIED | kind-evidence + MD-12 + MD-16 specs | |
| 18 | MD-13 floor-table-as-truth | CARRIED | readiness-floor spec + `src/validate/readiness-floor.ts` | |
| 19 | `ready` ≠ delivery fact; no approval fact; signed git tag | CARRIED | readiness-floor, `specs/consumers/design-review.sdp.md`, `CONTEXT.md` | |
| 20 | Stated vs derived readiness; one-directional divergence banner | CARRIED | readiness-floor + `specs/consumers/derived-readiness-banner.sdp.md` + children | |
| 21 | **Pack coherence — no duplicated-intent check (negative ruling)** | **PARTIAL** | pack-coherence + pack-aggregate specs carry the checks and posture | Named rejection absent — item P5 below |
| 22 | Validator self-testing fixtures | CARRIED | `specs/validation/validator-self-testing.sdp.md` — strengthened | |
| 23 | Aspirational tiers (`observed`, `--lenient`, caching, custom rules) | CARRIED | `docs/concept/07`, `specs/observation/runtime-overlay.sdp.md` | |
| 24 | "What CI guarantees at MVP" recap | DROPPED-DELIBERATE | — | Pure summary; every guarantee individually carried |
| 25 | Historical asides (pre-MD-12 failure; verb note) | DROPPED-DELIBERATE | git; "stated, never claimed" survives in `CONTEXT.md` | |

## 4. DECISIONS.md diary bodies → `specs/decisions/*.sdp.md`

Recovery: `3bcfa45^` (full 553-line diary), plus `2e9d5a6^` and `b471189^`. MD-22/23/24 and the
D3/D5/D6 / plain-language / concept-dissolve decisions were born as Specs — no diary ever existed.

| MD-n | Name | Class | Carried by |
| --- | --- | --- | --- |
| MD-1 | executable meta-model | **PARTIAL** (minor) | MD-1 spec + guardrails verbatim in `AGENTS.md`/`CONTEXT.md`; the 2026-07-11 gloss refinement missing — item P6 below |
| MD-2 | adopt the nouns, reject the gates | CARRIED | `adopt-the-nouns.sdp.md` (both term tests compressed into consequence) |
| MD-4 | one primitive, named coordinates | CARRIED | `one-primitive.sdp.md` (combinatorial-explosion rationale carried) |
| MD-5 | protocol naming | CARRIED | `protocol-naming.sdp.md` (the "surgical split" survives) |
| MD-7 | binding, never liveness | CARRIED | `binding-not-liveness.sdp.md` + `src/model/anchors.ts` comments (all 3 points + both rejected remedies) |
| MD-8 | generic `codeAnchor` | CARRIED | `src/model/anchors.ts:6-14` doc-comment — the fold target the diary itself named |
| MD-9 | open-questions home | CARRIED | `src/model/sections.ts` + readiness-floor `defined` clause |
| MD-10 | content-only sections | CARRIED | `content-only-sections.sdp.md` (incl. double-linkage rationale) |
| MD-11 | typing law | CARRIED | `typing-law.sdp.md` + `CONTEXT.md:241` (rejected `decision.status` vocabulary in the ledger) |
| MD-12 | kind-conditional floor | CARRIED | MD-12 spec + kind-evidence spec (contract-row repoint trigger survives at line 23) |
| MD-13 | floor-table-as-truth | CARRIED | readiness-floor spec ("never a second floor") + `src/validate/readiness-floor.ts` header |
| MD-14 | one validation path | CARRIED | MD-14 spec — phantom-validation rationale survives explicitly |
| MD-15 | `.sdp.ts` extension | CARRIED | MD-15 spec (ruling + re-point) |
| MD-16 | carried evidence | CARRIED | MD-16 spec (all 3 points + rejected readiness-gate) |
| MD-17 | point-per-example | CARRIED | MD-17 spec (both rejected alternatives; gen-1 corpus figures → git) |
| MD-18 | carrier ruling | CARRIED | MD-18 spec (all three rejected paths in the rationale) |
| MD-19 | prose-ownership law | CARRIED | MD-19 spec (both rejected homes + refuse-loudly) |
| MD-20 | consumer-exclusion contract | CARRIED | MD-20 spec + `spec:extraction.excludes` |
| MD-21 | envelope-grammar posture | CARRIED | MD-21 spec + `package.json` (`"yaml": "2.9.0"` exact pin realized in code) |

Auxiliary blocks: preamble decoder, R-series change-log, scope note — DROPPED-DELIBERATE (substance
verified live elsewhere). D1–D6 shorthand — CARRIED (lean table; D3/D5/D6 have their own Specs).
Measured-evidence table — PARTIAL (item P7 below).

---

## The seven review items (all PARTIAL; no lost laws)

| # | Missing substance | Was in | Suggested home |
| --- | --- | --- | --- |
| P1 | The one-kind authoring rule's second half: _"if a fact straddles kinds, model it as two specs with a relation between them"_ — enum enforces single-kind structurally, but the split guidance is nowhere (zero grep hits) | 02 §2 | `spec:model.core-model` narrative, or the `sdp-authoring` skill |
| P2 | The affirmative permission: _a child spec can be born at a higher readiness than its parent_ (e.g. a low-altitude example inside an already-`ready` feature) — the floor bound survives, the permission doesn't | 02 §2 | `spec:validation.readiness-floor` narrative or `CONTEXT.md` |
| P3 | Why `constrainedBy` / `decidedBy` stay distinct from generic `dependsOn`: _"high-value, separately-queryable intents a generic dependency edge would flatten"_ | 02 §6 | `spec:model.relations` rationale |
| P4 | The consequence statement: _comparing two commits is comparing two graphs — `graph(A)` vs `graph(B)` → added/removed/changed nodes and edges, change-impact without a second store_ — constituent parts survive, the framing doesn't | 03 §5 | `spec:consumers.impact-graph` (currently `idea`) when it matures |
| P5 | The named negative ruling: _there is **no** duplicated-intent check on Packs_ (a Pack states no truth, so there is nothing to duplicate; semantic duplication is human/agent judgment) + its motivation (large coherent groups of low-detail specs without the build demanding implementation) — now only inferable | 05 §4 | `spec:validation.pack-coherence` or `spec:model.pack-aggregate` |
| P6 | MD-1's 2026-07-11 gloss refinement: _gen-1's disease was dual-source binding invisible to the type system, not executable specs; executability returns as a recovered surface_ — the rationale that makes MD-18's DSL retirement and the oracle work intelligible; today only hinted by "dual-source truth path" in the carrier-ruling spec | DECISIONS diary | `spec:decisions.executable-meta-model` rationale (borderline DROPPED-DELIBERATE — full text lives in plan 12 §8) |
| P7 | The curated-graph selectivity measurement (single-digit-to-~25%) backing the still-asserted, now figure-free claim at `docs/concept/06:61` ("a deliberately small curated selection") | DECISIONS measured-evidence table | either restore the figure to `06` or soften the claim; the other dropped figure (~⅕ tokens) is superseded by the fresh 73.1%/38.0% measurements |
