# Census of Problem Domains — Libar Omni Concept

*An independent breadth-map of every distinct concern the design addresses, with special attention to concerns that go beyond "derive a graph from annotated code."*

A note on status vocabulary: the docs explicitly mix **load-bearing core** (v1 / Phases 0–2), **architecture-rigor core** (Phase 3), and **opt-in / future / aspirational** (Phase 4–5+, "open questions"). I tag each accordingly and cite to doc + section throughout.

---

## A. Product, market, and consumer concerns

### A1. Product/market vision — "single source of truth for the whole delivery lifecycle"
- **Problem:** Intent, architecture, decisions, acceptance criteria, tests, and operational evidence live in disconnected tools (Jira, Miro, ADR markdown, `.feature` files, CI dashboards) linked by rot-prone prose; teams "have lost the single source of truth." (00 §1)
- **Stance:** Make the *whole* delivery lifecycle authorable as typed code, project everything else off one graph; the codebase becomes "a living model of the system." (00 §2; README "What this is")
- **Status:** Core thesis / load-bearing framing.
- **Beyond-extraction?** YES. This is a *delivery-lifecycle product vision*, not a code-graph tool. The graph is one mechanism inside a much larger claim.

### A2. Multi-persona consumer model (who consumes, and how)
- **Problem:** Different stakeholders need different things from the same truth and today get none of it coherently.
- **Stance:** Five named personas with distinct surfaces and value props — domain engineer, architect, product manager / BA, QA/test engineer, and **AI agent** as a first-class persona. A per-persona "today vs with Libar Omni" value table. (00 §4, §5; 04 §6)
- **Status:** Core (drives the whole authoring-surface and projection design).
- **Beyond-extraction?** YES. A code-graph tool serves developers; this explicitly designs for PMs/BAs, auditors, and execs.

### A3. Stakeholder/non-technical consumption (read without learning TypeScript)
- **Problem:** Business stakeholders cannot read or refine specs that live as TypeScript.
- **Stance:** The HTML Spec Studio is "the reading surface for everyone"; PMs read readiness, coverage, open questions, alternatives, impact previews interactively; mobile-responsive "for PMs and execs reviewing on phones." (00 §4, North Star §9; 07 §2, §11)
- **Status:** Core (Studio is the "first visible win" — 08 §9.10).
- **Beyond-extraction?** YES. Stakeholder-facing reading/refinement UX is a product concern, not a graph-building concern.

### A4. Competitive positioning / "membrane not replacement"
- **Problem:** The space is crowded (Structurizr, LikeC4, Cucumber, ADRs, OpenAPI, TypeSpec, CALM, dependency-cruiser, Jira, Cursor).
- **Stance:** Explicit differentiation table; positioned as "the membrane that links them" — ingests their outputs and emits back into their formats, not a replacement. (00 §8)
- **Status:** Core positioning.
- **Beyond-extraction?** YES — strategy/positioning concern.

### A5. Explicit non-goals and scope discipline
- **Problem:** Scope creep would dilute the compiler-API leverage and bloat the model.
- **Stance:** Named non-goals: not replacing Jira/Linear/Notion, not a universal RM tool, not auto-inferring intent, not polyglot day one, not no-code authoring, not replacing design tools. (00 §7; README "out of scope"; 06 §14; 02 §12; 05 §10)
- **Status:** Core (recurring discipline across every doc).
- **Beyond-extraction?** Mixed — but several non-goals (RM tool, process replacement) confirm the system *flirts with* domains beyond extraction and deliberately bounds them.

---

## B. The core conceptual model (where it overlaps a code-architecture tool most)

### B1. Single-primitive model (`Spec`) replacing a requirement→impl→test pipeline
- **Problem:** Multi-artifact lineages force premature conversion and lose information at each transition. (00 §3 Statement A; 01 §1; README §6)
- **Stance:** One `Spec` primitive across idea→verified; "refinement is enrichment, not conversion." Five primitives total: `Spec`, `SpecPack`, `Facet`, two axes, `SpecRelation`. (01 intro, §1–§6)
- **Status:** Core (the "most important reframing").
- **Beyond-extraction?** PARTIAL. A code-graph tool models code nodes; modeling *ideas/NFRs/decisions/workflows* as the same primitive is broader — it spans requirements management and product ideation.

