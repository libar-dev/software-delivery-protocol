# Libar Omni — Fundamental Principles &amp; Invariants

*An independent extraction of the "laws" this design is built on, derived solely from the ten concept documents. Each principle is typed (Principle vs Representation/implementation choice), weighted (load-bearing vs supporting), and cross-referenced for tensions. CORE (v1) vs ASPIRATIONAL (later-phase) is flagged throughout.*

A note on method: the docs are unusually disciplined about flagging their own representation choices (the runtime anchor, the storage format, the test stack are all explicitly "one option among several") versus their genuine invariants (the derived-vs-canonical rule, the single primitive, provenance separation). I have followed those self-flags and corrected them only where the docs' rhetoric oversells a choice as a principle or undersells a principle as a choice.

---

## Group A — The single-source-of-truth axioms (the foundation)

### A1. The repository is the canonical store; everything else is derived and regenerable.
- **Statement.** There is exactly one authoritative store — committed source in the repo — and every other artifact (graph, diagrams, dashboards, Spec Studio, OpenAPI, JSON-LD, AI slices) is a pure function of it, never hand-authored or hand-edited.
- **Grounding.** README §"minimum mental model" #4; 00 §3 Statement C; 02 §preamble, §7 Invariant 2; 03 §1; 08 §10.
- **Type.** **Principle.** Asserted as *the* foundational invariant ("Every architectural choice below follows from that rule").
- **Weight.** **Load-bearing.** The whole trust model ("there is no 'is the graph in sync?' question") collapses without it.
- **Tensions.** In direct tension with the Spec Studio being an *editing* surface (D-group); resolved only by the patch-back loop (A4). Also constrains C-group: the DSL must be statically extractable *because* the graph must be a deterministic function of source.

### A2. The graph is the single read model; all consumers read from it and only it.
- **Statement.** A single canonical graph is the sole input to every projection, validator, and query; no consumer reads source directly or maintains a parallel model.
- **Grounding.** 00 §3C; 02 §1 (Layer 3), §7 Invariant 1; 03 §1 ("The graph is the *single* thing all other layers consume"); 08 §10.
- **Type.** **Principle.**
- **Weight.** **Load-bearing.**
- **Tensions.** Note: extraction-orchestration code (the extractors that *build* the graph) necessarily reads source — so "read only the graph" is a rule for *downstream* consumers, not for the pipeline that produces the graph. The docs state this implicitly (Layer 2 reads Layer 1; Layer 4 reads Layer 3).

### A3. Derivation must be deterministic (byte-identical given identical inputs).
- **Statement.** Both derivation steps are reproducible: graph = f(source + pinned overlay inputs) and projections = f(graph), with stable ordering and disabled non-determinism (timestamps, etc.), enforced by `--check-clean` drift gates.
- **Grounding.** 02 §7 Invariants 1 &amp; 2 ("specs sorted by ID, edges by `(from,type,to)`"), §9 (`projections --check-clean`); 06 §preamble ("same inputs → same outputs"), §5; 07 §2 ("Reproducible").
- **Type.** **Principle.**
- **Weight.** **Load-bearing.** Without determinism, "derived" is unfalsifiable and the drift gate cannot exist.
- **Tensions.** Forces purity on Layer 2 (B1) and bans dynamic constructs in the DSL (C2). The `generatedAt`/`configHash` fields in the graph (03 §1) are an explicit, contained exception (metadata, not semantically compared).

### A4. The patch-back loop is the only sanctioned write path from a derived layer to the canonical layer.
- **Statement.** Edits originating in any derived surface (Studio UI, AI agent) become repository changes *only* by passing through a validated, structured patch that is checked and then materialized into source by codemod — direct edits to derived artifacts or unmediated writes to source are not recognized as real updates.
- **Grounding.** README slogan &amp; #4; 00 §2.6; 02 §2, §7 Invariant 3; 07 §6 (full walkthrough); 08 §10.
- **Type.** **Principle** (the *existence* of a single mediated write path). The patch *format* (RFC-6902 + custom ops) is a Representation choice (06 §9.1).
- **Weight.** **Load-bearing.** It is the named bridge that reconciles A1 (TS is canonical) with D1 (HTML is an editing lens); the docs say without it the whole "specs as code + HTML as lens" claim is indefensible.
- **Tensions.** Resolves A1↔D1. Constrains AI (no direct write path — G3).

### A5. Patch application is transactional: validate the speculative result before any source is touched.
- **Statement.** A patch is applied to an in-memory clone and fully re-validated first; only if it passes is source modified, and the rebuilt graph is asserted to match the speculative one — no half-applied or inconsistent intermediate states.
- **Grounding.** 02 §4.2; 06 §9.2 (steps 1–8); 07 §6.3.
- **Type.** **Principle** (transactional safety). The conflict-detection mechanism (`baseGraphHash` / 409-style) is a Representation choice.
- **Weight.** **Supporting** (the loop could exist without strict transactionality, but safety would degrade; the docs treat it as a hard requirement of the loop).
- **Tensions.** None internal; it is what makes A4 trustworthy.

