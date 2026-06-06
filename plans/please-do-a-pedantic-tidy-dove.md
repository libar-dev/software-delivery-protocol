# Pedantic review & cleanup — Libar Omni concept specs + JTBD

> **Status:** PLAN ONLY — no doc edits this session. This document is the deliverable: it locks the
> decisions, records the model, and lays out the work precisely enough for a later session to execute
> against `docs/concept/` (9 files) and `jtbd-stories/` (9 files). Terminology here is **provisional**;
> a ubiquitous-language + decision-diary pass (see Follow-ups) ratifies it. The plan is **self-contained** —
> it depends on no external scratch (the ChatGPT review under `tmp-review/` was a transient input, now fully
> absorbed into the fixes below; nothing here references it).

---

## ⟐ RECONCILED TO THE RATIFIED LANGUAGE BASE (2026-06-06) — read this first

This plan predates the ubiquitous-language pass. **The single source of truth for terminology and the model is now
`docs/concept/ubiquitous-language.md` + `docs/concept/DECISIONS.md` (MD-1…MD-6).** Where this plan's *provisional*
terms or *structural* statements disagree with the base, **the base wins.** Read everything below this banner as
the *objective-fixes checklist and per-file cascade only* — apply terms from the **base ledger**, not from this
plan's older vocabulary.

### Frame (new since this plan was written)
Omni is an **executable, self-validating software-delivery protocol** (MD-1): instances **conform**; checks are
**conformance + honesty checks** (not "governance"/gates). **Phase 0 of the MVP = the process primitives as code**
(MD-3). This reframes the *why* of the fixes below; it does not change them.

### Rename map — apply across `docs/concept/` + `jtbd-stories/`
| old | → new | note |
|---|---|---|
| `abstraction` (field) | `altitude` | values also change (below) |
| readiness `sketch/framed/specified/designed` | `idea/scoped/defined` (`designed` folds into `defined`→`ready`) | 7-rung → 4-rung |
| readiness `bound/executable/verified` | **not readiness** — delivery facts `implemented`/`has-verifier`/`observed` | §4b |
| altitude `initiative/domain/capability/scenario/operation/component/contract` | retired as altitudes | only `epic/feature/story`; domain & capability → projections; `scenario` → `example` kind; `contract` → kind; operation/component deferred |
| `kind: "capability"` | retired as a kind | now the Capability Map projection |
| `kind: "interface"` | `kind: "contract"` | |
| `marker` | `anchor` | in-code pointer |
| `provenance` (field) | `claim` | values `declared`/`anchored`/`inferred` (`annotation`→`anchored`) |
| `satisfiedBy` (spec←code) | `satisfies` (code→spec) | direction flip |
| `exemplifies` | dropped | use `kind:"example"` + `refines` + `verifies` |
| `sharedModel` | `modelRefs` | |
| `handle` | `reader` | |
| `mechanical substrate` | `impact graph` | |
| `readiness profile` | `readiness floor` | checks *structure to derive a fact*, not the fact |
| `Facet` | `section` | typed detail-slice / extension surface (delegated pick, reversible) |
| `SpecPack` | `Pack` | |

