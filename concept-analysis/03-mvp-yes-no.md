**MVP scope recommendation for Libar Omni**

I have reviewed the full document set (00–08 + job stories A–H). It is a coherent, well-reasoned synthesis with a strong founding principle: **one regenerable graph derived from the repo, honest provenance, specs as stable typed artifacts that enrich in place, and validation that keeps the graph honest**.

The vision is ambitious and correct in its long-term direction. However, the current scope is a full v1–v2 product, not an MVP. It tries to solve too many problems simultaneously (authoring, extraction, validation, rich interactive UI, patch loop, multiple runtime anchors, evidence ingestion, AI tooling, multiple projections, architecture enforcement, etc.).

### What I would cut completely for the first MVP

These are **not** "nice to have later" — they are **out of scope for the first 4–8 weeks of implementation**. They add massive surface area without being required to prove the core thesis.

**Cut entirely (or reduce to zero for MVP):**

1. **Everything in 08 (Delivery Evidence & Tooling) except the absolute basics of test result attachment**  
   - No OTel queries/pull/push, no SLSA, no CycloneDX/SBOM, no `Build`/`Deployment`/`Observation` nodes, no `evidence` facet population from runtime, no `nfr-violated` checks.  
   - JS-H1 and JS-H2 are **Later**. Test results can be a minimal JSON ingest in a follow-up iteration if it fits naturally; otherwise defer.

2. **Full runtime anchor depth (05-runtime-anchors.md)**  
   - No Effect `Layer` + `provides`/`requires` extraction with `R` parameter analysis.  
   - No Awilix `defineRegistrations` deep wiring.  
   - No Fastify plugin tree or request-scope modelling.  
   - Keep only **generic source markers** (`@arch.node`, JSDoc, or `markImplementation`) that bind any code location to a spec ID + optional component. The runtime framework is irrelevant to the core job in B1/B2.

3. **Gherkin authoring surface (04)**  
   - No `.feature` parsing, no `@spec.*` tag extraction/linting, no round-trip export/import between Gherkin and TS.  
   - TS DSL is canonical. Gherkin can be added later as an equal-canonicity surface for teams that want it.

4. **Harnesses + interactive scenario simulation (04 + 07)**  
   - Completely cut. These are excellent for Iterate but add UI complexity, a new authoring surface, and "Propose tests" patch generation that is not required to prove the loop.

5. **Patch-back loop + codemod (JS-F1, parts of 02/07)**  
   - No JSON Patch application, no `akg patch apply`, no speculative graph validation + ts-morph codemod, no "edit in Studio → validated patch → update `.spec.ts`".  
   - This is the single biggest complexity reducer. MVP is **read + validate + generate**. Write path stays "edit TypeScript + git". The patch loop is powerful Iterate work.

6. **Advanced projections and AI-specific tooling (07)**  
   - No LikeC4 model generation or embedded views.  
   - No OpenAPI/AsyncAPI export.  
   - No JSON-LD + PROV-O + SHACL.  
   - No dedicated AI slice generator, MCP server, or prompt-bundle tooling.  
   - The **graph JSON itself** is the structured context for AI agents. A basic generated HTML/Markdown view is enough for humans.

7. **Architecture enforcement overlays (Tier 4/5 in 06)**  
   - No `dependency-cruiser` rules as failing validators, no ts-arch-style tests, no forbidden-dependency enforcement, no custom `defineRule` in `arch/rules.ts`.  
   - Keep only core graph invariants (unresolved refs, duplicate IDs, readiness profile completeness, basic orphan detection).

8. **Incremental builds, caching, performance sharding, project references complexity**  
   - Full rebuild on every `akg build` is acceptable for MVP (target a small bounded context with <50 specs).

9. **Full CLI surface, evidence commands, migrate, ai subcommands**  
   - Minimal CLI only: `akg build` and `akg validate` (plus perhaps a simple `explain` or `search`).

**Result of cuts**: The MVP becomes a **tight vertical slice** that proves the founding principle on one small bounded context without boiling the ocean.

### What I would include as core & critical for first MVP

Focus exclusively on proving this loop on **one bounded context** (e.g. Order Management / `pack:checkout-v1` with 8–12 specs):

**Non-negotiable core (must ship for MVP to be meaningful):**

- **A — Capture & evolve intent** (JS-A1–A4)  
  Full typed `Spec` DSL in TypeScript (`spec()`, `specPack()`, facets, relations, `abstraction` + `readiness` axes, enrichment in place, refinement to children). One primitive, stable IDs, no artifact migration.

- **B — Bind code to intent** (JS-B1–B2)  
  At least one reliable marker style (recommend modern decorator `@arch.node({ id, satisfies, component? })` + JSDoc fallback). Stable ID linkage that survives refactors. ESLint rule to catch missing markers on designated patterns is optional but valuable.