### B2. Two orthogonal axes — abstraction × readiness (maturity = required completeness)
- **Problem:** A linear stage pipeline cannot represent "high-level capability that's only framed" alongside "low-level scenario that's executable." (00 §3 Statement B; 01 §1.3–§1.5)
- **Stance:** `abstraction` (initiative→contract) and `readiness` (sketch→verified) move independently; each readiness has a validation **profile**. (01 §5; 03 §7; 06 §6.3.2)
- **Status:** Core.
- **Beyond-extraction?** YES on the readiness axis — it encodes *lifecycle/maturity of intent*, which a structural code graph does not have.

### B3. Facet model (intent, behavior, constraints, model, design, runtime, bindings, verification, evidence, ui)
- **Problem:** Need to carry many aspects of truth without forcing a rigid schema.
- **Stance:** Ten optional typed facets, evolved by enrichment never replacement; "types for shape, validators for completeness." (01 §2; 04 §1.4)
- **Status:** Core.
- **Beyond-extraction?** PARTIAL — `design`/`runtime`/`bindings` are extraction-adjacent, but `intent`, `constraints` (NFR), and `ui` are not.

### B4. Graph metamodel — nodes, edges, the canonical read model
- **Problem:** Need one queryable structure all consumers read from.
- **Stance:** Flat node/edge arrays; ~25 node kinds spanning delivery-intent, architecture, implementation, runtime, test, and evidence; ~30 edge kinds; typed `Graph` query API (`impactOf`, `orphans`, `unverifiedExecutable`, `diff`). (03 §1–§3, §8)
- **Status:** Core.
- **Beyond-extraction?** This *is* the extraction output — but its scope (evidence nodes, decision nodes, NFR nodes) reaches well past code structure.

### B5. Stable IDs / refactor-stable identity / ID grammar
- **Problem:** Prose links rot on rename/refactor.
- **Stance:** Namespaced ID grammar, branded nominal types, regenerated `SpecId` union turning referential integrity into a `tsc` error; ID freezing after `bound`. (01 §7; 03 §6)
- **Status:** Core (called "the load-bearing element of the entire graph").
- **Beyond-extraction?** NO — this is squarely an extraction/architecture-tool concern (and the one most likely already covered by a narrower principle set).

---

## C. Authoring experience — multiple surfaces

### C1. Multiple, role-native authoring surfaces (not one)
- **Problem:** Forcing every persona into TypeScript fails adoption.
- **Stance:** **Four** authoring surfaces ranked by canonicity: TS Spec DSL, source-code markers, **annotated Gherkin (equal-canonicity for behavior specs)**, and **harness modules**. "No persona is forced to learn an unfamiliar surface." (04 intro, §6)
- **Status:** Core (Gherkin/markers are MVP-Phase 2; harnesses Phase 3).
- **Beyond-extraction?** YES. Multi-surface *authoring* (especially BDD-first and interactive harnesses) is an authoring-product concern beyond reading code.

### C2. The DSL-as-static-data constraint
- **Problem:** Dynamic spec files can't be deterministically extracted.
- **Stance:** Ban loops/conditionals/IO/computed IDs/product-code imports; "treat it as a JSON file that TypeScript happens to validate." Enforced by ESLint + extractor. (04 §1.2, §1.6)
- **Status:** Core.
- **Beyond-extraction?** NO — extractor-determinism concern.

### C3. Source-code markers as one-way pointers
- **Problem:** Need to bind business intent to real code locations.
- **Stance:** Three marker styles (decorators / JSDoc / marker constants), all metadata-only, no runtime effect; "markers are read-only pointers from code to spec, never the reverse." `akg/marker-required` lint. (04 §2)
- **Status:** Core (MVP).
- **Beyond-extraction?** NO — this is the annotated-code substrate itself.