### Structural supersessions (decided — do not re-open)
- Readiness = **4 rungs** `idea→scoped→defined→ready`; `bound/executable/verified` are **delivery facts** (§4b), not rungs. *(Supersedes this plan's D1 enum; the readiness↔delivery split itself stands.)*
- Altitude = **`epic→feature→story`**; **domain & capability are projections/groupings, not altitudes** *(reverses this plan's "domain-altitude ≈ bounded context"; MD-6)*; `scenario` is an `example`-kind Spec, not an altitude.
- `kind` = **8 values** `behavior/workflow/example/rule/constraint/model/decision/contract`; **`capability` dropped** as a kind; **NFR is a flavor of `constraint`**.
- Authored vs derived, **`anchor`**, **`claim`** (never collapsed), no-authored-delivery-facts → §4 / §4b / §6 are the authority.

### Verification greps (regenerated — each must return ZERO after the cleanup, modulo intentional retirement-prose)
```
grep -rniE '\babstraction\b|\bmarker\b|\bprovenance\b|\bhandle\b|mechanical substrate|sharedModel|satisfiedBy|exemplifies|readiness profile|\bfacet\b|specpack' docs/concept jtbd-stories
grep -rniE '\b(sketch|framed|specified|designed|bound|executable|verified)\b' docs/concept jtbd-stories
grep -rniE 'kind:\s*"(capability|interface)"|abstraction:\s*"(initiative|domain|capability|scenario|operation|component|contract)"' docs/concept jtbd-stories
grep -rniE 'capability:|adr:[0-9]' docs/concept jtbd-stories
```
(Run alongside this plan's original objective-fix greps where still term-valid.)

### Execution sequencing (from the cross-doc inventory)
Two-pass, **biggest blast-radius first**: **(1)** schema/enum rewrites — `02-core-model.md`, `05-validation-and-honesty.md`, `jtbd-stories/01`, `jtbd-stories/04`; **(2)** mechanical renames across the rest; **(3)** conceptual reframing — domain/capability/scenario as projections, delivery facts as derived. Then run the greps → delete this plan → archive `GLOSSARY.md` + `UBIQUITOUS_LANGUAGE_1.md`.

> Everything below is the **original plan body**, kept for its objective-fixes checklist and per-file cascade.
> Its terminology is superseded by the rename map above; its structural decisions stand except where the
> "Structural supersessions" list overrides them.

---

## Context

`docs/concept/` and `jtbd-stories/` describe one design system: a **TypeScript-canonical delivery-lifecycle
model** on a single enrichable `Spec` primitive, derived into **one regenerable graph**, kept **honest by CI**,
and projected to its consumers. The goal of this pass is a pedantic cleanup that keeps the model **lean enough
to be MVP essence** yet **shaped to enrich later**, with special attention to the domain model and
`02-core-model.md`.

**The animating finding — "false settledness."** The model was synthesized from a prototype experiment plus a
prior analysis, then *polished*. The polish stripped the synthesis's "still-settling" flags and its entangled
rationale — so the docs now read as finished spec, and **inherited-but-unresolved tensions look like settled
decisions**. The readiness conflation (D1) is the proof: it is a real, load-bearing mistake hiding in plain
sight. This cleanup therefore does two things at once — fix surface inconsistencies **and** re-open the
load-bearing choices the polish smoothed over (now resolved below), and it commissions a decision diary to
**recapture the stripped rationale** so the choices stay visible (Follow-ups).

---

## Decisions locked

### D1 — Separate design maturity (`readiness`) from delivery facts (derived) *(the central change)*
The original `readiness` ladder (`sketch→framed→specified→designed→bound→executable→verified`) **merged two
different progressions**: author-claimed **design maturity** (`sketch…designed`) and machine-observed
**code/delivery status** (`bound/executable/verified`). That is the very linear pipeline P8 says the model must
not be. Resolution:

- **`readiness` = design maturity only**, authored: `sketch → framed → specified → designed → ready`.
  `ready` ≈ "reviewed in context (D4) and implementation-ready." Its **validator profile**: `designed`
  satisfied · no *blocking* open questions · all relations resolve · every `dependsOn`/`refines` target is
  itself ≥ `designed` (nothing in the design blocks a build agent from picking it up).
- **Delivery facts = derived, never authored**, computed from graph edges, shown as badges:
  - `implemented` — ≥1 `satisfies` annotation edge (from a code marker) resolves to the spec;
  - `has-verifier` — ≥1 enabled `executable`-mode verifier resolves via a `verifies` edge (a test marker's
    annotation edge, or an executable example spec that itself `has-verifier`);
  - `observed` — runtime-evidence overlay (ASPIRATIONAL).
- `bound`/`executable`/`verified` **leave the readiness enum**: `bound`→ derived `implemented`;
  `executable`/`verified` → derived `has-verifier` (+ future `observed`). Verifier-absence on a spec is a
  surfaced **gap-warning**, never a readiness rung. *(`executable` survives only as a `verification.mode`
  value and in the `has-verifier` derivation — not as readiness.)*

*Why:* matches the epistemic boundary ("humans assert intent; machines assert structure"); consistent with
"bindings are marker-derived" (D-fix below); and unlocks queries the merged ladder cannot express —
`ready ∧ ¬implemented` (the build backlog) and `implemented ∧ ¬ready` (**code ran ahead of design — a drift
alarm**). Adds no quota; P4's "significance governs detail" is untouched.

### D2 — `02` depth: explicit facet types, trimmed to essence
Keep `02` expressed as concrete TypeScript (a standing, intentional choice — the docs double as the
implementation spec until the code can hold it; the implementation-agnostic split is a *recorded future
direction*, not this pass — see Strategic theme). Give each facet an explicit type — `IntentFacet`,
`BehaviorFacet`, `ConstraintFacet`, `DomainModelFacet`, `DesignFacet`, `DecisionFacet`, `VerificationFacet`,
`UiFacet` — but:

- replace undefined placeholder generics (`Ref<NodeId>`, `Ref<ComponentId>`, `ModelConceptId`, `ExampleRef`)
  with **plain branded-ID strings**;
- present `DomainConcept.kind` as an **open/illustrative** list, not a closed enum;
- keep the model facet **vocabulary only** (terms + concepts), explicitly *not* ORM/schema/event-sourcing design.

Lean MVP surface, flexible later.

### D3 — Keep `SpecPack` as a reified grouping (do not fold)
A pack is an **aggregate over specs**, not a delivery artifact in the `Spec` lineage — so it does **not**
violate the one-primitive thesis (which forbids migrating *artifact types*, not having a grouping concept).
Reifying the grouping (`specPack({...})`) communicates intention more clearly than scattering membership across
members, and the pack is the ever-present **review unit** (a spec is always reviewed against ≥1 related set; a
spec may belong to many packs). **Membership is single-sourced on the pack's `specs: [...]` manifest**; the
`member → belongsTo → pack` edge is **derived** from it, never separately hand-authored. Shared vocabulary is
expressed via **`modelRefs`** (references to `kind:"model"` specs — one source of truth), never inline
`sharedModel` (which would duplicate a model-spec's truth).

### D4 — Design-review projection as the flagship curated view (concept core; rendering grows)
The primary human/agent surface is a **design-review projection**: it renders a spec/pack **in context** — its
relations to neighbouring designed/implemented specs, bindings, decisions, readiness + derived delivery — plus
review affordances (auto-generated **design questions** derived from blocking open questions + validator
gap-warnings, and a **findings** table). It is generated from the graph (pure projection, regenerable, no second
source); the **same artifact is core context for human review *and* agent implementation sessions.** It is the
surface at which a spec earns `ready` (ties **D1** — `ready` = "reviewed in context") and the rendered form of a
pack (ties **D3** — the pack is the review unit). Findings resolve through the edit loop (intent → agent → git,
`06` §4), not a stored `Finding` type — **no new model primitives.** *Concept is core; rendering grows:* the MVP
renders the relationship slice from the curated graph; rich sequence/component diagrams are aspirational depth
(they need a richer sequence/runtime annotation layer the MVP defers). This sharpens `06`'s vague "one read-only
view" into a purpose.

### D5 — The coding-agent read surface: a visible typed graph the agent *scripts* (no verb wall)
The single highest-leverage decision for execution of every coding-agent session. The realistic agent has an
RL-trained prior to grep / write ad-hoc scripts, and **cannot see into** an opaque verb API — so it avoids the
API and greps anyway. Don't fight the prior — **feed it:** point the scripting instinct at a *visible, typed
graph* instead of raw source.

- **The graph is a visible, self-describing artifact** the agent reads/greps/parses directly — *the schema file
  IS the contract* ("read it, then script freely"). (Graph *data* is gitignored-regenerable; the *schema/code*
  is committed and visible.)
- **One canonical schema for the whole read-only graph**, richly typed (branded IDs; discriminated unions on
  node/edge kind; provenance + derived facts typed). **No per-projection schemas.** *Proven failure mode:*
  leaving a slice of the data untyped makes it *invisible* to an agent reading the contract — it concludes the
  capability doesn't exist. **The type IS the discovery surface; under-typing hides a capability.**
- **A thin typed loader/handle** doing joins + taxonomy-decode *once* at construction, returning plain
  composable data; authors/persists nothing (a front door, not a store) — "not 30 verbs, not raw-JSON-you-rejoin."
- **Freeze a view only where the agent would hand-roll it wrong** — entry adapters (the grep→graph bridge:
  by-concept / by-file / by-symbol) + irreducible cross-source joins. Everything else *scripts*.
- **The CLI is the agent's transport** — a typed CLI over the visible graph is the perfect coding-agent surface;
  **the coding agent never goes through MCP** (verb-mediated access fights the scripting prior — see D6).

**Push, don't pull, for the common case (ties D4):** the harness pushes the *design-review slice* for the task
into context at session start; the agent scripts the visible typed graph only for the long tail. **D4 is the
push; D5 is the pull; together they retire the verb-wall for coding agents.** And it tracks model capability —
freeze *less* as models improve. This **re-leads `06` §3**: from "a typed handle whose method list is the docs"
to "**a visible typed graph the agent scripts, plus a pushed slice**," the handle demoted to the thin
join/decode layer, and §3's "self-contained slices = aspirational" reconciled with D4 (the design-review slice
is core).

### D6 — MCP as the integration surface for user-facing apps (designed-in; deferred build; shape TBD) *(new)*
The MCP is the **integration point for user-facing apps** (Architect Studio and the rest) — a distinct consumer
from D5's coding agents. The unifying principle is **match the surface to the consumer:** coding agents *script*
a visible typed graph (D5, no verb wall); user-facing apps *integrate* through MCP. (Coding agents do not go
through MCP — verb-mediated access fights the scripting prior.)

Two commitments, and one deliberate **non**-commitment:

- **Designed-in, not bolted-on.** MCP is *one more projection consumer of the one read model* (P2) — no second
  store, no domain logic of its own. Because it is just another projection, designing it in now is nearly free,
  so the rest of the implementation should leave room for it as a first-class consumer surface.
- **Deferred build.** Not in the early MVP slices; in scope at the *design* level only, so the architecture
  accommodates it.
- **Shape deliberately left open.** *How* the MCP is shaped — its operations, session/transport model, what it
  exposes — is a **fresh design**, intentionally **not** specified here and **not carried over from any prior
  implementation.** Nothing in this plan prescribes its surface. (A dedicated MCP-design pass owns that.)

*Status:* DESIGNED-IN (named consumer surface) · deferred build · concrete shape TBD. This elevates MCP in
`06`/`00` from "aspirational afterthought" to "a first-class integration surface for user-facing apps —
deferred build, shape to be designed."

---

## Strategic theme — conceptualize implementation-agnostically (recorded direction, not this pass)

The concept docs carry **leaked implementation detail** (TS type definitions, DSL constructors, `@akg/spec`
imports, `ts-morph`, field-level shapes, graph JSON) that entered during the prototype synthesis and was kept
deliberately. At inception a conceptual/domain design should ideally be expressed **implementation-agnostically**,
with implementation/representation in a separate layer — and the docs already name the **Principle vs
Representation** split but over-index on Representation. **Not undoing this now (user's call):** the docs keep
their implementation detail (they double as the implementation spec). Recorded as a high-value future direction —
separate an implementation-agnostic *concept/domain* layer from a *representation/implementation* layer — and the
natural companion to the glossary/decision-diary follow-up. The readiness conflation (D1) and this leakage share
one root cause: **the model was never fully conceptualized apart from the prototype that birthed it.**

---

## The model (the "flow") — locked

**One `Spec` primitive**, enriched in place; significance governs detail (no tier-filling).

- **`abstraction`** (authored) — one **intent-altitude** scale: `domain · capability · feature · scenario`.
  *(Trimmed from 7 — see resolved Tension F.)* Structural granularity (operation/component) lives in the code
  layer (`impl:`/`component:` nodes + markers); portfolio level (`initiative`) re-adds later via L9 if needed.
  `contract` is NOT here (it is a kind).
- **`readiness`** (authored) — design maturity: `sketch → framed → specified → designed → ready` (D1).
- **Delivery facts** (derived) — `implemented` / `has-verifier` / `observed`. Never authored (D1).
- **`SpecKind`** (one per spec): `capability · behavior · workflow · example · rule · constraint · model ·
  decision · contract`. `capability` intentionally appears in both `kind` and `abstraction` — they answer
  different questions and vary independently (a `kind:"capability"` spec can sit at `abstraction:"domain"`).
  *State this once, plainly (resolved Tension A).*
- **Facets** (all optional, explicit types per D2): `intent`, `behavior`, `constraints[]` (flavors
  `quality·security·performance·compliance·operational·policy` — **no `business`**, which is a `behavior.rule`
  or `kind:"rule"`), `model` (`DomainModelFacet` = terms + concepts; vocabulary only), `design`, `decision`
  (`DecisionFacet` = context/chosen/rationale/alternatives/consequences — decisions are first-class specs, so
  they carry their ADR content here), `verification` (**`mode` + `criteria` only** — design-time intent; never
  asserts a verifier exists), `ui` (aspirational). **Removed from the authored shape:** `runtime`, `bindings`,
  `evidence`, `verification.tests`, `tags`.
- **IDs:** all authored truth is `spec:*` regardless of kind (incl. `spec:decisions.*`); non-spec nodes use
  `pack:` · `impl:` · `api:` · `test:` · `component:` · `doc:` (`doc:` **only** for an external document linked
  from a decision spec, e.g. `doc:adr-order-lifecycle`). Grammar-compliant lowercase dotted/kebab; `#fragment`
  addresses a sub-part, not a child spec. No `capability:*`/`adr:*`.
- **Authored relations (declared):** `refines · dependsOn · constrainedBy · decidedBy · verifies · supersedes`.
  - `belongsTo(pack)` is **derived** from the pack manifest, not authored (resolved Tension E). Capability
    membership is expressed by `refines`.
  - `satisfies` is an **annotation** edge from markers, not authored.
  - `exemplifies` is **dropped** (covered by `kind:"example"` + `refines` + `verifies`) (resolved Tension E).
  - `verifies` is authored on example/scenario specs **and** emitted as an annotation edge from test markers —
    same edge type, distinct provenance, never collapsed (P9).
- **Graph:** flat nodes/edges; `nodeType` + `specKind` (no overloaded `kind`); provenance
  `declared | annotation | inferred`, never collapsed.
- **Validation (CI fails on error):** referential integrity · duplicate IDs · readiness-profile completeness
  (**design-maturity rungs only**, `sketch…ready`; a lean **base profile** plus a small kind-aware requirement
  where a kind genuinely differs — constraint→parseable `target` at `specified`, example→given/when/then at
  `specified`, model→term definitions; the full per-kind overlay matrix is deferred) · orphan detection ·
  `verifies` linkage (resolution; absence = gap-warning, not a gate) · **authoring-shape honesty** (no authored
  `runtime`/`bindings`/`evidence`/`verification.tests`; no authored delivery-fact claims) · deterministic pack
  coherence (member refs + `modelRefs` + referenced terms resolve; duplicate member IDs fail — **drop** the
  semantic "duplicated intent" check).
- **Consumers:** **D5** coding-agent surface (a visible typed graph the agent scripts via the CLI; one canonical
  schema = discovery; freeze only the irreducible) + the **D4** design-review slice pushed into context for the
  common case + **D6** the MCP integration surface for user-facing apps (designed-in; deferred build; shape TBD) · edits as
  *intent → agent → git → CI* (no patch loop — the view is a process-manager/orchestrator, not an editor).
  **MVP impact rides the curated graph only** (changed files → specs via markers →
  dependents via declared edges); the import/symbol substrate is **Iterate** (resolved Tension C). **MVP:** one
  bounded context, ~8–12 specs.

---

## Objective fixes to apply (self-contained checklist)

All confirmed against the current docs; none is a matter of taste.

1. **Remove stray `</content>`/`</invoke>` tags** (LLM-generation junk) from the docs that have them — grep-
   confirmed: `README`, `00`, `01`, `02`, `03`, `04`, `05` (concept `06`/`07` are already clean).
2. **Founding Principle #4 (README).** The headline "the graph is code in the repo" contradicts #2 ("the graph
   is derived and regenerable"). Reword the headline so #4 keeps its *distinct* point — *truth is authored as
   code in the repo, not in an external tool* — and **keep its body** (intent/structure/relationships live as
   committed code). Do not collapse it into #2.
3. **Unify IDs / namespaces.** Drop the `capability:*` and `adr:*` second identity systems (both are specs →
   `spec:*` / `spec:decisions.*`); `api:POST:/orders` → `api:orders.post`; `impl:CreateOrderUseCase` →
   `impl:orders.create-order-use-case`; `capability:order-management` → `spec:orders.order-management`. Update
   the namespace list in `02` §5, the worked examples in `02`, the graph example in `03`, the examples + repo-
   shape in `04`, and the running-domain list in `README`.
4. **One-way, derived bindings.** Remove the authored `runtime` and `bindings` facets; code/runtime/test links
   are marker-derived **annotation** edges (`satisfies`, `verifies`) — one-way (code → spec). Add the
   **authoring-shape honesty** validator (`05`).
5. **Remove the authored `evidence` facet** (evidence is observed, never authored).
6. **Reframe `verification`.** Remove authored `verification.tests`; the facet carries `mode` + `criteria` only
   (design-time intent). Verifier *presence* is the derived `has-verifier` fact. Authoring-shape honesty forbids
   authored `verification.tests`.
7. **`nodeType` + `specKind`** in graph JSON (de-overload `kind`).
8. **`interface` kind → `contract`**; remove `contract` from the abstraction ladder (it is a kind).
9. **First-class domain model.** Add `kind:"model"` + a lightweight `DomainModelFacet` (terms + concepts;
   vocabulary only); packs reference via `modelRefs`, not inline `sharedModel`.
10. **Add the `decision` facet** (`DecisionFacet`). Decisions are first-class specs (`kind:"decision"`,
    `spec:decisions.*`), so they carry their ADR content (context/chosen/rationale/alternatives/consequences)
    here; the old external `adr:*` link is replaced (a `doc:` link remains only for a genuinely external
    document).
11. **ConstraintFacet flavors** = `quality·security·performance·compliance·operational·policy` (drop `business`
    → `behavior.rules`/`kind:"rule"`).
12. **Deterministic pack coherence** (member refs + `modelRefs` + referenced terms resolve; duplicate member IDs
    fail) — drop the semantic "duplicated intent" check.
13. **`--check-clean` wording** — assert against a fresh rebuild, not a *committed* generated artifact (`generated/`
    is gitignored, L8).
14. **`spec:payment.*` → `spec:payments.*`** (match the `/specs/payments/` folder); **`contains`** (not a
    relation) → `refines` / derived `belongsTo`.
15. **Remove over-specific/temporal claims from doc prose** (`~⅕ tokens`, `<~50 specs`, `~10k+ nodes`,
    "single-digit to a quarter", "multi-quarter") → principle-level wording ("MVP scale", "until measured
    traversal pain", "a deliberately small curated selection"). The measured figures are kept as **evidence in
    the decision diary**, not as doc prose.
16. **Typo:** ensure `jtbd-stories/03-one-graph.md` reads "**a** decision spec" (not "an decision spec").
17. **Drop `tags?: string[]`** from the `Spec` envelope (unstructured, low-signal).

### The D1 cascade (apply the readiness/delivery split everywhere)

- **`02`:** readiness enum (`sketch…ready`) + a new **"Derived delivery facts"** subsection
  (`implemented`/`has-verifier`/`observed`); worked examples use design-maturity values; `verification` reframed.
- **`01`:** P8 reworded — two *authored* axes (abstraction × design-maturity readiness); delivery is a *derived*
  dimension, not a readiness rung.
- **`03`:** graph example node carries a maturity `readiness`; delivery facts are computed from edges.
- **`05`:** profiles cover design-maturity rungs only (include the **`ready`** row from D1); verifier-absence =
  gap-warning; add the authoring-shape honesty validator.
- **`06`:** re-lead §3 around **D5** (visible typed graph the agent scripts) + **D4** (pushed design-review
  slice) + **D6** (name the MCP integration surface for user-facing apps as designed-in / deferred-build,
  distinct from the coding-agent surface — without prescribing its shape);
  demote the "typed handle" to the thin join/decode layer; freeze only the irreducible; reconcile "slices =
  aspirational" with D4; view shows readiness + derived delivery badges; trim the two-surface tables to essence
  (resolved Tension C).
- **`07`:** CORE map "through `ready`"; cut list + open questions updated — substrate = Iterate (resolves "how
  thin a substrate in the MVP"); MCP noted as designed-in (deferred build).
- **`00`/`README`:** lifecycle sentences ("idea → … → verified evidence" → "idea → … → `ready`; delivery facts
  derived"); elevate MCP from deferred-afterthought to a first-class integration surface for user-facing apps
  (deferred build, shape TBD).
- **`jtbd-stories`:** `01` (A2/A4 readiness lists; drop bindings/runtime facets), `02` (B1 markers emit
  `satisfies` annotation), `03` (graph readiness; `contains`→`refines`; the "a decision" typo), `04` (D1/D2
  readiness → design maturity; verifier presence = `has-verifier`), `05` (E2 surface = visible typed graph +
  scripting; note MCP is a *separate, later-designed integration surface for user-facing apps*), `07` (G1 impact = curated-only MVP;
  G3 substrate = Iterate; G2 `verifies`/`has-verifier`), `README` (scope sentences + surfaces).

---

## Resolved design decisions (the former tensions A–F)

These were load-bearing choices the synthesis left unsettled and the polish made look final. Now decided:

- **A — `capability` in both `kind` and `abstraction`. → Keep.** They answer different questions and vary
  independently (a `kind:"capability"` spec can sit at `abstraction:"domain"`). The smell was the *over-
  defensiveness* (defended three times), not the dual presence — **state the rationale once, plainly**, and cut
  the repetition.
- **B — `SpecPack` as a second primitive. → Keep (D3).** A reified aggregate, not a `Spec`-lineage artifact;
  membership single-sourced on the manifest; shared vocabulary via `modelRefs`.
- **C — Curated vs mechanical-substrate. → Keep the principle, trim the exposition, defer the substrate.** The
  *principle* (curation ≠ drift; never densify the curated graph from imports) is load-bearing for P10 — keep it,
  stated once. Trim the elaborate `06` §2 tables to essence. **MVP impact rides the curated graph only**; the
  exhaustive import/symbol substrate (and its propose-candidates / flag-drift assist roles) is **Iterate**.
- **D — `verification` facet vs derived `has-verifier`. → Distinct.** `verification` is design-time *intent*
  (`mode` + `criteria`); `has-verifier` is the derived fact. Drop authored `verification.tests`. State the line.
- **E — Relation overlaps. → Resolved.** Drop `exemplifies` (covered by `kind:"example"` + `refines` +
  `verifies`). `belongsTo` is pack membership **derived** from the manifest (capability membership = `refines`);
  it leaves the authored-relations list.
- **F — Abstraction ladder depth. → Trim to one intent scale:** `domain · capability · feature · scenario`. The
  old 7-level ladder mixed three scales — intent altitude, example-concreteness, and structural granularity —
  the same "merged progressions" disease D1 cured for readiness. Structural granularity is the code/component
  layer (`impl:`/`component:` + markers), not spec abstraction; `initiative` (portfolio) re-adds later via L9
  (enums grow additively) when an aspirational feature needs it.

---

## Execution approach (for the next session)

Edit the **current** docs in place. Apply to `docs/concept/` and `jtbd-stories/` (keep both folder names).
Order: apply the resolved decisions A–F + D1–D6 + the objective fixes (incl. the D1 cascade) → verify.
**Critical files:** `docs/concept/02-core-model.md`, `docs/concept/05-validation-and-honesty.md`,
`docs/concept/01-…` (P8 / FP context), `docs/concept/06-consumers-and-projections.md` (D4 + D5 + D6),
`docs/concept/00-…` + `README` (lifecycle + MCP elevation), `jtbd-stories/04-keep-it-honest.md`.

## Verification (docs-only — no build/tests)

1. `grep -rn '</content>\|</invoke>' docs/concept jtbd-stories` → none.
2. `grep -rni 'capability:order\|adr:[0-9]\|api:POST\|sharedModel\|\bbound\b\|\bverified\b\|"interface"\|an decision\|\bcontains\b' docs/concept jtbd-stories`
   → only intentional hits: prose explaining why `bound`/`verified` were retired, and "verified by" view labels.
   *(Note: `executable` legitimately survives as a `verification.mode` value and in the `has-verifier`
   derivation — do not purge it.)*
3. Cross-doc read-through: the `readiness` / delivery-fact / `SpecKind` / `SpecAbstraction` / relation /
   namespace lists in `02` match every restatement in `01`/`07`/`jtbd-stories/01`/`jtbd-stories/04`; every
   example ID is grammar-valid and consistent.
4. No authored facet/relation can express a derived delivery fact; `02` still realises P4/P6/P7/P8/L9.

## Sequencing & follow-ups

**Recommended order: ratify the language *before* executing the cleanup (2 → 1).** This plan has already made the
*structural* decisions (D1–D6, the resolved tensions, the model); what remains genuinely *provisional* is
**terminology** — exactly the glossary's job. Settle it in one ~1-page file first, then the cleanup is a
near-mechanical pass that *applies* ratified terms (and the verification greps key off them). The rework
asymmetry decides it: a term change is one line in the glossary now, versus a re-sweep across ~18 files later —
and several terms are still soft (`ready`; the delivery-fact names incl. `has-verifier`; the **`model` overload**,
where facet-name, `kind`, and the domain concept collide). DDD orthodoxy and the "this should have come first"
instinct agree. The ubiquitous-language pass is seeded by *this plan + the concept docs*, not a live conversation.

Full sequence: **2** ratify glossary → **1** execute this cleanup → **3** implementation-agnostic split (move
representation detail out of the concept docs) → **4** build MVP phase 1. Step **3** is deferrable — the docs keep
their implementation detail by design (D2), so it need not block **4**.

- **Ubiquitous-language glossary (step 2 — pre-execution).** Add `docs/concept/GLOSSARY.md`: opinionated
  canonical choices for every term (`ready`, `implemented`, `has-verifier`, `observed`; the retirement of
  `bound`/`executable`/`verified` as readiness; the `model` facet/kind/concept disambiguation), residual synonyms
  flagged.
- **Decision diary (parallel, ongoing).** A lightweight ADR-style log of **D1–D6** + the **A–F** outcomes that
  **recaptures the rationale** the polish stripped (the *why* behind the readiness model, the two-surface model,
  `SpecPack`, the epistemic boundary, the agent/MCP surface split) so the choices stay visible and are not
  re-smoothed. It also holds the **measured evidence figures** (the ~⅕-token result, etc.) and **external
  reference examples** (the live design-review + playground artifacts) as evidence — not in doc prose.
- **Implementation-agnostic concept/representation split (step 3)** — recorded direction (Strategic theme).
