# 00 — Vision & Product Concept

## 1. The problem we are solving

Modern software teams have lost the single source of truth about what they are building, why, and how it actually works.

Typical state of the art:

- **Requirements** live in Jira, Linear, or Notion as free-text tickets that nobody re-reads after sprint planning.
- **Architecture** lives in a Miro board, a slide deck, or a months-stale `architecture.md`.
- **Decisions** live in ADR markdown files that are linked from nowhere and referenced by nothing in code.
- **Acceptance criteria** live in Gherkin `.feature` files that are either executed (and slowly drift from the prose) or unexecuted (and decorative).
- **Tests** live in code but rarely declare *which* requirement they verify.
- **Operational evidence** — build provenance, SBOMs, traces, deployments — lives in CI/CD dashboards that have no link back to design intent.

The seams between these worlds are filled with **prose links** that rot the moment anyone refactors, renames, or moves a file. AI agents working in the codebase inherit this entropy: they read raw source, infer poorly, and confidently produce plans that contradict undocumented constraints.

The cost compounds:

- Onboarding takes weeks because there is no canonical map of the system.
- Refactors are dangerous because nobody can answer *"if I change this, what specs and components break?"* with confidence.
- AI-assisted work is shallow because the model has only raw text, not a structured graph.
- Compliance and audit work is repetitive because evidence is gathered ad hoc each time.

## 2. The thesis

> The codebase is already the most reliable source of truth on a software team. The fix is not *more* documentation outside the codebase — it is *better* structure inside it.

Libar Omni materialises this thesis by:

1. Making **the whole delivery lifecycle authorable as typed TypeScript code**, with the same primitive (`Spec`) covering ideas, capabilities, behaviours, rules, NFRs, contracts, design bindings, executable examples, and verified evidence.
2. Adding **lightweight markers** in product code so the static extractor can bind business intent to actual implementation locations.
3. Running a **`ts-morph`-based extractor** that produces one canonical graph from typed model files, source markers, and inferred structural facts.
4. Validating that graph in CI at multiple tiers (types, schemas, graph invariants, lint rules, architecture rules), so missing trace links, broken IDs, forbidden dependencies, and incomplete maturity transitions fail the build.
5. **Generating every human- or AI-facing view** from the graph: diagrams, traceability matrices, AI context slices, OpenAPI contracts, ADR indexes, dashboards, and especially an interactive **HTML Spec Studio** that lets stakeholders read, simulate, and refine specs.
6. Closing the loop with a **patch-back protocol** so that interactive edits in the Spec Studio (or anywhere else) become validated JSON patches that update the canonical TypeScript spec files.

The result is a **living model** of the system: one place where intent, design, code, tests, decisions, and runtime evidence are all linked.

## 3. The mental model — three statements

### Statement A. *Specs are persistent statements of desired system truth.*

There is no separate "requirement object" vs "design object" vs "test object". There is a `Spec`. It can be **sparse and vague** (an idea with intent and open questions) or **rich and executable** (a Given/When/Then example bound to a Vitest run with passing evidence). The format is stable; the *completeness rules* tighten as the spec matures.

This is the most important reframing in the input discussion. The earlier "Requirement → Implementation → Test" lineage was replaced by a single `Spec` primitive precisely because the lineage forced premature artifact migration: ideas had to "become" requirements, requirements had to "become" tests, and at each transition information was lost. With one primitive that gains *facets*, refinement is enrichment, not conversion.

### Statement B. *Maturity is required completeness, not artifact type.*

Two orthogonal axes:

- **Abstraction**: how high-level the spec is.
  `initiative → domain → capability → feature → rule → scenario → operation → component → contract`
- **Readiness**: how complete, validated, executable, and observed the spec is.
  `sketch → framed → specified → designed → bound → executable → verified`

The two axes move *independently*. A high-level capability can be `framed` (talked about, not specified). A low-level scenario can be `executable` (concrete and runnable). An NFR can be `specified` (target written) but not `executable` (no automated assertion yet). A route contract can be `bound` (mapped to code) but not `verified` (no passing test in last build).

Each readiness level has a **validation profile**: the set of fields and relations the spec *must* have to legitimately claim that readiness. Validators enforce profiles; types describe shape; lint enforces conventions.

### Statement C. *The graph is the truth; everything else is a projection.*

The repository contains:

- Typed delivery model files (`/specs/`, `/arch/`).
- Source-code markers (decorators, JSDoc, marker constants, registered route/layer definitions).
- Test files (Vitest, Cucumber, Playwright).
- Generated, ignored-by-design output (`/generated/`).