### C4. Interactive harnesses — simulation/exploration as an authoring artifact
- **Problem:** Stakeholders want to explore "what does this spec do under conditions X, Y, Z?" and find coverage gaps *before* implementation.
- **Stance:** Harness modules declare controls + an `expected()` model + `coverage()`; rendered as interactive panels; "Propose scenarios" generates patches for uncovered combinations. Explicitly *not* test runners and *not* authoritative truth. (04 §4; 07 §7)
- **Status:** Phase 3 (load-bearing for the "simulate" value, but later phase).
- **Beyond-extraction?** YES, strongly. Interactive what-if simulation + coverage-gap discovery is a product capability with no analog in code extraction.

### C5. UI / visual-design linkage (Storybook, Figma, Pencil, Playwright flows, a11y)
- **Problem:** User-facing specs feel incomplete without visual artifacts.
- **Stance:** `UiFacet` links (by ID/URL, never owned/rendered) to Storybook stories, Figma nodes, Pencil docs, Playwright flows, visual-regression baselines, and `accessibilityStatus`. (01 §2.10; 04 §5)
- **Status:** Core facet; deeper rendering aspirational.
- **Beyond-extraction?** YES. Design-tool interop and accessibility status are product/design concerns, not code extraction.

### C6. Round-tripping / canonical-format choice (Gherkin ↔ TS)
- **Problem:** Two surfaces can describe the same behavior.
- **Stance:** Per-spec exactly one canonical surface (config-driven); `akg export-gherkin` / `export-ts` generate the other form for reading/refactoring; no mixing. (04 §3.4; 08 §6.3)
- **Status:** Core (Phase 2).
- **Beyond-extraction?** YES — a multi-format authoring/interoperability concern.

---

## D. Runtime / framework neutrality vs commitment

### D1. Runtime anchor decision (Effect Layers vs Awilix vs custom)
- **Problem:** The architecture graph is "more useful when grounded in the live application's dependency graph." (05 intro)
- **Stance:** Opinionated recommendation — Fastify + Effect Layers (Effect makes the *interface* the unit of reasoning); Awilix transitional; manual `defineWiring` as "minimum viable." A documented **Awilix→Effect migration path** (5 phases). (05 §1, §3–§7; 00 §6)
- **Status:** Core decision, but framework-neutral by adapter; Effect extractor is Phase 3.
- **Beyond-extraction?** PARTIAL. Reading runtime composition is extraction; but *recommending a runtime architecture and a migration path* is an architecture-prescription concern beyond reading existing annotations.

### D2. "One runtime truth" rule
- **Problem:** Multiple composition mechanisms make the graph unreliable.
- **Stance:** Pick exactly one first-class composition mechanism; mixed-framework specs warn. (05 §1)
- **Status:** Core invariant.
- **Beyond-extraction?** NO — directly serves reliable extraction.

### D3. Framework neutrality with explicit baseline assumptions
- **Problem:** Committing hard to one stack limits adoption; committing to none dilutes the compiler-API leverage.
- **Stance:** Default stack stated (Node/Fastify/Effect/Vitest/Cucumber/Playwright/pnpm/OTel/SLSA) but "not requirements of the design"; substitutes work via adapter modules; Hono/Express/NestJS/Inversify all possible but not recommended. (00 §10; 05 §10; 02 §8 `runtimeAnchor`)
- **Status:** Core stance (neutrality), with future adapters aspirational.
- **Beyond-extraction?** PARTIAL — adapter strategy is an extraction concern; the *prescriptive opinion* is broader.

---

## E. The edit / feedback loop (this is a whole subsystem, not a side feature)

### E1. Patch-back loop (derived view → validated patch → canonical source)
- **Problem:** If HTML is the editing surface, you either hand-transcribe edits (kills UX) or let HTML become truth (kills type safety). (02 §2 insight)
- **Stance:** The *only* sanctioned write path from Layer 4 to Layer 1: RFC-6902 JSON Patch + custom ops → schema check → speculative graph apply → validators → ts-morph codemod → `.spec.ts` → green CI. Transactional ("validate before write"). (02 §2, §4.2; 07 §6; 06 §9)
- **Status:** Core (Phase 2).
- **Beyond-extraction?** YES, strongly. A read-write closed loop with codemod write-back is a delivery-product capability; pure extraction is read-only.

