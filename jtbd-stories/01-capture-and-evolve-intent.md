# A — Capture & Evolve Intent

The job here is to get a thought into the system and let it grow without ever forcing a migration to a new artifact. One primitive — a **spec** — carries an idea from a one-line sketch all the way to verified delivery. Maturity is *required completeness*, not a change of object type.

---

## JS-A1
### Capture a rough idea with zero ceremony

**Phase:** MVP
**References:** [02 — Core Model](../docs/concept/02-core-model.md)

> **When** a half-formed idea for a capability or behaviour shows up mid-work, **I want to** record it as a spec in seconds with only an `id`, a `title`, and a sentence of intent, **so I can** keep the thought in the canonical repo instead of losing it to a side channel.

**Essence:** The cheapest possible on-ramp to the one graph. If capture has friction, intent leaks out of the repo.

**Acceptance criteria:**
1. A spec can be created at `readiness: "sketch"` with only `id`, `title`, `kind`, `abstraction`, and either `intent.outcome` or a parent relation — nothing else is required.
2. The new spec lives in `/specs/**/*.spec.ts` as committed code, immediately part of the single source of truth — no status field, ticket, or external tool is needed for it to "exist."
3. Open questions can be attached (`intent.openQuestions`) without resolving them and without blocking capture; only questions explicitly marked `blocking` constrain later promotion.
4. The spec is valid at its lowest readiness — the build never demands rules, bindings, or tests to accept a sketch.
5. The spec source is static, side-effect-free data (a "JSON file that TypeScript happens to validate"), so the extractor reifies it deterministically.
6. Two people capturing two ideas never collide on identity, because each spec carries a stable, namespaced ID (e.g. `spec:orders.create-order`); a duplicate ID is a loud build error, never a silent merge.
7. The captured spec appears in the next `akg build` with no extra steps, and its readiness claim is checked against the `sketch` profile.

---

## JS-A2
### Enrich a spec in place as it matures

**Phase:** MVP
**References:** [02 — Core Model](../docs/concept/02-core-model.md), [04 — Authoring & Binding](../docs/concept/04-authoring-and-binding.md)

> **When** an idea sharpens into rules, examples, constraints, and bindings, **I want to** add detail and raise readiness on the *same* spec object rather than convert it into a new "requirement" or "test" artifact, **so I can** avoid information loss, broken links, and duplicate sources of truth.

**Essence:** Refinement is enrichment of the same identified object, never migration into a different artifact type. Identity is permanent; only completeness grows.

**Acceptance criteria:**
1. Adding facets (`behavior`, `constraints`, `design`, `bindings`, `runtime`, …) or raising `readiness` never changes the spec's `id`, so everything pointing at it keeps resolving.
2. There is exactly one object shape — the `Spec` envelope — for a sketch, a rule, an NFR, a contract, and a verified scenario; no `Requirement → ImplementedRequirement` split exists anywhere in the flow.
3. Facets can be added in any order (a constraint before an example, a design note before a rule) without ceremony, because all facets are optional on the type.
4. Facets that are not yet known stay **absent** rather than being faked with placeholders — completeness is decided by validators, not by stub values.
5. Every enrichment is an ordinary TypeScript edit, reviewable as a normal git diff and committed alongside the implementation.
6. The original intent (the "why") remains visible alongside new detail; raising readiness is a deliberate authored claim, checked against that level's profile (`05`).
7. Re-running `akg build` after enrichment yields an updated graph with the spec's new facets and readiness, with no migration step.

---

## JS-A3
### Refine a big idea into child specs without losing the parent

**Phase:** MVP
**References:** [02 — Core Model](../docs/concept/02-core-model.md)

> **When** a large, coherent idea needs to be broken into concrete pieces, **I want to** author child specs that `refine` the parent, **so I can** drill into detail while the parent stays useful for roadmap, architecture, and shared understanding.

**Essence:** Decomposition adds children that point back to the parent; it does not consume the parent. The whole tree is one graph at different altitudes.

