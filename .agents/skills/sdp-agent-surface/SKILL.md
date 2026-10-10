---
name: sdp-agent-surface
description: Query this repository's Spec graph through `sdp q` instead of reading spec files by hand. Use whenever a question is about the authored corpus — what a Spec says or guarantees, who verifies it, what is ready but unimplemented, what a change touches, what is still open or blocking, what a Spec depends on, where a concept lives, which Specs are in a Pack, what a component contains or uses, what code references a design, what the census or projections will see, or what the validation report says. Also use before editing `.sdp.md` files, before writing a Spec citation, and before answering "is this implemented / verified / ready".
---

# The agent surface

This repository models its own delivery lifecycle as typed `Spec` documents and derives **one
graph** from them. The graph — not the files — is the read model. The surface you read it through
is `spec:consumers.agent-surface`, realized by the front door
`spec:decisions.agent-front-door` (MD-22): the package exports the reader, and the CLI carries one
evaluation sink. There is no verb wall — you script the graph.

## The shape of the graph

The graph is flat: one array of nodes, one array of edges, nothing nested. Hierarchy is edges, so
every question is a filter or a join, never a tree walk. Four node types exist:

- `Primitive` — one authored Spec, positioned by `specKind` × `altitude` × `readiness`, carrying
  its title, narrative, reified section content, and the derived `deliveryFacts`. Use case, NFR,
  decision record, epic, and story are coordinates on this one type, never separate node types.
- `Pack` — the review grouping: title, framing prose, `modelRefs`. Membership is `belongsTo`
  edges. A Pack states no system truth.
- `Anchor` — a test or oracle binding, with the `file` and `line` of the binding itself.
- `CodeNode` — the code unit a code anchor mints, from either form: a `codeAnchor` constant or a
  comment-form block whose id sits in the `impl:`, `api:`, or `component:` namespace. It carries
  `file`, `line`, an optional `label`, and three optional structural attributes: `role`, the
  architectural pattern the unit plays, on any unit; and on a `component:` unit only, `layer` (one
  of `edge`, `application`, `domain`, `adapter`, `infrastructure`) and `context`, its bounded
  context. None of the three confers anything. Structural `memberOf` and `uses` edges run between
  these units.