The extractor produces `/generated/spec.graph.json` (or equivalent in-memory model). Every other artifact — HTML Spec Studio, LikeC4 diagrams, OpenAPI specs, ADR index, traceability matrix, AI context slices, JSON-LD export — is **derived** from that graph. Derived artifacts are never authored, never edited by humans, never committed by hand. They are regenerated on every build, on every CI run, and on every patch.

This rule is what makes the system trustworthy: there is no "is the graph in sync with the diagrams?" question because the diagrams *are* a function of the graph.

## 4. Who this is for

Libar Omni is designed for teams that share four traits:

1. **TypeScript-heavy.** The TypeScript compiler and ecosystem (`ts-morph`, project references, `satisfies`, branded types, ESLint, `@typescript-eslint`) are load-bearing. Adopting this for a polyglot stack is possible but requires per-language extractors.
2. **Medium-to-high system complexity.** A handful of microservices, a Fastify/Effect monolith with internal domains, or a long-lived SaaS platform with non-trivial business rules — anywhere the cost of architectural drift is already painful.
3. **Already practising some form of explicit modelling.** Teams that write ADRs, draw C4 diagrams, maintain `.feature` files, or document NFRs will adopt this naturally. Teams allergic to all three will resist it.
4. **Working closely with AI agents.** The graph is dramatically more valuable when LLMs and agentic workflows consume it. If you do not use Claude Code, Cursor, or similar, the system still pays off — but its differentiating value is biggest for AI-augmented teams.

The primary personas:

- **Domain engineer.** Authors specs and code in a bounded context. Wants compile-time and CI feedback on incompleteness.
- **Architect.** Defines components, capability boundaries, ADRs, and architecture rules. Wants the graph to enforce them and the diagrams to track reality.
- **Product manager / business analyst.** Reads and refines specs in the HTML Spec Studio. Wants to see open questions, alternatives, examples, and impact previews without learning TypeScript.
- **QA / test engineer.** Authors executable specs (Cucumber, Vitest, Playwright) and tags them with `@spec.*` IDs. Wants traceability from any failing test back to a spec, capability, and owner.
- **AI agent.** Consumes JSON-LD or scoped JSON slices to plan, refactor, or implement. Benefits enormously from having structured neighbourhoods of the graph instead of raw source.

## 5. Value proposition (by persona)

| Persona | Today | With Libar Omni |
|---|---|---|
| Domain engineer | Hand-maintains links between code, tests, ADRs. | Decorate once; CI fails on broken links. |
| Architect | Re-draws diagrams; ADRs disconnect from code. | Generated diagrams; ADRs first-class graph nodes referenced by code. |
| Product / BA | Edits Markdown; no idea what's actually built. | Spec Studio shows readiness, coverage, open questions, alternatives interactively. |
| QA | Tags `.feature` files inconsistently; orphan tests. | Tags resolve to typed `SpecId`; orphan tests fail CI. |
| AI agent | Reads raw files, hallucinates structure. | Receives `change-impact-FR-042.json` with nodes/edges/sourceFiles/unresolvedQuestions. |
| Auditor / compliance | Manually correlates SBOMs, attestations, requirements. | OTel/SLSA/CycloneDX evidence is graph-attached; queries answer in seconds. |

## 6. Scope of the concept

The concept covers:

- The **primitive model** (Specs, SpecPacks, facets, axes, profiles).
- The **graph metamodel** (nodes, edges, edge provenance, IDs, identifiers).
- **Authoring surfaces** (TypeScript DSL, source markers, annotated Gherkin, harnesses).
- The **runtime anchor decision** (Fastify + Effect Layers as the recommended target; Fastify + Awilix as transitional).
- The **extractor and validator pipeline** (`ts-morph`, schema validation, graph validators, architecture tests, lint).
- **Projections**: the HTML Spec Studio, LikeC4 architecture views, traceability matrices, ADR indexes, OpenAPI/AsyncAPI exports, JSON-LD interoperability, AI context slices.
- The **patch-back loop** (Spec Studio → patch JSON → validation → codemod → updated `.spec.ts`).
- The **delivery evidence overlay** (OpenTelemetry semantic conventions, SLSA provenance, CycloneDX SBOMs, GitHub artifact attestations).
- A **phased implementation roadmap** with one bounded context as the proving ground.
- **Limitations and open questions** explicitly retained.

## 7. Non-goals

These are deliberately *not* part of the initial concept:

- **Replacing Jira / Linear / Notion.** Libar Omni complements them; integration via MCP, webhooks, or CSV is a later concern.
- **Becoming a universal requirements-management tool.** ReqIF / SysML v2 interoperability is on the long-term horizon for organisations that need it; the core does not depend on it.
- **Inferring all relationships automatically.** Static analysis recovers structural and dataflow facts; *intent* (this implements that requirement, this decision constrains those components) must be explicit. We never confuse `confidence: low` inferred edges with declared truth.
- **Supporting languages other than TypeScript on day one.** The compiler-API leverage is too valuable to dilute. A Go or Python extractor can come later if a team needs it.
- **A "no-code" or visual authoring tool.** The Spec Studio is rich, but the canonical authoring surface is TypeScript. Visual edits round-trip through patches.
- **Replacing your design tool.** Figma, Pencil, etc. remain canonical for visual design. Libar Omni links *to* them.