---

## Group B — The pipeline architecture

### B1. The extraction + validation pipeline is pure (no state, no IO beyond reading source and writing graph/reports).
- **Statement.** Layer 2 is pure functions over Layer 1; it has no database, no remote calls, no side effects beyond emitting the graph and validation report.
- **Grounding.** 02 §1 (Layer 2), §preamble of 06; 06 §preamble.
- **Type.** **Principle.**
- **Weight.** **Load-bearing** (it is the mechanical guarantee behind A3 determinism).
- **Tensions.** Overlay/evidence ingestion reads *external* artifacts (dep-cruiser JSON, OTel) — the docs preserve purity by requiring those inputs be *pinned* (A3, 02 §7 Invariant 2: "+ pinned overlay inputs"), turning an impure source into a deterministic file input.

### B2. Layered/tiered enforcement — never force one mechanism to do all the checking.
- **Statement.** Correctness is split across tiers by *kind* — types for shape, schema for payload structure, graph validators for cross-file semantic invariants, arch tests for boundaries, custom rules for policy — rather than contorting any single layer (notably the type system) to carry all of it.
- **Grounding.** README §"out of scope" (reject `ts-patch` failing tsc); 00 §"out of scope"; 02 §12; 06 §6 (the five tiers + explicit motivation).
- **Type.** **Principle.** The *count* of tiers (five) and the specific tool per tier (Zod/Ajv/ts-arch/ESLint) are Representation choices.
- **Weight.** **Load-bearing** (a stated organizing principle of the whole validation design).
- **Tensions.** Directly informs B3 (the types/completeness split).

### B3. Types describe shape; validators decide completeness. (The shape/completeness separation.)
- **Statement.** The static type system encodes only structural shape (all facets optional); whether a thing is *complete enough* for its claimed state is a separate, validator-enforced property — never encoded in conditional types.
- **Grounding.** 01 §1.1 (★ Insight: "types for shape, validators for completeness"); 02 §preamble; 06 §6.1.
- **Type.** **Principle** (a deliberate, repeatedly-asserted separation). Strongly tied to representation (TypeScript) but the *separation itself* is the durable invariant.
- **Weight.** **Load-bearing** for the whole readiness model (E-group).
- **Tensions.** A consequence of B2; enables the two-axis model (E2) to move freely without type gymnastics.

### B4. The graph is flat (arrays of nodes and edges); hierarchy is expressed as edges, never nesting.
- **Statement.** Containment and hierarchy are modeled with `contains`/`belongsTo` edges over a flat node/edge list, not by nesting nodes inside nodes.
- **Grounding.** 03 §1, §12 (first anti-pattern: "Nesting nodes inside other nodes — forbidden").
- **Type.** **Representation/implementation choice** framed as a hard rule ("the metamodel forbids"). It is a chosen serialization shape (justified by uniform querying + cheap diffs), not a conceptual necessity.
- **Weight.** **Supporting.** Swappable in principle (a nested model could exist), but the docs treat it as non-negotiable for query/diff uniformity.
- **Tensions.** Some denormalization is allowed for convenience (e.g., `SpecPackNode.specs[]` duplicates `contains` edges to preserve author order — 03 §2.2), a deliberate, bounded exception.

### B5. Builds are incremental but the cache is itself regenerable (never authoritative).
- **Statement.** Per-file hashing + cached fragments make warm builds fast, but the cache is a derived, throwaway artifact CI may discard for cold/reproducible builds.
- **Grounding.** 02 §5 (esp. §5.3 "The cache is regenerable"); 06 §2.4, §10.
- **Type.** **Representation/implementation choice** (performance mechanism). Caching strategy (SHA-256 manifest, `tsbuildinfo`, SQLite daemon later) is explicitly swappable.
- **Weight.** **Supporting.**
- **Tensions.** Subordinate to A1/A3 — the cache must never become a source of truth.

---

## Group C — Authoring &amp; the DSL

### C1. One primitive — the `Spec` — covers every durable delivery artifact; maturity is required completeness, not a change of artifact type.
- **Statement.** A single object shape (`Spec`) carries idea, capability, behavior, rule, NFR, contract, design binding, executable example, and verified evidence; refinement is enrichment of the same identified object, never migration into a different artifact (which loses information).
- **Grounding.** README §"Why" #6, §"minimum mental model" #1; 00 §3A; 01 §1, §6 ("the cardinal authoring rule"), §9 ("smallest closed set"); 08 §10.
- **Type.** **Principle.** *The* central reframing of the design ("the most important reframing in the input discussion"). The concrete field set is a Representation choice; the "one primitive, enrichment not conversion" thesis is the principle.
- **Weight.** **Load-bearing.** The entire value proposition rests on collapsing the requirement→implementation→test pipeline into one primitive.
- **Tensions.** Qualified by C5 (some things are deliberately *not* Specs and never become primitives — process state, RBAC). Tension with the graph having many *node kinds* (D-group): the authoring primitive is singular, but the extracted graph is heterogeneous.

