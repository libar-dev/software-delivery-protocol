# Plan 46. Designs people can read, and an adopter at full speed

> **Status:** EXECUTING on `feature/studio-and-adoption-v0`, from `main` at `5a0b22c`, the merge of
> PR 33. One branch and one PR. The rulings below were made by the coordinating session on the
> owner's delegation of 2026-10-21; the decisions only the owner makes are listed apart. A thin
> lineage pointer: once the design passes land, readiness, backlog and open questions are read
> from the graph (recipes 1, 9, 11, 20, 29, 33), never from this file. If this file and the graph
> disagree, the graph wins and this file is stale.

## Why

The first adopter, libar-platform, is about to move its whole corpus onto the authoring
capabilities PRs 29 to 33 added. A read-only survey on 2026-10-21, at its branch
`sdp/design-at-scale` (`b038bd4`, PR libar-platform#13, pinning the Protocol at `abf532d`),
measured how far it has to go:

| What | The platform today |
| --- | --- |
| Specs, Packs | 243 Specs in 6 Packs; 122 examples, 22 decisions, 12 component units |
| Stated `ready` | 0; the floor allows `ready` on 221 |
| Rule keys | 0 of 987 rule and flow entries |
| Question fields | 0 of 166 keyed questions |
| Relation reasons | 0 of 978 authored relations |
| `exercises` | 0 of 123 example `verifies` edges |
| Component designs, perspectives | none |
| Context bundle | `application` and `foundation` exceed the default budget after every cut |
| Rules file | `design/rules/policy.js` keeps about 110 lines copied from recipes 25 and 26 |

The grammar the platform needs is built and verified. What holds it back is elsewhere:

1. **People cannot read a design from a link, and the pages are text only.** The Studio's phase
   0 is generated and ignored, so no reviewer opens it from a pull request. It draws no diagram.
   The platform's decision 58 therefore keeps hand-built Markdown Pack pages.
2. **The owner's attention is the bottleneck.** 221 statements, 10 blocking questions and every
   delegated ruling wait on one person, and no page orders them.
3. **The design loop leaks at scale.** Rules files copy recipes, two Packs never fit a bundle,
   rewording a step breaks the example bound to it, and no page shows the test line that checks a
   pinned declaration.
4. **No kit moves a corpus onto new capabilities.** An adopter learns what it does not use yet
   only by hand-rolled queries, as the survey did.

On 2026-10-21 the owner asked for one more Protocol PR before the platform's mass update, as
comprehensive as it can be, with every ruling the owner is not essential for made by the
coordinating session.

## The lanes

| Lane | Delivers | Kind |
| --- | --- | --- |
| **R** reach | A body calls shipped recipes as functions; recipes 25 and 26 answer as rules files; the body evaluator exported; rules files watched; checked external registers; `--help` on every verb; one verb that writes every projection root | design, then build |
| **K** stable keys | Step keys that survive rewording; term addresses | design, then build |
| **D** checked declarations | Entry citations in anchored source, shown beside each pinned declaration | design, then build |
| **B** bundles in parts | A bundle split into parts within the budget, complete across them | design, then build |
| **Q** the owner's queue | The readiness planner and the statement queue | design, then build |
| **U** the upgrade kit | The capability adoption recipe, the rule-key proposal, the upgrade guide | design, then build |
| **S** the Studio, phase 1 | Diagrams and the architecture lens, every Spec-page panel, the registers as pages, the owner queue page, the design diff page, run evidence, the composing panel, sharing with previews, Pack export and print, the watch view, a glossary page | design, then build |
| **V** the vault | `pack:obsidian-vault-v1` built as its own projection | design, then build |
| **G** the corpus | Open questions with standing provisional answers ruled into their Specs; the superseded-decision signal; the validator audit; the delegated `ready` statements | rule, then build |
| **X** integration and close | Catalog, oracle, skills, `CONTEXT.md`, decisions registry, help, README; adversarial review; acceptance on a copy of the platform; screenshots; the PR | close |

Recipe numbers are pre-assigned so lanes do not collide: 44 example-space coverage (S), 45 run
evidence (S), 46 the statement queue (Q), 47 capability adoption (U), 48 the rule-key proposal
(U), 49 the proposal memo (S), 50 external registers (R), 51 entry citations (D).

The arc's intent lives in the corpus, never only here. Each design pass authors or matures the
carrying Specs, extends `pack:spec-studio-v1` and `pack:obsidian-vault-v1`, and gathers the
adopter-side lanes (R, K, D, B, Q, U) in one new Pack, `pack:adopter-speed-v1`.

## Waves

1. **Design.** Parallel design passes: S (the largest), V, K, one pass for R, D, B, Q and U
   together, and G's rulings. Each pass is reviewed by a second model family before the executing
   thread rules on what it recommends and states the rungs the builds start from.
2. **Build.** Parallel worktrees: R, K, D, B, Q, U, G, V, and S in at least four slices
   (diagrams and lenses; Spec-page panels; registers, the owner queue and the diff page; run
   evidence, the composing panel and sharing, export, print and watch). Each build is reviewed by
   a family other than the one that built it, and every fix lands with a test that failed first.
3. **Integrate and close.** One integration pass, an adversarial review of the whole branch in two
   families (code, and the design's honesty), acceptance on a read-only copy of the platform, the
   screenshots and the PR.

The executing thread picks the model per lane. Builds and reviews run as Relay jobs through the
Workflow tool, never as plain `relay:job` calls, so a job survives a restart.

When the platform needs a capability, the Protocol builds it in this PR. The platform's own
corpus is never edited here: every platform measurement runs on a copy, and the mass update is the
platform's next PR.

## Rulings at the start

Made by the coordinating session on the owner's delegation of 2026-10-21. A design pass that finds
one unsound reports it to the executing thread, which rules again and records why.

| Ruling | Carrying Spec |
| --- | --- |
| The delegated rulings of plans 43 and 45 are confirmed, after reading, with no reversal; plan 45's lane E (the platform's committed Pack page) stays the owner's | plans 43 and 45 |
| A body calls a shipped recipe as a function through a fifth injected binding, `recipes`, in `sdp q` and in rules files; it takes parameters as data and returns the recipe's answer unchanged; no reader verb is added | `spec:consumers.agent-surface.evaluation-sink` |
| Recipes 25 and 26 add a `findings` list, so each runs as a rules file as shipped; the rest of their answers is unchanged | `spec:validation.corpus-rules` |
| The package exports the body evaluator, so a script holding a graph runs a shipped recipe without deriving the graph again (a deferral; its trigger fires with the `recipes` binding) | `spec:consumers.agent-surface.evaluation-sink` |
| Under `--watch`, editing a rules file starts a cycle; this replaces plan 45's `watchReruns` ruling, since the mass update edits rules files beside carriers | `spec:validation.corpus-rules#rule.watchReruns` |
| Citations of an outside register stay prose: recipe 50 checks the tokens a corpus names by pattern against a register file it passes with `--params KEY=@PATH`, and answers as a rules file; no grammar and no graph node | a new validation Spec |
| An example step may carry a `[#key]` marker; a keyed step keeps its contract key and its binding when its wording changes, and an unkeyed step is keyed by its text as now; Gherkin uses the same marker | `spec:extraction.executable-contracts` and a new carrier Spec |
| A Model term carries an authored `[#key]` marker, and its address is `spec:<id>#term.<key>`; the ratified glossary stays a document (answers `termKeyForm`, `glossaryTerms`, `addressSection`) | `spec:model.term-addresses` |
| The extractor records where an anchored source file cites an entry address, as an inferred, located citation that confers nothing; the Studio shows the citing test lines beside each pinned declaration | a new extraction Spec |
| A context bundle may come in ordered parts, each within the budget, whose union is the whole bundle; a member that alone exceeds the budget is reported, and a partial bundle stays refused | `spec:consumers.context-bundle` |
| The readiness planner orders the Specs whose floor allows a higher rung than stated, the Specs they rest on first, and states nothing (a deferral; 221 waiting statements fire its trigger) | a new consumers Spec |
| The upgrade kit reports and proposes, never edits: recipe 47 lists, per Spec and Pack, the capabilities in use and where each could apply; recipe 48 writes a change proposal adding rule keys, which an agent applies after the proposal check | new consumers Specs |
| Studio phase 1 builds every page and panel the Studio's Specs describe, except runtime observation and the sources no Spec designs (build attestations, deployments, SBOMs), which read not tracked | `pack:spec-studio-v1` |
| A diagram is inline SVG laid out at build time by a deterministic layered layout in the engine, readable without script; elements add only pan, zoom and pinch; above a bound the diagram folds by context, then by layer. The design pass names the bound and records the renderer in a decision refining the custom-elements decision | `spec:consumers.spec-studio.components#rule.diagramRenderer` |
| The lenses Spec splits into one child per lens, so the Packs, architecture and tests lenses no longer wait on the runtime overlay; the evidence lens reads not tracked | `spec:consumers.spec-studio.lenses` |
| The architecture lens groups components by their recorded context and layer, draws membership and `uses` only, and draws planned components from component designs apart from realized ones; component diagrams rooted at code fold into it (answers `architectureVocabulary` and `layerAndContext`) | `spec:consumers.spec-studio.lenses`, `spec:consumers.structural-mermaid` |
| The Studio admits two optional named inputs beside the graph: a base graph for the design diff, and CTRF run records; a page that shows either names the input; without them the page set is unchanged, and the same inputs give the same bytes (answers `studioRuns`; `freshness` keeps its provisional answer; the design pass settles `recipeContract` as keyed Design entries) | `spec:consumers.spec-studio.data`, `spec:observation.run-evidence` |
| The composing panel ships, and recipe 49 renders a change proposal as the Markdown memo the panel and an agent both hand off (answers `memoRecipe`) | `spec:consumers.spec-studio.intent-panel`, `spec:consumers.intent-composition.proposal` |
| Sharing: a shipped publishing step, separate from the build, writes `stamp.json`; a reusable GitHub Actions workflow builds, stamps and uploads the page set as a CI artifact on every pull request, and deploys it under `/preview/<pr>/` only where the repository has enabled a host | `spec:consumers.spec-studio.sharing` |
| A Pack exports as one self-contained HTML file, and every page prints as a document | a new Studio child Spec |
| `sdp studio --watch` rebuilds the page set on each carrier change, byte-identical to a plain build, with no server and no injected script | `spec:consumers.spec-studio.publisher` |
| The vault is built: its blocking questions take their provisional answers; its design pass settles `idProperty` | `pack:obsidian-vault-v1` |
| The provisional answers stand and leave their Specs as rules: `inline-code-spans#spanAcrossLines` and `#commonMarkCases`, `markdown-body-grammar#constraintEntryCount`, `slot-notation#oneLiteralVocabulary`, `open-question-fields#droppedQuestionList`, `spec-studio.pack-page#summaryFormat`, `spec-studio.spec-page#runtimeComposition`, `example-space-coverage#combinationCoverage` and `#coverageShape` | those Specs |
| A corpus may keep a replaced decision a reader still needs; the superseded-decision warning reads `decidedBy` only and names the decision at the end of the chain; it is built | `spec:validation.superseded-decision-signal` |
| The validator audit its open question describes is built and binds its suite | `spec:validation.validator-self-testing` |
| Every CLI verb answers `--help`; one public verb writes every projection root in one run; the design pass names it | the design pass names the carrying Spec |
| On the same delegation the executing thread states `ready` where recipe 9 reports the floor allows it and the arc confirms the content, among them `consumers.graph-first-planning`, `consumers.impact-graph`, `consumers.intent-composition`, `consumers.edit-model`, `extraction.contract-declarations`, `model.structural-patterns`, `protocol.self-hosting` and `protocol.structural-self-binding` | those Specs |

Kept open on purpose: `spec:model.design-maturity#question.designColumnsSufficiency`, which waits
on evidence from the platform's design passes.

## Rulings after wave 1

Wave 1 merged at `1f4d276`. Five Opus 5.5 design passes (S; V; K; R, D, B, Q and U
together; G), each reviewed by gpt-6-sol, and S and the combined pass also by Kimi K3, and
answered before the executing thread ruled. Delegated; each awaits the owner's review. The
passes' own recommendations stand as their carrying Specs state them; the rows below are the ones
a reader of the PR most needs.

| Ruling | Carrying Spec |
| --- | --- |
| A diagram holds at most 40 boxes and 100 edges; the architecture diagram is a grid of contexts by layers; a drawing still over the bound after every fold shows only its text equivalent | `spec:consumers.spec-studio.diagrams` |
| The build renders every view and an element only enhances it; this refines the custom-elements decision and awaits the owner's ratification | `spec:decisions.studio-build-renders` |
| Planned components sit in the architecture grid, dashed and labelled `planned`, and are listed again as designed, not built | `spec:consumers.spec-studio.lenses.architecture#rule.plannedApart` |
| Recipe 17 adds each component's label, file, line, role, layer, context, references and per-pair use counts; every field it returns today keeps its meaning | `spec:consumers.spec-studio.lenses.architecture#design.componentRows` |
| The build evaluates each shipped recipe a page shows once per build, so a page and an agent read one answer | `spec:consumers.spec-studio.data.recipe-answers` |
| The registers that become pages: open questions, decisions, pinned declarations with their citations, and the design backlog; the key-family register gets none | `spec:consumers.spec-studio.registers` |
| The Studio's two inputs are `--base PATH` (with `--base-label`) and repeatable `--runs PATH`; an input adds pages, never a data file | `spec:consumers.spec-studio.data.inputs` |
| A CTRF report must carry `reportFormat` and `specVersion`; recipe 45 joins a record by exact path or longest suffix | `spec:observation.run-evidence` |
| `sdp stamp` writes the stamp apart from the build, and may carry a source-link template the browser applies; the preview workflow uploads the page set and deploys to `gh-pages` only when asked, never from a fork | `spec:consumers.spec-studio.sharing` |
| Every build writes one self-contained export per Pack | `spec:consumers.spec-studio.export` |
| A body calls a recipe as `recipes(number, parameters?)`, by catalog number only; the package exports `evaluateBody(body, { graph, report?, params? })` | `spec:consumers.agent-surface.evaluation-sink` |
| Recipes 25 and 26 report findings `unresolved-address` and `dependency-cycle`, at `params.severity`, `error` by default | `spec:consumers.agent-surface.address-and-cycle-recipes` |
| Under `--watch`, the parameter files named after a `--rules` are watched and reread too | `spec:validation.corpus-rules#rule.watchedParams` |
| Entry citations are read only from files that carry an anchor; a citation shows as a test line only when a test anchor at its file verifies the cited Spec | `spec:extraction.entry-citations` |
| The statement queue orders by the four relations the ready floor reads, and a `refines` yields where the other Spec names it back; a cycle settles in one round | `spec:consumers.readiness-planner` |
| The all-roots verb is `sdp generate`; it synchronizes the vault at its folder or at `--vault DIR` before it publishes any root, and leaves the vault alone under `--check-clean` | `spec:consumers.command-line#design.vaultRoot` |
| A step key is not an entry address; keys are unique per Spec and shared by a sibling set through its vocabulary | `spec:carrier.step-keys` |
| The vault's generator owns one folder and a file list of what it wrote, refuses rather than overwrite, and synchronizes instead of rewriting; this awaits the owner's ratification | `spec:decisions.vault-owned-folder` |
| The superseded-decision warning is `conformance/superseded-decisions`; a branching chain names every end, and a loop names its members | `spec:validation.superseded-decision-signal` |
| A dropped TypeScript question list stays a warning, as the plan's provisional answer ruled; the owner may prefer an error | `spec:model.open-question-fields#rule.droppedListWarning` |
| A design pass that adds promises to a ready, implemented Spec puts them in a defined child, or enriches the Spec in place only when the same branch builds them before it merges | — |

Stated on the same delegation, at the floor recipe 9 reported and after the reviews: `ready` for
every non-example Spec the passes designed or matured, among them the plan's eight named
candidates, the Studio's phase-1 Specs, the vault's four, the adopter lanes' new Specs, step keys
and term addresses. Examples stay `defined` until a build binds them. The three new decisions,
`spec:decisions.studio-build-renders`, `spec:decisions.studio-diagram-renderer` and
`spec:decisions.vault-owned-folder`, stay `defined` for the owner to ratify. Each new `ready`
Spec reports an honest verifier gap until wave 2 binds it.

## Rulings during wave 2b integration

Made by the executing thread on the owner's delegation; each awaits the owner's review.

| Ruling | Carrying entry |
| --- | --- |
| A second diagram view of one subject inserts the view's name in its text and arrow ids; the Spec page's realization drawing uses `.realization.text` and `.realization.arrow`. | `spec:consumers.spec-studio.diagrams#design.elementIds` |
| The owner queue reads provisional readings from reader questions by Spec and key, using position for an unkeyed question; recipe 46 keeps its shape. | `spec:consumers.spec-studio.owner-queue#rule.ownerQuestions` |
| `vault` and `stamp` join the other verbs in the help contract. | `spec:consumers.command-line#design.helpVerbs` |

The merge chain, conflicts, tests and close measurements are recorded in
`reviews/plan46-wave2b-integration.md`. Plan 46 remains executing.

## Rulings by the coordinating session during the close

| Ruling | Why | Carrying Spec |
| --- | --- | --- |
| The D ruling governs over the refused list: entry citations are a located table in the graph, beside the location table, and are refused only as nodes, edges, delivery facts, readiness effects or test verdicts | The refusal was always aimed at verdicts and conferral, not at a located table like the location table | `spec:extraction.entry-citations` |

## Decisions only the owner makes

These wait for the owner. None blocks the build; each is listed in the PR description.

| Decision | Why it is the owner's | What waits on it |
| --- | --- | --- |
| Turn on a public host for Studio previews, such as GitHub Pages, on this repository and on libar-platform | Both repositories are public, so previews would be public pages, and enabling a host changes repository settings | Previews at a stable URL; until then the page set is a CI artifact |
| Whether the Studio replaces the platform's committed Pack page (its decision 58) | It is the platform's decision and its review habit | The platform retiring `scripts/pack-page.mjs` |
| What of the earlier system the platform may cite (lineage roots) | Content and provenance, not mechanism | What recipe 50 is given to check |
| The platform's `ready` statements | A rung is a person's statement; the planner only orders them | The platform's build backlog and drift alarm (9 implemented Specs not stated `ready`) |
| Merging libar-platform#13, then this PR | Merges are the owner's | The mass update starts from both |
| A first npm release, optional | Publishing a package is public and lasting; installs from a commit work now | Nothing in this PR |

## Acceptance

- `npm run check` passes. The Markdown Design Review, census, Mermaid and Gherkin projections
  change only where their Specs already promise.
- On a copy of the platform: `policy.js` drops its copies of recipes 25 and 26 and its gate still
  fails on every planted mistake its tests carry; the citation checks `check.py` still owns run as
  a rules file through recipe 50.
- `application` and `foundation` bundle completely within the default budget in parts.
- Rewording a keyed step on the copy keeps its example bound; the same test fails without the key.
- The Studio built from the copy: the architecture lens draws its components by context and layer;
  each Pack page shows a maturity map; each Spec page shows its rule coverage, its coverage grid
  and the test lines that cite its pinned declarations; the owner queue lists every waiting
  statement in dependency order; a diff page compares the copy before and after the upgrade
  kit's proposal is applied.
- A pull request to this repository uploads its stamped Studio as a CI artifact, and the shell
  shows the stamp; the Protocol's own CI writes CTRF and the preview shows those runs, labelled as
  external evidence.
- A reader job given only a link to the platform copy's pages completes plan 42's five reader
  tasks in full, the declaration task included, and three more: which statements the owner can
  make first, what changed since the last pass, and which components are designed but not built.
- The vault built from the copy opens in Obsidian and regenerates without touching a note a person
  wrote.
- Recipe 47 on the copy reproduces the survey's counts; recipe 48's proposal for one Pack passes
  the proposal check and, applied on the copy, validates with no errors.
- Every lane is reviewed across model families; the adversarial findings are fixed with tests that
  failed first.

## Deferred, with their triggers

| Item | Comes back when |
| --- | --- |
| Runtime observation and the `observed` fact | An adopter runs a deployed system a Spec targets |
| Build attestations, deployments, SBOMs | A Spec designs their source |
| Freshness that follows bound-file changes | A reader is misled by a run whose commit matches but whose files moved |
| Coverage of slot combinations | A design pass asks which combinations no example exercises |
| Exhaustive symbol reach, the gen-1 `.feature` adapter, the reference projection, roadmap views | Their recorded triggers, unchanged |

## Refused

- A rung stated by tooling, including the planner and the upgrade kit.
- A tool that edits a carrier itself; edits flow through an agent and git.
- Run records or stamps as graph data; entry citations as nodes, edges, delivery facts, readiness
  effects or test verdicts.
- A Studio build that writes a stamp, reads the network, or computes a join, claim, fact or floor.
- A page that opens a pull request or holds credentials.
- A partial bundle.
- A vault regeneration that removes a note a person wrote.
- Reshaping a frozen projection beyond what its Spec already promises.
- A count, date or plan number inside a Spec.
- Agents writing to `.omo/`.

## Working rules for the executing thread

- Commit after each coherent unit and its gate, on this branch; merge lane branches with merge
  commits; this plan's commit strategy is the authorization. Never `git stash`.
- Push this branch at each wave boundary. Open the PR when the close's gate is green, write its
  description to the standard in `AGENTS.md`, and link it to the thread.
- Move this plan's status header and the handbook's line together: EXECUTING when wave 1 starts,
  EXECUTED at close, with the rulings made after each wave recorded here as tables, as plan 45
  did.
- Report to the coordinating thread at each wave boundary and whenever a decision needs the owner.
