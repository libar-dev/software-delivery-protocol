---
name: sdp-agent-surface
description: Query the project's Spec graph through `sdp q` before reading spec files, then open the exact lines it points at. Use whenever a question is about the authored corpus — what a Spec says or guarantees, who verifies it, what is ready but unimplemented, what a change touches, what is still open or blocking, what a Spec depends on, where a concept lives, which Specs are in a Pack, what a component contains or uses, what code references a design, or what the validation report says. Also use at the start of any work in the Protocol's own repository, before editing `.sdp.md` files, before writing a Spec citation, and before answering "is this implemented / verified / ready".
compatibility: Node ^20.19.0 or >=22.12.0, with @libar-dev/software-delivery-protocol installed in the project, or the Protocol's source checkout as the working directory.
---

# The agent surface

A project that uses the Protocol keeps its delivery intent as typed Specs, and `sdp q` derives
one graph from them on every call. Use it with your own tools, not instead of them: one body
answers structure, claims, derived delivery facts and the graph's own blind spots, and a text
search or a file read then opens the exact lines the answer names. Reading carriers to learn
state rebuilds, slowly and partially, what the graph already holds. The surface is
`spec:consumers.agent-surface`, shaped by the agent front door decision,
`spec:decisions.agent-front-door`: you script the graph, there is no verb wall.

## Start

Paths are relative to this skill's folder; run the scripts from the project root.

1. **Run a body:** `node scripts/q.mjs '<body>' [--params JSON] [--json]`. The runner picks the
   CLI: in the Protocol source checkout the built one with its fixture exclusions (the same
   command as `pnpm --silent sdp:q`), anywhere else the project's installed package. Never call a
   bare `sdp`.
2. **Orient:** `node scripts/orient.mjs` runs the eleven orientation queries over one graph and
   names, for each answer, the notes in [orientation.md](references/orientation.md) that say how
   to read it. In the Protocol checkout it opens every session; in another corpus, run it before
   the first corpus question of a session.
3. **Answer with a recipe:** find the task in [the task sheet](references/tasks.md), then call
   `await recipes(n, params)` inside a body, or run the shipped file `dist/recipes/<NN>-<slug>.js`.
   The catalog, `docs/agent-surface/recipes.md` (in an adopter,
   `node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md`), owns each
   recipe's parameters and answer fields.

## Write the body

- A plain JavaScript async function body with no imports. `return` is the output: pre-shape it
  into counts, ids and short lines, never whole nodes. Large answers flood.
- Five bindings: `g`, the reader (`graph specs packs findings findByConcept byFile blastRadius
resolveEntryAddress specContext packContext`); `graph`, the raw nodes and edges; `report`, the
  validation findings as data; `params`, the `--params` JSON; and `recipes(n, params)`, which is
  async, so `await` it.
- Pass a subject as `--params` data, never by editing a body. An unknown parameter returns
  `{ unknownParams, accepts }` in place of the answer.
- `g.specs()` rows carry no sections, relations or bindings: read those through
  `g.specContext(id)`, and a Pack's members through `g.packContext(id)`.
- Run only bodies you wrote yourself. A body runs with the process's full authority.

The full contract, the entry adapters, summary and detail answers, large scopes and rules files:
[contract.md](references/contract.md). Node, edge and claim types, every field name and how
delivery facts derive: [graph.md](references/graph.md).

## Read the answer honestly

- `implemented` says a code anchor binds the Spec, not that it is live. `has-verifier` says a
  verifier binding resolves, not that tests pass. `references` confers neither.
- Stated and derived readiness are separate coordinates: report both when they differ.
- An empty list or a zero covers only what that answer looked at. Read
  [answers.md](references/answers.md) before reporting absence.
- The graph outranks this skill, any summary and any earlier answer. When they disagree, report
  the skill as the bug.
- `sdp q` writes nothing. `sdp validate`, `sdp build` and every publisher remove the five page
  roots first: read findings through `report`, and read [publishing.md](references/publishing.md)
  before running one.

## More

- [addresses.md](references/addresses.md): entry addresses such as `spec:<id>#rule.<key>`. Read
  it before citing one.
- [adopter.md](references/adopter.md): the direct `sdp q` forms, loading these skills from the
  installed package, and reading the Protocol's own Specs from a project that uses it.

When an answer misleads you or costs extra calls, record one row where the project keeps feedback
on the Protocol (for example `docs/feedback/`): what you wanted, ran and got, what you did instead,
and the cost. Do not reconcile the gap in your head. The vocabulary is the Protocol's ratified
glossary, `CONTEXT.md`, which the package also ships.