### C2. Spec authoring must be statically extractable (deterministic data, no runtime constructs).
- **Statement.** Spec/marker source is restricted to static, side-effect-free literals (no loops, conditionals, computed IDs, interpolated template literals, IO, async, or imports of product code) so a static analyzer can reify it deterministically; dynamic generation, if needed, happens at design time via codemod, not at runtime.
- **Grounding.** 01 §7.2 ★ Insight; 02 §11 (mitigation); 04 §1.2, §1.6, ★ Insight ("treat as a JSON file that TypeScript validates"); 06 §2.2 (the allowed-expression table).
- **Type.** **Principle** (the requirement to be statically extractable). The specific allowed-grammar and the choice of `ts-morph` are Representation choices.
- **Weight.** **Load-bearing.** This is the precondition for A3 determinism on the authoring side.
- **Tensions.** Constrains DSL ergonomics — the docs accept a *less expressive* authoring surface in exchange for extractability. A single non-static expression degrades gracefully (warn + skip that property, rest still extracts — 06 §2.2), a deliberate robustness rule.

### C3. Stable, namespaced, human-readable IDs are the load-bearing linkage; code and specs are linked by ID-in-strings, never by import edges.
- **Statement.** Every node has a globally-unique, refactor-stable, namespaced, lint-able string ID; the binding between intent (specs) and implementation (code) is carried by these IDs, not by TypeScript import relationships, so either side can be refactored freely.
- **Grounding.** README §"minimum mental model" #1; 01 §7 ("the load-bearing element of the entire graph"); 03 §6; 04 §1.6 ("linked by IDs in strings… the only way the system survives heavy refactoring").
- **Type.** **Principle** (stable, decoupled, ID-based linkage). The *grammar* (`&lt;namespace&gt;:&lt;dotted.path&gt;#&lt;sub&gt;`) and namespace list are Representation choices (03 §6).
- **Weight.** **Load-bearing.**
- **Tensions.** Creates a referential-integrity problem (typos in strings) that C4 exists to solve. ID freezing after `bound` (03 §6.3) is a sub-rule that interacts with No-supersede-in-read-model concerns (see Latent §L4).

### C4. Referential integrity is pushed as early as possible — ideally to compile time via a regenerated ID union.
- **Statement.** Misspelled/dangling ID references should fail at the earliest feasible gate; the system regenerates a literal-union type of all known IDs on every build so cross-file reference errors surface at `tsc` time, with a Gherkin linter closing the same gap for `.feature` tags.
- **Grounding.** 01 §7.2 ★ Insight (regenerate-on-build union; staleness danger called out); 02 §11 (stale-union mitigation); 03 §6.4; 04 §3.5; 06 §4.4.
- **Type.** **Representation/implementation choice** (explicitly "the cleanest practical workaround for TypeScript's lack of structural cross-file knowledge"). The *principle* underneath is "catch broken references as early as possible"; the union-regeneration is one chosen mechanism, and the docs flag its fragility (staleness → "tsc lies").
- **Weight.** **Supporting** (the graph validator catches the same errors at build time; the union is an earlier, optional convenience).
- **Tensions.** Build-ordering dependency (union must regenerate before tsc) is a self-inflicted fragility the docs acknowledge.

### C5. Authoring surfaces are plural and role-native, but each spec has exactly one canonical surface (no mixing per ID).
- **Statement.** Multiple equal-or-ranked input surfaces exist (TS DSL, source markers, annotated Gherkin, harnesses), chosen to fit each persona, but for any given spec ID exactly one surface is canonical; the others are generated/read-only views of it.
- **Grounding.** 04 §preamble (four surfaces, ranked), §3.4 ("we do *not* support mixing… exactly one authoring surface is canonical"); 04 §6 (persona table).
- **Type.** **Principle** (single-canonical-per-ID). The *set* of surfaces and their ranking is a Representation choice; Gherkin's "equal canonicity" is itself a stated choice.
- **Weight.** **Supporting.**
- **Tensions.** Internal tension the docs surface and resolve: Gherkin is "equal-canonicity" (04 §preamble) yet the TS DSL is "the source of truth" (04 §1) — reconciled by per-ID canonical-format config (04 §3.4, `canonicalFormat`).

### C6. Markers are read-only pointers from code to spec — never the reverse, never carrying intent.
- **Statement.** A source-code marker does exactly one thing — bind a code location to a graph ID and its structural bindings (component, satisfies, implements, handles/emits) — and is forbidden from carrying spec-level facets (intent, behavior, readiness, verification); the asymmetry keeps intent centralized.
- **Grounding.** 04 §2 (preamble), §2.4 ("markers are read-only pointers from code to spec, never the reverse"), §7 (the triangulation rule).
- **Type.** **Principle** (the directionality + intent-stays-out-of-code asymmetry). The three marker syntaxes (decorator/JSDoc/const) are Representation choices, explicitly interchangeable.
- **Weight.** **Supporting** (load-bearing for the separation in C1/A1, but the specific marker mechanics are swappable).
- **Tensions.** Open question 9.1 (inline vs centralized semantics) explicitly leaves the *degree* of inline semantics configurable — so this is a default stance, not an absolute.

