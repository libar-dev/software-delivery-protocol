# Plan 29 briefs — the universal carrier · executable ergonomics · projections · structural anchors · the agent surface

> **Status: 🧭 BRIEFS — planning input, not an execution plan.** Five owner-commissioned briefs
> for the next arc, recorded together because they answer one dissatisfaction in three parts:
> no single universal Spec format across kinds and maturities (including executable Specs),
> annotations for architecturally significant patterns and relationships never picked up, and
> the agent CLI/interface still below its gen-1 ancestor. Settled ground remains **plan 28
> (✅ EXECUTED)** — the Gherkin carrier option (MD-27) realized for behavior and example Specs.
> No session splits or operational detail here by owner instruction.
>
> **Numbering retirement rule.** This file is the arc index and keeps 29 permanently;
> commissioned plans take **30 upward**, one primary number each, and this header gains a
> commissioned-plans line as they are cut. No future plan reuses 29.

## The read model for every commissioning session

The graph, not the concept docs, is the read model. Several concepts this arc touches already
have carrying Specs; a planning session that starts from `docs/concept/06`/`07` will treat
dissolved design as intended truth. Open these owners first (concept pages are exposition and
lineage evidence only):

| Brief | Carrying owners to open first |
| --- | --- |
| A | `spec:carrier.gherkin-authoring` (the syntax owner) · `spec:decisions.gherkin-carrier-option` · `spec:decisions.carrier-ruling` · `spec:decisions.prose-ownership` · `spec:validation.kind-evidence` |
| B | the codegen / runner / adapter Specs, plus review 14 §7 as the acceptance shape |
| C | `spec:consumers.design-review` (ready · implemented · has-verifier) · `spec:consumers.projections-model` |
| D | `spec:model.anchors` · `spec:decisions.binding-not-liveness` · `spec:extraction.claim-taxonomy` |
| E | `spec:consumers.agent-surface` · `spec:decisions.agent-front-door` · `spec:consumers.impact-graph` (at `idea`, blocking question intact) · `spec:decisions.mcp-deferred` |

**Corpus context — re-measure at commissioning, never inherit these observations as counts.**
At this writing the operational backlog (recipe 1) is empty; the drift alarm (recipe 2) names
eight `implemented ∧ ¬ready` Specs — the `model` family parents (`core-model`, `pack-aggregate`,
`relations`, `spec-sections`) plus `projections-model`, `claim-taxonomy`, `regenerability`, and
`markdown-authoring` — several of which this arc touches; and the corpus is overwhelmingly
Markdown-carried with a single migrated `.feature` family. Mixed-carrier pain is real as a law,
small as a count. The first commissioned plan opens by re-running the queries.

## The honest frame (binds every brief)

Review 14's load-bearing finding stands: across all five historical authoring shapes — v0 TS,
v0 Gherkin, gen-1 fused Gherkin, current Markdown — **performing execution always lived in a
separate code artifact**. "One universal format" therefore means *one carrier lawful for all
authored intent at every kind and readiness rung, with execution behind generated contracts and
anchored code-side handlers* — never self-executing prose. Brief A pursues the first claim;
brief B is what actually shrinks the code artifact. No brief may promise the conflation.

Gen-1 evidence is imported selectively, per the standing lineage rule: take the fused
stakeholder-readable format, the maturity-indexed description grammar, the derived-taxonomy
lesson, and the graph-handle ergonomics; refuse the authored lifecycle status, the deliverables
table, value-transfer deletion, and any parallel tag registry.

---

## Brief A — the carrier universality ruling

**Goal.** Re-decide the Gherkin carrier option's kind bound: which kinds the Gherkin carrier can
carry *honestly*, whether it may become the default carrier, and whether rich authored content
(Markdown prose, doc strings) becomes lawful inside it. This is the keystone ruling; briefs
C and E read its outcome.

