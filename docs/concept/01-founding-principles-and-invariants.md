# 01 — Founding Principles & Invariants

This is the backbone of the design. It states the load-bearing laws, and for each one is explicit about two things:

- **Principle** vs **Representation** — is this a law the design stands or falls on, or one chosen mechanism among several?
- **CORE / MVP** vs **ASPIRATIONAL** — is it in the first slice, or designed-for and deferred?

> The Founding Principle — One Graph — is stated in the [README](./README.md) and outranks everything here. The principles below are how that doctrine decomposes.

---

## The load-bearing core (the ~10 laws)

If a successor kept only the essentials, the design stands or falls on these. Each is a **Principle**; each is **CORE**.

### P1 — Canonical repo, everything else derived
**Principle · CORE.** There is exactly one authoritative store: committed source in the repo. Every other artifact — the graph, diagrams, dashboards, views, any export — is a pure function of it, never hand-authored or hand-edited. There is no "is the graph in sync?" question because the graph is *defined* as a function of the repo. *(Founding Principle #1, #2, #4.)*

### P2 — One derived read model
**Principle · CORE.** A single canonical graph is the sole input to every projection, validator, and query. No consumer reads source directly or maintains a parallel model. (The extractor that *builds* the graph reads source — that is the producer, not a downstream consumer.)

### P3 — Deterministic derivation
**Principle · CORE.** Derivation is reproducible: `graph = f(repo)` and `view = f(graph)`, with stable ordering (specs sorted by ID, edges by `(from, type, to)`) and non-determinism (timestamps, hashes) excluded from the semantic comparison. Delete `generated/` and rebuild byte-identically. Without determinism, "derived" is unfalsifiable and the no-second-store rule cannot be enforced.

### P4 — One enrichable primitive
**Principle · CORE.** A single object shape — the `Spec` — carries every durable delivery artifact: idea, capability, behaviour, rule, NFR, decision, contract, executable example, verified evidence. Refinement is *enrichment of the same identified object*, never migration into a different artifact type (which loses information). This is the central reframing of the whole design. *(The concrete field set is Representation; the "one primitive, enrich not convert" thesis is the Principle.)* See [`02-core-model.md`](./02-core-model.md).

**Corollary — significance governs detail, not a tier.** Because refinement is enrichment of one object — not promotion through fixed stages (idea / candidate / plan / design / …) — a spec carries detail only where the work is *architecturally significant or genuinely novel*. The Nth instance of an established shape (a CRUD endpoint, a standard codec, a barrel) earns a **reference, not a re-derivation**; padding a spec to "fill a level" destroys signal and is pure cleanup debt. Readiness (P8) is a **claim about completeness, checked by validators — never a quota of artifacts to produce.** Fixed tiers pressure an author to fill the tier rather than the need — AI authors especially, which replicate the prevailing detail level even where it does not fit. *Enrich what matters; reference what is standard; pad nothing.*

### P5 — Statically-extractable authoring
**Principle · CORE.** Spec and marker source is restricted to static, side-effect-free literals — no loops, conditionals, computed IDs, interpolated IDs, IO, async, or imports of product code — so a static analyzer reifies it deterministically. Treat a spec file as "a JSON file that TypeScript happens to validate." This is the precondition for P3 on the authoring side. *(The specific allowed grammar and the choice of `ts-morph` are Representation; the requirement to be statically extractable is the Principle.)*

### P6 — Identity is the universal join key
**Principle · CORE.** Every node has a globally-unique (within the repo), refactor-stable, namespaced, human-readable string ID. Specs and code are linked by **ID-in-strings**, never by TypeScript import edges — so either side can be refactored freely. Every reconciliation — merge, validate, query, trace — keys on that string ID. *(The ID grammar `<namespace>:<dotted.path>#<sub>` and the namespace list are Representation; ID-as-universal-key is the Principle.)*

### P7 — Shape vs completeness
**Principle · CORE.** The static type system encodes only structural *shape* (all facets optional). Whether a thing is *complete enough* for its claimed state is a separate property, decided by validators — never encoded in conditional types. "Types describe shape; validators decide completeness." This is what lets the two axes move freely without type gymnastics.

### P8 — Verified claims on two orthogonal axes
**Principle · CORE.** A spec carries two independent dimensions: **abstraction** (level of thinking) and **readiness** (completeness / executability). They move independently — a high-level capability can be barely framed while a low-level scenario is fully verified. A linear idea→requirement→implementation pipeline cannot represent this. And: **readiness is a claim by the author; validators verify the claim** — the build refuses if a spec lacks the facets, relations, or evidence its claimed readiness requires. *(The orthogonality and the claim-is-checked rule are the Principle; the specific enum members are Representation — see `02`.)*

### P9 — Provenance is never collapsed
**Principle · CORE.** Every edge and node records whether it was **declared** (explicit in specs/arch), **annotation** (bound by an in-code marker), or **inferred** (structurally derived by an extractor). The three are kept strictly distinct, forever. Every edge carries its provenance. *(Founding Principle #3. The precedence ordering among them is Representation; the never-collapse rule is the Principle.)*

### P10 — Inference is never authoritative
**Principle · CORE.** Static analysis recovers structural and dataflow facts, but *intent* — "this implements that," "this decision constrains those" — must be explicitly authored. Inferred edges carry confidence, are shown differently, never trigger validator errors on their own, and can only become "declared" through an explicit human act — never silent promotion. This is a permanent design boundary.

**Corollary — the two-surface rule.** The inferred layer may exist as a *mechanical substrate*: a derived, language-server-like import/symbol graph used for **impact and curation-*assist* only** (blast-radius, find-all-usages, propose-candidates, flag-unambiguous-drift). It is **never** used to derive or "densify" the authored architecture. Divergence between the curated graph and the import graph is **curation, not drift** — a sparse curated selection of the mechanical firehose is correct by design. The substrate is a *derived structure, not a competing read model*, so it does not breach Founding Principle #1. See `06` §2.

---

## The epistemic boundary — who is trusted for what

**Principle · CORE.** There is a clean division of epistemic labour, and the two halves are never confused:

- **Humans assert intent.** Relations, `satisfies`, readiness claims, decisions — authored and taken at face value until a validator can check them.
- **Machines assert structure.** Calls, imports, route wiring, test results — derived and distrusted as *intent*.

P9 and P10 are corollaries of this boundary. So is the rule that **evidence is observed, not declared**: any `evidence` a spec carries is written by the pipeline from observation, never authored by hand — hand-editing it is a violation because it drifts from reality. *(In the MVP this is structural only — a verifying spec exists; test run results are not ingested, they are CI's. The point stands: "did it actually happen" is structurally separate from "what we claim should happen.")*

---

## Git is the event log

**Principle · CORE.** This follows directly from **Founding Principle #5**: *git history IS the event log; the graph and all views are projections of the repo at a commit.*

> **History and prior states live in git. The graph is the projection of the current repo at a commit, and carries no heavy historical or superseded bookkeeping as live state.**

Concretely:

- **No live "deleted/superseded" state in the graph.** When a spec is removed or replaced, it is gone from the current repo and therefore gone from the current graph. To see what it used to say, check out the prior commit and regenerate. `git log` *is* the lifecycle history; the graph never reimplements it.
- **No graph-wide change history, no audit trail in the graph.** "Who changed what when" is `git blame` / `git log`, not graph state.
- **No ID-freeze-after-`bound` machinery.** Stable IDs (P6) already survive refactors; renaming an ID is a repo edit that git records. There is no freeze-and-supersede subsystem.
- **Refinement does not retain a "superseded parent" as ghost state.** A parent spec refined into children is retained only if it still expresses current truth (architecture, AI context, roadmap framing) — i.e. because it is *present in the current repo*, not because the graph is bookkeeping its history.

### The one kept forward-pointer

One narrow forward-pointer is kept, and only because it expresses **current** intent, not history:

- An **ADR/decision spec may declare that it supersedes another** (`supersedes: "adr:006-..."`). This is a statement the author is making *now* about a relationship between two decisions that *both still exist in the repo as records*. It is current declared intent, identical in kind to `refines` or `dependsOn` — not the graph storing a timeline.

If a relationship can be reconstructed from git, it does not belong in the graph as live state. If it is a current, authored assertion about two things present in the repo, it may. That is the line.

---

## Supporting invariants

These named invariants sharpen the design.

### L2 — Ambiguity is loud
**Principle · CORE.** The system never silently picks a winner across a provenance or merge boundary. Genuine conflicts — duplicate IDs, marker conflicts, merge conflicts — **fail the build** rather than auto-resolve. Determinism is preserved by *rejecting* ambiguity, not by tie-breaking it. (A deterministic precedence order may resolve *layered* sources — declared over annotation over inferred — but a true contradiction is an error, never a silent merge.)

### L3 — Graceful partial extraction
**Principle · CORE.** One bad input never poisons the whole build. A non-static expression drops that one property and keeps the rest of the spec; an unresolved reference still serializes (with a sentinel) and surfaces as a validation error, rather than aborting the extractor. The pipeline degrades *locally*, not globally.

### L8 — Generated output is disposable
**Principle · CORE.** Everything under `generated/` is gitignored and regenerable; any consumer may delete it and rebuild. A single carve-out — a generated `spec-ids` union type consumed by `tsc` for early referential-integrity checks — is itself a known fragility (it must regenerate before `tsc`, or `tsc` lies), and is *optional*: the graph validator catches the same broken references at build time regardless. Treat the union as a convenience, not a load-bearing gate.

### L9 — The `Spec` envelope is a stability contract; facets are the extension surface
**Principle · CORE.** The outer `Spec` shape is intentionally minimal and changes almost never. New capability arrives by **adding facets or enum members**, not by changing the top-level envelope. The envelope is the stability contract; facets are where the system grows.

---

## Representations explicitly held *as* Representations

These appear in the design and matter, but none is a Principle. Swapping any of them changes *how*, not *what*.

| Representation | The Principle it serves | Status |
|---|---|---|
| `ts-morph` as the extractor | P5 (statically extractable) | CORE |
| The ID grammar `<ns>:<path>#<sub>` and namespace list | P6 (identity is the join key) | CORE |
| Specific marker syntaxes (decorator / JSDoc / marker const) | P9/P10 (declared vs annotation) | CORE |
| Flat node/edge arrays (hierarchy as edges, not nesting) | P2 (one queryable read model) | CORE |
| The enum member sets on each axis | P8 (two orthogonal axes) | CORE — reconciled in `02` |
| Generated `spec-ids` union for compile-time ref checks | early referential integrity | CORE (optional, L8) |
| The runtime anchor (Effect / Awilix / manual wiring) | "read architecture from live wiring" | ASPIRATIONAL |
| HTML / Web Components for the rich view | "rich, shareable read surface from the graph" | ASPIRATIONAL |
| Mechanical substrate (derived import/symbol graph) | P10 corollary (impact + curation-assist) | ASPIRATIONAL (thin version may be MVP — `07`) |
| Typed graph *handle* (method list = docs) as the AI surface | P2/P6 (one read model, agent-facing) | CORE |
| Validation tier *count* and per-tier tooling | "layered enforcement by kind" | partly CORE, partly ASPIRATIONAL (`05`) |
| Runtime-evidence overlay (observations as pointers, not payloads) | design intent vs observed reality | ASPIRATIONAL |
| File-based graph (until traversal scale forces a DB) | "defer scale infra until measured pain" | CORE |

> Note on the runtime anchor: the only **Principle** in this area is *one runtime truth* — don't run two composition mechanisms as first-class, because the extracted architecture sub-graph becomes unreliable. *Which* mechanism (Effect Layers, Awilix, manual factory) is a pure Representation, read by a framework-specific adapter. The MVP does not extract runtime composition at all; it binds code to intent generically. No Effect evangelism, no Awilix migration path, no `R`-parameter analysis in the core — those are aspirational adapter details. **"Complexities like Effect Layers + Awilix are definitely not required."**

---

## CORE vs ASPIRATIONAL — principle map

- **CORE (MVP):** P1–P10, the epistemic boundary, git-as-event-log, L2, L3, L8, L9. The trust model is complete at MVP — determinism, provenance separation, ambiguity-is-loud, and inference-never-authoritative all ship in the first slice, even though the surfaces and overlays on top of them do not.
- **ASPIRATIONAL:** runtime-composition extraction, delivery-evidence overlay, rich projections, AI-slice/MCP tooling, architecture-enforcement tiers, a fuller mechanical substrate, multi-tenant/multi-repo/polyglot. These extend the surface area; none changes the laws above. *(There is no structured patch-back loop — the write path is intent → agent → git; see `06` §4.)*
</content>
