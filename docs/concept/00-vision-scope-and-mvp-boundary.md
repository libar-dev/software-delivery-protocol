# 00 — Vision, Scope & MVP Boundary

This document states the honest, full ambition of Libar Omni **and** draws the sharp MVP line — in one place, on purpose. Nobody should read the vision without immediately seeing where the first buildable slice stops.

---

## 1. The problem

Intent, architecture, decisions, acceptance criteria, tests, and operational evidence live in disconnected tools — issue trackers, whiteboards, ADR markdown, `.feature` files, CI dashboards — linked only by rot-prone prose. Teams lose the single source of truth. Documentation drifts from code within weeks. AI agents read raw files and hallucinate structure because no typed model of the system exists.

Libar Omni's answer: make the *whole delivery lifecycle* authorable as typed code in the repo, derive one graph from it, and generate every other artifact off that graph.

---

## 2. The honest full ambition

Libar Omni is **not** a code-architecture-graph tool. It is a delivery-lifecycle system. Shrinking the vision to "extract a graph from annotated code" would silently drop whole categories of value. Those categories are named here as **in-scope-trajectory** — even where deferred — so they are *designed-for and deferred*, never *forgotten*.

The full trajectory spans:

- **The whole lifecycle as one primitive.** One `Spec` carries idea → capability → behaviour → rule → NFR → decision → contract → executable example → verified evidence. Maturity is required completeness, not a change of artifact type.
- **Multi-persona consumption.** Domain engineers, architects, PMs/BAs, QA, auditors, execs, and **AI agents** as a first-class consumer — each reading the same truth through a surface that fits them.
- **The edit / feedback loop.** A view is not just for reading. Edits route as *scoped intent* to an agent that edits the source; git records it and CI validates — no patch subsystem. *(See `06` §4; the richer intent-composition UI is aspirational.)*
- **Design-time intent vs runtime evidence.** The graph is uniquely valuable when it can answer "is this NFR met in production right now?", "which build produced prod?", "which incident touched this spec?" Delivery evidence closes the loop from claim to observed reality. *(Aspirational. Test run results are operational and not ingested.)*
- **Governance & compliance.** Readiness gates, decision/ADR lifecycle, license and audit answerability — without embedding RBAC (that stays in git/CI). *(Mostly aspirational.)*
- **AI-native authoring AND consumption.** Token-budgeted, self-contained graph slices beat raw text for agents; agents propose changes through the same gated write path humans use. *(Consumption thesis is CORE as raw graph JSON; richer tooling is aspirational.)*
- **Standards interop — the membrane, not a replacement.** Ingest adjacent tools' outputs (dependency graphs, test messages, ADR markdown, later runtime telemetry) and emit into their formats (OpenAPI, LikeC4, JSON-LD). Libar Omni links the ecosystem; it does not replace it. *(Aspirational beyond the MVP view.)*
- **Harness simulation.** Interactive "what does this spec do under conditions X, Y, Z?" exploration that surfaces coverage gaps before implementation. *(Aspirational.)*
- **Design / accessibility linkage.** Specs reference (never own) design artifacts — component stories, design-tool nodes, visual-regression baselines, accessibility status. *(Aspirational.)*
- **Multi-tenant / multi-repo / polyglot.** Tenant variants as child specs; cross-repo federation; per-language extractors sharing one schema. *(Aspirational, far horizon.)*

This is the operating system for software delivery. The MVP is one true vertical through it — not a smaller, different thing.

---

## 3. What the MVP is

The MVP proves the founding principle — *one regenerable graph derived from the repo, honest provenance, specs as stable typed artifacts that enrich in place, validation that keeps the graph honest* — on **one** bounded context (Order Management, `pack:checkout-v1`, ~8–12 specs).

**In the MVP (CORE):**

- **Typed `Spec` DSL** in TypeScript: `spec()`, `specPack()`, facets, relations, the two axes (`abstraction` × `readiness`), enrichment-in-place, refinement into child specs. One primitive, stable IDs, no artifact migration.
- **Generic source markers** that bind any code location (class, function, route, module) to a spec ID + optional component. Framework-neutral — *how* the runtime is wired is an extractor detail, not a job.
- **The `ts-morph` one-graph extractor**: one canonical, regenerable graph from `/specs/**/*.spec.ts` + markers + basic test discovery, with honest edge provenance.
- **Core validators**: referential integrity (no dangling ID references), duplicate-ID detection, readiness-profile completeness, orphan detection, `verifies` linkage from tests to specs. CI fails on errors.
- **One generated read-only view**: a derived, regenerable human-readable projection (spec tree + per-spec detail with readiness, relations, impact list, source links).
- **Bidirectional spec↔test trace**: query "what verifies this spec?" and "what does this test cover?" from the graph.

