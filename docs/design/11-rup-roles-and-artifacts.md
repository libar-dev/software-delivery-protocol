# 11 — RUP roles and artifacts

This document maps the Rational Unified Process onto the Protocol's one graph: for each RUP role, the
questions it keeps asking and the readings that answer them, and for each RUP artifact, whether it
becomes a regenerable reading of the graph or is refused. It is design material, not intended
truth: where it disagrees with a Spec, the Spec wins.

**How it was checked.** The recipe mapping was spot-checked, not exhaustively verified. Recipes 1,
2, 3, 4, 7, 8, 9, 10, 11, 13, 17, 20, 23, 24, 25, 26, 27, 28, 29, 31, 32, 34, 37, 39, 41, 43, 44,
46, 47, 51, 52, 53, 54 and 55 were run at commit `53804437` through `pnpm --silent sdp:q`, and each
answered the kind of question it is mapped to here. The Studio's recipe set was read from its
source. Every entry address cited below resolves under address resolution (recipe 25). RUP role and
artifact names come from the standard RUP role and artifact sets; the repository holds no RUP
catalogue, and names vary between RUP editions.

## Disciplines are filters, never phases

The Protocol adopts the established delivery nouns and rejects the process gates
([adopt the nouns, reject the gates, MD-2](../../specs/decisions/adopt-the-nouns.sdp.md)). Its
concept document on consumers and projections maps the classic disciplines onto the graph "as
filters rather than phases"
([`docs/concept/06`](../concept/06-consumers-and-projections.md), section 6). The carrying term is
**discipline** in [`spec:consumers.projections-model`](../../specs/consumers/projections-model.sdp.md):
"A filter that selects or groups Specs by kind or section; it is not a phase to pass through."
Phase, iteration and milestone are descriptive words a roadmap's framing may use, "never an entry
field, a date, a gate or an enforced sequence"
([`spec:consumers.projections-model.roadmap-views`](../../specs/consumers/projections-model.roadmap-views.sdp.md)).

