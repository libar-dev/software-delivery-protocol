# 07 — MVP Roadmap & Open Questions

The buildable plan. This document defines the MVP vertical slice and what "done" looks like, maps CORE vs ASPIRATIONAL, lists the cuts with rationale, records the now-resolved decisions (D1/D2/D3), and the resolved tensions (including L4 and the enum reconciliation).

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

**CORE (MVP):** TS Spec DSL; the two axes; facets (shape only); stable IDs; generic markers; `ts-morph` one-graph extractor; honest provenance (declared / annotation / minimal advisory inferred); core validators; readiness profiles (through `executable`; `verified` is structural test-*presence*, never run-result ingestion — D3); the typed read handle + `graph.json` as AI context (D1); one read-only view; bidirectional spec↔test trace; determinism + `--check-clean`. The **entire trust model** ships at MVP.

**ASPIRATIONAL:** delivery-evidence overlay (OTel/SLSA/SBOM, `Build`/`Deployment`/`Observation` nodes, `nfr-violated`); runtime-anchor depth (Effect `R`, Awilix wiring, Fastify trees); Gherkin surface; harnesses + simulation; rich projections (LikeC4/OpenAPI/JSON-LD/SHACL); rich Spec Studio with scoped intent composition; AI slices + MCP + GraphRAG; architecture-enforcement tiers (4/5); a fuller mechanical substrate; incremental builds/caching; full CLI; `--lenient` ratchet; multi-tenant/multi-repo/polyglot.

> **Dropped, not deferred:** the structured patch-back loop + codemod. It is not on the aspirational list — the edit model is intent composition → agent → git (D2, `06` §4).

---

## 3. The cut list (with rationale)

These are out of the first slice. Each is genuinely deferred (or, where noted, dropped), and the model in `00`–`06` accommodates the deferred ones without refactoring the core.

1. **Delivery evidence — all of it, including test-result ingestion (D3).** No OTel/SLSA/SBOM, no `Build`/`Deployment`/`Observation` nodes, no runtime `evidence` population, no `nfr-violated`, and **no test-result ingestion**. Verification in the graph is *structural* — does a linked, enabled verifying spec/test exist — not pass/fail. *Rationale:* run results are per-instance operational data with no design/management relevance; code is not committed with failing tests; CI owns the verdict.
2. **Runtime-anchor depth.** No Effect `Layer`/`R` analysis, no Awilix deep wiring, no Fastify plugin trees, no migration path. Keep only generic markers. *Rationale:* framework-specific; irrelevant to "bind code to intent." Explicit human instruction: *"Complexities like Effect Layers + Awilix are definitely not required."*
3. **Gherkin authoring surface.** *Rationale:* a second parser + tag linter + round-trip; the TS DSL already expresses examples. *(Also: a single canonical authoring surface per spec — dual TS+Gherkin source was identified as the biggest anti-pattern to avoid.)*
4. **Harnesses + scenario simulation.** *Rationale:* a new authoring surface plus interactive UI; not needed to prove the loop.
5. **Patch-back loop + codemod — *dropped, not deferred*.** There is no structured-patch subsystem. The edit path is *intent composition → agent edits source → git → CI* (`06` §4). *Rationale:* the editor is an agent editing source, identical to a human edit; CI is the gate; a speculative patch-validator adds nothing. A structured edit contract returns only if a second *machine writer* appears. *(Resolved — §4 / D2.)*
6. **Rich projections + heavy AI tooling.** No LikeC4/OpenAPI/JSON-LD/SHACL; no dedicated slice generator or MCP server. *Rationale:* the typed handle + graph JSON is sufficient structured context at MVP scale. *(D1 resolves the AI surface shape.)*
7. **Architecture-enforcement overlays (Tiers 4/5).** No forbidden-dependency validators, no ts-arch tests, no custom `defineRule`. Keep only core graph invariants. *Rationale:* a whole validation competency; the small bounded context does not need it yet.
8. **A fuller mechanical substrate.** A *minimal* import/symbol substrate may earn its way into the MVP for impact/blast-radius (`06` §2 note); the exhaustive language-server-grade substrate (cross-package, symbol-level identity, drift/fan-in tooling) is deferred. *Rationale:* the experiment showed high value, but the curated surface proves the thesis first.
9. **Incremental builds / caching / sharding & full CLI** (evidence, migrate, ai subcommands). Full rebuild per run; `akg build` + `akg validate` (+ maybe `explain`/`search`) proves the loop. *Rationale:* fine for <~50 specs.

---

## 4. Resolved decisions (D1/D2/D3)

These were flagged as judgment calls; they are now decided. The architect playground experiment (`/Users/darkomijic/dev-projects/architect/playground/CONTEXT.md`) validated D1 and D3 directly.

### D1 — Expose the graph to agents from day one? **Resolved: yes — as a typed handle + raw shapes.**
The #1 sink is agents; the AI-native thesis must be *demonstrable* in the MVP. Ship the graph as **one typed read handle whose method list is the documentation** (joins/decode done once at load; persists nothing) plus the raw shapes. Freeze only the entry adapters (string→/file→/symbol→graph) + irreducible joins + blast-radius; let agents script the rest. The two surfaces — **curated** (the architecture, authored) and a **mechanical substrate** (derived, for impact/assist) — answer different questions and do **not** violate "no second graph": the substrate is a derived structure, not a competing read model. *Do not derive the architecture from code* — divergence from the import graph is curation, not drift. Full model in `06` §2–§3. *(Neither a 30-verb API nor raw-JSON-you-rejoin.)*

