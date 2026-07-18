# Plan 18 brief — Self-hosting phase 2: the carrier flip · the decision fold · corpus growth

> **Status: 🧭 BRIEF — planning input, not an execution plan.** This is the owner's commissioning
> brief for the phase-2 detailed implementation plan, to be authored by oh-my-openagent's
> Prometheus planning agent. The detailed plan lands as `plans/18-self-hosting-phase-2.md`; this
> brief then stands as its recorded input. Until that plan is DRAFTED, the latest settled ground
> remains plan 17 (`plans/17-self-hosting-v1.md`, ✅ EXECUTED). Work happens on the effort branch
> `feature/protocol-self-application-phase-2` — never on `main`.
>
> **Mandate.** The owner's phase-2 decision at Gate 4 (plan 17 §6) scheduled the `sdp import`
> emitter, the checkout-v1 migration, and the canonical-default flip as **one phase-2 effort**,
> including the like-for-like parser-hardening baseline, with the table-sugar ruling expected to
> fire under it. This brief confirms that mandate and extends the same plan to two further
> tranches: the **decision-spec fold** and the next **corpus-expansion** wave. These are items
> 1–3 of the "What remains for full self-hosting" enumeration in the **merged phase-1 PR
> description** — cited by source because that list lives in no plan file; this brief (§3, §8)
> is now its durable record. Items 4 (the systematic tests-to-executable-specs rewrite) and 5
> (per-doc concept deletion) stay later work.

## 1. The goal in one paragraph

Phase 1 made the Protocol's own delivery model a first-class citizen of its own machinery — 15
Markdown-canonical specs, one pack, an executable tracer, the full repository gate. But the repo
still runs a **three-state carrier world** (Markdown-canonical new IDs · TS-canonical pre-existing
IDs · the TS checkout example), the decision diary still carries sixteen durable rulings as prose
with a divergent reserved namespace, and most of the concept corpus (`docs/concept/00–07`) still
holds semantic contract no spec carries. Phase 2 collapses the carrier world to one rule
(Markdown canonical by default, the TS DSL surviving as import source and per-ID option), folds
every durable decision into a `decision`-kind spec under a strict durability rubric, and grows
the corpus one subsystem at a time so concept-doc content starts living as typed, anchored,
checkable Specs. The flip is the precondition for the rest: the corpus cannot absorb the concept
docs while three carrier states coexist.

## 2. Settled ground the plan builds on (read, don't re-derive)

- **The carrier ruling (MD-18)**, transition clause as amended by plan 17: new spec IDs may be
  born Markdown-canonical; pre-existing IDs and checkout-v1 stay TS-canonical **until the ruled
  flip** — the product parser (landed), `sdp import` (not started), and the checkout-v1 migration
  (not started). Surviving law: **one canonical surface per ID, no mixing**. The interim records
  are pinned by `check-carrier-interim.mjs` and stated in `AGENTS.md`, `CONTEXT.md`, and
  DECISIONS MD-18 — all three must move together again at the flip (the operative-record gate
  pattern, plan 17).
- **The product Markdown parser** — corpus-scoped by design; the parser specs pin an explicit
  **non-claim** of full refusal parity with the TS carrier. Gate 4 names discharging this (the
  like-for-like parser-hardening baseline / C2-parity obligation) as part of the phase-2 effort.
- **The self-hosting corpus**: 15 specs under `specs/` (carrier ×5, extraction ×3, validation ×3,
  model ×1, protocol ×1, decisions ×2) plus `pack:self-hosting-v1`
  (`specs/self-hosting.pack.sdp.ts` — the pack manifest lawfully stays TS, the
  one-canonical-surface law being per-ID). `spec:carrier.sdp-import` is honestly authored at
  `idea` and is tranche 1's spec to enrich in place.
- **The fold seed**: the ratified-name registry (`docs/concept/DECISIONS.md` top) marks 16 rows
  **durable** with reserved future IDs under `spec:protocol.decisions.*`; the two born decision
  specs use `spec:decisions.*`. That namespace divergence is recorded (plan 17 §6, back-catalog
  notes) and deliberately deferred **to this fold**. Rows marked *folded/folds* (MD-8, MD-9,
  MD-13) already have carrying surfaces (doc-comments, `sections.ts`, the floor table) — verify,
  don't re-fold.
