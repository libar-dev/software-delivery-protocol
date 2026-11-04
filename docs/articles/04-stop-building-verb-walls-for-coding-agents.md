# Stop building 30-verb CLI walls for coding agents

*Part 4 in a series introducing the Libar Software Delivery Protocol. Links and measurements are pinned to one commit; see the footer.*

A CLI gains `list-specs`. Then it gains a readiness filter, a command for verifiers, another for relations and flags for every join. The agent still receives a question no command answers: "show every `defined` Spec in this Pack with no blocking questions and the files that reference it."

The agent makes a sequence of calls, receives more output than its context can hold and joins the results in scratch space. The tool has exposed many operations and little of the underlying model.

The Libar Software Delivery Protocol takes another path ([the agent front door, MD-22](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/decisions/agent-front-door.sdp.md)):

> Give coding agents a visible, typed graph and one evaluation sink they can script.

## Start with what the agent holds

Before designing [`spec:consumers.agent-surface`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/consumers/agent-surface.sdp.md), we asked what an agent has when a session starts. Usually it does not have the Spec ID it needs. It has one of three things, the demand map:

1. A concept string from a prompt, such as "where do we enforce the readiness floor?"
2. A file path it is about to read or edit.
3. A changeset from `git diff`.

The typed reader freezes a small set of entry adapters for those arrivals:

- `g.findByConcept(term)` searches IDs, titles, anchor labels, Pack framing, narratives and section values, and names the matching field.
- `g.byFile(path)` returns every node recorded at a path and the Specs reachable from them.
- `g.blastRadius(files)` reports directly impacted Specs and Packs, the explicit one-hop neighborhood, changed units linked to no Spec and `coverageUnknown` files.

`blastRadius` reads the curated graph. It does not claim exhaustive reach through imports. File-level imports supplied separately can support curation, but inferred structure never silently becomes authored architecture.

The reader also exposes decoded Spec and Pack summaries, per-node context and the raw graph. Those composable shapes matter more than the number of methods. An agent can filter and join them for the question it actually has.

## One evaluation sink

`sdp q` derives the graph in process on every invocation, then evaluates a plain JavaScript async-function body. It injects five bindings:

- `g`, the typed reader
- `graph`, the raw graph schema
- `report`, the validation report
- `params`, caller-supplied JSON
- `recipes`, a way to call shipped recipe bodies over the same graph

A Spec saved a moment ago is queryable immediately. No stale `generated/graph.json` answers in the graph's name.

```sh
npm run --silent sdp:q -- 'return g.byFile("src/projections/census.ts")' --json
```

At the pinned commit, that returns:

