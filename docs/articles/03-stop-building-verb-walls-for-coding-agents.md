# Stop Building 30-Verb CLI Walls for Coding Agents: Scripting the Delivery Graph with `sdp q` and Spec Studio

*Part 3 of 8 in a series introducing the Libar Software Delivery Protocol. Links and measurements are pinned to one commit; see the footer.*

When teams build CLI tools or MCP servers for AI coding agents, they almost always fall into the same trap: they build a **verb wall**.

First, they add `cli list-specs`. Then an agent needs to filter by readiness, so they add `--readiness`. Then an agent needs to see which tests verify a spec, so they add `cli show-verifiers`. Soon there are 30 subcommands and 80 flags. Yet the first time an agent asks a composite question—"show me every `defined` Spec in this Pack that has no blocking questions, together with the files that reference it"—no single verb answers. The agent makes 15 sequential tool calls, blows its context window on verbose CLI output, and stitches the join together in its own scratchpad.

In the **Libar Software Delivery Protocol**, we took the opposite path ([the agent surface scripts the graph decision, D5](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/agent-surface-scripts-graph.sdp.md); [the agent front door, MD-22](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/agent-front-door.sdp.md)):

> **Don't give coding agents a wall of verbs. Give them a visible, typed graph and one evaluation sink they can script.**

---

## 1. The Demand Map: How Coding Agents Actually Arrive

Before designing [`spec:consumers.agent-surface`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/agent-surface.sdp.md), we asked a simple question: *What is an agent holding in its hand when a session starts?*

Never the Spec ID it is looking for. An agent arrives holding one of three things—what the Protocol calls the **demand map**:

1. **A concept string** from a user prompt ("where do we enforce the readiness floor?").
2. **A file path** it is about to read or edit (`src/projections/census.ts`).
3. **A changeset** of modified files from `git diff` (`["src/reader/reader.ts", "src/cli/q-command.ts"]`).

So the Protocol's typed reader, `g` ([`spec:consumers.reader`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/reader.sdp.gherkin), itself authored in the Protocol's Gherkin carrier), freezes a deliberately small surface. Four members expose the graph as decoded data:

- `g.graph` — the raw graph schema, every node and edge, for any question the other members do not shape.
- `g.specs()` and `g.packs()` — one summary per Spec (its coordinates, stated and derived readiness, delivery facts, and Packs, already computed) and one per Pack (its title, framing, and carrier file).
- `g.findings()` — the validation report's findings, the same ones `sdp validate` prints.

