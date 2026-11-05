# 07 — Graph needs

A UI view is a projection like any other. It can only show what the graph holds, plus any input
it names apart from the graph, such as a base graph or run records. The graph is not complete:
architecturally significant units may carry no anchor, relations may be missing, and some material
the seed design modelled has no home yet. Design work is one of the ways those gaps are found.
[03](03-reading-material.md) describes the material a reading can draw on, and
[08](08-what-the-repo-settles.md) lists the limits the repository already settles. This page is the
one log of what a reading needs and the graph lacks.

The log is a hand-off from design sessions to engineering sessions: **design sessions record needs
here for consideration; they never edit carriers, Packs, anchors or anything else that feeds the
graph.** An engineering session, with the owner, decides whether and how the graph grows, and the
reading regenerates once it does. "Design session" here means a session of this UX and
information-architecture project. The handbook's design sessions ([AGENTS.md](../../AGENTS.md),
"Design vs execution") author Specs and edit carriers; on these pages that work belongs to the engineering
session a row hands off to.

## The loop

1. **A reading names its material.** Every brief or prototype states which reader calls, recipes or
   inputs it reads (see the anatomy in [04](04-reading-model-and-ia.md#1-anatomy-of-a-reading)).
2. **A gap is recorded, never faked.** When the material is missing, the prototype shows the gap as
   a named absence and a row lands here. A prototype never hard-codes data the graph does not hold.
3. **An engineering session considers it.** A need may become an anchor (identity, `role`, `layer`,
   `context`), an authored relation or its `reason`, a section entry or a key, a keyed open
   question or a decision Spec, a new projection input, a new projection, or no change. The design
   session that found it does not make the change.
4. **The reading regenerates.** Once the graph holds the material, the reading is a function of it,
   like every other projection.

Tools that find gaps without design work: the curation report (recipe 40), given an imports file,
ranks files the anchors miss and component imports that disagree with anchored uses; planned
against realized components (recipe 43) compares component designs with the anchors that realize
them; orphans and gaps (recipe 8) lists the warn-level absences; the mention audit (recipe 22) finds
prose mentions that do not resolve or that no declared relation backs.

## How to write a row

| Field | Content |
|---|---|
| **Need** | the material, in one line |
| **Reading** | the role reading or flow that needs it |
| **Today** | what the graph holds instead, and how the reading behaves without it |
| **Evidence** | the query, recipe or carrying entry that shows the gap; named queries are under [Evidence queries](#evidence-queries) |
| **Candidate home** | anchor · relation · reason · section or key · keyed question or decision Spec · projection input · new projection · deferred delivery fact · none (the law keeps it outside the graph) |
| **Decision home** | the entry address or Spec id that holds the open question, when the corpus has one; otherwise `proposed` (see [A corpus home for these needs](#a-corpus-home-for-these-needs-a-proposal)); `none needed` for plain curation |

A row holds no status. Its state is read from its decision home: the open-question register
(recipe 20) for a question, and git and the pull request that made it for a ruling.

## Log

Reading names such as role home and basis line are the provisional design terms listed in the
[README](README.md#words-used-here).

| Need | Reading | Today | Evidence | Candidate home | Decision home |
|---|---|---|---|---|---|
| Who is responsible for a Spec, Pack or context | role homes that start from "my work" | No node carries an owner. The only person-shaped value is an open question's `decider`, a corpus token that references nothing and authorizes nothing; an Intent `actor` says whom a Spec serves, in a small minority of Specs. "A Spec names no owner" is a current non-goal ([concept 00](../concept/00-vision-scope-and-mvp-boundary.md)), and the closed envelope refuses an `owner:` key (`spec:carrier.envelope-contract`). A reading can group by concern (Pack, perspective, context, kind), never by person | *fields*, *deciders*, *actors* | a decision Spec weighing a section field, decider-style tokens beyond questions, or authorship read from supplied history; never an authorization or a gate | `proposed` |
| History: when a Spec, question or decision changed | discipline activity over time; question age; decision lineage with dates; readiness trajectory | The graph is derived from one checkout and names neither its commit nor any time; the design diff compares a supplied base graph with the current one. Ready Studio law shows no history (`spec:consumers.spec-studio.shell#rule.noRecentEdits`) and holds history diagrams until "a ruled history input and a history reader" (`spec:consumers.spec-studio.diagram-kinds#design.gitGraph`). Question age needs a keyed question, and a trajectory breaks where an id is renamed | *graph keys* | a named projection input: graphs `sdp build` wrote at caller-named commits, the caller or CI doing the git work, as the design diff's base graph already does (git is the event log). A consumer reading git itself would test the one derived read model principle (P2: no consumer reads source directly), so it would likely need a decision | `proposed`; release and baseline views wait on `spec:consumers.projections-model.roadmap-views#question.releaseReader` |
| Who reviewed, approved or stated `ready` | leader and reviewer readings; decision lineage | Never a graph fact: that a review occurred is never recorded ([CONTEXT.md](../../CONTEXT.md)), approval lives in git and CI ([concept 00](../concept/00-vision-scope-and-mvp-boundary.md)), and a change proposal carries no approval (`spec:consumers.intent-composition.proposal`). The record is git history and pull request descriptions | the glossary's note under `ready` | none in the graph; a labelled outside input read from git or the pull request host, if a reading needs it | `proposed`, beside the history question |
| A `reason` on the relations a "why" reading explains | decision lineage; architect home | Sparse: most `decidedBy` relations carry no reason, including most of those on the decisions that shape the most Specs | *reasons*; the decision map (recipe 18) ranks decisions by fan-in | authored `reason` lines (curation, no model change) | `none needed` |
| A key on each rule and flow entry a reading links to | object pages and deep links ([04](04-reading-model-and-ia.md#31-object-pages)); comments and proposals scoped to one rule | A large share of rule and flow entries carry no key, so they have no entry address; the closest link is their section | *rule keys* | rule keys, proposed by the rule-key proposal (recipe 48) and checked by the proposal check (recipe 38) before an engineering session applies them | `none needed` |
| Measurable constraints to read | NFR board; operations reading | The self-hosted corpus holds almost no constraint Specs with a measurable target (the NFR named coordinate); the worked example carries a latency constraint | *constraints* | corpus content; prototype on the worked example or an adopter | `none needed` |
| Runtime observation | operations; leader "is it live?" | `observed` is a designed, deferred delivery fact; the evidence lens reads runtime observation as not tracked | `spec:observation.runtime-overlay` (stated `idea`) | the deferred delivery fact | `spec:observation.runtime-overlay#question.observationIdentity` |
| Build attestations, deployments and software bills of materials | release, operations and security readings | The evidence lens names each source and reads it as not tracked; no Spec designs a source for them | `spec:consumers.spec-studio.lenses.evidence#rule.notTracked` | named projection inputs with carrying Specs | `proposed` |
| Run results across many pipeline runs | tests lens trends; CI surface | A Studio build reads the run records it is given as one named input; each run shows its own commit and times, and no page compares runs or calls one fresh or stale | `spec:consumers.spec-studio.runs-page#rule.namesEachRun`; `spec:consumers.spec-studio.data.inputs#rule.namedInputs` | a named projection input (a run series) with a carrying Spec | staleness: `spec:observation.run-evidence.bound-file-freshness#question.freshness`; trends: `proposed` |
| The basis of every reading: commit, engine and supplied inputs | the basis line on every reading; phone and export readers | The graph names no commit. The stamp names one only after `sdp stamp` and shows only over http(s), so a page opened through `file://` and a Pack export show no basis. Nothing marks a working-tree graph as holding uncommitted edits | *graph keys*; `spec:consumers.spec-studio.sharing#rule.buildWritesNoStamp`; `spec:consumers.spec-studio.shell#rule.stamp`; `spec:consumers.spec-studio.export#rule.exportBytes` | a projection input, or a revision of the sharing and export Specs; at minimum an honest "not stamped" absence | `proposed` |
| A perspective applied inside a reading | role homes; reading a Pack for one concern | Perspectives are corpus data the perspective filter (recipe 37) takes on the agent surface. The Studio reads at most two inputs, a base graph and run records, and evaluates no recipe 37. This repository keeps no perspective file | `spec:consumers.spec-studio.data.inputs#rule.namedInputs`; `spec:consumers.spec-studio.data.recipe-answers#design.recipeEvaluations` | a named projection input, designed the way the scoped `spec:consumers.spec-studio.register-input` designs a third one | `proposed` |
| Questions for a decider other than `owner`, and who acts on a `delegated` question | "what only I can settle" in a role home | The Studio's queue page lists only `owner` questions (`spec:consumers.spec-studio.owner-queue#rule.ownerQuestions`); another token, such as `delegated`, is read through recipes 46 and 53 with `params.decider`. The token references nothing, so no reading can say who acts on a `delegated` question. Waiting readiness statements belong to no decider | the statement queue (recipe 46) with `{"decider":"delegated"}`; *deciders* | a projection change: a queue per decider token | `proposed` |
| A recorded basis for an assistant's selection or explanation | AI-assisted readings ([05](05-specialised-and-ai-readings.md)) | Only deterministic readings exist. A blocking question the owner decides holds generated presentation; its provisional reading allows selecting existing readings only, with generated text kept outside the Studio | `spec:consumers.ai-assisted-reading` (stated `idea`) | the output contract that question asks for; its trigger is a measurement from this design pass | `spec:consumers.ai-assisted-reading#question.aiPresentationBoundary` |
| Links from UI entries to visual design artifacts | product-designer reading (later audience) | UI entries are keyed open entries with no convention for design-tool links. The seed's `UiFacet` type listed Figma nodes, Storybook stories and screenshots ([seed core primitives, §2.10](../lineage/v0-design/01-core-primitives.md)) | *ui entries*; `g.findByConcept("figma")` returns nothing | a UI-entry convention | `proposed` |
| A route from a decision's registry name (such as MD-22) to its Spec | decision lineage; architect home; any reader holding a registry name from prose | The registry is [`DECISIONS.md`](../concept/DECISIONS.md), outside the graph, and few decision Specs mention their registry name, so search cannot find a decision by it ([10](10-studio-baseline.md)) | `g.findByConcept("MD-22")` returns nothing | a named projection input, as the scoped `spec:consumers.spec-studio.register-input` designs one for an outside register; or the registry name as authored decision content | `proposed` |
| "The other end of this relation changed since the base" | Spec and Pack pages read against a base; the auditor ([12](12-analogous-products.md)) | The design diff (recipe 35) reports changed parts per Spec, relation targets among them, but no reading says that the other end of a relation changed | `g.findByConcept("suspect")` returns nothing; recipe 35's contract in the [catalog](../agent-surface/recipes.md) | a recipe composed over the two graphs recipe 35 already reads; derived, never authored | `proposed` |
| Which readings select a Spec | every Spec page; the corpus curator ([12](12-analogous-products.md)) | Perspectives are corpus data passed to the perspective filter (recipe 37) on the agent surface; nothing lists which readings select a given Spec, so a Spec no reading selects stays invisible | recipe 37's contract in the [catalog](../agent-surface/recipes.md) | the reading layer, once role readings are declared as data | `proposed` |
| Which recipe answers each Studio page reads | a skill or reviewer that maps a task to a page and the recipe re-running its answer; checking that mapping | The build evaluates the recipes into maps keyed by number, and only each page's renderer code says which it reads; `#design.pageRecipes` states it in prose. The Studio skill's page table could be held to it only by recording each read and attributing it to the renderer on the stack | `spec:consumers.spec-studio.data.recipe-answers#design.pageRecipes`; the skills test "names for each page a recipe whose answer that page reads" | section or key: a keyed Design entry per page | `proposed` |
| A small or deliberately awkward test corpus | the test states every reading must survive ([09](09-design-method.md#4-test-corpora-and-states)) | The self-hosted corpus and the worked example cannot supply every state; neither holds an idea-only Pack | the idea-only Pack query in [09](09-design-method.md#4-test-corpora-and-states), run on both roots | corpus content outside the self-hosted corpus, such as a fixture corpus | `proposed` |

Rows are design findings, not commitments. Design questions here run over many months of iterative
work, so a row may stay open for the whole horizon; that is a valid state, and a reading shows the
absence until the graph holds the material.

## Reader frictions found by design research

The log above records material the graph lacks. This section records frictions in the agent
surface: places where the reader (`g`), a shipped recipe or the
[catalog](../agent-surface/recipes.md) cost an agent extra calls, or gave an answer that read as
more than it said. They were observed when agents explored this repository for the design research,
found by mining those agents' transcripts, and each was reproduced with the query in its row. Each
is a consideration for an engineering session, not a decision, and its candidate responses are
options. A design session records them and changes nothing: the reader, the recipes, the catalog,
the skills and [AGENTS.md](../../AGENTS.md) are all engineering edits.

The yardstick is the outcome of `spec:consumers.agent-surface.answer-shapes`: "each answer in one
call that fits its context, with every miss explained". Each body runs as
`pnpm --silent sdp:q '<body>' --json` and answers at the commit it runs on; re-run it rather than
trusting the row. Some bodies pass a deliberately wrong id, address or field to show how a miss is
answered; those are not citations. One friction found the same way is already a log row: a decision registry number
such as MD-22 finds no Spec. Two mining notes about duplicated lines in the event logs describe the
logs, not the surface, and are left out.

| Friction | How it shows | Effect on a reader | Candidate response | Ruling |
|---|---|---|---|---|
| **Recipe answer shapes are guessed, and a wrong path is silent.** Envelopes differ: some recipes answer under `totals`, others under `total` or `errors`; the open-question register (recipe 20) nests its rows under `specs[].questions`, the roadmap (recipe 53) under `roadmaps[0].entries` | `const r = await recipes(20, {}); return [r.rows, r.questions, Object.keys(r)]` gives `null`, `null` and `totals specs malformed`; `Object.keys(await recipes(53, { pack: "pack:roadmap" }))` gives `decider roadmaps`; `await recipes(20, { nope: 1 })` gives `{ unknownParams, accepts }` and no answer fields | A guessed path prints `[]` or `0`, which reads as "no open questions" or "an empty roadmap". Several agents probed keys, grepped the catalog or dumped a whole answer before they could filter it | The unknown-parameter reply also naming the answer's top-level fields; an answer-shape line at the head of each catalog entry; one envelope, such as `totals` beside named lists, for the recipes that lack it | |
| **Summary rows lack a Spec's content, so a field read off them is a silent zero.** `g.specs()` rows carry the id, coordinates, delivery facts, file, Packs and sometimes the narrative, but no sections, bindings or open questions; `g.packs()` rows carry no members | `return [g.specs().filter((s) => s.sections?.intent?.actor).length, g.specs().filter((s) => g.specContext(s.id).sections.intent?.actor).length, g.packs().filter((p) => p.members).length]` gives `0`, a non-zero count, `0` | Optional chaining turns a missing field into "no Spec names an actor" or "no Pack has members". Agents read the zero as data, or fell back to grep once they doubted it | The row fields listed in the skill and the catalog, naming `g.specContext` and `g.packContext` as the place for content; rows that throw on an unknown field; or sections on rows, weighed against the flooding row below | |
| **Field names on nodes, edges and adapter answers are guessed.** Node types are `Primitive`, `Pack`, `Anchor` and `CodeNode`; edges carry `from`, `type`, `to` and `claim`; `g.findByConcept` names matches in `matchedIn`; `g.specContext` is flat; Pack membership is `belongsTo`, while `memberOf` is component structure | `return [graph.nodes.filter((n) => n.nodeType === "spec").length, graph.edges.filter((e) => e.kind === "belongsTo").length, Object.keys(g.findByConcept("roadmap")[0])]` gives `0`, `0`, `id nodeType matchedIn` | Hedged reads such as `e.type ?? e.kind` and `r.fields ?? r.matchedIn`, a probe call per surface, and misleading counts: one agent counted `memberOf` edges as Pack membership | A field table for nodes, edges and each reader method's answer, in the skill or the catalog (the skill names node and edge types but not edge fields) | |
| **A reader method that does not exist fails without naming the ones that do** | `return g.spec("spec:consumers.reader")` exits 1 with `sdp q: g.spec is not a function`, and `g.resolveAddress` the same; `return Object.keys(g)` lists the methods | Agents guessed `g.spec`, `g.resolveAddress` and `g.decisions()`, spent a call listing the methods, or looped `g.specs().find` where `g.specContext` was the join they wanted | A clearer error naming the reader's methods and the nearest match; the method list in the skill's contract section | |
| **`recipes()` returns a Promise, and a missing `await` reads as a missing field** | `const a = recipes(12, {}); return [typeof a.then, a.components]` gives `function` and `undefined` | An `undefined` field and an error further on, with nothing at the call site pointing to the missing `await` | A sentence in the skill's contract that `recipes` is async; a sink error when a body reads a field of a pending recipe answer | |
| **`g.resolveEntryAddress` returns no wording, file or line, and names slots unlike `ruleKeys`.** It answers `{ entry, resolves, reason }`; `entry` is a slot such as `rule[4]`, which `sections.behavior.ruleKeys` writes `rules[4]`. A key in the wrong section fails with a one-word reason | `const id = "spec:consumers.agent-surface"; return [g.resolveEntryAddress(id + "#rule.entryAdapters"), g.specContext(id).sections.behavior.ruleKeys.entryAdapters]` gives `entry: "rule[4]"` and `"rules[4]"`; `g.resolveEntryAddress("spec:consumers.reference-projection#rule.namedOutsideReader")` gives `reason: "section"`, though the key resolves as `#question.namedOutsideReader` | To quote an address with its line, agents grepped carriers for the key or hand-joined `ruleKeys` with `entryLocations`, translating slot names. Address resolution (recipe 25) returns the value, file and line, but agents reach for the reader join first | A skill line sending quote checks to recipe 25; one slot naming across `ruleKeys`, `entryLocations` and the join; file and line on the join's answer, or a reason naming the section where the key does resolve | |
| **The two concept searches disagree, and neither says what it did not search.** `g.findByConcept`, which concept search (recipe 6) wraps, matches a literal substring of ids, titles, labels, framing, narrative and sections; entry search (recipe 23) matches whole tokens, splits camelCase and drops punctuation | For `accessib`, `localStorage`, `growByRecipe`, `graph only` and `--runs`, compare `g.findByConcept(t).length` with `(await recipes(23, { term: t })).totals.matches`: the stem is found only by substring; the camelCase word, the rule key and the phrase only by token; `--runs` becomes `runs` and matches hundreds of entries. `g.findByConcept("role vocabulary")` misses `spec:protocol.role-vocabulary`, and `decision readiness posture` finds nothing in either | An empty answer from one search reads as absence, and agents grepped `src/` or `specs/` instead. A common word floods: `owner` also matches prose ownership, a different sense | A catalog note on each search's matching rule, what it skips and when to try the other; a field in each answer naming its matching rule; spaces and hyphens treated alike in `g.findByConcept` | |
| **Entry search shows at most 50 rows, in Spec-id order, and takes no scope.** Concept search likewise lists 25 rows beside its total | `const q = await recipes(23, { term: "question" }); return [q.totals, q.matches.filter((m) => m.id === "spec:consumers.spec-studio.registers").length]` gives `shown: 50` of many more matches and `0` rows for a Spec with matching entries; adding a `spec` parameter gives `{ unknownParams: ["spec"], accepts: ["term"] }` | Filtering the rows to named Specs or a family silently drops matches past the cap, and agents concluded that a Spec held no such entry | A `specs` or `pack` scope parameter on recipe 23; a `leftOut` field, as the recipes taking `detail` carry; a catalog note that `shown` below `matches` means rows were cut | |
| **Large answers flood, and agents cut them with `head` or `slice`.** Concept search takes one term and has no summary mode; an unshaped `g.specs()` filter, the decision register (recipe 31), entry search on a common word and the architecture map (recipe 17) print tens to hundreds of thousands of characters | Recipe 17's shipped body with `--json` prints several hundred thousand characters. Recipe 53's answer cut with `head -c 600` no longer parses as JSON, while `return (await recipes(53, { pack: "pack:roadmap" })).roadmaps[0].entries.map((e) => [e.place, e.id])` prints a few hundred characters. `await recipes(6, { terms: ["owner", "stamp"] })` gives `unknownParams` | Invalid JSON, spent context, and a shell loop over recipe 6 that derives the graph once per term | A `detail` summary, as recipes 4, 29, 35 and 54 carry, on the large recipes; a list of terms for recipe 6; a catalog example looping `g.findByConcept` in one body; the skill's pre-shape rule repeated beside its recipe table | |
| **Reading one Spec through a recipe prints more than its carrier.** The guarantees recipe (recipe 3) returns each section's entries with their binding fields, as its law asks; the context bundle (recipe 36) adds more | With `--json`, recipe 3 prints about 1.4 times the bytes of the carrier of `spec:consumers.spec-studio.sharing` (its path is `g.specContext(id).file`), and about 1.6 times for `spec:model.open-question-fields`; recipe 36 over five Studio Specs prints more than twice their carriers. A body returning each Spec's outcome and rules from `g.specContext` is smaller than the carriers. Not reproduced for the design slice (recipe 54): its summary over the same five is smaller than their carriers | Agents went back to `cat` for "what does this Spec say", short of the answer-shapes outcome | A wording-only reading, as a recipe or a catalog body over `g.specContext`; a catalog note naming the leanest call for each question; answer size compared with carrier size in the recipe tests | |
| **The context bundle's budget counts compact JSON, but `--json` pretty-prints** | `const b = await recipes(36, { pack: "pack:spec-studio-v1", part: 1, budget: 40000 }); return [b.used, JSON.stringify(b, null, 2).length]` gives `used` just under the budget and a printed size about 1.4 times it | A part sized to fit a context overflows it once printed; the mining measured up to about 1.6 times | The budget counting the printed form; the catalog and the answer stating which form `used` measures; a compact `--json` | |
| **Floor clauses name no carrying Spec.** Promotion preflight and the lower ladder (recipes 9 and 11) name an unmet clause, such as `kind-evidence-present`, with a one-line description | `return (await recipes(9, { spec: "spec:carrier.sdp-import.feature-adapter" })).aboveStated.failures` gives the clause id and "The kind's natural evidence is present (per-kind evidence table)."; `g.findByConcept("kind-evidence-present")` returns two child Specs, not `spec:validation.kind-evidence` | One agent read `src/validate/readiness-floor.ts` to find the law behind a clause | The carrying Spec's id on each clause in the answer; a clause table in the catalog | |
| **Names the handbook and the skill use are not in the graph** | `return ["MD-22", "second-caller bar", "second machine consumer"].map((t) => g.findByConcept(t).length)` gives `0`, `0` and a non-zero count; entry search agrees. The [skill](../../skills/sdp-agent-surface/SKILL.md) uses both phrases for the same bar; the corpus uses only the second | Agents that met a registry number grepped [DECISIONS.md](../concept/DECISIONS.md); the skill's "second-caller bar" leads nowhere | For registry numbers, the options in the [log](#log)'s registry-name row; the skill's wording aligned with the corpus | |
| **The ratified glossary is outside the graph, and the searches do not say so.** [CONTEXT.md](../../CONTEXT.md) holds no node, and keyed Model terms sit in a small minority of Specs; words such as perspective, lens and stamp are not among them | `return [g.byFile("CONTEXT.md").nodes.length, (await recipes(6, { term: "ubiquitous language" })).total, Object.keys(await recipes(6, { term: "ubiquitous language" }))]` gives `0`, `0` and `term total matches`, though the glossary uses the phrase; no field says the glossary went unsearched | Agents read the whole glossary, tens of thousands of characters, or grepped it, after an empty search read as "no such concept" | A note in each search answer, or in the catalog, that the glossary is not searched; the glossary as a named input, as the log weighs for the decision registry; more keyed Model terms | |
| **Decision entries, Intent outcomes and narrative carry no location rows** | `const id = "spec:decisions.roadmap-priority"; return [g.specContext(id).entryLocations.map((l) => l.entry), (await recipes(23, { term: "priority" })).matches.filter((m) => m.id === id).map((m) => [m.entry, m.line])]` gives relation lines only, and `line: null` on every decision entry | A line cited in a decision Spec cannot be checked from the graph; agents read decision carriers whole | Location rows for decision entries, Intent fields and narrative; until then, a catalog note that these entries are never located | |
| **Address resolution (recipe 25) calls a bare Spec or Pack id malformed, and throws on a non-list** | `return (await recipes(25, { addresses: ["spec:consumers.reader", "pack:roadmap"] })).rows.map((r) => r.reason)` gives `malformed` twice, though both ids resolve; `await recipes(25, { addresses: "spec:consumers.reader#rule.x" })` exits 1 with `addresses.map is not a function` | Checking a document's citations needs a second, hand-rolled id check, and about half the tokens these design pages cite are bare ids; a wrong parameter ends the body instead of returning diagnostics | Bare ids resolved, or reported under their own reason apart from `malformed`; parameter diagnostics like the other recipes' | |
| **The design slice refuses everything when one id does not resolve, and ids and paths are guessed from each other** | `return await recipes(54, { specs: ["spec:consumers.reader", "spec:consumers.spec-studio.pack"] })` gives only `diagnostics`; the second id was guessed from the Pack manifest `spec-studio.pack.sdp.md`, which `g.byFile` names `pack:spec-studio-v1`. `g.byFile("specs/model/spec-envelope.sdp.md")`, a guessed path, answers like a file the graph records nothing at | One wrong id costs the whole slice; a wrong path reads as "nothing is recorded here" | The ids that resolve sliced and the rest listed; a near match in the diagnostic; `g.byFile` saying when no file exists at the path | |
| **One field name carries two shapes.** `design.openQuestions` is a list of questions on `g.packContext` members and a count on the design slice's member rows | `return [Array.isArray(g.packContext("pack:roadmap").members[0].design.openQuestions), typeof (await recipes(54, { pack: "pack:roadmap" })).members[0].design.openQuestions]` gives `true` and `"number"` | Code written against one surface iterates a number, or counts a list, on the other | A distinct name for the count; or a catalog note on the difference | |
| **Some empty answers do not say what they never looked at.** Entry citations (recipe 51) record citations only in files that carry a recognized anchor; the open-question register holds open questions, while a deferral is a decision Spec | `return [(await recipes(51, { specs: ["spec:consumers.spec-studio.shell"] })).totals.citations, g.byFile("test/self-hosting-oracle/consumers.ts").nodes.length]` gives `0` and `0`, though that test file cites `spec:consumers.spec-studio.shell#rule.stamp`. No open question mentions MCP, while `g.findByConcept("MCP")` returns `spec:decisions.mcp-deferred` | "Uncited" and "nothing rules on this" are read from answers that never looked | A field in recipe 51's answer naming what it does not scan; both cases among the skill's "Empty answers that mislead" (recipe 51's limit is stated only in its entry-address notes) | |
| **The handbook's "Next work" block runs a command with a side effect for a read.** It tells readers to re-run `sdp validate`, which enters the shared build and removes the five page roots | Not run here, because it would remove the generated pages. The effect is the law at `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` ("every command that enters this build, including validate ..."). `return report.findings.length` reads the same validation report through `sdp:q`, which writes nothing | A reader who wanted only the findings loses the Design Review, census, Mermaid, Gherkin and Studio pages until the next generation | The block reading findings through `sdp:q` (`report`, recipes 8 and 11), an edit to [AGENTS.md](../../AGENTS.md); or a validate mode that skips the build's removal | |

## Agent on-ramp observations

The frictions above are in the reader. These are in the on-ramp to it: the handbook and the skills
that should bring an agent to the graph first. They come from the owner's review of this design
session and from what the session itself did. Like every row on this page, they are considerations
for an engineering session; the owner marked the skills for the very next one.

- **The mandatory order was not followed, even where it was read.** [AGENTS.md](../../AGENTS.md)
  says to load the matching skill, then ask the graph, then read files. The main thread of this
  session explored by text search and loaded `sdp-agent-surface` only after the owner insisted; the
  first research workflow's brief listed graph queries last among its tools and never named the skill,
  and its agents searched and read carriers far more than they queried the graph. Briefs that named
  the skill and gave exact `sdp:q` bodies were followed.
- **The on-ramps are large single files.** Each repository skill is one `SKILL.md` with no disclosed
  reference files, and the mandatory reading skill is several hundred lines; `AGENTS.md`, loaded on
  every turn, is larger still. Steps such as "Bootstrap discipline" sit among long reference, so the
  first thing an agent must do is easy to miss or to skip. Progressive disclosure (short steps in the
  body, reference behind well-worded pointers) is the owner's direction. Measure with
  `wc -c AGENTS.md skills/*/SKILL.md`.
- **The CLI's value needs a better pitch.** The first generation's fixed verbs suited earlier models;
  a modern agent prefers its own ad hoc tools. `sdp q` is not a replacement for them but a complement:
  the graph answers structure, claims, derived facts and its own blind spots in one call, and a text
  search then reads the exact lines the graph points at. The on-ramps should say so, and promote the
  CLI by showing that pairing rather than forbidding the other tools. A hook could force the order;
  the owner prefers that the on-ramp earn it.
- **Specify work partly in graph queries, not only prose.** A brief, plan, task or cycle record should
  carry the queries that define its scope and its evidence, so that whoever picks it up starts from
  the graph. The design method applies this to design work ([09](09-design-method.md)); the same rule
  could shape plans, arc records and agent briefs generally.
- **Orientation queries now open every session.** The owner's TODO in AGENTS.md asked for about ten
  mandatory `sdp:q` queries that teach the practice and present the project. Eleven were drafted,
  ranked by what the research agents actually needed, and each ran twice with identical output. By the
  owner's choice, AGENTS.md carries a short "Orient before work" block, and the bodies live in
  [`orientation.md`](../../skills/sdp-agent-surface/references/orientation.md) beside the skill, behind a
  one-line pointer. Two considerations remain: the recipe tests do not run these bodies, and the
  package's `files` list names each `SKILL.md` only, so the orientation file does not ship to
  adopters. Whether it should, and in what adopter-neutral form, is an engineering decision.
- **The skills are outside the graph.** No Spec, anchor or concept search reaches the skill folder:
  `g.byFile("skills/sdp-agent-surface/SKILL.md").nodes` and
  `g.findByConcept("skills/sdp-agent-surface")` are both empty. The on-ramps that teach the graph
  are themselves invisible to it, so nothing checks them against the law they teach.
- **The green gate reads operating-system files as projection drift.** On macOS, Finder writes
  `.DS_Store` into a `generated/` folder that is open in a window. `--check-clean` reads every file in
  a published root as a page, so `npm run check` failed with "generated Mermaid differs" and then
  "generated Studio differs", and each failing check removed its root. The same tree passed in a
  clean worktree. The engineering session that followed took the option of ignoring such files:
  `spec:consumers.wholesale-view-rewrite#rule.osMetadata` leaves every file the `junk` package
  lists out of each read of a published root and retries tree removals, the gate's
  `projection-suite.mjs` stages prior roots by rename rather than copy (a copy failed with
  `ENOENT` while a folder gained a file), and the tests plant such files in every published
  folder. Follow-ups: the vault still ignores only `.DS_Store`, as its ruled decision
  `spec:decisions.vault-owned-folder` states, so widening it to the same list is the owner's
  call; and why Node 24's unfiltered `cpSync` failed was never reduced to a minimal case.
- **Pending evaluation: map research output to the graph.** The owner's intended check is to take the
  research run's findings and ask, for each, what the graph could have fetched directly. The
  transcript mining above answers a neighbouring question (what agents needed while researching);
  the output mapping would measure the graph's coverage of what the research concluded.

## Evidence queries

Each body runs in this checkout as `pnpm --silent sdp:q '<body>' --json`. They answer at the commit
you run them on; re-run them rather than quoting an earlier answer.

| Name | Body | What to read |
|---|---|---|
| *fields* | `return [...new Set(graph.nodes.flatMap((n) => Object.keys(n)))]` | every field any node carries; none names an owner |
| *deciders* | `return (await recipes(20, {})).specs.flatMap((s) => s.questions.map((q) => q.decider ?? null))` | the decider token on each open question |
| *actors* | `return g.specs().filter((s) => g.specContext(s.id).sections.intent?.actor).map((s) => s.id)` | the Specs whose Intent names an actor |
| *graph keys* | `return Object.keys(graph)` | the graph object holds no commit and no time |
| *reasons* | `const d = graph.edges.filter((e) => e.type === "decidedBy"); return { all: d.length, withReason: d.filter((e) => e.reason).length }` | how many `decidedBy` relations carry a reason; swap the type for another authored relation |
| *constraints* | `return g.specs().filter((s) => s.specKind === "constraint").map((s) => s.id)` | the constraint Specs; add `--root examples/checkout-v1` for the worked example |
| *rule keys* | `return (await recipes(48, { commit: params.commit })).totals` with `--params '{"commit":"<the commit you read>"}'` | `proposed` beside `entries`: the rule and flow entries with no key |
| *ui entries* | `return graph.nodes.filter((n) => n.sections?.ui).map((n) => ({ id: n.id, keys: Object.keys(n.sections.ui) }))` | the keys each UI section uses |

Address resolution (recipe 25) checks every entry address this page writes: pass them as
`params.addresses`. An address that stops resolving was settled, renamed or moved; git says which.

## A corpus home for these needs (a proposal)

This is the one statement of the proposal; the [README](README.md), [06](06-design-cycles.md),
[08](08-what-the-repo-settles.md) and [09](09-design-method.md) point here. It is for an engineering
session and the owner. A design session does not make it, and none of it exists in the corpus yet:
concept search (recipe 6) finds no carrier for "persona", "role home", "basis line" or "object
page".

- **A design Pack** named for the capability it designs, never a number or a date, holding `idea`
  capture Specs that refine `spec:consumers.spec-studio`, or `spec:consumers.projections-model` for
  a new projection. Candidate captures: the landing and arrival, the technical product manager's
  entry reading, the flows *review a Pack for readiness* and *review a pull request's design
  change*, and question pages.
- **Existing captures.** The Pack may list the captures already waiting on this work:
  `spec:consumers.ai-assisted-reading` (its trigger names the UX design pass), and those held for a
  named reader (`spec:consumers.reference-projection#question.namedOutsideReader`,
  `spec:consumers.structural-mermaid#question.namedStructuralReader`,
  `spec:consumers.projections-model.roadmap-views#question.releaseReader`). A persona from
  [01](01-roles-and-perspectives.md) could become such a reader only through the owner.
- **Keyed questions in place of `proposed` and of 06's tables.** Each row above that needs a ruling,
  and each long-horizon question in [06](06-design-cycles.md#design-questions-for-the-long-horizon),
  becomes a keyed open question on the capture it bears on, blocking where it holds that capture,
  with `decider: owner`, the current lean as its `provisional` line, `links` to the Specs or entries
  it rests on, and a `trigger` only where it waits on evidence from a design cycle. A ruling that
  passes the three-part decision test becomes a decision Spec below `ready` that the shaped Specs
  name through `decidedBy`.
- **What comes with it.** The self-hosting obligations every new Spec carries; candidate words
  flagged in `CONTEXT.md`'s Flagged ambiguities; new jobs written as job stories, paired with
  personas in the design material.
- **A slimmer log.** Once those land, a row keeps only its need, its evidence and its question's
  address, and the question's state is read from recipe 20 and the Studio's questions page.
- **No priority and no roadmap entry.** The Pack takes no `order`: the roadmap stays the one place
  for priority, and a capture landing adds nothing to it
  (`spec:protocol.roadmap-replaces-plans#rule.oneRoadmap`). The design Pack joins `pack:roadmap`
  only on the owner's word.
- **Precedent.** `pack:obsidian-vault-v1` began as `idea` captures with a throwaway prototype as
  their cited evidence (commit `1b014d01`); its members all state `ready` today (Pack design,
  recipe 29, over that Pack).

| For | Against |
|---|---|
| The project becomes readable by its own readings: the open-question register (recipe 20), the statement queue (recipe 46), the Studio's questions and owner queue pages, and Pack design, the design slice and the design diff (recipes 29, 54 and 35), as the [handbook](../../AGENTS.md) asks of an arc's Pack | Each capture brings the self-hosting obligations: membership in `pack:self-hosting-v1`, the self-hosting oracle tests and the green gate (`npm run check`), so each costs engineering time |
| Questions carry who decides, the provisional reading and the trigger with no hand-kept status; the question tables in 06 stop being a register beside the graph | A capture names a reading before the cycles show it is needed; `idea` is cheap and lawful, but unneeded captures must later be withdrawn |
| The design project uses the readings it designs | Its open questions join everything the self-hosted corpus reports to every reader of it |
| | 06's question tables and this log's `proposed` rows must retire in the same change, or they become a second register |

Other options stay open: keep the design questions in [06](06-design-cycles.md) until evidence
settles them, as today; or keep a person's long-running notes in a vault's `intent/` folder, outside
the delivery record (`spec:consumers.obsidian-vault.iteration#rule.composeHome`). Whether a corpus
home is wanted, whether it is one Pack or several, and where exploratory commercial Studio design
intent is recorded stay open
([06](06-design-cycles.md#the-design-project-and-visual-design)).
