# 00 — Vision, Scope & MVP Boundary

This document states the honest, full ambition of Libar Software Delivery Protocol **and** draws the sharp MVP line — in one place, on purpose. Nobody should read the vision without immediately seeing where the first buildable slice stops.

---

## 1. The problem

Intent, architecture, decisions, acceptance criteria, tests, and operational evidence live in disconnected tools — issue trackers, whiteboards, ADR markdown, `.feature` files, CI dashboards — linked only by rot-prone prose. Teams lose the single source of truth. Documentation drifts from code within weeks. AI agents read raw files and hallucinate structure because no typed model of the system exists.

The Protocol's answer: make the *whole delivery lifecycle* authorable as typed code in the repo, derive one graph from it, and generate every other artifact off that graph.

---

## 2. The honest full ambition

Libar Software Delivery Protocol is an **executable, self-validating meta-model of the software-delivery process** — not a code-architecture-graph tool, and not an "operating system" bolted on top. Three levels, kept clean:

- the **protocol** — the primitive, its descriptors, the relation set, and the validators, *as typed code in this repo* (**Phase 0 of the MVP**);
- the **authored model** — a project's instances, which *conform* (conformance checked, never *workflow*-gated);
- **derived facts** — machine truth about that model (code realises it · a verifier exists · runtime observed it), never authored.

Two permanent honesty guardrails keep "self-validating" from re-becoming the gating we reject: (a) checks police **conformance & honesty** — well-formedness and not-pretending — never **content-quality** (design goodness is human/agent judgment) and never **workflow** (no lifecycle gates); (b) we claim **"deterministically validated," never "provably correct."**

Shrinking the vision to "extract a graph from annotated code" would silently drop whole categories of value. Those categories are named here as **in-scope-trajectory** — even where deferred — so they are *designed-for and deferred*, never *forgotten*.

The full trajectory spans:

- **The whole lifecycle as one primitive.** One `Spec` carries every durable delivery artifact; the familiar delivery nouns (Use Case, NFR, Decision Record; Epic, Feature, Story) are **named coordinates** on it, not separate artifact types. Maturity is required completeness, not a change of artifact type. Realization signals (`implemented` / `has-verifier` / `observed`) are **delivery facts** — derived, never authored (`observed` is aspirational).
- **Multi-persona consumption.** Domain engineers, architects, PMs/BAs, QA, auditors, execs, and **AI agents** as a first-class consumer — each reading the same truth through a surface that fits them.
- **The edit / feedback loop.** A view is not just for reading. Edits route as *scoped intent* to an agent that edits the source; git records it; conformance checks gate — no patch subsystem. *(See `06` §4; the richer intent-composition UI is aspirational.)*
- **Design-time intent vs runtime evidence.** The graph is uniquely valuable when it can answer "is this NFR met in production right now?", "which build produced prod?", "which incident touched this spec?" The `observed` delivery fact closes the loop from stated intent to observed reality. *(Aspirational. Test run results are operational and not ingested.)*
- **Conformance & honesty, not governance gates.** Decision-record lifecycle, license and audit answerability, and **readiness floors** (honest readiness — *not* gates) — without embedding RBAC (that stays in git/CI). *(Mostly aspirational.)*
- **AI-native authoring AND consumption.** Token-budgeted **context bundles** beat raw text for agents; agents read the **agent surface** (a typed graph they *script*) and propose changes through the same gated write path humans use — **intent → agent → git → conformance checks**. *(Consumption thesis is CORE as raw graph JSON + the agent surface; richer tooling is aspirational.)*
- **Standards interop — the membrane, not a replacement.** Ingest adjacent tools' outputs (dependency graphs, test messages, ADR markdown, later runtime telemetry) and emit into their formats (OpenAPI, LikeC4, JSON-LD). The Protocol links the ecosystem; it does not replace it. *(Aspirational beyond the MVP view.)*
- **Harness simulation.** Interactive "what does this spec do under conditions X, Y, Z?" exploration that surfaces coverage gaps before implementation. *(Aspirational.)*
- **Design / accessibility linkage.** Specs reference (never own) design artifacts — component stories, design-tool nodes, visual-regression baselines, accessibility status. *(Aspirational.)*
- **Multi-tenant / multi-repo / polyglot.** Tenant variants as child specs; cross-repo federation; per-language extractors sharing one schema. *(Aspirational, far horizon.)*

This is the meta-model of software delivery, made executable. The MVP is one true vertical through it — not a smaller, different thing.

---

## 3. What the MVP is

The MVP proves the founding principle — *one regenerable graph derived from the repo, honest `claim`s, specs as stable typed artifacts that enrich in place, conformance + honesty checks that keep the graph honest* — on **one** bounded context (Order Management, `pack:checkout-v1`, ~8–12 specs).

