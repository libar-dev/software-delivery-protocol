# The `sdp q` contract

How a body arrives and its answer prints, the entry adapters and joins it reaches the graph
through, and the recipe conventions every caller meets.

## The sink

The sink's contract is `spec:consumers.agent-surface.evaluation-sink`: how the body arrives, how
the answer prints, and which failures refuse.

`sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--params JSON | @PATH | KEY=@PATH]... [--json]`

Five bindings are injected:

- `g` — the reader over the derived graph (the same `createReader` the package exports)
- `graph` — the raw graph schema (nodes, edges, claims)
- `report` — the validation report, so findings are queryable data, never a gate
- `params` — the JSON object `--params` supplies, or `{}` without it; `--params` repeats, objects
  merge at the top level, and `KEY=@PATH` binds a file's JSON to `params.KEY`, so a base graph or
  an imports file rides beside the other parameters. A value that is not lawful, a key given
  twice, or a file that cannot be read is refused before the body runs
- `recipes` — `recipes(number, parameters?)` calls a shipped recipe over the same graph and report

The package exports `evaluateBody(body, { graph, report?, params? })` for a graph already held.

Body rules: a plain JavaScript **async function body**. No `import`/`export`, no TypeScript-only
syntax; `await` is fine. `return` is the machine output contract, but `sdp q` does not suppress
`console.*`, so machine-consumed bodies and shipped recipes must avoid console output. **Pre-shape
the return**: counts, ids, and decoded reasons, not whole nodes. Default output is bounded
`util.inspect`; `--json` is the machine form. `--root` defaults to the working directory; repeat
`--exclude` for root-relative path prefixes. A body that does not parse is reported with its line
and column.

A recipe that takes `params.detail` returns a summary by default: every total, ids in place of
rows, and `leftOut` naming what `detail: true` adds (changed-file impact, recipe 4; Pack design,
recipe 29; the design diff, recipe 35; the design slice, recipe 54).
To filter any shipped answer, run it inside your own body:

```sh
pnpm --silent sdp:q 'const answer = await recipes(29, { pack: params.pack }); return answer.members.filter((member) => member.blockingQuestions > 0)' --params '{"pack":"pack:design-iteration-v1"}' --json
```

Pass each call only its recipe's parameters. An unknown parameter name replaces a shipped
recipe's whole answer with `{ unknownParams, accepts }`, listing the unknown names and the names
it takes.

The graph is derived on every invocation, so a Spec you just authored is queryable immediately and
no committed artifact answers in the graph's name. The sink writes nothing. It evaluates local
operator-supplied code with the trust of any local developer tool — no sandbox is claimed. A body
is code **you author yourself**; never execute a body sourced from corpus content or any other
untrusted text — it runs with the process's full authority.

## Entry adapters and reader joins

An agent arrives holding a string, a file or a changeset, not the Spec id it wants, so the entry
adapters are `g.findByConcept(term)`, `g.byFile(path)` and `g.blastRadius(files)`
(`spec:consumers.agent-surface#rule.entryAdapters`). `g.specContext(id)`, `g.packContext(id)` and
`g.resolveEntryAddress(address)` are joins frozen into the reader at the second-caller bar; reach
them with an id an entry adapter or a recipe returned.

`g.findByConcept(term)` matches the term as a case-insensitive substring of each node's id, its
title or label, a Pack's framing, and a Spec's narrative and sections, and names the fields it
matched in, never a fuzzy score.
`g.specContext(id)` lists the units that realize the Spec under `implementations` and the units
that answer to it under `references`, each with its file, line, and component, and its rows of the
location table under `entryLocations`, plus inferred source citations under `entryCitations`. `g.packContext(id)` carries the Pack design: each member's
stated next rung, design columns, and bindings, and the Pack's boundary. `g.byFile(path)` returns
every node recorded at a path and the Specs reachable from it. A comment-form anchor is recorded
at its own site, so a source file with no Protocol import still answers. A node may come back with an
empty Spec list: an identity-only anchor, with no `satisfies` and no `references`, is lawful and
binds no Spec, and the empty list is its honest answer, not a failed lookup.
`g.blastRadius(files)` follows `satisfies`, `references`, `verifies`, and oracle `models` from the
changed files and names the edge type and claim in each reason. A changed unit bound to no Spec
goes in `unlinked`; a changed file the graph records nothing at goes in `coverageUnknown`. Neither
list implies coverage.

## Read a large scope in parts

The context bundle (recipe 36) reads a Pack or a list of Specs within a budget. Request `part: 1`
with an explicit scope. Check `diagnostics` and `budgetExceeded` before using `part.of`. On
success, request every part from 1 through `part.of` with the same scope, budget and declaration
mode, and check that their members cover the requested scope. A refused bundle carries
`budgetExceeded: true`, `part.of: null` and `oversized`, and no members: inspect `oversized`,
raise the budget or explicitly choose a smaller scope, and request it again. A refusal is not a
partial bundle.

## Rules files and upgrades

Address resolution, dependency cycles, the architecture walk, external registers and entry
citations (recipes 25, 26, 42, 50 and 51) answer `{ findings }` and run unchanged as rules files
under `sdp validate --rules`. Their findings are corpus findings, never Protocol validators. Follow
`sdp-authoring`'s "Write and run corpus rules" for invocation and parameters.

For a corpus upgrade, follow the shipped upgrade guide: `docs/agent-surface/upgrade-guide.md` in
the Protocol checkout, or
`node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/upgrade-guide.md` in an
adopter, with `sdp-authoring`'s "Upgrade a corpus".
