# A — Capture & Evolve Intent

The job here is to get a thought into the system and let it grow without ever forcing a migration to a new artifact. One primitive — a **spec** — carries it the whole way.

---

## JS-A1
### Capture a rough idea with zero ceremony

**Phase:** MVP
**References:** [01 — Core Primitives](../docs/concept/01-core-primitives.md)

> **When** a half-formed idea for a capability or behaviour shows up mid-work, **I want to** record it as a spec in seconds with only a title and a sentence of intent, **so I can** keep the thought in the canonical repo instead of losing it to a side channel.

**Essence:** The cheapest possible on-ramp to the one graph. If capture has friction, intent leaks out of the repo.

**Acceptance criteria:**
1. A spec can be created with only an `id`, a `title`, and one line of intent — nothing else is required.
2. The new spec lives in the repo as committed code, immediately part of the single source of truth.
3. Open questions and unknowns can be attached without resolving them and without blocking capture.
4. No status field, ticket, or external tool is needed for the idea to "exist."
5. The idea is valid at its lowest readiness — the system never demands implementation or tests to accept it.
6. Two people capturing two ideas never collide on identity, because each spec carries a stable, namespaced ID.
7. The captured spec shows up in the next graph build with no extra steps.

---

## JS-A2
### Enrich a spec in place as it matures

**Phase:** MVP
**References:** [01 — Core Primitives](../docs/concept/01-core-primitives.md)

> **When** an idea sharpens into rules, examples, and constraints, **I want to** add detail to the *same* spec rather than convert it into a new "requirement" or "test" artifact, **so I can** avoid information loss, broken links, and duplicate sources of truth.

**Essence:** Refinement is enrichment, not replacement. The artifact's identity is permanent; only its completeness grows.

**Acceptance criteria:**
1. Adding rules, examples, constraints, or design notes never changes the spec's identity.
2. The spec's stable ID is preserved across every enrichment, so everything pointing at it keeps working.
3. Detail can be added in any order — a constraint before an example, a design note before a rule — without ceremony.
4. Facets that are not yet known stay absent rather than being faked with placeholders.
5. The change is an ordinary code edit, reviewable as a normal git diff.
6. No "migrate idea → requirement" step exists anywhere in the flow.
7. Earlier intent (the original "why") remains visible alongside the new detail.

---

## JS-A3
### Refine a big idea into child specs without losing the parent

**Phase:** MVP
**References:** [01 — Core Primitives](../docs/concept/01-core-primitives.md)

> **When** a large, coherent idea needs to be broken into concrete pieces, **I want to** decompose it into child specs that point back to the parent, **so I can** drill into detail while the parent remains useful for roadmap, architecture, and shared understanding.

**Essence:** Decomposition adds children; it does not delete the parent. The whole tree is one graph at different altitudes.

**Acceptance criteria:**
1. A parent spec can spawn child specs that explicitly declare they refine it.
2. The parent stays a first-class node after refinement — it is not consumed or hidden.
3. Children can be at finer altitude (feature → scenario) while sharing the parent's vocabulary and constraints.
4. A child can mature faster than its parent without contradiction (an executable scenario under a still-framed feature).
5. The relationship is queryable in both directions — parent to children and child to parent.
6. Group-level coherence (shared terms, no contradictory constraints) can be checked across the whole cluster, not just per-spec.
7. Removing a child never silently orphans its references; the link is explicit and reviewable.

---

## JS-A4
### Use one shape at any altitude and readiness

**Phase:** MVP
**References:** [01 — Core Primitives](../docs/concept/01-core-primitives.md)

> **When** I'm describing anything from a portfolio initiative down to a single executable example, **I want to** use the same spec shape with two independent dials — how abstract it is and how ready it is — **so I can** model the whole delivery surface without a zoo of artifact types.

**Essence:** Maturity is *required completeness*, not a change of object. Abstraction and readiness move independently.

**Acceptance criteria:**
1. The same spec shape expresses an initiative, a capability, a feature, a rule, a scenario, and a contract.
2. Abstraction (how high-level) and readiness (how complete/verified) are separate dimensions that move independently.
3. A high-level spec can sit indefinitely at low readiness without being "wrong" or failing anything.
4. A low-level spec can reach full readiness while its parent stays loosely framed.
5. Promoting readiness is a deliberate claim the author makes, not an automatic side effect.
6. No artifact type needs to be chosen up front; kind and altitude are just fields on the one shape.
7. The model starts simple (a readiness dial is enough on day one) and the abstraction dial layers in without reshaping existing specs.
