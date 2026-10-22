---
name: sdp-agent-surface
description: Query this repository's Spec graph through `sdp q` instead of reading spec files by hand. Use whenever a question is about the authored corpus — what a Spec says or guarantees, who verifies it, what is ready but unimplemented, what a change touches, what is still open or blocking, what a Spec depends on, where a concept lives, which Specs are in a Pack, what a component contains or uses, what code references a design, what the census or projections will see, or what the validation report says. Also use before editing `.sdp.md` files, before writing a Spec citation, and before answering "is this implemented / verified / ready".
---

# The agent surface

This repository models its own delivery lifecycle as typed `Spec` documents and derives **one
graph** from them. The graph — not the files — is the read model. The surface you read it through
is `spec:consumers.agent-surface`, shaped by the agent front door decision,
`spec:decisions.agent-front-door` (MD-22): the package exports the reader, and the CLI carries one
evaluation sink. There is no verb wall — you script the graph.

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

The catalog of ready-made bodies is `docs/agent-surface/recipes.md` in the Protocol repository
and `node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/recipes.md` in an
adopter. Each recipe opens under a numbered heading that names it. Every body there runs verbatim
and a test proves it.

A recipe that takes a subject (a Spec id, a Pack id, changed files, addresses, a term) reads it
from `params.<name>`, and the catalog names the parameter. Pass it as JSON data with `--params`,
never by editing the body; `--params @PATH` reads the JSON from a file. The build also ships each
body as `dist/recipes/<NN>-<slug>.js`, so run it as shipped:

```sh
pnpm --silent sdp:q "$(cat dist/recipes/03-what-does-this-spec-guarantee-and-who-verifies-it.js)" --params '{"spec":"spec:consumers.reader"}' --json
pnpm exec sdp q "$(cat node_modules/@libar-dev/software-delivery-protocol/dist/recipes/04-what-breaks-if-i-change-these-files.js)" --params @changed-files.json --json
```

## Answer a task with a recipe

### Which recipe answers a task

| The task                                                       | Run                                                                                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Pick work to build                                             | the build backlog (recipe 1); the design backlog (recipe 33) for designed, unbuilt Specs                   |
| Find code ahead of intent                                      | the drift alarm (recipe 2)                                                                                 |
| Read what a Spec guarantees and who verifies it                | Spec guarantees (recipe 3)                                                                                 |
| Review a changeset                                             | changed-file impact (recipe 4), then the mention audit (recipe 22) over its scope                          |
| Locate a term or a concept                                     | concept search (recipe 6); entry search (recipe 23) for the entry and its line                             |
| Check a Spec's stated next rung before a readiness edit        | promotion preflight (recipe 9); the lower ladder (recipe 11) across the corpus                             |
| Compare stated readiness with the floor                        | readiness divergence (recipe 7)                                                                            |
| Read warnings, gaps and verifier health                        | orphans and gaps (recipe 8); declared versus enabled verifiers (recipe 10)                                 |
| Review a Pack                                                  | the Pack review backbone (recipe 5), Pack design (recipe 29), references into a design (recipe 27)         |
| Read a Pack or a set of Specs as one design                    | the design slice (recipe 54)                                                                               |
| List open questions                                            | the open-question register (recipe 20)                                                                     |
| See what a Spec rests on                                       | dependency footing (recipe 21); dependency cycles (recipe 26)                                              |
| Change a Spec others rest on                                   | design-change impact (recipe 30); the planning slice (recipe 19)                                           |
| Check addresses written outside the Specs                      | address resolution (recipe 25)                                                                             |
| List the signatures two parties share                          | pinned declarations (recipe 24)                                                                            |
| Read a component and its reach                                 | component membership (recipe 12), uses fan-in and fan-out (recipe 13), structural neighborhood (recipe 14) |
| Measure structural and projection coverage                     | census structural coverage (recipe 15), the projection-coverage upper bound (recipe 16)                    |
| Read the architecture                                          | the architecture map (recipe 17), architecture crossings (recipe 32)                                       |
| Check a corpus's architecture rules                            | the architecture walk (recipe 42)                                                                          |
| Compare planned components with their realization              | planned against realized components (recipe 43)                                                            |
| Weigh the decisions that shape it                              | the decision map (recipe 18), the decision register (recipe 31)                                            |
| Reuse an architecture value                                    | roles, layers and contexts (recipe 28)                                                                     |
| Find keyed rules no example exercises                          | rule coverage (recipe 34)                                                                                  |
| Find example-space values no example binds                     | example-space coverage (recipe 44)                                                                         |
| Read external CI results beside verifier bindings              | run evidence (recipe 45)                                                                                   |
| See what changed since a design pass                           | the design diff (recipe 35)                                                                                |
| Compose a design pass's reading                                | the context bundle (recipe 36), the perspective filter (recipe 37)                                         |
| Apply a change proposal                                        | the proposal check (recipe 38)                                                                             |
| Render a change proposal as the memo a person reviews          | the proposal memo (recipe 49)                                                                              |
| Slim a Spec its bound code now carries                         | slimming candidates (recipe 39)                                                                            |
| Find files and components the anchors miss                     | the curation report (recipe 40)                                                                            |
| List a family of keyed values (limits, error messages, tables) | the key-family register (recipe 41)                                                                        |
| Order waiting readiness statements and owner questions         | the statement queue (recipe 46)                                                                            |
| Measure capabilities in use and where they could apply         | capability adoption (recipe 47)                                                                            |
| Propose rule keys for review                                   | the rule-key proposal (recipe 48), then the proposal check (recipe 38)                                     |
| Check prose tokens against an outside register                 | external registers (recipe 50)                                                                             |
| Find source and test lines citing an entry                     | entry citations (recipe 51)                                                                                |
| Read epic scopes and direct binding evidence                   | the capability map (recipe 52)                                                                             |

