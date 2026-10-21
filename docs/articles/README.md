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

1. **Specs are code** — One authored truth-primitive (`Spec`) enriched in place across three independent descriptors (`kind` × `altitude` × `readiness`), authored in Markdown (`.sdp.md`) by default, TypeScript (`.sdp.ts`), or graph-aware Gherkin (`.sdp.gherkin`).
2. **The graph is derived** — One flat, deterministic, regenerable graph (`graph = f(repo)`) serves as the sole read model for validators, human views, and coding agents. Delete `generated/` and rebuild it byte-for-byte.
3. **The `claim` stays honest** — Every fact carries its epistemic status (`declared` human intent, `anchored` source bindings, or `inferred` mechanical structure) and the three are never collapsed. Delivery facts (`implemented`, `has-verifier`, `observed`) are derived from resolving edges, never hand-authored.
4. **Git is the event log** — History and prior states live in git commits, not in a second database or ticket status machine.

---

## 2. Target Audiences & Distribution Strategy

| Audience segment | What hurts them today | What hooks them in the Protocol | Primary articles |
|---|---|---|---|
| **Staff / Principal Engineers & Software Architects** | Architecture diagrams and ADRs rot the week after a design review; no way to verify whether code still honors the design or which decisions shape a module. | One primitive with named coordinates; zero-import `@sdp*` comment-form anchors (`satisfies` vs. `references`, `role`, `layer`, `context`); deterministic conformance + honesty checks in CI. | Articles 1, 2, 5, 7 |
| **AI / Coding-Agent Builders & Power Users** | `AGENTS.md` files bloat into thousands of lines of prose; MCP tools and CLI "verb walls" force agents to make 20+ calls or grep raw files and guess. | "Agents script the graph, not a verb wall": `sdp q` + `createReader`, 43 runnable recipes, token-budgeted context bundles, and structured change proposals. | Articles 1, 3, 7, 8 |
| **Engineering Leaders & Technical Founders** | Process theatre—mandatory sprint gates, Jira status choreography, and "100% spec coverage" quotas that produce AI-generated boilerplate nobody reads. | "Adopt the nouns, reject the gates" (MD-2); readiness floors instead of quotas; `ready ∧ ¬implemented` (build backlog) and `implemented ∧ ¬ready` (drift alarm) as live graph queries. | Articles 1, 4, 7 |
| **BDD & Testing Practitioners** | Cucumber `.feature` files drift from step regexes, duplicate domain logic, and turn non-behavioral NFRs or domain models into awkward Given/When/Then prose. | Carrier-independent executable specs: typed `gwt-vocabulary` example spaces, generated step and space contracts, committed registrars, and `specOracle` expected-outcome functions. | Articles 2, 4, 6 |

### Channel & format rollout
- **Long-form canonical posts** — Publish from the Markdown manuscripts in `docs/articles/` to the project blog, Substack, or dev.to, with commit-pinned links to the public repository (`libar-dev/software-delivery-protocol`) and `try-it` blocks readers can run in 60 seconds.
- **Hacker News / Lobsters launches** — Lead with Articles 1, 3, and 5. Title for technical substance and contrarian clarity (e.g., why we deleted a 24-tag annotation registry, why we built one JS evaluation sink instead of 30 CLI subcommands, why we ran a 4-way carrier competition to choose Markdown).
- **Visual & interactive companions** — Pair Article 3 and Article 7 with the static HTML **Spec Studio** screenshots from [`reviews/assets/pr33`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33) and live static-host previews generated by `sdp studio`.
- **Podcast / Audio briefings (NotebookLM)** — Feed the 24 core sources plus Articles 1–3 into NotebookLM to produce an audio overview for commuters and architecture-review prep.

---

## 3. The 8-Part Article Series Plan

