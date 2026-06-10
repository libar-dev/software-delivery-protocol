# Decision diary — Libar Software Delivery Protocol (meta-design)

> A why-focused log of hard-to-reverse decisions about **building the Protocol itself** — distinct from *in-system*
> decision records (a project's own `kind:"decision"` instances). Its job is to **recapture rationale** so choices
> stay visible and don't re-smooth into "false settledness." Entries are short and **status-tagged**
> (`ACCEPTED` / `PROPOSED` / `SUPERSEDED`). Companion to `docs/concept/ubiquitous-language.md` (the ratified
> glossary; the model exposition lives in `00`–`07`).
>
> **Decoding historical `base §n` references** (used by older entries below and the archived `reviews/`):
> the restructured base's old sections map to —
> §0 thesis · §1 meta-levels → `00` §2 · §2 primitive & boundary → `02` §1–§4 · §3 relations → `02` §6 ·
> §4 claims & the authored/derived split → `01` + `03` §3 · §4b delivery facts → `02` §2 ·
> §5 the one graph → `03` · §6 validation & honesty → `05` · §7 surfaces & projections → `06` ·
> §8 delivery-process execution → `06` §6.

## The ratified-name registry

The name is the primary handle; the ID is the breadcrumb. **In prose, lead with meaning — write "the
typing law (MD-11)," never bare "MD-n."** (Generalizes MD-8's own footnote.) *Curation* records each
entry's standing against the ADR three-part test (hard to reverse · surprising without context · a
real trade-off — see the working discipline in `AGENTS.md`); *durable* entries become `kind:"decision"`
specs at the post-Slice-1 fold, under the future spec id reserved here.