## 8. Differentiation

What separates Libar Omni from adjacent tools:

| Tool / approach | What it does | What it lacks vs Libar Omni |
|---|---|---|
| Structurizr / LikeC4 | Architecture as code, C4 diagrams. | No requirements/specs, no trace to code, no runtime evidence. |
| Cucumber / `.feature` files | Executable behaviour specs. | No typed graph, no architecture, no validation across files. |
| ADR markdown | Decision records. | Disconnected from code, no enforcement, no derived views. |
| OpenAPI / AsyncAPI | API contracts. | No design intent, no scenarios, no decisions, no NFRs. |
| TypeDoc / API Extractor | API documentation. | Reference docs only; no business or architecture semantics. |
| CALM (FINOS) | JSON Schema architecture-as-code with decorators. | Useful interop target; weaker on behaviour, examples, AI projection. |
| Dependency-cruiser / ts-arch | Module-boundary linting. | Single concern (dependencies); no specs, no diagrams, no evidence. |
| Jira / Linear | Ticketing and process. | Not in the codebase, not type-checked, not linked to runtime evidence. |
| TypeSpec | API IDL with multi-emit. | Excellent for contracts; not a delivery graph. |
| Claude Code / Cursor | AI coding agents. | Consumers of context, not producers of structured context. |

Libar Omni is *one of these layered with the others* — it ingests their outputs (LikeC4 models, OpenAPI specs, ADR markdown, Cucumber Messages, OTel traces, SBOMs) and emits projections back into their formats. It is not designed to replace them; it is designed to **be the membrane** that links them.

## 9. The North Star scenario

A product manager opens the **Spec Studio** in their browser. They navigate to `pack:checkout-v1` and see:

- A maturity heatmap: nine specs are `bound`, three are `specified` with no implementation, one NFR (`spec:orders.create-order.performance`) is `specified` with no measurement target.
- An impact panel: changing `spec:payment.authorize` would affect five downstream specs, three components, two Fastify routes, and two ADRs.
- Open questions on `spec:checkout.complete-purchase`: *"Should inventory be reserved before or after payment authorization?"*
- A scenario harness for `spec:orders.create-order`: toggling `paymentState: failed` shows that no test currently covers that path.

The PM proposes a new scenario in the Spec Studio (a draggable Given/When/Then editor). On *Export patch*, the studio produces a JSON patch. Running `akg patch apply` validates the patch against the schema and graph, applies it as a codemod to `specs/orders/create-order.spec.ts`, regenerates the graph, and pushes a PR.

A developer pulls the branch. Their Claude Code agent receives the AI slice `generated/ai/change-impact-spec.orders.create-order.json`, which contains the new scenario, the existing scenarios, the runtime layer (`layer:CreateOrderUseCaseLive`), the dependencies (`port:OrderRepository`, `port:EventBus`), the ADR (`adr:007-order-lifecycle`), and the existing failing test gaps. The agent implements a new Vitest test that covers `paymentState: failed`, marks the spec `verification.tests` and `evidence.verifiedBy`, and pushes a commit. CI runs:

- `tsc` confirms the spec file is well-typed.
- `akg validate` confirms the new scenario passes the `specified` profile.
- The Vitest test runs and reports back through Cucumber Messages / Vitest reporters into the graph.
- `akg validate` re-runs with evidence; the spec is now `verified`.

A status report goes to leadership the next morning. It is an HTML file generated from the graph; nobody had to write it.

This is the loop the rest of the document set elaborates.

## 10. Working assumptions

For the rest of the concept:

- The default runtime is **Node.js with Fastify + Effect Layers**, but the design works for any Node.js + DI stack with adapted extractors.
- The default test stack is **Vitest + Cucumber-JS + Playwright**, exporting Cucumber Messages and Playwright JSON reports.
- The default repository is a **pnpm monorepo** with TypeScript project references.
- All examples assume **strict mode TypeScript** and **ESM**.
- The default observability stack is **OpenTelemetry** with semantic conventions including CI/CD spans.
- The default supply-chain provenance is **SLSA + CycloneDX + GitHub artifact attestations**.

These assumptions are not requirements of the design — they are the assumed baseline for the documents that follow. Substitutes (Express, NestJS, InversifyJS, Mocha, Cypress, etc.) all work; the extractor needs adapter modules for each.