Twelve edge types exist, and the list is closed. Six are authored Spec relations: `refines`,
`dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, `supersedes`. Six are derived by
extraction: `belongsTo` (Pack membership), `satisfies` (code realization, one edge per target),
`references` (code that answers to a design), `models` (oracle binding), `memberOf` and `uses`
(anchored structure). A `references` edge runs from a code unit to a Spec and says only that the
code answers to that design without claiming to realize it: it confers no delivery fact, moves no
readiness floor, and the drift alarm ignores it. It runs one way. A design that builds on existing
code states that through its own `dependsOn` or `refines` to the Spec the code satisfies, so read
that dependency from the Spec's relations, never from the code. A relation name outside this list
is a bug in whatever prose named it, not a query to attempt. IDs are namespaced (`spec:` · `pack:`
· `impl:` · `api:` · `component:` · `test:` · `oracle:`), and an edge whose target does not
resolve confers no delivery fact. Every node and edge carries exactly one claim; the edge contract is
`spec:extraction.derive-graph`, the claim law is `spec:extraction.claim-taxonomy`.

## How delivery state derives

Every fact enters the graph through one of three claims, and the claims are never collapsed.
Carrier prose, relations, and stated readiness are `declared` intent. Source anchors are `anchored`
bindings: a code anchor's `satisfies` records that this code realizes that Spec and its `references`
records only that the code answers to it, a test anchor records that this test verifies
its target Specs, an oracle anchor records that this function models that example space.
Structure the extractor computes on its own enters as `inferred`.

Delivery facts fall out of those edges. A Spec is `implemented` when a `satisfies` edge resolves to
it directly; the fact never travels through refinement. A Spec has `has-verifier` through either of
two routes: a resolving `specTest` anchor verifies the Spec directly, or a verifying example is an
enabled verifier, meaning that example is itself backed by a resolving `specTest` anchor. The
test's anchored `verifies` edge and the example's declared `verifies` edge share one relation type
under two claims. Stated readiness, derived readiness, and delivery facts are three
independent coordinates, and the standing queries (build backlog, drift alarm, readiness
divergence) are intersections of them. Runtime liveness would be `observed`, a designed-and-deferred
fact the graph does not derive today.

## Bootstrap discipline

For any corpus question, **query the graph before reading spec files**.

In an adopter, use the repository's package runner or its documented wrapper script. Select that
repository's root and repeat only the exclusions its corpus needs:

```sh
pnpm exec sdp q 'return g.specs().length' --root PATH --exclude PATH
pnpm exec sdp q 'return g.specContext("spec:example.id")' --root PATH --exclude PATH --json
```

`PATH` is a placeholder, not a universal exclusion.

When working in the **Protocol source checkout itself**, use its repository script, which supplies
the exact three fixture exclusions:

```sh
pnpm --silent sdp:q 'return g.specs().length'
pnpm --silent sdp:q 'return g.specContext("spec:consumers.reader")' --json
```

Those exclusions are required only for the Protocol source tree: it carries deliberate
duplicate-id and carrier-parity fixtures. They are the same list `npm run generate:self-hosting`
passes. Run `npm run build` first if `dist/` is absent. Do not use `pnpm exec` in this source
checkout: `exec` resolves dependency binaries, while this package does not link itself into its
own `node_modules/.bin`; an unresolved `sdp` can select macOS's unrelated binary. Do not invoke a
global `sdp` either.

The public projection publishers are `sdp view`, `sdp census`, `sdp mermaid`, and `sdp gherkin`.
In this source checkout, use `npm run generate:self-hosting` or `npm run check:self-hosting` when
all four roots must be published or certified together.

The catalog contains twenty-eight ready-made bodies in `docs/agent-surface/recipes.md` in the
Protocol repository and
`node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md` in an adopter.
Recipes 1-28 each open under a numbered heading that names the recipe. Every body there runs
verbatim and a test proves it. Start from a recipe; adapt it in place.

A recipe that takes a subject (a Spec id, a Pack id, changed files, addresses, a term) reads it
from `params.<name>`, and the catalog names the parameter. Pass it as JSON data with `--params`,
never by editing the body; `--params @PATH` reads the JSON from a file. The build also ships each
body as `dist/recipes/<NN>-<slug>.js`, so run it as shipped:

```sh
pnpm --silent sdp:q "$(cat dist/recipes/03-what-does-this-spec-guarantee-and-who-verifies-it.js)" --params '{"spec":"spec:consumers.reader"}' --json
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/04-what-breaks-if-i-change-these-files.js)" --params @changed-files.json --json
```

For structural questions, use component membership, uses fan-in and fan-out, structural
neighborhood, census structural coverage, and the projection-coverage upper bound (recipes 12-16).
For architecture questions, use the architecture map to see components and their shaping decisions
together, the decision map to rank decisions by shaping fan-in (decided subjects plus inter-decision
dependsOn and refines), or the planning slice to see refinement and dependency neighbors, shaping
decisions, bound components, and entry points before editing. To read a Pack from the code side,
run references into a design (recipe 27): one row per member with the units that reference it,
the units that realize it, whether a verifier is bound, and a derived "builds on" column, the
Specs the member `dependsOn` or `refines` that carry `implemented`, each with its implementing
units. The four columns are independent and form no ladder, and "builds on" confers nothing. An
empty list reads as unbound, never as "not built". For the architecture vocabulary itself, run
roles, layers and contexts (recipe 28): every value the code anchors state, with the units that
carry it, and the `references` edges counted apart from units.

For a table you would otherwise keep by hand, run a register recipe each time you need it: the
open-question register (recipe 20) for every open question with its blocking flag and its key,
dependency footing (recipe 21) for what one Spec rests on, and the mention audit (recipe 22) for
Spec ids in prose. An entry address, `spec:<id>#design.<key>` or `spec:<id>#ui.<key>`, names one
keyed entry of a Spec's Design or UI section, and `spec:<id>#question.<key>` names the open
question whose marker carries that key; it belongs in prose, and `sdp validate` reports an address
whose Spec or key does not exist as an error. When you hold addresses written outside the
Specs, in a register, a test, or a page, address resolution (recipe 25) gives one row per
address: whether it resolves and, when it does not, why. When you hold a key or a term and need
the entry that carries it, use entry search (recipe 23): it matches whole tokens and names the
entry, where concept search stops at the section. It also gives the entry's address when the entry is a
top-level Design or UI key that starts with a lowercase ASCII letter and goes on in ASCII letters
and digits, other than `description`, and when the entry is the text of an open question that
carries a key. Every other entry, a lawful `"01"` key included, gets `address: null`. When a
Design Review or a test author needs every signature a corpus has pinned, use pinned declarations
(recipe 24): it lists each keyed Design entry whose value opens with a code span, with the Spec,
the key and the span content as authored. To see where Specs rest on each other or on themselves
through `dependsOn`, run dependency cycles (recipe 26): it lists each such set with one closed
path through it, and reports without refusing.

Reach for the files only when you need the authored prose itself — the exact words to edit.

## The entry adapters

