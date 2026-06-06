# Pedantic review & cleanup — Libar Omni concept specs + JTBD

> **Status:** PLAN ONLY — no edits this session. This document is the deliverable: it locks the
> decisions taken, records the model, and lays out the remaining work (objective fixes + an audit of
> inherited tensions) precisely enough for a later session to execute. Terminology here is
> **provisional**; a ubiquitous-language + decision-diary pass (see Follow-ups) ratifies it.

## Context

`docs/concept/` (9 files) and `jtbd-stories/` (9 files) describe one design system: a TypeScript-canonical
delivery-lifecycle model on a single enrichable `Spec` primitive, derived into one regenerable graph, kept
honest by CI. The goal is a pedantic cleanup keeping the model **lean enough to be MVP essence** yet
**shaped to enrich later**, with special attention to the domain model and `02-core-model.md`.

**Lineage (from git history):** the docs were synthesized from a prior "v1" analysis + a prototype
experiment (`3c0a8f6`). The first concept version (`ed5f6ad`) carried heavy *process scaffolding*
(`v1`/`E2`/`L4`/`L7`/`D3`/"architect experiment"/"View 1" references). The "Review and update" session
(`5d9681f`) stripped that scaffolding — **correct**, since the source analyses were themselves deleted
(`a1fb2f7`, `543dae4`). "Polish fundamental concepts" (`9bc360a`) was trivial (3 lines).

**Key finding — "false settledness".** Neither later session introduced the conceptual tensions; the
readiness/`verified` conflation is in `ed5f6ad` verbatim and traces to the synthesis. But stripping the
scaffolding also stripped the synthesis's *"still-settling" flags* and entangled *rationale*. The result
reads as finished spec, so inherited-but-unresolved tensions look like settled decisions. The cleanup must
therefore not just fix surface inconsistencies but **re-open the load-bearing choices the polish smoothed over.**

**On the ChatGPT-5.5-Pro review (`tmp-review/`):** competent; its *findings* are ~95% sound and its
domain-model work matches the brief. We **partially accept** it — take its objective catches, supersede
its readiness handling with our deeper decision (D1). It is a checklist, not a patch to copy.

---

## Decisions locked

### D1 — Separate the readiness axes *(the central change)*
The original `readiness` ladder (`sketch→framed→specified→designed→bound→executable→verified`) **merged two
different progressions**: design maturity (`sketch…designed`, author-claimed) and code/delivery status
(`bound/executable/verified`, really machine-observed). That is the linear pipeline P8 itself says the model
must not be. Resolution:

- **`readiness` = design maturity only**, authored: `sketch → framed → specified → designed → ready`
  (`ready` ≈ "reviewed against neighbours/architecture, implementation-ready"; provisional term).
- **Delivery facts = derived, never authored**, computed from graph edges, shown as badges:
  `implemented` (a `satisfies` annotation edge resolves), `has-verifier` (an enabled executable verifier
  links via `verifies`), and later `observed` (runtime-evidence overlay, aspirational).
- `bound`/`executable`/`verified` **leave the enum**: `bound`→ derived `implemented`; `executable`/`verified`
  → derived `has-verifier` (+ future `observed`). Verifier-absence on a `ready` spec is a surfaced **gap**,
  not a readiness rung.

*Why:* matches the epistemic boundary ("humans assert intent; machines assert structure"); consistent with
the already-correct "bindings are marker-derived" change (if a binding is derived, `bound` was never an
authored claim); and unlocks queries the merged ladder cannot express — `ready ∧ ¬implemented` (the build
backlog) and `¬ready ∧ implemented` (**code ran ahead of design — a drift alarm**). Adds no quota; P4
corollary (significance governs detail) is untouched.

### D2 — `02` depth: expanded types, trimmed
Keep the review's explicit facet TS types + first-class domain model, but replace undefined placeholder
generics (`Ref<NodeId>`, `Ref<ComponentId>`, `ModelConceptId`, `ExampleRef`) with plain branded-ID strings,
and present `DomainConcept.kind` as an **open/illustrative** list, not a closed enum. Lean MVP surface,
flexible later.