### C7. Some things are deliberately NOT modeled — scope discipline keeps the primitive set tight.
- **Statement.** Process/PM state (in-sprint, in-review), RBAC, time-series telemetry data, and per-tenant conditional variations are intentionally excluded from the core model; external truths are ingested at the edges, and new primitives are resisted until existing ones provably cannot express something.
- **Grounding.** 01 §9–§10; 00 §7 (non-goals); 02 §12; 06 §14; 08 §9.6 (governance/RBAC lives at Git/CI).
- **Type.** **Principle** (parsimony / scope discipline as an active design value).
- **Weight.** **Load-bearing** (the "understandable graph" claim depends on not letting it sprawl).
- **Tensions.** Several excluded items reappear as aspirational futures (multi-tenant variants — 08 §8.6, §9.5). The exclusion is a v1 stance, not permanent.

---

## Group D — Projections &amp; the human surface

### D1. Generated HTML (the Spec Studio) is the primary human surface; Markdown is a fallback/test-harness consumer.
- **Statement.** The richest human-facing read (and careful-write) surface is interactive generated HTML, chosen over Markdown because Markdown caps out in density and interactivity; the Studio is "read-rich and write-careful."
- **Grounding.** README §"Why" #5, slogan; 00 §3, §9; 07 §1, §preamble, §14.
- **Type.** **Representation/implementation choice** elevated to a product thesis. HTML-over-Markdown is argued, not axiomatic; the underlying principle is "rich, interactive, shareable read surface generated from the graph."
- **Weight.** **Supporting** (the system functions with any projection; HTML is the chosen flagship). It is, however, the product's differentiator.
- **Tensions.** Tension with A1 (HTML is also an *edit* surface) — resolved by A4. Tension with Git diff noise — sidestepped by never committing HTML (A1).

### D2. Projections are sink-agnostic and multi-target; markdown/diagrams/contracts are peers, all functions of the graph.
- **Statement.** The graph fans out to many co-equal projections (Studio, LikeC4, OpenAPI/AsyncAPI, JSON-LD, AI slices, traceability, dashboards, ADR index, Gherkin export), each serving a specific consumer, all regenerated from the one graph.
- **Grounding.** 00 §6; 02 §1 (Layer 4); 07 §5 (all sub-projections); 08 §7 layout.
- **Type.** **Principle** (the read-side is a fan-out of equal projections off one model). Each individual projection is a Representation choice.
- **Weight.** **Load-bearing** for the value proposition (this *is* the output), supporting for any single sink.
- **Tensions.** D1 (HTML primary) sits in mild tension with D2 (all sinks equal) — the docs hold both: equal *mechanically*, ranked *by importance to humans*.

### D3. Web Components (framework-free) are the Studio building blocks, embeddable anywhere.
- **Statement.** The Studio is built from dependency-light custom elements that work standalone in any HTML container, deliberately avoiding framework lock-in.
- **Grounding.** 07 §2 (constraints), §3 + ★ Insight.
- **Type.** **Representation/implementation choice** (explicitly "deliberate," with rationale; alternatives React/Vue/Svelte named).
- **Weight.** **Supporting** (clearly swappable).
- **Tensions.** None.

### D4. The dev-mode and CI surfaces are the same generated artifact (no drift-prone "dev mode").
- **Statement.** `akg watch` serves the *same* generated HTML as CI produces; there is no separate development surface that could diverge from production.
- **Grounding.** 02 §10 (final line); 07 §2.
- **Type.** **Principle** (anti-drift, a corollary of A1/A3 applied to tooling).
- **Weight.** **Supporting.**
- **Tensions.** None.

---

## Group E — The state/maturity model

### E1. Readiness is a claim by the author; validators verify the claim. (Claims are checkable, not trusted.)
- **Statement.** A spec *declares* its readiness; the build refuses to pass if the spec lacks the facets/relations/evidence its claimed readiness requires (`derivedReadiness` vs claimed `readiness` divergence is itself surfaced).
- **Grounding.** 01 §1.4 ("Readiness is a claim. Validators verify the claim."), §8 (per-stage profiles); 03 §2.1 (`derivedReadiness`), §7; 06 §6.3.2 (the profile table).
- **Type.** **Principle.**
- **Weight.** **Load-bearing** for the maturity model's integrity.
- **Tensions.** Profiles are defaults, overridable per team (06 §6.3.2) — the *mechanism* (profiles) is principle; the *thresholds* are config.

### E2. Two orthogonal axes (abstraction × readiness) replace a linear stage pipeline; they move independently.
- **Statement.** A spec's level-of-thinking (abstraction) and its completeness/executability (readiness) are independent dimensions; a high-level capability can be barely-framed while a low-level scenario is fully verified — a linear idea→requirement→implementation pipeline cannot represent this without distortion.
- **Grounding.** README §"minimum mental model" #2; 00 §3B; 01 §1.3–1.4, §5 (the picture).
- **Type.** **Principle.** The specific enum values on each axis are Representation choices.
- **Weight.** **Load-bearing** (the orthogonality is the whole argument against the staged pipeline, and the justification for C1).
- **Tensions.** Note an internal vocabulary inconsistency the docs do not fully reconcile: `SpecKind` (01 §1.2), `SpecAbstraction` (01 §1.3), and `SpecAbstraction` again in README #2 list *different* member sets — a sign these enums are still settling (treat as Representation-in-flux).