### E2. Inline-edit / propose-via-AI / simulate interaction patterns
- **Problem:** Users need safe, varied ways to propose change.
- **Stance:** Three interaction patterns — inline edit with patch staging; AI propose (browser never holds API keys or runs model output); harness simulate. (07 §4)
- **Status:** Core (Phase 2–3).
- **Beyond-extraction?** YES.

### E3. Custom lifecycle patch ops (promote-readiness, split-spec, merge-spec)
- **Problem:** Lifecycle moves are first-class actions, not raw JSON edits.
- **Stance:** Libar-specific patch ops beyond JSON Patch; merge adds a `supersedes` relation. (06 §9.1; 07 §6.4)
- **Status:** Core (Phase 2).
- **Beyond-extraction?** YES — lifecycle authoring operations.

### E4. Patch safety / concurrency / non-patchable fields
- **Problem:** Concurrent edits and derived fields could corrupt truth.
- **Stance:** `baseGraphHash` conflict rejection (409-style); evidence/bindings/runtime/id fields are non-patchable (greyed out); speculative-apply transactionality. (02 §11; 07 §6.5)
- **Status:** Core (Phase 2).
- **Beyond-extraction?** YES — write-path governance.

---

## F. Design-time intent vs runtime reality / evidence

### F1. Delivery-evidence overlay (the "did it actually happen" layer)
- **Problem:** "Design-time specs are only half the story" — the graph is uniquely valuable when it answers "is this NFR met in production *right now*?", "which build produced prod?", "which incident touched this spec?" (08 intro, §5)
- **Stance:** `EvidenceFacet` is the only facet CI populates (not authored); `Build`/`Deployment`/`Observation`/`TestRun` nodes; evidence ingested from CI/CD outputs. (01 §2.9; 03 §2.14–§2.15; 08 §1–§2)
- **Status:** **Opt-in, Phase 4** — explicitly "v1 ships without it."
- **Beyond-extraction?** YES, strongly. Linking design intent to *live operational reality* is far outside building a graph from source.

### F2. NFR-to-observability bridge (OpenTelemetry)
- **Problem:** NFR targets ("p95 &lt; 300ms") are decorative unless measured.
- **Stance:** OTel semantic conventions; pull model (query Honeycomb/Prometheus via `otel-queries.yaml`) and push model (collector side-channel); `nfr-violated` validator compares observed vs target. (05 §8.3; 06 §11.2; 08 §4)
- **Status:** Phase 4 opt-in.
- **Beyond-extraction?** YES.

### F3. Claimed-vs-derived readiness (intent vs verified reality, in the graph itself)
- **Problem:** An author can *claim* a readiness the artifact doesn't earn.
- **Stance:** `derivedReadiness` field — "what validators believe vs what the author claimed"; diverges on misclaims; banner "claimed bound, derived framed." "Readiness is a claim. Validators verify the claim." (03 §2.1; 01 §1.4; 06 §8)
- **Status:** Core.
- **Beyond-extraction?** YES — encodes a gap between asserted intent and demonstrated reality.

---

## G. Lifecycle, governance, readiness, compliance

### G1. Readiness profiles as a CI-enforced maturity gate
- **Problem:** "Incompleteness" needs to fail the build at the right granularity.
- **Stance:** Per-level validation profiles (sketch→verified) with required facets/relations/evidence; declarative and config-overridable; `--lenient` ratchet mode. (06 §6.3.2; 03 §7; 08 §9.10)
- **Status:** Core (Phase 1–3).
- **Beyond-extraction?** PARTIAL/YES — this is governance over *intent maturity*, beyond structural correctness.

### G2. Decision lifecycle (ADRs as first-class nodes)
- **Problem:** ADRs are "linked from nowhere, referenced by nothing in code." (00 §1)
- **Stance:** `Decision` nodes with status (proposed/accepted/deprecated/superseded), `decidedBy` edges; ADR markdown referenced by ID not parsed for semantics; `deprecated-decision-applied` validator; generated ADR index. (03 §2.4; 06 §6.3.4; 07 §5.7)
- **Status:** Core.
- **Beyond-extraction?** YES — decision governance/traceability is beyond code structure.

