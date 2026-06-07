# 07 — MVP Roadmap & Open Questions

The buildable plan. This document defines the MVP vertical slice and what "done" looks like, maps CORE vs ASPIRATIONAL, lists the cuts with rationale, and records the residual open questions.

---

## 1. The MVP vertical slice

Prove the founding principle on **one** bounded context: Order Management, `pack:checkout-v1`, ~8–12 specs (e.g. `spec:orders.create-order` + 2–3 child scenarios + 1–2 rules + 1 NFR + the parent `spec:orders.order-management` behavior + the pack). Do **not** model the whole checkout flow.

Build in thin vertical slices, each end-to-end on the example — on the foundation of Phase 0:

| Slice | Delivers |
|---|---|
| 0 | **Phase 0 — the protocol as code**: the `Spec` primitive, its three descriptors, the relation set, and every validator, as typed code in this repo. The extractor, the graph schema, and every check presuppose it — the foundation, not a detour. |
| 1 | TS Spec DSL + spec extraction + basic graph (nodes + declared relations) + `graph.json` output. |
| 2 | Generic anchors + implementation binding + spec↔test linkage + `verifies` edges (anchored `claim`). |
| 3 | Core conformance + honesty checks: referential integrity, duplicate IDs, honest readiness (the readiness floor), orphan detection, `verifies` linkage, authoring-shape honesty. CI gate. |
| 4 | The agent surface (the `reader` — a few trusted accessors: entry adapters + impact) + the Design Review / one generated read-only view, both fully derived. |
| 5 | Polish: CLI (`sdp build`, `sdp validate`, maybe `explain`/`search`), error messages, the documented example, and a "regenerate from clean repo" determinism test. |

Package: a single **`@libar-dev/software-delivery-protocol`** (DSL + types, anchors, graph + reader/query API, `ts-morph` extractor, core checks, one view generator, CLI). Internal subpackage boundaries are a later concern, not decided now.

> Tip: write the example specs and anchored code **first**. That forces the DSL and extractor to be usable before they are "finished."

### What "done" looks like

- You write specs in TS, anchor implementing code and tests with stable IDs, run `sdp build`, and get a valid graph.
- Conformance + honesty checks pass/fail with clear messages; CI rejects a PR that breaks links or states readiness the spec has not earned.
- The agent surface (the `reader`) exposes the graph to an agent (entry adapters + impact); the Design Review / generated view shows linked specs + implementations + tests with correct readiness and impact lists.
- Edits flow as *intent → agent edits source → git → conformance checks*; there is no patch subsystem.
- Changing a spec or anchor and re-running produces an updated graph and view.
- Delete `generated/` and rebuild — **byte-identical** (determinism, P3).

**North Star (one sentence):** *On a small bounded context, an engineer writes specs in TypeScript, anchors the implementing code and tests with stable IDs, runs `sdp build`, gets a graph that passes the conformance + honesty checks and that an agent can read as the agent surface, and opens a generated view (the Design Review) that correctly shows intent, implementation links, verification presence, and impact — and CI rejects the PR if any of it is broken or incomplete.*

---

## 2. CORE vs ASPIRATIONAL map

**CORE (MVP):** Phase 0 — the protocol as code; TS Spec DSL; the three descriptors (`kind` · `altitude` · `readiness`); sections (shape only); stable IDs; generic anchors; `ts-morph` one-graph extractor; honest `claim` (declared / anchored / minimal advisory inferred); core conformance + honesty checks; readiness floors (through `ready`); delivery facts (`implemented` / `has-verifier`) derived, never authored; the agent surface (reader) + `graph.json` as AI context; the Design Review / one read-only view; bidirectional spec↔test trace; determinism + `--check-clean`. The **entire trust model** ships at MVP. The delivery-process **lenses** — discipline-as-filter, release/baseline as git-tag projections (`06` §6) — come essentially **for free** off the graph + git tags; they are not separate built features and get no dedicated slice.

**ASPIRATIONAL:** runtime-observation overlay (the `observed` delivery fact; runtime observations, `Build`/`Deployment`/`Observation` nodes, `nfr-violated`); runtime-composition depth (Effect `R`, Awilix wiring, Fastify trees); Gherkin surface; harnesses + simulation; rich projections (LikeC4/OpenAPI/JSON-LD/SHACL); rich Spec Studio with scoped intent composition; AI slices + the **MCP surface** (designed-in, deferred build) + GraphRAG; architecture-enforcement checks; a fuller impact graph; incremental builds/caching; full CLI; `--lenient` ratchet; multi-tenant/multi-repo/polyglot.

> There is no structured patch-back loop — the edit model is intent composition → agent → git (`06` §4).

---

## 3. The cut list (with rationale)

These are out of the first slice. Each is genuinely deferred, and the model in `00`–`06` accommodates them without refactoring the core.