### E3. Promotion is monotonic enrichment of one identified object — never artifact conversion or facet-loss.
- **Statement.** Moving up in readiness adds facets to the same ID; a promotion that would require removing facets it should retain is itself an invariant violation (`invalid-readiness-promotion`), and progression is expected but not strictly linear (a child can be born at a higher readiness than its parent).
- **Grounding.** 01 §1.4, §6 (enrichment vs refinement), §8; 06 §6.3.4.
- **Type.** **Principle** (enrichment-not-conversion; a corollary of C1).
- **Weight.** **Load-bearing.**
- **Tensions.** Refinement (parent stays, children added) coexists with enrichment (same object grows) — both are sanctioned moves; the parent is explicitly *not* deleted when children appear (01 §6, contrast with Latent §L4).

### E4. Pack-level coherence is validated differently from spec-level completeness.
- **Statement.** A `SpecPack` (cluster of related specs) is validated for *coherence* (shared terms defined, membership, no duplicated intent without a relation) rather than for completeness of any individual spec — supporting group-level ideation before drill-down.
- **Grounding.** 01 §3 (esp. the coherence paragraph).
- **Type.** **Principle** (coherence-vs-completeness distinction). `SpecPack` as a primitive is a Representation choice.
- **Weight.** **Supporting.**
- **Tensions.** None internal.

---

## Group F — Provenance &amp; the inference boundary

### F1. Three edge/node sources — declared, annotation, inferred — are never collapsed; every edge carries provenance.
- **Statement.** Each graph relation records whether it was explicitly declared (in specs/arch), bound by an in-code annotation, or structurally inferred by an extractor; the three are kept strictly distinct and every edge is provenance-tagged.
- **Grounding.** README §"minimum mental model" #3; 00 §3C; 03 §4 ("one of the load-bearing design decisions"), §5.
- **Type.** **Principle.** Explicitly "one of the most-debated… load-bearing design decisions."
- **Weight.** **Load-bearing.**
- **Tensions.** Tension with usability (more layers = more complexity), accepted deliberately.

### F2. Intent is never inferred — inference is assistive, never authoritative; promotion of an inferred edge is a human act.
- **Statement.** Static analysis recovers structural/dataflow facts but *intent* (this implements that, this decision constrains those) must be explicitly authored; inferred edges carry confidence, are shown differently, never trigger validator errors alone, and can only become "declared" through an explicit human-approved patch — never silent promotion.
- **Grounding.** 00 §7 (non-goal: never confuse low-confidence inferred with declared), §"out of scope" in README; 03 §4.3 + ★ Insight; 08 §9.3 ("never authoritative" — "a design boundary, not a temporary limitation").
- **Type.** **Principle.** Explicitly flagged as a permanent boundary, not a v1 limitation.
- **Weight.** **Load-bearing** for trustworthiness (declared edges override inferred ones in projections).
- **Tensions.** Trace-link auto-recovery is permitted only as a *suggestion engine* (aspirational, 08 §8.6) — strictly bounded by this principle.

### F3. Declared &gt; annotation &gt; inferred (and decorator &gt; marker-const &gt; JSDoc &gt; inferred) — a fixed authority/precedence order.
- **Statement.** When sources conflict, a deterministic precedence resolves them (declared business intent outranks in-code annotation outranks structural inference; among marker syntaxes, decorator outranks constant outranks JSDoc), with genuine conflicts surfaced as errors rather than silently merged.
- **Grounding.** 03 §4.1–4.3; 06 §3.4 (precedence chain), §4.1 (merge rules; strict fields must match exactly).
- **Type.** **Representation/implementation choice** (a specific ordering) resting on the F1/F2 principle.
- **Weight.** **Supporting.**
- **Tensions.** None.

### F4. Evidence is extractor-populated, never authored; author-touching it is a violation.
- **Statement.** The `evidence` facet (and `verification.lastResult`/`lastRunAt`) is the one facet the pipeline writes from CI/runtime outputs; humans don't author it, validators read it, and hand-editing it in source warns/fails because it drifts from CI reality.
- **Grounding.** 01 §2.9, §8 Stage 7; 03 §12 (anti-pattern: "Mutating evidence facets… drifts from CI reality"); 07 §6.5 (evidence fields not patchable).
- **Type.** **Principle** (evidence is observed, not declared — a clean separation of "claim" from "did it actually happen").
- **Weight.** **Load-bearing** for the verified-state integrity (E1) and the design↔runtime bridge (H-group).
- **Tensions.** A specific kind of "derived data living inside an otherwise-canonical source object" — the docs handle it by making those fields read-only in the patch loop.

---

## Group G — AI as a first-class but gated consumer