### G3. Open-questions / blocking-question tracking
- **Problem:** Unresolved design questions silently leak into implementation.
- **Stance:** `IntentFacet.openQuestions` with `blocking` flag that prevents promotion past `specified`; `blocking-open-question` / `stale-open-question` validators; Studio "Mark resolved / Promote to ADR" buttons. (01 §2.1; 06 §6.3.6; 07 §2.3-B)
- **Status:** Core.
- **Beyond-extraction?** YES — design-deliberation tracking.

### G4. Supply-chain provenance &amp; compliance (SLSA, SBOM, license)
- **Problem:** "Compliance and audit work is repetitive because evidence is gathered ad hoc." (00 §1)
- **Stance:** SLSA in-toto attestations on `Build.attestations`; CycloneDX SBOM summary; `license-compliance` validator with per-spec overrides; PROV-O alignment in JSON-LD; auditor persona answers "in seconds." (00 §5; 08 §2, §5)
- **Status:** Phase 4 opt-in.
- **Beyond-extraction?** YES, strongly — supply-chain/audit/compliance domain.

### G5. Spec governance / change approval
- **Problem:** Who can apply what change?
- **Stance:** Deliberately *not* an embedded RBAC — relies on `patch.requireApprovalFor` config + Git/CI (PR review, CODEOWNERS). `owner` is a soft pointer, not auth. (08 §9.6; 02 §8; 01 §10)
- **Status:** Core stance (delegated out).
- **Beyond-extraction?** YES — governance concern, explicitly bounded.

### G6. Process-state boundary (PM tooling stays out)
- **Problem:** Temptation to model "in sprint / in review / in QA."
- **Stance:** Process state is project management, not delivery truth — plug into Linear/Jira via a separate index, don't pollute the Spec model. (01 §10; 02 §12)
- **Status:** Core boundary.
- **Beyond-extraction?** YES — defines the edge with PM systems.

---

## H. AI-native authoring AND consumption (a design driver, not a feature)

### H1. AI as a first-class consumer (structured context over raw source)
- **Problem:** "AI-assisted work is shallow because the model has only raw text, not a structured graph"; agents "read raw files, hallucinate structure." (00 §1, §5)
- **Stance:** Pre-sliced AI context files (`per-pack`, `per-capability`, `change-impact-&lt;id&gt;`, `readiness-&lt;level&gt;`, `failing-tests`), ≤32k tokens, self-contained with source files + open questions + findings; "replaces throw-the-whole-repo-into-a-prompt." (00 §5, §9; 07 §5.5)
- **Status:** Core (slices Phase 2; GraphRAG v2).
- **Beyond-extraction?** YES. AI-native *consumption design* (token-budgeted neighborhoods, MCP) is a driving requirement, not incidental.

### H2. AI as authoring participant (propose patches, generate scenarios/tests)
- **Problem:** When AI writes specs, the human's job becomes review.
- **Stance:** AI proposes via patch loop; "Propose tests/ADR/decompositions" emit prompts; patches must validate before apply; `proposedBy: { kind: "ai" }` audit tagging; "no silent apply." (07 §4.2, §7, §13; 08 §9.8)
- **Status:** Core (Phase 2–3); full MCP+loop integration Phase 5.
- **Beyond-extraction?** YES.

### H3. MCP server / prompt-bundle / GraphRAG retrieval surfaces
- **Problem:** Agents need a programmatic, read-only window into the graph.
- **Stance:** `@akg/mcp-server` (read-only: getSpec/getSlice/proposeChange/searchSpecs); `akg ai bundle` for non-MCP flows; GraphRAG-style hierarchical retrieval for large graphs. (07 §13)
- **Status:** Prototype Phase 2; GraphRAG/MCP-first agents v2/Phase 5.
- **Beyond-extraction?** YES — agent integration surface.

### H4. "AI-driven editing flips the equation" as the justification for HTML
- **Problem:** Why HTML over Markdown at all?
- **Stance:** A core argument *for* the Studio is that AI authorship makes humans reviewers, and HTML beats Markdown for review. (07 §1)
- **Status:** Core rationale.
- **Beyond-extraction?** YES — AI workflow assumption shaping the product surface.

---