### D2 — Does cutting the patch loop make the thesis unprovable? **Resolved: no patch loop — the thesis is stronger without it.**
There is **no structured-patch subsystem**. The view's write-affordance is **scoped intent composition** (the "bundler" pattern); an AI agent applies the edit to source; git records it; CI validates — the same gate as any edit. "View as editing lens" survives in full, routed through agent + git instead of a codemod. A structured edit contract would be justified only by a second *machine writer* (second-caller bar), which the MVP does not have. Lifecycle ops (split/combine/refine/delete) are plain git + edit; maturity/epic signals are computed, not stored. Full model in `06` §4.

### D3 — Test-result ingestion? **Resolved: cut entirely.**
Test *run results* are operational, ephemeral, and per-instance — CI's domain, with no design/management relevance (code is not committed with failing tests; tests are skipped when needed). The graph tracks whether a linked, enabled verifying spec/test **exists** (a structural/provenance fact), never pass/fail. The readiness ladder tops out at a structural `verified` (verifying spec present and enabled); the run verdict lives in CI. No `Build` nodes, no evidence overlay.

---

## 5. Resolved tensions

### L4 — git-as-event-store (the most important resolution)
The v1 docs modelled supersession and history as **live read-model state** (`supersedes` edges everywhere, ADR `status: deprecated|superseded`, ID-freeze-after-`bound` + mandatory supersedes, a `deprecated-decision-applied` validator, retained "ghost" parents). That contradicts Founding Principle #5.

**Resolved (decision):** *History and prior states live in git; the graph is the projection of the current repo at a commit and carries no heavy historical/superseded bookkeeping as live state.* Removed-means-gone; "who changed what when" is `git log`/`git blame`; no ID-freeze-and-supersede subsystem; refined parents are retained only because they are present in the current repo, not as history. The **one** kept forward-pointer is an ADR declaring it `supersedes` another — a *current* authored relationship between two records both present in the repo, identical in kind to `refines`. A graph diff between two commits gives history reconstruction and change-impact *for free* (git + determinism), without a second store. Full statement in `01` (git-as-event-log) and `03` §5. *(Independently validated by the architect playground's "no-BC / live-state" doctrine: `drift` flags real deletions, it does not record what was replaced — "that is a git log question.")*

### E2 — enum-vocabulary reconciliation
The v1 enums listed different member sets across docs and overlapped (`abstraction` and `kind` both carried `rule`; `kind` had both `constraint` and a `quality` alias).

**Resolved (decision):** one coherent set, in `02` §2:
- `abstraction` is a clean altitude ladder — `initiative → domain → capability → feature → scenario → operation → component → contract` — with **`rule` removed** (a rule is a *kind*, not an altitude).
- `kind` drops the **`quality` alias**; there is one `constraint` member, and the flavour (business/quality/security/performance/compliance) lives on the `ConstraintFacet`, where a measurable-`target` performance constraint *is* an NFR.
- `capability` intentionally appears in both `kind` and `abstraction` — they answer different, orthogonal questions, so this is reuse, not inconsistency.

### D1/Two-surface — "two surfaces" vs "no second graph"
Resolved in `06` §2: the curated graph is the read model; the mechanical substrate is a *derived structure* (regenerable, never authoritative), not a competing source of truth; a typed handle joins both and persists nothing. No contradiction with Founding Principle #1.

---

## 6. Residual open questions

Deferred deliberately; recorded so they are not lost. None blocks the MVP.

- **Derived-readiness banner timing.** Profile enforcement (claim is checked) is MVP; the explicit "claimed `bound`, derived `framed`" banner can be a fast follow. *(`05` §3.)*
- **How thin a mechanical substrate in the MVP.** The curated surface is MVP; whether a minimal import/symbol substrate (for impact/blast-radius + curation-assist) ships in the first slice or just after is a sequencing call. *(`06` §2.)*
- **Inline-vs-centralized marker semantics.** Markers carry no intent in the MVP. How much *structural* semantics a marker may carry (beyond `id`/`satisfies`/`component`) is left configurable later. *(`04` §2.)*
- **Graph-DB timing.** File-based until measured traversal pain (~10k+ nodes); the schema is designed to map to a property graph later. *(`03` §4.)*
- **Trace-link recovery.** Permitted later only as an assistive *suggestion* engine (the substrate's "propose candidates" assist role), never a declared edge — bounded permanently by P10. *(`01`, `06` §2.)*
- **When (if ever) Gherkin / harnesses / evidence become CORE.** Driven by measured pain after the MVP loop holds, not by the roadmap. *(The patch loop is not on this list — it is dropped, not deferred; §4/D2.)*

---

## 7. Measure what actually hurts

After the MVP loop works, let observed pain — not this roadmap — order the next phase:

- "editing feels clumsy — the agent needs better-scoped intent" → richer intent-composition UI (the bundler), *not* a patch format;
- "I can't see architecture clearly / what breaks if I change this" → the mechanical substrate (impact, blast-radius, fan-in curation assist);
- "tests are hard to link" → improve spec↔test discovery;
- "is this NFR actually met in prod?" → begin the evidence overlay.

The point of the principle-led core is that each of these slots in cleanly, without refactoring the laws in `01`.