- **C — One Graph** (JS-C1–C3)  
  `ts-morph` extractor that produces **one canonical regenerable graph** from `/specs/**/*.spec.ts` + markers + basic test discovery.  
  Honest provenance on edges (declared vs annotation; inferred kept minimal or advisory only).  
  Graph is a pure function of the repo.

- **D — Keep it honest** (JS-D1–D2)  
  Tier 1–3 validation only:  
  - TypeScript types + branded IDs + regenerated `SpecId` union.  
  - Schema validation of graph.  
  - Core graph validators: unresolved references, duplicate IDs, readiness profile completeness (at minimum up to `bound` or `executable`), basic orphan detection, verifies linkage from tests.  
  CI fails on errors. Readiness is a verifiable claim.

- **E — See & share (minimal)** (JS-E1)  
  At least one generated human-readable projection: either  
  - A simple static HTML Spec Studio (tree + detail pages, readiness pills, relations/impact list, source links) **or**  
  - High-quality generated Markdown/HTML reports (traceability matrix + per-spec pages).  
  The view must be **fully derived** and reproducible.

- **G — Trace & assess impact (core part)** (JS-G2)  
  Explicit bidirectional `verifies` links from tests to specs (via marker on test or simple `specTest({ verifies: [...] })` helper).  
  Ability to query "what verifies this spec?" and "what does this test cover?" from the graph.

**Supporting infrastructure (minimal but required):**
- Packages: `akg-spec`, `akg-markers`, `akg-graph` (types + minimal query API), `akg-extractor` (ts-morph), `akg-validate` (core rules), `akg-projections` (one generator), `akg-cli` (build + validate).
- One clean example bounded context with end-to-end working flow.
- Deterministic, order-stable graph output.
- `akg build` produces the graph + projection(s); `akg validate` gates CI.

**Explicitly MVP scope (what "done" looks like):**
- You can write specs in TS, mark some implementation and test files, run `akg build`, get a valid graph, see validation pass/fail with clear messages, and open a generated view that shows linked specs + implementations + tests with correct readiness and impact lists.
- Changing a spec or marker and re-running produces an updated view.
- CI rejects PRs that break links or make false readiness claims.
- The graph and view are **regenerable** — delete `generated/` and rebuild identically.

### Recommended approach to build the MVP

1. **Start with the JTBD as the backlog** (not the full concept docs). Prioritise the MVP-tagged stories above. Treat everything else as "design for, implement later".

2. **Pick one tiny bounded context first** (e.g. `spec:orders.create-order` + 2–3 child scenarios + 1–2 rules + 1 NFR + parent capability/pack). Do not model the whole checkout flow.

3. **Build in thin vertical slices** (end-to-end on the example):
   - Slice 1: DSL + spec extraction + basic graph (nodes + declared relations) + JSON output.
   - Slice 2: Markers + implementation binding + test discovery + `verifies` edges.
   - Slice 3: Core validators (readiness profiles + ref integrity + orphans).
   - Slice 4: One generated view (start with clean Markdown or a very small Web Component-based HTML; keep it read-only).
   - Slice 5: Polish CLI, error messages, documentation of the example, and "regenerate from clean repo" test.

4. **Enforce the invariants ruthlessly even in MVP**:
   - Repository is canonical.
   - Graph is derived and regenerable.
   - Provenance is honest (keep inferred edges minimal/advisory).
   - Validation fails loudly on broken claims.

5. **Measure what actually hurts** after the MVP loop works:
   - If "editing specs feels painful because I have to leave the nice view", then patch loop becomes the top Iterate priority.
   - If "I can't see architecture clearly", then add simple diagram generation.
   - If "tests are hard to link", improve test discovery.

6. **Team & timeline realism**:
   - One focused engineer (or small pair) can deliver a credible MVP in 4–6 weeks if scope is cut as above.
   - Use the existing concept docs as **reference architecture**, not implementation spec. Re-read only the sections relevant to the slices above.
   - Write the example specs and marked code **first** — this forces the DSL and extractor to be usable.

**North Star for this MVP (one sentence):**
> On a small bounded context, an engineer writes specs in TypeScript, marks the implementing code and tests with stable IDs, runs `akg build`, gets a validated graph, and opens a generated view that correctly shows intent, implementation links, verification status, and impact — and CI rejects the PR if any of it is broken or incomplete.

This scope is small enough to finish, coherent enough to demonstrate the thesis, and extensible enough that the later phases (patch loop, evidence, richer projections, Effect depth, AI tooling) slot in cleanly without refactoring the core.