- **Open watch items** (rule only under fire, each ruling recorded): table-sugar syntax ·
  the single-literal vocabulary form · the multi-entry constraint form · the array-section prose
  sub-owner · Markdown `Pack` syntax. Gate 4 expects table sugar to fire in this phase — an
  expectation on the record, **never a quota**: the sugar's semantics are already ruled
  (point-per-example (MD-17): a table statically expands to N sibling examples), only the
  Markdown syntax is unruled, and checkout today models multi-case as sibling `example` specs
  without tables. If the grammar matrix never forces it, the watch item survives unfired
  (acceptance 6).
- **Deferred-debt tail**: plan 17 §6's review-06 reconciliation rows marked
  `pre-existing/phase-2` or `deferred` (exclude UX diagnostics, Design Review escaping policy,
  stale provenance wording, grammar-hardening polish, …). The plan must sweep this tail and
  adopt the rows that naturally ride these tranches; the rest carry forward in the docket, never
  silently drop.

## 3. Scope — three tranches, one plan

### Tranche 1 — end the interim carrier rule (the flip)

Discharge the carrier ruling's transition clause completely. **Ruled order (§6): emitter →
checkout migration → hardening baseline → flip** — grammar growth is forced by the migration,
parity is paid once against the settled grammar, and the default never points at a surface that
has not earned its hardening claim:

