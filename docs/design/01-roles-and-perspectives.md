# 01 — Roles and perspectives

Readings are cheap to regenerate, so the product can afford readings for many delivery roles. This
catalogue keeps the whole range in view, from core delivery roles down to niche, ultra-specialised
and AI-assisted readers. The first design cycles concentrate on tier 1. That is where the work
starts, not where it stops: nothing in the lower tiers is ruled out.

## The principle the seed set

The seed design gave every role the same reading surface and left authoring native to each role:

> No persona is forced to learn an unfamiliar surface. The Spec Studio is the *reading* surface for
> everyone; authoring surfaces remain native to each role.
> ([seed 04, section 6](../lineage/v0-design/04-authoring-surfaces.md))

This foundation keeps that principle and sharpens it. Everyone reads the **same graph** and lands
on the **same Spec and Pack pages**. What differs by persona is the entry, the selection, the order
and the emphasis: the role home (a provisional term, see below) and what it selects.

What a shipped entry can select is narrower than it sounds. The Studio shows a recipe's answer only
when its design names that recipe (`spec:consumers.spec-studio#rule.recipeAnswers`), and beside the
graph it reads only a base graph and run records (`spec:consumers.spec-studio#rule.namedInputs`).
Perspectives are corpus data that each corpus owns, and the Protocol ships none
(`spec:consumers.review-perspectives`). So a Protocol-shipped entry selects through named recipes and
disciplines. A home built from a corpus's own perspectives would need a further named input, which
is an open design question. The outside-register input, stated at `scoped`
(`spec:consumers.spec-studio.register-input`), is the precedent for adding one.

The seed named five personas, each with a value proposition ([seed 00, sections 4–5](../lineage/v0-design/00-vision-and-product.md)):
domain engineer, architect, product manager or business analyst, QA engineer and AI agent, with an
auditor in the value table. Its North Star scenario follows one product manager from a Studio
page to a reviewed change, and its last line is a status report for leadership "generated from the
graph; nobody had to write it." The tiers below extend that cast.

## Persona, delivery role, perspective, reading

Four words that are easy to confuse. Only **perspective** is ratified. The other three are
provisional design words: they stay out of labels, Specs and the glossary until the owner rules on
them.

- A **persona** is a person we design for: a delivery role, a situation, a job. It lives in design
  material only. The [job stories](../../jtbd-stories/README.md) deliberately bind to no persona, so
  this design pairs each persona with job stories and writes any new job it finds as a persona-free
  story. Inside a Spec, whom it serves is its Intent `actor` line, which a minority of Specs carry.
- A **delivery role** is a person's job in delivery, in the RUP sense (catalogued in
  [11](11-rup-roles-and-artifacts.md)). This document says "role" in that sense, and it collides
  with the ratified **role** in [`CONTEXT.md`](../../CONTEXT.md): the one-token architectural pattern
  on a code anchor (the architectural-annotation ruling, MD-38). "Role home" and any other compound
  on it are therefore provisional and must not become a Studio label as written. `decider` collides
  the same way: it is both the open-question field and an anchor role value
  (`spec:protocol.role-vocabulary#term.decider`).
- A **perspective** is corpus data that filters and orders a Pack's members for one concern
  (`spec:consumers.review-perspectives`). It runs through recipe 37. That Spec traces it to the
  seed's one reading surface, read from each reader's own concern, and to the first adopter's
  advisor lenses.
- A **reading** is what the persona actually opens: a page, a projection or a recipe answer,
  selected and arranged for a concern. It stays a plain design-prose word; the [README](README.md)
  holds the working definition and [04](04-reading-model-and-ia.md) breaks it into parts. The corpus
  already uses it informally ("a reading and not an artifact", `spec:consumers.design-slice`) and in
  fixed phrases such as a Pack's reading order.

One persona usually needs several perspectives, and one perspective serves several personas.

## No owner in the graph

The seed's Spec carried an optional `owner`, a team or person handle, and so did its open
questions ([seed 01](../lineage/v0-design/01-core-primitives.md)). Today's intended truth goes the
other way. Concept 00 lists "a Spec names no owner" among its deliberate non-goals
([section 5](../concept/00-vision-scope-and-mvp-boundary.md)), and the Markdown envelope is closed,
so an `owner:` key is refused (`spec:carrier.envelope-contract`). The per-Spec `owner` left the
model at the reboot (commit `ed5f6ad3`) without a decision record; the question's owner became
today's `decider`.

What the graph holds about people:

- An open question's `decider`: one lowercase kebab token the corpus owns, such as `owner` or
  `delegated`. It references nothing, authorizes nothing and is checked against no list; an
  off-grammar value is a conformance error (`spec:model.open-question-fields`). Some questions name
  no decider.