**The bound is a ruling to overturn or reaffirm, never a gap.** The Gherkin carrier option
(MD-27) restricted itself to `behavior` and `example` as an affirmative choice — to avoid
pretending Gherkin is a natural carrier for every kind. The owner's dissatisfaction is real (a
decision, contract, or NFR cannot live in the preferred format, so the corpus is necessarily
mixed-carrier), but the session must put MD-27's own rationale on the table as the thing to
overturn or reaffirm, kind by kind.

**The structural collisions the session must resolve, not paper over.**

- `kind` is structural in the current grammar: Feature = `behavior`, Scenario = `example`; a
  kind tag is forbidden. Extending coverage means new structural mappings, not new tags.
- Gherkin `Rule:` already means `behavior.rules` (title-only). Extending coverage to the `rule`
  kind collides with that keyword.
- One `.feature` owns one behavior parent plus example children. Decisions, models,
  constraints, contracts, and workflows do not have that shape.
- Open questions have no Gherkin form today, and several non-behavior kinds live on open
  questions at the lower rungs.
- Kind-evidence rows are not "keyed descriptions plus Rules": a decision needs
  context/decision/rationale/consequences; a model needs terms; a constraint needs
  machine-readable targets. `spec:validation.kind-evidence` is the table that governs the
  mapping.

**Rulings the session must produce.**

1. **Kind coverage, honestly.** Not "how do the other six kinds map onto Feature + Rules" but
   *which kinds Gherkin can carry honestly, and which stay Markdown because the mapping would
   lie*. Per-kind disposition against the kind-evidence table; "refused where dishonest" is a
   lawful and expected answer.
