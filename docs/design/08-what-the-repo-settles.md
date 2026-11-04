# 08 — What the repository settles

This document answers the technical questions the design work raised, one section per question,
from the repository's intended truth: the carrying Specs, [`CONTEXT.md`](../../CONTEXT.md) and the
concept documents, each claim confirmed against the graph with `sdp q`. It is design material, not
intended truth: where it disagrees with a carrying Spec, the Spec wins.

Each section gives the question in one line, the answer, the governing text, and what stays open.
The answers were checked against the graph at commit `53804437`; re-run the queries rather than
trusting this page as the corpus changes. Counts are never quoted: where a number matters, the
section names the query that derives it. "What stays open" points to the part of
[06](06-design-cycles.md#design-questions-for-the-long-horizon)'s register that carries the design
and product judgement a section leaves. Those questions form a long-horizon research backlog for
the design cycles ([06](06-design-cycles.md), [09](09-design-method.md)), not owner to-dos to settle
now.

| Section | The question in short |
|---|---|
| [1. Ownership and people](#1-ownership-and-people-in-the-model) | Does the model record owners, and where does approval live? |
| [2. Terminology](#2-terminology) | Do the provisional design words collide with ratified ones? |
| [3. History](#3-history-beyond-one-commit) | May a reading show history beyond one commit? |
| [4. View state and commercial surfaces](#4-view-state-and-commercial-surfaces) | What state may a surface keep, and what would new surfaces inherit? |
| [5. Object pages and deep links](#5-object-pages-and-deep-links) | Which things get pages, and how does an address become a link? |
| [6. Perspectives and AI](#6-perspectives-and-ai) | Can the Studio take a perspective, and may AI shape a reading? |
| [7. How the Studio may evolve](#7-how-the-studio-may-evolve) | Which Studio changes are ordinary Spec edits, and which need a decision? |
| [8. Recording a long design effort](#8-recording-a-long-running-design-effort) | Where do months of design intent and questions live? |

## 1. Ownership and people in the model

**The question.** Does the model record who owns a Spec or approves a change, and does anything
rule ownership out?

**The answer.**

- **No decision rules out a descriptive owner; the model simply holds none.** The seed design gave
  a Spec and an open question an optional `owner` and kept "Roles / RBAC" out on purpose
  ([seed 01](../lineage/v0-design/01-core-primitives.md), section 10). The reboot (commit `ed5f6ad3`)
  dropped `owner` without comment. `tags` was dropped through a plan item (commit `4e5cfa13`),
  carried into the language ratification (`857e1077`) and applied in `7140c3dc`; that plan was later
  deleted, so git is the only record. A later doc repair (`71334fda`) brought the concept vision in
  line with the model ("a Spec names no owner"). It matched the model; it did not weigh descriptive
  ownership.
- **The only person-shaped graph field is an open question's `decider`.** It is a lowercase kebab
  token the corpus owns, on the grammar a role uses. It references nothing, authorizes nothing and is
  compared with no author, and the Protocol ships no list of values. A value off that grammar is a
  conformance error.
- **Shipped defaults favour the token `owner`.** The statement queue (recipe 46) and the roadmap
  (recipe 53) default `params.decider` to `"owner"`. The Studio's Queue page renders recipe 46 with
  that default, so it lists only `owner` questions. Its waiting statements are corpus-wide and
  belong to no one; only the questions are selected by decider. Any other token works on the agent
  surface through `--params '{"decider":"…"}'`.
- **Nearby, but not ownership.** The Intent `actor` is prose naming whom a Spec serves, carried by
  a small minority of Specs. Pack framing is a plain descriptive note. A Pack's `order: priority` is
  read as "its owner's advisory preference" and names nobody. The anchor `role` is an architectural
  pattern, and `decider` is also one of this corpus's role values
  (`spec:protocol.role-vocabulary#term.decider`). "The owner" appears across the Specs and the
  [handbook](../../AGENTS.md) as one corpus-level person in prose (the readiness planner's actor is "The owner of a
  corpus"), but it is neither a graph value nor a `CONTEXT.md` term.
- **Approval lives outside the model.** Change approval is git and CI: pull request review and
  CODEOWNERS (this repository keeps no CODEOWNERS file). A baseline's approval artifact is a signed
  git tag. `ready` is a person's declared edit, and that a review occurred is never a graph fact. A
  change proposal carries no status, approval or proposer. In this repository, rulings "with who
  made them" go in pull request descriptions (the roadmap-over-plans decision, MD-47).
- **What is ruled out** is ownership as authorization, a gate or workflow state. A descriptive owner
  would reverse the concept vision's current statement and, as an envelope key, would meet the
  closed envelope and the stability law L9, under which new capability arrives as sections, not
  envelope keys. A decision Spec is the honest route. Today a frontmatter `owner:` or `tags:` is
  refused as `extract/unrecognized-property`; in a Gherkin carrier a free tag such as `@team-x` is
  decoration and authors no graph state. The prose-ownership law (MD-19) concerns prose on typed
  graph owners, not people.

**Re-check.** Deciders in use, and how many Specs carry an `actor`:

```bash
pnpm --silent sdp:q 'const r = await recipes(20); const by = {}; for (const s of r.specs) for (const q of s.questions) by[q.decider ?? "none"] = (by[q.decider ?? "none"] ?? 0) + 1; return by' --json
pnpm --silent sdp:q 'const specs = graph.nodes.filter((n) => n.nodeType === "Primitive"); return { withActor: specs.filter((n) => n.sections?.intent?.actor).length, specs: specs.length }' --json
```

**Governing text.**

| Source | What it says |
|---|---|
| [Concept vision](../concept/00-vision-scope-and-mvp-boundary.md), section 5 (Non-goals) | "Not an embedded RBAC / governance engine. Change approval lives in git/CI (PR review, CODEOWNERS); a Spec names no owner, and an open question's `decider:` names who settles it, never an authorization." |
| `spec:model.open-question-fields` (Behavior) | "Who decides a question names the person, role or body whose ruling settles it. It authorizes nothing, gates no edit, and no validator compares it with the author of a change." "The graph holds no person or role to point at, so the value references nothing." |
| `spec:carrier.envelope-contract#rule.reservedProperties` | An unknown envelope key is refused "as `extract/unrecognized-property`"; the key set "is closed" (same Spec, Behavior). |
| `spec:consumers.spec-studio.spec-page.core#rule.header` | "It shows no owner, capability, tag or last-verified time: the envelope holds none." |
| `CONTEXT.md`, Validation & honesty; Delivery-process vocabulary | "that a review occurred is never a graph fact"; a baseline's "signed git tag is the approval artifact — approval remains outside the model". |
| `spec:consumers.intent-composition.proposal` (Behavior) | "A proposal carries no status, approval or verdict"; "A proposal carries no proposer." |

**What stays open.** Carried in 06's register, under [People and
entry](06-design-cycles.md#people-and-entry).

## 2. Terminology

**The question.** Do the design pass's provisional words collide with ratified or Studio vocabulary,
and what governs coining a word?

**The answer.**

- **The rubric.** `CONTEXT.md` governs: adopt the established delivery noun; coin a word only for a
  genuine differentiator, and make the word name the difference; pass both naming tests (carry
  epistemic status where it matters, and be unambiguous to typed code, the coding agent and a
  Studio user). One concept takes one word; the rest are aliases to avoid. The handbook adds: flag a
  new word, never silently invent one. The adopt-the-nouns decision (MD-2) carries the rubric.
- **How a word becomes shared vocabulary.** The owner rules it. "Perspective" landed through a
  carrying Spec (`spec:consumers.review-perspectives`, whose narrative records the ruling) plus a
  `CONTEXT.md` row and ledger entry. A shipped Studio element name follows `stamp` and
  `text equivalent`: a Surfaces & projections row plus a carrying Spec. `CONTEXT.md`'s
  guidance-only labels name particular design activities and recipe answers (design pass, design
  diff, design slice and a few more); they are not a general home for unratified words.
- **The provisional words.** The [README](README.md#words-used-here) records how each is used for now;
  the collisions the repository shows are these:

| Word | What it collides with | What the repository shows |
|---|---|---|
| **reading** | fixed phrases: reading order and the roadmap answer's `order` value `"reading"` (`spec:consumers.roadmap#rule.readingOrder`), a question's provisional reading, the reading skill, the context bundle's reading material | Already plain corpus prose: "A design slice is therefore a reading and not an artifact" (`spec:consumers.design-slice`). Fine in design prose; not a label or a locked term. Exact nouns: projection, page, page set, recipe answer. |
| **persona** | nothing ratified; but the job stories bind to no persona, and "richer persona surfaces" are deferred and not backed by stories ([job stories README](../../jtbd-stories/README.md)) | The concept vision speaks of "multi-persona consumption". A design-material word, paired with job stories. A Spec names whom it serves through its Intent `actor`; the graph holds no person. |
| **role home** | the ratified `role`, an anchor's architectural pattern (the architectural-annotation ruling, MD-38), shown on the same Studio pages | The index is already "the default landing page" (`spec:consumers.spec-studio.lenses#rule.order`) with task routes (`spec:consumers.spec-studio.index-page#rule.taskRoutes`); selection by concern is a perspective. The idea stays a candidate; the name collides. |
| **object page** | the Studio's own names: Spec page, Pack page, slice page | Prefer "*thing* page". Some candidates contradict `ready` rules: the page set holds no code-unit page, a Pack has a Pack page and a slice page, and only a keyed question has an address ([section 5](#5-object-pages-and-deep-links)). |
| **basis line** | the stamp and its stamp line (`spec:consumers.spec-studio.shell#ui.stampLine`); "basis" for the dependencies a `ready` statement rests on (`spec:validation.typed-dependency-floor`); "base" (base graph, `--base`) | Collides twice, and "always present" contradicts `ready` rules: the build writes no stamp, a `file://` page shows none, an export holds none. The need, saying what a reading projects, stays real ([section 4](#4-view-state-and-commercial-surfaces)). |
| **design session** | the handbook's "design session", which designs Specs and "edits carriers" | In this project, by the owner's rule, a design session edits no graph input and records needs in [07](07-graph-needs.md) for engineering sessions. One phrase, two activities: say which where it matters. |

- **Words the base already settles.** `status` is an alias to avoid for readiness, for question
  fields and for a roadmap need. `abstraction`, "two axes", `Facet` and `provenance` (as a claim)
  are rejected; the seed name `UiFacet` is fine as an attributed citation. `claim` is reserved, so
  readiness is stated, never claimed. "Lens" names only the Studio's graph views and is an alias to
  avoid for perspective; "discipline" is the kind-or-section filter, never a phase. "Census" is the
  `sdp census` projection, not a summary on the index. "Dashboard" and "view" are plain words the
  founding principles use and the base does not reject; `sdp view` is the Design Review's verb.
  "Built" already carries several senses (the roadmap need `built`, the architecture lens's
  "Designed, not built" section), so it makes a poor word for where a thing stands. A delivery fact is never "a
  readiness rung", so a phrase that files delivery facts under readiness misleads.

**Governing text.**

| Source | What it says |
|---|---|
| `CONTEXT.md`, Governing rubric | "Adopt the established delivery noun … Coin/keep a distinct word only for a genuine differentiator — and then the word must name the difference." Two naming tests follow. |
| `CONTEXT.md`, opening note | "one concept → one word; the rest are aliases to avoid." |
| The adopt-the-nouns decision (MD-2, `spec:decisions.adopt-the-nouns`) | "Invented terminology taxes users"; "Terms must be concrete, unambiguous, and carry authored-versus-derived status where it matters." |
| `spec:consumers.review-perspectives` (narrative) | "The owner ruled the word: perspective. The Spec Studio keeps lens for its graph views." |
| `CONTEXT.md`, the `role` row | "the optional one-token value on a code anchor … naming the architectural pattern its unit plays (`service` · `decider` · `projection` · …)". |
| [Job stories README](../../jtbd-stories/README.md) | Stories capture the job "without binding to a persona"; "Richer persona surfaces … are deliberately deferred post-MVP and are not yet backed by stories." |

**What stays open.** Carried in 06's register, under [Words](06-design-cycles.md#words).

## 3. History beyond one commit

**The question.** May a reading show history (discipline activity over time, question age, a
readiness trajectory, dated decision lineage), and what would it take?

**The answer.**

- **Yes, as named input beside the graph; never inside it, and never as a gate.** The graph is the
  current projection of the repository at one commit, and git is the event log. To see a past state,
  check out the prior commit and regenerate.
- **Consumers do not read source.** Founding principle P2 makes the extractor the only component
  that reads source. So a history reading consumes graphs `sdp build` wrote at named commits, and the
  caller or CI does the git work. That is already the design diff's pattern: the base graph is input
  the caller holds. The repository's preview workflow does exactly this, building the base commit in
  a worktree and passing it as `--base`. The engine-provenance rule "never runs git at run time"
  governs only how `--version` learns its commit; it is not a general ban.
- **Ready Studio rules a history reading would revise:** the Studio reads "only two optional inputs"
  (`spec:consumers.spec-studio#rule.namedInputs`, `spec:consumers.spec-studio.data.inputs#rule.namedInputs`);
  the shell "shows no recent edits and no other history" (`spec:consumers.spec-studio.shell#rule.noRecentEdits`);
  an open question "shows no date" (`spec:consumers.spec-studio.spec-page.core#rule.questions`); and
  the diagram catalog refuses git graphs, timelines, trends and Gantt charts until a ruled history or
  time-series input exists (`spec:consumers.spec-studio.diagram-kinds`).
- **None of these limits an operator's `sdp q` body.** A series of graphs passed with
  `--params KEY=@PATH` (`spec:consumers.agent-surface.recipe-parameters`) can be read today, so a
  history reading can be prototyped on the agent surface before anyone writes a Spec, for example by
  writing graphs at successive commits and running the design diff (recipe 35) over each pair
  through the package's exported `evaluateBody`.
- **What a history reading must satisfy.** It takes its history as named input: graphs written at
  caller-named commits, plus any commit metadata the caller states. It names that input and its range
  in words wherever it shows (`spec:consumers.spec-studio.data.inputs#rule.inputNaming`). It is
  byte-deterministic over its inputs (`spec:extraction.determinism`). It confers nothing: no fact,
  finding, rung, staleness flag or gate; the design diff "raises no staleness flag", run evidence is
  never called fresh or stale, and an open question carries no date. It stays out of the validators
  and the four frozen projections. It respects identity limits: ids carry no history
  (`spec:model.stable-ids`), a `supersedes` chain exists in a graph only while both records exist, and
  an entry without a key has no identity across two graphs.
- **Decision or Spec.** A Studio reading or recipe over supplied graphs needs a new carrying Spec and
  ordinary revisions of the rules above; the precedent is `spec:consumers.spec-studio.register-input`,
  a `scoped` story adding a third named input. History inside the Design Review, census, Mermaid or
  Gherkin needs a decision refining the shipped-projections decision (MD-32). History inside the
  graph, or history as a gate, is refused by founding law. A consumer reading `.git` itself would
  contradict P2; a decision is the likely vehicle, though the repository does not say so. One
  tension stays held: `spec:consumers.projections-model.roadmap-views` is titled "Roadmap views read
  releases, baselines and phases from git and the graph" without saying how git reaches the view,
  and its deferral (`#question.releaseReader`) waits for the first published release.

**Re-check.** Nothing history-related is on the roadmap:

```bash
pnpm --silent sdp:q "$(cat dist/recipes/53-the-roadmap.js)" --params '{"pack":"pack:roadmap"}' --json
```

**Governing text.**

| Source | What it says |
|---|---|
| `spec:extraction.derive-graph` (narrative) | "The graph is the current projection of the repository at a commit. Git holds lifecycle history, so removed records disappear from the current graph." |
| [Founding principles](../concept/01-founding-principles-and-invariants.md), P2 | "recipes and views whose contracts admit it may read separately identified input beside it, while validators and shipped projections stay graph-only. No consumer reads source directly or maintains a parallel model." |
| `spec:consumers.design-diff` (Behavior) | "The base graph is input the caller holds, derived from the repository alone at the base commit; it never answers in the graph's name"; a comparison "raises no staleness flag". |
| `spec:consumers.spec-studio#rule.namedInputs` | "Beside the graph the Studio reads only two optional inputs, a base graph and run records." |
| `spec:consumers.spec-studio.diagram-kinds#design.gitGraph` | "commits and branch ancestry are not nodes in the current graph. Re-enter with a ruled history input and a history reader." |

**What stays open.** Carried in 06's register, under [History](06-design-cycles.md#history).

## 4. View state and commercial surfaces

**The question.** What state does the static Studio keep, what separates view state from delivery
truth, and what would a hosted, desktop or CI surface inherit?

**The answer.**

- **The static Studio keeps one thing between visits:** the composing panel's gathered intents, in
  the browser's local storage under `sdp-studio:intents:<root path>`, so two page sets on one host
  never share them. Nothing else is stored: the panel's base and reason fields, filters and open
  disclosures are lost on reload, and a search keeps its term in the URL fragment
  (`search.html#q=<term>`). The panel "requests nothing over the network", and the only request any
  element makes is the stamp element fetching `stamp.json` over http or https; through `file://`
  nothing is requested.
- **What separates view state from delivery truth.** Every view is a pure function of the
  repository with no parallel model (P1 to P3). The Studio never builds a second graph: every join,
  claim, fact and floor it shows was computed at build. A view composes scoped intent and an agent
  makes the ordinary edit under the same checks; a composing surface writes no source. Named inputs
  never become graph data, a fact or a rung. A proposal carries no status, approval or proposer, and
  a review is never a graph fact. A perspective is corpus data, passed as a parameter.
- **The MCP surface** is "integration for user-facing apps (designed-in, deferred build)", distinct
  from the agent surface. The MCP-deferred decision (D6) holds it until "a concrete caller
  establishes its boundary and contract". It is not on the roadmap.
- **Commercial surfaces.** Intended truth holds one line: the read-only Studio ships in the
  open-source package, and "hosted review, shared comments and hosted previews may later ship under
  `@libar-ai/`" (`spec:consumers.spec-studio`). `CONTEXT.md` and the handbook record the namespace
  split, and the package is licensed Apache-2.0. Concept search finds nothing on "commercial", and no
  Spec mentions a desktop app, a commercial web app or a commercial CI surface. Those come from the
  owner's framing in [PRODUCT.md](../../PRODUCT.md): the core is and stays open source and free, and
  a commercial Studio (desktop, web, CI/CD) is under consideration, exploratory and labelled as
  such. "Hosted previews" is undefined in the corpus; the open-source preview workflow already
  deploys to an adopter's own static host.
- **The existing CI surface.** The repository ships a reusable GitHub Actions workflow that runs
  `sdp studio` with optional base and run inputs and stamps the checked-out merge commit
  (`spec:consumers.spec-studio.sharing#rule.previewWorkflow`). It deploys a preview only when the
  caller asks, and never from a fork (`#rule.previewDeploy`).
- **What any new surface inherits.** One canonical repository and one graph, no second store. Claims
  never collapsed; delivery facts derived. One change-proposal contract, and no source writes from a
  view. Named inputs that never move a rung. Run evidence at test-file grain, never called fresh or
  stale. Protocol checks that judge only conformance and honesty; an adopter's own gate runs as
  corpus rules (`sdp validate --rules`) and reaches no projection. Perspectives stay corpus data.
  MCP waits for a named app caller. A host that embeds Studio elements also inherits the
  build-renders decision (MD-43, no graph data from the host) and the custom-elements decision
  (MD-42, element names and attributes as a public contract).
- **What belongs to the static Studio alone:** no server and `file://` opening, one classic script,
  the search index embedded only on the search page, the stamp read only over http or https and
  absent from exports, local storage keyed by page-set path, and "opens no pull request" because "a
  static page holds no credentials".
- **Per surface, exploratory.** A hosted web app may hold credentials but still writes no carrier
  itself; review threads or preferences would be its own product state, never projected back as
  graph truth; running user-supplied bodies server-side meets the evaluation sink, which "claims no
  sandbox". A desktop app over the working tree largely exists in open-source form already
  (`sdp studio --watch` on carriers, `sdp vault --watch`, `sdp validate --watch`); the working-tree
  graph includes uncommitted edits, and no "uncommitted" signal exists. "Studio local mode" is an
  alias to avoid for the vault. A CI surface would extend the reusable workflow: its basis is the
  merge commit, a run record joins only at file grain, and trends across runs would need new Specs.

**Governing text.**

| Source | What it says |
|---|---|
| `spec:consumers.spec-studio.intent-panel#rule.persist` | "Gathered intents persist in the browser's local storage under the page set's own key … two page sets served from one host never share intents." |
| `spec:consumers.spec-studio.page-elements#rule.noRequest` | "No element requests anything on a page opened through `file://`; the stamp element requests `stamp.json` only over http or https." |
| `spec:consumers.spec-studio#rule.noSecondGraph` | "The Studio never builds a second graph … the page computes none of them again." |
| `spec:consumers.spec-studio` (Behavior) | "The read-only Studio ships in the open-source package `@libar-dev/software-delivery-protocol` … hosted review, shared comments and hosted previews may later ship under `@libar-ai/`." |
| The MCP-deferred decision (D6, `spec:decisions.mcp-deferred`) | "MCP integration is deferred until a concrete caller establishes its boundary and contract." |
| `spec:consumers.agent-surface.evaluation-sink#rule.exportedEvaluator` | "the evaluator writes and prints nothing and claims no sandbox, as the sink claims none." |

**What stays open.** Carried in 06's register, under [Commercial
surfaces](06-design-cycles.md#commercial-surfaces-exploratory) and [Basis and
trust](06-design-cycles.md#basis-and-trust).

## 5. Object pages and deep links

**The question.** Which things get a page of their own in the Studio, how does an entry address
become a link, and how do source links work?

**The answer.**

- **Only Specs and Packs get pages of their own.** Each Spec has one page, `specs/<name>.html`, and
  decision records are Specs, so every decision already has its page. Each Pack has a Pack page
  (`packs/<name>.html`), a slice page (`slices/<name>.html`) and a one-file export
  (`exports/<name>.html`). Every other page is a collection: the index (the Packs lens), the other
  lenses, the register pages, the Queue, the roadmap, the glossary and search; Diff and Runs exist
  only when the build is given their inputs.
- **Entries, questions and terms carry element ids on their Spec page.** The element id is the
  address after the `#`: `design.<key>`, `ui.<key>`, `rule.<key>`, `question.<key>` or `term.<key>`.
  These address section names are not Spec section names: `rule.` covers the Spec's primary
  behavior owner, and `question.` the open questions in Intent. A Spec page also carries ids for its
  narrative, each section (`section.<name>`) and each panel (`panel.verification` and the rest).
- **An entry without a key has no address.** The closest link is its section. Many rules and flows
  are still unkeyed (the rule-key proposal, recipe 48, proposes keys for them); every open question
  is keyed today (recipe 20).
- **Components, code units and anchors.** Each realized component has a detail section on the
  architecture lens, with its id as the element id. By `ready` intent, code units and test or
  oracle anchors get no page and no element id; they show as an id plus `file:line` text with a
  copy action, and appear in search results.
- **From address to URL** is pure construction: `spec:<id>#<section>.<key>` becomes
  `specs/<name>.html#<section>.<key>`, where `<name>` is the id after its namespace with each
  uppercase letter written as `_` plus its lowercase. Inside a Pack export, ids take a `pack/` or
  `<Spec id>/` prefix. Nothing in the Studio resolves a pasted address: search matches what
  `findByConcept` matches, plus Design, UI, question and rule keys and file paths, and "indexes
  nothing else".
- **Source links come only from the publishing stamp.** `sdp stamp --source TEMPLATE` names a URL
  holding `{file}` and optionally `{line}`; served over http or https with that stamp loaded, each
  recorded file and line becomes a link. The CI workflow uses
  `<server>/<repository>/blob/<merge commit>/<root>/{file}#L{line}`. Without a template, through
  `file://`, or in an export, a location stays text with its copy action. No page writes an editor
  link.
- **Navigation is ready law, not free layout.** The top navigation's entries and order, the
  current-page marking and the index's `Start here` routes are rules in
  `spec:consumers.spec-studio.navigation` and `spec:consumers.spec-studio.lenses`.

**Governing text.**

| Source | What it says |
|---|---|
| `spec:consumers.spec-studio#rule.staticPageSet` | "The Studio is a static page set: the index page, which is the Packs lens; a search page; a page for each other lens, each register, the owner queue, the roadmap and the glossary; one page and one slice page per Pack, one page per Spec; one export file per Pack." |
| `spec:consumers.spec-studio.spec-page.core#rule.entryIds` | "Every entry an entry address can name … carries an element id equal to its address after the `#`." |
| `spec:consumers.spec-studio.spec-page#rule.sourceText` | "the page set holds no code-unit page and writes no editor URI, absolute path or assumed source URL." |
| `spec:consumers.spec-studio.publisher#rule.linksResolve` | "Every link a page writes stays inside the page set," apart from the search page's term fragment. |
| `spec:consumers.spec-studio.sharing#rule.sourceLinks` | "when a loaded stamp names a source template the stamp element links each to the template … without such a stamp, or through `file://`, each stays text." |
| `spec:consumers.spec-studio.search#rule.addedFields` | Search also matches coined keys and file paths. "It indexes nothing else." |

**What stays open.** Carried in 06's register, under [Landing, navigation and
pages](06-design-cycles.md#landing-navigation-and-pages), [Basis and
trust](06-design-cycles.md#basis-and-trust) and, for editor links, [Commercial
surfaces](06-design-cycles.md#commercial-surfaces-exploratory).

## 6. Perspectives and AI

**The question.** Can the Studio render or take a perspective, what does the AI-reading capture say,
and may AI author a reading's selection or its generator?

**The answer.**

- **Not today.** The Studio reads only two optional inputs (a base graph and run records), the
  build's fixed recipe list leaves out the perspective filter (recipe 37), and `sdp studio` takes no
  perspective. A perspective works on the agent surface: `sdp q` runs recipe 37 with `pack` and
  `perspective`, and the selected members feed the context bundle (recipe 36) and the design slice
  (recipe 54). A Studio perspective input would be a Spec change like
  `spec:consumers.spec-studio.register-input`, not a UI choice.
- **The AI-reading capture.** `spec:consumers.ai-assisted-reading` is a behavior story stated at
  `idea`, with no delivery facts. Its outcome: "Let a reader ask for a useful existing reading and
  inspect why it was selected and what scope it omits." Its blocking question,
  `#question.aiPresentationBoundary`, asks what contract keeps assistant-generated "explanations or
  arrangements beyond selecting deterministic readings" distinct from graph claims and reviewable.
  Its decider is `owner`. Its provisional reading allows selection only, and its trigger is "the UX
  design pass measures that assistant selection or a generated explanation helps a named review
  task". So this design effort's measurements are the evidence that brings it back; the owner still
  decides.
- **Precedents for code that runs over the graph.** The agent surface grows by recipe: "every other
  question stays a body an agent scripts", run with operator trust and no sandbox (the agent front
  door, MD-22). Corpus rules are code the corpus authors, run only from a file the operator names,
  reading only the graph by the author's obligation, and reaching no projection. The vault began as
  a prototype under `explorations/` that wrote notes from dumped graph and reader values; the
  prototype stayed evidence, and the vault the engine ships was built from carrying Specs. Any
  agent's code lands as an ordinary git edit under the same checks.
- **No seam publishes corpus- or agent-written code into a Protocol page.** `recipes()` runs only
  bodies the package ships, "never from the corpus or the working directory", and a Studio page shows
  a recipe answer only when the Studio's design names that recipe.
- **Adding projections.** No rule names who may add one. A projection is a pure function of the
  graph, implementation waits for a `ready` Spec (the drift alarm flags `implemented ∧ ¬ready`), the
  Studio and the vault each arrived with carrying Specs and decisions, and the shipped-projections
  decision (MD-32) freezes only the Design Review, census, Mermaid and Gherkin.
- **"AI authors the selection; the graph supplies the content"** fits current law for selection,
  and for a perspective passed as data on the agent surface. A generator an agent writes is ordinary
  source under the edit model and needs a carrying Spec stated `ready` before it is a Protocol
  reading. The provisional reading allows only selection, so the principle is a candidate answer to
  the blocking question, not current law. The [AI article](../articles/05-ai-can-shape-the-reading.md)
  explores the generator pattern as one option; it is direction material, not intended truth.

**Governing text.**

| Source | What it says |
|---|---|
| `spec:consumers.ai-assisted-reading#question.aiPresentationBoundary` | Provisional: "Select existing deterministic readings only; any generated text stays outside the Studio and the frozen projections, labelled as assistant output with its source commit and scope, and adds no claim, fact or validator." |
| `spec:consumers.spec-studio.data.recipe-answers#design.recipeEvaluations` | The fixed list of recipes a build evaluates; the perspective filter is not among them. |
| `spec:consumers.review-perspectives` (Behavior) | "The corpus owns its perspectives and their questions; the Protocol supplies the filter and ships no list of perspectives." |
| `spec:validation.corpus-rules#rule.operatorNamed`, `#rule.neverMovesFloor` | Rules run "never from a file it finds in the corpus"; a corpus finding "reaches no other surface". |
| `spec:consumers.agent-surface.evaluation-sink#design.recipeSource` | A call runs the shipped body, "never from the corpus or the working directory." |
| `spec:consumers.edit-model#rule.agentEdits` | "The agent edits source as a human would, git records the ordinary edit, and the same conformance and honesty checks evaluate it." |

**What stays open.** Carried in 06's register, under [AI-assisted
reading](06-design-cycles.md#ai-assisted-reading); the wider option space is in
[05](05-specialised-and-ai-readings.md).

## 7. How the Studio may evolve

**The question.** Which Studio redesigns are ordinary Spec revisions, and which need a decision
Spec?

**The answer.**

- **The shipped-projections decision (MD-32)** freezes the Design Review, census, Mermaid and
  Gherkin. Reshaping one needs a decision that refines or supersedes it, never a follow-up work
  item. It does not freeze the Studio, which publishes to its own root beside them.
- **The derived-HTML decision (MD-41)** makes the Studio's surface generated HTML that is never
  committed. It stands beside the Markdown Design Review, and "neither view ranks above the other".
  Richer interactions wait for their own Specs; the first build is read-only.
- **The other Studio decisions:** custom elements without a framework, with element names and
  attributes as a costly public embedding contract (MD-42); the build renders every view and an
  element only enhances it (MD-43); diagrams laid out at build time as inline SVG with a text
  equivalent (MD-44). Studio Specs also name, through `decidedBy`, the architectural-annotation
  ruling (MD-38), binding, never liveness (MD-7), verification posture, not realization (MD-23), the
  authored-entry-order decision and the shipped-projections decision.
- **Behaviours `ready` Specs fix:** the Spec page's panels in a fixed order; the lenses in a fixed
  order (Packs, capabilities, architecture, tests, evidence), with the index as the Packs lens and
  the landing page; the top navigation's entries; the same pages serving desktop and phone, one
  column below 720 CSS pixels; a text equivalent for every diagram; and one classic script whose
  elements only enhance. Almost every Studio Spec is `ready` and implemented; only the Studio Specs
  on the roadmap sit lower (the first query below lists them).
- **How these change.** A behavior rule homed on a carrying Spec changes by ordinary Spec revision
  (the planning-truths decision, MD-33, says so for a restated guarantee); commit `332204a2`
  revised the lens order and the navigation entries that way. So reworking navigation, the landing
  page, entry for delivery roles, or merging and retiring pages is ordinary Spec revision, made in
  an engineering session, as long as the result stays derived, rendered at build and
  framework-free. Richer interactions arrive through their own Specs (the derived-HTML decision,
  MD-41).
- **A change needs a decision Spec when it:** commits the HTML, or lets the Studio replace or
  outrank the Design Review (the derived-HTML decision, MD-41; the shipped-projections decision,
  MD-32); renders views or switches readers' views in the browser from embedded graph data (the
  build-renders decision, MD-43); adopts a framework or a framework-based UI library (the
  custom-elements decision, MD-42); lays out diagrams in the page (the diagram-layout decision,
  MD-44); reshapes one of the frozen four (the shipped-projections decision, MD-32); or shows
  liveness (binding, never liveness, MD-7). The design system to be introduced later meets the
  custom-elements decision (MD-42): a CSS-level system or framework-free elements fit it; a
  framework-based component library needs a decision.
- **What each redesign touches.** Navigation: the navigation, shell, lenses, capability-map page,
  search, page-elements and responsive Specs. A new landing page: the parent's
  `#rule.staticPageSet`, the lenses and Packs-lens landing rules, the index page, the navigation's
  index routes and the publisher's page set. Entry pages for delivery roles: new story Specs refining
  `spec:consumers.spec-studio`, every rendered recipe named under `#rule.recipeAnswers`, and a new
  named input if they read corpus perspectives. Merging or retiring a page: its own Spec, the page
  set, link resolution, the shell's rail, the manual acceptance tasks, and the `sdp-studio` skill,
  which maps tasks to pages.
- **Keeping readiness honest during a redesign.** Lowering an implemented Studio Spec below `ready`
  raises the drift alarm. A decision a Studio Spec names through `decidedBy` must state at least
  `defined` for that Spec to keep `ready`, so a draft decision matures to `defined` before the edges
  are added.

**Re-check.** The Studio Specs below `ready`, and the reach of a navigation and landing redesign:

```bash
pnpm --silent sdp:q 'return g.specs().filter((s) => s.id.startsWith("spec:consumers.spec-studio") && s.statedReadiness !== "ready").map((s) => [s.id, s.statedReadiness])' --json
pnpm --silent sdp:q "$(cat dist/recipes/30-design-change-impact.js)" --params '{"specs":["spec:consumers.spec-studio.navigation","spec:consumers.spec-studio.lenses","spec:consumers.spec-studio.lenses.packs","spec:consumers.spec-studio.index-page","spec:consumers.spec-studio.shell"]}' --json
```

**Governing text.**

| Source | What it says |
|---|---|
| The shipped-projections decision (MD-32, `spec:decisions.shipped-projections-frozen`) | "Re-specifying the shipped Design Review, census, Mermaid, or Gherkin projection is refused"; a reshaping "arrives as a decision record that refines this one … never as a follow-up work item." |
| The derived-HTML decision (MD-41, `spec:decisions.studio-html-surface`) | "The HTML is derived and never committed"; "neither view ranks above the other"; "the Studio's first build is read-only." |
| The custom-elements decision (MD-42, `spec:decisions.studio-web-components`) | "custom elements written without React, Vue, Svelte or another framework." |
| The build-renders decision (MD-43, `spec:decisions.studio-build-renders`) | "a custom element adds only the interaction its view needs." |
| The planning-truths decision (MD-33, `spec:decisions.planning-truths-placement`) | "a row that restates a behavior guarantee already homed on a carrying Spec stays on that Spec and changes by ordinary Spec revision." |
| `spec:validation.readiness-floor#rule.readyFloor` | "every resolving `refines`, `dependsOn`, `constrainedBy`, and `decidedBy` target itself states at least `defined`." |

**What stays open.** Carried in 06's register, under [Landing, navigation and
pages](06-design-cycles.md#landing-navigation-and-pages), [People and
entry](06-design-cycles.md#people-and-entry), [Basis and trust](06-design-cycles.md#basis-and-trust)
and [The design project and visual
design](06-design-cycles.md#the-design-project-and-visual-design).

## 8. Recording a long-running design effort

**The question.** Where do months of UX design intent and design questions live under the
repository's own conventions?

**The answer.**

- **The conventions put intended truth in carriers.** An idea becomes a capture Spec at `idea`; an
  open design question becomes a keyed open question on it; a worked lean becomes a decision Spec
  below `ready`; a Pack groups the work. There is no separate product requirements document;
  `plans/` and `reviews/` are frozen, and the Protocol adds no plan or review file (the
  roadmap-over-plans decision, MD-47). Evidence such as prototypes and screenshots is committed on
  an arc's branch with its commands and removed before merge. Briefs and prompts stay in the session.
  Counts are derived each time.
- **Two kinds of design session.** In the handbook, a design session designs Specs and "edits
  carriers". This project's design sessions, by the owner's rule, edit no graph input: they record
  what they find in [07](07-graph-needs.md) for an engineering session and the owner. Neither the
  handbook nor any Spec names `docs/design/`; the maintained prose precedents that confer nothing
  are `docs/articles/` and `docs/lineage/`.
- **How the Protocol tracks a question for months.** A keyed `[blocking]` or `[non-blocking]` entry
  under Intent `### Open questions`, with `decider`, a one-line `provisional` reading (intent, never a
  ruling), `links` (Spec ids or entry addresses only; an outside document is named in the text) and,
  on a deferral, a `trigger`. It carries no status or date. It is read through the open-question
  register (recipe 20), the statement queue (recipe 46), and the Studio's Questions page, which
  filters by blocking flag, decider, deferral and Pack. The owner ratifies a decision by stating it
  `ready`. History stays in git and in each arc's pull request description.
- **Captures this effort already meets.** `spec:consumers.ai-assisted-reading`, whose trigger names
  the UX design pass. `spec:consumers.reference-projection#question.namedOutsideReader` and
  `spec:consumers.structural-mermaid#question.namedStructuralReader`, which both wait for a named
  reader; a persona from [01](01-roles-and-perspectives.md) could become one only through the owner.
  `spec:consumers.projections-model.roadmap-views#question.releaseReader`.
- **A corpus home, as a proposal only.** The corpus does not record this design project today; what
  the conventions imply is set out in [07](07-graph-needs.md#a-corpus-home-for-these-needs-a-proposal),
  for an engineering session and the owner to weigh and never for a design session to author.
- **What a design round can use today without editing anything.** The design diff (recipe 35) from
  a base graph kept outside `generated/`, Pack design (recipe 29), the design slice (recipe 54), the
  context bundle (recipe 36) and the perspective filter (recipe 37). Findings against Specs travel as
  a change proposal, checked by recipe 38 and rendered by recipe 49, for an engineering session to
  apply. A person's long-running notes fit the vault, in `intent/` outside its generated folder.

**Governing text.**

| Source | What it says |
|---|---|
| The roadmap-over-plans decision (MD-47, `spec:decisions.roadmap-over-plans`) | The Protocol "keeps its delivery record in git and its pull requests; it adds no plan file and no review file." |
| `spec:protocol.roadmap-replaces-plans#rule.oneRoadmap` | "The Protocol keeps one living roadmap Pack … Its owner selects captured work for the upcoming pull requests; landing a capture does not add it." |
| `spec:protocol.roadmap-replaces-plans#rule.evidence` | Evidence no test or recipe carries "is committed on the arc's branch with the commands that made it, linked from the description at that commit, and removed before the merge." |
| `spec:model.open-question-fields` (Behavior) | "An open question carries no status, date, blocked work unit or record of who checked it … the rest of the history stays in git and in the adopter's own records." |
| `spec:consumers.spec-studio.registers#rule.registerFilters` | "The questions page filters by blocking flag, decider, deferral and Pack." |
| `spec:consumers.obsidian-vault.iteration#rule.composeHome` | "A person composes intent in notes outside the generated folder, by convention in `intent/` … the vault command never writes there." |

**What stays open.** Carried in 06's register, under [The design project and visual
design](06-design-cycles.md#the-design-project-and-visual-design),
[Words](06-design-cycles.md#words), [AI-assisted reading](06-design-cycles.md#ai-assisted-reading)
and [Commercial surfaces](06-design-cycles.md#commercial-surfaces-exploratory).

## Re-checking a claim

Every Spec citation above can be re-checked from the graph:

```bash
# A Spec's stated and derived readiness, delivery facts and Packs
pnpm --silent sdp:q 'const c = g.specContext(params.spec); return { stated: c.statedReadiness, derived: c.derivedReadiness, facts: c.deliveryFacts, packs: c.packs }' --params '{"spec":"spec:consumers.ai-assisted-reading"}' --json

# Whether an entry address resolves
pnpm --silent sdp:q 'return g.resolveEntryAddress(params.address)' --params '{"address":"spec:consumers.spec-studio#rule.namedInputs"}' --json

# Where a concept lives
pnpm --silent sdp:q "$(cat dist/recipes/06-where-is-this-concept.js)" --params '{"term":"perspective"}' --json
```

Read a carrier only at the location the graph returns, and only for its exact wording.