- An Intent `actor` line: prose naming whom a Spec serves. It is not ownership.
- A Pack's `order: priority`, read as its owner's advisory preference without naming anyone
  (`spec:model.pack-aggregate`).

Consequences for role design:

- A "my Specs" or "my team's work" reading cannot be computed from the graph.
- A decider's queue can be computed, but only for questions. The statement queue (recipe 46)
  selects open questions by `decider`; its waiting readiness statements are corpus-wide and belong
  to no one (`spec:consumers.readiness-planner#rule.waiting`,
  `spec:consumers.readiness-planner#rule.ownerQuestions`). The Studio's
  owner queue page is fixed to decider `owner`
  (`spec:consumers.spec-studio.owner-queue#rule.ownerQuestions`); any other decider is reachable
  through recipes 46 and 53 with `params.decider`.
- A role home can select by **concern** (perspective, discipline, Pack, context) without knowing who
  the reader is. That is the honest default.
- Approval, and who stated `ready`, are never graph values. They live in git and in pull request
  descriptions; a reading that shows them would need a supplied, labelled input.

Governance stays outside the model. The seed kept authorization out on purpose ("`owner` is a soft
pointer … not an authorisation system"; seed 01, section 10) while keeping a descriptive owner.
Today change approval lives in git and CI (concept 00, section 5), a baseline's approval artifact is
its signed git tag, and this repository, which has no CODEOWNERS file, records its rulings and who
made them in pull request descriptions (`spec:decisions.roadmap-over-plans`).

Whether descriptive ownership should ever return is a long-horizon research question
([06](06-design-cycles.md)), answered with evidence from the cycles. It is not a blank slate. It
would reopen a stated non-goal through a decision Spec, more likely as a section than as an envelope
key (invariant L9 in [concept 01](../concept/01-founding-principles-and-invariants.md)), and it must
avoid the workflow-tracker fields `spec:model.open-question-fields` warns against: no status, date or
assignment. What the repository already settles is collected in [08](08-what-the-repo-settles.md).

## The RUP frame

The classic Rational Unified Process disciplines give this design its starting vocabulary for
delivery roles. Concept 06 maps seven of them onto the graph as filters, never phases, under the
adopt-the-nouns decision (MD-2) ([`docs/concept/06`](../concept/06-consumers-and-projections.md),
section 6): Requirements, Analysis & Design, Test, Deployment, Configuration & Change Management,
Project Management and Business Modeling. The Implementation and Environment rows below, and the
cells beyond that mapping, are this design's extension. In the ratified sense a discipline is a
filter by kind or section (`spec:consumers.projections-model`); the other cells are readings grouped
under a discipline's name, and *outside the graph* marks a source a reading takes beside it. The RUP
roles and artifacts behind the last column are catalogued in [11](11-rup-roles-and-artifacts.md).

| RUP discipline | What a reading draws on | Typical delivery roles |
|---|---|---|
| Business Modeling | `model` Specs, Model terms, the glossary | business or domain analyst |
| Requirements | `behavior` Specs, epics and their refinement, the capability map | technical product manager, requirements specifier |
| Analysis & Design | `design` sections, decision records, components, contexts, layers | software architect |
| Implementation (extension) | `satisfies` and `references` bindings, code units, the drift alarm | engineer, coding agent |
| Test | `example` Specs, example spaces, oracles, `verifies` relations; run evidence (outside the graph: supplied run records) | tester, test designer |
| Deployment | the `observed` delivery fact (designed and deferred) | operations, deployment manager |
| Configuration & Change Management | the design diff (outside the graph: a supplied base graph); git and change proposals (outside the graph) | change manager, reviewer |
| Project Management | Packs, the roadmap, the statement queue | project lead, engineering leader |
| Environment (extension) | capability adoption, the upgrade kit; corpus rules (outside the graph: rules files run over it) | process engineer, adoption lead |

Concept 06 has drifted behind the graph;
[11](11-rup-roles-and-artifacts.md#drift-this-mapping-found) lists the drift for an engineering
session.

The hump chart's rows translate cleanly. Its columns do not: phase, iteration and milestone are
descriptive words a roadmap's framing may use, never entry fields, dates or gates
(`spec:consumers.projections-model.roadmap-views`). A reading could show how activity rises and
falls by discipline over time once a history input is ruled. Today the Studio refuses a timeline or
a trend until one exists (`spec:consumers.spec-studio.diagram-kinds#design.timeline`,
`spec:consumers.spec-studio.diagram-kinds#design.xyChart`); an operator can already compute it outside the Studio by building graphs at
successive commits and comparing them with the design diff (recipe 35). A reading may never show a
phase someone must pass.

## Tier 1 — core delivery roles (first cycles)

| Persona | Seed ancestor | Situation | Jobs (job stories) | Material the graph already holds |
|---|---|---|---|---|
| **Technical product manager** | product manager / analyst (seed 00 §4); the North Star reader | Shapes what a bounded context should do and why; thinks in capabilities and architecture | Survey where intent stands, find what blocks a capability, decide where to invest, send precise change requests (A6, E3, F1) | capability map (52), roadmap (53), open questions (20), design slice (54), design diff (35) |
| **Readiness author / question decider** | Design Review reader (current) | States readiness in the carriers and settles the open questions that hold other Specs | Review in context, see what stands before the stated next rung, work the queue, state `ready` (E4) | statement queue (46: questions by decider, waiting statements corpus-wide), the owner queue page, promotion preflight (9), Pack design (29), readiness divergence (7) |
| **Software architect** | architect (seed 00 §4) | Holds components, contexts, layers, decisions and rules | Planned against realized, decision reach, impact before change (G1, G5) | architecture map (17), crossings (32), planned against realized (43), decision map (18), architecture walk (42) |
| **Engineer / implementer** | domain engineer (seed 00 §4) | Builds against `ready` Specs, often through an agent | Trace a Spec to bindings and source, read blast radius, hand context to an agent (G1, G2, E2) | Spec guarantees (3), changed-file impact (4), build backlog (1), context bundle (36) |
| **Tester / QA** | QA / test engineer (seed 00 §4) | Writes and keeps examples, example spaces and verifier bindings | Find Specs without verifiers, read space coverage, read run evidence (G2, G4) | orphans and gaps (8), declared against enabled verifiers (10), rule coverage (34), space coverage (44), run evidence (45) |
| **Engineering leader / project lead / auditor** | auditor (seed 00 §5); leadership report (seed 00 §9) | Needs a trustworthy picture without hand-authored status | Readiness and realization side by side, decision trails (A6, G5) | roadmap needs (53), census, decision register (31), lower ladder (11) |

Letters and numbers in the jobs column are [job story](../../jtbd-stories/README.md) ids; numbers
in the last column are recipes; "seed NN §x" points into the seed's documents
([`docs/lineage/v0-design/`](../lineage/v0-design/README.md)). Each persona describes a person,
never a graph value: no Spec records who owns it, and the RUP role each row draws on is in
[11](11-rup-roles-and-artifacts.md).

The first cycles also take the pull-request reviewer, the Studio's own Intent actor ("a pull
request reviewer who holds only a link", `spec:consumers.spec-studio`), whose jobs are E3 and G1.
Its row stays in tier 2 below.

## Tier 2 — extended delivery roles

| Persona | Situation | What a reading would serve | Notes |
|---|---|---|---|
| **Business / domain analyst** | Maintains the shared domain language | Model terms, term addresses, where a term is used | Business Modeling; concept search (6), entry search (23). The seed's Pack-level shared model (seed 01 §3) made vocabulary coherence a Pack concern |
| **Requirements specifier** | Writes behavior, rules and examples for others to build | Which rules no example exercises, which values no example binds | rule coverage (34), space coverage (44) |
| **Stakeholder in a review** | Plays with a behavior to confirm expectations before work starts | Explore an example space: inputs, expected outcome class, which points have a witness | the seed's harness (seed 04 §4) served this job; today a Spec page shows a space's bound points and per-slot coverage; see [02](02-seed-experience-map.md) |
| **Pull-request reviewer** | Opens a stamped preview from a pull request | What changed in the design, what it touches, whether it is ready | diff page, blast radius; the North Star's developer half |
| **Change / configuration manager** | Keeps the change flow trustworthy | Proposals against bases, moved or incomparable scopes | proposal check (38), proposal memo (49) |
| **Operations / SRE** | Runs what was built | NFR targets, constraint Specs, what would be observed | `observed` is deferred; the evidence lens reads every row as "not tracked" |
| **Release or deployment manager** | Cuts and ships releases | What a release contains, baselines | release and baseline views wait for a reader (`spec:consumers.projections-model.roadmap-views#question.releaseReader`, trigger: the first published release) |
| **Process engineer / adoption lead** | Brings the Protocol into a team's corpus | Capability adoption, corpus rules, upgrade opportunities | capability adoption (47), rule-key proposal (48), the upgrade kit; seed 08 §9.10's adoption advice |
| **Sponsor / stakeholder** | Funds or depends on the work, rarely opens the repo | A short, honest account of where a capability stands | must not become a progress score |

## Tier 3 — niche and specialised

Each row is a candidate reading, not a commitment. Rows another home already carries say so.

| Persona | Job | Material | Gap |
|---|---|---|---|
| **Security reviewer** | Read security constraints and the architecture they cross | `constraint` Specs, crossings (32), forbidden layer pairs | a security perspective is corpus data a team writes |
| **Compliance / regulatory auditor** | Trace requirement → decision → code → verifier at a named commit | decision map (18), Spec guarantees (3), stamp | the seed's SLSA, SBOM and OTel evidence (seed 08) is not built; baseline views wait on the release question above |
| **NFR budget owner** | Watch measurable targets across a context | `constraint` Specs with targets | no measurement in the graph until `observed`; the seed's "last measured: 287 ms" stays unavailable |
| **DDD facilitator / context mapper** | Read contexts, layers and the language each context uses | roles, layers and contexts (28), architecture map (17), Model terms | context-to-term mapping is not a recipe yet |
| **BDD practitioner** | Keep examples, spaces and oracles honest | step and space contracts, witnesses, oracles; a Spec page's bound-points table and per-slot coverage (`spec:consumers.spec-studio.verification-panels#rule.coverageGrid`) | coverage of value combinations; captured in `spec:consumers.agent-surface.combination-coverage`, stated at `idea`, waiting on `spec:consumers.agent-surface.combination-coverage#question.combinationCoverage` |
| **Newcomer onboarding to a codebase** | Learn a bounded context quickly and correctly | capability map, design slice, Spec pages, bound source; a Pack's reading order; the index's task routes | a guided tour across a bounded context does not exist; seed 08 §9.10 names onboarding as an adoption wedge |
| **Technical writer** | Turn a design into outside-facing reference | slimming candidates (39) | already captured: `spec:consumers.reference-projection`, stated at `idea` |
| **Corpus curator** | Keep the corpus lean and connected | orphans (8), mention audit (22), curation report (40), slimming (39), address resolution (25) | no curator home; the seed's suggestion to declare an inferred edge (seed 03 §4.3) is closest to today's mention audit and curation report |
| **API consumer / partner team** | Read the contract two parties share | pinned declarations (24) and the declarations page, key-family register (41) | the declarations page lists by Spec; a reading per contract between two parties does not exist |
| **Due-diligence assessor** | Judge a codebase's design health from outside | census, drift alarm (2), gaps, coverage-unknown | needs a reading that names its own limits plainly |
| **Product designer** (later audience) | Connect visual designs to the behavior they serve | keyed UI entries; the seed linked Storybook, Figma and Playwright flows (seed 01 §2.10, seed 04 §5) | a later audience by product decision ([PRODUCT.md](../../PRODUCT.md)) |

## Tier 4 — ultra-specialised

Candidates, unranked. Each names one narrow recurring question and waits for a job story before it
becomes a brief. A narrow reading becomes affordable when it can be produced on demand, by one of
two routes ([05](05-specialised-and-ai-readings.md)): an operator-run `sdp q` body, lawful today
but with no Studio page; or assistant output shown to a reader, which waits on
`spec:consumers.ai-assisted-reading#question.aiPresentationBoundary`, whose provisional reading keeps
generated text outside the Studio.

- **Decision archaeologist:** how did this decision come to be, what did it supersede, what did it shape? (`supersedes` chains, decision register (31); git history, outside the graph)
- **Readiness author at scale:** many waiting statements, ordered by what rests on what (statement queue (46), dependency cycles (26))
- **Example-space analyst:** which outcome classes have no witness, which value combinations no example exercises (space coverage (44) answers per slot; combinations wait on the question in tier 3)
- **Architecture-rule author:** what a proposed rule would flag before it is adopted (architecture walk (42) as a rules file)
- **Migration lead:** progress of a structural migration by component; the seed drew this as "migration progress as a heatmap by component" (seed 05 §6)
- **Agent operator:** which context bundle, perspective and budget give an agent the right reading for a task
- **Multi-corpus portfolio lead:** the same questions across repositories; the seed listed cross-repo federation as future (seed 08 §8.6), and an exploratory commercial Studio would raise it again

## Non-human readers

- **Coding agents** read through the agent surface (`sdp q`, recipes, context bundles). Every human
  reading should hand off to an agent with the same scope and agree with what the agent surface answers.
- **CI** runs the checks and also produces material for readings: this repository's CI writes run
  evidence as CTRF records and builds, stamps and uploads the Studio preview for a pull request
  (`spec:consumers.spec-studio.sharing#rule.previewWorkflow`). A pull request's forward section is
  rendered by its author with recipe 55, not by CI; the Studio's roadmap page shows the same memo.
- **Review bots** could post graph-measured readings on a pull request.
- **Assistants** that select or compose readings are the AI option space in [05](05-specialised-and-ai-readings.md).
- **Apps** would integrate through the MCP surface: designed in, with its build deferred until a
  concrete caller establishes its boundary and contract (the MCP-deferred decision, D6,
  `spec:decisions.mcp-deferred`). Its shape is a fresh design. The seed's MCP server (seed 07 §13) served
  agents, and that job went to the agent surface (the agent front door decision, MD-22).