**The MVP write-path is "edit TypeScript + git."** No patch loop, no codemod. You change a `.spec.ts` file or a marker, re-run `akg build`, and the view updates. CI rejects PRs that break links or make false readiness claims.

**"Done" for the MVP:** you can write specs in TS, mark implementing code and tests with stable IDs, run `akg build`, get a validated graph, and open a generated view that correctly shows intent, implementation links, verification status, and impact — and CI rejects the PR if any of it is broken or incomplete. Delete `generated/` and rebuild identically.

The detailed slice plan and "what done looks like" checklist live in [`07-mvp-roadmap-and-open-questions.md`](./07-mvp-roadmap-and-open-questions.md).

---

## 4. What is deferred (ASPIRATIONAL) and why

Everything below is real, designed-for, and out of the first slice. Each is cut because it adds large surface area without being required to prove the core thesis. The full cut list with per-item rationale is in `07`.

| Deferred | Why it is not in the MVP |
|---|---|
| **Delivery evidence** (runtime observations, `Build`/`Deployment`/`Observation` nodes, `nfr-violated`) | An entire runtime-ingestion subsystem. The design-time half of the thesis stands without it. |
| **Runtime-anchor depth** (Effect Layer `R`-parameter analysis, Awilix deep wiring, Fastify plugin trees) | Framework-specific. The MVP binds code to intent generically; *which* runtime is irrelevant to the core job. |
| **Gherkin authoring surface** | A second parser + tag linter + round-trip export. TS DSL is canonical; Gherkin is an additive surface later. |
| **Harnesses + scenario simulation** | A new authoring surface plus interactive UI. Excellent later; not needed to prove the loop. |
| **Patch-back loop + codemod** | There is no structured-patch subsystem. Edits route as intent → agent → git → CI (`06` §4). |
| **Rich projections** (LikeC4, OpenAPI/AsyncAPI, JSON-LD/PROV-O/SHACL) | Each is a generator with its own format fidelity. The graph JSON + one view proves derivation. |
| **AI-slice / MCP tooling** | The graph JSON *is* structured context for the MVP. Token-budgeted slices and an MCP server are a later layer. |
| **Architecture enforcement** (forbidden-dependency tiers, ts-arch tests, custom rules) | A whole validation competency. MVP keeps only core graph invariants. |
| **Incremental builds / caching / sharding** | Full rebuild is fine for <~50 specs. |
| **Full CLI** (evidence, migrate, ai subcommands) | MVP CLI is `akg build` and `akg validate` (plus maybe a simple `explain`/`search`). |

Three stances shape the deferrals above: the graph is exposed to agents from day one as a typed handle (not a verb wall); there is no patch loop (edits route intent → agent → git); and verification is structural — test run verdicts are CI's, never ingested.

---

## 5. Non-goals (permanent or scope-bounding)

These are not "later"; they are deliberately *out*:

- **Not a process/PM tool.** "In sprint / in review / in QA" is project-management state, not delivery truth. Plug into the issue tracker via a separate index; do not pollute the `Spec` model.
- **Not an embedded RBAC / governance engine.** Change approval lives in git/CI (PR review, CODEOWNERS). `owner` on a spec is a soft pointer, not auth.
- **Not a replacement for adjacent tools.** Libar Omni is the membrane that links issue trackers, design tools, LikeC4, OpenAPI — not a substitute for them.
- **Not an intent inferer.** Structural facts are extracted; *intent* is always authored. Inference assists, never asserts (see `01`, principle on the inference boundary).
- **Not no-code authoring.** Authoring stays in code. The view is a lens; the repo is the source.

---

## 6. The one-breath scope statement

Libar Omni is a TypeScript-canonical delivery-lifecycle model: one `Spec` primitive carrying idea → verified evidence on two independent axes (abstraction × readiness), extracted by `ts-morph` into one deterministic, provenance-aware graph that is the sole read model, kept honest by CI validators, and projected into human- and AI-facing surfaces — with git history as the event log. The MVP is the smallest honest vertical that proves this on one bounded context; everything richer is designed-for and deferred.
</content>
