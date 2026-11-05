# 03 — Reading material

A reading can only show what the graph holds, what a recipe derives from it, or what a named input
beside the graph supplies. This is the material a designer works from. It was checked against the
graph with `sdp q` at commit `53804437`; re-run the queries rather than trusting this page as the
corpus changes.

## What the graph holds

The graph is flat: nodes, edges, a location table and a citation table. Every node and edge carries
exactly one `claim`.

| Material | What it gives a reading |
|---|---|
| **Spec** (`Primitive` node) | id, title, narrative, `specKind` (8 kinds), `altitude` (`epic`, `feature`, `story`), stated `readiness` (`idea`, `scoped`, `defined`, `ready`), sections (a closed set: intent, behavior, constraints, model, design, decision, verification, ui), derived `deliveryFacts` |
| **Pack** | title, framing prose, members in authored order, optional `order: priority` (a roadmap), model references |
| **Code unit** (`CodeNode`) | file, line, label, and optional `role`, plus `layer` and `context` on a `component:` unit |
| **Test or oracle binding** (`Anchor`) | file and line of the binding |
| **Twelve edge types** | authored: `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, `supersedes`; derived: `belongsTo`, `satisfies`, `references`, `models`, `memberOf`, `uses`. An authored edge may carry a one-line `reason` |
| **Location table** | the source line of every keyed Design and UI entry, every rule and flow, every Model term, every open question and its fields, and every relation target |
| **Citations** | inferred, located occurrences of entry addresses in source files that carry a recognized anchor |

**Derived beside the graph.** The validation report (the `report` binding) is computed alongside
the graph, not held in it. It carries the Protocol's conformance and honesty findings. Corpus-rule
findings exist only in an operator's `sdp validate --rules` run, reported apart from Protocol
findings; the Studio takes no corpus configuration and shows Protocol findings only.

**Addresses.** Spec and Pack ids (`spec:consumers.reader`, `pack:roadmap`) and entry addresses
(`spec:<id>#question.<key>`, `#rule.<key>`, `#design.<key>`, `#ui.<key>`, `#term.<key>`) make deep
links possible. Every Spec, Pack and keyed entry can be linked exactly: an id maps to its page, an
entry address to an element id on its Spec's page. Everything else links less precisely:

- An unkeyed rule or flow links only to its section. The rule-key proposal (recipe 48) totals how
  many are still unkeyed.
- A Design or UI entry's `description` has no address.
- A component links to its section of the architecture lens.
- A code unit or test anchor has no page. It shows as its file and line in text, which becomes a
  code-host link only in a stamped page set served over http or https with a source template
  (`spec:consumers.spec-studio.spec-page#rule.sourceText`).

## How a reading is composed: a test drive of the reader

Every reading starts from the reader, never from the carriers. `sdp q` evaluates a JavaScript body
over the derived graph with five bindings: `g` (the reader), `graph` (the raw graph), `report` (the
validation report), `params`, and `recipes(n, params)`. There is no verb per question. The reader
exposes nine entry points; everything else is composed in a few lines.

| Entry point | Arrives holding | Returns, in brief |
|---|---|---|
| `g.specs()` | nothing | one row per Spec: id, title, `specKind` and its familiar `kindDisplayLabel`, altitude, stated and derived readiness, delivery facts, file, Packs |
| `g.packs()` | nothing | the Packs: id, title, framing, file, model references |
| `g.findings()` | nothing | validation findings: validator, family, severity, message, subject, file |
| `g.findByConcept(word)` | a word | matching nodes, each naming the fields it matched in (title, narrative, a section), never a fuzzy score |
| `g.byFile(path)` | a file | every node recorded at the path and the Specs reachable from it |
| `g.blastRadius(files)` | a changeset | impacted Specs and Packs with the binding and claim behind each reason, at-risk neighbours, `unlinked` units, and `coverageUnknown` files the graph records nothing at |
| `g.resolveEntryAddress(address)` | an address | whether `spec:<id>#<section>.<key>` resolves, and which entry |
| `g.specContext(id)` | a Spec id | the whole Spec in context: sections, design columns, floor and next-rung failures, relations in and out with claim and reason, implementations and references with file, line, role, layer and context, verifiers, entry locations, citations, findings |
| `g.packContext(id)` | a Pack id | framing, every member with its next-rung failures, design columns, bindings, verifiers and examples; the boundary (what the Pack rests on and what rests on it); verifier gaps; findings |