**Phase 0 — the protocol as code.** Before any project authoring, build the meta-model itself: the `Spec` primitive, its three descriptors, the relation set, and every validator, as typed code in this repo. The extractor, the graph schema, and every check presuppose it — it is the foundation slice, not a detour. (Self-hosting — the Protocol's own repo as an authored model conforming to its own meta-model — is a later milestone, not a Phase-0 claim.)

**In the MVP (CORE):**

- **Typed `Spec` DSL** in TypeScript: `spec()`, `pack()`, sections, relations, the three descriptors (`kind` · `altitude` · `readiness`), enrichment-in-place, refinement into child specs. One primitive, stable IDs, no artifact migration.
- **Generic source anchors** that bind any code location (class, function, route, module) to a spec ID + optional component. Framework-neutral — *how* the runtime is wired is an extractor detail, not a job.
- **The `ts-morph` one-graph extractor**: one canonical, regenerable graph from every `*.sdp.ts` under the extraction root (conventionally `/specs/`) + anchors + basic test discovery, with honest edge `claim`s.
- **Core conformance + honesty checks**: referential integrity (no dangling ID references), duplicate-ID detection, honest readiness (against the readiness floor), orphan detection, `verifies` linkage from tests to specs, and authoring-shape honesty (no hand-authored derived edges or delivery facts). CI fails on errors.
- **One generated read-only view**: a derived, regenerable human-readable projection (spec tree + per-spec detail with readiness, relations, impact list, source links).
- **Bidirectional spec↔test trace**: query "what verifies this spec?" and "what does this test cover?" from the graph.

**The MVP write-path is "edit TypeScript + git."** No patch loop, no codemod. You change a `.sdp.ts` spec file or an anchor, re-run `sdp build`, and the view updates. CI rejects PRs that break links or state readiness the spec has not earned.

**"Done" for the MVP:** you can write specs in TS, anchor implementing code and tests with stable IDs, run `sdp build`, get a graph that passes the conformance + honesty checks, and open a generated view that correctly shows intent, implementation links, verification status, and impact — and CI rejects the PR if any of it is broken or incomplete. Delete `generated/` and rebuild identically.

The detailed slice plan and "what done looks like" checklist live in [`07-mvp-roadmap-and-open-questions.md`](./07-mvp-roadmap-and-open-questions.md).

---

## 4. What is deferred (ASPIRATIONAL) and why

Everything below is real, designed-for, and out of the first slice. Each is cut because it adds large surface area without being required to prove the core thesis. The full cut list with per-item rationale is in `07`.

| Deferred | Why it is not in the MVP |
|---|---|
| **Runtime observations** (`observed`, `Build`/`Deployment`/`Observation` nodes, `nfr-violated`) | An entire runtime-ingestion subsystem producing the `observed` delivery fact. The design-time half of the thesis stands without it. |
| **Runtime-composition depth** (Effect Layer `R`-parameter analysis, Awilix deep wiring, Fastify plugin trees) | Framework-specific. The MVP binds code to intent generically; *which* runtime is irrelevant to the core job. |
| **Gherkin authoring surface** | A second parser + tag linter + round-trip export. TS DSL is canonical; Gherkin is an additive surface later. |
| **Harnesses + scenario simulation** | A new authoring surface plus interactive UI. Excellent later; not needed to prove the loop. |
| **Patch-back loop + codemod** | There is no structured-patch subsystem. Edits route as intent → agent → git → conformance checks (`06` §4). |
| **Rich projections** (LikeC4, OpenAPI/AsyncAPI, JSON-LD/PROV-O/SHACL) | Each is a generator with its own format fidelity. The graph JSON + one view proves derivation. |
| **MCP surface** (designed-in, deferred build) | The integration surface for *user-facing apps* — one more projection of the one read model, **distinct from the agent surface** (agents *script*; apps *integrate*). Designed-in, but its build is deferred and its shape is a fresh design — not an afterthought, and not carried over from any prior implementation. |
| **Architecture enforcement** (forbidden-dependency tiers, ts-arch tests, custom rules) | A whole validation competency. MVP keeps only core graph invariants. |
| **Incremental builds / caching / sharding** | Full rebuild is fine at MVP scale. |
| **Full CLI** (evidence, migrate, ai subcommands) | MVP CLI is `sdp build` · `sdp validate` · `sdp view`. `explain`/`search` stay below the second-caller bar (`06` §3): the agent scripts the reader, the human reads the Design Review — a terminal verb over the same joins would render the same information a third time. Revisit on measured pain (`07` §5). |

Three stances shape the deferrals above: the graph is exposed to agents from day one as the **agent surface** (a typed graph the agent scripts, not a verb wall); there is no patch loop (edits route intent → agent → git); and verification is structural — test run verdicts are CI's, never ingested.

---

## 5. Non-goals (permanent or scope-bounding)

These are not "later"; they are deliberately *out*:

- **Adopt the delivery nouns; reject the process gating.** The Protocol adopts the established delivery nouns — discipline, phase, iteration, milestone, release, baseline — but only as **projections and descriptive vocabulary** over the one graph (`06`), never as **gates**. What stays out is the process **state-machine**: "in sprint / in review / in QA" ticket-FSM status and mandatory phase gates are not delivery truth — plug into the issue tracker via a separate index, do not pollute the `Spec` model. *(This is the one non-goal the ratified language* reverses *: it adopts the nouns, and rejects only the gating FSM.)*
- **Not an embedded RBAC / governance engine.** Change approval lives in git/CI (PR review, CODEOWNERS). `owner` on a spec is a soft pointer, not auth.
- **Not a replacement for adjacent tools.** The Protocol is the membrane that links issue trackers, design tools, LikeC4, OpenAPI — not a substitute for them.
- **Not an intent inferer.** Structural facts are extracted; *intent* is always authored. Inference assists, never asserts (see `01`, principle on the inference boundary).
- **Not no-code authoring.** Authoring stays in code. The view is a lens; the repo is the source.

---

## 6. The one-breath scope statement

Libar Software Delivery Protocol is a TypeScript-canonical, executable meta-model of the software-delivery process: one `Spec` primitive positioned by three descriptors (`kind` · `altitude` · `readiness`), with realization signals as **derived delivery facts**, extracted by `ts-morph` into one deterministic, **`claim`-aware** graph that is the sole read model, kept honest by **conformance + honesty checks**, and projected into human- and AI-facing surfaces — with git history as the event log. The MVP is the smallest honest vertical that proves this on one bounded context; everything richer is designed-for and deferred.