### D3 — Keep `SpecPack` as a reified grouping (do not fold)
A pack is an **aggregate over specs**, not a delivery artifact in the `Spec` lineage — so it does **not**
violate the one-primitive thesis (which forbids migrating *artifact types*, not having a grouping concept).
Reifying the grouping (`specPack({...})`) communicates intention more clearly than scattering membership
across members, and the pack is the ever-present **review unit** (a spec is always reviewed against ≥1
related set; a spec may belong to many packs). *Refinement:* membership is **single-sourced on the pack's
`specs: [...]` manifest**; the `member → belongsTo → pack` edge is *derived*, not separately hand-authored
(no dual-maintenance — this also settles Tension E's `belongsTo`). **Open sub-question (deliberately left
open):** whether a pack expresses shared vocabulary via `modelRefs` (reference `kind:"model"` specs — one
source of truth) or inline `sharedModel` (own terms). A valid reason to question this exists; not decided now.

### D4 — Design-review projection as the flagship curated view (concept core; rendering grows)
The primary human/agent surface is a **design-review projection**: it renders a spec/pack **in context** —
its relations to neighbouring designed/implemented specs, bindings, decisions, readiness + derived delivery —
plus review affordances (auto-generated **design questions**, a **findings** table). Generated from the graph
(pure projection, regenerable, no second source); the **same artifact is core context for human review *and*
agent implementation sessions.** It is the surface at which a spec earns `ready` (ties **D1** — `ready` =
"reviewed in context") and the rendered form of a pack (ties **D3** — the pack is the review unit). Findings
resolve through the edit loop (intent → agent → git, `06` §4), not a stored `Finding` type — **no new model
primitives.** *Concept is core; rendering grows:* the rich mermaid sequence/component diagrams in the user's
live example are generated from a richer **sequence/runtime annotation** layer the MVP defers — so the MVP
design-review renders the relationship slice from the curated graph, and the rich diagrams are aspirational
depth. This sharpens `06`'s vague "one read-only view" into a purpose, and is the first concrete application
of the implementation-agnostic principle below (capture the concept; hold the rendering as Representation).
*(Reference example: `…/new-convex-es/libar-platform/architect/design-reviews/*.md` — live graph-generated
sequence + component diagrams, key-types table, design questions, findings.)*

### D5 — Design the AI read surface for the agent that *scripts* (visible typed graph; freeze→push only the irreducible)
**The single highest-leverage decision for execution of every session type.** The realistic agent (a) has an
RL-trained prior to grep / write ad-hoc scripts, and (b) **cannot see into** an opaque verb API — so it avoids
the API and greps, and even when nudged onto the API it slides back. Two compounding failures: **invisibility +
the prior.** Don't fight the prior — **feed it:** point the scripting instinct at a *visible, typed graph*
instead of raw source. The bug was never grep; it's what the agent greps *over*.

The surface, therefore:
- **The graph is a visible, self-describing artifact** the agent reads/greps/parses directly — *the schema file
  IS the contract* ("read it, then script freely"). (In the experiment the *data* is gitignored-regenerable, but
  the *schema/code* is committed and visible.)
- **One canonical schema for the whole read-only graph**, richly typed (branded IDs; discriminated unions on
  node/edge kind; provenance + derived facts typed). **No per-projection schemas** — they hide and mislead.
  *Proven:* leaving `scenarios`/`rules` untyped made the richest half of the data *invisible* to an agent reading
  the contract — it concluded scenarios didn't exist. **The type IS the discovery surface; under-typing hides a capability.**
- **A thin typed loader/handle** doing joins + taxonomy-decode *once* at construction, returning plain composable
  data; authors/persists nothing (a front door, not a store) — "not 30 verbs, not raw-JSON-you-rejoin."
- **Freeze a view only where the agent would hand-roll it wrong** — two axes: *consumer count* (second-caller
  bar) **and** *join irreducibility*. The frozen set is small: entry adapters (the grep→graph bridge:
  by-concept / by-file / by-symbol) + irreducible cross-source joins. Everything else *scripts*. *Counter-proof
  the line holds:* a 3-line group-by over an exposed field is removed from the surface and scripted inline.