**Named coordinates are already there.** `kindDisplayLabel` turns each kind into a familiar delivery
noun: *Use Case / Behavior*, *Business Rule*, *Decision Record*, *Contract*, *Domain Model*,
*Workflow*, *Constraint (NFR)*, *Example / Scenario*. A reading for a delivery role can speak those
nouns without teaching the schema. (Here "role" means the delivery role a person plays, a
provisional design sense; the ratified `role` is the architectural pattern on a code anchor.)

**Role readings are short scripts.** A technical product manager's "where does intent stand?" per
Pack (members by named coordinate and stated rung, blocking questions with deciders, realization,
boundary size, then the roadmap's needs) took about twenty lines: three reader calls and two shipped
recipes (20 and 53). An architect's "which decisions shape the most Specs, and do their relations
say why?" took ten. Neither needed a new verb. A role home is a composition of this kind, published
as a projection.

**What the test drive taught the design:**

- **Pack sizes range from a handful of members to the whole corpus.** `pack:self-hosting-v1` holds
  every Spec. A landing that expands every Pack cannot scale; Packs need a summary-first reading.
- **Naive ratios mislead.** In `pack:adopter-speed-v1`, far fewer members are `implemented` than
  have a verifier, because most of its members are examples, and examples are verified, never
  implemented (the example realization posture, MD-24). A leader reading must apply the per-kind
  postures, never show "implemented out of total".
- **Most blocking questions are deferrals, not holds.** Most carry a `trigger`: they wait for an
  event, not a decision today. A decider's home must separate *decide now* (holds) from *waiting for
  its trigger* (deferrals), or it reads as a backlog of overdue work.
- **Reasons are sparse.** Most `decidedBy` relations carry no `reason`, the most-cited decisions'
  included. A "why" reading must show a missing reason as missing, not as a blank.
- **The adapters name their own blind spots.** A changeset over files the graph records nothing at
  returns them in `coverageUnknown`; an address with an unknown key returns `resolves: false`. Human
  readings should keep that habit: an honest "the graph cannot see this" instead of an empty panel.
- **The self-hosted corpus holds barely any Constraint (NFR) Specs.** NFR-centred readings need the
  worked example or an adopter corpus to be tested.

Re-run these rather than trusting the words above (each body goes to `pnpm --silent sdp:q '<body>'`):

| Lesson | Query |
|---|---|
| Pack sizes | `return graph.nodes.filter((n) => n.nodeType === "Pack").map((p) => [p.id, p.members.length])` |
| Naive ratios | `const m = g.specs().filter((s) => s.packs.includes("pack:adopter-speed-v1")); return { members: m.length, implemented: m.filter((s) => s.deliveryFacts.includes("implemented")).length, hasVerifier: m.filter((s) => s.deliveryFacts.includes("has-verifier")).length }` |
| Deferrals and holds | `return (await recipes(20)).totals` |
| Sparse reasons | `const d = graph.edges.filter((e) => e.type === "decidedBy"); return { relations: d.length, withReason: d.filter((e) => e.reason).length }` |
| Constraint Specs | `return g.specs().filter((s) => s.specKind === "constraint").map((s) => s.id)` |

## What the recipes already answer

The recipe catalog ([`docs/agent-surface/recipes.md`](../agent-surface/recipes.md)) is the best
evidence the project has of the questions people and agents need answered: each recipe is a
question someone needed answered often enough to write down and test. It does not measure how often
a question is asked, and some recipes exist to feed a projection or a check rather than a recurring
question. Grouped by the job each serves:

| Job family | Recipes | Studio page today |
|---|---|---|
| **Where does intent stand?** | capability map (52), lower ladder (11), readiness divergence (7) | capabilities lens (52); the index summary and the Pack page's maturity map place Specs by stated rung and floor; no page runs 7 or 11 |
| **What comes next?** | roadmap (53), roadmap memo (55), build backlog (1), design backlog (33) | roadmap page (53, 55); backlog page (the design backlog, 33); no page runs the build backlog (1) |
| **What must a person decide?** | statement queue (46), open-question register (20), promotion preflight (9) | owner queue (46), questions page (20); Pack member cards show each stated next rung and its unmet clauses; no page runs 9 |
| **Review one Pack** | Pack review backbone (5), Pack design (29), design slice (54), perspective filter (37), references into a design (27) | Pack page (29), slice page (54); no page runs 5, 27 or 37, and the Studio takes no perspective |
| **What changed?** | design diff (35, needs a base graph) | diff page, plus a row on each Pack and Spec page (only when built with `--base`) |
| **What does this touch?** | changed-file impact (4), design-change impact (30), planning slice (19), dependency footing (21), dependency cycles (26) | Spec page Impact panel (21, 30); the owner queue names any dependency cycle the statement queue finds; no page runs 4, 19 or 26 |
| **What does this guarantee and who checks it?** | Spec guarantees (3), declared versus enabled verifiers (10), rule coverage (34), example-space coverage (44), run evidence (45) | Spec page and tests lens (34, 44, and 45 given run records), runs page (45); no page runs 3 or 10 |
| **Architecture** | architecture map (17), crossings (32), architecture walk (42), planned against realized (43), component membership and reach (12, 13, 14), roles, layers and contexts (28) | architecture lens (17, 43); no page runs 12, 13, 14, 28, 32 or 42 |
| **Decisions** | decision map (18), decision register (31) | decisions page (31); no page runs 18 |
| **Find something** | concept search (6), entry search (23), address resolution (25), entry citations (51) | search page (6's matcher and 23's entry walk); entry citations (51) on Spec pages and the declarations page; no page runs 25 |
| **Keep the corpus healthy** | orphans and gaps (8), drift alarm (2), mention audit (22), curation report (40), slimming candidates (39), key-family register (41), pinned declarations (24), external registers (50), census structural coverage (15), projection coverage upper bound (16) | declarations page (24); the index's findings section (Protocol findings only); no page runs the others |
| **Change and hand off** | context bundle (36), proposal check (38), proposal memo (49) | the composing panel writes recipe 49's memo byte for byte; no page runs 36 or 38 |
| **Upgrade a corpus** | capability adoption (47), rule-key proposal (48) | none |

"No page runs N" means the Studio's build does not evaluate that recipe
(`spec:consumers.spec-studio.data.recipe-answers#design.recipeEvaluations`); a page may still show
related reader values. The column covers the Studio only. Other human readings stand beside it: the
Design Review, census, Mermaid and Gherkin projections, held by the shipped-projections decision
(MD-32); the Obsidian vault (`spec:consumers.obsidian-vault`); and the memos agents render into a
pull request (recipes 49 and 55). [10](10-studio-baseline.md) reads the Studio as it stands.

Three gaps stand out:

- **Impact from a changeset.** Every Spec page's Impact panel already shows what a Spec rests on and
  what rests on it (recipes 21 and 30), so the per-Spec walk the seed called one of the Studio's
  most-used queries ([seed 03 §8](../lineage/v0-design/03-graph-metamodel.md)) is built. No reading
  starts from a file or a changeset (recipe 4) or covers a planning slice across Specs (recipe 19),
  and the Studio takes no changeset input.
- **The build backlog.** The backlog page shows the design backlog only; recipe 1 has no page.
- **Corpus upgrade.** The upgrade kit (recipes 47 and 48) has no human reading. This is a different
  sense of adoption from the seed's advice that the Studio be a team's first visible win
  ([seed 08 §9.10](../lineage/v0-design/08-delivery-evidence-and-tooling.md)).

## Named inputs beside the graph

Beside the graph the Studio reads at most two optional inputs, each named on the command line
(`spec:consumers.spec-studio#rule.namedInputs`). Each is named in words on every page that shows
it, never becomes graph data, a delivery fact or a verdict, and never answers in the graph's name.

| Input | Supplied as | Gives | How a page names it |
|---|---|---|---|
| **Base graph** | `sdp studio --base PATH`, optionally `--base-label TEXT`: a graph `sdp build` wrote at an earlier commit | the design diff (recipe 35): what changed in the design since that graph | by its label, schema version and Spec count; a commit shows only when the label names one, as the preview workflow's `base <short commit>` label does |
| **Run records** | `sdp studio --runs PATH`, repeatable (CTRF) | supplied test results beside verifier bindings, joined at test-file grain (recipe 45) | by tool, build, branch, recorded commit (or `not recorded`) and times |

Two things sit near the inputs but are not inputs:

- **The stamp** is publishing metadata. `sdp stamp` writes it beside the page set after the build,
  and the next build removes it. It names the schema version, the corpus commit (or `unknown`), the
  engine, the UTC publishing time and, optionally, a source template that turns each recorded
  `file:line` into a code-host link. The shell shows it only when the page set is served over http
  or https, never through `file://` (`spec:consumers.spec-studio.sharing`,
  `spec:consumers.spec-studio.shell#rule.stamp`).
- **An outside register** is not built. It is a `scoped` capture on the roadmap
  (`spec:consumers.spec-studio.register-input`) with blocking questions of its own, and admitting it
  means amending the two-input rule. Agents can already check prose tokens against a register with
  external registers (recipe 50).

Agents reach more named inputs than the Studio: a recipe whose contract admits it may take a base
graph, imports, a perspective, a proposal or run records through `--params`.

## What the graph does not hold

This is the one list of what the graph does not hold; what would supply each gap is logged in
[07](07-graph-needs.md#log). It also takes in what the seed modelled and the graph does not hold,
marked *the seed had*. A prototype must not invent any of it, but a gap is not a dead end: design
work is one of the ways the graph's gaps are found, and an engineering session extends the graph,
on the owner's word, to serve the readings it needs. Each row names its row in 07, or says the gap
is ruled out; new findings go to the same log. The graph may also lack material it is *meant* to
hold: an architecturally significant unit with no anchor, or a relation nobody declared. Those are
curation gaps, found by the curation report (recipe 40) as well as by design work.

| Absent | Consequence for design | Logged in 07 |
|---|---|---|
| **People, ownership and approval** | No owner or tags on a Spec (*the seed had* both): the envelope is closed, so an `owner:` or `tags:` key is refused, and a Gherkin tag is decoration that authors no graph state. The only person-shaped value is an open question's `decider`, a corpus token that references and authorizes nothing. No "my Specs" or "my team" reading; a decider's queue filters questions only. That a review occurred, or who approved, is never a graph fact | [*Who is responsible for a Spec, Pack or context*](07-graph-needs.md#log) and [*Who reviewed, approved or stated `ready`*](07-graph-needs.md#log) |
| **Time and history** | No timestamps (*the seed had* `createdAt` and `lastRunAt`), ages, trends, velocity or "recently changed"; the shell shows no recent edits, by rule. The reach past one commit today is the two-point design diff and the commits run records carry | [*History*](07-graph-needs.md#log); [08](08-what-the-repo-settles.md#3-history-beyond-one-commit) says how a history reading may ship |
| **Runtime observation and delivery events** | No "is it live?", no measured NFRs, and no build, deployment, attestation or bill-of-materials nodes (*the seed had* them). The evidence lens names these sources and reads each as not tracked | [*Runtime observation*](07-graph-needs.md#log) and [*Build attestations, deployments and software bills of materials*](07-graph-needs.md#log) |
| **Test verdicts as facts** | No pass rate or pass and fail inside the graph (*the seed had* test runs in it); `has-verifier` says a binding exists, not that a test passed. Run evidence appears only as a labelled input | [*Run results across many pipeline runs*](07-graph-needs.md#log); the verdict itself stays CI's, by design |
| **Decision status** | No `proposed`, `accepted` or `superseded` status (*the seed had* one). A decision is a Spec with stated readiness, and replacement is a `supersedes` relation. A decision reading shows those, never an adoption status | Ruled out: `status` on a decision is rejected under the typing law (MD-11) |
| **A longer readiness ladder** | Four stated rungs only (*the seed had* seven, including `executable` and `verified`). Verification is a delivery fact, never a rung. Stated readiness, the derived floor and delivery facts are three separate coordinates and must not merge into one progress ramp | Ruled out |
| **Effort, estimates, dates, sprints** | None | Ruled out: the roadmap is never a schedule, a date or a gate (a roadmap states advisory priority, MD-46), and lifecycle gating is rejected; phase, iteration and milestone survive only as descriptive nouns |
| **Visual design artifacts** | Keyed UI entries only; no thumbnails or design-tool frames | [*Links from UI entries to visual design artifacts*](07-graph-needs.md#log) |
| **Discussion and comments** | None | Not a graph need: discussion lives in the pull request. A commercial Studio, under consideration and exploratory, could hold review threads as product state, never as delivery truth |

## Derivable but not yet derived

Candidates that need no model change but that the graph alone cannot give. All but the last read
graphs from several commits, so each needs the named history input logged in
[07](07-graph-needs.md#log), and in the Studio the history diagrams that
`spec:consumers.spec-studio.diagram-kinds` refuses until "a ruled history input and a history
reader" exists. Each is a candidate, not a commitment, and each would need a
carrying Spec:

- **Discipline activity over time:** per discipline filter, how many Specs, entries or bindings
  changed per commit range, in the shape of RUP's hump chart (see [11](11-rup-roles-and-artifacts.md)).
- **Question age:** when an open question first appeared. Defined only for keyed questions: unkeyed
  entries have no identity across two graphs.
- **Decision lineage:** a `supersedes` chain with the commit each step landed in. A chain exists in
  one graph only while both records do, so a deleted predecessor needs an older graph.
- **Readiness trajectory:** a Spec's stated rung across commits. It breaks at an id rename, since
  ids carry no history (`spec:model.stable-ids`).
- **Change narrative for a pull request:** the design diff plus blast radius plus statement-queue
  movement, in one reading. It needs a base graph and the changed files, which an agent can pass to
  `sdp q` today; the Studio takes no changeset.