Choose a recipe from the task sheet, then read its numbered catalog entry for parameters,
defaults, diagnostics and answer fields. Run the shipped body unchanged, or call
`recipes(number, parameters)` to compose its answer. The catalog owns recipe contracts; carrying
Specs own law. Inspect diagnostic and omission fields before interpreting an empty result.

Reach for the files only when you need the authored prose itself — the exact words to edit.

### Read a large scope in parts

The context bundle (recipe 36) reads a Pack or a list of Specs within a budget. Request `part: 1`
with an explicit scope. Check `diagnostics` and `budgetExceeded` before using `part.of`. On
success, request every part from 1 through `part.of` with the same scope, budget and declaration
mode, and check that their members cover the requested scope. A refused bundle carries
`budgetExceeded: true`, `part.of: null` and `oversized`, and no members: inspect `oversized`,
raise the budget or explicitly choose a smaller scope, and request it again. A refusal is not a
partial bundle.

### Entry addresses

An entry address names one keyed entry of a Spec: `spec:<id>#design.<key>` or
`spec:<id>#ui.<key>` a Design or UI entry, `spec:<id>#question.<key>` the open question whose
marker carries the key, `spec:<id>#rule.<key>` the rule or flow entry whose `[#key]` marker
carries it, and `spec:<id>#term.<key>` a keyed Model term. The address rules are carried by
`spec:decisions.checked-mentions` and `spec:model.term-addresses`. Step keys name generated
contract steps and have no address; `spec:carrier.step-keys` carries them.

- An unresolved entry address mentioned in Spec prose is a Protocol prose-mentions error.
- An address written outside the Specs, in a register, a test or a page, is checked by address
  resolution (recipe 25), one row per address.
- An entry address cited in source is recorded only when the source file carries a recognized
  anchor. Entry citations (recipe 51) lists those citations. Unresolved source citations become
  corpus findings only when recipe 51 is selected through `validate --rules`; ordinary validation
  does not report them. A non-empty `testAnchors` list identifies a citing file whose test anchor
  verifies the cited Spec directly or through an example. It records no assertion result.
- Entry search (recipe 23) returns an address for an addressable Design or UI entry, a keyed open
  question, a keyed rule or flow, or a keyed Model term. Other entries, including `description`
  in Design or UI and off-grammar keys such as `"01"`, return `address: null`.

### Rules files and upgrades

Address resolution, dependency cycles, the architecture walk, external registers and entry
citations (recipes 25, 26, 42, 50 and 51) answer `{ findings }` and run unchanged as rules files
under `sdp validate --rules`. Their findings are corpus findings, never Protocol validators. Follow
`sdp-authoring`'s "Write and run corpus rules" for invocation and parameters.

For a corpus upgrade, follow the shipped upgrade guide: `docs/agent-surface/upgrade-guide.md` in
the Protocol checkout, or
`node_modules/@libar-dev/software-delivery-protocol/docs/agent-surface/upgrade-guide.md` in an
adopter, with `sdp-authoring`'s "Upgrade a corpus".

## The contract

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

## The entry adapters

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

## Publish pages and notes

The public projection publishers are `sdp view`, `sdp census`, `sdp mermaid`, `sdp gherkin`,
and `sdp studio`. Each of them, like `sdp build`, `sdp validate` and `sdp vault`, enters the shared
build, which first removes all five page roots, so after one publisher runs only its own root is
current (`spec:consumers.wholesale-view-rewrite#rule.buildInvalidates`).

- Use `sdp generate` when all five page roots are wanted. It publishes them from one validated
  graph, synchronizes the vault first except under `--check-clean`, and writes the Studio without
  optional inputs: it takes neither `--base` nor `--runs`.
- Use `sdp studio` for a page set with `--base PATH`, `--base-label TEXT`, or repeatable
  `--runs PATH`; that run invalidates the other four page roots. Keep supplied inputs outside the
  paths the build writes or removes, `generated/` included
  (`spec:consumers.spec-studio.data.inputs`). `sdp studio --watch` rebuilds after carrier edits;
  source and input edits start no cycle (`spec:consumers.spec-studio.publisher.watch`).
