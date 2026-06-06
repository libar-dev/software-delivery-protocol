# Pedantic cleanup — apply the ratified language to the concept docs + JTBD

> **Status: PLAN ONLY — execution-ready.** This is a clean rewrite (2026-06-07). It supersedes the previous
> "banner-over-old-body" version of this file entirely: that version had a reconciliation banner whose terms
> *contradicted its own body* (e.g. the body kept `capability` as both a `kind` and an altitude, which the
> language base reversed — recorded in `DECISIONS.md` MD-4's note). Everything below already speaks the ratified
> language — there is no older vocabulary left to reconcile against.
>
> **Authority chain (highest first):**
> 1. `docs/concept/ubiquitous-language.md` — the ratified base (§0–§8 + §4b, all `[SETTLED]`). **Sole source of
>    truth for terminology and the model.**
> 2. `docs/concept/DECISIONS.md` — the why-log (MD-1, MD-2, MD-4, MD-5). Rationale + open tensions.
> 3. This plan — the *objective-fixes checklist and per-file cascade* that applies (1) and (2) to the 18 docs.
>
> If this plan ever disagrees with the base, **the base wins** — and that is a bug in this plan to fix, not a
> judgment call to make at execution time.

---

## 0. The frame (read once, then execute)

Omni is an **executable, self-validating meta-model of the software-delivery process** (MD-1). The cleanup is not
cosmetic: it brings 18 docs that were *polished into false settledness* into line with a language base that was
ratified **after** they were written. Two kinds of work fall out of that, and the plan keeps them separate:

- **Mechanical apply** — term-for-term renames (§2) and term-neutral objective fixes (§5). Near-automatic.
- **Conceptual apply** — structural reframes (§3) and **net-new model material the docs must gain** (§4): the
  three meta-levels, the protocol/process thesis + honesty guardrails, the conformance/honesty reframe of
  validation, the readiness↔delivery-fact split, the surfaces taxonomy, and the §8 delivery-process-execution
  nouns. This is real authoring, not find-and-replace.

Before executing, read §9 (**decisions against the ratified base**) as historical context: those residual items
were settled on 2026-06-07, nothing there is still open, and execution can proceed directly from the ratified
base.

---

## 1. The target model in one screen (what the docs must say when done)

This is the ratified model, restated so the cascade has a single reference. Every line traces to
`ubiquitous-language.md`.

- **Three meta-levels** (§1): **process meta-model** (the primitive, descriptors, relations, validators — *as
  typed code in the repo*; **Phase 0 of the MVP**) → **authored model** (a project's instances; *conforms*) →
  **derived facts** (machine truth; never authored).
- **One authored truth-primitive: `Spec`** (§2) — enrich-in-place, never migrated to another artifact type.
  Positioned by **three descriptors**:
  - **`kind`** — a *true subtype* (discriminated union; changes required detail + validation). **8 values:**
    `behavior · workflow · example · rule · constraint · model · decision · contract`. NFR is a **flavor of
    `constraint`**, not a kind. A **Scenario** is a low-altitude `example`, not a kind of its own.
  - **`altitude`** *(field renamed from `abstraction`)* — a *position*. **`epic → feature → story`.**
  - **`readiness`** — a *position* (design maturity). **`idea → scoped → defined → ready`.** `ready` carries a
    **readiness floor** (§6).
- **Two more authored things — never the truth-primitive** (§2 boundary):
  - **`Pack`** *(was `SpecPack`)* — an authored **aggregate** / review unit. States **no truth of its own**;
    references `kind:"model"` specs via **`modelRefs`**; membership is authored on a **manifest** and the
    `belongsTo` edge is **derived** from it.
  - **`anchor`** *(was `marker`)* — a human-written pointer **in source code** to a primitive's **ID**. Carries
    **identity only, never intent**; emits an **`anchored`**-claim edge.
- **The `claim` taxonomy** *(was `provenance`)* (§4), **never collapsed:** **`declared`** (human intent in
  spec/pack files) · **`anchored`** (a human binding via an `anchor`) · **`inferred`** (machine-derived
  structure; advisory). Umbrella: **authored** = `declared` + `anchored`; **derived** = machine output.
- **Delivery facts** (§4b) — derived realization signals, **never authored:** **`implemented`** (≥1 `satisfies`
  edge resolves) · **`has-verifier`** (≥1 `verifies` edge from an enabled verifier resolves — *exists*, not
  *passed*) · **`observed`** (aspirational). Payoff queries: `ready ∧ ¬implemented` = **build backlog**;
  `implemented ∧ ¬ready` = **drift alarm**.
- **Sections** *(was `facets`)* (§2) — the optional, typed detail-slices that are the **extension surface**:
  `intent · behavior · constraints · model · design · decision · verification · ui`. The **envelope**
  (`id · title · kind · altitude · readiness · relations`) is the stability contract.
- **Authored relations** (§3): `refines · dependsOn · constrainedBy · decidedBy · verifies · supersedes`.
  **Derived edges:** `belongsTo` (from the manifest) · `satisfies` (code → primitive, from an `anchor`).
  **Dropped:** `exemplifies`.
- **The one graph** (§5) — the single *derived* read model. Producer = **`extractor`**. Nodes carry
  **`nodeType`** (`Primitive`/`Pack`/`Anchor`/`CodeNode`/…); primitives additionally carry **`specKind`**
  (de-overloads the old single `kind`).
- **Validation = conformance checks + honesty checks** (§6). A **`validator`** is one deterministic check; an
  **error fails the build**, a **`gap`** informs. **`readiness floor`** *(was `readiness profile`)* = the minimum
  structure to *state* a rung (a floor to clear, never a quota). **`orphan`** kept.
- **Surfaces & projections** (§7): a **`projection`** is a pure function of the graph. **Design Review**
  (flagship; the surface where a spec earns `ready`) · **agent surface** (a visible typed graph the agent
  *scripts* via the CLI — no verb wall) · **`reader`** *(was `handle`)* (the thin typed loader) · Mermaid
  projection · reference projection · **context bundle** · **MCP surface** (user-facing apps; designed-in,
  deferred build) · **impact graph** *(was `mechanical substrate`; aspirational)*. Edit model: **intent → agent
  → git → conformance checks** (`intent composition` / `scoped intent`).
- **Delivery-process execution** (§8): RUP nouns adopted as **projections / vocabulary, never gates** —
  discipline-as-lens; release/baseline as git-tag projections; phase/iteration/milestone as descriptive
  vocabulary.

### Decision shorthand (D1–D6) — referenced by this plan and by the base's §7

These labels come from the original structural-decisions pass; their *content* is now canonical in the base (and
re-expressed in §3–§4 here). Kept as a resolution table so every `(Dn)` reference resolves. *(See §9-G: the base's
§7 still uses `(D5)`/`(D6)` — relocate this table or retire those labels before this plan is deleted, so nothing
dangles permanently.)*

| Label | One line | Now canonical in |
|---|---|---|
| **D1** | readiness (design maturity, authored) is separate from delivery facts (derived) | base §2 + §4b; plan §3.2–§3.3 |
| **D2** | `02` carries explicit typed **sections**, trimmed to essence (branded-ID strings; open `model` list) | base §2; plan §3.6 + §6 (`02`) |
| **D3** | `Pack` is a reified grouping/aggregate (not folded into `Spec`); membership single-sourced on a manifest | base §2 boundary; plan §3.5 |
| **D4** | **Design Review** is the flagship curated projection — the surface where a spec earns `ready` | base §7; plan §4.6 |
| **D5** | the **agent surface** = a visible typed graph the agent *scripts* (no verb wall); `reader` = thin loader | base §7; plan §3.7 |
| **D6** | the **MCP surface** = integration for user-facing apps (designed-in, deferred build, shape TBD) | base §7; plan §4.7 |

---

## 2. Master rename map (mechanical — term-for-term)

Apply across `docs/concept/` **and** `jtbd-stories/`. Counts are current hits from the cross-doc inventory
(2026-06-07) — a size guide, not a target.

| Current term in docs | → Ratified | Hits | Notes |
|---|---|---|---|
| `abstraction` (field + word) | **`altitude`** | 35 | field, type name (`SpecAbstraction`→`SpecAltitude`), prose |
| readiness `sketch/framed/specified/designed` | **`idea/scoped/defined/ready`** | — | see §3 for the value mapping (not 1:1) |
| readiness `bound/executable/verified` | **not readiness** → delivery facts | 89 | see §3; word survives only in *retirement prose* |
| `kind:"capability"` | **dropped** (→ Capability Map projection) | 4 | capability is no longer a kind |
| `kind:"interface"` | **`kind:"contract"`** | 1 | `interface` survives only as a display word ("API reference") |
| `marker` / `markers` | **`anchor` / `anchors`** | 64 | |
| `provenance` (field + word) | **`claim`** | 42 | |
| provenance value `annotation` | **`anchored`** | — | |
| `satisfiedBy` (spec → code) | **`satisfies`** (code → primitive) | 3 | **direction flips**; now derived from anchors |
| `exemplifies` | **dropped** | 4 | use `kind:"example"` + `refines` + `verifies` |
| `sharedModel` | **`modelRefs`** | 1 | refs to `kind:"model"` specs |
| `handle` (the AI surface) | **`agent surface`** + **`reader`** | 35 | disambiguate — see §3.7 |
| `mechanical substrate` | **`impact graph`** | 19 | |
| `readiness profile` | **`readiness floor`** | 6 | |
| `facet` / `facets` | **`section` / `sections`** | 39 | (delegated pick — §9-A) |
| `SpecPack` / `specPack()` | **`Pack` / `pack()`** | 11 | |
| `runtime` section/field | **removed** | 47* | *word survives for runtime-*evidence* (`observed`) |
| `bindings` section/field | **removed** | 23 | code links are derived `satisfies` (anchored) edges |
| `evidence` section/field | **removed** | 51* | *"evidence is observed" *concept* stays; the authored field goes |
| `verification.tests` | **removed** | 1 | `verification` = `mode` + `criteria` only |
| `tags` field | **removed** | 5 | unstructured, low-signal |
| `contains` (graph edge) | **`refines`** / derived `belongsTo` | 1 | only the 03 §1 graph-edge use; "contains" as a verb stays |
| namespace `capability:*` | **`spec:*`** | 5 | `capability:order-management` → `spec:orders.order-management` |
| namespace `adr:*` | **`spec:decisions.*`** (+ `doc:` external) | 2 | |
| `api:POST:/orders` | **`api:orders.post`** | 4 | grammar-compliant dotted/kebab |
| `impl:CreateOrderUseCase` | **`impl:orders.create-order-use-case`** | 9 | |
| `spec:payment.*` | **`spec:payments.*`** | 2 | match the `/specs/payments/` folder |

> *Asterisked counts (`runtime`, `evidence`) include legitimate surviving prose. Remove the **authored
> field/section**; keep the *concept* where it refers to derived/observed reality. Verification greps (§8) are
> written to tolerate this residue.*

---

## 3. Structural changes (not mere renames — decisions, with the value mapping)

These are where a blind find-and-replace would be wrong.

### 3.1 Altitude ladder — `epic → feature → story` (3 rungs)
The old 8-value `abstraction` ladder mixed three scales (intent altitude, example-concreteness, structural
granularity). Resolution (base §2; recorded in `DECISIONS.md` MD-4's note):
- **Altitude = `epic · feature · story` only.**
- **`domain` / bounded-context** and **`capability`** are **not altitudes** — they are **projections** (the
  *Capability Map* over high-altitude `behavior` primitives) and/or **groupings (`Pack`s)**.
- **`scenario`** is **not an altitude** — it is a low-altitude **`example`-kind** Spec that `refines`/`verifies`
  a Story.
- **`contract`** is **not an altitude** — it is a **`kind`**.
- **`initiative`** (above-epic) defers — additive later when an aspirational feature needs it (`epic` is the
  altitude ceiling for now).
- **`operation` / `component`** are **not spec altitudes** — they are the code layer (`impl:` / `component:`
  nodes + anchors).

### 3.2 Readiness ↔ delivery-fact split (the central change, MD-1/§4b)
The old 7-rung readiness ladder merged author-claimed **design maturity** with machine-observed **delivery
status** — the exact linear pipeline the model forbids. Split:
- **`readiness` = design maturity, authored: `idea → scoped → defined → ready`.** Value mapping from the old
  ladder (lossy by design, not 1:1):
  - `sketch` → **`idea`**
  - `framed` → **`scoped`** (echoes the locked `scoped intent`)
  - `specified` → **`defined`** *(or `scoped` where the old text means "some detail, not yet design-complete" —
    use judgment per occurrence; default `defined`)*
  - `designed` → folds into **`ready`** *(its old "components/ports/decisions identified" content becomes the
    `ready` floor's design requirement)*
  - `ready` ≈ "reviewed in context (Design Review) and implementation-ready."
- **`bound` / `executable` / `verified` leave readiness entirely** → they become **delivery facts:** `bound` →
  `implemented`; `executable` / `verified` → `has-verifier` (+ future `observed`). They are **derived, never
  authored** (§4b).
- **`executable` survives only** as a `verification.mode` value and inside the `has-verifier` derivation — not
  as a readiness rung. Do **not** purge that use.

### 3.3 The `ready` floor (D1, applied)
`ready` is earned, not asserted. Its readiness floor (state in `05` and `02`):
- the `defined` floor is satisfied; **no blocking open questions**; **all relations resolve**; every
  `dependsOn`/`refines` target is itself **≥ `defined`** (nothing in the design blocks a build agent).
- **Floor ≠ delivery fact:** the floor may require that bindings *resolve* (so `implemented` is *derivable*); it
  **never** requires the spec to *be* `implemented`. Readiness is a claim about the design; delivery facts are
  observations about the code.

### 3.4 `kind` — 8 values, NFR/Scenario demoted to labels
`kind` = `behavior · workflow · example · rule · constraint · model · decision · contract`. Drop `capability`
(now a projection). `interface` → `contract`. **NFR** is a *flavor* of `constraint`; **Scenario** is an
`example`. Delete every "capability appears in both `kind` and `abstraction`" passage — that defense is now
**moot** (capability is neither).

### 3.5 The three authored things & two grouping mechanisms (§2 boundary)
State plainly, once: a human authors exactly **three** things — **`Spec`** (the only truth-primitive), **`Pack`**
(aggregate, no truth of its own), **`anchor`** (binding, identity only). Keep **two grouping mechanisms
distinct:** *refinement* (parent → children, authored truth that happens to have descendants) vs *the aggregate*
(`Pack` — the cross-cutting review collection, no truth, may span or sub-slice the refinement hierarchy).

### 3.6 The section ⟷ kind duality (BLESSED rule — now in base §2; see §9-D)
Three sections have a same-named `kind` twin: `constraints`↔`kind:"constraint"`, `model`↔`kind:"model"`,
`decision`↔`kind:"decision"`. **Blessed rule** (stated in base §2; **state it once in `02`, do not scatter**):
keep it **inline as a section** when it is **local detail** of its host `Spec`; **promote it to a standalone
`Spec`** of the matching `kind` (linked via `constrainedBy` / `decidedBy` / `modelRefs`) when it is **referenced
by >1 `Spec`, or needs its own identity / lifecycle / review.** `modelRefs` on a `Pack` always points at
standalone `kind:"model"` specs — shared vocabulary is never inlined twice.

### 3.7 The AI surface reframe — `agent surface` + `reader` (D5, §7)
The docs' "typed handle" carried two meanings; split them:
- **agent surface** — the consumer-facing surface: *a visible, self-describing typed graph the agent **scripts**
  via the CLI.* The **schema file is the contract** ("read it, then script freely"); **under-typing a shape
  hides a capability**. No verb wall. The harness **pushes** a Design-Review slice for the task (D4) and the
  agent **pulls** the long tail by scripting (D5). **The coding agent never goes through MCP.**
- **`reader`** *(was `handle`)* — the **thin typed loader** *component*: joins + `claim`/taxonomy decode done
  **once** at construction, returns plain composable data, persists nothing (a front door, not a store). Freeze
  only the irreducible (entry adapters: by-concept / by-file / by-symbol; blast-radius; irreducible cross-source
  joins); everything else scripts.

### 3.8 `belongsTo` is derived, not authored
`belongsTo` (pack membership) is **derived from the `Pack` manifest**, never hand-authored as an edge. It leaves
the authored-relations list. (Capability "membership" is expressed by `refines`, not `belongsTo`.) For its
`claim` value, see §9-C.

### 3.9 Graph node/edge typing (§5)
De-overload the single `kind` in graph JSON: every node carries **`nodeType`**; primitives additionally carry
**`specKind`**. Edges carry **`claim`** (`declared`/`anchored`/`inferred`), never collapsed.

---

## 4. Net-new material the docs must GAIN

These are **not** in the current 18 docs (they entered the language after the docs were polished). Authoring,
not renaming.

1. **The three meta-levels + Phase 0** (base §1; the former MD-3 was absorbed there). Add the meta-model →
   authored-model → derived-facts framing
   to `00` (vision), `01` (it is the substrate of P1–P10), and `07` (**Phase 0 = build the process primitives as
   code** — the extractor, schema, and every validator presuppose it). Self-hosting is a *later* milestone, not
   a Phase-0 claim.
2. **The protocol/process thesis + two honesty guardrails** (§0, MD-1). Reframe `00`/`01`/`README` headline from
   "delivery-lifecycle system / operating system for software delivery" to **"an executable, self-validating
   meta-model of the software-delivery process; instances *conform*."** State both guardrails: (a) checks
   **conformance & honesty**, never **content-quality** (design goodness is human/agent judgment) and never
   **workflow** (no lifecycle gates — the RUP/FSM trap); (b) claim **"deterministically validated," never
   "provably correct."** *(Wording "process" vs "protocol" — see §9-B.)*
3. **Conformance + honesty reframe of validation** (§6). Reframe `05` to **lead** with the two families —
   **conformance checks** ("is it well-formed against the meta-model?") and **honesty checks** ("is it not
   pretending to be something it isn't?") — and demote the old "5 validation tiers / layered enforcement by
   kind" to a secondary "*how* it's enforced" note. The honesty family (authoring-shape honesty + honest
   readiness) is the **differentiator** — most tools do only conformance. Retire "governance/gate" framing.
4. **Delivery facts as a first-class subsection** (§4b) in `02` — `implemented` / `has-verifier` / `observed`,
   derived from edges, shown as badges, with the build-backlog / drift-alarm payoff queries.
5. **The surfaces taxonomy** (§7) in `06` — reproduce the canonical surfaces table (Design Review, agent
   surface, reader, Mermaid projection, reference projection, context bundle, MCP surface, impact graph).
6. **Design Review — the flagship projection** (§7, D4) in `06` (lead) and `02` (tie: a spec earns `ready` *at*
   the Design Review). A primitive/`Pack` rendered **in context** — neighbors, relations, `claim`/delivery
   badges, auto-generated **design questions** (from blocking open questions + `gap`s) and a **findings** table.
   Pure projection; findings resolve through the edit loop, **no stored `Finding` type**. *Concept is core;
   rich diagrams grow later.*
7. **MCP surface — designed-in, deferred build** (§7, D6) in `00`/`06`/`07`. The integration surface for
   user-facing apps; *one more projection of the one read model*; **distinct from the agent surface** (agents
   *script*; apps *integrate*); its concrete shape is a fresh design, **not** specified here and **not** carried
   over from any prior implementation.
8. **Delivery-process execution as projections/vocabulary** (§8) — add a concise section to `06` (and a pointer
   from `00`): **discipline-as-lens** (a projection filtering the graph by `kind`/section — realized), **release
   / baseline** as **git-tag projections** (realized), and **phase / iteration / milestone** as **descriptive
   vocabulary** with optional roadmap projections (not gates). The RUP hump-chart becomes a Mermaid/analytical
   projection, never an enforced plan. This is what lets `00`'s "Not a process/PM tool" non-goal be **reworded
   honestly** (see §5.8): Omni *adopts the delivery nouns as projections*, and *rejects only the gating
   FSM/sprint-state* (MD-2).

---

## 5. Objective fixes (term-neutral — confirmed against the current docs)

None is a matter of taste; all confirmed present (2026-06-07).

1. **Remove stray `</content>` / `</invoke>` tags** (LLM-generation junk) from the 7 files that have them:
   `README`, `00`, `01`, `02`, `03`, `04`, `05`. (`06`, `07`, and all `jtbd-stories/` are already clean.)
2. **README Founding Principle #4 vs #2.** "#4: the graph is code in the repo" contradicts "#2: the graph is
   derived and regenerable." Reword #4 to keep its *distinct* point — **truth is authored as code in the repo,
   not in an external tool** — and keep its body. Do not collapse it into #2.
3. **Unify IDs / namespaces.** Apply the namespace renames from §2 everywhere they appear: `02` §5 namespace
   list (drop `capability`, `adr`; add `doc`), the worked examples in `02`, the graph example in `03`, the
   examples + repo-shape in `04`, and the running-domain list in `README`. `doc:` is **only** for a genuinely
   external document linked from a decision spec (e.g. `doc:adr-order-lifecycle`).
4. **Drop the semantic "duplicated intent" pack check** (in `02` §4, `05` §4, `jtbd 01` AC3). Pack coherence is
   **deterministic only**: members + `modelRefs` + referenced terms resolve; duplicate member IDs fail.
5. **`--check-clean` wording.** Assert against a **fresh rebuild**, not a *committed generated artifact*
   (`generated/` is gitignored, L8). Fix in `03` §2 and `jtbd 03` JS-C3.
6. **Remove over-specific / temporal prose** → principle-level wording, keeping the *measured figures as
   evidence in `DECISIONS.md`*, not in doc prose:
   - `<~50 specs` → "MVP scale";  `~10k+ nodes` → "until measured traversal pain";
   - `~⅕ tokens` → "a measured context-efficiency win (figure recorded in `DECISIONS.md`)";
   - `single-digit to a quarter` / `single-digit to ~25%` → "a deliberately small curated selection";
   - `multi-quarter`, `quarter` (as portfolio-time) → drop or generalize.
7. **Typo `an decision` → `a decision`** — *already absent* (grep clean 2026-06-07). No action; listed so a later
   reader does not re-add it.
8. **Reword the `00` §5 "Not a process/PM tool" non-goal** (see §4.8 / MD-2). It currently says PM vocabulary is
   "not delivery truth." The ratified stance: **adopt the delivery nouns** (discipline/phase/iteration/
   milestone/release/baseline) **as projections + vocabulary**, and reject only **process gating** (sprint/
   ticket FSM, mandatory phase gates). Keep "not an embedded RBAC/governance engine" and "not no-code
   authoring" as-is. (This is the one non-goal the language *reverses*; do not delete it — reword it.)

---

## 6. Per-file cascade (all 18 files — exact)

Apply §2 (renames) + §3 (structural) + §4 (net-new) + §5 (objective) at the precise sites below. "§N" refers to
sections **within each doc**.

### `docs/concept/README.md`
- Remove stray tags. Definition blurb + slogan: lifecycle nouns → **named coordinates**; "provenance stays
  honest" → **"the `claim` stays honest"**; reframe to the meta-model thesis (§4.2). Founding Principle list:
  #3 `provenance`→`claim` (`declared/anchored/inferred`); **#4 reword** (§5.2). "How to read this set" table:
  doc-02 "two axes (abstraction × readiness)" → **three descriptors (`kind · altitude · readiness`)**; doc-04
  "markers" → **anchors**; doc-05 "readiness profiles" → **readiness floors**; doc-06 "typed graph handle + one
  view; two surfaces" → **agent surface + Design Review + reader; curated graph vs impact graph**. Running-domain
  IDs (§2 namespace renames). MVP legend: markers→anchors, profile→floor.

### `docs/concept/00-vision-scope-and-mvp-boundary.md`
- Remove stray tags. §2 ambition: one-primitive bullet → named coordinates, "verified evidence" → **delivery
  facts (`observed` aspirational)**; "Governance & compliance / Readiness **gates**" → **conformance + honesty;
  readiness floors; no gates**; AI-native bullet → **context bundle / agent surface / intent → agent → git**.
  §3 MVP: `spec()/specPack()`→`pack()`; "facets"→**sections**; "two axes (abstraction × readiness)"→**three
  descriptors**; markers→**anchors**; "readiness-profile completeness"→**readiness floor (honest readiness)**;
  **add Phase 0 = the process meta-model as code** (§4.1). §4 deferred table: "AI-slice / MCP tooling" → **MCP
  surface (D6): designed-in, deferred build** (not an afterthought). **§5 non-goal reword** (§5.8). §6 one-breath:
  three descriptors; delivery facts derived; `claim`-aware graph; conformance + honesty.

### `docs/concept/01-founding-principles-and-invariants.md`
- Remove stray tags. **P4**: lifecycle list → named coordinates; "verified evidence" → delivery facts derived.
  **P8 reword**: from "two orthogonal axes (abstraction × readiness)" to **"three authored descriptors — `kind`
  (a true subtype), `altitude` and `readiness` (two orthogonal positional axes); delivery is a *derived*
  dimension, never a readiness rung."** **P9**: `provenance`→`claim`; `annotation`→`anchored` (bound by an
  `anchor`). **P10 corollary**: "mechanical substrate" → **impact graph**. **Epistemic boundary**: readiness is
  **"stated/asserted"** (reserve "claim" for the `claim` class); "evidence is observed, not declared" → reframe
  to **delivery facts (`observed`) are derived**; drop the authored-`evidence` framing. **Git-is-event-log**:
  "No ID-freeze-after-`bound`" → "after a binding exists"; supersedes example `adr:006-…`→`spec:decisions.006-…`.
  **L9**: "facets are the extension surface" → **sections**. **Representations table** + CORE/ASPIRATIONAL map:
  anchor syntaxes (`declared` vs `anchored`); impact graph; **agent surface (visible typed graph scripted) +
  reader** (replace "typed graph handle"); "enum sets on each axis" → "on each descriptor". **Add** a short
  framing that P1–P10 are the **process meta-model** level (§4.1).

### `docs/concept/02-core-model.md`  *(largest — schema-first)*
- Remove stray tags. **§1 `Spec` type**: `abstraction`→`altitude`; **delete fields** `runtime`, `bindings`,
  `evidence`, `tags`; keep `verification` (section); "facets"→**sections**; envelope line uses `altitude`.
  **§2**: "two axes" → **three descriptors**; `SpecAbstraction`→`SpecAltitude` = `epic/feature/story`;
  `SpecReadiness` = `idea/scoped/defined/ready`; **`SpecKind`** = the 8 values (drop `capability`,
  `interface`→`contract`). **Rewrite "Why the enums look the way they do"**: remove the capability-in-both
  defense; state NFR-as-`constraint`-flavor, Scenario-as-`example`, capability/domain-as-projections.
  **Add "Derived delivery facts"** subsection (§4.4). **§3 Sections table**: drop `runtime`/`bindings`/
  `evidence` rows; `verification` = **`mode` + `criteria` only**; `constraints` flavors =
  `quality·security·performance·compliance·operational·policy` (**drop `business`** → `rule`/`kind:"rule"`);
  `model` = terms + concepts (vocabulary only; `DomainConcept.kind` an **open/illustrative** list, not a closed
  enum); **add `decision` section** (context/chosen/rationale/alternatives/consequences); **state the
  section⟷kind duality rule** (§3.6). Replace placeholder generics (`Ref<NodeId>`, `ModelConceptId`, …) with
  **plain branded-ID strings**. **Worked example**: readiness → `idea/…/ready`; remove `bindings`/`runtime`;
  `belongsTo("capability:order-management")`→`refines("spec:orders.order-management")`;
  `decidedBy("adr:007-…")`→`decidedBy("spec:decisions.order-lifecycle")`; the example spec drops `exemplifies`
  → `kind:"example"` + `refines` + `verifies`; remove `verification.tests`. **§4 `SpecPack`→`Pack`**:
  `specPack()`→`pack()`; `sharedModel`→`modelRefs`; **drop the "no duplicated intent" check** (§5.4). **§5 IDs**:
  namespace list → `spec, pack, impl, api, test, component, doc`; all example IDs (§2 renames); add the
  `spec:decisions.*` convention. **§6 Relations**: authored = `refines · dependsOn · constrainedBy · decidedBy
  · verifies · supersedes`; **`satisfiedBy`→`satisfies`** (code→primitive, **derived from anchors**);
  **`belongsTo` → derived** (out of authored list); **`exemplifies` dropped**; "marker"→"anchor";
  `provenance`→`claim`.

### `docs/concept/03-the-one-graph.md`
- Remove stray tags. **§1**: "markers — the annotation layer" → **anchors — the anchored layer**; "contains"
  (the graph edge) → **`refines`**; **graph JSON**: node `kind:"Spec"`→`nodeType:"Primitive"`+`specKind`;
  `abstraction`→`altitude`; `readiness:"bound"`→ a maturity value (`defined`/`ready`) **with delivery facts
  computed from edges**; `provenance:{source:"declared"}`→`claim:"declared"`; edge `satisfiedBy`→**`satisfies`
  with from/to flipped** (`impl:… → satisfies → spec:…`); `"annotation"`→`"anchored"`. **§2**: `--check-clean`
  wording (§5.5). **§3 provenance→claim table**: `declared/anchored/inferred`; examples reworded;
  "evidence is observed" → delivery facts derived. **§4**: `~10k+ nodes`→principle wording (§5.6). **§5**:
  supersedes example ID. **§6**: "facet-extensible"→**section-extensible**.

### `docs/concept/04-authoring-and-binding.md`
- Remove stray tags. **§1 DSL**: imports — drop `exemplifies`; `specPack`→`pack`; `abstraction`→`altitude`;
  readiness `specified`→`defined`; `belongsTo("capability:…")`→`refines("spec:orders.order-management")`;
  "facets"→sections. **§2 markers→anchors** throughout (all three forms → "anchor forms"); "annotation layer"
  → **anchored layer**; "annotation-provenance edges"→**anchored-`claim` edges**; `satisfies` stays (code→spec);
  `impl:` IDs → kebab; `component:orders-domain`→`component:orders.domain`. **§3**: "a `runtime` facet (or a
  marker)" → **anchors name routes/handlers by ID → derived `satisfies` edges** (the `runtime` section is gone);
  "spec → satisfiedBy → impl/route" → **"code → `satisfies` → spec" (anchored)**; keep the one-runtime-truth
  principle. **§4**: "behavior.examples facet"→section. **§5 repo shape**: `impl:` kebab; `api:POST`→`api:orders.post`.

### `docs/concept/05-validation-and-honesty.md`  *(schema-first — big reframe)*
- Remove stray tags. **Lead with conformance + honesty families** (§4.3); demote "Layered enforcement by
  kind / 5 tiers" to a secondary note. **§2 validators**: keep referential integrity, duplicate-ID, orphan,
  `verifies` linkage; "Readiness-profile completeness"→**honest readiness (readiness floor)**; **add
  authoring-shape honesty** (no authored `satisfies`/`anchored`/`inferred`/delivery-facts) and **`claim`
  separation never collapsed**. **§3 Readiness profiles → Readiness floors**: rebuild the table to **four rungs
  `idea/scoped/defined/ready`** (delete the `bound`/`executable`/`verified` rows — those are delivery facts);
  add the **`ready` floor** (§3.3); a lean base floor + a small kind-aware requirement (constraint→parseable
  `target`; example→given/when/then; model→term definitions) — full per-kind overlay deferred. "Claimed vs
  derived readiness" → **stated/asserted** (not "claimed"); example "claimed `bound`, derived `framed`" →
  **"stated `defined`, derived `scoped`"**. **§4 pack coherence**: `SpecPack`→`Pack`; **drop "no duplicated
  intent"** → deterministic coherence (members + `modelRefs` + terms resolve; duplicate members fail). **§6
  aspirational tiers**: NFR-to-evidence → **NFR-to-`observed`** (delivery fact). **§7 CI guarantees**: "every
  spec that *claims* a readiness *earns* it" → "**states a readiness floor it earns**"; conformance + honesty;
  `--check-clean` wording. **Add** the meta-model conformance note (instances *conform*; "conformance" in the
  protocol sense ≠ RUP's "conformance level" — use CORE/ASPIRATIONAL for the latter).

### `docs/concept/06-consumers-and-projections.md`  *(surfaces taxonomy)*
- **§1 fan-out**: "typed read handle + graph.json (agents)" → **agent surface**; "AI slices / MCP server" →
  **MCP surface (D6)**; keep Spec Studio aspirational. **§2 two surfaces**: "mechanical substrate" → **impact
  graph**; keep the principle (divergence = curation, not drift), trim the tables to essence. **§3 AI read
  surface — reframe** (§3.7): lead with **agent surface (visible typed graph the agent scripts; schema is the
  contract; under-typing hides a capability)**; demote handle → **reader** (thin loader); **push** Design-Review
  slice (D4) + **pull** by scripting (D5); **coding agent never via MCP**; "~⅕ tokens"→principle wording (§5.6).
  **Add Design Review** flagship section (§4.6). **Add MCP surface** section (§4.7). **Add delivery-process-
  execution projections** section (§4.8). **Add the canonical surfaces table** (§4.5). **§4 edit model**:
  `intent → agent → git → conformance checks`; **`intent composition` / `scoped intent`** (locked terms). **§5
  one human view**: relate it to the **Design Review** (the MVP human view *is* the Design Review's relationship
  slice); `abstraction`→`altitude`; "provenance cues"→**`claim` cues**. **§6 aspirational table**: "MCP server"
  →**MCP surface**. **§8**: agent surface; Design Review; token-figure wording.

### `docs/concept/07-mvp-roadmap-and-open-questions.md`
- **§1 slice**: **add Phase 0 = process meta-model as code** (§4.1) as the foundation slice; markers→anchors;
  "typed read handle"→**agent surface (+ reader)**; readiness floor; CORE map "through **`ready`**". **§2 CORE/
  ASPIRATIONAL**: "two axes"→three descriptors; facets→sections; markers→anchors; "honest provenance
  (declared/annotation/inferred)"→**`claim` (declared/anchored/inferred)**; "readiness profiles (through
  `executable`)"→**readiness floors (through `ready`)**; delivery facts derived; **MCP surface designed-in,
  deferred build**; "mechanical substrate"→impact graph. **§3 cut list**: substrate→impact graph;
  evidence→`observed`; MCP. **§4 open questions**: derived-readiness banner (stated vs derived); "how thin a
  mechanical substrate" → **impact graph (substrate = Iterate)** *(this resolves the old "how thin a substrate"
  question)*; "graph-DB ~10k+"→principle wording; marker→anchor. **§5**: "mechanical substrate"→impact graph.

### `jtbd-stories/README.md`
- Founding Principle list: #3 `provenance`→`claim` (`declared/anchored/inferred`); **#4 reword**. MVP-target
  line: markers→anchors; "typed read handle (entry adapters + impact)"→**agent surface (reader)**. Out-of-scope
  list: "mechanical substrate may suggest (JS-G3)"→**impact graph**. (Story titles unchanged.)

### `jtbd-stories/01-capture-and-evolve-intent.md`
- **JS-A1**: readiness `"sketch"`→`"idea"`; "`id, title, kind, abstraction`"→**`altitude`**; "the `sketch`
  profile"→**"the `idea` floor"**. **JS-A2**: sections list — drop `bindings`/`runtime`; "facets"→sections;
  "profile"→floor. **JS-A3**: `abstraction`→`altitude`; "`feature → scenario`"→**"`feature → story`"** (Scenario
  is an `example` kind, not an altitude — reword AC3); "an `executable` scenario under a still-`framed` feature"
  →**"an example *with a verifier* under a still-`scoped` feature."** **JS-A4**: rewrite the altitude list to
  `epic/feature/story` + named coordinates; `kind` list (drop `capability`, `interface`→`contract`); **delete
  "capability may appear in both"** (AC3); "`verified` while parent `framed`"→**"`has-verifier` while parent
  `scoped`"**; profile→floor. **JS-A5**: `SpecPack`→`Pack`; `specPack`→`pack`; `sharedModel`→`modelRefs`; **drop
  "no member duplicates another's intent"** (AC3); profile→floor.

### `jtbd-stories/02-bind-code-to-intent.md`
- **JS-B1**: marker→**anchor** throughout; "annotation-provenance edges"→**anchored-`claim` edges**; keep
  `satisfies`/`component`/`implements`; one-way code→spec. **JS-B2**: keep `spec-ids` union; IDs; keep
  "no freeze-and-supersede."

### `jtbd-stories/03-one-graph.md`
- **JS-C1**: ("(belongsTo, refines)" already correct). **JS-C2**: `provenance`→`claim`;
  `declared/annotation/inferred`→`declared/anchored/inferred`; "Evidence is observed, not declared"→**delivery
  facts derived**; marker→anchor. **JS-C3**: `--check-clean` wording (§5.5). **JS-C4**: supersedes example;
  keep `refines`.

### `jtbd-stories/04-keep-it-honest.md`  *(schema-first)*
- **JS-D1**: "claims `bound`/`executable`/`verified` but lacks…"→**"states `ready` but lacks its floor…"**;
  readiness "claims"→**stated**; marker→anchor; precedence "declared over annotation over inferred"→**anchored**.
  **JS-D2**: profile→**floor**; rung list `sketch→…→verified`→**`idea/scoped/defined/ready`**; AC4 rewrite —
  the old "`bound` requires bindings, `executable` requires tests, `verified` requires…" becomes **delivery
  facts are derived** + **the `ready` floor**; "`p95 < 300ms` … claim `specified`"→**`defined`**; "claimed
  `bound`, derived `framed`"→**"stated `defined`, derived `scoped`."**

### `jtbd-stories/05-see-and-share.md`
- **JS-E1**: header "`kind, abstraction, readiness`"→**`altitude`**; "provenance cues"→**`claim` cues**; relate
  to **Design Review**. **JS-E2**: "typed handle whose method list is the documentation, not a 30-verb API"→
  **agent surface: a visible typed graph the agent scripts; the schema is the contract; `reader` is the thin
  loader**; entry adapters; "~⅕ tokens"→principle wording; "MCP server is a later layer"→**MCP surface (D6) — a
  separate, later-designed integration surface for *user-facing apps*, not the coding-agent surface.** **JS-E3**:
  Spec Studio; `scoped intent` (Theme F).

### `jtbd-stories/06-edit-through-the-lens.md`
- **JS-F1**: **`intent composition` / `scoped intent`** (locked); "`akg validate` / CI is the gate"→**conformance
  checks**; keep the edit model intact.

### `jtbd-stories/07-trace-and-impact.md`
- **JS-G1**: blast-radius; "frozen handle method"→**frozen `reader` method on the agent surface**; per-spec
  impact list; "mechanical substrate (inferred import/symbol layer)"→**impact graph**. **JS-G2**: `verifies`;
  "claims `executable`/`verified` but has no test"→**"is `ready` but lacks `has-verifier` → surfaced as a
  `gap`"**; structural; bidirectional. **JS-G3**: "mechanical substrate"→**impact graph** throughout;
  "single-digit to a quarter"→principle wording; propose-candidates / flag-drift; `inferred` claim.

### `jtbd-stories/08-evidence.md`
- **JS-H1**: "machine-readable `target` (required at `specified`)"→**`defined`**; evidence→**delivery fact
  `observed`** (aspirational); "provenance"→`claim`; keep Phase = Later.

---

## 7. Execution sequencing

Two passes, **biggest blast-radius first**, so the schema/value decisions land before the mechanical sweep keys
off them.

1. **Schema & value rewrites (do first):** `02-core-model.md`, `05-validation-and-honesty.md`,
   `jtbd-stories/01`, `jtbd-stories/04`. These fix the descriptor enums, the readiness↔delivery split, sections,
   relations, and the conformance/honesty reframe — the vocabulary everything else restates.
2. **Mechanical renames (§2) across the rest:** `README`, `00`, `01`, `03`, `04`, `06`, `07`,
   `jtbd-stories/{README,02,03,05,06,07,08}`.
3. **Conceptual reframes & net-new material (§3, §4):** meta-levels + Phase 0; protocol/process thesis;
   Design Review + surfaces taxonomy + MCP surface + delivery-process-execution in `06`; the §5.8 non-goal
   reword. (Some of this lands inside passes 1–2; this pass is the sweep that confirms each net-new item exists.)

Then: run the §8 verification → if clean, **delete this plan** (its job is done) → update `CLAUDE.md`/`AGENTS.md`
if any term shifted during execution. *(The old input drafts — `GLOSSARY.md`, `UBIQUITOUS_LANGUAGE_{1,2}.md` —
are already deleted; there is nothing left to archive.)*

---

## 8. Verification (docs-only — no build/tests)

Run each grep after the cleanup. **Each must return zero, modulo the intentional residue noted.**

```sh
# 1. Stray generation tags — must be ZERO
grep -rnoE '</content>|</invoke>' docs/concept jtbd-stories

# 2. Retired terms — ZERO except intentional retirement-prose
grep -rniE '\babstraction\b|\bmarker\b|\bprovenance\b|\bhandle\b|mechanical substrate|sharedModel|satisfiedBy|exemplifies|readiness profile|\bfacet\b|specpack' docs/concept jtbd-stories

# 3. Retired readiness rungs — ZERO except prose explaining their retirement and
#    'executable' surviving as a verification.mode value / in the has-verifier derivation
grep -rniE '\b(sketch|framed|specified|designed|bound)\b' docs/concept jtbd-stories
grep -rniE '\bverified\b' docs/concept jtbd-stories   # allow "verified by" view labels / has-verifier prose

# 4. Retired kinds / altitudes / namespaces — ZERO
grep -rniE 'kind:\s*"(capability|interface)"|"capability"' docs/concept jtbd-stories
grep -rniE 'capability:[a-z]|adr:[0-9]|api:POST|spec:payment\.' docs/concept jtbd-stories

# 5. Removed authored sections/fields — ZERO as authored shape
#    (the WORDS 'runtime'/'evidence' may survive for derived/observed reality — inspect hits)
grep -rniE 'bindings\??:|tags\??:\s*string|verification\.tests|evidence\??:\s*EvidenceFacet|runtime\??:\s*RuntimeFacet' docs/concept jtbd-stories
```

**Cross-doc read-through (the part greps can't do):**
1. The `kind` / `altitude` / `readiness` / delivery-fact / relation / namespace lists in `02` match every
   restatement in `01`, `07`, `jtbd 01`, `jtbd 04` — no drift.
2. Every example ID is grammar-valid and consistent across `README`/`02`/`03`/`04`.
3. **No authored section or relation can express a derived delivery fact** (the §4b honesty invariant).
4. Each net-new item (§4) actually exists: meta-levels + Phase 0; thesis + guardrails; conformance/honesty
   reframe; delivery-facts subsection; surfaces taxonomy; Design Review; MCP surface; §8 execution nouns.
5. `02` still realises P4/P6/P7/P8 (reworded)/L9, and the section⟷kind duality rule (§3.6) is stated once.

---

## 9. Decisions against the ratified base — RESOLVED 2026-06-07

Seven residual items were surfaced by this cleanup and **decided in the 2026-06-07 session.** A–F were applied to
the base (`ubiquitous-language.md`) and/or `DECISIONS.md` that same session — the execution sweep just *reflects*
them. G is deliberately deferred to plan-retirement. **Nothing here is still open.**

- **A. `section` — ✓ LOCKED & APPLIED.** Blessed over `aspect`/`facet` (cross-audience legibility). Base §2
  name-note + ledger no longer call it reversible. Harden `section` across the sweep.
- **B. "process" vs "protocol" — ✓ DECIDED (deferred).** Working noun = **"process"**; "protocol" stays the
  **MD-5 candidate (PROPOSED)**, entangled with the parked system-naming pass — settle it *there*, not in the
  cleanup. **Do not churn files for it.** (Base §0 tag updated to say so.)
- **C. `claim` taxonomy — ✓ RESOLVED & APPLIED.** There is **no 4th `claim` value**; the enum stays
  `declared / anchored / inferred`. An edge *computed deterministically from an authored source* is a derivation
  **mechanism** that **inherits its source's `claim`** — so **`belongsTo` carries `claim:"declared"`** (it
  re-expresses the declared `Pack` manifest). Base §4 wording fixed (it had described a mechanism as if it were a
  category). **Execution: state `belongsTo` = `claim:"declared"` in `02`/`03`.**
- **D. Section ⟷ kind duality — ✓ RULE BLESSED & STATED IN BASE.** Trigger: **local detail → inline `section`;
  referenced by >1 `Spec`, or needs its own identity / lifecycle / review → promote to a standalone `kind` +
  relation.** Now stated in base §2. **Execution: state it once in `02` — do not scatter it across the other docs.**
- **E. `Spec` locked vs parked — ✓ APPLIED.** "The primitive's name" removed from the base ledger's *Parked
  names* (only *the system name* stays parked); `Spec` is locked.
- **F. Base §8 staleness — ✓ APPLIED.** Base §8 fixed: `facet`→`section`; "capability primitives"→"behavior
  primitives (+ the Capability Map projection)"; "domain primitives"→"`model` primitives".
- **G. Base §7 `(D5)`/`(D6)` labels — ⏳ POST-CLEANUP (deferred by design).** When this single-use plan is
  retired: **retire the `(D1–D6)` labels from base §7 to their plain names** (agent surface / MCP surface / …),
  and **move the §1 Decision-shorthand table into `DECISIONS.md`** for permanent traceability — so nothing
  dangles once the plan is gone. Not done now (the labels and the plan's table coexist fine while the plan exists).

> **Naming is explicitly OUT OF SCOPE for this cleanup** (see §10). Items A–G are about the *model language*, not
> the *product/CLI/package names*.

---

## 10. Explicitly out of scope (recorded, not done)

- **System / CLI / package naming.** The docs use `Omni`, `Libar Omni`, `AKG` (codename), `akg` (CLI), and
  `@akg/*` (packages) interchangeably — all **provisional/parked** (base ledger: *Parked names — the system
  name*; namespaces `@libar-dev/` OSS vs `@libar-ai/` commercial; fallback "Libar Architect"). Churning these
  across 18 files before the naming pass is wasted re-sweep. **The cleanup leaves them as-is** (provisional
  placeholders). A dedicated naming pass owns them. *(The base's working name for the system in prose is "Omni";
  docs may standardize prose on that, but the CLI/package tokens stay untouched.)*
- **The implementation-agnostic concept/representation split.** The docs deliberately carry implementation
  detail (TS shapes, DSL, graph JSON) — they double as the implementation spec until the code can hold it. The
  base names the *Principle vs Representation* split but the docs over-index on Representation. Separating an
  implementation-agnostic *concept* layer from a *representation* layer is a recorded **future direction**, not
  this pass. It is deferrable — it does not block building the MVP.

---

## 11. After execution

1. Run §8. If clean (modulo noted residue), the docs now speak the ratified language end-to-end.
2. **Delete this plan** — it is single-use; its decisions live in the base + `DECISIONS.md`.
3. Reconcile `CLAUDE.md`/`AGENTS.md` if any term shifted during execution (it should already be ratified-current
   from this session).
4. The remaining sequence beyond this cleanup: **build MVP Phase 0** (the process meta-model as code) → the
   vertical slice in `07`. The implementation-agnostic split (§10) slots in whenever it earns its place.