1. **The `sdp import` emitter — a durable product verb (§6), never a migration script.**
   Reified TS carrier → authored `.sdp.md`, honoring the ruled
   grammar (envelope subset, heading → section map, `gwt`/`gwt-vocabulary` fences, prose
   ownership). Enrich `spec:carrier.sdp-import` from `idea` upward only as the floor honestly
   clears. Fidelity is proven by **round-trip graph equality**: import a TS spec, extract the
   emitted Markdown, and compare graphs modulo explicitly ruled deltas (any delta is itself a
   ruling to record, never a shrug). **Three bindings pinned here:** (a) the ratified glossary
   already defines `sdp import` as *the one-way gen-1 `.feature` converter* (`CONTEXT.md`, the
   executable half) — reusing the name for the TS→MD emitter is a **load-bearing glossary
   amendment made on the record** (the natural reconciliation: one import verb, many source
   adapters, sharing the glossary's own "document emitter authored once in the winning
   carrier"; a distinct verb is the recorded alternative), never a silent CLI add-on — and the
   phase-2 adapter inventory is **TS-only**, the gen-1 `.feature` source staying designed-in
   and deferred on the record, never silently abandoned; (b) the round-trip **delta catalog is
   pre-declared** in the plan (at minimum: the `file` path suffix `.sdp.ts`→`.sdp.md`; physical
   envelope differences; TS source comments, which are not graph content; delivery facts
   compared under the same anchor set) — equality is never redefined mid-flight; (c) fidelity
   is **two-layered** — graph equality is the semantic gate only; the plan also sets an
   authoring-surface bar (emitted Markdown idiomatic under the ruled grammar and the
   prose-ownership law, judged at Design Review with fixture evidence), so round-trip green
   never blesses unreadable Markdown no agent could have authored. One honesty note: the
   per-ID option today is realized purely by *which file exists* (both surfaces for one ID =
   the duplicate finding); the flip invents **no** canonical-surface config unless the plan
   rules one as an explicit deliverable — and whichever way it rules, `04` §1's stronger
   standing claim ("a per-ID canonical-surface config decides which surface is canonical; the
   other is a generated read-only view") is reconciled on the record (repaired to aspirational
   wording, or the minimal mechanism ships) rather than left contradicting the file-existence
   realization.
2. **The checkout-v1 migration.** Every checkout spec ID moves to `.sdp.md` via the emitter; the
   TS spec carriers for migrated IDs are deleted **in the same change** — no mixed interval on
   the branch history that `npm run check` ever blesses. The example's README walkthrough is
   rewritten for the Markdown surface. Determinism stays regenerate-and-compare
   (`--check-clean`), never committed goldens.
3. **The parser-hardening baseline.** Convert the pinned non-claim into either (a) a
   like-for-like refusal-parity claim with pinned evidence, or (b) a revised, explicitly scoped
   non-claim recorded on the parser specs — never a silent lapse; the plan **defines the
   evidence bar** (parity measured against the TS reifier's refusal behavior as a bounded
   matrix — never open-ended "hardened"). The checkout corpus is the forcing function for
   grammar growth: the plan inventories a **checkout grammar matrix** (kind × section ×
   phase-1 support, against the real `examples/checkout-v1` tree — 11 specs across all eight
   kinds) *before* scheduling any syntax ruling; whatever the matrix forces beyond the phase-1
   subset gets ruled under fire and recorded, per the phase-1 discipline. The review-06
   grammar-polish cluster rides this baseline (§6 debt intake).
4. **The canonical-default flip — the tranche's capstone.** The default authoring carrier
   becomes Markdown for all IDs; the TS DSL is **not retired** — it survives exactly as the
   carrier ruling says, import source + per-ID option (the `.sdp.ts` extension law (MD-15)
   already re-points to the `.sdp.md` sibling; check its wording again post-flip). The
   post-flip operative sentence is honest about every residue: *Specs default to Markdown;
   Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a
   lawful per-ID option.* The flip is
   an **operative-record gate** mirroring phase 1's: DECISIONS MD-18's Decision text, the
   `CONTEXT.md` resolved entries (the carrier row **and the amended `sdp import` term**), and
   `AGENTS.md` land in one commit or a tight series with no intermediate green claim
   contradicting them; the pinned consistency scripts (`check-carrier-interim.mjs`, plus the
   interim/Gate-4 strings in `check-carrier-truth.mjs` and `check-self-hosting-gates.mjs`) are
   **replaced by post-flip truth pins or retired** in the same series — the machine check that
   records and law agree survives the flip; a **post-flip anti-misleading pass** repairs every
   remaining interim-rule claim, its inventory seeded from `check-carrier-truth.mjs`'s audit
   map (concept docs `00`/`04`/`07`/README, JTBD stories, the example README, MD-15's wording,
   package docs).

### Tranche 2 — the decision-spec fold

Every **durable** row of the ratified-name registry becomes a `decision`-kind spec;
`docs/concept/DECISIONS.md` shrinks to a **lean registry of pointers** (name · one-line gloss ·
spec pointer · the folded/CONTEXT-only dispositions). The fold is governed by the routing rubric
in §4 — it is a *distillation*, never a diary transplant:

- **The namespace is ruled — `spec:decisions.*`** (§6). The fold's first act amends the
  registry's "Future spec id" column to match; the two born specs keep their IDs and every
  existing reference stands.
- **Relation shape (§6):** each fold decision `refines` the most-specific subsystem spec it
  rules (fallback: `spec:protocol.self-hosting` for genuinely phase-level decisions); specs a
  decision shapes author `decidedBy` back-edges. The fold therefore runs **after** tranche 3's
  parent-creating waves (execution order 1 → 3 → 2).
- **Per-row disposition, recorded in a fold ledger** (a plan process record, not graph content):
  each of the 16 durable rows plus the legacy structural shorthand (D1–D6) and the
  measured-evidence section gets exactly one disposition — `decision spec` · `CONTEXT.md only`
  (pure terminology) · `ordinary spec` (design intent, not a ruling) · `carried by code/tests —
  verify the surface` · `retired (git is the archive)`. The *folds* rows (MD-9, MD-13) are
  verified, not re-authored.
- **The diary bodies retire once carried.** Git history is the archive of record; the plan
  decides whether any body text moves to `reviews/`-style archive or is simply deleted with the
  lean registry pointing at specs. What never dissolves: `CONTEXT.md` as the ratified glossary,
  the lean registry itself, `plans/` as the process record.
- **Not architecture-only.** The `decision` kind covers any durable delivery ruling — naming,
  posture, dependency pins, process laws (the plain-language-references decision is the
  template) — not merely architectural shape.

### Tranche 3 — corpus expansion, one subsystem at a time

Grow `pack:self-hosting-v1` beyond the 15 so concept-doc semantic contract is progressively
carried by typed, anchored Specs — the dissolution decision
(`spec:decisions.concept-docs-dissolve`) names the criterion; deletion stays out of scope.

- **All four subsystem waves ride phase 2 (§6)**, sequential and owner-gated (one subsystem at
  a time as working pace, never as phase scope): the core model (`02`) → `model`/`behavior`/
  `rule` specs for the primitive, the three descriptors, sections, and relations · validation
  (`05`) → `rule`-kind specs over the validator registry (11 check ids today) — a **pressure
  target, never a count KPI**: bundling is lawful where one law spans several mechanical
  checks (the anti-filler rule wins; acceptance 4's disposition-over-count spirit), floor
  clauses as evidence · consumers (`06`)
  → reader and projection specs · extraction and the one graph (`03`) → deepening the phase-1
  seeds. The fold's refine-target minimum (core model · validation · a consumers parent) rides
  the earliest waves so tranche 2 is never blocked.
- **Anchored to the real engine.** Precise anchors on existing entrypoints keep `implemented`
  derived and honest; readiness is stated only where the floor genuinely clears; a kind is
  authored only where real content forces it (thin filler specs are a defect).
- **Coverage trail.** Each new spec names, in the plan's coverage ledger (process record, never
  graph content), which concept-doc sections' contract it carries — building the per-doc
  deletion trail the dissolution decision will later check at a Design Review.
- **Executable where cheap.** The duplicate-IDs tracer is the template; where a behavior's
  verify loop is genuinely cheap, the spec may earn `has-verifier` via `gwt-vocabulary` →
  `example` child → generated contract → `bindExample` test with a test anchor. The
  *systematic* tests-to-executable-specs rewrite remains out of scope.

## 4. The content-routing rubric (binding authoring guidance for every tranche)

The owner's hard constraint for this phase: **a decision spec carries only durable law — content
that is very expensive to change — and zero procedural or execution context.** This is authoring
discipline enforced at review gates; it is **never a validator** (checks police conformance and
honesty, never content-quality — the permanent guardrail stands).

| Content | Home |
|---|---|
| A durable ruling itself: the law, non-obvious rejected alternatives, non-obvious consequences | `decision`-kind spec |
| A ruling that is *only* terminology (a term, its definition, its avoid-list) | `CONTEXT.md` (the ratified glossary) — no decision spec |
| Design intent not yet implemented | ordinary `Spec` of the honest kind and readiness |
| Behavior already implemented and worth verifying | spec + precise anchors; the executable loop (contract + bound test) where the loop is cheap |
| Procedural/execution context: dates, commit SHAs, session/slice/todo numbers, status stamps, review provenance, "landed at …" | **never in a spec** — git history and the plan done-records already carry it |

Litmus tests for the fold author:

1. **The rewrite test** — would the sentence still be true and load-bearing if the repo were
   re-implemented from scratch tomorrow under the same design? If not, it is execution context.
2. **The three-part test** (already ratified in the registry): hard to reverse · surprising
   without context · a real trade-off. All three, or it is not a decision spec.
3. **Leanness** — the decision slots (context · decision · rationale · consequence) run 1–3
   sentences each unless rejected alternatives or consequences genuinely earn more (plan 17's
   standing style directive). The two born decision specs are the size template.
4. **Current law only** — a decision spec states the law as it stands; amendment history lives
   in git, not in the spec body.
5. **Plain language leads** — meaning first, codes parenthetical and only where cross-referencing
   needs them (the plain-language references decision).

**Decisions in flight** (the pending-decision pattern — already ruled by the open-questions home
(MD-9) and the typing law (MD-11); this clause applies it, never re-decides it): a durable
question not yet ruled becomes a `decision`-kind spec at honest low readiness — raised →
explored → written → ratified is the decision-kind gloss on `idea → scoped → defined → ready` —
with the unresolved branch as a blocking entry in `intent.openQuestions`; the floor makes a
blocking question and stated `defined` mutually exclusive, so "pending" is machine-enforced,
never a label. A question not yet durable stays a plan record. A partially ruled decision splits
by refinement when the settled core must be consumable now: parent at `defined`+ carrying the
ruled law, a child at `idea`/`scoped` (`refines` parent) carrying the open branch. Replacement is
always the `supersedes` relation — "superseded" is a graph query, never an authored status — and
**no status vocabulary, ever** (`decision.status` is rejected vocabulary; ADR status frontmatter
must not leak in). Rejected paths are not truth-specs; they live in the winning decision's
alternatives/consequences.

External soft guidance (calibration, not authority — the repo's own ratified rules win on any
conflict): `~/.agents/skills/grill-with-docs/ADR-FORMAT.md` (the minimal-ADR shape and the
what-qualifies list — read broadly, **not** limited to architectural decisions) and
`~/.agents/skills/grill-with-docs/CONTEXT-FORMAT.md` (tight, opinionated glossary entries).

## 5. Constraints and invariants that bind the plan

- **One canonical surface per ID, no mixing** — the carrier ruling's surviving law; the
  migration must never leave a blessed commit with a dual-authored ID.
- **Checks police conformance and honesty, never content-quality and never workflow**; and we
  claim "deterministically validated," never "provably correct."
- **Delivery facts are derived, never authored**; the claim taxonomy is never collapsed;
  readiness is stated only where the floor clears — the corpus stays floor-honest at every
  intermediate commit the gate blesses.
- **Intended truth vs realization**: a disagreement found during the fold or expansion is drift
  to resolve deliberately — never silent promotion of code behavior into intent.
- **The dual-authority window has a precedence rule**: while concept docs still restate laws
  the fold has carried into decision specs, the specs are authoritative for settled law and
  concept prose is exposition — a conflict is drift repaired toward the specs (or the prose
  marked expository), never resolved by silently promoting code behavior into either surface.
  The dissolution decision governs when the prose side may shrink.
- **Ratified terminology end-to-end** — the effort is *self-hosting* (never "dogfooding"); new
  terms are flagged, not silently invented.
- **Tracer-bullet discipline** — if a migrated or newly authored spec cannot be expressed
  cleanly, fix the carrier or the emitter, never the spec.
- **Rulings under fire are recorded when made** — in the plan's running log and the corpus
  specs; only rulings passing the three-part test also enter the lean registry.
- **Git hygiene** — no `git stash`; commit early on the effort branch; commit/push only when the
  owner asks.

## 6. Owner rulings — the open questions, grilled and resolved (2026-07-18)

These began as open questions; a grill session with the owner resolved all eight before
Prometheus planning. The detailed plan inherits them as **settled input** — re-litigating any of
them requires an explicit owner gate. Rulings that pass the three-part test enter the fold as
decision specs when their tranche lands; until then this brief is their record.

1. **The decision-spec namespace** — **RESOLVED (owner, this brief): `spec:decisions.*`.** The
   born form is ratified: two segments like every corpus spec, the `specs/decisions/` subdir
   mirrors the domain layout, and the reserved three-segment form would collide with the
   dotted-lineage convention (`spec:validation.duplicate-ids.dual-carrier` = child). The
   registry's "Future spec id" column is amended at fold start; no re-ID, no reference churn.
2. **`sdp import`'s standing** — **RESOLVED (owner, this brief): durable product verb.**
   `sdp import` joins the CLI surface permanently — TS carrier → `.sdp.md`, refusal-honest like
   the parser (findings, never throws). Grounded in the carrier ruling's own wording (the TS DSL
   is an "import source + per-ID option" — a standing role implies a standing surface); the
   second-caller bar is met by ratified implication (the checkout migration now; every future
   per-ID TS→MD flip after). `spec:carrier.sdp-import` may mature toward `ready` with a real
   verifier as the floor honestly clears.