**Push, don't pull, for the common case (ties D4):** the harness pushes the *design-review slice* for the task
into context at session start; the agent scripts the visible typed graph only for the long tail.
~90% pushed slice · ~10% ad-hoc scripts · ~0% verb-wall. **D4 is the push; D5 is the pull; together they retire
the verb-wall.** And it **tracks model capability** — the verb-wall was right for weaker models; as models
improve, freeze *less*. *Proven:* the `architect` "playground" (remove the verb API; expose raw graph + one Zod
schema + ~5 views; let the agent script) ran a full multi-probe session at **~⅕ the tokens** of the grep/verb-API
equivalent — data stays in-process, only conclusions return. *Reference: `…/architect/playground/{schema.ts,
graph.ts, views.ts, CONTEXT.md}` (live, built this week).*

*Implementation-agnostic note:* the **principle** (visible typed graph · type-is-discovery · freeze only the
irreducible · push the slice · feed-don't-fight the prior) is core; the **mechanics** (Zod, `tsx`, JSONL, the
view names) are Representation. This **re-leads `06` §3** — from "a typed handle whose method list is the docs"
to "**a visible typed graph the agent scripts, plus a pushed slice**," the handle demoted to the thin
join/decode layer, and §3's "self-contained slices = aspirational" reconciled with D4 (the design-review slice is core).

---

## Strategic theme — conceptualize implementation-agnostically (open direction)

The session surfaced a realization larger than any single inconsistency: **the concept docs carry leaked
implementation detail** — TypeScript type definitions, DSL constructors (`spec()`/`specPack()`), `@akg/spec`
imports, `ts-morph`, field-level shapes, graph JSON — that entered during the *prototype synthesis* (kept
deliberately, to not lose hard-won detail). At project inception a conceptual/domain design should be
expressed **implementation-agnostically**; the implementation/representation belongs in a separate layer.
The docs already name the **Principle vs Representation** split but, in practice, over-index on Representation.