| ID | Ratified name | Curation | Future spec id |
|---|---|---|---|
| MD-1 | the executable meta-model | durable | `spec:protocol.decisions.executable-meta-model` |
| MD-2 | adopt the nouns, reject the gates | durable | `spec:protocol.decisions.adopt-the-nouns` |
| MD-4 | one primitive, named coordinates | durable | `spec:protocol.decisions.one-primitive` |
| MD-5 | the protocol naming | durable | `spec:protocol.decisions.protocol-naming` |
| MD-7 | binding, never liveness | durable | `spec:protocol.decisions.binding-not-liveness` |
| MD-8 | the generic `codeAnchor` | folds at Slice 2 → doc-comment on the `codeAnchor` builder | — |
| MD-9 | the open-questions home | folds at the fold (lives in `sections.ts`, the floor, `02` §3) | — |
| MD-10 | content-only sections | durable | `spec:protocol.decisions.content-only-sections` |
| MD-11 | the typing law | durable | `spec:protocol.decisions.typing-law` |
| MD-12 | the kind-conditional floor | durable | `spec:protocol.decisions.kind-conditional-floor` |
| MD-13 | floor-table-as-truth | folds (lives in `05` §3's Representation note + the `readiness-floor.ts` header) | — |
| MD-14 | one validation path | durable | `spec:protocol.decisions.one-validation-path` |
| MD-15 | the `.sdp.ts` extension | durable | `spec:protocol.decisions.sdp-ts-extension` |
| MD-16 | carried evidence | durable | `spec:protocol.decisions.carried-evidence` |

---

## 2026-06-06 — Session: reframe + language base

> **Retired entries (2026-06-07).** **MD-3** (three meta-levels; Phase 0 = the Protocol as code) is fully absorbed
> into `ubiquitous-language.md` §1 — conclusion *and* rationale — and was deleted. **MD-6** (Spec named;
> descriptor enums locked; bounded-context → projection) is canonical in the base ledger + §2; its one unique
> nugget — the **partial reversal of MD-4** — was folded into MD-4 below, and the entry deleted.

### MD-1 — The Protocol is an executable, self-validating software-delivery meta-model  [ACCEPTED]
**Decision.** We are building a *typed, executable meta-model of the software-delivery process*: teams author
delivery intent as **`Spec` instances** — the Protocol's one authored truth-primitive — and author only two
other non-truth constructs, **`Pack`** and **`anchor`**; the meta-model (code in the repo) deterministically
checks **conformance and honesty** and derives **one graph**; every other artifact is a **projection**.
The headline is an **executable, self-validating delivery protocol — not just executable specs.**
**Two permanent honesty guardrails** (these are what keep it from re-becoming the gating we rejected):
1. It defines the **conformance contract**, and its checks cover **conformance & honesty**, never
   **content-quality** (design goodness = human/agent judgment) and never **workflow** (no lifecycle gates —
   the lifecycle-FSM trap).
2. We claim **"deterministically validated,"** never **"provably correct."**
**Why / alternatives rejected.** "Executable specs" alone (BDD) is unremarkable; earlier delivery-process frameworks modeled the process only
*descriptively*; PM tools (Jira/Linear) have process *state* but no *meta-model*. The executable meta-model plus
conformance + honesty checks is the differentiator. Hard to reverse (everything builds on it); confirmed by the
user this session.

### MD-2 — Governing language rubric: adopt the nouns, reject the process state-machine  [ACCEPTED]
**Decision.** Use the established delivery **noun** for any concept the Protocol shares with the industry; coin/keep a
distinct word only for a real differentiator (and then it must *name the difference*). Reject process
**state-machine / lifecycle gating** vocabulary. Every term faces two tests: carries epistemic status where it
matters (authored vs derived), and is unambiguous to all three readers (typed code/CLI · coding agent · Studio
user).
**Why.** The system spans a **commercial** user-facing product (Libar Studio: Desktop/Web/CI-CD) *and* the
AI-native engine; users must not relearn delivery vocabulary. This **reverses** the prior brief's "not a PM tool /
don't adopt PM ladder names" stance (see scope note).

### MD-4 — One authored primitive; familiar delivery nouns are named coordinates  [ACCEPTED · refined & partially superseded — see note]
**Decision.** One **authored** primitive (enrich-in-place; never migrated to another artifact type), positioned by
**three descriptors**: **category of truth** (`kind`) is a *true subtype* (changes required detail + validation);
**altitude/size** and **maturity** are *positions*. Familiar nouns are **named coordinates, not separate authored
types**: Decision Record / Use Case / NFR / Contract / Model = `kind`; Epic / Feature / Story = altitude;
"Executable Spec" = an example-kind instance with a verifier. They are first-class in the **language and Studio
surfaces**, never separate authored truth-primitives.
**Why.** Preserves "one primitive" (the differentiation) while honoring "adopt the nouns" — and avoids the
combinatorial explosion of a subclass per (category × size × maturity) cell. Names deferred per method.
**Later (2026-06-06; absorbed from the since-removed MD-6).** The primitive is named **`Spec`**, and the three
descriptor enums are **locked in `ubiquitous-language.md`** (`kind` = 8 values; `altitude` = `epic → feature →
story`; `readiness` = `idea → scoped → defined → ready`, `ready` carrying a readiness floor). **Partial reversal
of the above:** a **bounded-context / domain** and a **`capability`** are **not altitudes** — `epic` is the
altitude ceiling; both are realized as **`Pack` groupings + a Capability Map projection**. Above-epic (initiative
/ theme) defers, additive later. `candidate` was dropped from readiness (an FSM-status imprint).

### MD-5 — "Software delivery protocol" adopted for the meta layer and the system name  [ACCEPTED 2026-06-07]
**Decision.** Name the meta layer a **software delivery protocol** — *"not any kind of protocol, it is software"*
(executable, a reference implementation that *is* the contract). Adopted at the **"name + meta-model noun"**
depth: "protocol" is both the **product name** (Libar Software Delivery Protocol; short form "the Protocol") and
the **noun for the meta-layer** (the meta-model *is* the conformance contract). The npm package is the single
**`@libar-dev/software-delivery-protocol`**; the CLI is **`sdp`**; the repo is `libar-dev/software-delivery-protocol`.
**Why.** A *protocol* is a **conformance contract, not a workflow** — precisely what MD-1 guardrail 1 states;
**more honest than "process,"** which carries the workflow connotation we reject. It distances the tool from
PM/ticket gating and reads cleanly alongside the commercial Studio. (External review — Gemini 3.1 Pro —
independently endorsed the framing for these reasons.)
**Resolved tensions.** "Protocol" can connote comms/wire formats, and "process" is the recognized industry noun
(MD-2 bias) — both are resolved by a **surgical split, not a blanket swap**: "process" is retained for the modeled
**software-delivery process** (the activity teams perform), for the rejected **process state-machine**, and for
**delivery-process execution**; only the meta-layer's own naming ("process meta-model" → "the protocol")
changed. This unparks the naming pass.

### MD-7 — Honesty-sharpenings from the Codex adversarial pass: liveness, impact coverage, `ready` semantics  [ACCEPTED 2026-06-07]
**Context.** An adversarial review (Codex) probed three trust signals: (1) `implemented` / `has-verifier` are
anchor-driven and assert no liveness — dead code or a skipped test can look done; (2) file-level blast-radius can
silently under-report; (3) `ready` is described as "reviewed" but the model records no review fact.
**Decision.** Resolve all three as **honesty clarifications consistent with already-settled decisions**, *not* via
the reviewer's heavier remedies:
1. **Delivery facts are binding/existence, never liveness.** Define an *enabled verifier* as a **structurally
   bound, resolvable test anchor** — skip / quarantine / glob-exclusion is CI's concern, *exactly as pass/fail
   is*; add "not reachable/live" to `implemented`; name the ladder `implemented → has-verifier → observed`, with
   **`observed`** (aspirational) as the liveness rung. *Rejected: renaming `implemented`→`has-anchor` — it guts
   the `implemented ∧ ¬ready` drift alarm, and the `claim`/`observed` ladder already answers the liveness ask.*
2. **File-level blast-radius reports its own coverage gaps.** An unanchored changed file is surfaced as an
   explicit *coverage-unknown* item, never silently dropped; the MVP never claims exhaustive reach (that is the
   deferred symbol-level impact graph). *Rejected: demoting blast-radius from the MVP — the honest-coverage
   signal preserves it.*
3. **`ready` = the structural floor + a human's `declared` statement.** "Reviewed in context" is **intended
   human practice**, not a graph fact or a checked property (checking it would be the workflow-gating §0 guardrail
   1 forbids); approval provenance, where it matters (a baseline), is **git-native** — a signed tag carries
   approver + approved-at. *Rejected: an authored review/approval primitive with approver identity — it reverses
   the one-primitive bet and the explicit "RBAC/approval outside the model" cut.*
**Scope.** Applied to the **ratified base** (§4b, §6, §7, §8) plus the derived `02`/`04`/`05`/`06`/`07` +
`jtbd-07` — tightenings of the base's own honesty ethos (§0 guardrail 1; §4b "readiness is stated, facts are
derived"), not reversals of direction.
**Forward note.** If multi-actor `ready` / baseline trust later becomes load-bearing, the guardrail-respecting
home for approval provenance is **signed git tags** (identity + approved-at, already in git) — not a new authored
primitive.

### Base refinements (R-series)  [R1/R2 ACCEPTED & applied 2026-06-10 (Fold-A) · R3 see below]
**Context.** The post-Session-1 founding-ideation review surfaced two wording imprecisions in the ratified base.
The **code already conforms** in both cases; these are language tightenings, so per the working discipline
(terminology is ratified — *flag*, don't silently edit) they were recorded as **PROPOSED** and assessed by the
post-split adversarial review as *already determined* (ratification, not deliberation). They were ratified and
applied in the **pre-grill fold session (2026-06-10)** — R1/R2 during the Fold-A base restructure, R3 in Fold-B —
rather than spending grill time on no-op-on-code wording. They are **not** model changes.
- **R1 — harmonize "anchor carries identity only" (§2) with "anchored = a human binding" (§4).**  [ACCEPTED ·
  applied] §2 said anchors carry "identity only," while §4's `claim` table called `anchored` "a human binding" —
  and a binding (it emits a `satisfies`/`verifies` edge) is more than bare identity. Unified phrasing, now in the
  glossary's `anchor` entry, `01` (epistemic boundary), and `04` §2: *"an anchor says 'this code location is the
  implementation/test binding for this Spec ID'; binding only, never system-truth content — never behavior,
  rationale, readiness, acceptance criteria, or delivery facts."* The code already conforms (anchors hold
  only `id`/`label`/target; `@ts-expect-error` proves the rest is rejected).
- **R2 — "no consumer reads source directly" → permit source *links*, forbid independent re-parsing.**  [ACCEPTED ·
  applied] The principle (`03`/`05`/`06`) is right, but a Design Review linking to source locations *recorded in
  the graph* is legitimate. Now stated in `01` P2 and `03` §4: *"Consumers may link to source locations recorded
  in the graph; consumers must not independently parse source to derive their own model."* Matters when the
  Slice-4 Design Review lands.
- **R3 — reconcile `04`'s `specTest` signature to binding-only.**  [ACCEPTED · applied 2026-06-10 (Fold-B)]
  `04` §2 documented `specTest(id, { verifies, run })` with an executing `run` callback; the implementation
  (`src/model/anchors.ts`) is identity-only (`{ id, label?, verifies }`, **no `run`**). The code is the *more*
  faithful one: a binding anchor carrying `run` would couple the graph binding to execution, contradicting
  "the graph records that an enabled verifier *exists*, never that it ran" (§4b / MD-7). A **doc fidelity bug,
  not a code gap** — `04` §2 now shows the binding-only signature matching the code. Same pattern as R1/R2
  (the code already conforms). Surfaced by the post-Session-1 adversarial review (F6).

### Scope note — relationship to the prior plan & brief
**Adopt-the-nouns reversal (kept for the record).** An earlier brief held "the Protocol is **not** a PM tool; do **not**
adopt SAFe/PM ladder names." MD-2 **reverses** that: the commercial Studio means users must not relearn delivery
vocabulary, so the Protocol adopts the established delivery **nouns** (as projections + vocabulary) and rejects only the
process **gating** FSM. The structural decisions **D1–D6** (recorded below) **still hold**, reframed under the meta-model
(MD-1); the cleanup plan that applied the ratified language across the 18 concept/JTBD docs was **executed and
retired** (2026-06-07). The first-draft input drafts (`GLOSSARY.md`, `UBIQUITOUS_LANGUAGE_{1,2}.md`) and the language-finalization
brief have since been **deleted** (consolidated); the **sole canonical base is
`docs/concept/ubiquitous-language.md`.**

---

## 2026-06-10 — Session: pre-grill folds (Fold-A · Fold-B · archive)

> The fold session prescribed by `plans/04` §3: restructure the language base (Fold-A — the UL doc became
> the lean glossary; model exposition rehomed into `00`–`07`), ratify-and-apply the R-series (above), fold
> the already-determined items out of the grill agenda (Fold-B — the two entries below), and archive the
> review artifacts into tracked `reviews/`. The grill (`plans/03`) now opens onto a lean base and only
> genuinely-open decisions.

### MD-8 — Generic-anchor DSL shape: one `codeAnchor` over the implementation-flavored code namespaces  [ACCEPTED 2026-06-10]
**Decision.** Generalize `anchorImplementation` into a **`codeAnchor`** builder (plus branded id) accepting the
implementation-flavored code namespaces — **`impl` / `api` / `component`** — so a *generic* anchor can bind any
code location (class, function, route, module) as the base requires.
**Why / alternatives rejected.** Anchors are generic *by definition* (`04` §2 — the binding is the thing,
framework- and location-neutral), and the ID grammar already parses any lowercase namespace; only the builder +
branded id are namespace-locked today. The base therefore already forces this answer — the post-split
adversarial review assessed it "resolvable now," so it is recorded here rather than spending grill time.
*Rejected:* per-namespace sibling builders (`anchorApi`, `anchorComponent`, …) — surface bloat for zero
expressive gain.
**Execution.** Rides Slice-2 anchor extraction, together with the example's missing api/route anchor
(`plans/02` H10). *(This is the item the plans' open-decision code-space called "D6" — not the legacy
structural D6 below; lead with meaning.)*

### MD-9 — Open-questions canonical home: `intent.openQuestions`  [ACCEPTED 2026-06-10]
**Decision.** Blocking open questions live in **`intent.openQuestions`** — the honesty check (no stated
`defined`/`ready` with a blocking open question) must read them there.
**Why.** The base is unambiguous (`02` §3: `intent` carries `openQuestions`, flaggable `blocking`; the `04`
worked example authors them under `intent`). The Session-1 pre-plan drifted — the implemented floor data reads
`design.openQuestions` / `decision.openQuestions`, so a doc-following author's blocking question never fires
the marquee honesty check. The fix direction is determined **regardless of how sections get typed** (the
typed-sections grill decision only shortens the predicate), so it is recorded now rather than gated on it.
**Execution.** Stays `plans/02` Wave B (H2): read from `intent.openQuestions`, update the floor data's
`authoredPaths`, flip the gated should-fail fixture active.

## 2026-06-10 — Session: the grill (decision resolution on the lean base)

> The fresh `grill-with-docs` session prescribed by `plans/04` §5, agenda `plans/03`: the six genuinely-open
> decisions (plans' open-decision handles D1–D4, D7, D8 — not the legacy structural D-space below), resolved
> against the lean base, ratified inline. Base edits land in `02`/`04`/`05`; terms in the glossary; Wave B
> (`plans/02`) rewritten execution-ready at the end.

### MD-10 — `behavior` sections carry content only; linkage lives in relations  [ACCEPTED 2026-06-10]
**Decision.** `behavior.rules` and `behavior.examples` hold **content, never spec refs**: rules are prose;
an examples entry is prose **or** a structured `{ given, when, then }` object (the entry matures *in place* —
prose → structured GWT). The section ⟷ kind duality rule (`02` §3) extends to `rule`/`example`: **promotion is
exclusive** — promoting an entry to a standalone `rule`/`example` spec *moves* the content out, and the only
linkage is the child's `refines`/`verifies` relation (a reverse-edge query, never an authored ref list).
**Why / alternatives rejected.** The repo had the same two fields authored three incompatible ways (refs in
`create-order`; prose + redundant flat GWT in `valid-cart`; prose/refs mixed in the docs), and the ref form
double-linked the same fact (parent's `behavior.rules: [ref(rule)]` *and* the rule's `refines(parent)`) with
nothing naming the linkage of record — latent drift, against ambiguity-is-loud (L2). Content-only applies the
already-ratified duality rule instead of inventing shape. *Rejected:* a `prose | ref` union (formalizes the
duality, every consumer branches, double-linkage stays legal); refs-only (every two-line rule costs a full
spec — the heavy-authoring loop `plans/03` §2 warns about).
**Consequences.** GWT's canonical home is **nested in the examples entry** (the flat `behavior.given/when/then`
the floor overlay reads today is Session-1 drift — reconciled in Wave B). Section-embedded referential
integrity (plan 02 H4) **dissolves for `behavior`** — there are no refs to check. The readiness floor must
count promoted children as evidence so promotion never costs a spec its earned rung (MD-12/D7, `05` §3).
**Execution.** Wave B: type `BehaviorSection` to this shape (D1), re-author the example (drop ref lists from
`create-order`; drop `valid-cart`'s redundant prose entry; nest its GWT), repoint the `example` overlay clause.

### MD-11 — The typing law: floor-bearing sections are closed-typed; `decision.status` rejected  [ACCEPTED 2026-06-10]
**Decision.** Sections get typed by a **criterion, not a list**: *every floor-bearing section* — one a
readiness-floor clause reads as evidence — gets a **closed typed shape** (no index signature). Today that is
six: `intent`, `behavior` (per MD-10), `constraints[]` (array, per `02` §1 / plan 02 H3), `model`,
`verification`, and `decision` (pulled in because the kind-aware floor, MD-12, makes it the natural evidence
of `decision`-kind specs). `design` and `ui` stay open bags — genuinely-unsettled surfaces keep breathing
(L9). The criterion outlives the list: a section becomes typed when a floor clause starts reading it.
**Why / alternatives rejected.** Closed shapes are simultaneously the honesty fix (the in-section bypass
`behavior: { "has-verifier": true }` stops typechecking — the type level closes what the H8 gated fixture
locks) and the single highest-value adoption lever (autocomplete + shape guardrails against the
heavy-authoring loop, `plans/03` §2). *Rejected:* the carried "five" list (same intent, but a list goes stale
the moment the floor moves — D7 proved it immediately); all eight (commits architecture/UI surfaces that are
not settled); none + a runtime authoring-shape validator (no guardrails, the tracer bullet keeps proving
nothing about shape).
**`decision.status` is rejected vocabulary** (glossary ledger): the adoption arc is the envelope's
`readiness` (raised → explored → written → ratified, floor-checked); replacement is `supersedes`; a rejected
path is not a truth-spec — it lives in the chosen decision's `alternatives`/`consequences`. The example's
`decision.status: "accepted"` is Session-1 drift, cleaned in Wave B.
**Execution.** Wave B types the six in `sections.ts`, drops the `constraints` record-form handling
(validators stop string-probing), re-authors the example, and flips the gated H8 fixture
`invalid-hand-authored-delivery-fact-in-section` active.

### MD-12 — The readiness floor's evidence clause is kind-conditional at both rungs; overlays dissolve  [ACCEPTED 2026-06-10]
**Decision.** The floor splits into **kind-blind structural clauses** (envelope at `idea`; `intent.outcome` +
≥1 relation at `scoped`; no blocking open questions at `defined`+; resolution clauses at `ready`) plus **one
kind-conditional evidence clause**: `scoped` = the kind's natural evidence is *present* (prose acceptable),
`defined` = the evidence is *complete* where the kind defines a stronger form (structured GWT for `example`,
machine-readable `target` for `constraint`, the written choice for `decision`). The separate overlay
mechanism is dissolved into the per-kind evidence table (`05` §3). Three bounding laws: monotonic by
construction (every `defined` cell implies its `scoped` cell), promotion-neutral (promoted forms count —
MD-10), convergence is honest (`rule`/`model` rungs converge rather than become quotas). `contract` maps to
the behavior-family row as a **documented interim** with a named deferral: when a dedicated contract section
lands, the typing law (MD-11) pulls it in and the row repoints.
**Why / alternatives rejected.** The review's top finding (F1), extended one rung down by the grill: the
plan's defined-only sketch would NOT have de-padded the example, because floor clauses are cumulative and
`scoped`'s kind-blind `rules-examples-or-constraints` clause is what `order-model` (`model.terms` counts for
nothing) and `order-lifecycle` (the `decision` section counts for nothing) were padding for. The old floor
was also non-monotonic for `constraint` (its natural evidence stopped counting between `scoped` and
`defined`) — half-delivering the P8 "kind changes required detail" promise: at the floor, `kind` only ever
*added*. *Rejected:* defined-only (leaves the padding one rung lower); dropping evidence below `ready`
(guts the honest-readiness differentiator — `defined` would stop meaning anything checkable).
**Consequences.** The canonical example de-pads — the throwaway `behavior.rules` on `order-lifecycle`,
`order-model`, and `order-latency-constraint` are deleted, and `checkout-v1.test.ts` stops asserting padding
is green. An AI author no longer learns to sprinkle `behavior.rules` onto decision records.
**Execution.** Wave B rewrites `readiness-floor.ts` as the per-kind evidence table (with D3's
table-as-single-source collapse), de-pads the example, and re-authors the H8 fixture
`invalid-defined-constraint-without-target` (which itself currently pads).

### MD-13 — The floor table in code is the single source of truth; the evaluator is generic  [ACCEPTED 2026-06-10]
**Decision.** `readiness-floor.ts` becomes the one home of the floor: each row carries `{ clauseId,
description, predicate }` (a named predicate from a small library, with paths as arguments where presence
*is* the check); the per-kind evidence map (MD-12) lives beside the clauses; the clause-id union is
**derived** from the table via `typeof`, never re-enumerated; the evaluator is one generic loop. Evidence
predicates take `(spec, model)` — promotion-neutrality (MD-10/MD-12) needs the authored model to see
refining children. Decorative metadata is banned: `authoredPaths` either becomes a real predicate argument
or is deleted.
**Why / alternatives rejected.** 453 lines for three checks; clause ids enumerated in four places (add a
clause → edit 3–4 spots; miss the switch and it **silently skips** — a validator that silently stops firing
is exactly what `05` §5 exists to prevent); `authoredPaths` was verified decorative. Table-as-truth also
buys doc↔code fidelity: `05` §3's tables and the data table are reviewable as mirror images. *Rejected:*
evaluator-as-truth (the doc table would mirror a switch; the sync burden survives); minimal trim (the
silent-skip failure mode survives).
**Execution.** Wave B (plan 02 H5), together with the MD-12 floor rewrite — one change, since the table
being rewritten is the table being collapsed.

### MD-14 — One validation path, through the one graph; `AuthoredModel` retires as a public seam  [ACCEPTED 2026-06-10 · direction; executes Slice 1/3]
**Decision.** When the extractor lands, validators consume **the extractor's output** — one path: source →
extract (static reification, P5) → graph (in memory) → conformance + honesty checks; `sdp validate` =
`sdp build` + checks. `AuthoredModel` is demoted to (at most) an extractor-internal intermediate — never a
second public validation seam, never a "pre-graph lint" mode. Authoring-time feedback is owned by typed
sections + `tsc` (MD-11) and the `sdp/spec-static` lint, not by a parallel validator path.
**Why / alternatives rejected.** Sharper than the "two paths drift" worry: the two ingestion modes can
**disagree** — the Session-1 harness validates *imported, evaluated* spec objects, while the extractor
*statically reifies without executing* (`04` §1). A non-static expression evaluates to a value on import but
drops in reification, so import-path validation can pass a spec the graph doesn't hold — honesty checks
validating a phantom. The protocol's truth is what source *statically states*, not what it *evaluates to*.
This also makes the crippled-graph gap strategy's minimal slice ("extract → graph, no more," `plans/04` §2)
sufficient for self-validation. *Rejected:* a documented dual path (the disagreement above, institutionalized).
**Execution.** Slice 1 (extractor feeds the floor checks) / Slice 3 (the full gate); until then the Session-1
harness stands in, honestly fenced (the `authored-model.ts` doc-comment already says so).

### MD-15 — Authored Spec files carry the `.sdp.ts` extension  [ACCEPTED 2026-06-10]
**Decision.** Spec files are `/specs/**/*.sdp.ts` (packs: `*.pack.sdp.ts`). The Protocol's own compound
extension — the `.stories.tsx` pattern: tool-branded, collision-free, tooling-scopeable. The model name
`Spec` is untouched (it was always settled); only the file serialization changes.
**Why / alternatives rejected.** `*.spec.ts` is *the* default test glob of the JS ecosystem (Vitest:
`**/*.{test,spec}.?(c|m)[jt]s(x)`; Jest/Mocha conventions match). An adopter on runner defaults gets their
runner executing Spec-primitive files — Vitest fails files with no test suites, so first contact with the
Protocol is a baffling CI failure. This repo's own narrowed `vitest.config.ts` was the dodge that proved the
landmine. Decided now, while the rename costs nine example files and zero adopters. *Rejected:* keep +
documented exclusion (pushes a config edit onto every adopter, and IDE test explorers keep mislisting spec
files); `.spec.sdp.ts` (collision-free but verbose self-restatement); directory-convention-only (identity
lives only in the path — future colocated specs would carry no marker).
**Execution.** Wave B renames the example files and this repo's docs/globs; the extractor (Slice 1) ships
reading `*.sdp.ts` from day one.

## 2026-06-10 — Session: Wave B execution + post-execution adversarial pass

### MD-16 — Honesty-sharpenings from the post-Wave-B adversarial pass: promoted evidence must be carried; authoring-shape gets its runtime stand-in; `doc:` targets are an explicit deferral  [ACCEPTED 2026-06-10]
**Context.** An adversarial review (Codex) of the executed Wave B challenged three honesty surfaces:
(1) the promotion-neutral floor counted *any* refining `rule`/`example` child and *any* `constrainedBy`
edge as evidence — an empty stub child or a wrong-kind edge could clear a parent's `scoped`/`defined`;
(2) MD-11's closed sections rely on TypeScript's excess-property check, which fires only on fresh
literals — a section assembled through an intermediate variable smuggles a delivery fact past `tsc`,
and nothing caught it at runtime before Slice 3; (3) the base's `decidedBy` → external `doc:` ADR
affordance (`02` §6) is unrepresentable in the DSL, making the F2 doc-note close-out read stronger
than its scope.
**Decision.** All three resolved as honesty clarifications consistent with the settled decisions:
1. **Promoted evidence counts only when the promoted spec itself carries its kind's evidence** (its
   `scoped` cell in the per-kind table): a refining `rule`/`example` child must hold its
   statement/entry; a `constrainedBy` edge counts only when it resolves in the model to a
   `constraint`-kind spec with non-empty `constraints[]` (the section ⟷ kind twin of inline
   `constraints`). Follows from MD-10 — promotion *moves content out*, so an empty child is not a
   promotion but a stub. *Rejected:* requiring a minimum child **readiness** (a cross-spec readiness
   gate below `ready` — the base reserves cross-spec rungs for the deferred `ready` clauses, and
   readiness is the author's statement, not structural evidence); counting `rule`-kind `constrainedBy`
   targets in the constraints-evidence slot (the duality twin of `constraints` is `constraint`;
   additive to relax later if real usage wants it).
2. **Authoring-shape honesty (`05` §2, check 5) gets its Session-1 runtime stand-in now**:
   `validateAuthoringShape` fails any spec or pack that hand-authors a delivery-fact key
   (`implemented` / `has-verifier` / `observed`) at the envelope or inside any section. Not a second
   validation path (MD-14): it is an MVP honesty check implemented early on the same stand-in harness
   the readiness floor already rides, and it migrates onto the graph with the rest. The type-level
   closure (MD-11) stays the ergonomics lever; its fresh-literal scope is now recorded for sections
   exactly as F7 recorded it for the envelope, and the bypass is pinned twice (compile-time +
   runtime fixtures).
3. **`doc:`-target relations are an explicit named deferral**, stated where the affordance is promised
   (`02` §6, the glossary's flagged ambiguities, and doc notes in `ids.ts`/`relations.ts`): the DSL
   stays `spec:`-target-only until the external-ADR need arrives. F2 stays closed *as the doc-note it
   was scoped to be*; implementing a `DocId` target type now was rejected (no call site wants it, and
   the shape should be decided when `doc:`/pack-targeting actually arrive).

## Structural-decision shorthand (D1–D6)  [ACCEPTED · relocated here when the cleanup plan was retired, 2026-06-07]

> These six labels come from the original structural-decisions pass. Their *content* is canonical in the
> design docs (`00`–`07` — since the Fold-A restructure rehomed the base's model exposition there); this table
> is kept for permanent traceability so any historical `(Dn)` reference still resolves now that the
> single-use cleanup plan (which previously held it) is gone. **Do not confuse this legacy D-space with the
> open-decision handles D1–D8 used by `plans/02`/`plans/03`** — those name the post-Session-1 grill agenda
> (typed sections, prose-vs-ref, floor collapse, …), a different code-space; in prose, lead with meaning.

| Label | One line | Canonical in |
|---|---|---|
| **D1** | readiness (design maturity, authored) is separate from delivery facts (derived) | `02` §2 |
| **D2** | `02` carries explicit typed **sections**, trimmed to essence (branded-ID strings; open `model` list) | `02` §3 |
| **D3** | `Pack` is a reified grouping/aggregate (not folded into `Spec`); membership single-sourced on a manifest | `02` §4 |
| **D4** | **Design Review** is the flagship curated projection — the context where a human decides to state `ready` (sharpened by MD-7; the floor is checked, the review is human practice) | `06` §5 |
| **D5** | the **agent surface** = a visible typed graph the agent *scripts* (no verb wall); `reader` = thin loader | `06` §3 |
| **D6** | the **MCP surface** = integration for user-facing apps (designed-in, deferred build, shape TBD) | `06` §7 |

## Measured evidence — figures behind the generalized doc prose  [recorded 2026-06-07]

> The concept docs deliberately carry *principle-level* wording, not point figures (figures age and read as
> false precision). The measurements that motivated those principles are preserved here as evidence.

| Figure | Context | Generalized in the docs as |
|---|---|---|
| **~⅕ tokens** | a multi-probe agent session ran at ~⅕ the tokens of a grep/verb-API equivalent (data kept in-process, only conclusions returned) | `06` §3/§10, `jtbd-05` JS-E2 → "a measured context-efficiency win" |
| **< ~50 specs** | full-rebuild-per-run is comfortable below ~50 specs | `00` / `05` / `07` → "MVP scale" |
| **~10k+ nodes** | a property-graph DB is deferred until traversal pain (~10k+ nodes) | `03` / `07` → "until measured traversal pain" |
| **single-digit to ~25%** | a curated graph is a small selection of the mechanical (impact-graph) firehose | `06` §2, `jtbd-07` JS-G3 → "a deliberately small curated selection" |