3. **Sequencing inside tranche 1** — **RESOLVED (owner, this brief): emitter → migration →
   hardening → flip.** The checkout migration runs on the corpus-scoped parser and forces
   grammar growth under fire (table sugar expected); the parity baseline lands against the
   *settled* post-migration grammar (never paid twice); the canonical-default flip and its
   operative-record gate close the tranche — the default never points at a surface that has not
   earned its hardening claim.
4. **The pack question** — **RESOLVED (owner, this brief): the watch item stands.** Both pack
   manifests lawfully remain `.pack.sdp.ts` — the one-canonical-surface law is per-ID and the
   `Pack` is not a kind, so the carrier ruling ("Markdown, all eight kinds") never covered it.
   Markdown pack syntax is ruled only when a real need forces it; the
   TS-toolchain-for-pack-authoring wart is named in the docket, not speculatively fixed.
5. **Fold relation targets** — **RESOLVED (owner, this brief): refine the ruled domain; the
   corpus wave precedes the fold.** Each fold decision `refines` the most-specific subsystem
   spec it rules; specs it shapes author `decidedBy` back-edges; `spec:protocol.self-hosting`
   remains the fallback parent only for genuinely phase-level decisions. **Corollary — execution
   order is tranche 1 → tranche 3 (first wave) → tranche 2:** the subsystem parent specs must
   exist before the fold authors its refine targets. The order is a **targets-exist condition,
   never a full-tranche barrier** — the fold starts once the refine-target minimum (core model
   · validation · a consumers parent) exists, and remaining tranche-3 waves may continue
   alongside or after it. The two born specs may be re-pointed at the fold if a more specific
   parent then exists (a relation edit, not an ID change).
