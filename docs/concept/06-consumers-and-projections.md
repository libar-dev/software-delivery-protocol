# 06 — Consumers & Projections

Everything human- or AI-facing is **generated from the one graph** (P1, P2, L8). The #1 consumer is **agents**; a human view is second; static document exports are last. This document covers what the MVP ships — the graph plus a small typed read surface and one human view — and names the richer projections that are designed-for and deferred.

> Sink priority (a Representation-level stance, but a firm one): **agents first, human view second, document exports last.** The MVP optimises the sink the old framing optimised least.

---

## 1. The principle: projections are a fan-out off one model

**Principle · CORE.** The graph fans out to many co-equal projections, each serving a consumer, all pure functions of the graph (`output = f(graph)`). No projection is a second source of truth; all are disposable and regenerable. *Which* projections exist is Representation; *that they are all derived from the one graph* is the principle.

```
                 ┌── typed read handle + graph.json   (agents — the #1 sink)   ← MVP
graph  ──fan──►  ├── one generated read-only view      (humans)                 ← MVP
                 ├── Spec Studio (rich interactive)     (stakeholders)           ← aspirational
                 ├── LikeC4 / OpenAPI / JSON-LD exports                          ← aspirational
                 └── AI slices / MCP server                                      ← aspirational
```

---

## 2. The two surfaces — curated vs mechanical substrate

**Principle · CORE.** There are two graph surfaces that answer *different questions*. They are not truth-vs-approximation; conflating them is a category error.

| | **Curated** | **Mechanical substrate** |
|---|---|---|
| answers | "what *is* the architecture" | "what could break / where is this used at all" |
| virtue | **editorial sparsity** (human judgment) | **exhaustiveness** (derived) |
| source | authored specs + markers (declared / annotation) | code structure — imports, symbols, calls (inferred) |
| authored by | a human, deliberately | derived on demand, never curated |
| feeds | the view, AI context, exports | impact / blast-radius / find-all-usages / curation assist |
| relation to a language server | **is the differentiator** | **is the language server** |

This is provenance (P9) elevated to two consumable surfaces: the curated surface is the `declared` + `annotation` layers; the substrate is the `inferred` layer.

**Does this violate "no second graph, ever"? No.** The curated graph *is* the read model. The substrate is a *separate derived structure* — regenerable from code, never authored, never authoritative (P10) — not a competing source of truth. Both are pure functions of the repo, and a typed handle over both authors and persists nothing — a front door, not a store.

### The correction that defines this model (do not regress)

**Do not derive the architecture from code.** Architectural significance is an editorial judgment no import graph can produce. So:

- The divergence between the curated graph and the import graph is **curation, not drift.** A curated graph that is a small selection (~single-digit to ~25%) of the mechanical firehose is *correct by design*.
- Never "densify" the curated graph by inferring edges from imports — that just rebuilds the language server and throws away the curation.
- The substrate has exactly one firehose job (impact / re-test scope) plus two *assist* roles that never overwrite the curated layer: **propose candidates** (e.g. high-fan-in modules with no node) and **flag unambiguous drift** (a `satisfies` target whose source file was deleted) — narrow, honest signals only.

> MVP sequencing note: the curated surface is unambiguously MVP. A *minimal* mechanical substrate (import/symbol graph) is the natural home for impact/blast-radius and curation-assist, so it may be worth pulling a thin version into the MVP rather than deferring all inference. That is a sequencing call for `07`, not a reopening of the two-surface model.

---

## 3. The AI read surface — a typed handle, not a verb wall

**Principle · CORE.** Structured graph context beats raw text for AI; Libar Omni is a *producer* of structured context, not just another consumer. This is a genuine differentiator and it is a principle.

The experiment settled *how* to expose it. The surface is **one typed handle** — an in-memory object whose **method list is the documentation** — plus the raw shapes. It is deliberately **neither** of the two failure modes:

- **not a 30-verb API** — that hides the shapes and rebuilds the pipeline we are deleting;
- **not raw-JSON-you-rejoin** — that makes every agent re-derive the same joins and decode the same taxonomy quirks.

