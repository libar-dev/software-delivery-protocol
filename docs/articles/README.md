# Media Plan & Living Series Playbook — Libar Software Delivery Protocol

> **Pinned baseline:** commit [`5a0b22c`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) (`5a0b22c2d9ead98c900b60ed6209342fce2cbef6`), the merge of [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33).
> **Posture:** This directory lives on a standing, unmerged pull request that is periodically refreshed as `main` advances. Every corpus number in this series is derived from the graph at the pinned commit—re-run the queries in [The Living-PR Refresh Playbook](#5-the-living-pr-refresh-playbook) rather than inheriting counts across updates.

---

## 1. Narrative Positioning & Core Thesis

### The problem we lead with
Software teams have more tools than ever, yet delivery truth is more fragmented than ever. Intent lives in tickets and product docs, architecture lives on whiteboards and stale wikis, decisions live in scattered ADR files, acceptance criteria live in `.feature` files, and verification lives in CI logs. Nothing joins them except rot-prone prose. Within weeks of implementation, documentation drifts from code.

When AI coding agents enter that environment, the fragmentation compounds. Agents read raw source files and stale Markdown, guess at boundaries, and hallucinate structure because **no typed model of the system exists in the repository for them to reason over**.

### The thesis
**Libar Software Delivery Protocol** (`@libar-dev/software-delivery-protocol`, CLI `sdp`) is a programmatic, AI-native software-delivery system built on one bet: **the spec is the prompt is the design**. Instead of syncing external trackers or bolting a workflow state machine onto git, you model the whole delivery lifecycle as typed code in the repository, derive **one regenerable graph** from it, check **conformance and honesty** in CI, and generate every human- and AI-facing artifact off that graph.

### The four-part slogan
Every article in the series reinforces one or more clauses of the founding slogan from the [concept overview](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/README.md):

1. **Specs are code** — One authored truth-primitive (`Spec`) enriched in place across three independent descriptors (`kind` × `altitude` × `readiness`), authored in Markdown (`.sdp.md`) by default, with TypeScript (`.sdp.ts`) as a lawful per-ID option and graph-aware Gherkin (`.sdp.gherkin`) as a per-ID option for `behavior` and `example` Specs only (the Gherkin carrier option, MD-27).
2. **The graph is derived** — One flat, deterministic, regenerable graph (`graph = f(repo)`) serves as the sole read model for validators, human views, and coding agents. Delete `generated/` and rebuild it byte-for-byte.
3. **The `claim` stays honest** — Every fact carries its epistemic status (`declared` human intent, `anchored` source bindings, or `inferred` mechanical structure) and the three are never collapsed. The delivery facts `implemented` and `has-verifier` are derived today from resolving edges, never hand-authored; `observed` is designed into the model but not yet derived.
4. **Git is the event log** — History and prior states live in git commits, not in a second database or ticket status machine.

---

## 2. Target Audiences & Distribution Strategy

| Audience segment | What hurts them today | What hooks them in the Protocol | Primary articles |
|---|---|---|---|
| **Staff / Principal Engineers & Software Architects** | Architecture diagrams and ADRs rot the week after a design review; no way to verify whether code still honors the design or which decisions shape a module. | One primitive with named coordinates; zero-import `@sdp*` comment-form anchors (`satisfies` vs. `references`, `role`, `layer`, `context`); deterministic conformance + honesty checks in CI. | Articles 1, 2, 5, 7 |
| **AI / Coding-Agent Builders & Power Users** | `AGENTS.md` files bloat into thousands of lines of prose; MCP tools and CLI "verb walls" force agents to make 20+ calls or grep raw files and guess. | "Agents script the graph, not a verb wall": `sdp q` + `createReader`, 43 runnable recipes, context bundles composed within a budget counted in UTF-16 code units, and structured change proposals. | Articles 1, 3, 7, 8 |
| **Engineering Leaders & Technical Founders** | Process theatre—mandatory sprint gates, Jira status choreography, and "100% spec coverage" quotas that produce AI-generated boilerplate nobody reads. | "Adopt the nouns, reject the gates" (MD-2); readiness floors instead of quotas; the build backlog (`ready` Specs without `implemented`, excluding `example` and `decision` Specs) and the drift alarm (`implemented ∧ ¬ready`) as live graph queries. | Articles 1, 4, 7 |
| **BDD & Testing Practitioners** | Cucumber `.feature` files drift from step regexes, duplicate domain logic, and turn non-behavioral NFRs or domain models into awkward Given/When/Then prose. | Carrier-independent executable specs: typed `gwt-vocabulary` example spaces, generated step and space contracts, generated registrars committed once a test adopts them (adopted registrars are committed, MD-31), and authored `specOracle` expected-outcome functions. | Articles 2, 4, 6 |

### Channel & format rollout
- **Long-form canonical posts** — Publish from the Markdown manuscripts in `docs/articles/` to the project blog, Substack, or dev.to, with commit-pinned links to the public repository (`libar-dev/software-delivery-protocol`) and `try-it` blocks readers can run in 60 seconds.
- **Tables on other platforms** — Substack and Medium do not render Markdown tables. When cross-posting there, convert each table in an article (and in this playbook) to a bulleted list, one bullet per row, or to a rendered image with the same content as its alt text. dev.to and GitHub render the tables as written.
- **Hacker News / Lobsters launches** — Lead with Articles 1, 3, and 5. Title for technical substance and contrarian clarity (e.g., why we refused to carry over Gen 1's 24-tag registry, why we built one JS evaluation sink instead of 30 CLI subcommands, why we ran a 4-way carrier competition to choose Markdown).
- **Visual & interactive companions** — Pair Article 3 and Article 7 with the static HTML **Spec Studio** screenshots from [`reviews/assets/pr33`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33) and live static-host previews generated by `sdp studio`.
- **Podcast / Audio briefings (NotebookLM)** — Feed [the 24 core sources](#the-24-core-sources-pinned-to-5a0b22c) plus Articles 1–3 into NotebookLM to produce an audio overview for commuters and architecture-review prep.

### The 24 Core Sources (Pinned to `5a0b22c`)

<details>
<summary>The repository files the series draws on, each pinned to commit <code>5a0b22c</code> (expand)</summary>

**Vocabulary and principles**

1. [`CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/CONTEXT.md) — the ratified glossary
2. [`docs/concept/README.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/README.md) — the concept overview and the four-part slogan
3. [`docs/concept/00-vision-scope-and-mvp-boundary.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/00-vision-scope-and-mvp-boundary.md) — vision, scope, and non-goals
4. [`docs/concept/01-founding-principles-and-invariants.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/01-founding-principles-and-invariants.md) — principles P1 to P10
5. [`docs/concept/04-authoring-and-binding.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/04-authoring-and-binding.md) — authoring and binding
6. [`docs/concept/06-consumers-and-projections.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/06-consumers-and-projections.md) — consumers and the two surfaces
7. [`docs/concept/DECISIONS.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/DECISIONS.md) — the decision registry

**Carrying Specs**

8. [`specs/model/core-model.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/core-model.sdp.md) — the one primitive and its descriptors
9. [`specs/decisions/carrier-ruling.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/carrier-ruling.sdp.md) — the carrier ruling (MD-18)
10. [`specs/decisions/anchor-comment-form.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-comment-form.sdp.md) — the comment form (MD-36)
11. [`specs/decisions/anchor-binding-grain.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-binding-grain.sdp.md) — bindings are optional, plural, and may reference a design (MD-37)
12. [`specs/decisions/architectural-annotation.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/architectural-annotation.sdp.md) — architectural significance is annotated where it is realized (MD-38)
13. [`specs/extraction/executable-contracts.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/executable-contracts.sdp.md) — generated step and space contracts
14. [`specs/consumers/agent-surface.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/agent-surface.sdp.md) — the agent surface and the demand map
15. [`specs/consumers/context-bundle.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/context-bundle.sdp.md) — the context bundle
16. [`specs/validation/corpus-rules.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/corpus-rules.sdp.md) — corpus rules under `sdp validate --rules`
17. [`specs/consumers/spec-studio.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.sdp.md) — the Spec Studio

**Agent on-ramps and recipes**

18. [`docs/agent-surface/recipes.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/agent-surface/recipes.md) — the runnable recipe catalog
19. [`.agents/skills/sdp-agent-surface/SKILL.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-agent-surface/SKILL.md) — the reading skill
20. [`.agents/skills/sdp-authoring/SKILL.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-authoring/SKILL.md) — the authoring skill
21. [`.agents/skills/sdp-sessions/SKILL.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-sessions/SKILL.md) — the sessions skill

**Worked example, lineage, and review**

22. [`examples/checkout-v1/README.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/README.md) — the worked MVP example
23. [`docs/lineage/README.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/lineage/README.md) — the restored v0 design documents and the Gen 1 annotation scout report
24. [`reviews/26-whole-corpus-refresh.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/26-whole-corpus-refresh.md) — the whole-corpus refresh record

</details>

---

## 3. The 8-Part Article Series Plan

| # | Title & file | Status | Core angle | Key repo sources & PRs |
|---|---|---|---|---|
| **01** | **[The Spec Is the Prompt Is the Design: Why AI-Native Software Delivery Needs One Graph, Not Another Ticket Tracker](./01-the-spec-is-the-prompt-is-the-design.md)** | **Ready in this PR** | The launch manifesto: why delivery truth fractures across tools, why AI agents hallucinate structure without a graph, and how one primitive (`Spec`), three claims (`declared` / `anchored` / `inferred`), and two check families (conformance + honesty) replace workflow gates. | [`docs/concept/00`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/00-vision-scope-and-mvp-boundary.md), [`01`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/01-founding-principles-and-invariants.md), [`CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/CONTEXT.md), [`spec:model.core-model`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/core-model.sdp.md), [PR #1](https://github.com/libar-dev/software-delivery-protocol/pull/1) |
| **02** | **[From Rough Idea to Verified Code: A Hands-On Tour of the Libar Software Delivery Protocol](./02-walkthrough-intent-to-verified-code.md)** | **Ready in this PR** | The step-by-step engineer's tour through `pack:checkout-v1` and the self-hosted engine: authoring `.sdp.md` Specs (with a sidebar on the `.sdp.gherkin` option), clearing readiness floors, binding code with constant-form and `@sdp*` comment-form anchors, generating step/space contracts, binding an authored `specOracle`, and tripping the checks on purpose. | [`examples/checkout-v1/README.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/README.md), [`docs/concept/04`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/04-authoring-and-binding.md), [`sdp-authoring`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-authoring/SKILL.md), [PR #3](https://github.com/libar-dev/software-delivery-protocol/pull/3), [PR #29](https://github.com/libar-dev/software-delivery-protocol/pull/29) |
| **03** | **[Stop Building 30-Verb CLI Walls for Coding Agents: Scripting the Delivery Graph with `sdp q` and Spec Studio](./03-stop-building-verb-walls-for-coding-agents.md)** | **Ready in this PR** | How coding agents and human reviewers consume the same derived graph: the demand map (`findByConcept`, `byFile`, `blastRadius`), the `sdp q` evaluation sink, growing by recipe instead of CLI verbs, scaling to a 243-Spec adopter with context bundles and corpus rules, and browsing the static HTML Spec Studio. | [`docs/concept/06`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/06-consumers-and-projections.md), [`sdp-agent-surface`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-agent-surface/SKILL.md), [`spec:consumers.spec-studio`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.sdp.md), [PR #14](https://github.com/libar-dev/software-delivery-protocol/pull/14), [PR #31](https://github.com/libar-dev/software-delivery-protocol/pull/31), [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33) |
| **04** | **Shared Language Is a Performance Feature: Ubiquitous Language, Rejecting Workflow Gates, and the Four-Way Carrier Competition** | Planned | Why settling the words first (`claim` vs. provenance, `altitude` vs. abstraction, `readiness floor` vs. readiness profile) gave the engine a design to be built on, and how a four-entrant carrier competition (Markdown vs. custom grammar vs. Gherkin fork vs. TSX), closed on exhibits, scorecards, and probes, ruled `.sdp.md` the default while keeping one canonical surface per ID. | [`CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/CONTEXT.md), [`DECISIONS.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/DECISIONS.md), [`spec:decisions.carrier-ruling`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/carrier-ruling.sdp.md), [PR #1](https://github.com/libar-dev/software-delivery-protocol/pull/1), PRs [#4](https://github.com/libar-dev/software-delivery-protocol/pull/4) to [#7](https://github.com/libar-dev/software-delivery-protocol/pull/7), [PR #8](https://github.com/libar-dev/software-delivery-protocol/pull/8), [PR #17](https://github.com/libar-dev/software-delivery-protocol/pull/17), [PR #19](https://github.com/libar-dev/software-delivery-protocol/pull/19) |
| **05** | **What We Learned Rebuilding `@libar-dev/architect`: Git Archaeology, the Comment-Form Reversal, and Honest Code Bindings** | Planned | A candid post-mortem on Gen 1 (`@libar-dev/architect`), how an evidence-based scout report overturned our own Gen 2 refusal of identity tags in doc comments, and why separating `satisfies` (code that realizes a Spec) from `references` (code that answers to a design without realizing it) stopped a stub from reading as `implemented`. | [`docs/lineage/README.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/lineage/README.md), [`docs/agent-surface/architecture.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/agent-surface/architecture.md), [`spec:decisions.anchor-comment-form`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-comment-form.sdp.md), [`spec:decisions.anchor-binding-grain`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-binding-grain.sdp.md), [PR #28](https://github.com/libar-dev/software-delivery-protocol/pull/28), [PR #29](https://github.com/libar-dev/software-delivery-protocol/pull/29), [PR #32](https://github.com/libar-dev/software-delivery-protocol/pull/32) |
| **06** | **Executable Specifications Without Cucumber Glue: Typed Example Spaces, Generated Contracts, and Expected-Outcome Oracles** | Planned | Why traditional BDD rots at the regex boundary, and how the Protocol generates TypeScript step and space contracts and deterministic registrars from `gwt-vocabulary` example spaces and bound points, then checks each bound example against an authored `specOracle` whose answers include `unspecified`. | [`spec:extraction.executable-contracts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/executable-contracts.sdp.md), [`spec:extraction.runnable-modules`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/runnable-modules.sdp.md), [`spec:validation.oracle-target-eligibility`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/oracle-target-eligibility.sdp.md), [PR #3](https://github.com/libar-dev/software-delivery-protocol/pull/3), [PR #19](https://github.com/libar-dev/software-delivery-protocol/pull/19), [PR #21](https://github.com/libar-dev/software-delivery-protocol/pull/21) |
| **07** | **Designing a 243-Spec Platform Ahead of Its Code: Context Bundles, Entry Addresses, and Corpus Rules at Scale** | Planned | How the first adopter (`libar-platform`) pressured the Protocol while designing six Packs months ahead of their code: entry addresses (`#design.<key>`, `#ui.<key>`, `#question.<key>`, `#rule.<key>`), pinned declarations, context bundles within a default budget of 100,000 UTF-16 code units, planned components, and `sdp validate --rules`. | [`spec:consumers.context-bundle`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/context-bundle.sdp.md), [`spec:validation.corpus-rules`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/corpus-rules.sdp.md), [`spec:model.planned-architecture`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/planned-architecture.sdp.md), [PR #26](https://github.com/libar-dev/software-delivery-protocol/pull/26), [PR #27](https://github.com/libar-dev/software-delivery-protocol/pull/27), [PR #31](https://github.com/libar-dev/software-delivery-protocol/pull/31), [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33) |
| **08** | **Auditing 258 Self-Hosted Specs with Cross-Family AI Reviewers: Inside the 595-Finding Whole-Corpus Refresh** | Planned | How one developer and multi-model agent teams audited the entire self-hosted corpus (258 Specs at PR #32's base, `46f0280`) against the engine: splitting it into 13 units, running Fidelity and Quality lenses across model families, cross-verifying 595 findings (refuting 59), applying them in 18 lanes, each in its own worktree, and re-transcribing the self-hosting oracle from the carriers. | [`reviews/26-whole-corpus-refresh.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/26-whole-corpus-refresh.md), [`specs/self-hosting.pack.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/self-hosting.pack.sdp.md), [`sdp-sessions`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-sessions/SKILL.md), [PR #32](https://github.com/libar-dev/software-delivery-protocol/pull/32) |

### Detailed outlines for Planned Articles (04–08)

#### Article 04: *Shared Language Is a Performance Feature*
- **Hook:** An unratified domain vocabulary costs every reader, human or agent: ambiguous words like *status*, *abstraction*, and *provenance* silently corrupt both human design reviews and subagent reasoning.
- **Section 1 — Define first, name last:** The governing rubric from [`CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/CONTEXT.md): adopt established industry nouns, reject process state-machine gates (adopt the nouns, reject the gates, MD-2), and keep a coined word only for a genuine differentiator, where the word must name the difference it marks.
- **Section 2 — Seven renames the engine was built on:** The rename table in [PR #1](https://github.com/libar-dev/software-delivery-protocol/pull/1)'s description, settled before any engine code: `claim` replacing provenance, `anchor` replacing marker, `altitude` replacing abstraction, `section` replacing facet, `readiness floor` replacing readiness profile, `Pack` replacing SpecPack, and `reader` and `impact graph` replacing handle and mechanical substrate. `CONTEXT.md` keeps the rejected names in its ledger; one came back with a narrower job, since `marker` now names only the bracket prefix of an open question or keyed entry, never the binding.
- **Section 3 — The four-way carrier competition:** Four entrants, each with its own exhibit PR ([#4](https://github.com/libar-dev/software-delivery-protocol/pull/4) to [#7](https://github.com/libar-dev/software-delivery-protocol/pull/7)): F2 Markdown and the C2 custom grammar as full exhibits judged on their recorded scorecards in [PR #8](https://github.com/libar-dev/software-delivery-protocol/pull/8), the Gherkin fork and typed markup (TSX) closed earlier on falsifiable probes. Why C2's permanent ecosystem tax (parser, formatter, highlighting, editor integrations, LSP, and a grammar every agent must be taught) lost to `.sdp.md` with the TS DSL as a lawful per-ID option (the carrier ruling, MD-18), and how a graph-aware `.sdp.gherkin` option for behavior and example Specs arrived later ([PR #17](https://github.com/libar-dev/software-delivery-protocol/pull/17); the Gherkin carrier option, MD-27).

#### Article 05: *What We Learned Rebuilding `@libar-dev/architect`*
- **Hook:** Our first-generation tool (`@libar-dev/architect`) worked in production, and Gen 1's own self-hosted graph held 349 patterns—and it taught us every trap of source-first architecture graphs.
- **Section 1 — The sins we refused to carry over:** Sprawling tag registries, workflow lifecycle gates (`candidate → roadmap → active → completed`), and hand-authored delivery status.
- **Section 2 — When git archaeology corrects memory:** How the lineage scout report (carried by [PR #28](https://github.com/libar-dev/software-delivery-protocol/pull/28)) read Gen 1's commit history and found that the "50 tags shrank to 26" story was a cleanup of the formal vocabulary, not of a shipped runtime registry, and that what actually drifted was two Gherkin files sharing one identity, CLI fixtures leaking into the production scan, and misread tag syntax. Its tag inventory, not the history, showed the overloaded `implements`, used both for code realizing a Spec and for a feature file pointing at production code.
- **Section 3 — The comment-form reversal ([PR #29](https://github.com/libar-dev/software-delivery-protocol/pull/29)):** Three rulings, each grounded in the scout, the original design, and the owner's direction to move closer to it. The `@sdp*` comment form (the comment form, MD-36) answered the first adopter (`libar-platform`), whose runtime code cannot import the Protocol package, so every one of its code anchors sat in a test. Optional plural bindings and the non-conferring `references` edge (bindings are optional, plural, and may reference a design, MD-37) answered its stub problem: the only way to name a design from code was to claim to realize it. Architectural attributes where code is realized (architectural significance is annotated where it is realized, MD-38) came from the original design and the owner, not the adopter: a `role` on any code anchor, and a `layer` and `context` on `component:` anchors only. The collective reading of `satisfies`, where the satisfying units together realize every promise of the Spec, was made explicit later, as ruling R01 of the whole-corpus refresh ([PR #32](https://github.com/libar-dev/software-delivery-protocol/pull/32)).

#### Article 06: *Executable Specifications Without Cucumber Glue*
- **Hook:** Everyone loves readable scenarios until a one-word phrasing change breaks a regex step definition—or worse, passes silently while testing the wrong value.
- **Section 1 — Carrier-independent executability:** How `sdp build` turns `gwt-vocabulary` example spaces and bound points (`{n: 2}`, `{total: 100}`) into typed TypeScript step and space contracts under `generated/contracts/`.
- **Section 2 — Authored → generated, never the reverse:** How the generated registrar, written beside its test as a `*.test.generated.ts` file and committed once that test imports it (adopted registrars are committed, MD-31), takes four required adapters (`createWorld`, `invoke`, `observe`, `expected`) and an optional fifth (`assertions`), without the generated code ever importing authored code.
- **Section 3 — The `specOracle` and `unspecified`:** Why expected-outcome semantics belong in an authored, typed oracle beside the tests—and why an oracle that answers `unspecified` for an unmodeled region reports a coverage gap rather than a failure. One caveat belongs in the article: a bound executable example whose point lands on `unspecified` still turns its test red, because no authored Then may silently witness a gap.

#### Article 07: *Designing a 243-Spec Platform Ahead of Its Code*
- **Hook:** What happens when an adopter models a transactional platform in 243 Specs (measured at its pin, per [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33)) across seven layers, 0 to 6, and states the components of layers 3 to 6 as designs before their code exists? The assumptions a small example never tests start to break, and the design-at-scale loop has to be built.
- **Section 1 — Addressing one entry without splitting the Spec:** Entry addresses (`spec:<id>#design.<key>`, `#ui.<key>`, `#question.<key>`, `#rule.<key>`, from [PR #27](https://github.com/libar-dev/software-delivery-protocol/pull/27)), pinned declarations (recipe 24), and the key-family register (recipe 41). The limit belongs in the article too: an entry address is admitted in prose, where it must resolve, and refused in every ID slot (checked mentions, MD-40), so a relation still targets a whole Spec.
- **Section 2 — Fitting a Pack into a model's context budget:** Recipe 36 (the context bundle) cuts in a deterministic seven-step order. At first `pack:history-view` needed at least 299,106 UTF-16 code units against the default budget of 100,000; [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33)'s compact bundle shape plus the `declarations: "addresses"` opt-in brought it to 93,806. Two of the platform's Packs still exceed the budget after every cut, and are read through a perspective (recipe 37) until then.
- **Section 3 — Corpus rules and planned architecture:** Running project-specific policies and the architecture walk (recipe 42) via `sdp validate --rules`, and comparing component design Specs against realized `component:` anchors with recipe 43.

#### Article 08: *Auditing 258 Self-Hosted Specs with Cross-Family AI Reviewers*
- **Hook:** When your repository self-hosts 258 Specs and 40 recipes (measured at `46f0280`, the merge of PR #31 and the base of [PR #32](https://github.com/libar-dev/software-delivery-protocol/pull/32)), how do you verify that the Specs, the engine, and the docs actually agree?
- **Section 1 — Two lenses, two model families:** The methodology behind [`reviews/26-whole-corpus-refresh.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/26-whole-corpus-refresh.md) ([PR #32](https://github.com/libar-dev/software-delivery-protocol/pull/32)): pairing a Fidelity lens (code + tests vs. Spec rules) with a Quality lens (cross-Spec consistency, vocabulary, readiness honesty), then cross-verifying every finding with the opposite model family.
- **Section 2 — What the 595 findings caught (and the 59 that were refuted):** Code that broke its own promises, such as Gherkin status lookalikes (`@status.ready`) passing as decoration; two homes of the law that disagreed, such as the authoring skill reading `satisfies` collectively while a Spec read it per unit (ruled as R01); and why cross-verification by the other model family was needed to refute false blockers.
- **Section 3 — The distillation boundary and living hygiene:** Two recipes with different jobs. Slimming candidates (recipe 39) lists the pinned declarations of implemented, verified Specs that bound code may now carry, so a person can slim a Spec past the distillation boundary. The curation report (recipe 40) curates anchors rather than Specs: over the file-level imports `sdp build --imports` writes, it ranks load-bearing files no anchor covers and imports that disagree with anchored `uses` edges.

---

## 4. Editorial House Rules & Guardrails

Every article in `docs/articles/` must conform to the repository's ratified language and automated checks:

1. **Ratified terminology only ([`CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/CONTEXT.md)).**
   - Use **`Spec`**, **`Pack`**, **`section`**, **`anchor`** (constant form / comment form), **`claim`** (`declared` / `anchored` / `inferred`), **`altitude`** (`epic` / `feature` / `story`), **`readiness`** (`idea` / `scoped` / `defined` / `ready`), **`readiness floor`**, **`delivery fact`** (`implemented` / `has-verifier` / `observed`).
   - Readiness is **stated** or **asserted**, never "claimed" ("claim" is reserved for the `claim` taxonomy).
   - The Protocol **defines a contract** and instances **conform**; never write that the Protocol "governs" or "polices" a project ("checks police conformance and honesty" is the sole guardrail phrasing).
   - State **"deterministically validated," never "provably correct."**
   - Lead decision references with meaning first, code in parentheses: e.g., *the carrier ruling (MD-18)*, *the agent front door (MD-22)*, *the comment form (MD-36)*.
2. **Temporal-guard compliance (`npm run check:temporal`).**
   - `check-temporal.mjs` sweeps every tracked file and every untracked file `.gitignore` does not exclude, except the temporal-by-genre artifacts (`plans/`, `reviews/`, `explorations/`, `docs/lineage/`, `docs/concept/DECISIONS.md`, the tracked drafts, plans, and evidence under `.omo/`) and the machine-generated `package-lock.json`.
   - Never include raw calendar dates (`YYYY-MM-DD`), numbered plan paths (`plans/<number>`), or session/wave/fold tokens in `docs/articles/*.md`. To point a reader at a numbered plan or a dated lineage file, link to the pull request that carried it (`.../pull/33`), never to the file itself, and never encode a path to slip it past the check.
3. **Every count is pinned and re-derivable.**
   - A count of the Protocol's own corpus names the commit it was measured at, and a reader can re-derive it with an `sdp validate` or `sdp q` command, given beside the number or in this playbook.
   - An adopter figure or a historical figure cites the pull request or review that measured it.
4. **Links survive publication.**
   - Inside the repository, link sibling articles relatively (`./02-….md`); at publication, rewrite each relative link to the published URL or to a commit-pinned GitHub URL, since a relative link breaks off the repository.

---

## 5. The Living-PR Refresh Playbook

Because this pull request stays open and is periodically updated as `main` evolves, refreshing the series after merging or rebasing onto a new `main` commit takes four deterministic steps:

### Step 1: Install and build
```sh
npm ci   # installs and builds dist/, including dist/recipes/
```

The commands below use `npm run --silent sdp:q -- …`, which adds the corpus's three exclusions; `pnpm --silent sdp:q …` is equivalent where pnpm is installed. Never run a bare `sdp` in this checkout.

### Step 2: Measure the design diff from the last pinned commit
Generate the base graph at the previously pinned commit (currently `5a0b22c2d9ead98c900b60ed6209342fce2cbef6`) in a temporary worktree outside the repository and run recipe 35 (the design diff) to see every Spec, Pack, section, entry key, and binding that changed. Keep the worktree outside: inside the checkout it is an untracked directory the gate trips over, and `check:temporal` fails on it.

```sh
BASE_SHA="5a0b22c2d9ead98c900b60ed6209342fce2cbef6"
BASE_DIR="$(mktemp -d)/base"
git worktree add --detach "$BASE_DIR" "$BASE_SHA" && ln -s "$PWD/node_modules" "$BASE_DIR/node_modules"
npm --prefix "$BASE_DIR" run build
node "$BASE_DIR/dist/cli/sdp.js" build "$BASE_DIR" --exclude explorations --exclude examples --exclude test/fixtures/import/parity
npm run --silent sdp:q -- "$(cat dist/recipes/35-the-design-diff.js)" --params "base=@$BASE_DIR/generated/graph.json" --params '{"detail":true}' --json
git worktree remove --force "$BASE_DIR"
```

### Step 3: Re-derive the headline corpus metrics at the new `HEAD`
```sh
# 1. Overall graph, node-type, claim, readiness, kind, and delivery-fact census
npm run --silent sdp:q -- 'return {
  commit: "HEAD",
  schemaVersion: graph.schemaVersion,
  specs: g.specs().length,
  packs: g.packs().map((p) => p.id),
  nodes: graph.nodes.length,
  nodeTypes: graph.nodes.reduce((a, n) => ((a[n.nodeType] = (a[n.nodeType] || 0) + 1), a), {}),
  edges: graph.edges.length,
  edgeClaims: graph.edges.reduce((a, e) => ((a[e.claim] = (a[e.claim] || 0) + 1), a), {}),
  locations: graph.locations.length,
  readiness: g.specs().reduce((a, s) => ((a[s.statedReadiness] = (a[s.statedReadiness] || 0) + 1), a), {}),
  kinds: g.specs().reduce((a, s) => ((a[s.specKind] = (a[s.specKind] || 0) + 1), a), {}),
  deliveryFacts: {
    implemented: g.specs().filter((s) => s.deliveryFacts.includes("implemented")).length,
    hasVerifier: g.specs().filter((s) => s.deliveryFacts.includes("has-verifier")).length,
    observed: g.specs().filter((s) => s.deliveryFacts.includes("observed")).length
  }
}' --json

# 2. Operational build backlog (recipe 1) and drift alarm (recipe 2)
npm run --silent sdp:q -- "$(cat dist/recipes/01-the-build-backlog.js)" --json
npm run --silent sdp:q -- "$(cat dist/recipes/02-the-drift-alarm.js)" --json

# 3. Open-question register (recipe 20) and design backlog (recipe 33)
npm run --silent sdp:q -- "$(cat dist/recipes/20-open-question-register.js)" --json
npm run --silent sdp:q -- "$(cat dist/recipes/33-the-design-backlog.js)" --json

# 4. Pack design summaries across all Packs (recipe 29)
npm run --silent sdp:q -- '
  const out = [];
  for (const p of g.packs()) {
    const r = await (async (params) => { '"$(cat dist/recipes/29-pack-design.js)"' })({ pack: p.id });
    out.push({ id: r.id, totals: r.totals });
  }
  return out;
' --json

# 5. Shipped recipe bodies
ls dist/recipes/*.js | wc -l
```

### Step 4: Baseline snapshot at `5a0b22c` (for comparison on next refresh)
Measured at `5a0b22c2d9ead98c900b60ed6209342fce2cbef6` (re-run the commands above rather than inheriting):

| Metric | Value at `5a0b22c` | Source in Step 3 (command · output field) |
|---|---|---|
| Schema version | `0.10.0` | 1 · `schemaVersion` |
| Authored `Spec`s | `276` (`245 ready`, `17 defined`, `3 scoped`, `11 idea`) | 1 · `specs`, `readiness` |
| Authored `Pack`s | `6` (`self-hosting-v1`, `design-management-v1`, `spec-studio-v1`, `corpus-checks-v1`, `design-iteration-v1`, `obsidian-vault-v1`) | 1 · `packs` |
| Total nodes / edges / locations | `621` nodes (`276 Primitive`, `6 Pack`, `160 CodeNode`, `179 Anchor`) · `1,624` edges (`1,063 declared`, `561 anchored`) · `1,774` locations | 1 · `nodes`, `nodeTypes`, `edges`, `edgeClaims`, `locations` |
| Delivery facts | `94 implemented` · `205 has-verifier` · `0 observed` | 1 · `deliveryFacts` |
| Operational build backlog | `0` (`110` ready examples and `41` ready decisions audited and excluded) | 2 · recipe 1's `total`, `excludedReadyExamples`, `excludedReadyDecisions` |
| Drift alarm (`implemented ∧ ¬ready`) | `0` | 2 · recipe 2's `total` |
| Design backlog (`defined` Specs no code realizes) | `17` Specs | 3 · recipe 33's `totals.specs` |
| Open questions | `43` across `24` Specs (`16` blocking: `8` deferrals with triggers, `8` holds; `27` non-blocking) | 3 · recipe 20's `totals` (`questions`, `specs`, `blocking`, `deferrals`, `holds`, `nonBlocking`) |
| Shipped recipes | `43` runnable bodies under `dist/recipes/` | 5 · the file count |

After updating any changed counts or commit links, stage the files (`preflight` fails on an untracked file `.gitignore` does not exclude) and run the full green gate, `npm run check`: thirteen steps from `check:temporal` to `preflight`, all of which must exit `0`.

That gate covers less of this directory than it seems. `check:temporal` does sweep `docs/articles/` for dates, numbered plan paths, and session tokens, but `.prettierignore` excludes `docs/**`, so `format:check` never reads these articles, and `lint` reads only code. Nothing in the gate catches an unbalanced code fence or a broken link here. Before publishing, check both yourself, with a throwaway script you do not commit: every fence must close with a backtick run at least as long as the one that opened it (a Markdown example that contains its own fences needs a four-backtick outer fence), and every relative link and every commit-pinned GitHub link must resolve.