6. **The diary's residue** — **RESOLVED (owner, this brief), three parts.** (a) *Bodies*: once a
   durable row's law is distilled into its decision spec, the body leaves the working file —
   git history is the archive of record; the lean registry keeps name · one-line gloss · spec
   pointer. (b) *D1–D6*: honor the table's own KEEP note — D3 (Pack reified), D5 (the agent
   surface scripts the graph), and D6 (the MCP-deferred no) join the fold as decision specs;
   D1/D2/D4 are carried by tranche-3 subsystem specs; the table survives in the lean registry
   until the artifacts citing `(Dn)` dissolve. (c) *Measured evidence*: per-figure disposition
   in the fold ledger — each figure moves into the spec that carries its generalized claim as
   that spec lands in tranche 3; the section shrinks row-by-row and retires when empty.
7. **Tranche 3 sizing** — **RESOLVED (owner, this brief): all four subsystem waves ride
   phase 2** — the core model (`02`), extraction and the one graph (`03`), validation (`05`),
   and consumers (`06`). Waves run sequentially and owner-gated (one subsystem at a time as
   working pace, not as phase scope); OmO execution capacity is not the constraint (phase 1's
   four sessions landed in one). The fold's refine-target minimum (core model + validation +
   a consumers parent) rides the earliest waves so tranche 2 is never blocked. The phase-3
   remainder shrinks to the systematic tests-to-executable-specs rewrite and per-doc deletion.