## I. Interoperability and standards (ingest and emit)

### I1. Standards-based interop (emit)
- **Problem:** Lock-in and isolation from the ecosystem.
- **Stance:** Emits OpenAPI 3.1 / AsyncAPI (with `x-akg-*` linkage), LikeC4 models, JSON-LD (with PROV-O), optional SHACL shapes, Gherkin export, traceability matrices, ADR index. (00 §6; 02 §1; 03 §9; 07 §5)
- **Status:** Core (Phase 2); SHACL/JSON-LD aspirational-ish.
- **Beyond-extraction?** PARTIAL — projections are downstream of the graph, but emitting *contract/standards artifacts* (OpenAPI, JSON-LD, SHACL) is a broader interop concern.

### I2. Standards-based interop (ingest)
- **Stance:** Ingests dependency-cruiser, Nx project graph, CodeQL/Semgrep SARIF, Cucumber Messages, Vitest/Playwright JSON, OTel, SLSA, CycloneDX, LikeC4 models, ADR markdown. "It is the membrane." (00 §8; 02 §1.2, §4.1; 08 §2)
- **Status:** Mixed — test/dep-cruiser ingest Phase 2–3; security/evidence Phase 4.
- **Beyond-extraction?** PARTIAL — some are extraction overlays, but ingesting security/supply-chain/observability is broader.

### I3. Long-horizon formal-MBSE interop (ReqIF, SysML v2, CALM)
- **Stance:** Named long-term horizons "for organisations that need it"; core does not depend on them. (00 §7; 07 §5.4; 08 §8.6)
- **Status:** Aspirational / future (Phase 5+).
- **Beyond-extraction?** YES — systems-engineering interoperability.

### I4. Schema versioning / migration as large patches
- **Problem:** The graph schema and spec files evolve.
- **Stance:** SemVer-versioned schema (patch/minor/major rules); `akg migrate` runs codemods; "migrations are just large patches." Studio refuses unsupported major versions. (03 §10; 08 §6.7)
- **Status:** Core mechanism.
- **Beyond-extraction?** PARTIAL — a versioned-product-data concern beyond a one-shot extractor.

---

## J. Trust, determinism, and self-integrity

### J1. Derived-vs-canonical rule + three self-invariants
- **Problem:** "Is the graph in sync with the diagrams?" must never be a question.
- **Stance:** Layer 4 = pure function of Layer 3; Layer 3 = pure function of Layer 1 (+ pinned overlays); Layer 1 only modified by humans or `akg patch apply`. Byte-identical reproducibility; `--check-clean` drift gate; path allowlist blocks hand-edited `/generated/`. (02 §1, §7, §11; 00 §3 Statement C)
- **Status:** Core (the trust foundation).
- **Beyond-extraction?** PARTIAL — determinism is an extraction-quality concern, but the *self-enforcing invariant system* is a stronger architectural commitment.

### J2. Edge provenance never collapsed (declared / annotation / inferred)
- **Problem:** Automated traceability is "helpful but imperfect"; mixing it with declared truth lies about coverage.
- **Stance:** Three provenance layers with `confidence`; inferred edges are suggestions (dotted/faded), never trigger errors, never silently promoted; promotion is a human patch action. (03 §4, §5; 00 §7)
- **Status:** Core (load-bearing decision).
- **Beyond-extraction?** PARTIAL — but the *epistemics of declared intent vs inferred structure* is broader than a pure structural graph, which would treat all edges as facts.

### J3. Validator self-testing (golden fixtures)
- **Problem:** "A silently-passing validator hides a problem."
- **Stance:** Every validator ships should-fail/should-pass fixtures + a `validators.snapshot.json`. (06 §13; 02 §11)
- **Status:** Core.
- **Beyond-extraction?** NO — tooling quality.

### J4. Performance / scale engineering
- **Stance:** Incremental builds, per-file SHA cache, tsbuildinfo integration, project-reference sharding; explicit latency budgets (cold &lt;60s, warm &lt;10s); SQLite-cache watch-daemon and Neo4j mirror flagged for extreme scale. (02 §5; 06 §10; 08 §9.2, §9.7)
- **Status:** Core (incremental); graph DB aspirational.
- **Beyond-extraction?** NO — extractor engineering.

