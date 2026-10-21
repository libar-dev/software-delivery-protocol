# Stop Building 30-Verb CLI Walls for Coding Agents: Scripting the Delivery Graph with `sdp q` and Spec Studio

> *Series: Introducing the [Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) (Part 3 of 8) · All links and measurements pinned to commit [`5a0b22c`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) ([PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33)).*

When teams build CLI tools or MCP servers for AI coding agents, they almost always fall into the same trap: they build a **verb wall**.

First, they add `cli list-specs`. Then an agent needs to filter by readiness, so they add `--readiness`. Then an agent needs to see which tests verify a spec, so they add `cli show-verifiers`. Soon there are 30 subcommands and 80 flags. Yet the first time an agent asks a composite question—"show me every `defined` Spec in this Pack that has no blocking questions, together with the files that reference it"—no single verb answers. The agent makes 15 sequential tool calls, blows its context window on verbose CLI output, and stitches the join together in its own scratchpad.

In the **Libar Software Delivery Protocol**, we took the opposite path ([the agent-surface-scripts-graph decision, D5](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/agent-surface-scripts-graph.sdp.md); [the agent front door, MD-22](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/agent-front-door.sdp.md)):

> **Don't give coding agents a wall of verbs. Give them a visible, typed graph and one evaluation sink they can script.**

---

## 1. The Demand Map: How Coding Agents Actually Arrive

Before designing [`spec:consumers.agent-surface`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/agent-surface.sdp.md), we asked a simple question: *What is an agent holding in its hand when a session starts?*

Almost never a `Spec` ID. In practice, an agent arrives holding one of three things—what the Protocol calls the **demand map**:

1. **A concept string** from a user prompt ("where do we enforce the readiness floor?").
2. **A file path** it is about to read or edit (`src/projections/census.ts`).
3. **A changeset** of modified files from `git diff` (`["src/reader/reader.ts", "src/cli/q-command.ts"]`).

So the Protocol's typed [`reader`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/reader.sdp.md) (`g`) freezes **only** the decoded graph joins (`specs()`, `packs()`, `specContext(id)`, `packContext(id)`) plus those three entry adapters:

- `g.findByConcept(term)` — searches titles, narratives, section content, coined camelCase keys, and model terms.
- `g.byFile(path)` — returns every `CodeNode` or `Anchor` recorded at `path` (including zero-import `@sdp*` comment-form anchors) and the `Spec`s reachable from it.
- `g.blastRadius(files)` — computes the file-level impact over the curated graph: directly impacted `Spec`s and `Pack`s, the one-hop `atRisk` neighborhood with each connecting edge's type and `claim`, changed identity-only `unlinked` units, and—crucially—**`coverageUnknown`**, the honest list of changed files the graph records nothing at.

### One Evaluation Sink: `sdp q`

Instead of minting CLI subcommands for every question, the CLI exposes one evaluation sink: **`sdp q`** ([`spec:consumers.agent-surface.evaluation-sink`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/agent-surface.evaluation-sink.sdp.md)).

On every invocation, `sdp q` derives the graph in process (so a Spec you edited two seconds ago is immediately live, with no stale cache), injects four bindings—`g` (the reader), `graph` (the raw schema), `report` (the validation report), and `params` (caller-supplied JSON via `--params`)—and evaluates the plain JavaScript async function body you pass it:

```sh
# What Specs and code units live in src/projections/census.ts?
npm run --silent sdp:q -- 'return g.byFile("src/projections/census.ts")' --json
```

```json
{
  "path": "src/projections/census.ts",
  "nodes": [
    {
      "id": "impl:protocol.census-page",
      "nodeType": "CodeNode",
      "line": 20
    }
  ],
  "specs": [
    "spec:consumers.census-page",
    "spec:decisions.architectural-annotation"
  ]
}
```

### Growing by Recipe, Not by Verb