8. **Post-flip debt intake** — **RESOLVED (owner, this brief): adopt by cluster.** The
   grammar-hardening cluster (YAML scalar spellings · line-number polish · the `...` closer ·
   cap-flood behavior · heading/GWT strictness · duplicate-`When` · reifier catch-all totality)
   rides the parity baseline; the exclude/CLI cluster (Windows absolutes · `--exclude --foo`
   diagnostics · matcher regression coverage · library-seam wording) rides tranche 1; the
   Design Review cluster (dynamic-key ordering · the escaping-outside-prose-slots policy) is
   ruled at migration/flip, when the TS-carrier question narrows; the records cluster (stale
   provenance wording · plan-16 evidence dispositions · the carrier-truth comment) rides the
   fold. Only the no-reparse spy seam and temporal token assembly stay deferred — polish with
   no phase-2 surface.

## 7. Acceptance criteria (the plan must make these checkable)

1. **The flip is total and recorded**: no TS-canonical **product spec ID** remains under the
   gate's blessed roots — pack manifests lawfully stay TS (§6), the dual-carrier **test
   fixtures** keep both surfaces by design, and the TS DSL itself is not retired (import source
   + per-ID option, per the carrier ruling); MD-18's transition clause is discharged across all
   operative surfaces in step; the pinned consistency scripts are retired/re-pointed; the
   anti-misleading pass leaves no active interim-rule claim.
2. **Round-trip fidelity is proven**: import → extract → graph equality for every migrated
   checkout ID under the **pre-declared delta catalog**, which lands in the done-record (never
   an ad-hoc test ignore); `npm run check` green on the full clean-clone sequence, plus the
   installed-package proof for any changed public surface. The authoring-surface fidelity bar
   is judged at the migration's Design Review — a second layer, never collapsed into graph
   equality.
3. **The hardening non-claim is resolved** — replaced by a parity claim with pinned evidence or
   an explicit, recorded, narrower non-claim — and the chosen claim text lands on the parser
   specs themselves (the phase-1 non-claim discipline).
