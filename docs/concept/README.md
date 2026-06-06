# Libar Omni — Concept

> A repo-native, TypeScript-first specification graph that turns the entire software delivery process — from idea, through design and implementation, to runtime evidence — into one typed, queryable, validated model with generated interactive views.

Working internal codename for the graph subsystem: **AKG** (Architecture Knowledge Graph). The product-level umbrella is **Libar Omni**.

---

## What this is in one paragraph

Libar Omni treats the codebase as a *typed, queryable model of the whole software delivery process*. The authoring surface is TypeScript, augmented by lightweight source-code markers and (where appropriate) annotated Gherkin. A `ts-morph`-based extractor builds a canonical **graph** of nodes (specs, capabilities, components, runtime layers, routes, tests, decisions, evidence) and edges (declared, annotation-derived, and inferred). Multi-tier validators run in CI. Everything human- or AI-facing — diagrams, traceability matrices, dashboards, AI context slices, OpenAPI/AsyncAPI contracts, ADR indexes — is generated from the graph. A primary human surface is an **HTML Spec Studio**: a generated interactive workbench that lets people read, explore, simulate, and refine specs, with any edits flowing back as validated JSON patches into the canonical TypeScript spec files.

The slogan: **"Specs are code. HTML is the lens. Interactions produce patches. Validators decide what is allowed."**

---

## Why this exists

The discussion in `docs-inputs/01-concept-architecture-discussion/` arrived at this design through six refinement steps. The pain points it addresses:

1. **Documentation rots.** Markdown plans and architecture decks drift away from code within weeks. They cannot be type-checked, validated, or referenced by other tools.
2. **Requirements live in a parallel universe.** Jira tickets, Confluence pages, BDD `.feature` files, and ADR markdown files each carry partial truth, and none of them know about the others.
3. **AI agents need *structured*, not just textual, context.** A typed graph of `spec → capability → component → route → layer → test → evidence` is dramatically more useful to an LLM than raw concatenated source files.
4. **TypeScript is already an excellent metamodel.** Discriminated unions, `as const`, `satisfies`, branded IDs, project references, and the compiler API give you most of what a bespoke spec system would need — *if* you organise around them deliberately.
5. **Markdown is reaching its expressive limit.** As specs get larger and richer (graphs, comparisons, simulations, traceability), Markdown becomes the bottleneck. Generated HTML is a stronger reader surface — and a credible *editing* surface when paired with a validated patch-back loop.
6. **A single primitive — `Spec` — beats a five-stage requirement pipeline.** The same object shape can carry an idea, a capability, a behavior, a rule, an NFR, a contract, a design binding, an executable example, or verified evidence. Maturity is *required completeness*, not a change of artifact type.

---

## Document map

Read in order, or jump to what you need. Each document is self-contained but assumes the vocabulary established in earlier ones.

| # | Document | What it covers |
|---|---|---|
| 00 | [Vision & Product Concept](./00-vision-and-product.md) | Problem statement, target users, value, scope, non-goals, mental model. |
| 01 | [Core Primitives](./01-core-primitives.md) | The `Spec` primitive, facets, the two axes (abstraction × readiness), `SpecPack`, refinement vs replacement. |
| 02 | [System Architecture](./02-system-architecture.md) | Layered architecture, data flow, package boundaries, derived-vs-canonical rule, project references. |
| 03 | [Graph Metamodel](./03-graph-metamodel.md) | Canonical node/edge kinds, edge provenance (declared/annotation/inferred), stable IDs, lifecycle profiles. |
| 04 | [Authoring Surfaces](./04-authoring-surfaces.md) | TypeScript Spec DSL, source-code markers (decorators / JSDoc / marker constants), annotated Gherkin, harnesses. |
| 05 | [Runtime Anchors](./05-runtime-anchors.md) | Fastify as HTTP edge, Effect Layers as typed dependency graph, Awilix as transitional option, one-truth rule. |
| 06 | [Extraction & Validation](./06-extraction-and-validation.md) | `ts-morph` extractor pipeline, layered validation tiers (TS, schema, graph, lint, arch tests, dataflow), readiness profiles. |
| 07 | [Spec Studio & Projections](./07-spec-studio-and-projections.md) | HTML Spec Studio UX, Web Components, patch-back loop, harnesses, other generated views (LikeC4, Gherkin export, JSON-LD, AI slices). |
| 08 | [Delivery Evidence & Tooling](./08-delivery-evidence-and-tooling.md) | OTel / SLSA / CycloneDX integration, CLI surface, repository layout, MVP→V4 roadmap, open questions and limitations. |

---

## The minimum mental model

If you only remember five things:

1. **One primitive.** Every durable delivery artifact is a `Spec`, identified by a stable string ID. A `Spec` has the same outer shape regardless of how mature or abstract it is — only its *required facets* change.
2. **Two axes, not one stage pipeline.** A `Spec` has both an **abstraction** (`initiative | capability | feature | rule | scenario | operation | component | contract`) and a **readiness** (`sketch | framed | specified | designed | bound | executable | verified`). They move independently.
3. **Graph = declared + annotation + inferred.** Three edge sources, never collapsed: explicit edges in typed model files, annotation-derived edges from source markers, and `ts-morph`-derived structural edges. Every edge carries provenance.
4. **TypeScript is canonical. HTML is the lens.** The repo holds typed `.spec.ts` files and source code. Everything else — graphs, diagrams, dashboards, the Spec Studio, AI context, OpenAPI — is *derived* and regenerable. HTML edits round-trip through validated patches.
5. **One runtime truth.** Fastify is the HTTP edge. Effect Layers (preferred) *or* Awilix (transitional) is the dependency graph — never both as first-class. The architecture graph extracts from whichever one is canonical.

---

## What is explicitly out of scope (initially)

These were considered and deferred:

- A graph database (Neo4j, Memgraph) as the canonical store. The repo file `architecture.graph.json` is enough until traversal scale demands more.
- A custom TypeScript transformer (`ts-patch`) that fails `tsc` on architectural violations. Tier the gate: TS catches type shape, schema validation catches data shape, graph validators catch invariants. Don't contort the type system.
- A VS Code extension. Useful eventually; do not block the system on tooling that takes months to build.
- Auto-recovery of trace links from identifiers, comments, and code relations. Useful as a *suggestion* engine later, never as authoritative truth.
- Modelling the entire enterprise delivery lifecycle in one pass. Pick one bounded context (e.g. *Order Management*), prove the loop, then expand.

---

## How to use this document set

- If you are evaluating the idea → read `00` and `01`, then skim `07` for the Spec Studio UX.
- If you are a TypeScript architect → read `02`, `03`, `06` carefully; the rest second.
- If you are a product or UX designer → read `00`, `01`, `07`.
- If you are planning implementation → read `02`, `06`, `08`.
- If you are deciding between Awilix and Effect → read `05`.

All examples use a consistent running domain: **Order Management** (`pack:checkout-v1`, `spec:orders.create-order`, and friends).
