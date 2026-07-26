# Libar Software Delivery Protocol — Concept

> Libar Software Delivery Protocol is an **executable, self-validating meta-model of the software-delivery process**: teams author delivery intent as instances of one primitive — a `Spec` — and the meta-model (typed code in the repo) deterministically checks **conformance and honesty** and derives **one graph**. The familiar delivery nouns (Use Case, NFR, Decision Record; Epic, Feature, Story) are **named coordinates** on that one primitive, not separate artifact types. A static extractor derives the graph from the repo's authored carriers — `ts-morph` for the TS carrier (`.sdp.ts`), the ruled Markdown parser for the Markdown carrier (`.sdp.md`); the graph is never a second source of truth — it is a pure, regenerable projection. Conformance + honesty checks keep it honest in CI; every human- and AI-facing surface is a projection of the graph.

**Slogan:** *Specs are code; the graph is derived; the `claim` stays honest; git is the event log.*

The product is **Libar Software Delivery Protocol**; the CLI is **`sdp`**.

---

## The Founding Principle — One Graph

Everything in this document set is downstream of this. If any document conflicts with it, the principle wins.

1. **No second graph, ever.** There is one graph. We never stand up a parallel store that can disagree with the repo.
2. **The repository is canonical; the graph is derived and regenerable.** Delete the graph and rebuild it byte-for-byte from the repo.
3. **The `claim` is never silently collapsed or promoted.** A *declared* fact, an *anchored* binding, and an *inferred* guess stay distinguishable forever. Inference never quietly becomes truth.
4. **Truth is authored as code in the repo.** Intent, structure, and relationships are authored as typed code committed alongside the implementation — not in an external tool. (The *graph* is derived from that authored code; see #2.)
5. **Event store + projections = code and git commits.** Git history *is* the event log. Specs and code are the events; the graph and every view are projections of the repo at a commit. No bespoke event store.

> The graph is a *projection of the repository at a commit*. Change the repo, regenerate the projection. Nothing to sync, nothing to reconcile, nothing to trust beyond `git` and the code.

---

## How to read this set

These documents are deliberately principle-led and lean. The single most important distinction they make is **Principle vs Representation**:

- A **Principle** is a law the design stands or falls on. Swapping it changes what the Protocol *is*.
- A **Representation** is one chosen mechanism among several. Swapping it changes *how* a principle is realised, nothing more.

Every load-bearing claim is named as one or the other, on purpose — so a Representation is never mistaken for a Principle.

| # | Document | What it covers |
|---|---|---|
| — | [README](./README.md) | This index: definition, Founding Principle, reading guide, the MVP legend. |
| — | [Ubiquitous Language](../../CONTEXT.md) | The ratified **glossary** (`CONTEXT.md`, repo root): terms, descriptor values, relations, a worked dialogue, flagged ambiguities. The terminology base for every doc below. |
| 00 | [Vision, Scope & MVP Boundary](./00-vision-scope-and-mvp-boundary.md) | The honest full ambition **and** the sharp MVP line, in one place. |
| 01 | [Founding Principles & Invariants](./01-founding-principles-and-invariants.md) | The load-bearing laws, each tagged Principle/Representation and CORE/ASPIRATIONAL. Git-as-event-log. The `claim` epistemics. |
| 02 | [Core Model](./02-core-model.md) | The `Spec` primitive, the three descriptors (`kind` · `altitude` · `readiness`), sections, delivery facts, stable IDs, relations. |
| 04 | [Authoring & Binding](./04-authoring-and-binding.md) | The two ruled authoring carriers — Markdown (`.sdp.md`, the default) and the TypeScript DSL (`.sdp.ts`, import source and lawful per-ID option) — plus generic source anchors (framework-neutral). Packs remain TS until a Pack syntax ruling; harnesses named but deferred; the carrier competition is ruled (MD-18). |
| 05 | [Validation & Honesty](./05-validation-and-honesty.md) | Conformance + honesty checks and readiness floors; the MVP subset sharply separated from aspirational tiers. |
| 06 | [Consumers & Projections](./06-consumers-and-projections.md) | MVP: the agent surface (a typed graph the agent scripts) + Design Review + reader; edits via intent→agent→git (no patch loop). Two surfaces (curated graph vs impact graph). Aspirational: Studio, exports, MCP surface. |
| 07 | [MVP Roadmap & Open Questions](./07-mvp-roadmap-and-open-questions.md) | The vertical slice, the CORE/ASPIRATIONAL map, the cut list with rationale, and the residual open questions. |

**Reading paths:**
- Evaluating the idea → `00`, then `01`.
- Building the MVP → `07`, then `02`, `04`, `05`.
- Understanding the trust model → `01`, then the extraction Specs (`spec:extraction.derive-graph`, `spec:extraction.determinism`, `spec:extraction.claim-taxonomy`, `spec:extraction.regenerability`).
- Reasoning about the long-term shape → `00`, `06`.

---

All examples use one running domain: **Order Management** — `pack:checkout-v1`, `spec:orders.create-order`, `spec:orders.order-management`, `impl:orders.create-order-use-case`, `api:orders.post`, `test:orders.create-order.valid-cart`. Code examples are framework-neutral.

---

## MVP vs Aspirational — the legend

Every statement in this set carries one of these tags so the boundary is never blurry:

| Tag | Meaning |
|---|---|
| **CORE / MVP** | In the buildable first slice. Proves the founding principle on one bounded context. |
| **ASPIRATIONAL** | Designed-for and deliberately deferred. Named so the model never paints us into a corner — never "forgotten." |

The MVP is a tight vertical slice on **one** bounded context (Order Management, ~8–12 specs):

- the typed `Spec` DSL (the MVP's TS carrier, still supported) + generic source anchors,
- the one-graph extractor over both carriers (`ts-morph` for `.sdp.ts`, the ruled Markdown parser for `.sdp.md`),
- core conformance + honesty checks (referential integrity, duplicate IDs, honest readiness against the floor, orphan detection, `verifies` linkage),
- one generated read-only view,
- bidirectional spec↔test trace.

The write-path is simply **edit the canonical carrier + git** — no patch loop. Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option (the carrier ruling, MD-18). Everything else is aspirational and labelled as such, with the rationale for cutting it in `07`.
