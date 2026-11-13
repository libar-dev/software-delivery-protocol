# 04 — Reading model and information architecture

A proposal for how readings are composed, how they fit together, how people arrive and move, and
which surfaces carry them. UX level only: no layout, no styles. Terms marked provisional in the
[README](README.md) are flagged for the owner, not ratified. This document also coins **task flow**,
**claim cue**, **absence word**, **agent hand-off** and **jump**; treat them as provisional too.
"Reading" means what the README says it means; the anatomy below is a proposed way to compose one,
not a second definition.

## 1. Anatomy of a reading

Every reading, from a phone-sized question page to a full architecture map, is built from the same
six parts. Naming them lets us design new readings by choosing values, rather than drawing pages
from scratch.

| Part | Question it answers | Values |
|---|---|---|
| **Subject** | What is this about? | the corpus · a Pack · a Spec · an entry · a component or code unit · a file or changeset · a decision · a question · a change against a base |
| **Selection** | Which part of the subject? | a discipline (by kind or section) · a perspective (recipe 37; on the agent surface only today) · a Pack · a context or layer · everything |
| **Time** | As of when? | now (the graph derived from the working tree) · against a base (the design diff: a base graph the caller supplies) · over history (a series of graphs the caller supplies at named commits; not built) |
| **Arrangement** | In what form? | answer sentence · list · register · queue · matrix · map · diagram with text equivalent · card · narrative memo |
| **Basis** | Why should I trust it? | corpus commit and engine (from the stamp, when one loads) · supplied inputs as named (a base graph by its label, a run by its commit) · what was left out |
| **Hand-off** | What can I do next? | open the source · compose scoped intent · hand the same scope to an agent · share the reading |

The design treats basis and hand-off as never optional: a reading without a basis cannot be
trusted, and a reading without a hand-off leaves the reader stuck. That is a hypothesis to test, not
current law. Today a page opened through `file://`, a page set never passed through `sdp stamp`,
and every Pack export show no stamp, and an export carries no composing panel
(`spec:consumers.spec-studio.shell#rule.stamp`, `spec:consumers.spec-studio.export#rule.exportContent`).
A basis that is always present needs an honest "not stamped" state, or a change to those rules.

**Example.** "What blocks the checkout capability?" is subject *a Pack*, selection *blocking
questions and floor clauses*, time *now*, arrangement *queue ordered by what rests on what*, basis
*the stamp when the page set was published, or a stated absence*, hand-off *compose an intent per
question, or give the scope to an agent*.

## 2. How people arrive