Two members assemble per-node context: `g.specContext(id)` (one Spec with its sections, its relations in both directions with each edge's claim decoded, its bindings and verifiers, its design columns, the floor clauses it fails, and the findings that name it) and `g.packContext(id)` (one Pack as a review unit: framing, members in authored order, and its design and boundary).

The last three are the demand map's entry adapters:

- `g.findByConcept(term)` — a deterministic, case-insensitive substring match over IDs, titles, binding labels, Pack framing, Spec narratives, and section content, naming the field each match was found in.
- `g.byFile(path)` — every node the graph records at `path` (a Spec or Pack authored in that carrier, or a `CodeNode` or `Anchor` declared there, including zero-import `@sdp*` comment-form anchors), plus every Spec reachable from them.
- `g.blastRadius(files)` — the file-level impact of a changeset over the curated graph: the directly impacted Specs and Packs, the one-hop `atRisk` neighborhood with each connecting edge's type and claim, changed code units bound to no Spec (`unlinked`), and, crucially, **`coverageUnknown`**: the honest list of changed files at which the graph records nothing.

`blastRadius` deliberately never consults an import graph. The Protocol's two-surface rule (a corollary of [Principle P10](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/concept/01-founding-principles-and-invariants.md)) keeps mechanical structure inferred and apart: `sdp build --imports` can write a TypeScript adapter's file-level imports to `generated/imports.json` as external, inferred input, and the curation report (recipe 40, [`spec:consumers.impact-graph.curation-assist`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/impact-graph.curation-assist.sdp.md)) ranks load-bearing files no anchor covers and component imports that disagree with the anchored `uses` edges. That report assists a person curating anchors; it never adds an edge, a binding, or a delivery fact. A gap between the two surfaces is curation, not drift, because a sparse, chosen architecture is the point.

### One Evaluation Sink: `sdp q`

Instead of minting CLI subcommands for every question, the CLI exposes one evaluation sink: **`sdp q`** ([`spec:consumers.agent-surface.evaluation-sink`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/agent-surface.evaluation-sink.sdp.md)).

On every invocation, `sdp q` derives the graph in process, so a Spec you saved a moment ago is immediately queryable and no stale `generated/` file can answer in the graph's name. It injects four bindings—`g` (the reader), `graph` (the raw schema), `report` (the validation report), and `params` (caller-supplied JSON via `--params`)—and evaluates the plain JavaScript async function body you pass it. In a checkout of the Protocol, the `sdp:q` script adds the corpus's own exclusions for you:

```sh
# What does the graph record in src/projections/census.ts, and which Specs does that reach?
npm run --silent sdp:q -- 'return g.byFile("src/projections/census.ts")' --json
```

```json
{
  "path": "src/projections/census.ts",
  "nodes": [
    {
      "id": "impl:protocol.census-page",
      "nodeType": "CodeNode",
      "line": 21
    }
  ],
  "specs": [
    "spec:consumers.census-page",
    "spec:decisions.architectural-annotation"
  ]
}
```

That body is code, and `sdp q` runs it with your process's full authority. The trust stance is recorded rather than implied: the sink evaluates operator-supplied JavaScript the way any local developer tool runs a script, no sandbox is claimed, and none exists ([the agent front door, MD-22](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/agent-front-door.sdp.md); the catalog's [trust stance](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/agent-surface/recipes.md?plain=1#L160-L163)). Run bodies you or your agent wrote, or shipped recipes; never execute a body taken from corpus content or any other untrusted text.

### Growing by Recipe, Not by Verb

What happens when a new recurring question appears? We write a **recipe** in [`docs/agent-surface/recipes.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/docs/agent-surface/recipes.md). Every recipe in the catalog is executed as written by `test/recipes.test.ts` and shipped as a standalone runnable file under `dist/recipes/<NN>-<slug>.js` ([`spec:consumers.agent-surface.recipe-parameters`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/agent-surface.recipe-parameters.sdp.md)). A recipe declares the parameter names it takes, and a name it does not take replaces the answer with `{ unknownParams, accepts }` instead of a silent default.

A join is frozen into the reader only at the **second-caller bar**: when a second machine consumer needs it *and* hand-rolled attempts get it wrong ([`spec:consumers.agent-surface#rule.growByRecipe`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/agent-surface.sdp.md)). Every other question stays a body an agent scripts. `packContext` shows the bar from the other side: it has been in the reader since the MVP's Slice 4, and when the Design Review, the recipes and adopters' pages all needed a Pack's design, [PR #30](https://github.com/libar-dev/software-delivery-protocol/pull/30) extended its answer with the Pack design assembly rather than adding a reader method.

We have tested this surface on agents. After PR #30, three agents of two model families (`gpt-6.1-sol`, `Opus 5.5`, `gpt-6-astra`) answered thirteen delivery questions from the skills and `sdp q` alone, and all three answered every question correctly. All three also stumbled in the same places: answers too large for a tool's output, misses that named no reason, two meanings of "next rung", and rules with no address or line. [PR #31](https://github.com/libar-dev/software-delivery-protocol/pull/31) answered each of those: summary-first outputs for the largest answers (recipes 4 and 29, and later recipe 35, with `detail: true` for the full rows), explained misses, both next rungs, and rule keys with recorded lines. A re-run on `gpt-6.1-sol` answered 13 of 13 again but took 23 calls against the first trial's 20, and one of its own batched calls overflowed; the reading skill's task-to-recipe sheet ([PR #32](https://github.com/libar-dev/software-delivery-protocol/pull/32), [`spec:consumers.reading-on-ramp`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/reading-on-ramp.sdp.md)) is the answer to that.

---

## 2. Iterating on a Large Design, Pass After Pass

The real test of an AI-native delivery system is not a 10-Spec toy example. It is our first adopter, [`libar-platform`](https://github.com/libar-dev/libar-platform), which models a Convex transactional domain platform across **243 Specs in six capability Packs**, most of it design that will stay ahead of its code for months ([PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33); the adopter's side is [libar-platform#13](https://github.com/libar-dev/libar-platform/pull/13)).

Design at that scale happens in **design passes**: one round in which an agent or a person reads a Pack (or a list of Specs), finds the gaps, and proposes changes, and the next round starts from what that one changed. A pass reads three things beside the Specs themselves. A member's **footing** is every Spec it rests on through its typed dependencies, with the rung each one states and the floor each one reaches (recipe 21). A **pinned declaration** is a keyed Design entry whose value opens with a code span, stating one signature, type, validator, or table that a builder and a test author both hold to (recipe 24). And an **entry address**, such as `spec:<id>#design.<key>`, names one keyed entry so a pass can cite it exactly.

Four problems hit immediately at that scale, and the iteration loop answers each on the one graph:

### 1. Fitting a Pack into a Model's Context Budget (recipe 36)

Hand-assembling a pass's reading material (the Pack design, member sections, open questions, footing, pinned declarations, and examples) overflows a model's context. **The context bundle** ([`spec:consumers.context-bundle`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/context-bundle.sdp.md), recipe 36) composes it on demand within a hard budget, `100,000` by default.

The budget is counted in **UTF-16 code units**: the `.length` a JavaScript body reads, measured on the compact JSON of the answer. That count is deterministic on every machine and binds the Protocol to no model's tokenizer; the bundle reports a `tokenEstimate` beside it, labeled as an estimate (code units divided by four).

A bundle carries each question and each pinned declaration in one place only. If the scope still exceeds the budget, it cuts in a fixed order and stops at the first cut after which it fits: boundary rows down to their IDs, footing rows down to their IDs, member narratives, example step text, non-blocking question text, and section values other than pinned declarations. Only when the caller passes `declarations: "addresses"` does a seventh cut replace pinned declarations with their entry addresses, so the agent looks up only the signatures it needs. Member IDs, stated rungs, floors, blocking questions, and entry addresses are never cut, and the bundle never returns a partial member list: when even the protected content does not fit, the answer is `budgetExceeded: true` with the minimum length it needs.

On `libar-platform`, `pack:history-view` first needed at least 299,106 code units. PR #33 redesigned the bundle's shape (each member's file named once, cut entries reduced to an address or a line, a new footing cut) and added the opt-in declaration cut; with `declarations: "addresses"` the same Pack now fits in **93,806 of 100,000** units.

```sh
npm run --silent sdp:q -- "$(cat dist/recipes/36-the-context-bundle.js)" \
  --params '{"pack":"pack:design-iteration-v1","declarations":"addresses"}' --json
```

On the Protocol's own corpus, that eleven-member Pack fits in 87,185 units with nothing left out. Asked for `pack:self-hosting-v1`, all 276 of the Protocol's Specs, with declarations kept whole, the recipe answers `budgetExceeded: true` with a `protectedLength` of 409,404 rather than a bundle that silently drops members.

### 2. Comparing Design Passes at Entry Grain (recipe 35)

`git diff` shows changed lines; it does not tell you which Design keys changed, which open questions closed, or which readiness rungs moved since the last pass. **The design diff** ([`spec:consumers.design-diff`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/design-diff.sdp.md), recipe 35) takes the graph `sdp build` wrote at the base commit via `--params base=@path` and diffs the curated graph by Spec, section, and entry key, keeping code-binding changes separate from intent changes.

### 3. Handing Changes Back Safely (recipe 38)

Views never patch source files directly ([`spec:consumers.edit-model`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/edit-model.sdp.md)). Instead, a design pass returns a structured **change proposal** ([`spec:consumers.intent-composition.proposal`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/intent-composition.proposal.sdp.md)): a JSON document on the shipped schema [`schemas/sdp-proposal-1.schema.json`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/schemas/sdp-proposal-1.schema.json), where each change targets a Spec or an entry address (`#design.<key>`, `#ui.<key>`, `#question.<key>`, `#rule.<key>`).

**The proposal check** (recipe 38) takes the proposal and the graph written at the proposal's base commit, and reports, change by change, whether each target scope has moved since that base. It only reports: it applies nothing and writes no carrier. The caller that applies the proposal sends any change whose scope moved to a person, applies the others as ordinary source edits, and lands them only from a worktree on which `sdp validate` reports no error ([`spec:consumers.intent-composition#rule.changedScope`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/intent-composition.sdp.md)).

### 4. Running Project-Specific Architecture and Policy Rules (`sdp validate --rules`)

In PR #33, `libar-platform` retired the graph-side half of its custom Python checker, `check.py`, into `sdp validate --rules` ([`spec:validation.corpus-rules`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/corpus-rules.sdp.md)). A rules file is a `sdp q` body that returns `{ findings }`, where each finding is well-formed: a `validatorId` (the rule's own kebab-case ID), a `subjectId`, a `severity` of `error` or `warning`, and a `message`, with an optional `file` and `line`. A broken rule, or a finding missing one of those fields, fails the run rather than passing as clean.

So a shipped recipe whose answer carries findings is already a rules file. **The architecture walk** ([`spec:validation.architecture-constraints`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/validation/architecture-constraints.sdp.md), recipe 42) checks forbidden layer directions and isolated contexts against anchored `uses` edges. Here it forbids the `edge` layer from using the `domain` layer, at warning severity:

```sh
npm run --silent sdp -- validate . \
  --exclude explorations --exclude examples --exclude test/fixtures/import/parity \
  --rules dist/recipes/42-the-architecture-walk.js \
  --params '{"forbidden":[{"from":"edge","to":"domain"}],"severity":"warning"}'
```

Standard output keeps the Protocol's summary line untouched and tallies the corpus's own rules on a line of their own:

```text
validate: 0 errors · 6 warnings (conformance + honesty over the one graph)
corpus rules: 0 errors · 7 warnings · 0 of 1 files failed (the corpus's own rules)
```

On standard error, the Protocol's six findings come first (the corpus's five intentional prose-mention warnings and one pending verifier gap, both pinned by its own test oracle). Then each rules file prints a header and its findings:

```text
corpus rules dist/recipes/42-the-architecture-walk.js
[warning] forbidden-layer — component:protocol.cli uses component:protocol.graph: layer edge uses layer domain (component:protocol.cli to component:protocol.graph), a forbidden pair
[warning] forbidden-layer — component:protocol.cli uses component:protocol.model: layer edge uses layer domain (component:protocol.cli to component:protocol.model), a forbidden pair
…five more for the CLI and projections components
```

Drop `"severity":"warning"` and the same seven findings are errors: the corpus line reads `7 errors` and `sdp validate` exits `1`. The Protocol's own architecture does not forbid that direction, so this is a demonstration, not a defect; forbid a direction no edge takes, such as `domain` to `infrastructure`, and the corpus line reads `0 errors · 0 warnings`.

---

## 3. Spec Studio: The Static HTML Workbench for Human Reviewers

Agents are well served by `sdp q` and JSON. Humans reviewing a 20-member capability Pack do not want to read JSON, and the frozen Markdown Design Review's Pack member table already runs 13 columns wide.

In PR #33, we shipped phase 0 of the **Spec Studio** ([`spec:consumers.spec-studio`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.sdp.md); [the Studio renders derived HTML, MD-41](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/studio-html-surface.sdp.md); [the Studio is built from custom elements, MD-42](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/decisions/studio-web-components.sdp.md)).

Run one command from a checkout:

```sh
npm run --silent sdp -- studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

`sdp studio` publishes a deterministic static HTML page set under `generated/spec-studio/`. It is never committed, makes no network request when opened from `file://`, and also works from any static preview server:

- **No second graph in the browser.** Every join, claim, delivery fact, derived readiness, floor failure, and finding on a page was computed once by the reader during `sdp studio`. Six framework-free custom elements add filtering, open-all and close-all, copy buttons, search, and a build stamp without recomputing graph logic.
- **Readable Pack pages ([`spec:consumers.spec-studio.pack-page`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.pack-page.sdp.md)).** Each Pack page leads with a plain-language summary of where the design stands, then one collapsible card per member in authored reading order (its stated rung beside the floor it reaches, and its stated next rung with either `nothing blocks` or how many floor clauses are still unmet), then the Pack's four-part boundary: `Rests on`, `Rested on by`, `Verified by`, `Superseded by`.

![The libar-platform history-view Pack page in Spec Studio: a plain-language summary, the Pack framing, and collapsible member cards](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33/platform-pack.png)

*The `libar-platform` Pack page for `pack:history-view`: the summary the graph computes (19 members, 283 design entries and 169 pinned declarations, 53 open questions and none blocking), the framing, then the member cards.*

- **Addressable entries and open questions ([`spec:consumers.spec-studio.spec-page.core`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.spec-page.core.sdp.md)).** Every keyed Design entry (`#design.<key>`), UI entry (`#ui.<key>`), rule (`#rule.<key>`), and open question (`#question.<key>`) has a deep link and a one-click copy action for its full entry address. Each open question also shows the four optional fields only open questions carry: its `decider`, its `links`, its `provisional` answer, and its `trigger`.

![Open questions on a Spec Studio Spec page, each showing its blocking flag, its key with a copy button, its recorded line, and its text, followed by the Spec's keyed workflow rules with their lines](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33/platform-question.png)

*The open questions on a `libar-platform` Spec page, opened at its entry address `#question.verifyPassUnderPause`. These questions carry no optional fields; a question that does shows each one on its own labelled line.*

- **Shared concept search ([`spec:consumers.spec-studio.search`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/consumers/spec-studio.search.sdp.md)).** The search page bundles the same matcher that powers `g.findByConcept` in `sdp q` (shipped for browsers as the package's `./concept-match` subpath), and adds the keys authors coin, such as `verifyPassUnderPause`, and the file paths the graph records:

![Spec Studio search for OD-157: one matching Spec, with the fields searched listed and the matching open question shown under it with its section and line](https://raw.githubusercontent.com/libar-dev/software-delivery-protocol/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33/platform-search.png)

*Searching the `libar-platform` page set for `OD-157`, an identifier the adopter cites in its own Spec prose: one Spec matches, and the entry that mentions it is listed beneath with its line.*

All three screenshots were captured from `libar-platform`'s branch during PR #33, as [the screenshot notes](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/reviews/assets/pr33/README.md) record; publish the page set yourself to see the current pages.

---

## 4. Three Skills: How Agents Learn the Workflow

A powerful graph surface only helps if coding agents actually use it instead of falling back to `grep` and file scanning.

The Protocol ships three agent skills under [`.agents/skills/`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills). In the Protocol's own repository they are mandatory: [`AGENTS.md`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/AGENTS.md) requires an agent to load the matching skill before any corpus question, Spec authoring, or delivery-session routing. They also ship in the npm package, at `node_modules/@libar-dev/software-delivery-protocol/.agents/skills/`, for an adopter to point its agents at:

1. **[`sdp-agent-surface`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-agent-surface/SKILL.md)** — teaches the graph's shape, the task-to-recipe sheet, the wrap-and-filter idiom (run a shipped recipe inside your own body and filter its answer, rather than editing the recipe), and the **anti-anecdote rule**: *the derived graph outranks any summary or cached note; query the graph first, read files last*.
2. **[`sdp-authoring`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-authoring/SKILL.md)** — teaches the closed `.sdp.md` and `.sdp.gherkin` grammars, where unsettled truths live (blocking questions, `trigger:` deferrals, `provisional:` leans), how to choose honestly between `satisfies` and `references` when binding code, and how much to write.
3. **[`sdp-sessions`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/.agents/skills/sdp-sessions/SKILL.md)** — routes delivery sessions across five advisory work shapes (*Capture / refine*, *Design*, *Implement*, *Review*, *Close / slim*), with a re-measurable handoff template and **tripwires**: signs that work has slipped out of its shape, such as writing code during a design session or stating a rung for the author during a review. Its *Close / slim* shape names the **distillation boundary** ([`spec:model.enrichment-lifecycle`](https://github.com/libar-dev/software-delivery-protocol/blob/5a0b22c2d9ead98c900b60ed6209342fce2cbef6/specs/model/enrichment-lifecycle.sdp.md)): a Design entry may leave its Spec only once the Spec is implemented with a verifier and a bound artifact carries the entry. None of the shapes is a workflow state machine; every preflight is advisory.

---

## 5. Try the Agent Surface and Spec Studio

From a checkout of [`libar-dev/software-delivery-protocol`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6):

```sh
git clone https://github.com/libar-dev/software-delivery-protocol.git
cd software-delivery-protocol
git checkout 5a0b22c2d9ead98c900b60ed6209342fce2cbef6
npm ci   # also builds dist/ and dist/recipes/

# 1. Inspect the Pack design summary for pack:spec-studio-v1 (Recipe 29)
npm run --silent sdp:q -- "$(cat dist/recipes/29-pack-design.js)" \
  --params '{"pack":"pack:spec-studio-v1"}' --json

# 2. List the anchored uses edges that cross a layer or context, tallied by direction (Recipe 32)
npm run --silent sdp:q -- "$(cat dist/recipes/32-architecture-crossings.js)" --json

# 3. List every Design and UI entry whose key starts with a prefix (Recipe 41)
npm run --silent sdp:q -- "$(cat dist/recipes/41-the-key-family-register.js)" \
  --params '{"prefixes":["bundle","rule"]}' --json

# 4. Compare planned component designs against realized component: anchors (Recipe 43).
#    On the Protocol's own corpus this returns empty totals (designs: 0), because every
#    component is already realized in code; it is for adopters planning components ahead of code.
npm run --silent sdp:q -- "$(cat dist/recipes/43-planned-against-realized-components.js)" --json

# 5. Publish the Spec Studio, then open generated/spec-studio/index.html
npm run --silent sdp -- studio . --exclude explorations --exclude examples --exclude test/fixtures/import/parity
```

Never invoke a bare `sdp` inside this checkout: `npm run --silent sdp -- …` runs the package's own build, and `npm run --silent sdp:q -- …` adds the three exclusions that keep exploration exhibits, the separate worked example, and carrier-parity fixtures out of the self-hosting root. An adopter that installed the package runs `npx sdp …` from its own root instead.

---

## Where the Series Goes Next

This post closes the opening trio. **Part 1**, *The Spec Is the Prompt Is the Design* ([read it here](./01-the-spec-is-the-prompt-is-the-design.md), or [on GitHub](https://github.com/libar-dev/software-delivery-protocol/blob/ARTICLES_COMMIT/docs/articles/01-the-spec-is-the-prompt-is-the-design.md)), made the case for one graph. **Part 2**, *From Rough Idea to Verified Code* ([read it here](./02-walkthrough-intent-to-verified-code.md), or [on GitHub](https://github.com/libar-dev/software-delivery-protocol/blob/ARTICLES_COMMIT/docs/articles/02-walkthrough-intent-to-verified-code.md)), walked the loop from a Spec to a verified test. The next five installments tell specific stories from the Protocol's construction:

- **Part 4:** *Shared Language Is a Performance Feature: Ubiquitous Language, Rejecting Workflow Gates, and the Four-Way Carrier Competition*
- **Part 5:** *What We Learned Rebuilding `@libar-dev/architect`: Git Archaeology, the Annotation Reversal, and Honest Code Bindings*
- **Part 6:** *Executable Specifications Without Cucumber Glue: Typed Example Spaces, Generated Contracts, and Expected-Outcome Oracles*
- **Part 7:** *Designing a 243-Spec Platform Ahead of Its Code: Context Bundles, Entry Addresses, and Corpus Rules at Scale*
- **Part 8:** *Auditing 258 Self-Hosted Specs with Cross-Family AI Reviewers: Inside the 595-Finding Whole-Corpus Refresh*

---

*About this article: Part 3 of 8 in a series introducing the [Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6). Repository links and every command output are pinned to commit [`5a0b22c`](https://github.com/libar-dev/software-delivery-protocol/tree/5a0b22c2d9ead98c900b60ed6209342fce2cbef6), the merge of [PR #33](https://github.com/libar-dev/software-delivery-protocol/pull/33); re-run the commands rather than quoting the outputs at a later commit.*
