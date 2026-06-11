# A — Capture & Evolve Intent

The job here is to get a thought into the system and let it grow without ever forcing a migration to a new artifact. One primitive — a **spec** — carries an idea from a one-line note all the way to realized delivery. Maturity is *required completeness*, not a change of object type.

---

## JS-A1
### Capture a rough idea with zero ceremony

**Phase:** MVP
**References:** [02 — Core Model](../docs/concept/02-core-model.md)

> **When** a half-formed idea for a behaviour or capability shows up mid-work, **I want to** record it as a spec in seconds with only an `id`, a `title`, and a sentence of intent, **so I can** keep the thought in the canonical repo instead of losing it to a side channel.

**Essence:** The cheapest possible on-ramp to the one graph. If capture has friction, intent leaks out of the repo.

**Acceptance criteria:**
1. A spec can be created at `readiness: "idea"` with only `id`, `title`, `kind`, `altitude`, and either `intent.outcome` or a parent relation — nothing else is required.
2. The new spec lives in a `*.sdp.ts` file under the extraction root (conventionally `/specs/`) as committed code, immediately part of the single source of truth — no status field, ticket, or external tool is needed for it to "exist."
3. Open questions can be attached (`intent.openQuestions`) without resolving them and without blocking capture; only questions explicitly marked `blocking` constrain stating `defined`/`ready` later.
4. The spec is valid at its lowest readiness — the build never demands rules, anchors, or tests to accept an idea.
5. The spec source is static, side-effect-free data (a "JSON file that TypeScript happens to validate"), so the extractor reifies it deterministically.
6. Two people capturing two ideas never collide on identity, because each spec carries a stable, namespaced ID (e.g. `spec:orders.create-order`); a duplicate ID is a loud build error, never a silent merge.
7. The captured spec appears in the next `sdp build` with no extra steps, and its stated readiness is checked against the `idea` floor.

---

## JS-A2
### Enrich a spec in place as it matures

**Phase:** MVP
**References:** [02 — Core Model](../docs/concept/02-core-model.md), [04 — Authoring & Binding](../docs/concept/04-authoring-and-binding.md)

> **When** an idea sharpens into rules, examples, constraints, and decisions, **I want to** add detail and raise readiness on the *same* spec object rather than convert it into a new "requirement" or "test" artifact, **so I can** avoid information loss, broken links, and duplicate sources of truth.

**Essence:** Refinement is enrichment of the same identified object, never migration into a different artifact type. Identity is permanent; only completeness grows.

