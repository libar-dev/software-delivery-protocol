# Libar Omni — Concept

> Libar Omni treats a TypeScript codebase as the single, canonical source of truth for the *whole software delivery process* — idea, capability, behaviour, rule, NFR, decision, contract, executable example, and verified evidence — using one progressive primitive called a `Spec`. A `ts-morph` extractor derives **one graph** from the repo. The graph is never a second source of truth: it is a pure, regenerable projection of the repo. Validators keep it honest in CI. Human- and AI-facing views are generated from the graph.

**Slogan:** *Specs are code; the graph is derived; provenance stays honest; git is the event log.*

The internal codename for the graph subsystem is **AKG** (the `akg` CLI). The product umbrella is **Libar Omni**.

---

## The Founding Principle — One Graph

Everything in this document set is downstream of this. If any document conflicts with it, the principle wins.

1. **No second graph, ever.** There is one graph. We never stand up a parallel store that can disagree with the repo.
2. **The repository is canonical; the graph is derived and regenerable.** Delete the graph and rebuild it byte-for-byte from the repo.
3. **Provenance is never silently collapsed or promoted.** A *declared* fact, an *annotation*, and an *inferred* guess stay distinguishable forever. Inference never quietly becomes truth.
4. **Single source of truth: the graph is code in the repo.** Intent, structure, and relationships live as typed code committed alongside the implementation — not in an external tool.
5. **Event store + projections = code and git commits.** Git history *is* the event log. Specs and code are the events; the graph and every view are projections of the repo at a commit. No bespoke event store.

> The graph is a *projection of the repository at a commit*. Change the repo, regenerate the projection. Nothing to sync, nothing to reconcile, nothing to trust beyond `git` and the code.

---

## How to read this set

These documents are deliberately principle-led and lean. The single most important distinction they make is **Principle vs Representation**:

- A **Principle** is a law the design stands or falls on. Swapping it changes what Libar Omni *is*.
- A **Representation** is one chosen mechanism among several. Swapping it changes *how* a principle is realised, nothing more.

The earlier v1 concept set oversold several Representations (the runtime anchor, HTML/Web Components, the tier count, the ID grammar, the patch format) as if they were Principles. This set names every load-bearing claim as one or the other, on purpose.

| # | Document | What it covers |
|---|---|---|
| — | [README](./README.md) | This index: definition, Founding Principle, reading guide, the MVP legend. |
| 00 | [Vision, Scope & MVP Boundary](./00-vision-scope-and-mvp-boundary.md) | The honest full ambition **and** the sharp MVP line, in one place. |
| 01 | [Founding Principles & Invariants](./01-founding-principles-and-invariants.md) | The load-bearing laws, each tagged Principle/Representation and CORE/ASPIRATIONAL. Git-as-event-log. Provenance epistemics. |
| 02 | [Core Model](./02-core-model.md) | The `Spec` primitive, the two axes (abstraction × readiness), facets, stable IDs, relations. |
| 03 | [The One Graph](./03-the-one-graph.md) | Derivation, determinism, provenance, regenerability, git as the event log, the no-second-store rule. |
| 04 | [Authoring & Binding](./04-authoring-and-binding.md) | MVP surfaces: the TypeScript DSL + generic source markers (framework-neutral). Gherkin/harnesses named but deferred. |
| 05 | [Validation & Honesty](./05-validation-and-honesty.md) | Validation tiers and readiness profiles; the MVP subset sharply separated from aspirational tiers. |
| 06 | [Consumers & Projections](./06-consumers-and-projections.md) | MVP: typed graph handle + one read-only view; edits via intent→agent→git (no patch loop). Two surfaces (curated vs substrate). Aspirational: Studio, exports, MCP. |
| 07 | [MVP Roadmap & Open Questions](./07-mvp-roadmap-and-open-questions.md) | The vertical slice, the cut list with rationale, the cuts that warrant a human decision, the resolved tensions. |

**Reading paths:**
- Evaluating the idea → `00`, then `01`.
- Building the MVP → `07`, then `02`, `04`, `05`.
- Understanding the trust model → `01`, `03`.
- Reasoning about the long-term shape → `00`, `06`.

All examples use one running domain: **Order Management** — `pack:checkout-v1`, `spec:orders.create-order`, `capability:order-management`, `impl:CreateOrderUseCase`, `api:POST:/orders`, `test:orders.create-order.valid-cart`. Code examples are framework-neutral.

---

## MVP vs Aspirational — the legend

Every claim in this set carries one of these tags so the boundary is never blurry:

| Tag | Meaning |
|---|---|
| **CORE / MVP** | In the buildable first slice. Proves the founding principle on one bounded context. |
| **ASPIRATIONAL** | Designed-for and deliberately deferred. Named so the model never paints us into a corner — never "forgotten." |

The MVP is a tight vertical slice on **one** bounded context (Order Management, ~8–12 specs):

- the typed `Spec` DSL + generic source markers,
- the `ts-morph` one-graph extractor,
- core validators (referential integrity, duplicate IDs, readiness-profile completeness, orphan detection, `verifies` linkage),
- one generated read-only view,
- bidirectional spec↔test trace.

The MVP write-path is simply **edit TypeScript + git** — no patch loop. Everything else is aspirational and labelled as such, with the rationale for cutting it in `07`.
</content>
</invoke>
