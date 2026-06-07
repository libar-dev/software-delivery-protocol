# Ubiquitous Language — Libar Omni (ratified canonical base)

> **Status: RATIFIED CANONICAL BASE.** Built section-by-section in the language grill; now the sole canonical
> source for terminology and the model.
> Sources triangulated during ratification: the concept docs + JTBD stories + **RUP** (UMA meta-model + glossary)
> + the **pm-skills** PM/requirements vocabulary.
>
> **Method (do not skip):** *define the concept → contextualize it → accept the definition → only then attach a
> term.* Names were parked until their concept locked. Each substantive block below is now tagged **[SETTLED]**.

## Governing rubric  [SETTLED]
- **Adopt the established delivery *noun*** for any concept Omni shares with the industry. Coin/keep a distinct
  word only for a genuine differentiator — and then the word must *name the difference*.
- **Reject process *state-machine / lifecycle gating*** (sprint/ticket FSM, mandatory phase gates). Adopt the
  process *nouns*, not the process *gates*.
- **Two naming tests:** (a) carry epistemic status where it matters (authored vs derived, claimed vs computed);
  (b) concrete & unambiguous to all three readers — typed code/CLI, the coding agent, and a Studio user. One
  concept → one word; the rest are *aliases to avoid*.

## §0 — Thesis: what we are building  [SETTLED · frame confirmed]  · (noun = **process**; "protocol" retained only as the MD-5 system-naming candidate, deferred to the system-naming pass)
Omni is a **typed, executable meta-model of the software-delivery process.** Teams author delivery intent as
*instances* of a small set of process primitives; the meta-model — **code in the repo** — deterministically
validates those instances' **conformance and honesty** and derives **one graph**; every other artifact (views,
Mermaid diagrams, API references, context bundles) is a **projection** of that graph.

The innovation is not *executable specs* (BDD has those) — it is an **executable, self-validating delivery
process**: the process building blocks are code, and instances **conform** to it (conformance checked, never gated).

> **Naming note:** the design noun in this base is **"process."** `"protocol"` remains only as the deferred MD-5
> system-naming candidate because it captures the conformance-contract aspect, but it is not an open terminology
> question here. See `docs/concept/DECISIONS.md` MD-5.