What happens when a new recurring question appears? We write a **recipe** in [`docs/agent-surface/recipes.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/agent-surface/recipes.md). Every recipe in the catalog is executed verbatim by `test/recipes.test.ts` and shipped as a standalone runnable file under `dist/recipes/<NN>-<slug>.js` ([`spec:consumers.agent-surface.recipe-parameters`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/agent-surface.recipe-parameters.sdp.md)).

A join only graduates into the `reader` at the **second-caller bar**: when at least two distinct consumers need it *and* hand-rolled scripts get the edge semantics wrong (for example, `packContext`'s Pack design assembly in [PR #30](https://github.com/libar-dev/software-delivery-protocol/pull/30)). Everything else stays a composable recipe.

When we tested this surface in a usability trial across three frontier models (`gpt-6.1-sol`, `Opus 5.5`, `gpt-6-astra`; see [PR #31](https://github.com/libar-dev/software-delivery-protocol/pull/31)), all three models answered 13 out of 13 delivery questions from the skills and `sdp q` alone without opening a single `.sdp.md` file—and their friction points directly shaped summary-first recipe outputs (`detail: true`), unknown-parameter diagnostics (`{ unknownParams, accepts }`), and rule-level source lines.

---

## 2. Iterating on a Large Design Pass After Pass

The real test of an AI-native delivery system is not a 10-Spec toy example. It is our first adopter, `libar-platform`, which models a Convex transactional domain platform across **243 Specs in six capability Packs**—most of it designed months ahead of its code ([PR #26](https://github.com/libar-dev/software-delivery-protocol/pull/26), [PR #31](https://github.com/libar-dev/software-delivery-protocol/pull/31), [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33)).

At that scale, four problems hit immediately—and the Protocol's iteration loop solves each one on the one graph:

### 1. Fitting a Pack into a Model's Context Budget (`recipe 36`)
When an agent runs a design pass over a capability Pack, hand-assembling the Pack design, member sections, open questions, dependency footing, pinned declarations, and examples overflows the context window (`pack:history-view` in `libar-platform` was nearly 300,000 UTF-16 code units).

**The Context Bundle ([`spec:consumers.context-bundle`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/context-bundle.sdp.md), recipe 36)** composes a pass's reading material on demand within a hard character budget (default `100,000` UTF-16 code units). It stores each question and pinned declaration once, and if the Pack exceeds the budget, it applies a deterministic **seven-step cut order**—trimming boundary details to IDs, footing details to IDs, narratives, example steps, non-blocking questions, non-declaration section entries, and finally (when opted in with `declarations: "addresses"`) replacing pinned declarations with their entry addresses (`spec:id#design.key`) so the agent can look up only the signatures it needs. It never returns a partial member list. On `libar-platform`'s `pack:history-view`, `declarations: "addresses"` brings a 299k-unit Pack cleanly down to **93,806 units**.

```sh
npm run --silent sdp:q -- "$(cat dist/recipes/36-the-context-bundle.js)" \
  --params '{"pack":"pack:design-iteration-v1","declarations":"addresses"}' --json
```

### 2. Comparing Design Passes at Entry Grain (`recipe 35`)
`git diff` shows changed lines; it does not tell you which Design keys changed, which open questions closed, or which readiness rungs moved since the last design pass. **The Design Diff ([`spec:consumers.design-diff`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/design-diff.sdp.md), recipe 35)** takes a base `graph.json` via `--params base=@path` and diffs the curated graph by Spec, section, and entry key, keeping code-binding changes separate from intent changes.

### 3. Handing Changes Back Safely (`recipe 38`)
Views never patch source files directly ([`spec:consumers.edit-model`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/edit-model.sdp.md)). Instead, a design pass returns a structured **Change Proposal** ([`spec:consumers.intent-composition.proposal`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/intent-composition.proposal.sdp.md))—a JSON document validated against [`schemas/sdp-proposal-1.schema.json`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/schemas/sdp-proposal-1.schema.json)—where each item targets a Spec section or entry address (`spec:id#rule.key`, `#design.key`, `#question.key`). Before an agent applies the proposal as an ordinary source edit, **the Proposal Check (recipe 38)** verifies whether any target scope moved since the proposal's base commit; any scope that moved is routed to a human.

### 4. Running Project-Specific Architecture & Policy Rules (`sdp validate --rules`)
In [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33), `libar-platform` retired the graph-side half of its custom Python checker (`check.py`) into `sdp validate --rules`. Because any `sdp q` body returning `{ findings }` is a valid rules file, shipped recipes like **the Architecture Walk ([`spec:validation.architecture-constraints`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/architecture-constraints.sdp.md), recipe 42)** run directly inside `sdp validate`:

```sh
node dist/cli/sdp.js validate . \
  --exclude explorations --exclude examples --exclude test/fixtures/import/parity \
  --rules dist/recipes/42-the-architecture-walk.js \
  --params '{"forbidden":[{"from":"domain","to":"edge"}]}'
```

```text
validate: 0 errors · 6 warnings (conformance + honesty over the one graph)
corpus rules: 0 errors · 0 warnings · 0 of 1 files failed (the corpus's own rules)
```

---

## 3. Spec Studio: The Static HTML Workbench for Human Reviewers

Agents love `sdp q` and JSON. Humans reviewing a 20-member capability Pack do not want to read JSON, and once a Pack grows rich with design columns, open questions, and code bindings, a flat Markdown table becomes 13 columns wide.

In [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33), we shipped Phase 0 of the **Spec Studio** ([`spec:consumers.spec-studio`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.sdp.md); [the Studio renders derived HTML, MD-41](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/studio-html-surface.sdp.md); [built from custom elements, MD-42](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/studio-web-components.sdp.md)).

Run one command:

```sh
node dist/cli/sdp.js studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

`sdp studio` publishes a deterministic, zero-network static HTML site under `generated/spec-studio/` that opens directly from `file://` in any browser or hosts on any static preview server:

- **No second graph in the browser.** Every join, claim, delivery fact, readiness floor, and finding on the page was computed once by the `reader` during `sdp studio`. Six framework-free Web Components add filtering, collapsible cards, address-copy buttons, and instant search without recomputing graph logic.
- **Readable Pack pages ([`spec:consumers.spec-studio.pack-page`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.pack-page.sdp.md)).** Each Pack page leads with a plain-language summary of where the design stands, followed by collapsible member cards in authored reading order and the Pack's four-part boundary (`Rests on`, `Rested on by`, `Verified by`, `Superseded by`):

![The platform's history-view Pack page in Spec Studio](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33/platform-pack.png)

- **Addressable open questions and section entries ([`spec:consumers.spec-studio.spec-page.core`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.spec-page.core.sdp.md)).** Every keyed Design entry (`#design.<key>`), UI entry (`#ui.<key>`), rule (`#rule.<key>`), and open question (`#question.<key>`) has a deep link and a one-click address copy action, displaying its `decider`, `links`, `provisional` answer, and `trigger`:

![A Spec page's open questions with keyed addresses and fields in Spec Studio](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33/platform-question.png)

- **Shared concept search ([`spec:consumers.spec-studio.search`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.search.sdp.md)).** The browser search page bundles the exact same `./concept-match` matcher that powers `g.findByConcept` in `sdp q`, indexing Spec prose, coined camelCase keys (`verifyPassUnderPause`), pinned declarations, and file paths:

![Searching for decision register ID OD-157 in Spec Studio](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33/platform-search.png)

---

## 4. Three Mandatory Skills: How Agents Learn the Workflow

A powerful graph surface only helps if coding agents actually use it instead of falling back to `grep` and file scanning.

The Protocol ships three repository-owned agent skills under [`.agents/skills/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills) (included in the npm package so every adopter gets them automatically):

1. **[`sdp-agent-surface`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-agent-surface/SKILL.md)** — Teaches the graph shape, the task-to-recipe lookup table, the wrap-and-filter idiom, and the **anti-anecdote rule**: *the derived graph outranks any summary or cached note; query the graph first, read files last*.
2. **[`sdp-authoring`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-authoring/SKILL.md)** — Teaches the closed `.sdp.md` and `.sdp.gherkin` grammars, where unsettled truths live (blocking questions, `trigger:` deferrals, `provisional:` leans), how to choose honestly between `satisfies` and `references`, and when to slim implemented design detail past the **distillation boundary**.
3. **[`sdp-sessions`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-sessions/SKILL.md)** — Routes delivery sessions across five advisory work shapes (*Capture*, *Design*, *Implement*, *Review*, *Close/Slim*), complete with tripwires and a re-measurable handoff template—without ever turning those shapes into a workflow state machine.

---

## 5. Try the Agent Surface and Spec Studio

From a checkout of [`libar-dev/software-delivery-protocol`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6) after `npm ci`:

```sh
# 1. Inspect the Pack design summary for pack:spec-studio-v1 (Recipe 29)
npm run --silent sdp:q -- "$(cat dist/recipes/29-pack-design.js)" \
  --params '{"pack":"pack:spec-studio-v1"}' --json

# 2. Check all 43 anchored uses edges across layers and contexts (Recipe 32)
npm run --silent sdp:q -- "$(cat dist/recipes/32-architecture-crossings.js)" --json

# 3. Search for a family of keyed Design entries by prefix (Recipe 41)
npm run --silent sdp:q -- "$(cat dist/recipes/41-the-key-family-register.js)" \
  --params '{"prefixes":["bundle","rule"]}' --json

# 4. Compare planned component designs against realized component: anchors (Recipe 43)
npm run --silent sdp:q -- "$(cat dist/recipes/43-planned-against-realized-components.js)" --json
```

---

## Where the Series Goes Next

With the launch manifesto ([Part 1](./01-the-spec-is-the-prompt-is-the-design.md)), the hands-on code walkthrough ([Part 2](./02-walkthrough-intent-to-verified-code.md)), and the agent surface & Spec Studio tour (Part 3) in place, the upcoming installments in the [Media Plan](./README.md) dive into specific architectural stories from the Protocol's construction:

- **Part 4:** *Shared Language Is a Performance Feature: Ubiquitous Language, Rejecting Workflow Gates, and the Four-Way Carrier Competition*
- **Part 5:** *What We Learned Rebuilding `@libar-dev/architect`: Git Archaeology, the Annotation Reversal, and Honest Code Bindings*
- **Part 6:** *Executable Specifications Without Cucumber Glue: Typed Example Spaces, Generated Contracts, and Expected-Outcome Oracles*
- **Part 7:** *Designing a 240-Spec Platform Ahead of Its Code: Context Bundles, Entry Addresses, and Corpus Rules at Scale*
- **Part 8:** *Auditing 276 Self-Hosted Specs with Cross-Family AI Reviewers: Inside the 595-Finding Whole-Corpus Refresh*