So every RUP role below maps to a **selection and an arrangement** over the same graph, never to a
stage it must pass. RUP's hump chart keeps its rows (disciplines) and loses its columns (phases as
gates); [01](01-roles-and-perspectives.md#the-rup-frame) has the discipline-to-selection table.

The concept document maps seven disciplines. Implementation and Environment appear only in design
material ([01](01-roles-and-perspectives.md#the-rup-frame)), which is not intended truth; see
[Drift this mapping found](#drift-this-mapping-found).

## Words in this document

- **RUP role** always means a role in RUP's sense. The ratified word **role** names something else:
  the one-token architectural pattern on a code anchor (the architectural-annotation ruling,
  MD-38), which recipe 28 lists. This document never uses bare "role" for a person.
- **persona** is a provisional design term ([README](README.md#words-used-here)): the person we
  design for. Each RUP role here is a candidate persona, and the tier column pairs it with the
  persona in [01](01-roles-and-perspectives.md) it would fold into. The job stories in
  [`jtbd-stories/`](../../jtbd-stories/README.md) deliberately avoid personas; where a RUP role has
  matching job stories, the questions column names them (for example JS-G1).
- **lens** names one of the Studio's graph views; **perspective** names a reader's concern a Pack
  is read from (recipe 37); **discipline** is the kind-or-section filter. They are not synonyms.
- The artifact **fit** labels in the second catalogue are provisional design terms, defined
  there.

## How to read the catalogues

- Numbers in parentheses are recipes in the [catalogue](../agent-surface/recipes.md). Run one as
  shipped: `pnpm --silent sdp:q "$(cat dist/recipes/NN-<slug>.js)" --params '{...}' --json`.
- **Current reading** names a Studio page, a frozen projection (the shipped-projections decision,
  MD-32) or "CLI only" when no page runs the recipe. [10](10-studio-baseline.md) describes the
  current page set.
- **Tier** follows [01](01-roles-and-perspectives.md): 1 for the core delivery personas (the first
  cycles' focus), 2 extended, 3 niche and specialised, 4 ultra-specialised. Tiers are suggestions for the
  design cycles, not rulings, and no lower tier is ruled out.
- Counts are never quoted. Where a gap depends on how much material exists, the cell names the
  recipe or query that measures it.

## Catalogue 1 — RUP roles by discipline

### Business Modeling

| RUP role | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| Business-Process Analyst | Which terms and business rules govern this capability? Does one word mean two things across Packs? | Model terms and term addresses; `rule` Specs and keyed rules; the `workflow` kind; 6, 23, 41, 28 | glossary, search, vault term notes | no context-to-term reading; the glossary lists terms alphabetically, one row per defining Spec, with no Pack or context grouping; above-epic altitude is deferred, so a business use case has no coordinate of its own | 2 · business / domain analyst |
| Business Designer | Which entities does the domain state? Which behaviors touch this term? How does one business use case realize? | `model` sections (terms with definitions, not typed entities); `refines`, `dependsOn`, `constrainedBy`; 19, 54, 22, 25 | `model` Spec pages, glossary | no entity, attribute or worker structure; term use is found by substring search unless authors write term addresses; people are not in the graph | 3 |
| Business Architect (later editions) | Which bounded contexts make up the domain? Which epics span which contexts? Which decisions shape the structure? | `context` on component anchors; component designs; 17, 32, 43, 28, 52, 18 | capabilities and architecture pages, read separately | nothing joins capabilities to contexts; the Protocol's own corpus anchors every component in the same context and states no planned component design (recipes 28 and 43 derive both), so this needs an adopter corpus | 3 |
| Business-Model Reviewer | Is the vocabulary coherent across this Pack? Is a term defined twice? Do domain Specs leave blocking questions? | perspective filter (37) with `select: { kinds: ["model"] }`; the glossary's same-word-twice rule; 20, 22 | glossary, Pack pages; perspectives CLI only | the Studio takes no perspective input; no Pack-level vocabulary reading; judging content stays human | 3 |

### Requirements

| RUP role | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| System Analyst | Which capabilities exist and how far is each refined? What blocks one, and who decides? What changed since the last pass? Where next? (JS-A6, JS-E3, JS-F1) | `behavior` Specs, epics and refinement; 52, 53, 20, 54, 35, 11, 19 | capabilities, roadmap, questions and slice pages; diff page with a base graph | readings sit one collection at a time, with no home for "where does intent stand"; actors are free-text Intent lines, never a selectable value | 1 · technical product manager |
| Requirements Specifier | Which keyed rules does no example exercise? Which values does no example bind? What stands before the stated next rung? Do my mentions resolve? | 34, 44, 9, 7, 11, 22, 48, 23; authoring through the `sdp-authoring` skill | Spec page verification panels, tests page | 9, 7 and 11 have no page (divergence shows only in the frozen census); no cross-Spec author worklist; views never write (`spec:consumers.edit-model`) | 2 · requirements specifier |
| Requirements Reviewer | Can `ready` be stated for this Spec or Pack? Which blocking questions hold it? Does the floor agree with the stated rung? What does it rest on? | 29, 54, 21, 30, 46, 9, 20 | Pack pages with the maturity map, Spec pages, queue page, frozen Design Review | validators never record or require review approval ([`spec:consumers.design-review`](../../specs/consumers/design-review.sdp.md)), and that a review happened is never a graph fact; the "review a Pack for readiness" flow is missing | 1 · readiness author / question decider |
| User-Interface Designer | Which UI entries describe this screen, and which behavior do they serve? Which have no example or bound unit? What changed? | keyed `ui` entries (`spec:<id>#ui.<key>`); 23, 25, 35 | UI panel on Spec pages | no visual artifacts or design-tool links; no register of UI entries; an example exercises rule keys only, never a UI entry; product designers are a later audience | 3 |

### Analysis & Design

| RUP role | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| Software Architect | Which components exist, by context and layer, and how do they use each other? Planned against realized? Which dependencies cross a forbidden pair? What does a change reach? (JS-G1, JS-G5) | 17, 12, 13, 14, 32, 42, 43, 28, 18, 31, 40, 30; significance annotated where realized (MD-38) | architecture and decisions pages, scoped-architecture drawings, frozen Mermaid view | 32, 42, 18 and 40 CLI only; the Studio has no changeset input; planned-beside-built is empty on the Protocol's own pages (43); no deployment view | 1 · software architect |
| Designer | What does this design pin? Which Specs rest on it? Which source lines cite a declaration? Which features read together? | `design` entries, 24, 51, 41, 27, 54, 30, 36, 39 | declarations, Spec and slice pages | the cited line's words wait on a roadmap entry (`spec:consumers.spec-studio.cited-line-text`); 41, 27 and 39 CLI only, so the step where a design thins once code carries it has no page | 2 |
| Database Designer | Which Specs define stored data or storage keys? Which contracts fix a stored shape? What breaks if a schema changes? | `model` and `contract` Specs; 41, 24, 4 | Spec pages, declarations page | no persistence or schema concept (concept search finds no Spec about data design); migrations have no reading | 3 |
| Capsule Designer | Which units run concurrently, over what protocol? Which timing constraints hold? | only indirect: free `role` tokens on code anchors (28), `contract` Specs, constraint targets | none | no concurrency, port or timing model; any reading would be corpus data; timing waits on the deferred `observed` fact | 4 |
| Architecture Reviewer | Are forbidden layer directions and isolated contexts honoured? Which planned components are unrealized? Which decisions shape this, and is any superseded? Which NFRs constrain it? | 42 as a corpus rule under `sdp validate --rules`; 32, 43, 18; 37 with its `bindings` selector | architecture and decisions pages; walk findings CLI only | no architecture review reading; NFR material is thin in the Protocol's own corpus; the Studio cannot apply a team's perspective, such as a security one | 2 |
| Design Reviewer | Where does each member of this Pack stand? What changed since the last pass? Which code answers to the design? Can the Pack be stated `ready`? | 29, 5, 54, 35, 27, 36, 37, 38, 49; the Pack design page (MD-39) | Pack and slice pages, diff page with a base graph, frozen Design Review, composing panel, vault iteration | the best-served RUP role; lacks the "review a Pack for readiness" flow, a perspective selector, and a page for 27 | 1 · readiness author / question decider |

### Implementation

| RUP role | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| Implementer | What next? What does this Spec guarantee, and who verifies it? What does my diff reach, and what can the graph not see? Is code ahead of intent? What do I hand my agent? (JS-G1, JS-G2, JS-E2) | 1, 3, 4, 2, 36, 21, 51; `g.byFile`, `g.blastRadius` | Spec pages; roadmap page (to build, drift); mainly the agent surface (`sdp q`) | no page runs 1 or 2, and the "Backlog" navigation entry is the design backlog (33); no changeset landing | 1 · engineer / implementer |
| Integrator | In what order do components depend on each other? Which components does a change reach? Did the integrated build pass? | 13, 17, 26, 4; 45, never a verdict | architecture page; runs page with run records | build and integration belong to CI; `dependsOn` is design dependency, never build order, and scheduling phrases are never authored (the planning-truths decision, MD-33); a component order could derive from anchored `uses`, but no reader has asked | 3 |
| Code Reviewer | Which Specs does a pull request touch; is a binding new or broken? Does each anchor honestly `satisfies` or only `references`? Do cited addresses resolve? Which load-bearing files lack an anchor? | 4, 22, 51, 25, 27, 40, 2 | none takes a changeset; the diff page shows design change only, with a base graph | the pull-request change narrative (design diff, blast radius, queue movement) is derivable but not built; code findings stay pull-request comments, outside the graph | 2 · pull-request reviewer |

### Test

| RUP role | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| Test Manager | How far does verification reach? Which ready Specs have no verifier? Are declared verifiers enabled? What did the last supplied run report? | 8, 10, 34, 44, 45 over the `has-verifier` fact | tests page, runs page with run records, index findings | no per-Pack test-evaluation reading; 10 has no page; evidence joins at file grain and is never a verdict; freshness is a Spec stated `idea` | 2 |
| Test Analyst | Which rules have no example? Which outcome classes or slot values lack a witness? Which behaviors have no example space? Which questions leave outcomes unspecified? (JS-G2, JS-G4) | 34, 44, oracles (`unspecified` is a first-class answer), 20 | tests page, rule-coverage rows on Spec pages | no example-space explorer; no outcome-class coverage per space; a test idea is an `example` at `idea`, visible only through 11, CLI only | 1 · Tester / QA |
| Test Designer | Which oracle models which space? Which examples bind which points? Is every example backed by a resolving test anchor? Where are tests anchored? | test and oracle anchors, step contracts, example spaces and oracles; 10, 44 | tests page, frozen Gherkin-shaped view, Spec pages | no matrix reading of a space; no oracle register; test environment and data are outside the graph | 2 |
| Tester | Which tests verify this Spec? Which examples does my test file bind? What did this run report for files bound to it? Which Specs does a failing file reach? | 3, `g.byFile`, 45, 4 | Spec verification panels, runs page with run records, Gherkin view | evidence joins at test-file grain; defects have no graph home; no reading leads from a failing file to the Specs at risk | 1 · Tester / QA |

### Deployment

| RUP role | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| Deployment Manager | What does this release contain? Is this Spec live? Are NFR targets met? What is in the bill of materials? | `observed` is designed and deferred (`spec:observation.runtime-overlay`, stated `idea`, held by `#observationIdentity`); a release is a git-tag projection | evidence page, where every source reads "not tracked" | everything, by design, until a reader is named: release and baseline views wait on `#releaseReader` | 3 · release or deployment manager |
| Course Developer | In what order should a newcomer read this capability? Which examples teach a behavior best? | 52, 54, Model terms, examples with expected outcomes, the Pack export | glossary, capabilities page, Pack export | no ordered tour; an outside reader waits on `#namedOutsideReader`; concept search finds no onboarding or training material | 4 |
| Technical Writer | What is the current reference for this interface? Which Specs describe outward behavior? What changed for users since the last release? | the reference projection, stated `idea` (`#namedOutsideReader` blocks; `#referenceSource` asks what would feed it); 24, 39, 35, the Pack export | Pack export; every page prints as a document; glossary | no reference projection until an outside reader is named; no release notes while release views are deferred | 3 |
| Graphic Artist | Which screens need artwork, and in which states? | none; `ui` entries are text | none | out of scope until the UI library and design system arrive; product designers are a later audience | 4 |

### Configuration & Change Management

| RUP role | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| Configuration Manager | Which commit and engine does this reading project? What changed between two commits? What does a baseline contain? Can I rebuild the graph at an old commit? (JS-C4) | git is the event log; 35 against a supplied base graph; the stamp; engine provenance (`sdp --version`) | diff page with a base graph; the stamp in the Studio shell | no status accounting over history, because no projection reads git yet; baseline views wait on `#releaseReader`; the stamp is not explained in words | 2 · change / configuration manager |
| Change Control Manager | Which change proposals exist, against which base? Is each scope moved, unresolved or incomparable? What does a design change reach? | the change proposal (`schemas/sdp-proposal-1.schema.json`); 38, 49, 30, 35, 48 | composing panel, diff page, memos on the pull request | by law a proposal carries no status, approval or verdict ([`spec:consumers.intent-composition.proposal`](../../specs/consumers/intent-composition.proposal.sdp.md)), so there is no change-request register or board disposition; open proposals live in pull requests, an outside input | 2 · change / configuration manager |

### Project Management

| RUP role | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| Project Manager | What comes next, and does each entry need design, a statement or building? What waits on a person? Where does each capability stand? What is at risk? | 53 and 55 over `pack:roadmap` (a roadmap states advisory priority, MD-46); 46, 52, 1, 33, 11, 20 | roadmap, queue and capabilities pages; the roadmap memo in pull-request descriptions | several needs are refused by law (dates, status, gates, percent complete, scheduling phrases); actually missing: people and ownership, a risk list beyond blocking questions, a time series | 1 · engineering leader / project lead / auditor |
| Project Reviewer (Management Reviewer in earlier editions) | Can I trust this picture without hand-authored status? Do stated readiness and realization agree? Which decisions shape the work? What does the corpus say it does not know? | the census; 11, 7, 31, 53, 2, 8 | frozen census, index findings, roadmap and decisions pages | milestone review as a gate is refused; baseline approval is a signed git tag outside the model; an honest leader reading combining readiness, realization and decisions is missing | 2 · shares the tier-1 leader's reading |

### Environment

| RUP role | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| Process Engineer | Which Protocol capabilities does this corpus use, and where could each apply? Which corpus rules should run? How do agents enter work? What does an upgrade change? | 47, 48, 50; rules files (25, 26, 42, 50, 51); the upgrade kit reports and proposes, never edits; work shapes are neither phases nor a required sequence | CLI only; the `sdp-sessions` and `sdp-authoring` skills; the upgrade guide | no adoption board; Environment is missing from the concept document; an authored development case would be the process state the adopt-the-nouns decision (MD-2) refuses | 2 · process engineer / adoption lead |
| Tool Specialist | Which engine and commit built this? How do I wire `sdp` into CI, the vault and previews? Which recipe answers which task? | engine provenance, the adopter on-ramp, validate watch, the vault, 47, the reading skill's recipe task table | README, skills, recipe catalogue; the stamp | tool guidance is hand-written prose; no page shows the recipes, inputs or capabilities a page set used | 3 |
| System Administrator | Where is this preview hosted, and which build is it? Did publishing run? | publishing is a CI step, never the build (`spec:consumers.spec-studio.sharing#rule.publishingStep`); the stamp; engine provenance | the stamp | infrastructure is outside the graph by design | 4 |

### Additional RUP roles (across disciplines)

| RUP role | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| Stakeholder | Where, honestly, does the capability I care about stand? What does the behavior do for these inputs? Can I send a change request without learning the repository? (JS-E3) | 52, 53, the Pack export, example spaces with oracles, stamped previews | a preview link, Pack export, composing panel, phone layout | no short sponsor-level account, and one must not become a progress score; no example-space explorer; discussion lives in the pull request | 2 · stakeholder in a review; sponsor |
| Any Role | Where is this term, Spec or file? What does this address point at? What does this reading project, and is it current? How do I hand a change to an agent? | 6, 23, 25; `g.findByConcept`, `g.byFile`, `g.blastRadius`; the stamp; the composing panel | search, glossary, Spec and Pack pages, navigation, composing panel | the shared base every role home builds on; missing arrival by question, role or changeset, a basis line (provisional term), and object pages for questions and decisions | 1 · shared base |
| Technical Reviewer | What does this artifact say, and what does it rest on? What changed since I last read it? How do I return findings so they are applied? | the change proposal; 38, 49, 35, 36 | object pages, composing panel, diff page | findings travel as proposals or pull-request comments and never enter the graph; no page reads returned proposals | 2 · pull-request reviewer |
| Review Coordinator | Which reviews are due, and who reviews what? Which findings remain open? | 46 by decider; the question fields `decider`, `links`, `provisional`, `trigger` | queue page | reviewer assignment is impossible because no node has an owner; review records are refused by law; scheduling is refused (the planning-truths decision, MD-33); the honest reading is a decider's queue | 3 |

### Protocol-native (not a RUP role)

| Persona | Recurring questions | What the graph holds | Current reading | Gap | Tier |
|---|---|---|---|---|---|
| Readiness author / question decider | Which statements can I make now, and in what order? Which of my questions hold other Specs? What stands before the stated next rung? Does the floor agree with what I would state? (JS-E4) | 46, 9, 29, 7, 21, 20, 31 | queue page, Pack pages with the maturity map, frozen Design Review | promotion preflight (9) has no page; the queue selects by decider token, not by person; the "review a Pack for readiness" flow is a first-cycle brief ([06](06-design-cycles.md)) | 1 · readiness author / question decider |

It combines RUP's stakeholder sign-off, requirements and design review, and project-review approval,
with no gate: a readiness author states readiness by editing a carrier, and the decider a question
names settles it.

### Tiers at a glance

| Tier | RUP roles |
|---|---|
| 1 | System Analyst, Requirements Reviewer, Software Architect, Design Reviewer, Implementer, Test Analyst, Tester, Project Manager, Any Role, and the Protocol-native readiness author / question decider |
| 2 | Business-Process Analyst, Requirements Specifier, Designer, Architecture Reviewer, Code Reviewer, Test Manager, Test Designer, Configuration Manager, Change Control Manager, Project Reviewer, Process Engineer, Stakeholder, Technical Reviewer |
| 3 | Business Designer, Business Architect, Business-Model Reviewer, User-Interface Designer, Database Designer, Integrator, Deployment Manager, Technical Writer, Tool Specialist, Review Coordinator |
| 4 | Capsule Designer, Course Developer, Graphic Artist, System Administrator |

Two placements depart from [01](01-roles-and-perspectives.md). The Project Reviewer sits at tier 2
because its milestone form is refused, while its honest reading is the tier-1 leader's. The Test
Analyst sits at tier 1 because rule and example-space coverage are the Tester / QA persona's core
questions.

Non-human readers are not RUP roles and have no rows. The coding agent reads through `sdp q`, the
recipes and context bundles. CI runs the checks and builds the Studio preview, whose roadmap page
shows recipe 55's memo; a pull request's forward section is rendered by its author
([01](01-roles-and-perspectives.md#non-human-readers)). Every human reading should hand the same
scope to an agent.

## Catalogue 2 — RUP artifacts as projections

In RUP each artifact is a document someone writes and keeps current. Here, an artifact that states
intended system truth becomes a **reading of the one graph**: a pure, regenerable function of it,
never a second source of truth (the projection law, `spec:consumers.projections-model`). Nobody
keeps it current, because it is rebuilt from the Specs each time.

An artifact that carries **process state** (schedule, approval, assignment, or the fact that a
review happened) is refused. The governing rubric in [`CONTEXT.md`](../../CONTEXT.md) says:
"Reject process state-machine / lifecycle gating (sprint/ticket FSM, mandatory phase gates). Adopt
the process nouns, not the process gates." Where the information is honest, the table names the
reading that re-derives it.

| Fit (provisional) | Meaning |
|---|---|
| projection-available | a recipe or page derives it today |
| projection-possible | the graph holds the material; a carrying Spec plus a recipe or page would derive it, with no model change |
| partly-modelled | some of its content has a graph home; the rest has none |
| not-modelled | no graph material; deferred behind an owner question or out of scope |
| rejected | carries process state the rubric refuses; a derived substitute is named where one exists |

| Discipline | RUP artifact | Fit | How it would be derived, or what replaces it |
|---|---|---|---|
| Business Modeling | Business Use-Case Model | partly-modelled | `workflow` and `behavior` Specs with Intent actor, problem and outcome, scoped by a Pack or a perspective (37), read through the capability map (52). No descriptor separates business from system use cases, and actors are free text. A business scope would be a Pack or a perspective, never a new kind (one primitive, named coordinates, MD-4) |
| | Business Object / Domain Model | partly-modelled | `model` Specs' terms and term addresses, through the glossary page, 23 and 6. Terms carry definitions, not attributes, associations or multiplicity |
| | Business Rules | projection-possible | `rule` Specs plus keyed rules (`spec:<id>#rule.<key>`), with rule coverage (34). No corpus-wide register exists: 34 refuses without a Spec or Pack scope, and a rule may stay inline or be promoted to its own Spec, so a register must read both |
| Requirements | Vision | projection-possible | Intent of epic Specs, the capability map (52) as the feature tree, `constraint` Specs, Pack framing and the roadmap (53). Stakeholders and market position are not modelled; the Protocol's own vision is still a hand-written concept document |
| | Glossary | projection-available | the Studio glossary page, the vault's term notes, 23 and 6. The page renders no separate glossary document and shows a word defined twice side by side. `CONTEXT.md` stays hand-authored, and no check compares it with the projected terms |
| | Stakeholder Requests | partly-modelled | `idea`-rung captures (`spec:consumers.graph-first-planning`), open questions (20), change proposals (38, 49). There is no stakeholder entity; a proposal carries no proposer and no status; tracker items stay in the tracker |
| | Use-Case Model | projection-available | `behavior` Specs refined epic to feature to story, read by the capability map (52), with a Design Review and Studio page per Spec; flows on `workflow` Specs; examples as scenarios. An actor-to-use-case diagram is only possible, because actors are free text |
| | Supplementary Specification (NFRs) | projection-possible | `constraint` Specs (statement, flavor, target, how it is measured) linked by `constrainedBy`, grouped by flavor. No recipe or page lists them yet; the NFR board in [05](05-specialised-and-ai-readings.md) is a candidate. Attainment waits on the deferred `observed` fact |
| | Requirements Management Plan | rejected | The typed half is the meta-model as code (the executable meta-model, MD-1), whose taxonomy the census projects; project policy becomes corpus rules under `sdp validate --rules`. The control half (approval, change boards, status attributes) is the gating the rubric refuses |
| | Requirements Attributes | partly-modelled | kind, altitude, stated and derived readiness, delivery facts, question fields, Pack membership, a place on a roadmap, Intent risk. "Status" is an alias to avoid; priority is advisory, with no date or gate (a roadmap states advisory priority, MD-46); there is no owner; target release waits on `#releaseReader` |
| | Software Requirements Specification | projection-available | the Pack export: one self-contained file holding a Pack page and its members in authored order; every page prints as a document; the design slice (54) reads a Pack as one design. Its scope is a Pack, not a template; the export holds no time or commit, so a version comes from the stamp or git |
| | Requirements traceability | projection-available | 3, 4, 18, 27, 30, and the requirement-trace drawing, which keeps claims apart (`spec:consumers.spec-studio.diagram-kinds.requirement-trace#rule.claimsApart`). `has-verifier` means a binding exists, not that a test passed; `implemented` never travels through refinement |
| Analysis & Design | Software Architecture Document | partly-modelled | logical and implementation views from 17, 32, 28, 43, 42 and the architecture page; decisions from 31, 18 and the decisions page; the use-case view from 52; a scoped-architecture drawing per Pack or slice. Process and deployment views have no material, and the architecture lens draws no port, external system or runtime layer |
| | Design Model | partly-modelled | open Design and UI entries, pinned declarations (24, with citing lines from 51), `contract` Specs, component designs (43), and anchored code units with `role`, `memberOf` and `uses`. Open sections stay open bags under the typing law, so classes and interactions are not typed |
| | Analysis Model | rejected | Its content is enriched in place on the same Spec, and a corpus-owned `role` can name a pattern. A separate model later transformed into another is the migration principle P4 forbids (one primitive, named coordinates, MD-4). This refuses an artifact type, not a workflow |
| | Use-Case Realization | partly-modelled | the units that satisfy or reference a behavior (3, 27), the requirement-trace and scoped-architecture drawings. Which units realize a use case is derivable; how they interact is not, because `uses` is static |
| | Data Model | partly-modelled | `model` terms, declarations that pin a type or table, the key-family register (41). There is no entity, key or relationship schema |
| | Interface specification / API reference | partly-modelled | `contract` Specs, pinned declarations (24), `api:` anchors. The reference projection is stated `idea` and held by `#namedOutsideReader` |
| | UI Prototype / Storyboard / Navigation Map | partly-modelled | keyed `ui` entries on Spec pages. There is no navigation structure, and Specs reference design artifacts, never own them |
| | Deployment Model | not-modelled | nearest material: the `infrastructure` layer value on a component. Deployments read "not tracked" (`spec:consumers.spec-studio.lenses.evidence#rule.notTracked`) |
| Implementation | Implementation Model | projection-available | code units from `impl:`, `api:` and `component:` anchors with `memberOf`, `uses`, `satisfies` and `references`; 12, 13, 14, 17; the census structural section; `g.byFile`. Curated and sparse by design; import structure is the separate inferred impact graph, and the curation report (40) ranks files the anchors miss |
| | Integration Build Plan | rejected | Substitute: the build backlog (1), each roadmap entry's need (53), dependency footing (21), dependency cycles (26), the statement queue's rounds (46). Planning truths live in ruled graph homes (MD-33): scheduling phrases are never authored, and no recipe or plan document "authorizes, blocks, or sequences delivery work" (`spec:consumers.graph-first-planning`) |
| Test | Test Plan | partly-modelled | Verification sections (mode and criteria), example spaces and `verifies`; the tests lens; 8, 10, 34, 44. The verification mode is authored posture, never the derived enabled verifier; environment and resources are not modelled; a test schedule or phase gate is refused |
| | Test Idea List | projection-available | 34, 44 and the honesty gaps (8), filtered in the tests lens. These are informative absences, never a gate; unkeyed rules are counted apart |
| | Test Case | projection-available | `example` Specs, one bound point each (point-per-example, MD-17), with a given-when-then fence and `verifies` naming the rule keys exercised; the Gherkin-shaped view; verification panels; 3, 10 |
| | Test Script / Test Data | projection-available | step and space contracts derived per example (`spec:extraction.executable-contracts`); bound points are the data and the oracle gives the expected outcome. The script itself is ordinary test code bound by a test anchor, never a document |
| | Test Results / Test Log | projection-available (named input) | run evidence (45) over supplied CTRF reports, shown on the runs page, in the tests lens and on Spec pages. Run records are never graph data, join at file grain, and are never a verdict (`spec:observation.run-evidence#rule.graphUntouched`) |
| | Test Evaluation Summary | projection-available (measures only) | the sentences that open the tests lens, counted from the recipes (`spec:consumers.spec-studio.lenses.tests#rule.testsSummary`); 10. The measures are projected; the evaluation stays a human act |
| Deployment | Deployment Plan | not-modelled | none. A rollout schedule would also fall under the refusal of recorded work order (the planning-truths decision, MD-33) |
| | Release Notes | projection-possible | the design diff (35) with the previous release's graph as its base; known issues from the question register (20). Release views wait on `#releaseReader`, whose trigger is the first published release |
| | Bill of Materials | not-modelled | nearest material: engine provenance and the stamp, which is never graph data. Bills of materials read "not tracked" |
| | End-User Support / Training Material | not-modelled | nearest designed reader: the `idea`-rung reference projection. The Protocol is not a replacement for adjacent tools |
| Configuration & Change Management | Change Request | partly-modelled (named input) | the change proposal against a base commit, checked by 38 and rendered by 49; the composing panel gathers scoped intent. No status, approval, verdict or proposer; code defects stay pull-request comments; a change-request lifecycle is refused |
| | Configuration Management Plan | rejected | git is the configuration-management system and the event log; a baseline is a signed git tag, and approval stays outside the model |
| | Configuration Audit Findings | projection-available | the validation report (`report`, both check families); 2, 7, 8, 22, 25, 40; the census findings; the `--check-clean` regenerability checks. "Deterministically validated," never "provably correct"; a physical audit of a release baseline waits on release views |
| Project Management | Software Development Plan | rejected | Substitute: a roadmap Pack read by 53, rendered by 55 and shown on the roadmap page; a Pack per body of work; `trigger` lines on deferred questions. Priority "carries no date, no dependency, no status and no gate" ([`spec:decisions.roadmap-priority`](../../specs/decisions/roadmap-priority.sdp.md)) |
| | Iteration Plan | rejected | Substitute: the arc's Pack and its draft pull request; 29, 54, 55. The Protocol "adds no plan file and no review file" (the roadmap and the pull request over plan and review files, MD-47) |
| | Status Assessment | rejected | Substitute: each roadmap entry's need (53), capability map totals (52), readiness divergence in the census, 11, 46. Authoring a delivery fact is an honesty violation, readiness is never status, and the map states no percent complete |
| | Iteration Assessment | rejected | Substitute: the design diff (35) from the arc's base, plus the pull request description. The diff "never records that a pass happened" (`spec:consumers.design-diff`) |
| | Risk List | projection-possible | aggregate the repeatable Intent `risk` entries; the register built today is the blocking questions (20). No recipe or page aggregates risks; probability, impact, mitigation and owner are not modelled, and a risk status would be the refused status machine |
| | Business Case | partly-modelled | Intent value, problem and outcome on epics; capability map totals. Cost, return and funding are not modelled, and no Spec rules on whether estimates would ever be admitted |
| | Review Record | rejected | Substitute: the review context on Design Review and Studio pages; findings as change proposals with a memo (49) on the pull request; an open finding becomes an open question. That a review happened is never a graph fact |
| | Issues List | projection-available | the open-question register (20) and the questions page, with the blocking flag, decider, provisional reading, trigger and links. Questions with no decider are counted apart (`spec:consumers.readiness-planner#rule.undecided`); an issue not tied to a Spec belongs in the tracker |
| | Work Order | rejected | Substitute: scoped intent from the composing panel, or a context bundle (36), handed to an agent. No recipe authorizes work; access control stays in git and CI |
| | Project Measurements | projection-available | census counts and findings, capability adoption (47), and the totals of 52, 53 and each recipe. No score or quota; trends would need a projection that reads git, which is not built |
| Environment | Development Case | rejected | Descriptive substitute: capability adoption (47); advisory work shapes in the `sdp-sessions` skill. Mandatory artifact sets contradict "never a quota of artifacts to produce" (principle P4's corollary) and the refusal of workflow gating |
| | Project-Specific Guidelines | partly-modelled | a checkable guideline as a `constraint` Spec plus a corpus rule under `sdp validate --rules` (42, 25, 26, 50, 51); prose guidance stays in skills and docs. Corpus findings stand outside the two check families |

### The pattern

1. **Artifacts that state intended system truth** (requirements, use cases, rules, NFRs, design,
   tests, traceability) are projections of Specs: available today, or possible without a model
   change.
2. **Artifacts that carry process state** (development and iteration plans, status and iteration
   assessments, review records, work orders, the integration build plan, the configuration
   management plan, the development case, the control half of the requirements management plan)
   are refused by the governing rubric. Their honest information is re-derived instead, through
   the roadmap (53, 55), the census, the design diff (35) and the statement queue (46).
3. **Runtime, deployment and release evidence** is not modelled yet. It waits behind owner
   questions already in the corpus.

Some artifacts are views of a **named input** beside the graph, not pure projections: test results
(run records), change requests (a proposal document), and release notes or an iteration assessment
(a base graph). [`CONTEXT.md`](../../CONTEXT.md) admits such an input only when it is identified
apart from the graph and never answers in its name, and the Studio accepts exactly the base graph
and run records (`spec:consumers.spec-studio#rule.namedInputs`).

Any new RUP-shaped reading meets four constraints. The four shipped projections stay frozen (the
shipped-projections decision, MD-32), so it is a recipe, a Studio page or a new projection Spec,
never a reshaping of the Design Review, census, Mermaid or Gherkin view. Deterministic derivation
keeps dates and commits off pages; those come from the stamp or git. Sinks rank agents first, human
views second, document exports last. And the growth valve is a recipe: a join freezes into the
reader only at the second-caller bar.

## Long-horizon research backlog

The repository answers the technical mapping above. The design questions the RUP roles raise will be
answered over many months of iterative design cycles ([06](06-design-cycles.md),
[08](08-what-the-repo-settles.md)). They are research threads, not owner to-dos to settle now.

- **Owner questions already in the corpus** hold the not-modelled and deferred artifacts:
  `spec:consumers.projections-model.roadmap-views#question.releaseReader` (release notes, release
  and baseline views; trigger: the first published release),
  `spec:observation.runtime-overlay#question.observationIdentity` (deployment model and plan, NFR
  attainment, a process view), `spec:consumers.reference-projection#question.namedOutsideReader`
  and its non-blocking `#question.referenceSource` (API reference, end-user material), and
  `spec:consumers.ai-assisted-reading#question.aiPresentationBoundary` (any assistant-written
  narrative, such as a status summary). MCP integration stays designed-in and deferred (the
  MCP-deferred decision, D6).
- **Questions no Spec rules on**: whether stakeholder entities, a business-versus-system use-case
  scope, cost or effort estimates, risk probability and impact, people and ownership, or readings
  derived from git history will ever enter the model. People and history already sit in the
  [graph needs log](07-graph-needs.md).
- **Cheapest projection-possible readings**, needing no model change, only a carrying Spec plus a
  recipe or page: a risk list, an NFR board, a business-rules register across the corpus, a vision
  reading, and an actor catalogue from Intent actor lines. Each would need its carrying Spec
  authored in an engineering session; a design session only records the need.
- **Test bed.** The Protocol's own corpus is thin for Business Modeling, NFRs and planned
  architecture, so readings for those RUP roles need an adopter corpus or the worked example
  (`examples/checkout-v1`).

The design questions here are carried in
[06](06-design-cycles.md#design-questions-for-the-long-horizon); the owner questions above stay in
the corpus.

## Drift this mapping found

Recorded for an engineering session to resolve; this document does not settle any of it.

- The concept document on consumers and projections maps seven disciplines in section 6 and omits
  Implementation and Environment. Their mappings exist only in design material.
- The same document lists the Spec Studio under surfaces "designed and not built", yet
  `spec:consumers.spec-studio` states `ready` and carries `implemented` and `has-verifier`.
- It calls the capability map "designed-for, unbuilt", yet `spec:consumers.capability-map` carries
  `implemented` (recipe 52, the capabilities page).
- It calls the roadmap views deferred, yet the roadmap reading is built (`spec:consumers.roadmap`);
  only the release and baseline views remain deferred.