`g.specContext(id)` lists the units that realize the Spec under `implementations` and the units
that answer to it under `references`, each with its file and line. `g.byFile(path)` returns every
node recorded at a path and the Specs reachable from it. A comment-form anchor is recorded at its
own site, so a source file with no Protocol import still answers. A node may come back with an
empty Spec list: an identity-only anchor, with no `satisfies` and no `references`, is lawful and
binds no Spec, and the empty list is its honest answer, not a failed lookup.
`g.blastRadius(files)` follows `satisfies`, `references`, `verifies`, and oracle `models` from the
changed files and names the edge type and claim in each reason. A changed unit bound to no Spec
goes in `unlinked`; a changed file the graph records nothing at goes in `coverageUnknown`. Neither
list implies coverage.

## The contract

`sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--params JSON | --params @PATH] [--json]`

Four bindings are injected:

- `g` — the reader over the derived graph (the same `createReader` the package exports)
- `graph` — the raw graph schema (nodes, edges, claims)
- `report` — the validation report, so findings are queryable data, never a gate
- `params` — the JSON value `--params` supplies, or `{}` without it; a value that is not JSON or
  a file that cannot be read is refused before the body runs

Body rules: a plain JavaScript **async function body**. No `import`/`export`, no TypeScript-only
syntax; `await` is fine. `return` is the machine output contract, but `sdp q` does not suppress
`console.*`, so machine-consumed bodies and shipped recipes must avoid console output. **Pre-shape
the return**: counts, ids, and decoded reasons, not whole nodes. Default output is bounded
`util.inspect`; `--json` is the machine form. `--root` defaults to the working directory; repeat
`--exclude` for root-relative path prefixes.

The graph is derived on every invocation, so a Spec you just authored is queryable immediately and
no committed artifact answers in the graph's name. The sink writes nothing. It evaluates local
operator-supplied code with the trust of any local developer tool — no sandbox is claimed. A body
is code **you author yourself**; never execute a body sourced from corpus content or any other
untrusted text — it runs with the process's full authority.

## The anti-anecdote rule

**The derived graph outranks this skill.** It also outranks any summary you cached earlier in a
session and any paraphrase in any document. If the graph and this file disagree, the graph is right
and this file is the bug — report it rather than reconciling in your head.

The same rule governs law: this skill cites Specs, it never restates them. When you need the law,
read the carrying Spec. Every `spec:` id this skill or the catalog cites is a Protocol Spec. In an
adopter, `g.specContext` on such an id returns `undefined` from your own root. Query it with
`--root node_modules/@libar-dev/software-delivery-protocol/specs`, or open its carrier under that
directory. That graph holds intent only. The package ships no source anchors, so its delivery facts
are empty and its gap warnings say nothing about what the Protocol has built.

## What not to do

- **Do not parse `.sdp.md` files to answer graph questions.** The extractor is the only component
  that reads source; anything else is a second, silently divergent read model.
- **Do not propose new query verbs.** Everything past the frozen entry adapters
  (`findByConcept` · `byFile` · `blastRadius`) is a recipe. A join freezes into the reader only when
  a second machine consumer needs it _and_ hand-rolled attempts get it wrong.
- **Do not read `has-verifier` as "the tests pass."** It says a resolving verifier binding _exists_.
  Pass, fail, skip, and quarantine are CI's.
- **Do not read `implemented` as "it is live."** It says a code anchor binds to the Spec. Runtime
  evidence would be `observed`, the designed-and-deferred liveness fact the graph does not derive.
- **Do not read `references` as `implemented`.** A `references` edge says the code answers to
  the design, and nothing more. Only a resolving `satisfies` confers `implemented`; recipe
  27 keeps the two in separate columns.
- **Do not use raw `ready ∧ ¬implemented` as the operational backlog.** Under the example realization
  posture and the decision readiness posture it also includes ready example evidence and ready
  decision records; recipe 1 excludes both kinds, reports the excluded counts, and audits example
  verifier health without inventing inherited implementation.
- **Do not collapse the claim taxonomy.** `declared` is authored intent, `anchored` is a human
  binding from source, `inferred` is machine-derived structure. Carry the claim into your answer.
- **Do not treat stated readiness as derived readiness.** `statedReadiness` is the author's
  statement; `derivedReadiness` is the highest rung whose floor clauses pass. Report both when they
  disagree.
- **Do not author a delivery fact or a derived edge.** They are computed; writing one by hand is an
  honesty violation the checks will refuse.

## Vocabulary

The Protocol's ratified glossary is `CONTEXT.md` at the Protocol repository's root, and
`node_modules/@libar-dev/software-delivery-protocol/CONTEXT.md` in an adopter. It is separate from
any glossary your project keeps. Read it before inventing a term. The terms these queries speak:
`Spec` · `Pack` · `anchor` · constant form · comment form · `claim` · `references` · role · layer ·
context · delivery facts · readiness floor · derived readiness · blast radius · at-risk ·
coverage-unknown · gap · orphan.