Instead: joins and taxonomy-decode are done **once at construction**; accessors return plain, composable data; the handle persists nothing and is rebuilt fresh each load. *Needs drive the surface, not storage.* And: **the type is the discovery surface — under-typing a shape hides a capability** (an agent reading the contract cannot use a field that isn't typed).

### Freeze vs script — what goes on the surface

Most questions have exactly one consumer; by the second-(machine-)caller bar they should never be frozen — an agent scripts them on demand from the shapes. **Freeze only** the small set that is a *universal bridge* or an *irreducible cross-source join* — the things an agent hand-rolling would get wrong:

- **Entry adapters** — the grep→graph bridge. Real work starts from a **string** ("rate limiter"), a **file** (`src/...`), or a **changeset** (`git diff`); the graph is keyed by name. `findByConcept(str)` / `byFile(path)` / `bySymbol(sym)` bridge from what-the-agent-has to what-the-graph-knows. *(grep is an entry-point problem, not a context problem.)*
- **Blast-radius** over a changeset (impact + at-risk specs) — the substrate's firehose job.
- **Irreducible joins** — e.g. the multi-hop `spec → implementedBy → … → invariants/scenarios` bridge with maturity/provenance decode. Freeze because it is a true cross-source join, not a thin walk.

Everything else (single-field traversals, group-bys, the maturity ladder) stays a script. The discriminator is not "is it a traversal" but **"would an agent hand-rolling this get it wrong?"** Freeze a typed contract only when a **second machine consumer** appears.

> Context efficiency is a measured win, not a hope: keeping the data in-process and returning only conclusions ran a multi-probe session at ~⅕ the tokens of a grep/verb-API equivalent. Freezing answers is expensive both as bytes on disk and as tokens in context.

**Aspirational (named, deferred):** token-budgeted self-contained slices (`per-pack`, `change-impact-<id>`); an `@akg/mcp-server` exposing the handle read-only; GraphRAG retrieval for very large graphs. All stay inside the read-only gate (§4).

---

## 4. The edit model — intent composition, not patching

**Principle · CORE.** A view never writes to canonical source. Its write-affordance is **composing intent**, not mutating state. There is no structured-patch subsystem, no speculative apply, no codemod-from-view.

The loop is:

```
human explores in the view
   │  selects scope (parent / siblings / slice / open-questions), writes intent
   ▼
view composes a scoped, token-budgeted prompt           ← the only thing the view produces
   │  handed to an AI agent (CLI / MCP)
   ▼
agent edits the source (spec files + code)              ← identical to a human editing source
   ▼
git records it · `akg validate` / CI is the gate        ← the same gate every edit passes
```

Why patching dissolves:

- The editor is an **agent editing source**, identical in kind to a human editing source. There is no "derived layer writing back to canonical."
- Every edit is an ordinary commit; **CI is the validator**. A speculative in-memory patch-check adds nothing CI does not already do.
- Lifecycle operations — split, combine, refine, delete — are **plain git + edit** (`git mv`, edit in place, `git rm`), no tooling required. Maturity/epic-readiness signals are **computed**, not stored.
- A structured edit *contract* would be justified only when a **second machine writer** appears (the second-caller bar applied to writes). Not in the MVP; possibly never.

The view's value, then, is read + **scoped intent composition** (the "bundler" pattern): pick the patterns/specs in scope, state the change, preview the token budget, hand a clean prompt to the agent. That is "view as an editing lens" — without a patch format.

---

## 5. The one human view (MVP, read-only)

A single derived, regenerable human-readable projection — **fully derived** and reproducible (delete and rebuild identically). Per spec it shows: header (title, kind, abstraction, readiness, and any claimed-vs-derived divergence); intent and behaviour (rules/examples); relations; bindings (implementing code, tests, with source links); verification status (does a linked, enabled verifying spec/test *exist* — structural, not run results); an impact list; and provenance cues (declared vs annotation vs inferred shown distinguishably, P9).

**Form is a Representation.** Clean generated HTML (tree + per-spec pages) or high-quality generated Markdown — the MVP needs *one* read-only derived view. The dev-mode and CI surfaces are the *same* generated artifact (no drift-prone "dev view"). The rich interactive **Spec Studio**, and HTML-over-Markdown as a product thesis, are aspirational (§6).

---

## 6. Aspirational projections (named, deferred)

Real, designed-for, out of the MVP — each a generator/subsystem with its own surface area, none required to prove that views are pure functions of the graph.

| Projection | What it is | Why deferred |
|---|---|---|
| **Spec Studio** | rich interactive HTML workbench (tabs, trees, diagrams, heatmaps, scoped intent composition) | The stakeholder-facing surface + HTML-over-Markdown thesis; large UI. One read-only view proves derivation. |
| **Contract / model exports** | OpenAPI 3.1 / AsyncAPI, LikeC4 models, JSON-LD + PROV-O, SHACL | Format-fidelity generators; the "membrane" posture, not the core loop. |
| **AI slices / MCP server** | token-budgeted slices, read-only MCP window, GraphRAG | The typed handle + graph JSON is sufficient structured context at MVP scale (§3). |
| **Per-PR hosted preview** | publish the view per-PR for stakeholder review | Collaboration mechanic; depends on the richer view. |

There is **no patch-back loop** (§4). The aspirational write surface is a richer *intent-composition* UI, never a patch format.

---

## 7. Interop posture (aspirational): the membrane, not a replacement

**Principle · ASPIRATIONAL.** Long-term, Libar Omni layers *with* the ecosystem: it ingests adjacent tools' outputs (dependency graphs, ADR markdown, later runtime telemetry) and emits into their formats (OpenAPI, LikeC4, JSON-LD). It links the issue tracker, the design tool, LikeC4, and OpenAPI rather than replacing them. None of it is in the MVP, which ingests only specs, markers, and basic structural facts, and emits the graph (handle + JSON) and one view.

---

## 8. What the MVP consumer story proves

With the typed handle + graph JSON + one view, an agent reads structured context (and scripts the rest) at ~⅕ the token cost of grep; a human opens a derived view showing intent, implementation links, verification *presence*, and impact — all regenerable; and edits flow as *intent → agent → git → CI*, with no patch subsystem. That proves the founding principle's consumer half — *views are lenses; the repo is the truth; the agent is the editor* — without any aspirational surface area.