4. **The fold is complete by disposition, not by count**: every registry row, D1–D6, and the
   measured-evidence section carries exactly one recorded disposition, the folded/folds rows
   verified with named evidence surfaces; every `decision`-kind spec passes the §4 rubric on
   review; `DECISIONS.md` is the lean registry; the namespace is uniform; no reference anywhere
   dangles.
5. **The corpus waves land honest — all four subsystems**: each new spec floor-clears its
   stated readiness, carries precise anchors where it claims realization, and appears in the
   coverage ledger with the concept-doc contract it carries; no readiness above floor, no
   filler kinds.
6. **Every fired watch item has a recorded ruling**; every unfired one survives as a named watch
   item — nothing silently resolves. Gate 4's table-sugar expectation is an expectation, never
   a quota: unfired means the plan records why the corpus never forced it.
7. **The docket ledger continues**: plan 17's deferred rows are carried forward or dispositioned;
   the adopted review-06 clusters (§6 debt intake) land with their carrying tranche; the phase
   closes with an owner-gated Design Review per session and a whole-phase gate.
8. **`sdp import` is a documented public surface**: the ratified-glossary amendment landed with
   the operative records; the CLI contract (arguments and output mode, finding IDs, exit codes,
   refusal-never-throw, help text) is pinned by tests; the installed-package smoke proof covers
   the new verb.

## 8. Out of scope (named, deliberately)

- **Per-doc concept deletion** (item 5) — gated by the dissolution decision, later phases.
- **The systematic tests-to-executable-specs rewrite** (item 4) — only opportunistic tracer-
  pattern instances ride this plan.
- **The editor-association gap** — owner-ruled: revisit after the flip.
- **Cosmetic concept-doc repair** beyond the post-flip anti-misleading pass.
- **New validator content-quality checks** — the rubric of §4 is review discipline, never a
  check.

## 9. Process expectations for the detailed plan

Mirror plan 17's proven shape: owner-gated progressive sessions, each closed by a Design Review
over the generated view; a docket ledger updated as sessions close (planned disposition ≠
execution state); rulings recorded when made with three-part-test dispositions; faithful RED
evidence before each behavioral step; clean-snapshot and clean-clone proofs for gate-affecting
changes; an archived adversarial code review with a verified remediation pass before the phase
closes. Distinguish PLAN-ONLY sections from execution throughout.

Beyond the shape, the plan must **pin what this brief deliberately leaves open**:

- the `sdp import` CLI contract — arguments and output mode, finding IDs, exit codes,
  refusal-never-throw, help text, and where its documentation lands; its **write semantics** —
  write-beside-source vs stdout vs dry-run, the deletion policy (whether import ever deletes
  `.sdp.ts`, or deletion is the migration's own step), multi-file atomicity (no green gate
  mid-series with a dual-authored ID), and import-local vs extract-time findings; and the
  **library seam** — whether a programmatic import surface joins the public barrel for agents;
- the emitter architecture — source adapters (phase 2: the TS reifier only —
  `reifyTypeScriptCarrier` over `ReifiedSpec`, `src/extract/reify.ts` + `carrier.ts`) feeding
  one document emitter in the winning carrier (the glossary's own design), strictly one-way,
  never a second validation path (the one-validation-path law, MD-14); the **authored-IR
  boundary** — the emitter consumes the reified authored form, never graph nodes (the graph is
  derived; prose ownership and heading structure are authored-side facts); and the module's
  **home** — import is a write path, so its boundary against `src/extract/` is ruled, not
  defaulted;
- the checkout grammar matrix (§3 tranche 1) — inventoried before any syntax ruling is
  scheduled **and before emitter design begins** (the emitter targets the post-gap grammar,
  never the phase-1 subset); seed cells are already visible: the parent `exampleSpace` on
  `spec:orders.create-order`, multi-relation envelopes, the frozen grammar's one-entry
  constraint form;
- the round-trip delta catalog and its comparison strategy (normalize `file`, or serialize
  without it);
- the **two-layer fidelity contract** — graph equality under the delta catalog as the semantic
  gate, plus the authoring-surface bar (idiomatic Markdown under the ruled grammar and prose
  ownership), judged at Design Review with fixture evidence;
- the **canonical-surface disposition** — either file-existence-only stands for phase 2 and
  `04` §1's config-plus-generated-view claim is repaired to aspirational wording, or a minimal
  mechanism ships as an explicit deliverable — ruled on the record either way;
- the consistency-script sweep — the exact pinned strings in `check-carrier-interim.mjs`,
  `check-carrier-truth.mjs`, and `check-self-hosting-gates.mjs`, each replaced by a post-flip
  truth pin where a standing docs-agree check is still needed, never lost by blanket
  retirement;
- the pack growth process — every new corpus ID enters `specs/self-hosting.pack.sdp.ts` in the
  same change, and the pack `framing` sheds its phase-1 wording;
- the fold-ledger and measured-evidence ledger templates;
- the **per-wave modeling policy** for tranche 3 — altitude policy, kind policy (when a
  validator is a `rule` vs a behavior detail; when a relation law is a decision vs a model
  fact), anchor density (which entrypoints earn `implemented`; no decorative anchors), the
  executable bar (only where the verify loop is cheap), and the coverage-ledger columns
  (concept path → spec id → readiness → anchor/verifier status) — the waves must produce a
  typed, impactable delivery model of the engine, never `docs/concept` in frontmatter form;
- the **hardening-matrix skeleton before session work starts** — the reference set is the TS
  reifier's refusal classes that matter for authored fidelity (never every `ts-morph`
  diagnostic), each class mapped to a same-class finding or an explicit named non-claim, with
  checkout-forced cells added as ruled;