2. **Rich content.** Doc strings and data tables are refusals today. Decide whether bounded
   Markdown content inside descriptions becomes lawful authored content (the prerequisite for
   brief C's stakeholder projections). The receiving owner is the prose-ownership decision's
   existing prose owner — never a new field.
3. **The meaning of "universal" — kept open until ruled.** One carrier ruled default for
   everything, or one model with per-ID carriers plus a projection that renders *any* Spec in
   the Gherkin shape. Review 14 §2.3 and the v0 record favor the second (per-ID choice plus
   generated projection, never a lossless codec); the owner's dissatisfaction leans toward the
   first. The session decides; "universal" does not become the claim before it is the ruling.
4. **The default question.** Only if coverage lands: whether the corpus default flips from
   Markdown — that, and only that, amends the carrier ruling (MD-18) and the Gherkin carrier
   option (MD-27), with the operative-record discipline of the plan-18 flip. The surface that
   changes first either way is `spec:carrier.gherkin-authoring` (title-only Rules, the
   doc-string/data-table refusals, structural kind).
5. **Packs, explicitly.** Packs are a separate carrier under the Pack syntax ruling (MD-25).
   In or out of this ruling — named, never silently omitted.

**Boundaries.** One canonical surface per ID survives. No authored delivery status,
deliverables table, lifecycle tags, or value-transfer deletion enters the grammar. Execution
and `has-verifier` stay behind generated contracts and anchored handlers. The decision passes
the ADR three-part test or the session ends without a ruling.

**Rides along — inventory the drift, don't repair one sentence.** The declined-Gherkin claim is
stale since MD-27 at multiple sites: the roadmap cut list (`07` §3 item 3), the ASPIRATIONAL
list (`07` §2), and the residual open question (`07` §4); the carrier-ruling Spec itself still
does not mention Gherkin (review 14 recorded this). The session inventories and repairs the
set.

---

## Brief B — derived runnable modules (O3)

**Goal.** Implement review 14's evidence-led recommendation, deferred but not rejected by the
O2 selection: codegen emits the runnable adapter module — contract import, test registration,
step-key mapping, parameter dispatch, oracle `expected()` comparison, failure rendering in the
Spec's language — and authored code shrinks to irreducible semantics: world construction,
product invocation, actual-outcome observation, and the oracle.

**Why now.** This is the real "executable specs" payoff: a Spec plus a small authored semantics
module, nothing mechanical between them — the honest version of "the spec is the test." Review
14 §5.4's ergonomics audit found a substantial mechanical share in the authored verifier, plus
the oracle↔Then expected-outcome re-encoding; that audit was a lexical read of one test, never a
corpus measurement, so no percentage or line-count target enters the acceptance shape.

**Acceptance shape (from review 14 §7, with the valid-cart cut as the named tracer).** The
generated valid-cart runnable module + minimal authored handler module + existing oracle,
proven end-to-end with mutation evidence: changing the Spec's expected value or the oracle's
result reddens the generated test. The actual-outcome adapter contract is stated explicitly —
silently deriving domain observation is forbidden.

**Boundaries.** Claim taxonomy unchanged: the authored `specTest` anchor remains the only
source of `has-verifier`; generated execution says nothing about pass state. Existing refusal
laws reused — no generated runnable module for an unbindable example, incompatible vocabulary,
unresolved handler binding, or colliding path. **O3 never grows into O5**: the engine never
loads or executes adopter code. The harness projection (O4) stays a later composition.

**Dependencies.** None — O3 was explicitly "no MD-18 reopen"; independent of brief A, can run
first or in parallel.

---

## Brief C — new projections beside the shipped Design Review

**Goal.** Decide and realize the next graph-derived projection(s) worth a plan, on top of the
Design Review that already exists. Candidates are the named-but-unbuilt rest of the consumers
taxonomy: Mermaid, reference, context-bundle, a derived taxonomy/census page, Spec Studio.

**What already shipped — never re-specify it.** `spec:consumers.design-review` (ready ·
implemented · has-verifier) already requires, and `sdp view` already emits, a deterministic
Markdown index plus one page per Spec and per Pack under `generated/design-review/`. Richer
visual representations are explicitly outside that behavior. "Per-Spec and per-Pack pages" is
therefore not the goal; the goal is what the shipped view deliberately excludes.

**Evidence base.** gen-1's `docs-live/` proved graph-derived stakeholder docs; its
managed-region determinism the Protocol already obtains more simply by keeping generated files
wholly derived. The shipped Design Review pipeline is the template.

**Boundaries.** Determinism and "projections confer nothing" are already Design Review law —
inherited, not re-decided. The one graph remains the sole read model; output is regenerable and
disposable. The only new decision arises if the session abandons the one-generated-view posture
— then it rules on the record. **The census/taxonomy page has one owner: this brief.** Briefs D
and E consume it (D's structural bindings feed it; E may expose it as a recipe), never specify
it.

**Dependencies.** Brief A's rich-content ruling determines the ceiling of the raw material; a
graph-only first slice is lawful before A rules.

---

## Brief D — structural anchor semantics

**Goal.** Resolve the reserved open question ("inline-vs-centralized anchor semantics,"
`docs/concept/07` §4): extend the anchor contract with a small closed set of structural,
intent-free relations so code can declare architecturally significant patterns and
relationships. Off the new edges: **a projection of authored structural bindings** (never
"architecture derived from code" — the refusal below forbids that reading), dangling-reference
validation, and inputs to brief C's census page.

**Why now.** The mechanism was designed-in and deliberately parked; it was never picked up.
Gen-1's structure tags (`bounded-context` · `arch-layer` · `role` · `uses` · `implements` ·
`enforces-decision`) are the production evidence of value; its taxonomy drift (a 50 → ~26
correction with three inconsistent counts surviving) is the production evidence of the failure
mode to refuse.

**Rulings the session must produce.**

1. **Which fields, if any, enter the contract** — candidates: `component` (membership), `uses`
   (between anchored code units). **`implements` must first be distinguished from the existing
   `satisfies` target**: the landed `codeAnchor` already binds realization through `satisfies`,
   and gen-1's `@architect-implements` joined *separate test-pattern identities*. If the
   candidate means "this code realizes a contract-kind Spec," that may be `satisfies` with a
   contract-kind target — an authoring convention, not a new slot. Rule it, don't assume it.
2. **Value form** — closed enums or graph-ID references, validated against the graph; never
   free strings.
3. **Validators** the new edges get, and how the derived taxonomy/census surfaces (always
   generated, never hand-maintained — gen-1's own corrected lesson; the page itself is brief
   C's deliverable).
4. **The anchor-required lint** stays **warn-level and optional** ("useful, not load-bearing" —
   `04` §2 and JTBD 02). Promoting it to an error-level honesty check would make it a workflow
   gate, which the permanent guardrail forbids.

**Boundaries — these land in the decision Spec itself, not just the plan.**

- New fields extend `codeAnchor`; per-namespace sibling builders stay rejected as surface bloat.
- New edges are ordinary **anchored** claims — never `inferred`. The `inferred` category stays
  empty until the impact graph produces it; "do not derive architecture from code" stands —
  these are *authored declarations in code*, not import-graph inference.
- Anchors still carry no intent, readiness, status, or delivery fact (P9/P10; binding, never
  liveness, MD-7). No free-form tag vocabulary, no authored lifecycle, no parallel registry.
- Foreign fields remain extraction errors; the contract stays closed after extension.

**Dependencies.** An independent decision — runs beside A/B/C. Brief E benefits from its edges.

---

## Brief E — the agent surface: read recipes · write ergonomics · the MCP amendment

**Goal.** Close the gap between `sdp q` and its gen-1 ancestor — split into three halves that
must not be conflated, because they answer to different laws.

1. **Read recipes (parity with the gen-1 handle).** Start from what exists: `blastRadius` is
   the file-level changeset entry, and recipes 1, 2, 4, and 8 already cover backlog, drift,
   blast radius, and warn-level signals. The new read is a git-diff → at-risk-Specs bridge over
   `blastRadius` (gen-1's `specsReverifying`) — **a recipe or thin CLI convenience until a
   second machine consumer fails to hand-roll it**; the freeze-vs-script principle (freeze only
   irreducible cross-source joins) gates every promotion to a frozen reader accessor, exactly
   as the second-caller bar gated `explain`/`search`. Census/fan-in reads consume brief C's
   census and brief D's edges.
2. **Write ergonomics (a separate half — not read parity).** `sdp new spec` is a write path and
   `sdp validate --watch` is an authoring-ergonomics lever; both are named in the roadmap's
   acceptance-criteria lens. They ride this brief only as its explicitly separate second half.
3. **The MCP amendment.** Deferral is carried by `spec:decisions.mcp-deferred` (the D6 lookup),
   whose own bar is *"until a concrete caller establishes its boundary and contract."* Gen-1's
   burst-mode rule (typed twins earn their keep at ≥5 reads in close sequence) plus
   "Studio-class sinks" is evidence, **not yet a named caller with a contract** — so this half
   is an amendment attempt that may lawfully fail the three-part test. **The session ends
   without a ruling if the concrete-caller bar is not met**; the brief does not assume a
   decision Spec results.

**Boundaries.**

- `bySymbol` stays deliberately absent until the impact-graph substrate exists —
  `spec:consumers.impact-graph` is at `idea` with its blocking identity question intact, and
  parity does not smuggle the exhaustive impact graph in through census/fan-in reads.
- No mutation through `sdp q`: the write path remains carrier edit + git; the q sink stays a
  pure read.

**Dependencies.** Benefits from brief D's structural edges and brief C's census; blocks on
neither. Recommended last in the arc.

---

## Sequencing and cross-cutting notes

- **A is the keystone for carrier questions; B is independent and high-payoff** — B can run
  before or beside A. **C and D run beside each other** (C's graph-only first slice is lawful
  before A rules; D is an independent decision). Only E wants D's edges — it goes last.
- Briefs A and D end in decision Specs and must pass the three-part test; E's MCP half is an
  amendment attempt that may lawfully end without a ruling; B and C are engine/projection work
  under existing law.
- Two standing warnings: brief A never promises self-executing prose (B owns the code-artifact
  shrink), and brief D's refusal list belongs in its decision Spec, not only its plan — the
  gen-1 taxonomy drift is the cautionary record either way.