**Acceptance criteria:**
1. Adding sections (`behavior`, `constraints`, `design`, `decision`, …) or raising `readiness` never changes the spec's `id`, so everything pointing at it keeps resolving.
2. There is exactly one object shape — the `Spec` envelope — for an idea, a rule, an NFR, a contract, and an example with a verifier; no `Requirement → ImplementedRequirement` split exists anywhere in the flow.
3. Sections can be added in any order (a constraint before an example, a design note before a rule) without ceremony, because all sections are optional on the type.
4. Sections that are not yet known stay **absent** rather than being faked with placeholders — completeness is decided by validators, not by stub values.
5. Every enrichment is an ordinary TypeScript edit, reviewable as a normal git diff and committed alongside the implementation.
6. The original intent (the "why") remains visible alongside new detail; raising readiness is a deliberate authored assertion, checked against that level's floor (`05`).
7. Re-running `sdp build` after enrichment yields an updated graph with the spec's new sections and readiness, with no migration step.

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
3. Children can sit at a finer `altitude` (e.g. a Feature refined into Stories) while sharing the parent's vocabulary and constraints; a Scenario is a low-altitude `example`-kind child that `verifies` a Story, not an altitude of its own.
4. A child can be *more mature* than its parent without contradiction — e.g. a `defined` example, or an example *with a verifier*, under a still-`scoped` feature. (Reaching `ready` is the one exception: the `ready` floor requires the child's `refines`/`dependsOn` targets to be ≥ `defined`, so a `ready` child cannot sit under a `scoped` parent — `05`.)
5. The relationship is queryable in both directions — parent → children and child → parent — from the graph.
6. Removing a child is an ordinary repo edit; any reference that would dangle as a result is caught by referential-integrity checks, never silently orphaned.
7. The parent and its children can be reasoned about together as a cluster, so group-level questions (shared terms, contradictory constraints) are answerable across the whole subtree, not just per spec.

---

## JS-A4
### Position any spec on independent descriptors

**Phase:** MVP
**References:** [02 — Core Model](../docs/concept/02-core-model.md)

> **When** I'm describing anything from a large epic down to a single example with a verifier, **I want to** use the same spec shape positioned by three authored descriptors — `kind` (category of truth), `altitude` (size / scope), and `readiness` (design maturity) — **so I can** model the whole delivery surface without a zoo of artifact types.

**Essence:** Altitude and readiness move independently; a linear idea→requirement→implementation pipeline cannot represent that. `kind` answers a third, orthogonal question, as a true subtype.

**Acceptance criteria:**
1. The same spec shape expresses an `epic`, a `feature`, and a `story` — selected via the `altitude` field, a clean 3-rung ladder — with the familiar delivery nouns (Epic / Feature / Story) as named coordinates, not separate artifact types.
2. `altitude` and `readiness` are separate positional descriptors that move independently and are **both** first-class from day one; neither is layered in later.
3. `kind` (`behavior`/`workflow`/`example`/`rule`/`constraint`/`model`/`decision`/`contract`) is set independently of `altitude` and `readiness`, because it answers a different question — *what category of truth*, as a true subtype. NFR (a `constraint` flavor), Scenario (an `example`), and capability/domain (projections) are labels, not kinds.
4. A high-`altitude` spec can sit indefinitely at low `readiness` without being "wrong" or failing CI, as long as nothing states a level it has not earned.
5. A low-`altitude` spec can gain a verifier (the `has-verifier` delivery fact) while its parent stays loosely `scoped`.
6. Stating a higher `readiness` is a deliberate assertion the author makes, checked by validators against that level's floor — never an automatic side effect of adding a section.
7. No artifact type is chosen up front; `kind`, `altitude`, and `readiness` are just fields on the one envelope, and the structural type checks only *shape*, leaving completeness to validators.

---

## JS-A5
### Group related specs into a coherent pack

**Phase:** MVP
**References:** [02 — Core Model](../docs/concept/02-core-model.md), [05 — Validation & Honesty](../docs/concept/05-validation-and-honesty.md)

> **When** I'm ideating a feature initiative or a bounded slice as a cluster of related specs, **I want to** group them in a `Pack` with shared model references, **so I can** hold a large coherent group of low-detail specs and reason at the group level before drilling into any single member.

**Essence:** A pack makes "a large coherent group of low-detail specs" a first-class state. It is checked for *coherence*, not for the completeness of any individual member — and it states no truth of its own.

**Acceptance criteria:**
1. A `pack()` clusters member specs (by ID reference) and carries a shared `framing` note (a plain description, **not** the truth-bearing `intent` shape a `Spec` carries) and `modelRefs` to shared `kind:"model"` specs for the group, e.g. `pack:checkout-v1`.
2. Members can sit at any readiness — the pack never forces its members toward implementation to be valid.
3. Pack coherence is checked **deterministically**: referenced terms and `modelRefs` resolve, every member reference resolves, and no member ID is duplicated — never a semantic "duplicated intent" judgment.
4. Coherence is a distinct check from per-spec readiness floors — a pack of pure ideas can be perfectly coherent.
5. Adding or removing a member is an ordinary repo edit; a member reference that no longer resolves is caught by referential-integrity checks.
6. Pack membership is queryable in both directions — pack → members and member → pack — from the graph.
7. The pack appears in the graph as a node; its membership (`belongsTo`) edges are **derived** from the manifest (carrying `claim:"declared"`), regenerable like everything else.

---

## JS-A6
### Survey the landscape to decide where to invest next

**Phase:** Iterate
**References:** [02 — Core Model](../docs/concept/02-core-model.md), [06 — Consumers & Projections](../docs/concept/06-consumers-and-projections.md)

> **When** I'm scoping a new initiative and deciding where to put effort, **I want to** see the pack/capability landscape and where intent is still thin (specs at `idea`/`scoped`), **so I can** choose what to flesh out next instead of guessing from memory or scattered docs.

**Essence:** The same graph that serves engineers and agents answers the shaping question too — *what is barely started, what is mature, where are the holes* — as a projection over `readiness` and grouping, never a separate planning tool. A situation common to product/business shaping, served by the one graph.

**Acceptance criteria:**
1. The graph can be grouped by `Pack` (and by the Capability Map projection over high-altitude `behavior` specs) so the landscape is legible at the initiative level, not just per spec.
2. Specs can be filtered and counted by `readiness`, so "what is still `idea`/`scoped`" and "what is already `ready`" are answerable at a glance.
3. The view distinguishes thin areas (mostly low-readiness specs) from mature ones, surfacing where investment would move the needle.
4. Nothing here authors truth or status — it is a pure projection of the graph at a commit; shaping decisions become ordinary spec edits, not tool state.
5. The same answer is reachable by an agent through the agent surface, so a shaping conversation can be handed structured context, not a prose summary.
6. Open questions and `gap`s roll up to the group level, so a thin area is visible as *what is missing*, not just *how few specs exist*.