- After the final Studio build, run `sdp stamp` with the corpus commit, then upload the stamped
  page set. A later build removes the stamp
  (`spec:consumers.spec-studio.sharing#rule.stampLifetime`). Follow `sdp-studio` for previews,
  page reading, exports and composing-panel hand-offs.
- For linked notes, use `sdp-vault`. Open the directory `sdp vault --out DIR` names as the vault;
  the command owns its `sdp/` folder. Keep personal notes outside that folder, conventionally
  under `intent/`. `sdp vault` enters the shared build and invalidates the five page roots; use
  `sdp generate --vault DIR` when those roots must also be published.

In this source checkout, `npm run generate:self-hosting` and `npm run check:self-hosting` preserve
and publish all five roots together. In check mode a prior tree must exist for each root; Design
Review checks repeat-render determinism, while census, Mermaid, Gherkin and Studio also compare
the prior tree's bytes with the current render.

## The shape of the graph

The graph's topology is flat: nodes and edges are separate arrays, and relations express
hierarchy, so every question is a filter or a join, never a tree walk. Section content may contain
nested values. `graph.locations` records authored entry locations: the source line of every keyed
Design and UI entry, every rule and flow entry, every Model term, every open question and each of
its fields, and every authored relation target. Primitive and Pack nodes carry no source lines;
Anchor and CodeNode nodes carry their binding file and line. A location is never an identity or a
binding target. Four node types exist:

- `Primitive` — one authored Spec, positioned by `specKind` × `altitude` × `readiness`, carrying
  its title, narrative, reified section content, and the derived `deliveryFacts`. Use case, NFR,
  decision record, epic, and story are coordinates on this one type, never separate node types.
- `Pack` — the review grouping, carrying its title, framing prose, ordered `members` as authored,
  and `modelRefs`. `belongsTo` edges re-express membership in the global edge order; read
  authored reading order from `members`. A Pack states no system truth.
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
is a bug in whatever prose named it, not a query to attempt. An authored edge may carry a
`reason`, one line on why it holds, and a declared `verifies` from an example may carry
`exercises`, the verified Spec's rule keys it exercises; neither changes what the edge confers.
IDs are namespaced (`spec:` · `pack:`
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

## The anti-anecdote rule

**The derived graph outranks this skill.** It also outranks any summary you cached earlier in a
session and any paraphrase in any document. If the graph and this file disagree, the graph is right
and this file is the bug — report it rather than reconciling in your head.

The same rule governs law: this skill cites Specs, it never restates them. When you need the law,
read the carrying Spec. Protocol references in this skill name the carrying Specs shipped with
the package. Placeholder ids and the order-domain examples demonstrate syntax and do not name
Specs in that corpus. In an adopter, `g.specContext` on a Protocol id returns `undefined` from
your own root. Query it with `--root node_modules/@libar-dev/software-delivery-protocol/specs`, or
open its carrier under that directory. That graph holds intent only. The package ships no source
anchors, so its delivery facts are empty and its gap and verifier-linkage warnings say nothing
about what the Protocol has built.

## Empty answers that mislead

An empty list or a zero is an answer, and some read as more than they say:

- `implementedBy: []` or `referencedBy: []`: no unit is bound, not that nothing is built.
- `verifiers: { total: 0 }`: no verifier is bound, not that nothing is tested.
- Recipe 1 lists ready, unimplemented Specs excluding examples and decisions. Recipe 33 applies the
  same exclusions at `defined`. An empty answer establishes absence only within that recipe's
  selection.
- `coverageUnknownFiles: []`: every changed file is recorded somewhere, not that every reach is
  known.
- `found: false`: the id is not in this graph; in an adopter, a Protocol id needs `--root`.
- `line: null`: the entry is not located, never absent.
- No findings: conformance and honesty hold, not that the design is right.
- `floorReached: "ready"`: the structural floor allows `ready`. Read `statedReadiness` separately
  to learn whether the author has stated it.
- A perspective that selects no member: read its `diagnostics` before reading the empty list as an
  empty concern.

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
- **Do not read narrowing from a field name.** Whether a refinement narrows a decision is that
  decision's own text or its relation's reason.
- **Do not author a delivery fact or a derived edge.** They are computed; writing one by hand is an
  honesty violation the checks will refuse.

## Log friction

When a recipe misleads you, or an answer costs extra calls, record one row where the project keeps
its feedback on the Protocol (for example a `docs/feedback/` folder): what you wanted, what you
ran, what you got, what you did instead, and what it cost (minor, slowed, blocked). Do not
reconcile the gap in your head; the row is the evidence the next arc reads.

## Vocabulary

The Protocol's ratified glossary is `CONTEXT.md` at the Protocol repository's root, and
`node_modules/@libar-dev/software-delivery-protocol/CONTEXT.md` in an adopter. It is separate from
any glossary your project keeps. Read it before inventing a term. The terms these queries speak:
`Spec` · `Pack` · `anchor` · constant form · comment form · `claim` · `references` · role · layer ·
context · delivery facts · readiness floor · derived readiness · blast radius · at-risk ·
coverage-unknown · gap · orphan.
