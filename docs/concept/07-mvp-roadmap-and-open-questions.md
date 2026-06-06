# 07 — MVP Roadmap & Open Questions

The buildable plan. This document defines the MVP vertical slice and what "done" looks like, maps CORE vs ASPIRATIONAL, lists the cuts with rationale, and records the residual open questions.

---

## 1. The MVP vertical slice

Prove the founding principle on **one** bounded context: Order Management, `pack:checkout-v1`, ~8–12 specs (e.g. `spec:orders.create-order` + 2–3 child scenarios + 1–2 rules + 1 NFR + the parent capability/pack). Do **not** model the whole checkout flow.

Build in thin vertical slices, each end-to-end on the example:

| Slice | Delivers |
|---|---|
| 1 | TS Spec DSL + spec extraction + basic graph (nodes + declared relations) + `graph.json` output. |
| 2 | Generic markers + implementation binding + spec↔test linkage + `verifies` edges (annotation provenance). |
| 3 | Core validators: referential integrity, duplicate IDs, readiness-profile completeness, orphan detection, `verifies` linkage. CI gate. |
| 4 | The typed read handle (a few trusted accessors over the graph — entry adapters + impact) + one generated read-only view, both fully derived. |
| 5 | Polish: CLI (`akg build`, `akg validate`, maybe `explain`/`search`), error messages, the documented example, and a "regenerate from clean repo" determinism test. |

Suggested packages (minimal): `@akg/spec` (DSL + types), `@akg/markers`, `@akg/graph` (types + the typed handle/query API), `@akg/extractor` (`ts-morph`), `@akg/validate` (core rules), `@akg/projections` (one view generator), `@akg/cli`.

> Tip: write the example specs and marked code **first**. That forces the DSL and extractor to be usable before they are "finished."

### What "done" looks like

- You write specs in TS, mark implementing code and tests with stable IDs, run `akg build`, and get a valid graph.
- Validation passes/fails with clear messages; CI rejects a PR that breaks links or makes a false readiness claim.
- A typed handle exposes the graph to an agent (entry adapters + impact); a generated view shows linked specs + implementations + tests with correct readiness and impact lists.
- Edits flow as *intent → agent edits source → git → CI*; there is no patch subsystem.
- Changing a spec or marker and re-running produces an updated graph and view.
- Delete `generated/` and rebuild — **byte-identical** (determinism, P3).

**North Star (one sentence):** *On a small bounded context, an engineer writes specs in TypeScript, marks the implementing code and tests with stable IDs, runs `akg build`, gets a validated graph an agent can read as a typed handle, and opens a generated view that correctly shows intent, implementation links, verification presence, and impact — and CI rejects the PR if any of it is broken or incomplete.*

---

## 2. CORE vs ASPIRATIONAL map

**CORE (MVP):** TS Spec DSL; the two axes; facets (shape only); stable IDs; generic markers; `ts-morph` one-graph extractor; honest provenance (declared / annotation / minimal advisory inferred); core validators; readiness profiles (through `executable`; `verified` is structural test-*presence*, never run-result ingestion); the typed read handle + `graph.json` as AI context; one read-only view; bidirectional spec↔test trace; determinism + `--check-clean`. The **entire trust model** ships at MVP.

**ASPIRATIONAL:** delivery-evidence overlay (runtime observations, `Build`/`Deployment`/`Observation` nodes, `nfr-violated`); runtime-anchor depth (Effect `R`, Awilix wiring, Fastify trees); Gherkin surface; harnesses + simulation; rich projections (LikeC4/OpenAPI/JSON-LD/SHACL); rich Spec Studio with scoped intent composition; AI slices + MCP + GraphRAG; architecture-enforcement tiers (4/5); a fuller mechanical substrate; incremental builds/caching; full CLI; `--lenient` ratchet; multi-tenant/multi-repo/polyglot.

> There is no structured patch-back loop — the edit model is intent composition → agent → git (`06` §4).

---

## 3. The cut list (with rationale)

These are out of the first slice. Each is genuinely deferred, and the model in `00`–`06` accommodates them without refactoring the core.