| # | Title & file | Status | Core angle | Key repo sources & PRs |
|---|---|---|---|---|
| **01** | **[The Spec Is the Prompt Is the Design: Why AI-Native Software Delivery Needs One Graph, Not Another Ticket Tracker](./01-the-spec-is-the-prompt-is-the-design.md)** | **Ready in this PR** | The launch manifesto: why delivery truth fractures across tools, why AI agents hallucinate structure without a graph, and how one primitive (`Spec`), three claims (`declared` / `anchored` / `inferred`), and two check families (conformance + honesty) replace workflow gates. | [`docs/concept/00`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/00-vision-scope-and-mvp-boundary.md), [`01`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/01-founding-principles-and-invariants.md), [`CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/CONTEXT.md), [`spec:model.core-model`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/core-model.sdp.md), [PR #1](https://github.com/libar-dev/software-delivery-protocol/pull/1) |
| **02** | **[From Rough Idea to Verified Code: A Hands-On Tour of the Libar Software Delivery Protocol](./02-walkthrough-intent-to-verified-code.md)** | **Ready in this PR** | The step-by-step engineer's tour through `pack:checkout-v1` and the self-hosted engine: authoring `.sdp.md` and `.sdp.gherkin` Specs, clearing readiness floors, binding code with constant-form and `@sdp*` comment-form anchors, generating step/space contracts, binding a `specOracle`, and tripping the honesty checks on purpose. | [`examples/checkout-v1/README.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/examples/checkout-v1/README.md), [`docs/concept/04`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/04-authoring-and-binding.md), [`sdp-authoring`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-authoring/SKILL.md), [PR #3](https://github.com/libar-dev/software-delivery-protocol/pull/3), [PR #29](https://github.com/libar-dev/software-delivery-protocol/pull/29) |
| **03** | **[Stop Building 30-Verb CLI Walls for Coding Agents: Scripting the Delivery Graph with `sdp q` and Spec Studio](./03-stop-building-verb-walls-for-coding-agents.md)** | **Ready in this PR** | How coding agents and human reviewers consume the same derived graph: the demand map (`findByConcept`, `byFile`, `blastRadius`), the `sdp q` evaluation sink, growing by recipe instead of CLI verbs, scaling to a 240-Spec adopter with context bundles and corpus rules, and browsing the static HTML Spec Studio. | [`docs/concept/06`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/06-consumers-and-projections.md), [`sdp-agent-surface`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-agent-surface/SKILL.md), [`spec:consumers.spec-studio`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.sdp.md), [PR #31](https://github.com/libar-dev/software-delivery-protocol/pull/31), [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33) |
| **04** | **Shared Language Is a Performance Feature: Ubiquitous Language, Rejecting Workflow Gates, and the Four-Way Carrier Competition** | Planned | Why settling words (`claim` vs. provenance, `altitude` vs. abstraction, `readiness floor` vs. profile) settled the architecture, and how a falsifiable four-entrant competition (Markdown vs. custom grammar vs. Gherkin fork vs. TSX) ruled `.sdp.md` as default while preserving per-ID universality. | [`CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/CONTEXT.md), [`DECISIONS.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/DECISIONS.md), [`spec:decisions.carrier-ruling`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/carrier-ruling.sdp.md), [PR #1](https://github.com/libar-dev/software-delivery-protocol/pull/1), [PR #8](https://github.com/libar-dev/software-delivery-protocol/pull/8), [PR #19](https://github.com/libar-dev/software-delivery-protocol/pull/19) |
| **05** | **What We Learned Rebuilding `@libar-dev/architect`: Git Archaeology, the Annotation Reversal, and Honest Code Bindings** | Planned | A candid post-mortem on Gen 1 (`@libar-dev/architect`), how an evidence-based scout report overturned our own early Gen 2 refusal of doc-comment tags, and why distinguishing `satisfies` (collective realization) from `references` ("answers to") solved the stub-coverage lie. | [`docs/lineage/README.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/lineage/README.md), [`docs/agent-surface/architecture.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/agent-surface/architecture.md), [`spec:decisions.anchor-comment-form`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-comment-form.sdp.md), [`spec:decisions.anchor-binding-grain`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/anchor-binding-grain.sdp.md), [PR #29](https://github.com/libar-dev/software-delivery-protocol/pull/29) |
| **06** | **Executable Specifications Without Cucumber Glue: Typed Example Spaces, Generated Contracts, and Expected-Outcome Oracles** | Planned | Why traditional BDD rots at the regex boundary, and how the Protocol compiles `gwt-vocabulary` example spaces and bound points into TypeScript union contracts, deterministic registrars, and `specOracle` functions where `unspecified` is a first-class answer. | [`spec:extraction.executable-contracts`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/executable-contracts.sdp.md), [`spec:extraction.runnable-modules`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/extraction/runnable-modules.sdp.md), [`spec:validation.oracle-target-eligibility`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/oracle-target-eligibility.sdp.md), [PR #16](https://github.com/libar-dev/software-delivery-protocol/pull/16), [PR #19](https://github.com/libar-dev/software-delivery-protocol/pull/19) |
| **07** | **Designing a 240-Spec Platform Ahead of Its Code: Context Bundles, Entry Addresses, and Corpus Rules at Scale** | Planned | How the first external adopter (`libar-platform`) pressured the Protocol when designing six capability Packs months ahead of code: entry addresses (`#design.<key>`, `#question.<key>`, `#rule.<key>`), pinned declarations, 100k-unit context bundles, planned components, and `sdp validate --rules`. | [`spec:consumers.context-bundle`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/context-bundle.sdp.md), [`spec:validation.corpus-rules`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/corpus-rules.sdp.md), [`spec:model.planned-architecture`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/planned-architecture.sdp.md), [PR #26](https://github.com/libar-dev/software-delivery-protocol/pull/26), [PR #31](https://github.com/libar-dev/software-delivery-protocol/pull/31), [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33) |
| **08** | **Auditing 276 Self-Hosted Specs with Cross-Family AI Reviewers: Inside the 595-Finding Whole-Corpus Refresh** | Planned | How a solo developer + multi-model agent teams audited the entire self-hosted corpus against the engine: splitting into 13 units, running Fidelity vs. Quality lenses across model families, cross-verifying 595 findings (refuting 59), executing 18 parallel worktree lanes, and pinning the self-hosting oracle. | [`reviews/26-whole-corpus-refresh.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/26-whole-corpus-refresh.md), [`specs/self-hosting.pack.sdp.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/self-hosting.pack.sdp.md), [`sdp-sessions`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-sessions/SKILL.md), [PR #32](https://github.com/libar-dev/software-delivery-protocol/pull/32) |

### Detailed outlines for Planned Articles (04–08)

#### Article 04: *Shared Language Is a Performance Feature*
- **Hook:** Why most "AI prompt engineering" is compensating for an unratified domain vocabulary—and how ambiguous words like *status*, *abstraction*, and *provenance* silently corrupt both human design reviews and subagent reasoning.
- **Section 1 — Define first, name last:** The governing rubric from [`CONTEXT.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/CONTEXT.md): adopt established industry nouns, reject process state-machine gates (the adopt-the-nouns decision, MD-2), and require every coined word to name a genuine epistemic difference.
- **Section 2 — Seven renames that changed the engine:** Walkthrough of the term ledger table (`claim` replacing provenance, `anchor` replacing marker, `altitude` replacing abstraction, `section` replacing facet, `readiness floor` replacing profile, `Pack` replacing SpecPack).
- **Section 3 — The four-way carrier competition:** How [PR #8](https://github.com/libar-dev/software-delivery-protocol/pull/8) judged F2 Markdown, C2 custom grammar, Gherkin fork, and TSX on falsifiable scorecards—and why C2's permanent ecosystem tax (parser, formatter, LSP, zero LLM training distribution) lost to `.sdp.md` + per-ID `.sdp.gherkin` and `.sdp.ts` options (the carrier ruling, MD-18, and the Gherkin carrier option, MD-27).

#### Article 05: *What We Learned Rebuilding `@libar-dev/architect`*
- **Hook:** Our first-generation tool (`@libar-dev/architect`) worked in production across 349 patterns—and taught us every trap of source-first architecture graphs.
- **Section 1 — The sins we refused to carry over:** Sprawling tag registries, workflow lifecycle gates (`candidate → roadmap → active → completed`), and hand-authored delivery status.
- **Section 2 — When git archaeology corrects memory:** How the [annotation scout report](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/lineage) inspected Gen 1's commit history and discovered that the "50 tags shrank to 26" story was formal-spec cleanup, while the real failures were duplicate identities, fixture scan leaks, and overloaded `implements` edges.
- **Section 3 — The annotation reversal ([PR #29](https://github.com/libar-dev/software-delivery-protocol/pull/29)):** How the first adopter (`libar-platform`) proved why runtime code that cannot import the Protocol package needed the `@sdp*` comment form (MD-36), optional plural bindings and the non-conferring `references` edge (MD-37), and `role`, `layer`, and `context` on anchors (MD-38).

#### Article 06: *Executable Specifications Without Cucumber Glue*
- **Hook:** Everyone loves readable scenarios until a one-word phrasing change breaks 40 regex step definitions—or worse, passes silently while testing the wrong value.
- **Section 1 — Carrier-independent executability:** How `sdp build` turns `gwt-vocabulary` example spaces and bound points (`{n: 2}`, `{total: 100}`) into typed TypeScript step and space contracts under `generated/contracts/`.
- **Section 2 — Authored → generated, never the reverse:** How committed adopted registrars (MD-31) wire `createWorld`, `invoke`, `observe`, and `expected` without the generated code ever importing product code.
- **Section 3 — The `specOracle` and `unspecified`:** Why expected-outcome semantics belong in a typed oracle beside the tests—and why returning `unspecified` for unmodeled regions surfaces honest coverage gaps without false gates.

#### Article 07: *Designing a 240-Spec Platform Ahead of Its Code*
- **Hook:** What happens when an adopter models a six-layer transactional platform in 243 Specs before writing layers 3 through 6? Every toy assumption in your spec tool breaks—and forces the real design-at-scale loop.
- **Section 1 — Fine-grained addressing without sub-Spec explosion:** Entry addresses (`spec:<id>#design.<key>`, `#ui.<key>`, `#question.<key>`, `#rule.<key>`), pinned declarations (recipe 24), and the key-family register (recipe 41).
- **Section 2 — Fitting a capability Pack into an LLM's context window:** How recipe 36 (the context bundle) uses a deterministic seven-step cut order and `declarations: "addresses"` to fit `pack:history-view` into 93,806 of 100,000 UTF-16 code units ([PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33)).
- **Section 3 — Corpus rules and planned architecture:** Running project-specific policies and the architecture walk (recipe 42) via `sdp validate --rules`, and comparing component design Specs against realized `component:` anchors with recipe 43.

#### Article 08: *Auditing 276 Self-Hosted Specs with Cross-Family AI Reviewers*
- **Hook:** When your repository self-hosts 276 Specs, 339 anchors, and 43 recipes, how do you verify that the Specs, the engine, and the docs actually agree?
- **Section 1 — Two lenses, two model families:** The methodology behind [`reviews/26-whole-corpus-refresh.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/26-whole-corpus-refresh.md) ([PR #32](https://github.com/libar-dev/software-delivery-protocol/pull/32)): pairing a Fidelity lens (code + tests vs. Spec rules) with a Quality lens (cross-Spec consistency, vocabulary, readiness honesty), then cross-verifying every finding with the opposite model family.
- **Section 2 — What the 595 findings caught (and the 59 they got wrong):** Real bugs caught—from Gherkin reserved tag heads (`@status.ready`) passing as decoration to a collective-vs-per-unit `satisfies` ambiguity—plus why cross-verification was essential to refute false blockers.
- **Section 3 — The distillation boundary and living hygiene:** Using slimming candidates (recipe 39) and the file-level curation report (recipe 40) to keep Specs lean after implementation.

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
   - `check-temporal.mjs` sweeps every tracked file outside the historical genres (`plans/`, `reviews/`, `explorations/`, `docs/lineage/`, `docs/concept/DECISIONS.md`).
   - Never include raw calendar dates (`YYYY-MM-DD`), numbered plan paths (`plans/<number>`), or session/wave/fold tokens in `docs/articles/*.md`. When linking to a numbered plan or dated lineage file inside `docs/articles/*.md`, either link to its pull request (`.../pull/33`), its parent directory (`.../tree/5a0b22c.../plans`), or percent-encode the leading digit in the URL path (`.../plans/%345-design-at-the-adopters-scale.md`).
3. **Every corpus count is derived, dated to a commit, and paired with its command.**
   - Never quote a number without naming the commit it was measured at and giving the reader the `sdp validate` or `sdp q` command to re-derive it.

---

## 5. The Living-PR Refresh Playbook

Because this pull request stays open and is periodically updated as `main` evolves, refreshing the series after merging or rebasing onto a new `main` commit takes four deterministic steps:

### Step 1: Build and run the green gate
```sh
npm ci && npm run build
```

### Step 2: Measure the design diff from the last pinned commit
Generate the base graph at the previously pinned commit (currently `5a0b22c2d9ead98c900b60ed6209342fce2cbef6`) in a temporary worktree and run recipe 35 (the design diff) to see every Spec, Pack, section, entry key, and binding that changed:

```sh
BASE_SHA="5a0b22c2d9ead98c900b60ed6209342fce2cbef6"
git worktree add --detach .sdp-base "$BASE_SHA" && ln -s "$PWD/node_modules" .sdp-base/node_modules
npm --prefix .sdp-base run build
node .sdp-base/dist/cli/sdp.js build .sdp-base --exclude explorations --exclude examples --exclude test/fixtures/import/parity
pnpm --silent sdp:q "$(cat dist/recipes/35-the-design-diff.js)" --params base=@.sdp-base/generated/graph.json --params '{"detail":true}' --json
git worktree remove --force .sdp-base
```

### Step 3: Re-derive the headline corpus metrics at the new `HEAD`
```sh
# 1. Overall graph, readiness, kind, and delivery-fact census
pnpm --silent sdp:q 'return {
  commit: "HEAD",
  schemaVersion: graph.schemaVersion,
  specs: g.specs().length,
  packs: g.packs().length,
  nodes: graph.nodes.length,
  edges: graph.edges.length,
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
pnpm --silent sdp:q "$(cat dist/recipes/01-the-build-backlog.js)" --json
pnpm --silent sdp:q "$(cat dist/recipes/02-the-drift-alarm.js)" --json

# 3. Pack design summaries across all Packs (recipe 29)
pnpm --silent sdp:q '
  const out = [];
  for (const p of g.packs()) {
    const r = await (async (params) => { '"$(cat dist/recipes/29-pack-design.js)"' })({ pack: p.id });
    out.push({ id: r.id, totals: r.totals });
  }
  return out;
' --json
```

### Step 4: Baseline snapshot at `5a0b22c` (for comparison on next refresh)
Measured at `5a0b22c2d9ead98c900b60ed6209342fce2cbef6` (re-run the commands above rather than inheriting):

| Metric | Value at `5a0b22c` | Source query |
|---|---|---|
| Schema version | `0.10.0` | `graph.schemaVersion` |
| Authored `Spec`s | `276` (`245 ready`, `17 defined`, `3 scoped`, `11 idea`) | `g.specs()` |
| Authored `Pack`s | `6` (`self-hosting-v1`, `design-management-v1`, `spec-studio-v1`, `corpus-checks-v1`, `design-iteration-v1`, `obsidian-vault-v1`) | `g.packs()` |
| Total nodes / edges / locations | `621` nodes (`276 Primitive`, `6 Pack`, `160 CodeNode`, `179 Anchor`) · `1,624` edges (`1,063 declared`, `561 anchored`) · `1,774` locations | `graph.nodes`, `graph.edges`, `graph.locations` |
| Delivery facts | `94 implemented` · `205 has-verifier` · `0 observed` | `s.deliveryFacts` |
| Operational build backlog | `0` (`110` ready examples and `41` ready decisions audited and excluded) | Recipe 1 (`01-the-build-backlog.js`) |
| Drift alarm (`implemented ∧ ¬ready`) | `0` | Recipe 2 (`02-the-drift-alarm.js`) |
| Design backlog (`defined ∧ ¬implemented`) | `17` Specs | Recipe 33 (`33-the-design-backlog.js`) |
| Open questions | `43` across `24` Specs (`16` blocking: `8` deferrals with triggers, `8` holds; `27` non-blocking) | Recipe 20 (`20-open-question-register.js`) |
| Shipped recipes | `43` runnable bodies under `dist/recipes/` | `docs/agent-surface/recipes.md` |

After updating any changed counts or commit links, stage the files and run `npm run check` to verify that `check:temporal`, `lint`, `format:check`, `test`, and `preflight` all exit `0`.
