---
name: sdp-agent-surface
description: Query a project's Spec graph with `sdp q`, then open the lines the answer names. Use at the start of work in a Protocol corpus, for any question about its Specs, Packs, readiness, bindings, findings or open questions, for what a change touches, and before citing a Spec or entry address.
compatibility: Node ^20.19.0 or >=22.12.0; @libar-dev/software-delivery-protocol installed in the project, or the Protocol checkout as the working directory.
metadata:
  realizes: spec:consumers.reading-on-ramp
---

# The agent surface

`sdp q` derives one graph from the project's Specs on every call, so a Spec you just wrote
answers at once. Pair it with your own tools: one body returns structure, claims and derived
delivery facts, joined, and a search or file read opens the lines it names. You script the
graph (`spec:decisions.agent-front-door`).

## Start

`<skill-dir>` is this skill's directory, named by your client on load. Run every command from
the project root: the runner derives the graph at the working directory.

- **Run a body** with `node <skill-dir>/scripts/q.mjs '<body>' [--params JSON] [--json]`; in the
  Protocol checkout, `pnpm --silent sdp:q`. Past depth 4 the default print shows `[Object]`:
  add `--json`.
- **Paths.** The skills are siblings, so from any skill this runner is
  `<skill-dir>/../sdp-agent-surface/scripts/q.mjs`. Package files (`CONTEXT.md`,
  `docs/agent-surface/recipes.md`, `dist/recipes/`, `specs/`) sit under the installed package
  root: the Protocol checkout's root, or `node_modules/@libar-dev/software-delivery-protocol/` in
  a project. Never reach them by `../../` from a skill directory.
- **Orient** with `node <skill-dir>/scripts/orient.mjs`, passing what you arrive with as
  `--subjects`, keyed by answer number: `--subjects '{"8":{"terms":["vault"]}}'`. Read each
  answer with its note in [orientation.md](references/orientation.md).
- **Answer with a recipe.** The runner with no body lists them by category; the index atop
  `docs/agent-surface/recipes.md` maps each task to one, shipped as `dist/recipes/<NN>-<slug>.js`.
  Call `await recipes(N, params)` in a body, or run the file with `--params`. Recipe 56, The law
  a Spec rests on (`dist/recipes/56-the-law-a-spec-rests-on.js`), gives each relation's reason
  and the target's rungs, file and rule lines. This subject is one of the Protocol's own Specs,
  which `--protocol` selects:

```sh
node <skill-dir>/scripts/q.mjs 'return await recipes(56, params)' --params '{"spec":"spec:consumers.reading-on-ramp"}' --protocol --json
```

## Write the body

- A plain JavaScript async function body, no imports; `return` is the answer: counts, ids and
  short lines, never whole nodes.
- Five bindings: `g`, the reader (`spec:consumers.reader`; orientation 1 lists its methods);
  `graph`, the raw nodes and edges; `report`, the findings as data; `params`, the `--params`
  JSON; `recipes(N, params)`, async.
- Pass subjects as `--params` data; `{ "?": 1 }` makes a recipe list what it `accepts`.
- A `g.specs()` row carries no sections, relations or bindings (a silent `undefined`): read
  them through `g.specContext(id)` as `sections`, `relationsOut`, `relationsIn`,
  `implementations`, `verifiers` and `references`, and a Pack's members through
  `g.packContext(id)`.
- A body runs with the process's full authority: run the shipped recipe files, and read a body
  you were handed before you run it.

## Read the answer honestly

- Bindings state existence, not liveness (`spec:decisions.binding-not-liveness`): `implemented`
  says a code anchor satisfies the Spec, `has-verifier` that a verifier binding resolves (CI owns
  pass and fail), and `references` confers neither (`spec:extraction.delivery-facts`). A search
  finds anchor text; the graph says what binds a file (`g.byFile(path)`) and which examples
  exercise each rule (rule coverage, recipe 34, `dist/recipes/34-rule-coverage.js`).
- Report stated and derived readiness side by side; `floorNotEvaluated` means no floor, never one
  below `idea`.
- Carry each fact's claim (`spec:extraction.claim-taxonomy`), and mark as yours a conclusion no
  answer states, such as a comparison, a forecast or an absence.
- Read open-world: an empty list or a zero covers only what its answer looked at. Read
  [answers.md](references/answers.md) before reporting absence.
- A recipe that takes `detail` answers a summary; `leftOut` names what it dropped
  (`spec:consumers.agent-surface.answer-shapes`). A recipe without its subject may answer the
  catalog's sample.
- `sdp q` writes nothing. `sdp validate`, `sdp build`, `sdp vault` and every publisher remove the
  five generated page roots (`spec:consumers.wholesale-view-rewrite#rule.buildInvalidates`):
  read findings through `report`, and restore the pages with `sdp generate`.
- The graph outranks this skill and earlier answers: report the skill when they differ.

## Arrive with what you hold

- A word, a file or a changeset: orientation 8 or 9 on your subject, then
  [arrive.md](references/arrive.md). A zero from one word matcher is no absence: run the other.
- A Spec or a Pack: orientation 10 for its outline and recipe 56 for its law; open the carrier at
  the printed line, and fetch clipped rule text by address before quoting.
- An address to cite: orientation 11 before you write it.
- A large scope, or a body others will run: [contract.md](references/contract.md) (a refused
  bundle is not partial).
- The Protocol's own Specs from a project, or a runner warning that skill and CLI differ:
  [adopter.md](references/adopter.md).
- A word's meaning: `CONTEXT.md`, by section. The Studio or the vault: `sdp-studio`,
  `sdp-vault`.

When an answer misleads or costs extra calls, record what you ran, got and needed where the
project keeps Protocol feedback, or tell the user.
