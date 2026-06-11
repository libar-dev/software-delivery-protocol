# 06 — Consumers & Projections

Everything human- or AI-facing is **generated from the one graph** (P1, P2, L8). The #1 consumer is **agents**; a human view is second; static document exports are last. This document covers what the MVP ships — the graph plus the agent surface, the flagship Design Review, and one human view — and names the richer projections that are designed-for and deferred.

> Sink priority (a Representation-level stance, but a firm one): **agents first, human view second, document exports last.** The MVP optimises the sink the old framing optimised least.

A **`projection`** is a pure function of the graph producing a consumer artifact: disposable, regenerable, **never a second source**. *Everything* consumer-facing is a projection.

---

## 1. The principle: projections are a fan-out off one model

**Principle · CORE.** The graph fans out to many co-equal projections, each serving a consumer, all pure functions of the graph (`output = f(graph)`). No projection is a second source of truth; all are disposable and regenerable. *Which* projections exist is Representation; *that they are all derived from the one graph* is the principle.

```
                 ┌── agent surface (typed graph + graph.json)   (agents — the #1 sink)   ← MVP
graph  ──fan──►  ├── Design Review + one read-only view          (humans)                 ← MVP
                 ├── Spec Studio (rich interactive)              (stakeholders)           ← aspirational
                 ├── LikeC4 / OpenAPI / JSON-LD exports                                   ← aspirational
                 └── MCP surface (user-facing app integration)                            ← aspirational
```

### The surfaces & projections taxonomy

The canonical set of surfaces, each a projection of the one graph:

| Surface | What it is | Notes |
|---|---|---|
| **Design Review** | the flagship curated review: a `Spec`/`Pack` rendered *in context* — neighbors, relations, `claim`/delivery badges, auto-generated **design questions** + a **findings** table | the context in which a human decides to state `ready` (validators check only the structural floor — never a gate) |
| **agent surface** | a **visible typed graph the agent *scripts*** via the CLI — no verb wall; the schema *is* the contract | **push** a Design-Review slice + **pull** by scripting the graph |
| **reader** | the thin typed loader: joins + `claim`/taxonomy decode done **once**, returns composable data; persists nothing | a front door, not a store |
| **Mermaid projection** | logical / analytical / topological charts | live, regenerable |
| **reference projection** | interface / API reference, kept current | live |
| **context bundle** | a token-budgeted curated slice pushed to an agent | |
| **MCP surface** | integration for user-facing apps — designed-in, **deferred build**, shape TBD | distinct from the agent surface (agents *script*; apps *integrate*) |
| **impact graph** | the exhaustive import/symbol structure for blast-radius / find-all-usages | divergence from the curated graph is **curation, not drift** |

---

## 2. The two surfaces — curated graph vs impact graph

**Principle · CORE.** There are two graph surfaces that answer *different questions*. They are not truth-vs-approximation; conflating them is a category error.

| | **Curated graph** | **Impact graph** |
|---|---|---|
| answers | "what *is* the architecture" | "what could break / where is this used at all" |
| virtue | **editorial sparsity** (human judgment) | **exhaustiveness** (derived) |
| source | authored specs + anchors (declared / anchored) | code structure — imports, symbols, calls (inferred) |
| authored by | a human, deliberately | derived on demand, never curated |
| feeds | the view, AI context, exports | impact / blast-radius / find-all-usages / curation assist |
| relation to a language server | **is the differentiator** | **is the language server** |

This is the `claim` taxonomy (P9) elevated to two consumable surfaces: the curated graph is the `declared` + `anchored` layers; the impact graph is the `inferred` layer.

**Does this violate "no second graph, ever"? No.** The curated graph *is* the read model. The impact graph is a *separate derived structure* — regenerable from code, never authored, never authoritative (P10) — not a competing source of truth. Both are pure functions of the repo, and the **reader** over both authors and persists nothing — a front door, not a store.

### The correction that defines this model (do not regress)

**Do not derive the architecture from code.** Architectural significance is an editorial judgment no import graph can produce. So:

- The divergence between the curated graph and the impact graph is **curation, not drift.** A curated graph that is a deliberately small curated selection of the mechanical firehose is *correct by design*.
- Never "densify" the curated graph by inferring edges from imports — that just rebuilds the language server and throws away the curation.
- The impact graph has exactly one firehose job (impact / re-test scope) plus two *assist* roles that never overwrite the curated layer: **propose candidates** (e.g. high-fan-in modules with no node) and **flag unambiguous drift** (a `satisfies` target whose source file was deleted) — narrow, honest signals only.

