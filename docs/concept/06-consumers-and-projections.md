# 06 — Consumers & Projections

Everything human- or AI-facing is **generated from the one graph** (P1, P2, L8). The law of each surface now lives in the Spec that carries it, under the concept-documents dissolution decision (`spec:decisions.concept-docs-dissolve`). Each section below keeps its pointers; §6 also keeps the one mapping no Spec carries.

> Sink priority (a Representation-level stance, but a firm one): **agents first, human view second, document exports last.**

---

## 1. Projections fan out from one graph

- **The projection law** — `spec:consumers.projections-model`: a projection is a pure, disposable, regenerable function of the graph and never a second source of truth. The same Spec defines the curated graph, the reader and curation.
- **The shipped projections stay frozen** (MD-32) — `spec:decisions.shipped-projections-frozen`: the Design Review (`spec:consumers.design-review`), the census (`spec:consumers.census-page`), the Mermaid diagrams (`spec:consumers.mermaid-view`) and the Gherkin-shaped read view (`spec:consumers.gherkin-view`).
- **Surfaces designed and not built** — the Spec Studio, a workbench ruled to render derived HTML (MD-41) from custom elements (MD-42) and designed in `pack:spec-studio-v1`, with per-pull-request previews in `spec:consumers.spec-studio.sharing`; the reference projection, captured at `idea` (`spec:consumers.reference-projection`); and the MCP surface for user-facing apps (`spec:decisions.mcp-deferred`).

---

## 2. The two surfaces — curated graph vs impact graph

- **The principle** — P10's two-surface corollary in `01`: the inferred layer serves impact and curation assist and never derives or densifies the authored architecture.
- **Mechanical structure stays inferred and apart** — `spec:consumers.impact-graph`: no curated edge, binding or delivery fact derives from it, and the divergence between the two surfaces is curation, not drift (`spec:consumers.projections-model`).
- **File-level curation advice** — `spec:consumers.impact-graph.curation-assist`: file-level imports show uncovered load-bearing files and disagreements between anchored `uses` and the code's imports, as advice that authors nothing.
- **Exhaustive symbol reach** — `spec:consumers.impact-graph.symbol-reach`: deferred until a language-neutral symbol identity exists.
- **Changeset blast radius** — `spec:consumers.reader`: file-level reach over the curated graph that names every changed file the graph records nothing at as `coverage-unknown`.

---

## 3. The agent surface — a typed graph the agent scripts

- **The surface** — `spec:consumers.agent-surface` and the agents-script-the-graph decision (D5, `spec:decisions.agent-surface-scripts-graph`): a visible typed graph is the contract, agents arrive holding a string, a file or a changeset, and the surface grows by recipe, freezing a join into the reader only at the second-caller bar. `bySymbol` would resolve through symbol reach, whose identity is still open (`spec:consumers.impact-graph.symbol-reach`).
- **The reader** — `spec:consumers.reader`: the thin typed loader that decodes joins and claims once and persists nothing.
- **The front door** (MD-22) — `spec:decisions.agent-front-door`: the package exports the reader, and the CLI's one evaluation sink, `sdp q`, injects that same reader plus the raw graph, the validation report and the caller's `params`.
- **Recipes** — `spec:consumers.agent-surface.register-recipes` and the catalog at `docs/agent-surface/recipes.md`, each body executed as written.
- **Context bundles** — `spec:consumers.context-bundle`: the reading material for one design pass, composed per invocation within a stated budget.

---

## 4. The edit model — intent composition, not patching

- **The loop** — `spec:consumers.edit-model`: a view composes scoped intent, an agent edits source as a human would, git records the edit, and the conformance and honesty checks evaluate it. Lifecycle changes are ordinary source and git edits. A speculative check of an in-memory patch adds nothing to the conformance and honesty checks that evaluate every ordinary source edit.
- **The hand-off** — `spec:consumers.intent-composition` and `spec:consumers.intent-composition.proposal`: a change proposal is the one structured hand-off, a reviewable request an agent applies as an ordinary source edit. It is not an automated patch writer, and no tool rewrites a carrier from it.

---

## 5. Design Review — the flagship human projection

- **The review** — `spec:consumers.design-review`: a Spec or a Pack rendered in context, the context in which a human decides to state `ready`; validators check only the structural floor, and the review is never a gate or a recorded fact.
- **What a page shows** — derived readiness beside the stated rung (`spec:consumers.derived-readiness-banner`), binding language instead of delivery-fact names (`spec:consumers.binding-language-views`), and the Pack's design on its Pack page (the Pack design page, MD-39, `spec:consumers.design-review.pack-design-page`).
- **How it is written** — `spec:consumers.wholesale-view-rewrite`: generated Markdown, rewritten wholesale on each run. The Spec Studio renders derived HTML beside it (the Studio renders derived HTML, MD-41).

---

## 6. Delivery-process execution — projections & vocabulary, not gates

The Protocol adopts the established delivery nouns and rejects the process gates (adopt the nouns, reject the gates, MD-2, `spec:decisions.adopt-the-nouns`). Discipline is a filter by kind or section (`spec:consumers.projections-model`); release, baseline, phase, iteration and milestone are optional roadmap views, deferred until a reader needs them (`spec:consumers.projections-model.roadmap-views`).

How the classic disciplines map onto the one graph, as filters rather than phases:

- **Requirements** → `behavior` Specs (+ a designed-for, unbuilt Capability Map projection)
- **Analysis & Design** → `design` sections + Decision Records
- **Test** → `example` Specs + `verifies` relations
- **Deployment** → the `observed` delivery fact, aspirational (`spec:observation.runtime-overlay`)
- **Config & Change Management** → git (the source of truth)
- **Project Management** → Packs (+ the deferred roadmap views)
- **Business Modeling** → `model` Specs