The agent surface was designed from a **demand map**: agents arrive holding a string, a file or a
changeset, never the Spec id they need. The repository itself is navigated that way: the graph is
the starting point, never a text search over carriers. People have a demand map too, and the Studio
should be designed from it, so that a person enters the graph the way an agent does (see the reader
test drive in [03](03-reading-material.md#how-a-reading-is-composed-a-test-drive-of-the-reader)):

| A person arrives holding | Typical situation | Where they should land |
|---|---|---|
| **A link** | a pull-request preview, a shared Pack export, a link in chat | the exact object or reading linked, with its basis visible and a way up to its context |
| **A question** | "what's blocking us?", "is this ready?", "what changed?" | the role home or task flow that answers it |
| **A word** | a term, a feature name, a half-remembered title | search over ids, titles, prose, entry keys and terms (concept and entry search) |
| **A file or changeset** | an engineer mid-change, a pull request | the impact reading: what this touches, what is at risk, what the graph cannot see (`coverage-unknown`) |
| **A role** | "I'm the architect; where do I start?" | the role home |
| **An address** | a Spec id or entry address pasted from a review or an agent answer | the object page, scrolled to the entry |

Today's Studio serves *a word* through search, and *a link* or *an address* when the link was built
for it: every Spec and Pack has a page, and every keyed entry has an element id. It partly serves
*a question*: the index's `Start here` routes include "See what comes next" and "See what the owner
can state first" (`spec:consumers.spec-studio.navigation#rule.indexRoutes`). It partly serves *a
file*: search matches a node's recorded file path. It has no landing for *a role* or *a changeset*,
and a pasted address finds only the Specs whose text quotes it, because search indexes nothing
beyond its listed fields (`spec:consumers.spec-studio.search#rule.addedFields`). The index opens
with a counted summary, then the task routes, every Pack as a closed disclosure of its members,
every Spec as a filterable row, and the findings.

## 3. Information architecture

Four layers, plus elements present everywhere.

```text
  Role homes          what a role opens first; composed, never a separate store
      │
  Task flows          guided paths across readings for one job
      │
  Registers & maps    collections: roadmap, queue, questions, decisions, declarations,
      │               backlog, capability map, architecture, tests, evidence, glossary,
      │               findings, diff, runs
      │
  Object pages        one canonical place per addressable thing
```

### 3.1 Object pages

One canonical place per thing with an address, shared by every role. Role homes and task flows
link **into** these places; they never copy them.

| Object | Address | Holds | Today |
|---|---|---|---|
| Spec | `spec:<id>` | the whole Spec in context: stated rung beside floor, delivery facts, relations with claims and reasons, bindings, questions, examples | a page per Spec |
| Entry | `spec:<id>#<section>.<key>`, where the address section is `design`, `ui`, `rule`, `question` or `term`, not a Spec section name | one keyed rule or flow, question, design entry, UI entry or term, with its source line and citations | an element on its Spec page, with its key, recorded line and a copy action; an unkeyed entry has no address and is reached through its section |
| Pack | `pack:<id>` | framing, members, Pack design, boundary, maturity map | two pages by design, the Pack page and the slice page, because "the two readings answer different questions in different orders" (`spec:consumers.spec-studio.slice-page`); plus one export file |
| Component / code unit | `component:<id>`, `impl:<id>`, `api:<id>` | role, layer, context, members, uses, the Specs it satisfies or references | a component has a detail section on the architecture lens; a code unit has no page, by a ready rule (`spec:consumers.spec-studio.spec-page#rule.sourceText`); test and oracle anchors (`test:`, `oracle:`) have ids but no page either |
| Decision | a `decision`-kind Spec | what it decided, what it shaped, what superseded it | its own Spec page, which shows its relations both ways; a row on the decisions register |
| Question | `spec:<id>#question.<key>`, keyed questions only | the question, decider, provisional reading, trigger, links, what it holds | an element on its Spec page; rows on the questions register and the owner queue; an item on the slice page |
| Change | base graph (as labelled) → current graph | what changed in the design at entry grain | the diff page, when the build is given a base graph |

Most of this layer already exists. A decision is a Spec, so every decision already has its own page,
and that page already shows what the decision shaped and what supersedes it. What a decision object
page might add beyond that, such as the decision map's reach (recipe 18), is a design question.
Questions are the real gap: none has a page of its own. Making questions object pages is the largest
single IA change proposed here. It needs a carrying Spec and a path scheme, and it reaches only
keyed questions, since an unkeyed question is lawful and has no address
(`spec:model.open-question-keys#rule.keyGrammar`). A question is the unit a decider works on, and a
decision is the unit an auditor traces. A code-unit page, or one page per Pack, would revise ready
rules, so either is a Spec change and not only an IA choice.

Role homes and task flows can link into these places today. The URL scheme is deterministic: a
Spec at `specs/<name>.html`, a keyed entry at `specs/<name>.html#<section>.<key>`, a Pack at
`packs/<name>.html` and `slices/<name>.html`, a component at `architecture.html#<component id>`.

### 3.2 Registers and maps

Collections that answer "show me all of X". They exist today in several forms: the register pages
(questions, decisions, declarations and the design backlog,
`spec:consumers.spec-studio.registers#rule.registerPages`); the lenses (capabilities, architecture,
tests and evidence, with the index as the Packs lens); pages of their own (roadmap, owner queue,
glossary, and diff and runs when their inputs are given); and the findings section of the index.
Most are top-navigation entries. They stay, but they move below the role homes, so a reader reaches
them through a question rather than a long, flat menu. The current entries and their order are ready
law (`spec:consumers.spec-studio.navigation#rule.topEntries`, `spec:consumers.spec-studio.lenses#rule.order`),
so regrouping them is a Spec change, not a styling choice.

### 3.3 Task flows

Guided paths for one job, crossing object pages and registers. The first six, chosen because each
is either a tier-1 job or one of the existing pains the seed pairs adoption with (refactor, audit,
onboarding; [seed 08 §9.10](../lineage/v0-design/08-delivery-evidence-and-tooling.md)):

| Flow | Who | Path |
|---|---|---|
| **Review a Pack for readiness** | decider, technical product manager | Pack → what stands before each member's stated next rung → blocking questions → compose intents → hand off |
| **Review a pull request's design change** | reviewer, architect | stamped preview → what changed (diff) → what it touches (impact) → readiness movement → intents |
| **Trace a requirement to its verification** | tester, auditor | Spec → examples and space coverage → verifier bindings → supplied runs, each in its own words |
| **Assess impact before a change** | engineer, architect | file, changeset or Spec → blast radius, at-risk, `coverage-unknown` → hand the scope to an agent |
| **Work the decider's queue** | decider | queue → question object → provisional reading and what it holds → answer as scoped intent |
| **Onboard to a bounded context** | newcomer | capability map → design slice → key Specs → their code → open questions |

The index's `Start here` routes are already phrased as jobs; they are the seed of this layer.

### 3.4 Role homes (tier 1)

A role home is an ordered composition of existing readings, opened first by one role. It answers
that role's first question in one sentence, then shows the evidence. It holds no state.

Tier 1, the traditional delivery roles in [01](01-roles-and-perspectives.md), is the first cycles'
focus, not the limit. The specialised and AI-powered readings in
[05](05-specialised-and-ai-readings.md) compose from the same parts. Each row is a candidate to test,
paired with a job story where one fits; the job stories name no persona, so the persona stays design
material. A role home the Protocol ships would select by named recipes and disciplines. One built
from the corpus's own perspectives would need the Studio to take a perspective as a named input,
which it does not today (`spec:consumers.spec-studio#rule.namedInputs`).

| Role home | First question | Composed from, in order |
|---|---|---|
| **Technical product manager** | "Where does intent stand, and what blocks it?" | capabilities by altitude against readiness → roadmap needs → blocking questions by capability → what changed since the base |
| **Decider** | "What can only I settle, and in what order?" | my open questions, blocking first, with the Specs each holds → roadmap entries whose need is a statement → the corpus's waiting statements |
| **Architect** | "What is planned, what is built, and what crosses a boundary?" | planned against realized → crossings and architecture-walk findings → decisions and what they shaped → impact of open work |
| **Engineer** | "What can I build, and what does my change touch?" | build backlog → impact of my changeset → Spec guarantees for the work at hand → hand-off to an agent |
| **Tester** | "What is unverified, and what is uncovered?" | Specs with no verifier binding → keyed rules no enabled example exercises → example-space values no example binds → supplied runs |
| **Leader** | "Where do we stand, honestly?" | readiness and realization side by side per capability → roadmap needs → open decisions → what the reading cannot see |

Each first question ends where the honest answer ends. The leader home in particular must say what
it does not know (no runtime observation, no verdicts) rather than fill the space. The decider home
also has a limit today: the statement queue selects open questions by decider, but its waiting
statements are corpus-wide, because no graph value says whose statement a Spec awaits. The Studio's
queue page lists only the questions whose decider is `owner`
(`spec:consumers.spec-studio.owner-queue#rule.ownerQuestions`); another decider reaches theirs
through recipes 46 and 53 with `params.decider`.

### 3.5 Elements present everywhere

| Element | What it does | Where it comes from |
|---|---|---|
| **Basis line** (provisional; [README](README.md#words-used-here)) | states the corpus commit, engine and supplied inputs of the reading in view, and says so plainly when no stamp loads | the stamp, when published and served over http(s); inputs as `spec:consumers.spec-studio.data.inputs#rule.inputNaming` names them. The build writes no commit (`spec:consumers.spec-studio.sharing#rule.buildWritesNoStamp`), so an always-present line needs a "not stamped" state or a Spec change |
| **Claim cues** | distinguish declared intent, anchored bindings and inferred structure wherever a relation appears | the claim taxonomy |
| **Readiness and realization, apart** | stated rung and floor reached (readiness) beside delivery facts (realization), never merged | the readiness floor; delivery facts; the rung badge (`spec:consumers.spec-studio.shell#rule.rungBadge`) |
| **Absence words** | name each kind of absence in the words the Studio already uses: `none` for a verifier binding, `no example` and `uncovered` for example-space values, an `unbound` slot, `not enumerable`, `not measurable`, `not tracked`, `floor not evaluated`, and `coverage-unknown` for impact | the Studio's display Specs: `spec:consumers.spec-studio.shell#rule.rungBadge`, `spec:consumers.spec-studio.verification-panels#rule.coverageGrid`, `spec:consumers.spec-studio.lenses.tests#rule.coverageRows`, `spec:consumers.spec-studio.lenses.evidence#rule.notTracked`; the glossary's coverage-unknown |
| **Composing panel** | gathers scoped intents from any reading, previews the exact memo, hands it off | `spec:consumers.spec-studio.intent-panel`: already on every page, with gathered intents kept per browser and per page set |
| **Agent hand-off** | gives the same scope to an agent: the Pack or member ids on screen, as the context bundle's parameters | recipe 36; the page embeds no bundle (`spec:consumers.spec-studio.data`) |
| **Jump** | search by word or file from anywhere | search; landing on a pasted address needs new intent, since search does not resolve addresses |

## 4. Progressive disclosure: answer, evidence, source

Every reading layers its content the same way:

1. **Answer:** one sentence or one number that answers the reading's question, in plain words.
2. **Evidence:** the rows, cells or boxes that justify it, each with its claim and its absences named.
3. **Source:** the carrier line, the code location, the recipe that computed it, the commit.

A reader can stop at any layer. A phone reading usually stops at the first, a reviewer at the
second, an auditor goes to the third. Nothing in a lower layer may contradict the layer above it.
Today the source layer links out only in a stamped page set served over http(s), through the
stamp's source template; elsewhere a file and line stay text with a copy action
(`spec:consumers.spec-studio.spec-page#rule.sourceText`).

## 5. Surfaces

**Define a reading once; render it per surface.** The Protocol already projects the same graph into
more than one medium: the five projection roots (Design Review, census, Mermaid, Gherkin and the
Studio's HTML pages) and the Obsidian vault's notes and Bases. A role home is therefore a reading,
not a page: the same composition could be a Studio page, a vault note with a Base, or a section of a
pull-request description. The four frozen projections are the exception; the shipped-projections
decision (MD-32) keeps them as they are unless a refining decision says otherwise. The anatomy in
section 1 is the medium-independent definition; each surface renders it under its own constraints.

The same readings, carried by different surfaces. The core stays open source and free. A commercial
Studio is under consideration as a web app, a desktop app and a CI/CD surface; the commercial rows
below are design exploration, not a decision. The one repository record about later commercial
hosting is in the Studio's carrying Spec, `spec:consumers.spec-studio`: "hosted review, shared
comments and hosted previews may later ship under `@libar-ai/`". No Spec, open question or roadmap
entry scopes a desktop app, a commercial web app or a commercial CI surface.

| Surface | What it uniquely enables | Constraint to respect |
|---|---|---|
| **Static Studio** (open source) | a deterministic page set anyone can open from a link or a file, stamped when published; Pack export | no server; no graph value computed in the page (`spec:consumers.spec-studio#rule.noSecondGraph`); one same-origin request, for the stamp, and only over http(s); the only stored state is the composing panel's gathered intents, per browser and per page set |
| **Agent surface** (open source) | the same questions scripted by an agent | read-only; the schema is the contract |
| **Vault** (open source) | generated notes beside a person's own notes | the generated folder is owned by the Protocol |
| **Pull-request surface** (open source) | a reading where review already happens: the reusable preview workflow's per-pull-request Studio with its base graph and runs (`spec:consumers.spec-studio.sharing#rule.previewWorkflow`), the forward section (recipe 55), design diff, impact | names what it read: checks, previews and their stamp name the pull request's merge commit, and a base graph is named by its label (`base <short commit>` in the workflow) |
| **Desktop app** (commercial, exploratory) | live reload without a manual refresh, an in-app view of the working tree, deep links into the editor. The open-source `sdp studio --watch` already rebuilds from the working tree on carrier changes, and the reader reloads (`spec:consumers.spec-studio.publisher.watch#rule.watch`); the seed's `akg watch` promised the live reload | a reading of uncommitted work must say so, and no reading can today: pages carry no commit by law, so an "uncommitted" basis needs a new Spec. Editor links would revise `spec:consumers.spec-studio.spec-page#rule.sourceText`, which writes no editor URI. Nothing it shows is delivery truth until committed |
| **Web app** (commercial, exploratory) | teams, many corpora, shared review threads, saved readings and filters, intents shared across devices, people and page sets | view state may persist; delivery truth may not. Review threads and preferences are product state, never graph facts, and a proposal carries no status or approval. A perspective is corpus data the repository owns (`spec:consumers.review-perspectives`), so whether a web app may save one elsewhere needs a ruling. Running people's `sdp q` bodies on a server has no sandbox |
| **CI/CD surface** (commercial, exploratory) | extends the open-source preview workflow: readings attached to every pipeline run; run history over time as several named inputs | the Protocol's checks police conformance and honesty only. An adopter may gate on its own corpus rules (`sdp validate --rules`), reported apart and moving no floor (`spec:validation.corpus-rules#rule.neverMovesFloor`); the Protocol imposes no quality gate on design. Run records read at test-file grain, never as fresh, stale or a verdict; when a run goes stale is an open owner question (`spec:observation.run-evidence.bound-file-freshness#question.freshness`) |

The question running through all three commercial surfaces is where product state is allowed to
live, a research question for the long horizon rather than one to settle now. Current law says only
what such state may never become: graph data, a delivery fact, a rung, a status or approval on a
proposal, or a recorded review. The proposed answer: preferences, saved readings, review threads and
intent drafts are product state; anything about the delivery itself stays in the repository and the
graph. Two precedents exist for state a person writes beside a projection: the composing panel's
gathered intents in browser storage (`spec:consumers.spec-studio.intent-panel#rule.persist`), and
the vault, which keeps a Base a person changed and never writes the `intent/` notes outside its
folder (the vault owns one folder, MD-45).

## 6. From today's Studio to this IA

| Today | In this IA |
|---|---|
| index: a counted summary, `Start here` task routes, every Pack as a closed disclosure of its members, every Spec as a filterable row, and the findings | a landing that asks *who are you / what do you hold*, with role homes and the arrival table above |
| a long, flat top navigation: the lenses, then each register and page, with Diff and Runs only when their inputs are given | registers and maps, reached from role homes and task flows; a compact menu remains for experts |
| Spec page with its sections and panels, each already linkable by element id | Spec object page, unchanged in law; role homes link into its existing panel and entry ids |
| decisions on their own Spec pages; questions as register and queue rows and as elements on Spec and slice pages | question object pages; a decision page that shows more than its Spec page only if a cycle finds the need |
| composing panel on every page, keeping gathered intents per browser and page set | the same composing panel, given more weight in every reading; sharing intents across devices and people only on a commercial surface (exploratory) |
| stamp line: corpus commit, engine (whose version names its own build commit) and build time, shown only when a stamp loads | basis line, in plain words, with an honest state when no stamp loads |
| `Start here` task links | the seed of the task-flow layer; already phrased as jobs |

Every row on the right changes ready, implemented Studio Specs. Most are ordinary Spec revisions:
navigation, the landing, role entry and question pages. A code-unit page revises
`spec:consumers.spec-studio.spec-page#rule.sourceText`. Rendering views or switching roles in the
browser, a framework-based UI library, or in-page diagram layout would each need a decision Spec
refining the build-renders decision (MD-43), the custom-elements decision (MD-42) or the
diagram-layout decision (MD-44). [08](08-what-the-repo-settles.md) records what the repository
already settles; [06](06-design-cycles.md) carries the rest as long-horizon design questions.