**Not undoing this now** (user's call) — recorded as a valid, high-value discussion point and a likely future
direction: e.g., separate an implementation-agnostic *concept/domain* layer from a *representation/implementation*
layer (TS shapes, DSL, extractor, graph encoding). This reframes D2 (trim toward essence) and is the natural
companion to the glossary/decision-diary follow-up. The readiness conflation (D1) and this implementation-detail
leakage share one root cause: **the model was never fully conceptualized apart from the prototype that birthed it.**

---

## The model (the "flow") — locked

**One `Spec` primitive**, enriched in place; significance governs detail (no tier-filling).

- **`abstraction`** (authored) — altitude: `initiative · domain · capability · feature · scenario · operation · component`. *(See Tension F — may trim.)* `contract` is NOT here (it's a kind).
- **`readiness`** (authored) — design maturity: `sketch → framed → specified → designed → ready`.
- **Delivery facts** (derived) — `implemented` / `has-verifier` / `observed`. Never authored.
- **`SpecKind`** (one per spec): `capability · behavior · workflow · example · rule · constraint · model · decision · contract`. *(See Tensions A, E.)*
- **Facets** (all optional): `intent`, `behavior`, `constraints[]`, `model` (first-class `DomainModelFacet`
  = terms + concepts; vocabulary only, not ORM/schema), `design`, `decision`, `verification` (design-time
  *intent* only — how it's meant to be checked; never asserts a verifier exists), `ui` (aspirational).
  **Removed from authored shape:** `runtime`, `bindings`, `evidence`.
- **IDs:** all authored truth is `spec:*` (incl. `spec:decisions.*`); non-spec nodes use
  `impl: · api: · test: · component: · pack: · doc:`. Grammar-compliant, lowercase dotted/kebab. No `capability:*`/`adr:*`.
- **Authored relations (declared):** `refines · belongsTo · dependsOn · constrainedBy · decidedBy ·
  exemplifies · verifies · supersedes`. `satisfies` is an **annotation** edge from markers, not authored.
  *(See Tensions B, E.)*
- **Graph:** flat nodes/edges; `nodeType` + `specKind` (no overloaded `kind`); provenance
  `declared | annotation | inferred`, never collapsed.
- **Validation (CI fails on error):** referential integrity · duplicate IDs · readiness-profile completeness
  (**design-maturity rungs only**, base profile + kind overlays) · orphan detection · `verifies` linkage
  (resolution; absence = gap-warning, not a gate) · **authoring-shape honesty** (no authored bindings/evidence)
  · deterministic pack coherence.
- **Consumers (agents #1):** a **visible, typed read-only graph the agent scripts** (D5) — one canonical schema
  (type = discovery), freeze only the irreducible (entry adapters + irreducible joins) · the **design-review
  slice pushed into context** (D4) for the common case · edits as *intent → agent → git → CI* (no patch loop).
  **MVP:** one bounded context, ~8–12 specs; design-review renders from the curated graph (rich sequence/component
  diagrams are aspirational depth). *D4 = push · D5 = pull · together they retire the verb-wall.*

---

## Objective fixes to apply (verified review checklist — adopt as-is)

All confirmed against the current docs; none is a matter of taste:

1. Remove stray `</content>`/`</invoke>` tags from all 8 concept docs (LLM-generation junk).
2. Founding Principle #4 reworded ("repo canonical; graph derived") — it literally contradicted #2.
3. Unify IDs/namespaces: `api:POST:/orders`→`api:orders.post`; `impl:CreateOrderUseCase`→`impl:orders.create-order-use-case`;
   drop the `capability:*`/`adr:*` second identity system (those are specs).
4. Remove the double binding surface: no authored `runtime`/`bindings` facets; bindings are marker-derived annotation edges (one-way: code → spec). Add the `05` "authoring-shape honesty" validator.
5. Remove authored `evidence` facet (evidence is observed, never authored).
6. `nodeType` + `specKind` in graph JSON (de-overload `kind`).
7. `interface`→`contract` kind; remove `contract` from the abstraction ladder.
8. First-class domain model: `kind:"model"` + lightweight `DomainModelFacet`; packs reference via `modelRefs`, not `sharedModel`.
9. Deterministic pack coherence (refs/model-refs/terms resolve, dup member IDs fail) — drop the semantic "duplicated intent" check.
10. `--check-clean` reworded — it asserted a *committed* generated output that L8 says is gitignored.
11. `spec:payment.*`→`spec:payments.*` (matched the `/specs/payments/` folder); `contains` (not a relation) → `refines`/`belongsTo`.
12. Remove over-specific/temporal claims **from the docs**: `~⅕ tokens`, `<~50 specs`, `~10k+ nodes`, "single-digit to a quarter", "multi-quarter" → principle-level wording. (The measured `~⅕`/`~89%` figures are kept as *evidence* in the decision diary, per D5 — not as doc prose.)

## Additional fixes (review missed or introduced)

1. Typo introduced by the review: `jtbd-stories/03-one-graph.md` "an decision spec" → "a decision spec".
2. D2 trims to `02` (branded-ID strings; open `DomainConcept.kind` list).
3. The D1 cascade the review did NOT do (readiness everywhere): `02` (enum + new "Derived delivery facts"
   subsection + worked examples use design-maturity values + `verification` reframed), `01` (P8 reworded —
   two *authored* axes; delivery is a *derived* dimension), `03` (graph example readiness; delivery computed
   from edges), `05` (profiles cover design-maturity only; verifier-presence = gap), `06` (**the big one — D4+D5:
   re-lead §3 around a *visible typed graph the agent scripts* + a *pushed design-review slice*; demote the handle
   to the thin join/decode layer; freeze only the irreducible (entry adapters + irreducible joins); reconcile
   "slices = aspirational" with D4 (slice is core); + view/handle readiness/delivery badges**),
   `07` (CORE map "through `ready`"), README/`00` (lifecycle sentences), `jtbd-stories/01,04,05,07`.

---

## Inherited tensions to resolve (the audit — decide before/while editing)

These are load-bearing choices the synthesis may have left unsettled and the polish made look final. Each
carries a **provisional recommendation**; confirm or redirect (the readiness one, D1, is the proof this is worth doing).

- **A — `capability` lives in BOTH `kind` and `abstraction`.** The docs defend this three times as
  "intentional, not an inconsistency" — the over-defensiveness is itself a smell. *Provisional:* `capability`
  is most naturally an **altitude**; `kind:"capability"` may be droppable (a capability-altitude spec states
  some behaviour/workflow). Lean drop `kind:"capability"`; **low confidence — reason it through.**
- **B — `SpecPack` as a second authored primitive. → RESOLVED, see D3.** Reasoned through this session:
  *keep it* as a reified aggregate (it is not a `Spec`-lineage artifact, so no thesis violation; instantiation
  communicates intention; it is the recurring review unit). Membership single-sourced on the manifest; pack
  shared-vocabulary (`modelRefs` vs `sharedModel`) left open.
- **C — Curated vs mechanical-substrate two-surface model.** Heavily exposited (`06 §2`, `01` P10 corollary,
  `jtbd-07`) though the substrate is mostly aspirational. *Provisional:* keep the *principle* (curation ≠ drift;
  never densify from imports) which is load-bearing for P10; **trim** the elaborate tables/exposition to
  essence and mark the substrate clearly aspirational. Medium confidence.
- **D — `verification` facet vs derived delivery facts (post-D1).** Risk of overlap with derived `has-verifier`.
  *Provisional:* keep `verification` as design-time *intent* (mode + criteria), explicitly distinct from the
  derived fact. Confident; just needs the docs to state the line.
- **E — Relation-vocabulary overlaps.** `belongsTo` settled by D3 (it's the pack manifest's *derived* edge,
  not a competing member-authored relation). Remaining: `exemplifies` vs `verifies` (an executable example
  does both). *Provisional:* likely drop `exemplifies` (covered by `kind:"example"` + `verifies`/`refines`).
  Medium confidence.
- **F — Abstraction ladder depth (7 levels).** You just removed an over-specified ladder (readiness); the same
  lens applies here. *Provisional:* abstraction is a *free positioning field* (no quota, so less harmful than
  readiness was) — lean keep all 7, but confirm whether `initiative`/`operation`/`component` earn their place
  for the MVP or read as over-specification. Medium-low.

---

## Execution approach (for the next session)

Edit the **current** docs in place, using the review as a verified checklist (don't wholesale-copy its files —
D1 rewrites its readiness edits anyway). Apply to `docs/concept/` and `jtbd-stories/` (keep the folder name;
the review's `jtbd/` rename was packaging only). Order: resolve Tensions A–F → apply objective fixes + D1/D2
+ additional fixes → verify. **Critical files:** `docs/concept/02-core-model.md`,
`docs/concept/05-validation-and-honesty.md`, `docs/concept/01-…` (P8),
`docs/concept/06-consumers-and-projections.md` (D4 design-review projection), `jtbd-stories/04-keep-it-honest.md`.

## Verification (docs-only — no build/tests)

1. `grep -rn '</content>\|</invoke>' docs/concept jtbd-stories` → none.
2. `grep -rni 'capability:order\|adr:[0-9]\|api:POST\|sharedModel\|\bbound\b\|executable\|\bverified\b\|"interface"\|an decision' docs/concept jtbd-stories`
   → only intentional explanatory hits (e.g. prose explaining why `verified`/`executable` were retired; "verified by" view labels).
3. Cross-doc read-through: the `readiness`/`SpecKind`/`SpecAbstraction`/relation/namespace lists in `02` match
   every restatement in `01`/`07`/`jtbd-stories/01`/`jtbd-stories/04`; every example ID is grammar-valid and consistent.
4. No authored facet/relation can express a derived delivery fact; `02` still realises P4/P6/P7/P8/L9.

## Follow-ups

- **Ubiquitous-language glossary + decision diary** (the user noted this should have come first). Add
  `docs/concept/GLOSSARY.md` ratifying every term (`ready`, `implemented`, `has-verifier`, `observed`, the
  retirement of `bound`/`executable`/`verified`) and a lightweight ADR-style log of D1/D2 + the Tension A–F
  outcomes. **Recapture the rationale** the review session stripped (the *why* behind the readiness model,
  the two-surface model, `SpecPack`, the epistemic boundary) so inherited tensions stay visible and are not
  re-smoothed.

## Cleanup

`tmp-review/` is untracked scratch (review copies, report, diff, zip). Leave it in place for diffing; do not
commit it; do not delete without the user's say-so. No commit unless asked.