---

## K. Tiered validation as a distinct competency

### K1. Five-tier layered validation gate
- **Problem:** Forcing all checks into types contorts the type system; all-runtime is slow; all-graph hides type errors.
- **Stance:** Tier 1 TS types → Tier 2 schema (Zod author-side / Ajv machine-side) → Tier 3 graph semantic invariants → Tier 4 architecture rules → Tier 5 custom team rules. Severity model, structured exit codes, config overrides. (06 §6; 02 §9)
- **Status:** Core (rolled out across Phases 1–3).
- **Beyond-extraction?** PARTIAL — much overlaps a code-architecture linter (Tier 4 is dependency-cruiser/ts-arch), but Tiers 3/5 validate *intent/lifecycle/NFR* semantics beyond code.

### K2. Architecture-boundary enforcement (dependency rules)
- **Stance:** Forbidden-dependency, domain-purity, single-direction-architecture, route-has-component, layer-respects-component, Awilix lifetime/cycle checks, Effect `R=never` completeness. (06 §6.4; 05 §4.3, §3.3)
- **Status:** Core (Phase 3).
- **Beyond-extraction?** NO — this is the heart of a code-architecture tool (likely well-covered by a narrower set).

---

## L. Repo/config/deployment surface

### L1. Configuration-as-typed-code + package boundaries
- **Stance:** `akg.config.ts` typed config (paths, runtimeAnchor, overlays, evidence, validation, projections, patch gates); 13-package pnpm workspace with strict top-down dependency direction; tree-shakeable markers separated from DSL. (02 §3, §8; 08 §7)
- **Status:** Core.
- **Beyond-extraction?** NO — tool architecture.

### L2. Local dev loop + CI integration + sharing/hosting
- **Stance:** `akg watch` (same HTML as CI, no drift), WebSocket live reload, optional LSP plugin; CI pipeline shape; Spec Studio published per-PR to S3/Vercel/Pages with preview URLs for stakeholder review. (02 §10; 06 §10; 07 §12; 08 §3)
- **Status:** Core (watch/CI Phase 1–2; LSP aspirational).
- **Beyond-extraction?** PARTIAL — `watch`/CI are tooling; per-PR stakeholder-preview hosting is a product-collaboration concern.

### L3. Phased adoption / change-management strategy
- **Problem:** "What if the team hates this?"
- **Stance:** Phase 0→4 roadmap where each phase is "internally complete"; start with one bounded context; Studio as first win; `--lenient` ratchet; pair adoption with existing pain. (08 §8, §9.10; README "out of scope")
- **Status:** Core go-to-market/adoption concern.
- **Beyond-extraction?** YES — adoption strategy, not a technical capability.

---

## M. Concerns the docs explicitly defer or bound (named limitations)

- **Multi-tenant variant specs** — modeled as child specs refining a parent, with diff visualization flagged future; *not* conditional fields. (01 §10; 08 §8.6)
- **Cross-repo federation / multi-repo** — explicitly out of v1 ("their integration problem"), flagged Phase 5+. (06 §14; 08 §8.6)
- **Polyglot / multi-language extractors** — TS-first; per-language extractors share the schema, v3+. (00 §7; 08 §9.5)
- **Semantic NLP equivalence of prose, prose-style lints, runtime perf-budget enforcement, security policy ownership** — out of scope; overlays bring findings but policy lives in the source tools. (06 §14)
- **Inline-vs-centralised semantics, graph-DB timing, trace-link recovery (assistive-only forever), decorator flavors** — retained open questions. (08 §9)
- **AI hallucination** — treated as a defended failure mode (validate-before-apply, no silent apply, read-only MCP, audit tagging). (08 §9.8)

Status: explicitly aspirational/future/bounded. Several (multi-tenant, multi-repo, polyglot) are *whole categories a narrower principle set could miss* even though deferred here.

---

## N. Failure modes the design explicitly defends against