1. **Runtime observations, including test-result ingestion.** No runtime-observation overlay (the `observed` delivery fact), no `Build`/`Deployment`/`Observation` nodes, no `nfr-violated`, and no test-result ingestion. Verification in the graph is *structural* — does a linked, enabled verifier exist (`has-verifier`) — not pass/fail. *Rationale:* run results are per-instance operational data with no design/management relevance; code is not committed with failing tests; CI owns the verdict.
2. **Runtime-composition depth.** No Effect `Layer`/`R` analysis, no Awilix deep wiring, no Fastify plugin trees, no migration path. Keep only generic anchors. *Rationale:* framework-specific; irrelevant to "bind code to intent." *"Complexities like Effect Layers + Awilix are definitely not required."*
3. **Gherkin authoring surface.** *Rationale:* a second parser + tag linter + round-trip; the TS DSL already expresses examples. A single canonical authoring surface per spec — dual TS+Gherkin source is the biggest anti-pattern to avoid.
4. **Harnesses + scenario simulation.** *Rationale:* a new authoring surface plus interactive UI; not needed to prove the loop.
5. **Patch-back loop + codemod.** There is no structured-patch subsystem. The edit path is *intent composition → agent edits source → git → conformance checks* (`06` §4). *Rationale:* the editor is an agent editing source, identical to a human edit; conformance checks are the gate; a speculative patch-validator adds nothing. A structured edit contract returns only if a second *machine writer* appears.
6. **Rich projections + heavy AI tooling.** No LikeC4/OpenAPI/JSON-LD/SHACL; no dedicated slice generator or MCP surface. *Rationale:* the agent surface + graph JSON is sufficient structured context at MVP scale.
7. **Architecture-enforcement checks.** No forbidden-dependency validators, no ts-arch tests, no custom `defineRule`. Keep only core graph invariants. *Rationale:* a whole validation competency; the small bounded context does not need it yet.
8. **A fuller impact graph.** The MVP ships **file-level** impact/blast-radius off the curated graph (`06` §2 boundary); the exhaustive language-server-grade impact graph (cross-package, symbol-level identity, `bySymbol`, drift/fan-in tooling) is deferred. *Rationale:* the curated surface proves the thesis first, and file-level reach needs no symbol index.
9. **Incremental builds / caching / sharding & full CLI** (evidence, migrate, ai subcommands). Full rebuild per run; `sdp build` + `sdp validate` (+ maybe `explain`/`search`) proves the loop. *Rationale:* fine at MVP scale.

---

## 4. Residual open questions

Deferred deliberately; recorded so they are not lost. None blocks the MVP.

- **Derived-readiness banner timing.** Floor enforcement (the stated rung is checked) is MVP; the explicit "stated `defined`, derived `scoped`" banner can be a fast follow. *(`05` §3.)*
- **Impact-graph depth (resolved, recorded here for traceability).** The boundary is decided, not open: **file-level** impact ships in the MVP (`git diff` → `byFile` → a curated-graph walk gives changeset blast-radius with no symbol index, surfacing an explicit `coverage-unknown` item for any changed file that has no anchor so a too-small set is never mistaken for complete), while the **exhaustive** impact graph — `bySymbol`, symbol-level identity, cross-package find-all-usages, drift/fan-in tooling — is deferred (Iterate). What remains genuinely open is only *when* the exhaustive graph earns its way in, driven by measured pain (§5), never the MVP boundary itself. *(`06` §2; base §7.)*
- **Inline-vs-centralized anchor semantics.** Anchors carry no intent in the MVP. How much *structural* semantics an anchor may carry (beyond `id`/`satisfies`/`component`) is left configurable later. *(`04` §2.)*
- **Graph-DB timing.** File-based until measured traversal pain; the schema is designed to map to a property graph later. *(`03` §4.)*
- **Trace-link recovery.** Permitted later only as an assistive *suggestion* engine (the impact graph's "propose candidates" assist role), never a declared edge — bounded permanently by P10. *(`01`, `06` §2.)*
- **When (if ever) Gherkin / harnesses / evidence become CORE.** Driven by measured pain after the MVP loop holds, not by the roadmap.

---

## 5. Measure what actually hurts

After the MVP loop works, let observed pain — not this roadmap — order the next phase:

- "editing feels clumsy — the agent needs better-scoped intent" → richer intent-composition UI (the bundler), *not* a patch format;
- "I can't see architecture clearly / what breaks if I change this" → the impact graph (impact, blast-radius, fan-in curation assist);
- "tests are hard to link" → improve spec↔test discovery;
- "is this NFR actually met in prod?" → begin the runtime-observation overlay (the `observed` delivery fact).

The point of the principle-led core is that each of these slots in cleanly, without refactoring the laws in `01`.