- a concrete decision prompt for the Design Review escaping / dynamic-key debt at
  migration/flip — never "polish later";
- the session DAG with owner gates — one viable, non-binding shape: emitter surface → migration
  under fire → hardening → flip → corpus waves → fold → close, with the §6 debt clusters
  slotted per tranche — and **tranche 1's close is a hard phase-internal owner gate**: corpus
  waves start only after the flip's acceptance criteria (1–3, 8) are green, so expansion
  pressure never recreates the three-state carrier world;
- the adversarial code review scheduled before the whole-phase close (the phase-1 F-wave
  pattern).

## 10. Reading list for the planner

| Source | Why |
|---|---|
| `plans/17-self-hosting-v1.md` — §6 docket ledger, Gate 4 row, review-06 reconciliation, the §3 dispositions | the mandate, the deferred tail, the recorded divergences |
| `plans/16-carrier-ruling.md` | the carrier ruling's full text and scheduled-session docket |
| `docs/concept/DECISIONS.md` | the ratified-name registry (fold input) and every durable entry's body |
| `CONTEXT.md` | the ratified language; the resolved carrier entry that must move at the flip |
| `AGENTS.md` | the interim sentence and the check-chain description that must move at the flip |
| `specs/` + `specs/self-hosting.pack.sdp.ts` | the corpus as it stands; the two decision-spec templates; `spec:carrier.sdp-import` at `idea` |
| `examples/checkout-v1` | the migration target and its README walkthrough |
| `src/extract` · `src/cli` · `src/validate` · `src/model` | the emitter's seam, the exclude surface, the validators tranche 3 anchors onto |
| `reviews/06-self-hosting-phase-1-code-review.md` | the deferred-debt tail's provenance |
| `docs/concept/00–07` | the semantic contract tranche 3 progressively carries |
| `plans/17b-self-hosting-sessions-1-4.md` | the frozen grammar tables the migration must emit into |
| `check-carrier-interim.mjs` · `check-carrier-truth.mjs` · `check-self-hosting-gates.mjs` | the pinned strings the flip must rewrite or retire |
| `src/extract/reify.ts` + `carrier.ts` + `markdown*.ts` | the emitter's seams — `ReifiedSpec` (the authored IR), the TS reifier in, the ruled grammar out |
| `test/self-hosting-duplicate-ids.test.ts` + its fixtures | the dual-carrier fixture pair that lawfully survives the flip |
| `CONTEXT.md` — the executable half's `sdp import` row | the ratified gen-1 `.feature`-converter definition the emitter work must amend on the record |
| `plans/15a-carrier-f2-markdown-exhibits.md` | the F2 exhibit's table-sugar notes — relevant only if the grammar matrix forces the ruling |
| `~/.agents/skills/grill-with-docs/ADR-FORMAT.md` · `CONTEXT-FORMAT.md` | external soft guidance for §4 (repo rules win on conflict) |