> MVP boundary (decided, not a sequencing call): the curated surface is MVP, and so is **file-level** impact — `git diff` → `byFile` → a curated-graph walk of `refines`/`dependsOn`/`satisfies`/`verifies` yields changeset blast-radius **without a symbol index**. The **exhaustive** impact graph — symbol-level identity, `bySymbol`, cross-package find-all-usages — is the `inferred` surface and stays **aspirational** (the glossary's *impact graph* entry). So MVP impact rides the curated graph + file-level reach; symbol-level reach is deferred. This is a boundary on the impact graph's *depth*, not a reopening of the two-surface model. Because it rides anchors + curated edges, it answers *which anchored specs a changeset touches*: **a changed file with no anchor maps to no spec and is surfaced as an explicit `coverage-unknown` item, never silently dropped** — file-level reach can under-report for shared or unanchored code, and the answer says so rather than implying a complete reach set.

---

## 3. The agent surface — a typed graph the agent scripts

**Principle · CORE.** Structured graph context beats raw text for AI; the Protocol is a *producer* of structured context, not just another consumer. This is a genuine differentiator and it is a principle.

The experiment settled *how* to expose it. The **agent surface** is a **visible, self-describing typed graph the agent *scripts*** via the CLI — deliberately **neither** of two failure modes:

- **not a 30-verb API** — that hides the shapes and rebuilds the pipeline we are deleting;
- **not raw-JSON-you-rejoin** — that makes every agent re-derive the same joins and decode the same taxonomy quirks.

**The schema file is the contract:** read it, then script freely. **Under-typing a shape hides a capability** — an agent reading the contract cannot use a field that isn't typed. There is no verb wall. The harness **pushes** a Design-Review slice for the task (D4); the agent **pulls** the long tail by scripting the graph (D5). **The coding agent never goes through MCP** — MCP is the *user-facing-app* integration surface (§7), a different consumer.

### The reader — the thin typed loader

The **`reader`** is the *component* behind the surface: joins and `claim`/taxonomy-decode are done **once at construction**; accessors return plain, composable data; it persists nothing and is rebuilt fresh each load (a front door, not a store). *Needs drive the surface, not storage.*

**Freeze only** the small irreducible set — a *universal bridge* or an *irreducible cross-source join* — the things an agent hand-rolling would get wrong:

- **Entry adapters** — the grep→graph bridge. Real work starts from a **string** ("rate limiter"), a **file** (`src/...`), or a **changeset** (`git diff`); the graph is keyed by name. `findByConcept(str)` and `byFile(path)` bridge from what-the-agent-has to what-the-graph-knows and are **MVP** (both resolve off the curated graph + anchors, no symbol index). `bySymbol(sym)` is the same shape but resolves through the **exhaustive impact graph**, so it is frozen-in-*shape* yet **aspirational** in build (§2 boundary; the glossary's *impact graph* entry). *(grep is an entry-point problem, not a context problem.)*
- **Blast-radius** over a changeset (impact + at-risk specs). The **file-level** form (`git diff` → `byFile` → curated-graph walk) is **MVP**; **symbol-level** exhaustive reach rides the aspirational impact graph. The MVP form **reports uncovered (unanchored) changed files explicitly** (a `coverage-unknown` signal) — honest coverage, never a silently-small answer (§2).
- **Irreducible joins** — e.g. the multi-hop `spec → satisfies → … → invariants/scenarios` bridge with maturity/`claim` decode. Freeze because it is a true cross-source join, not a thin walk.

Everything else (single-field traversals, group-bys, the maturity ladder) stays a script. The discriminator is not "is it a traversal" but **"would an agent hand-rolling this get it wrong?"** Freeze a typed contract only when a **second machine consumer** appears — **the second-caller bar** (the name `00` §4 and `07` cite; §4 below applies it to writes).

> Context efficiency is a measured win, not a hope: keeping the data in-process and returning only conclusions ran a multi-probe session at a measured fraction of the tokens of a grep/verb-API equivalent. Freezing answers is expensive both as bytes on disk and as tokens in context.

**Aspirational (named, deferred):** `bySymbol` and symbol-level / cross-package reach (they ride the exhaustive impact graph — §2 boundary); token-budgeted self-contained slices (`per-pack`, `change-impact-<id>`); the **MCP surface** (§7) exposing a read-only window; GraphRAG retrieval for very large graphs. All stay inside the read-only gate (§4).

---

## 4. The edit model — intent composition, not patching

**Principle · CORE.** A view never writes to canonical source. Its write-affordance is **composing intent**, not mutating state. There is no structured-patch subsystem, no speculative apply, no codemod-from-view.

The loop — **intent → agent → git → conformance checks**:

```
human explores in the view
   │  selects scope (parent / siblings / slice / open-questions), writes intent
   ▼
view composes scoped, token-budgeted intent              ← the only thing the view produces
   │  handed to an AI agent (CLI)
   ▼
agent edits the source (spec files + code)               ← identical to a human editing source
   ▼
git records it · conformance + honesty checks are the gate ← the same gate every edit passes
```

Two locked terms name the affordance:

- **intent composition** — the write-affordance: compose **scoped intent**, hand it to an agent that edits source exactly as a human would; git records it; conformance checks (`05`) gate. The view is a process-orchestrator, not an editor.
- **scoped intent** — *what* is composed: an explicit change bounded by a `Spec` / its neighbors / a `Pack` / open questions.

Why patching dissolves:

- The editor is an **agent editing source**, identical in kind to a human editing source. There is no "derived layer writing back to canonical."
- Every edit is an ordinary commit; **conformance + honesty checks are the gate**. A speculative in-memory patch-check adds nothing they do not already do.
- Lifecycle operations — split, combine, refine, delete — are **plain git + edit** (`git mv`, edit in place, `git rm`), no tooling required. Maturity/readiness signals are **computed**, not stored.
- A structured edit *contract* would be justified only when a **second machine writer** appears (the second-caller bar applied to writes). Not in the MVP; possibly never.

---

## 5. Design Review — the flagship human projection

**Principle · CORE (concept).** The flagship curated surface is the **Design Review**: a `Spec` (or a `Pack`) rendered **in context** — its neighbors, relations, `claim`/delivery badges, auto-generated **design questions** (from blocking open questions + `gap`s), and a **findings** table. It adopts the recognized SDLC noun.

- It is the context in which a human **decides** to state `ready`: a spec is reviewed *in context* (alone and in its related set / `Pack`), and stating `ready` is the human's call coming out of that review. The review is **never an automated gate** — validators check only the structural **readiness floor** (`05`); they do not adjudicate the review or promote a spec. This keeps the honesty guardrail from `00`/`05` (checks police conformance & honesty, never workflow) intact (`02` §2, `05`). So `ready` is an **authored `declared` statement** — its *checkable* content is the floor; that a review actually happened is **not a fact the graph records**, so where review provenance matters it rides **git** (authorship, commit, the baseline tag — `03` §5), never an authored approval primitive.
- It is a **pure projection** — findings resolve through the edit loop (§4); there is **no stored `Finding` type**, no second store.
- *Concept is core; rich diagrams grow later* — the MVP renders the relationship slice; heatmaps and interactive trees are aspirational (Spec Studio, §8).

### The one MVP human view (read-only)

The MVP human view *is* the Design Review's relationship slice: a single derived, regenerable human-readable projection — **fully derived** and reproducible (delete and rebuild identically). Per spec it shows: header (title, `kind`, `altitude`, `readiness`, and any stated-vs-derived divergence); intent and behaviour (rules/examples); relations; bindings (implementing code, tests, with source links, derived from anchors); verification status (does a linked, enabled verifier *exist* — the `has-verifier` delivery fact, not run results); an impact list; and `claim` cues (declared vs anchored vs inferred shown distinguishably, P9).

**Form is a Representation — settled for the MVP: generated Markdown.** An index plus one page per `Spec` and per `Pack` under `generated/design-review/` (`sdp view`), rewritten wholesale each run so no stale page survives; byte-exact regeneration is the same determinism discipline as the graph. The dev-mode and CI surfaces are the *same* generated artifact (no drift-prone "dev view"). The rich interactive **Spec Studio**, and HTML-over-Markdown as a product thesis, are aspirational (§8).

---

## 6. Delivery-process execution — projections & vocabulary, not gates

**Principle · CORE (vocabulary) / ASPIRATIONAL (most projections).** The Protocol adopts the established delivery-process nouns from the industry — but realizes them, where realized at all, as **projections or descriptive vocabulary** over the one graph, **never** as gates, FSM states, or mandatory sequences.

| Term | How it lands in the Protocol |
|---|---|
| **discipline** | a **lens / projection** — filter or group `Spec`s by `kind` or section ("show me the Requirements discipline" = the `behavior` `Spec`s + the Capability Map projection). Not a phase you pass through. **Realized** — as a trivial filter off the existing graph, with **no dedicated MVP slice or machinery**. |
| **release** | a **tagged set** surfaced as a projection (backed by a git tag). **Realized** — as a trivial git-tag projection, **no dedicated MVP slice or machinery**. |
| **baseline** | a **named approved snapshot** (≈ a git tag over a set of `ready` `Spec`s); the **git tag is the approval artifact** (a signed tag carries approver + approved-at), so approval provenance is **git-native**, not an authored fact. Vocabulary + optional projection. **Realized** — as a trivial git-tag projection, **no dedicated MVP slice or machinery**. |
| **phase / iteration / milestone** | **descriptive vocabulary** with optional roadmap / now-next-later projections. Never a gate or enforced sequence. |

The **discipline ≈ kind/section mapping** (how the Protocol supports the disciplines-and-phases picture without its gates):

- **Requirements** → `behavior` `Spec`s (+ the Capability Map projection)
- **Analysis & Design** → `design` sections + Decision Records
- **Test** → `example` `Spec`s + `verifies` relations
- **Deployment** → `observed` / evidence nodes
- **Config & Change Management** → git (the source of truth)
- **Project Management** → `Pack`s + roadmap projections
- **Business Modeling** → `model` `Spec`s

The Protocol imposes no particular delivery style (iterative or sequential), and none of these terms is ever modeled as an additional authored truth-primitive, relation, or validator.

A classic disciplines × phases × iterations distribution chart becomes a **Mermaid / analytical projection** — a view of how authored and derived activity distributes across the graph, never a plan the system enforces. This is what lets `00`'s non-goal be honest: the Protocol *adopts the delivery nouns as projections* and *rejects only the gating FSM/sprint-state*.

---

## 7. The MCP surface — designed-in, deferred build

**Principle · ASPIRATIONAL.** The **MCP surface** is the integration surface for **user-facing apps** — *one more projection of the one read model*. It is **distinct from the agent surface**: agents *script* the typed graph (§3); apps *integrate* through MCP. The coding agent never goes through it.

It is **designed-in but its build is deferred**, and its concrete shape is a **fresh design** — not specified here, and **not carried over from any prior implementation**. Like every surface it stays inside the read-only gate (§4): producing context never gives a direct write path to canonical source.

---

## 8. Aspirational projections (named, deferred)

Real, designed-for, out of the MVP — each a generator/subsystem with its own surface area, none required to prove that views are pure functions of the graph.

| Projection | What it is | Why deferred |
|---|---|---|
| **Spec Studio** | rich interactive HTML workbench (tabs, trees, diagrams, heatmaps, scoped intent composition) | The stakeholder-facing surface + HTML-over-Markdown thesis; large UI. One read-only view proves derivation. |
| **Contract / model exports** | OpenAPI 3.1 / AsyncAPI, LikeC4 models, JSON-LD + PROV-O, SHACL | Format-fidelity generators; the "membrane" posture, not the core loop. |
| **MCP surface / AI slices** | token-budgeted slices, the read-only **MCP surface** (§7), GraphRAG | The agent surface + graph JSON is sufficient structured context at MVP scale (§3). |
| **Per-PR hosted preview** | publish the view per-PR for stakeholder review | Collaboration mechanic; depends on the richer view. |

There is **no patch-back loop** (§4). The aspirational write surface is a richer *intent-composition* UI, never a patch format.

---

## 9. Interop posture (aspirational): the membrane, not a replacement

**Principle · ASPIRATIONAL.** Long-term, the Protocol layers *with* the ecosystem: it ingests adjacent tools' outputs (dependency graphs, ADR markdown, later runtime telemetry) and emits into their formats (OpenAPI, LikeC4, JSON-LD). It links the issue tracker, the design tool, LikeC4, and OpenAPI rather than replacing them. None of it is in the MVP, which ingests only specs, anchors, and basic structural facts, and emits the graph (agent surface + JSON) and the Design Review / one view.

---

## 10. What the MVP consumer story proves

With the agent surface + graph JSON + the Design Review (one view), an agent reads structured context (and scripts the rest) at a measured fraction of the token cost of grep; a human opens a derived view showing intent, implementation links, verification *presence*, and impact — all regenerable; and edits flow as *intent → agent → git → conformance checks*, with no patch subsystem. That proves the founding principle's consumer half — *views are lenses; the repo is the truth; the agent is the editor* — without any aspirational surface area.