**Two honesty guardrails on "self-validating" (so we don't re-import what we rejected):**
1. **Checks conformance & honesty — not content-quality, not workflow.** The meta-model deterministically checks
   *well-formedness* (required detail present, references resolve, readiness *stated* honestly, authored vs derived
   kept separate). It must not adjudicate whether a design is *good* (human/agent judgment) and must not gate
   *workflow* (the RUP/FSM trap, already rejected). It is a **contract instances conform to** — invariants over the
   graph, not a controller.
2. **"Deterministically validated," not "provably correct."** Conformance to the typed meta-model is provable;
   real-world correctness of the design is not. Claim the former, never the latter.

> §0 frame **ratified 2026-06-07** (the thesis + both guardrails + the three levels). The wording here is settled:
> this base uses **"process"**; `"protocol"` is parked only for the system-naming pass in MD-5.

## §1 — The meta-levels  [SETTLED]
Three levels, kept clean (RUP/UMA/MOF lineage, made executable):

| Level | What lives here | Role | When built |
|---|---|---|---|
| **Process meta-model** | the primitive, its descriptors, the specialization classes, the relation set, the validators — **as typed code in this repo** | **defines the conformance contract** | **Phase 0 of the MVP** |
| **Authored model** | a project's authored intent (its instances) — instances of the classes above | **conforms (checked)** | per project |
| **Derived facts** | machine truth about the authored model (code realises it · a verifier exists · runtime observed it) | **derived, never authored** | per project |

- **Phase 0 = build the meta-model as code** — not a detour: the extractor, the graph schema, and every validator
  already presuppose it.
- **Self-hosting (later, not Phase 0):** Omni's own repo is an authored model governed by its own meta-model —
  literal self-governance by bootstrap. A milestone, not a Phase-0 claim.

## §2 — The primitive (`Spec`) & its boundary  [SETTLED]
**Concept:** the one kind of thing a human authors directly — a durable, **enrich-in-place** statement of intended
truth about the system being built, made more precise *in place* (never migrated to a different artifact type)
until it is precise enough to implement. It is the only authored **truth**-primitive; everything the machine
reports about it is **derived**. (Two *other* things are authored but are not truth-primitives — see the boundary.)

Positioned by **three descriptors** (lowercase literals in code, recognized display labels). The familiar delivery
nouns are **named coordinates**, not separate authored types — the one-primitive bet, every recognizable noun
preserved:

| Descriptor (field) | Behaves like | Values |
|---|---|---|
| **`kind`** — category of truth | a **true subtype** (discriminated union — changes required detail + validation) | the 8 below |
| **`altitude`** *(was `abstraction`)* — size | a **position** — same shape, different scope | `epic` → `feature` → `story` |
| **`readiness`** — design maturity | a **position** — same shape, different completeness | `idea` → `scoped` → `defined` → `ready` (`ready` has a **readiness floor**, §6) |

**`kind` — the 8 specializations** (literal → display):

| `kind` | display | note |
|---|---|---|
| `behavior` | Use Case / Behavior | broader literal; "Use Case" is the familiar display |
| `workflow` | Workflow | multi-step process / journey |
| `example` | Example / Scenario | a **Scenario** is a low-altitude `example` that `refines`/`verifies` a Story — *not* an altitude |
| `rule` | Business Rule | |
| `constraint` | Constraint (NFR) | **NFR** is a *flavor* (performance / quality / security / …), not a separate kind |
| `model` | Domain Model | |
| `decision` | Decision Record | |
| `contract` | Contract | |

- `kind` is the genuine specialization; **`epic`/`feature`/`story` are altitude positions, not subtypes.** A
  **Scenario** is not an altitude — it is a low-altitude `example`-kind primitive that `refines`/`verifies` a Story.
- **`capability`** and **domain / bounded-context** are *not* kinds or altitudes — they are **projections** (a
  *Capability Map* over high-altitude `behavior` primitives) and/or **groupings (packs)**. Epic is the altitude
  ceiling; above-Epic (initiative/theme) defers, additive later.
- *"Executable Spec"* = an `example` that **has a verifier** (a delivery fact), not a readiness rung.
- The delivery nouns are first-class in the **language and in Studio surfaces/projections** — never separate
  authored primitives.

### The envelope & sections  [SETTLED]
A `Spec`'s **envelope** — `id` · `title` · `kind` · `altitude` · `readiness` · `relations` — is the stable,
minimal outer shape; it changes almost never. All other detail lives in optional, typed **sections** — the
**extension surface**: the system grows by adding sections (or enum members), never by reshaping the envelope.

Sections (all optional; each carries one concern, mapping to a discipline): `intent` · `behavior` · `constraints`
· `model` · `design` · `decision` · `verification` · `ui`. A **readiness floor** (§6) requires the right sections
to *state* a given rung.

**Section ⟷ kind — when a concern is inline vs. its own primitive  [SETTLED].** Three sections
(`constraints` · `model` · `decision`) have a same-named `kind` twin, so the same concern can live two ways. The
trigger: keep it **inline as a section** when it is **local detail** of its host `Spec`; **promote it to a
standalone `Spec` of the matching `kind`** (linked by `constrainedBy` / `decidedBy` / `modelRefs`) when it is
**referenced by >1 `Spec`, or needs its own identity / lifecycle / review.** `modelRefs` on a `Pack` always points
at standalone `kind:"model"` specs — shared vocabulary is never inlined twice. *(The core-model doc `02` states
this once for builders; it is not scattered across the other docs.)*

> **Name note:** **`section`** replaces the disliked **"Facet"** — **locked** (blessed 2026-06-07; chosen over
> `aspect`/`facet` for cross-audience legibility: "the Design section of this Spec" reads naturally to code, the
> coding agent, and a Studio user).

### The boundary — what is *not* the primitive  [SETTLED · concept]
A human authors **three** things; only the first states system truth. Everything else is **derived**.

**Authored, but not the truth-primitive:**
- **the `Pack`** *(the grouping / review unit; was "SpecPack")* — a named authored **aggregate** over primitives; the recurring
  unit of review/ideation (a primitive is always assessed in the context of its related set). It states **no truth
  of its own** — it *references* model primitives, never owns vocabulary. A primitive may belong to **many**;
  membership is authored on a manifest, and the membership edge is **derived** from it. Distinct from *refinement*
  (below). It is the unit a **Design Review** renders "in context."
- **the anchor** *(was "marker")* — a human-written pointer **in source code** to a primitive's **ID**. Carries
  **identity only, never intent**; lives in code, not spec files; yields an **`anchored`**-claim binding edge.

**Two grouping mechanisms, kept distinct:** *refinement* (a parent primitive → its children — authored truth that
happens to have descendants) vs *the aggregate* (the cross-cutting review collection — no truth of its own; may
span or sub-slice the refinement hierarchy).

**Derived, never authored:** code/structure/runtime nodes (impl · api · component · test · …) and the derived
edges/facts (`satisfies`, `has-verifier`, `observed`, derived membership). The primitive *links to* these; it
never authors them.

## §3 — Relations  [SETTLED · concept] · verb-form names ratified
**Concept:** an **authored, typed, directed edge** between two authored primitives — a *human-asserted* connection
(the intent half of the graph). Distinct from *derived* edges (binding, membership, structural).

**Authored relations** (verb forms read correctly as directed edges; UML/RUP-aligned):

| Relation | Direction | Means | Anchor |
|---|---|---|---|
| **refines** | child → parent | a more precise child; also how altitude descends (Story refines Feature refines Epic) | RUP *Refinement* / UML «refine» |
| **dependsOn** | dependent → dependency | needs another primitive to hold | RUP *Dependency* |
| **constrainedBy** | bounded → constraint | bounded by a rule / NFR / policy primitive (a *typed* dependency) | — |
| **decidedBy** | shaped → decision | shaped by a Decision Record (a decision primitive; `doc:` only for a genuinely external ADR) | RUP *Trace* |
| **verifies** | verifier → target | an example/scenario verifies a target — *also* emitted derived from a test **anchor** (**same type, different `claim`, never collapsed**) | UML «verify» |
| **supersedes** | new → old | current forward-pointer between two Decision Records that both still exist (not history — git holds that) | — |

**Derived (mechanics in §4/§5):** `belongsTo` (→ grouping, from the manifest) · `satisfies` (code → primitive,
from the anchor). **Dropped:** `exemplifies` (= example-kind + `refines` + `verifies`).

Granularity calls (decided): **`constrainedBy` and `decidedBy` kept distinct** — "bounded by an NFR" and "shaped
by a decision" are high-value, separately-queryable intents that a generic `dependsOn` would flatten.

## §4 — The authored / derived split  [SETTLED · concept; names locked: `anchor`, `claim`]
**The boundary** *(working name "epistemic boundary"; a friendlier Studio name is a minor open item)*: humans
assert **intent**, machines assert **structure**, and the two are **never confused** — the single most
load-bearing invariant Omni enforces.

**Everything in the graph is a `claim`**, and every node/edge carries *what kind of claim it is*. Claims are
**never collapsed** (a `declared` truth is never silently "satisfied" by an `inferred` fact):

| `claim` | What it is | Authority | Lives in |
|---|---|---|---|
| **declared** | human-authored *intent* (relations, readiness, decisions) | authoritative intent | spec / grouping files |
| **anchored** | a human *binding* — an **anchor** points code → a primitive's ID | authoritative binding (no intent) | source code |
| **inferred** | machine-derived *structure* (calls, imports, symbols) | advisory — never authoritative | nowhere (derived) |

- **`anchor`** *(locked; was "marker")* — the in-code pointer, e.g. `// anchor: spec:orders.create-order`. Carries
  **identity only, never intent**; emits an **`anchored`** edge (`satisfies`, `verifies`).
- **`claim`** *(locked; replaces "provenance")* — names a fact's **epistemic status**, not its ancestry.
- **Umbrella:** **authored** = human claims (`declared` + `anchored`); **derived** = machine output.
- **No 4th `claim`; computed-from-authored edges inherit their source's `claim`.** The enum stays exactly
  `declared / anchored / inferred`. `inferred` is the *advisory* kind — derived by **analysis** (calls, imports).
  An edge *computed deterministically from an authored source* is a derivation **mechanism, not a claim
  category**: it **inherits the source's `claim`**. Worked case: **`belongsTo` carries `claim:"declared"`** — it
  is a deterministic re-expression of the `Pack`'s authored (declared) manifest, so it inherits that authority;
  it is **not** advisory `inferred`. (Mechanics in §5.)

> **Naming side-effect, honored:** since `claim` now names the origin class, **readiness is "stated/asserted" by
> the author — not "claimed."** Reserve "claim" for the `claim` class. (Clears the one collision.)

## §4b — Delivery facts (derived realization signals)  [SETTLED]
**Delivery facts** are derived truths about a `Spec`'s *realization* — computed from graph edges, shown as badges,
**never authored** (authoring one is a §6 honesty violation). They are distinct from `readiness`: a delivery fact
is what the machine *observes*; readiness is what the human *states*.

| Delivery fact | Derived when | Means — and does **not** mean |
|---|---|---|
| **`implemented`** | ≥1 `satisfies` edge (from an `anchor`) resolves to the Spec | code claims to realise it — *not* that it works |
| **`has-verifier`** | ≥1 `verifies` edge from an enabled verifier resolves to the Spec | a verifier **exists** — *not* that it passed (pass/fail is CI's, not the graph's) |
| **`observed`** *(aspirational)* | runtime evidence links to the Spec's target | seen live in production / telemetry |

**The payoff queries** (possible only because readiness and delivery facts are *separate* axes):
- `ready ∧ ¬implemented` → the **build backlog** (designed, not yet built).
- `implemented ∧ ¬ready` → the **drift alarm** (code ran ahead of the design).

**Readiness floor vs delivery fact** (keep this crisp in the cleanup): a readiness floor (§6) checks the
**structure required to *derive* a fact**, never the fact itself. Claiming `ready` may require that bindings
*resolve* (so `implemented` is *derivable*) — it never requires that the Spec *is* `implemented`. Readiness is a
claim about the design; delivery facts are observations about the code.

## §5 — The read side: the one graph  [SETTLED]

**The one graph** is the single *derived* read model of the entire delivery intent. It is a flat, typed graph of **nodes** and **edges** — a deterministic snapshot-projection of the repo at a specific commit. It is the **sole** input that every consumer reads:

- No consumer (coding agent, Studio surface, diagram generator, API reference, context bundle, etc.) ever reads source directly.
- There is no second store or parallel model.
- Every view, diagram, and agent surface is a pure **projection** of this graph (see §7).

**Derivation** is strictly deterministic: `graph = f(repo)`. The graph is fully **regenerable** — delete it and rebuild it byte-identically from the same commit. This is the mechanical heart of the honesty guarantee in §0 and §4.

**The producer** is the **`extractor`**. It is the *only* component that reads source. Its responsibilities are:
- Parse authored primitives, anchors, packs, and authored relations.
- Perform the deterministic derivation that produces nodes, edges, and `claim` values.
- Emit a validation report (conformance + honesty failures).
- Produce the graph artifact that everything downstream consumes.

**Node and edge typing** keeps concerns separate:
- Every node carries `nodeType` (e.g. `Primitive`, `Pack`, `Anchor`, `CodeNode`, `RuntimeObserved`, …).
- Primitives additionally carry `specKind` (the truth-category from §2: Decision Record, Use Case, NFR, etc.).
- This split prevents the old single `kind` field from colliding between structural class and domain truth-category.

The one graph is the concrete realisation of the RUP distinction between *model element* (truth) and *view element* (projection), made executable and self-validating. All governance, all surfaces, and all agent behaviour flow from this single derived artifact.

## §6 — Validation & honesty (conformance)  [SETTLED]
The deterministic machinery that makes the process meta-model **self-validating** (§0). Checks run over the one
graph; an **error fails the build**, a **gap informs**. The meta-model defines the contract; **instances conform**;
these checks verify conformance. *(Conformance here means conformance to the typed meta-model — distinct from RUP's
"conformance level," which was a spec's own implementation tier; use CORE/ASPIRATIONAL for that.)*

| Family | Asks | Examples |
|---|---|---|
| **conformance checks** | "is this *well-formed* against the meta-model?" | referential integrity (every ID resolves) · `claim` separation never collapsed (§4) · node/edge typing valid · grouping **coherence** (members + `modelRefs` resolve; no duplicate members) · **ambiguity-is-loud** (duplicate IDs / true conflicts fail, never auto-resolve) |
| **honesty checks** | "is this *not pretending* to be something it isn't?" | **authoring-shape honesty** (no hand-authored `satisfies` / `anchored` / `inferred` / delivery-facts) · **honest readiness** (a *stated* rung is structurally earned) |

The **honesty** family is a real differentiator: most tools do only conformance; the "not faking derived truth"
layer is what makes the graph trustworthy for agents and humans alike.

**Terms:**
- **`validator`** — one individual deterministic check (the boring, correct industry noun); validators group into
  the two families above.
- **`readiness floor`** *(was "readiness profile")* — the **minimum structural requirement to *state* a readiness
  rung**. A floor to clear, **never a quota to fill or a score** (significance governs detail — no tier-filling).
- **`gap`** — a surfaced absence (e.g. a `ready` primitive with no verifier). Informative, **never a gate**.
- **`orphan`** — a primitive with no relations and nothing pointing at it. Informative.

## §7 — Surfaces & projections  [SETTLED]
**`projection`** — a pure function of the graph producing a consumer artifact: disposable, regenerable, **never a
second source**. *Everything* consumer-facing is a projection (RUP's *view element*).

| Surface | What it is | Notes |
|---|---|---|
| **Design Review** | the flagship curated review: a primitive/pack rendered *in context* — neighbors, relations, `claim`/delivery badges, auto-generated **design questions** + a **findings** table | the surface where a primitive earns `ready`; adopts the recognized SDLC noun |
| **agent surface** | a **visible typed graph the agent *scripts*** via a typed CLI — no verb wall; the schema *is* the contract (under-typing hides a capability) | **push** a Design-Review slice + **pull** by scripting the graph |
| **reader** *(was "handle")* | the thin typed loader: joins + `claim`/taxonomy decode done **once**, returns composable data; authors/persists nothing | a front door, not a store |
| **Mermaid projection** | logical / analytical / topological charts | live, regenerable |
| **reference projection** | interface / API reference, kept current | live |
| **context bundle** | a token-budgeted curated slice pushed to an agent | |
| **MCP surface** | integration for user-facing apps — designed-in, **deferred build**, shape TBD | distinct from the agent surface (agents *script*; apps *integrate*) |
| **impact graph** *(was "mechanical substrate"; aspirational)* | the exhaustive import/symbol structure for blast-radius / find-all-usages | divergence from the curated graph is **curation, not drift** |

**The edit model** — **intent → agent → git → conformance checks** (§6). No patch loop, no write-back, no
codemod-from-view.
- **intent composition** — the write-affordance: compose **scoped intent**, hand it to an agent that edits source
  exactly as a human would; git records it; §6 gates. The view is a process-orchestrator, not an editor.
- **scoped intent** — *what* is composed: an explicit change bounded by a primitive / its neighbors / a pack /
  open questions.

## §8 — Delivery-process execution  [SETTLED]

**Stance:** Delivery-process execution vocabulary is adopted from RUP as **recognized nouns** and realized — where realized at all — as **projections or descriptive vocabulary** over the one graph. These terms are **never** modeled as gates, FSM states, mandatory sequences, or core primitives in Phase 0. RUP supports both iterative and waterfall styles; Omni imposes neither.

The goal is recognition and lightweight utility without re-importing the process state-machine the rubric explicitly rejects.

**How the classic RUP execution terms land in Omni:**

| Term | Traditional RUP meaning | How it lands in Omni |
|------|--------------------------|----------------------|
| **discipline** | A concern/area of work (Requirements, Analysis & Design, Test, Deployment, …) | A **lens / projection** — filter or group primitives in the one graph by `kind` or section. “Show me the Requirements discipline” = show all behavior primitives (+ the Capability Map projection). Not a phase you pass through. |
| **phase** | Inception → Elaboration → Construction → Transition | Descriptive vocabulary only. Optional roadmap framing. Never a gate or enforced sequence. |
| **iteration** | One integration loop leading to a release | Optional temporal grouping. Can appear as a **roadmap / now-next-later projection**. Not enforced. |
| **milestone** | Assessment checkpoint | Optional named checkpoint (a projection over readiness and delivery state). Not a gate. |
| **release** | A delivered functional set | A **tagged set** surfaced as a projection (backed by a git tag). |
| **baseline** | Reviewed/approved, change-controlled snapshot | A **named approved snapshot** (≈ a git tag where a set of primitives is `ready` + has been reviewed). Vocabulary + optional projection. |

**The discipline ≈ kind/section mapping** (how Omni supports the RUP picture without its gates):

- **Requirements** → behavior primitives (+ the Capability Map projection)  
- **Analysis & Design** → design section + Decision Records  
- **Test** → example primitives + `verifies` relations  
- **Deployment** → `observed` / evidence nodes  
- **Config & Change Management** → git (the source of truth)  
- **Project Management** → packs + roadmap projections  
- **Business Modeling** → `model` primitives

**The RUP hump-chart** (disciplines × phases over iterations) becomes a **Mermaid / analytical projection** — a view showing how authored and derived activity distributes across the graph. It is never a plan the system enforces.

**Realization level (Phase 0):**  
- **Discipline-as-lens** is realized (lightweight, high-value filter over the one graph).  
- **Release** and **baseline** are realized as git-tag projections.  
- **Phase, iteration, and milestone** remain descriptive vocabulary with optional roadmap projections.  
- None of these terms are modeled as core primitives, relations, or validators in Phase 0. They are adopted for recognition and lightweight utility only.

This section demonstrates the governing rubric in action: adopt the established nouns the industry already understands, but realize them only as projections and descriptive vocabulary — never as the gating machinery that was explicitly rejected.

## Term ledger
- **Locked names:** **`Spec`** (the one authored primitive) · **`anchor`** (in-code pointer; was "marker") · **`claim`** (epistemic status; replaces
  "provenance"), values `declared` / `anchored` / `inferred` · **`the graph`** / **`extractor`** (producer) ·
  **`conformance`** (instances *conform*; checks = conformance + honesty) · **`readiness floor`** (was "profile")
  · `validator` · `gap` · `orphan` kept · **`projection`** · **`Design Review`** (flagship) · **`reader`** (was
  "handle") · **`impact graph`** (was "mechanical substrate") · `agent surface` · `context bundle` · `MCP surface`
  · **`intent composition`** / **`scoped intent`**.
- **`Spec` descriptor values locked:** `kind` ∈ {`behavior`, `workflow`, `example`, `rule`, `constraint`, `model`,
  `decision`, `contract`} (lowercase literals + display labels) · `altitude` ∈ {`epic`, `feature`, `story`}
  *(field renamed from `abstraction`)* · `readiness` ∈ {`idea`, `scoped`, `defined`, `ready`}. `capability` &
  domain = **projections**; `NFR` / `Scenario` = labels, not separate kinds.
- **More locked:** **`Pack`** (the grouping / review unit; was "SpecPack") · **`section`** (the typed detail-slice
  / extension surface; **replaces "Facet"** — locked 2026-06-07) · **delivery facts** (derived, never
  authored): `implemented` · `has-verifier` (a verifier *exists*, not that it passed) · `observed` (aspirational).
- **Rejected terms:** `provenance` (concept kept → **`claim`**) · `marker` (→ **`anchor`**) · `FSM`/status-FSM
  (implementation-leak from the Libar Application Platform) · `model element` (as the primitive's name) ·
  `genus`/`species` (as labels; the split is kept, described plainly) · `abstraction` (→ **`altitude`**) ·
  `candidate` (as a readiness rung — FSM-status imprint) · `Scenario` / `capability` / `NFR` (as separate
  descriptors — they are labels / projections, not descriptors) · `Facet` (→ **`section`**) · `SpecPack`
  (→ **`Pack`**).
- **Locked usage:** `authored` / `derived` (umbrella pair kept; "derived" sharpened in §4 — *inferred* vs
  *computed-from-authored*) · **readiness verb** = "stated/asserted", **not** "claimed" (reserve "claim" for the
  `claim` class).
- **Resolved terminology:** the meta-model defines the **contract**; **instances conform**; the checks are
  **conformance checks + honesty checks**. "govern"/"validate" retired as the umbrella — the meta-model defines the
  contract, it does not govern/police.
- **Parked naming candidate:** this base uses **"process"** as the delivery noun. **"(executable) software
  delivery protocol"** is retained only as the deferred MD-5 system-naming candidate, not as an open terminology
  choice inside the base. (DECISIONS MD-5.)
- **Parked names:** the **system name** *(the primitive is named **`Spec`** — locked; removed from this parked
  list)* — criteria so far: evokes the executable
  delivery-process spine; not PM-flavored; room for the OSS backend layer *and* the commercial Studio; namespaces
  `@libar-dev/` (OSS) vs `@libar-ai/` (commercial); incumbent fallback "Libar Architect"; "Architect" / "Libar
  Delivery Process" disfavored.