1. **Delivery evidence, including test-result ingestion.** No runtime-evidence overlay, no `Build`/`Deployment`/`Observation` nodes, no runtime `evidence` population, no `nfr-violated`, and no test-result ingestion. Verification in the graph is *structural* — does a linked, enabled verifying spec/test exist — not pass/fail. *Rationale:* run results are per-instance operational data with no design/management relevance; code is not committed with failing tests; CI owns the verdict.
2. **Runtime-anchor depth.** No Effect `Layer`/`R` analysis, no Awilix deep wiring, no Fastify plugin trees, no migration path. Keep only generic markers. *Rationale:* framework-specific; irrelevant to "bind code to intent." *"Complexities like Effect Layers + Awilix are definitely not required."*
3. **Gherkin authoring surface.** *Rationale:* a second parser + tag linter + round-trip; the TS DSL already expresses examples. A single canonical authoring surface per spec — dual TS+Gherkin source is the biggest anti-pattern to avoid.
4. **Harnesses + scenario simulation.** *Rationale:* a new authoring surface plus interactive UI; not needed to prove the loop.
5. **Patch-back loop + codemod.** There is no structured-patch subsystem. The edit path is *intent composition → agent edits source → git → CI* (`06` §4). *Rationale:* the editor is an agent editing source, identical to a human edit; CI is the gate; a speculative patch-validator adds nothing. A structured edit contract returns only if a second *machine writer* appears.
6. **Rich projections + heavy AI tooling.** No LikeC4/OpenAPI/JSON-LD/SHACL; no dedicated slice generator or MCP server. *Rationale:* the typed handle + graph JSON is sufficient structured context at MVP scale.
7. **Architecture-enforcement overlays (Tiers 4/5).** No forbidden-dependency validators, no ts-arch tests, no custom `defineRule`. Keep only core graph invariants. *Rationale:* a whole validation competency; the small bounded context does not need it yet.
8. **A fuller mechanical substrate.** A *minimal* import/symbol substrate may earn its way into the MVP for impact/blast-radius (`06` §2 note); the exhaustive language-server-grade substrate (cross-package, symbol-level identity, drift/fan-in tooling) is deferred. *Rationale:* the curated surface proves the thesis first.
9. **Incremental builds / caching / sharding & full CLI** (evidence, migrate, ai subcommands). Full rebuild per run; `akg build` + `akg validate` (+ maybe `explain`/`search`) proves the loop. *Rationale:* fine for <~50 specs.

---

## 4. Residual open questions

Deferred deliberately; recorded so they are not lost. None blocks the MVP.

- **Derived-readiness banner timing.** Profile enforcement (claim is checked) is MVP; the explicit "claimed `bound`, derived `framed`" banner can be a fast follow. *(`05` §3.)*
- **How thin a mechanical substrate in the MVP.** The curated surface is MVP; whether a minimal import/symbol substrate (for impact/blast-radius + curation-assist) ships in the first slice or just after is a sequencing call. *(`06` §2.)*
- **Inline-vs-centralized marker semantics.** Markers carry no intent in the MVP. How much *structural* semantics a marker may carry (beyond `id`/`satisfies`/`component`) is left configurable later. *(`04` §2.)*
- **Graph-DB timing.** File-based until measured traversal pain (~10k+ nodes); the schema is designed to map to a property graph later. *(`03` §4.)*
- **Trace-link recovery.** Permitted later only as an assistive *suggestion* engine (the substrate's "propose candidates" assist role), never a declared edge — bounded permanently by P10. *(`01`, `06` §2.)*
- **When (if ever) Gherkin / harnesses / evidence become CORE.** Driven by measured pain after the MVP loop holds, not by the roadmap.

---

## 5. Measure what actually hurts

After the MVP loop works, let observed pain — not this roadmap — order the next phase:

- "editing feels clumsy — the agent needs better-scoped intent" → richer intent-composition UI (the bundler), *not* a patch format;
- "I can't see architecture clearly / what breaks if I change this" → the mechanical substrate (impact, blast-radius, fan-in curation assist);
- "tests are hard to link" → improve spec↔test discovery;
- "is this NFR actually met in prod?" → begin the evidence overlay.

The point of the principle-led core is that each of these slots in cleanly, without refactoring the laws in `01`.