A distinct lens worth isolating, since these are "what is this system *for*" stated negatively:
- Documentation drift / "is the graph in sync?" → derived-vs-canonical invariants (J1).
- Prose-link rot on refactor → stable IDs (B5).
- Lying coverage / over-trusting inference → provenance separation, no silent promotion (J2).
- Readiness misclaims → derived readiness + profiles (F3, G1).
- AI hallucination → validate-before-apply, read-only MCP (H2, M).
- Patch races / half-applied edits → baseGraphHash + transactional speculative apply (E4).
- Generated files hand-edited / committed → path allowlist + `--check-clean` (J1).
- Silently-passing validators → golden fixtures (J3).
- Stale ID union making `tsc` lie → regeneration ordering + fail-loud (02 §11; 01 §7 insight).
- Mixed-runtime ambiguity → one-truth rule (D2).

**Beyond-extraction?** Several of these (AI hallucination, readiness misclaims, lying coverage, patch races) are failure modes of a *living intent-management product*, not of a code extractor.

---

## Synthesis — the true scope in one breath

Libar Omni is **not a code-architecture-graph tool; it is a TypeScript-canonical, event-sourced operating system for the entire software-delivery lifecycle** — one `Spec` primitive carrying idea→capability→behavior→rule→NFR→decision→contract→executable example→verified runtime evidence, modeled on two independent axes (abstraction × readiness), extracted by `ts-morph` into one deterministic, provenance-aware graph that is then projected into *multiple consumer surfaces* (an interactive stakeholder HTML Spec Studio, AI context slices/MCP, OpenAPI/LikeC4/JSON-LD, dashboards, traceability and compliance views), governed by a five-tier CI validation gate and a transactional read-write patch-back loop, and ultimately closed against *live operational reality* (OpenTelemetry, SLSA, SBOM) — the whole thing designed first for **humans of every role and AI agents as co-authors and co-consumers**.

### Concerns clearly central here that a pure code-architecture-graph tool would NOT cover

1. **Product/market vision and multi-persona consumption** — PMs, BAs, auditors, execs, and AI agents as designed-for consumers (A1–A3).
2. **Requirements/intent modeling and ideation** — intent, value, risks, assumptions, open questions, capability/initiative-level thinking (B1, B2, G3).
3. **NFR/quality modeling tied to live observability** — measurable targets verified against OTel in production (B3, F2).
4. **The read-write feedback loop** — Spec Studio editing → validated JSON patches → codemod write-back, with lifecycle ops, conflict handling, and AI-proposed changes (E1–E4, H2).
5. **Design-time-intent vs runtime-reality / delivery evidence** — Build/Deployment/Observation/TestRun nodes, claimed-vs-derived readiness, "is this met in prod right now?" (F1–F3).
6. **Governance, lifecycle, and compliance** — readiness gates, ADR/decision lifecycle, SLSA/SBOM/license, audit answerability; change-approval delegated by design (G1–G6).
7. **AI-native authoring and consumption as a design driver** — token-budgeted slices, MCP, GraphRAG, "AI flips review to the human" justifying the whole HTML surface (H1–H4).
8. **Multiple role-native authoring surfaces** — Gherkin equal-canonicity, interactive what-if harnesses, visual-design/accessibility linkage (C1, C4, C5).
9. **Standards interop as a strategic posture** — "the membrane": OpenAPI/AsyncAPI/JSON-LD/SHACL/LikeC4 emit, plus ReqIF/SysML v2/CALM horizons (I1, I3).
10. **Stakeholder collaboration mechanics** — per-PR hosted Studio previews, mobile review, propose/discuss/resolve workflows (A3, L2).
11. **Adoption/change-management strategy and multi-tenant/multi-repo/polyglot expansion** — even where deferred, these are framed as in-scope trajectory, not non-concerns (L3, M).

A narrower principle set derived from a code-architecture/extraction tool would most plausibly capture domains **B4–B5, C2–C3, D1–D2, J1–J4, K1–K2, L1** (graph metamodel, stable IDs, markers, runtime extraction, determinism, validation, dependency rules, tooling config) — and would most plausibly *miss* domains **A, E, F, G, H, I3, C4–C5** (product/persona vision, the edit loop, runtime evidence/governance/compliance, AI-native design, formal-MBSE interop, harness simulation and design/a11y linkage).