**Acceptance criteria:**
1. A parent spec can spawn child specs that explicitly declare `refines(parent)`, producing a declared edge in the graph.
2. The parent stays a first-class node after refinement — it is retained as long as it expresses current truth, and is present-or-absent in the repo rather than carrying "superseded" ghost state.
3. Children can sit at a finer `abstraction` (e.g. `feature → scenario`) while sharing the parent's vocabulary and constraints.
4. A child can reach higher `readiness` than its parent without contradiction (an `executable` scenario under a still-`framed` feature).
5. The relationship is queryable in both directions — parent → children and child → parent — from the graph.
6. Removing a child is an ordinary repo edit; any reference that would dangle as a result is caught by referential-integrity validation, never silently orphaned.
7. The parent and its children can be reasoned about together as a cluster, so group-level questions (shared terms, contradictory constraints) are answerable across the whole subtree, not just per spec.

---

## JS-A4
### Position any spec on two independent axes

**Phase:** MVP
**References:** [02 — Core Model](../docs/concept/02-core-model.md)

> **When** I'm describing anything from a portfolio initiative down to a single executable example, **I want to** use the same spec shape positioned by two independent dials — `abstraction` (level of thinking) and `readiness` (completeness/executability) — plus a `kind` that names the category of statement, **so I can** model the whole delivery surface without a zoo of artifact types.

**Essence:** Abstraction and readiness move independently; a linear idea→requirement→implementation pipeline cannot represent that. `kind` answers a third, orthogonal question.

**Acceptance criteria:**
1. The same spec shape expresses an `initiative`, a `capability`, a `feature`, a `scenario`, an `operation`, a `component`, and a `contract` — selected via the `abstraction` field, a clean altitude ladder.
2. `abstraction` and `readiness` are separate dimensions that move independently and are **both** first-class from day one; neither is layered in later.
3. `kind` (`capability`/`behavior`/`rule`/`constraint`/`interface`/`workflow`/`decision`/`example`) is set independently of `abstraction`; `capability` may appear in both, by design, because they answer different questions.
4. A high-`abstraction` spec can sit indefinitely at low `readiness` without being "wrong" or failing CI, as long as nothing claims a level it has not earned.
5. A low-`abstraction` spec can reach `verified` while its parent stays loosely `framed`.
6. Promoting `readiness` is a deliberate claim the author makes, checked by validators against that level's profile — never an automatic side effect of adding a facet.
7. No artifact type is chosen up front; `kind`, `abstraction`, and `readiness` are just fields on the one envelope, and the structural type checks only *shape*, leaving completeness to validators.

---

## JS-A5
### Group related specs into a coherent pack

**Phase:** MVP
**References:** [02 — Core Model](../docs/concept/02-core-model.md), [05 — Validation & Honesty](../docs/concept/05-validation-and-honesty.md)

> **When** I'm ideating a feature initiative or a bounded slice as a cluster of related specs, **I want to** group them in a `SpecPack` with a shared model, **so I can** hold a large coherent group of low-detail specs and reason at the group level before drilling into any single member.

**Essence:** A pack makes "a large coherent group of low-detail specs" a first-class state. It is validated for *coherence*, not for the completeness of any individual member.

**Acceptance criteria:**
1. A `specPack` clusters member specs (by ID reference) and carries a shared intent and shared model (terms, actors) for the group, e.g. `pack:checkout-v1`.
2. Members can sit at any readiness — the pack never forces its members toward implementation to be valid.
3. Pack coherence is validated: shared terms are defined, every member reference resolves, no member duplicates another's intent without a relation, and no member depends on an undefined concept.
4. Coherence is a distinct check from per-spec readiness profiles — a pack of pure sketches can be perfectly coherent.
5. Adding or removing a member is an ordinary repo edit; a member reference that no longer resolves is caught by referential-integrity validation.
6. Pack membership is queryable in both directions — pack → members and member → pack — from the graph.
7. The pack appears in the graph as a node with declared membership edges, regenerable like everything else.