<!-- evidence:by-file -->
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
    "spec:decisions.architectural-annotation",
    "spec:model.structural-patterns"
  ]
}
```
<!-- /evidence:by-file -->

The body is code, and `sdp q` runs it with the local process's full authority. No sandbox exists. Run bodies you or your agent wrote, or shipped recipes. Never execute a body copied from corpus content or another untrusted source.

## Grow by recipe, not by verb

A recurring question becomes a recipe in [`docs/agent-surface/recipes.md`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/docs/agent-surface/recipes.md). Every recipe is executed as written by the test suite and shipped under `dist/recipes/`. The [generated baseline metrics](./README.md#step-3-re-derive-corpus-metrics) carry the recipe count at the pin.

A recipe takes documented parameters through `--params`. An unknown parameter returns `{ unknownParams, accepts }` rather than silently changing the question. A caller can also wrap a recipe in its own body and filter the answer, without editing the shipped body.

A join moves into the reader only at the second-caller bar: a second machine consumer needs it and hand-rolled attempts get it wrong. Everything else remains a script or recipe. This keeps the entry surface small without limiting the questions agents can ask.

## Compose the reading when the design gets large

Some questions need more than a small answer. A design pass over a Pack may need member sections, open questions, dependency footing, declarations, examples and the Pack boundary.

The context bundle, recipe 36, composes that reading on demand within a budget counted in UTF-16 code units. It states what it left out and never saves a second reading of the graph. When the whole scope cannot fit one budget, `part` returns ordered parts whose members together cover the scope. An oversized item is named rather than silently dropped ([`spec:consumers.context-bundle`](https://github.com/libar-dev/software-delivery-protocol/blob/b5e0a8bea1e3bedd48c616f96c9928e955792753/specs/consumers/context-bundle.sdp.md)).

The design slice, recipe 54, answers a different question. It reads a Pack or selected Specs as one design: internal relations, touched components, decisions, open questions and what each member needs next. It is a reading composed on each invocation, not a saved planning artifact.

Part 9 follows these mechanisms through the first adopter's design-at-scale work. The point here is that both are recipes over the same agent surface, not new CLI families.

## The surface improved under measured use

After [PR #30](https://github.com/libar-dev/software-delivery-protocol/pull/30), three agents from two model families answered thirteen delivery questions using the skills and `sdp q` alone. All three answered every question correctly. They also exposed recurring costs: oversized answers, unexplained misses, two meanings of "next rung" and rules without addresses or source lines.

[PR #31](https://github.com/libar-dev/software-delivery-protocol/pull/31) added summary-first answers, explained misses, both next rungs, rule keys and recorded lines. Its acceptance re-run on `gpt-6.1-sol` again answered 13 of 13 but took 23 calls against the first trial's 20 and overflowed one batched answer. The response, in [PR #32](https://github.com/libar-dev/software-delivery-protocol/pull/32), was not another verb. It was a task-to-recipe sheet in the `sdp-agent-surface` skill and better answer shapes, such as the impacted Packs in recipe 4's summary.

That is the useful feedback loop. The graph remains stable while the on-ramps and recipes improve from observed use.

## Repository-owned skills teach the workflow

A capable surface still needs an on-ramp. The package ships repository-owned skills, counted in the [generated baseline metrics](./README.md#step-3-re-derive-corpus-metrics), under [`.agents/skills/`](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753/.agents/skills):

- `sdp-agent-surface` teaches graph reading and the task-to-recipe map.
- `sdp-authoring` teaches the carriers, readiness floors, relations and bindings.
- `sdp-sessions` routes advisory delivery work shapes without making them workflow gates.
- `sdp-studio` covers publishing, reading and sharing the Studio and receiving composed intent.
- `sdp-vault` covers the generated Obsidian notes and the hand-off back to source.

Their standing rule is the anti-anecdote rule: the derived graph outranks a skill, a cached summary or a paraphrase. The skill teaches how to ask. The graph answers.

## People read the same graph differently

This article is about the agent surface, but the Protocol does not require people to consume JSON. The Studio, Design Review, census, Mermaid and Gherkin projections read the same graph for human tasks.

The Studio's browser code does not build a second graph. Its joins and derived values come from the reader during publication. Its composing panel hands wanted changes back as scoped intent rather than mutating source.

[Part 2](./02-one-graph-many-views.md) gives that side of the system its own article. The two surfaces matter together: an agent can inspect the same Spec and bindings a reviewer just saw, without translating between two delivery databases.

## Try the agent surface

From a checkout at the pinned commit:

```sh
git clone https://github.com/libar-dev/software-delivery-protocol.git
cd software-delivery-protocol
git checkout b5e0a8bea1e3bedd48c616f96c9928e955792753
npm ci

# Find a concept.
npm run --silent sdp:q -- "$(cat dist/recipes/06-where-is-this-concept.js)" \
  --params '{"term":"readiness floor"}' --json

# Read the owner's advisory roadmap.
npm run --silent sdp:q -- "$(cat dist/recipes/53-the-roadmap.js)" \
  --params '{"pack":"pack:roadmap"}' --json

# Read one Pack as a design, with summary rows.
npm run --silent sdp:q -- "$(cat dist/recipes/54-the-design-slice.js)" \
  --params '{"pack":"pack:spec-studio-v1"}' --json
```

In this source checkout, `npm run --silent sdp:q --` supplies the corpus's fixture exclusions. An adopter invokes the installed `sdp q` with its own root and exclusions.

## Up next

[Part 5: AI can shape the reading, but it cannot rewrite the record](./05-ai-can-shape-the-reading.md) separates what agents already do from a future AI presentation layer, including the reproducibility question that layer must answer.

---

*About this article: Part 4 in a series introducing the [Libar Software Delivery Protocol](https://github.com/libar-dev/software-delivery-protocol/tree/b5e0a8bea1e3bedd48c616f96c9928e955792753). Repository links and command outputs are pinned to commit `b5e0a8be`; re-run the commands rather than quoting them at a later commit.*