### G1. Structured graph context beats raw text for AI; the system is a *producer* of structured context.
- **Statement.** Agents are served typed, self-contained graph neighborhoods (AI slices: nodes, edges, source files, open questions, findings) rather than concatenated source, because a structured graph is dramatically more useful to an LLM.
- **Grounding.** README §"Why" #3; 00 §1, §4 (AI persona), §5, §9; 07 §5.5, §13.
- **Type.** **Principle** (the design's differentiating thesis vs AI coding tools — 00 §8: "consumers of context, not producers").
- **Weight.** **Load-bearing** for the stated differentiating value ("biggest for AI-augmented teams").
- **Tensions.** None; aligns with A2.

### G2. AI slices are bounded, self-contained, and pre-sliced (not whole-repo dumps).
- **Statement.** Context for agents is delivered as small (≤32k-token), self-contained slices with inlined glossary/source/findings, replacing "throw the whole repo in the prompt."
- **Grounding.** 01 §2.4 (self-contained glossary); 07 §5.5; 08 §9.8.
- **Type.** **Representation/implementation choice** (slicing presets, token budget) on top of the G1 principle.
- **Weight.** **Supporting.**
- **Tensions.** GraphRAG-style retrieval for huge graphs is explicitly v2 (07 §13.3).

### G3. AI has no direct write path; all AI output is gated by validation and human review.
- **Statement.** Agents propose patches but cannot write source directly; the MCP server is read-only, every AI-proposed change surfaces as a reviewable diff, and patches are provenance-tagged `proposedBy: ai` and must pass validation before apply.
- **Grounding.** 07 §4 Pattern 2 ("browser never has API keys… never runs untrusted output without approval"), §13.1 ("MCP server is read-only"); 08 §9.8.
- **Type.** **Principle** (a corollary of A4 applied to AI).
- **Weight.** **Load-bearing** for safety claims.
- **Tensions.** "MCP-first AI agents integrated with the patch loop end-to-end" (08 §8.6) is aspirational but stays inside this gate.

---

## Group H — Runtime grounding &amp; delivery evidence

### H1. The architecture graph is *read from* live runtime composition, not separately authored.
- **Statement.** The dependency/architecture graph is extracted from the wiring the team would build anyway (Fastify routes → `Route` nodes, Effect Layers / DI registrations → `Layer` nodes with provides/requires), so the diagram is a function of live code, not a parallel drawing — this is what separates the system from documentation generators.
- **Grounding.** 02 §6 + ★ Insight; 05 §preamble, §3.1, §10.
- **Type.** **Principle** (the "grounded in live wiring" thesis). *Which* runtime tech is read is a Representation choice (H3).
- **Weight.** **Load-bearing** for the differentiation claim (vs Structurizr/LikeC4-as-authored).
- **Tensions.** Requires the marker/`define*` conventions (C6) so the extractor can recognize the wiring.

### H2. One runtime truth — exactly one mechanism owns runtime composition (never two as first-class).
- **Statement.** Choose exactly one of Effect Layers / Awilix / manual factory as the canonical composition mechanism; running two as first-class makes the extracted graph unreliable (two simultaneously is permitted only as a *transient* migration state, with warnings).
- **Grounding.** README §"minimum mental model" #5; 00 §10; 05 §1, §6 (migration), §9.
- **Type.** **Principle** (single-runtime-truth). *Which* one (Effect vs Awilix vs custom) is an explicit Representation choice with a decision matrix.
- **Weight.** **Load-bearing** for graph reliability of the runtime sub-graph.
- **Tensions.** Migration explicitly violates it temporarily (05 §6) — a bounded, warning-flagged exception.

### H3. Effect Layers preferred / Fastify as the HTTP edge — the recommended anchor is a *choice*, not a requirement.
- **Statement.** The recommended pairing is Fastify (HTTP edge only) + Effect Layers (because Effect's typed `R` parameter makes runtime requirements statically extractable and turns the *interface*, not the implementation, into the unit of reasoning); Awilix and manual wiring are supported, lower-power alternatives.
- **Grounding.** 00 §10 ("not requirements… assumed baseline"); 05 §2, §3, §4, §5.2 ★ Insight, §9, §10; 02 §12 (no Effect migration required).
- **Type.** **Representation/implementation choice.** Repeatedly and explicitly flagged ("substitutes all work; the extractor needs adapter modules"). The deeper principle it serves is H1 (extract from live wiring) + "interface as unit of reasoning" (which Effect realizes best but is itself arguably a sub-principle).
- **Weight.** **Supporting** (swappable by design via adapters).
- **Tensions.** The docs' enthusiasm for Effect risks reading as a principle; they are careful to keep it a recommendation. Same for the default test stack (Vitest/Cucumber/Playwright), repo shape (pnpm monorepo), observability (OTel) — all stated as assumed baselines, not requirements (00 §10).

### H4. Delivery evidence is ingested via open standards, opt-in, storing pointers not payloads.
- **Statement.** Runtime/supply-chain evidence (OTel, SLSA, CycloneDX, Cucumber/Vitest/Playwright reporters, GitHub attestations) is mapped to graph nodes through well-defined external standards rather than bespoke formats; ingestion is opt-in, and the graph stores *references/summaries* (URIs, hashes, top-N), never the full telemetry/SBOM data.
- **Grounding.** 00 §6; 01 §10 (time-series stays out); 03 §2.15; 06 §11; 08 §2, §4, §5 ("keeps the graph small while preserving the link").
- **Type.** **Principle** (pointers-not-payloads + standards-not-bespoke + opt-in). The *specific* standards are Representation choices.
- **Weight.** **Supporting** for v1 core (evidence is largely Phase 4); **load-bearing** for the long-term "is this NFR met in prod right now?" value claim.
- **Tensions.** This is mostly ASPIRATIONAL (Phase 4); v1 ships only the test-result side.

### H5. NFRs must be machine-measurable to claim maturity (target + measurableBy bind design intent to runtime evidence).
- **Statement.** A quality constraint claiming `specified`+ must carry a parseable, machine-readable target ("p95 &lt; 300ms", not "fast enough") and, at higher readiness, a `measurableBy` pointer, so the same NFR can be checked against ingested observations (`nfr-violated`).
- **Grounding.** 01 §2.3, §8 Stage 3; 06 §6.3.5 (`nfr-needs-target`, `nfr-target-format`, `nfr-needs-measurable`); 08 §4.1.
- **Type.** **Principle** (NFRs must be falsifiable/measurable). Threshold-format regex is Representation.
- **Weight.** **Supporting** (load-bearing only for the NFR-evidence bridge, which is aspirational).
- **Tensions.** The runtime-side enforcement is Phase 4; the design-time `target` requirement is v1.

---

## Group I — Scope, adoption &amp; schema governance

### I1. Schema is SemVer-versioned; the graph self-describes its version and consumers refuse incompatible majors.
- **Statement.** The graph schema is versioned with explicit PATCH/MINOR/MAJOR semantics; every graph carries its `schemaVersion`; consumers (Studio) refuse unsupported majors; major upgrades are themselves applied as large patches via `akg migrate`.
- **Grounding.** 03 §1, §10; 02 §11 (version embedded, verified by Studio).
- **Type.** **Principle** (versioned, self-describing contract) + Representation (SemVer specifics).
- **Weight.** **Supporting.**
- **Tensions.** Note: this is a forward/backward-compatibility *embrace* (migrations, version negotiation) — contrast sharply with the harness repo's No-BC doctrine (see Latent §L5; this is a divergence, not a contradiction within the corpus).

### I2. Prove the loop on one bounded context first; every phase is independently valuable; strictness ratchets.
- **Statement.** Adoption is staged — start with a single bounded context (Order Management), each MVP→v4 phase delivers standalone value, and a `--lenient` mode lets teams downgrade failures to warnings until confidence grows.
- **Grounding.** README §"out of scope"; 00 §6; 08 §8 (phased roadmap), §9.10.
- **Type.** **Principle** (incremental, value-at-each-phase adoption) — and the clearest CORE/ASPIRATIONAL delineation in the corpus.
- **Weight.** **Supporting** (adoption strategy, not architecture).
- **Tensions.** None.

### I3. Layer the system *with* the ecosystem, not against it — be the membrane, not a replacement.
- **Statement.** The system ingests adjacent tools' outputs (LikeC4 models, OpenAPI, ADR markdown, Cucumber Messages, OTel, SBOMs) and emits projections back into their formats; it is explicitly not designed to replace Jira/Figma/LikeC4/OpenAPI but to link them.
- **Grounding.** 00 §7 (non-goals), §8 ("be the membrane"); 02 §12; 07 §5.
- **Type.** **Principle** (interoperability-over-replacement as a positioning invariant).
- **Weight.** **Supporting** (positioning/scope, but it shapes many design choices — JSON-LD, x-akg-* fields, MCP).
- **Tensions.** None.

### I4. Defer scale infrastructure until measured pain (file-based graph until traversal scale demands a DB).
- **Statement.** A repo JSON file plus in-memory graph is the canonical store until measured traversal pain (~10k+ nodes) justifies a property-graph mirror; bespoke transformers, graph DBs, and IDE plugins are deferred, not designed-in.
- **Grounding.** README §"out of scope"; 02 §12; 08 §9.2, §9.7.
- **Type.** **Principle** (YAGNI / defer-until-measured as an active stance). The specific thresholds are Representation.
- **Weight.** **Supporting.**
- **Tensions.** Schema is *designed* to map cleanly to property graphs later (08 §9.2) — deferral with forethought.

---

## CORE vs ASPIRATIONAL — quick map

- **CORE (v1 / Phases 0–2, treated as the defensible minimum):** A1–A5, B1–B5, C1–C7, D1–D4 (Studio v0 read-only in Phase 1; patch loop Phase 2), E1–E4, F1–F4 (test-result evidence only), G1/G2 (static slices; MCP prototype Phase 2), H1/H2/H3 (runtime extraction; Effect `R` analysis is Phase 3), I1/I2/I3/I4.
- **ASPIRATIONAL (Phase 3–5+):** Deep Effect `R`-parameter static completeness checking (Phase 3), full architecture-rigor tier (Phase 3), the entire delivery-evidence overlay H4/H5-runtime-side (Phase 4: SLSA, SBOM, OTel pull/push, `nfr-violated`), MCP-first end-to-end AI (G3 fully realized), GraphRAG retrieval, multi-language extractors, graph-DB mirror, SysML v2 / CALM interop, VS Code extension, trace-link recovery (assistive only, bounded by F2), multi-tenant variant specs, cross-repo federation.

---

## Latent invariants — assumed but never stated as principles

These are inferable from how the system is built but are not articulated as explicit "laws":

- **L1. Identity is the universal primary key across all subsystems.** Every reconciliation — merge, validate, query, patch, codemod — keys on the string ID. The entire design *assumes* IDs are unique and stable enough to be the join key everywhere, yet "ID is the universal join key" is never stated as such; it is implied by C3/C4 plus the merge rules (06 §4.1) and the triangulation reconciliation (04 §7).

- **L2. Conflicts surface as errors; the system never silently picks a winner across provenance/merge boundaries.** F3 gives a precedence order, but the deeper assumed invariant is "ambiguity is loud" — `node-merge-conflict`, `marker-conflict`, `duplicate-node-id`, `patch-conflict` all *fail* rather than auto-resolve. The design assumes determinism is preserved by *rejecting* ambiguity, not by tie-breaking it. Stated only as scattered validator rules, never as a principle.

- **L3. Graceful partial extraction — one bad input never poisons the whole build.** A non-static expression drops one property and keeps the rest (06 §2.2); an unresolved reference still serializes with a sentinel (06 §4.2). The assumed invariant "the pipeline degrades locally, not globally" is a real design value, never named.

- **L4. The read model carries live state, but history (supersedes, ADR status, ID-freeze) is partially modeled *in* the graph — and the docs never resolve whether that's intended.** This is the sharpest latent tension. The design keeps `supersedes` edges (01 §4, 03 §3), ADR `status: deprecated|superseded` (03 §2.4), `deprecated-decision-applied` validators (06 §6.3.4), ID-freeze-after-bound with mandatory supersedes (03 §6.3), and parent-specs-retained-after-refinement (01 §6). It simultaneously says "history lives in git" is *not* its model — it has no such doctrine; it actively models supersession. So the latent assumption is: **superseded/deprecated state is live read-model state, not git history.** (This is a direct, notable divergence from the harness repo's doctrine — useful to flag for a successor design, but it is what *these docs* assume.)

- **L5. Backward compatibility is embraced, not refused.** Schema SemVer, `akg migrate`, version negotiation, and `--lenient` ratcheting all assume the system *will* carry compatibility machinery. There is no "delete don't alias / No-BC" stance anywhere; the opposite is assumed. Never stated as a principle, but pervasive.

- **L6. Single-repo (per graph) is assumed.** IDs are "globally unique *within the repo*" (01 §7); cross-repo consistency is explicitly "their integration problem" (06 §14). The whole graph assumes a repo boundary as the universe of discourse; cross-repo federation is a far-future aspiration (08 §8.6). The repo-as-world assumption is foundational but unstated as such.

- **L7. The author is trusted for intent; the machine is trusted for facts.** Across the design, *intent* (relations, satisfies, readiness claims) is human-authored and taken at face value until a validator can check it, while *structural facts* (calls, imports, R-params, test results) are machine-derived and distrusted as intent. This "division of epistemic labor" (humans assert meaning, machines assert structure, and the two are never confused) underlies F1/F2/E1/F4 but is never named as a single principle.

- **L8. Generated output is disposable and must be safely deletable at any time.** `/generated/` is gitignored and regenerable; the design assumes any consumer can blow it away and rebuild. The one carve-out (`spec-ids.d.ts` consumed by tsc, 08 §7) is the exception that proves the rule — and is itself flagged as a fragility (C4).

- **L9. A spec's facet set is open for additive growth but closed for the top-level shape.** The `Spec` outer shape is "intentionally minimal," variability pushed into facets/enums/profiles (01 §1.1). The assumed invariant: new capability arrives by adding facets or enum members (MINOR schema bumps), almost never by changing the top-level envelope — i.e., the envelope is a stability contract while facets are the extension surface. Implied by §10 versioning + §9 "smallest closed set," never stated.

---

## Summary of the load-bearing core (if a successor keeps only the essentials)

The design stands or falls on roughly eight principles: **A1** (canonical repo, everything else derived), **A2/A3** (single deterministic read-model), **A4** (single mediated write path), **C1** (one enrichable primitive), **C2/C3** (statically-extractable, ID-linked authoring), **B3** (shape vs completeness), **E1/E2** (verified claims on two orthogonal axes), and **F1/F2** (provenance separation + inference-is-never-authoritative). Everything else — the runtime anchor, the HTML surface, the tier count, the tooling, the evidence overlay — is presented by the docs themselves as a swappable representation or a later phase.
