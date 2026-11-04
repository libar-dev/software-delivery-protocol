# 06 — Design cycles

How the design work is sequenced, which briefs to shape first, what the repository already settles,
and which design and product questions stay open for the long horizon.

**Status.** This is design material and it confers nothing. No cycle here counts as next work, and
nothing here dates, gates or sequences delivery. The Protocol reads its next work from the roadmap
(recipe 53 over `pack:roadmap`). A cycle joins the roadmap only on the owner's word
(`spec:consumers.graph-first-planning`, `spec:protocol.roadmap-replaces-plans#rule.readsRoadmap`).
Terms the [README](README.md) flags as provisional (reading, persona, role home, object page, basis
line) stay provisional here.

## The starting point

The current Studio is the baseline. Read it as a prototype, not a target. What it teaches, and the
record every later prototype is compared with, are in [10 — Studio baseline](10-studio-baseline.md).

One finding shapes every cycle. The Studio's manual acceptance tasks (`spec:consumers.spec-studio`,
manual verification) are written for a person who holds only a link. They include the first
adopter's findability tasks. They also ask the person to name what the owner can state first, what
changed since the base, and which components are designed but not yet built. None is written from
the job of a technical product manager, a leader or a tester. Role acceptance tasks are therefore a
design output in their own right.

## Cycle plan

Every cycle follows the method in [09 — Design method](09-design-method.md). The method covers the
named task sets, the readers who take them, how each session is scored and recorded, and how
prototypes are built over the graph. Every cycle measures; no cycle leaves measurement to a later
one. A cycle ends with prototypes tested against named tasks, not with a visual design. Visual
design starts when the design system is introduced.

| Cycle | Focus | Outputs | Closes when |
|---|---|---|---|
| **0 · Baseline** | today's Studio at a stamped commit, read against the task sets on the self-hosted corpus, `examples/checkout-v1` and the first adopter's corpus | the baseline record ([10](10-studio-baseline.md)); a list of current readings, each with a keep, merge or retire hypothesis (Article 2's seventh question) | every task in the sets has a recorded outcome at a named commit |
| **1 · Foundation and tier-1 core** | the IA skeleton; the landing and arrival; role homes for the technical product manager, the decider and the architect, selected by concern rather than by person; flows *review a Pack for readiness* and *review a pull request's design change* | briefs; low-fidelity structure prototypes; role acceptance tasks paired with job stories ([01](01-roles-and-perspectives.md), [11](11-rup-roles-and-artifacts.md)); candidate words for the provisional terms | the tier-1 tasks have outcomes on the same corpora, compared with the baseline |
| **2 · Remaining tier 1 and phone** | engineer, tester and leader homes; flows *trace to verification*, *assess impact* and *work the queue*; phone review as a task design of its own, within the rule that the same pages serve a desktop and a phone (`spec:consumers.spec-studio.responsive`) | briefs, prototypes, phone task results | the same, phone tasks included |
| **3 · Object pages and hand-off** | question pages (each decision already has its Spec page); the composing panel across readings; the agent hand-off | briefs and prototypes; a map of the end-to-end change journey from [02](02-seed-experience-map.md), step by step, with the artifact and the basis each step carries | a change completes the journey in a session, from a reading to a checked proposal |
| **4 · Specialised readings and AI steps** | a few tier-3 readings (onboarding tour, example-space explorer, decision lineage); A1 prototypes measured against review tasks; A2 tried on the agent surface ([05](05-specialised-and-ai-readings.md)) | measurements for the AI capture's re-entry trigger; A2 results as separate evidence | each AI step has an outcome on a named review task, compared with the same task without it |
| **5 · Commercial surfaces (exploratory)** | desktop reading over the working tree, web team review, CI run readings; where product state may live | concept briefs only; the commercial questions below made explicit | the owner has the evidence those questions need |
| **then · Visual design** | introduce the existing UI library and design system, within the custom-elements decision (MD-42) unless a decision supersedes it | DESIGN.md, then visual work per surface | — |

- **Every cycle tests against the same sets**: the design questions in
  [Article 2](../articles/02-one-graph-many-views.md), the Studio's manual acceptance tasks and the
  new role acceptance tasks. It compares the results with the baseline.
- **Every cycle runs as an arc.** The owner's instruction opens it, and its record is its draft pull
  request. The description shows the prototypes at base and head, the task results, the rulings the
  owner made and the rulings delegated. Once a design Pack exists, it also shows Pack design
  (recipe 29) and the design diff (recipe 35) over that Pack. A cycle closes on evidence, never on a
  date.
- **Prototypes are evidence, not product.** A prototype reads the graph. Where material is missing,
  it shows the gap as a named absence and logs it in [07](07-graph-needs.md); it never hard-codes
  the missing data. Prototypes are committed on the arc's branch with the commands that made them,
  and removed before merge (`spec:protocol.roadmap-replaces-plans#rule.evidence`).
- **What the AI trigger counts.** The blocking question
  `spec:consumers.ai-assisted-reading#question.aiPresentationBoundary` re-enters when "the UX design
  pass measures that assistant selection or a generated explanation helps a named review task".
  A1 (select) is assistant selection, and A4 (explain beside) is a generated explanation. A2
  measurements meet the trigger only if the owner rules that composing a perspective counts as
  selection. An A4 prototype joins cycle 4 if the pass is to test the explanation half.
- **The commercial cycle is exploratory.** The core is and stays open source and free. A commercial
  Studio is under consideration, possibly as a desktop app, a web app and a CI/CD surface. The
  corpus records only that hosted review, shared comments and hosted previews "may later ship under
  `@libar-ai/`" (`spec:consumers.spec-studio`). Cycle 5 writes concept briefs. Where commercial
  design intent is recorded is itself one of its open questions.

## First briefs to shape

Candidates, in recommended order. Each brief names its job, its reader, the recipes the reading
shows, its basis and its hand-off. A Studio page shows a recipe's answer only when its Spec names
that recipe (`spec:consumers.spec-studio#rule.recipeAnswers`). The brief itself stays in the session
that shapes it. What lasts is its evidence on the arc and what it becomes in the corpus.

1. **The landing and arrival.** Who are you, and what do you hold? This is the doorway to role
   homes and flows: small, and high in leverage. It tests whether a new landing should replace the
   index. Today the index opens with a count summary, routes by task under `Start here`, and lists
   each Pack as a closed disclosure (`spec:consumers.spec-studio.index-page`).
2. **The technical product manager's home.** This is the strongest-fit persona. The brief tests
   whether the graph can answer "where does intent stand?" honestly.
3. **Review a Pack for readiness.** The Design Review's job as a flow. It exercises stated
   readiness, the floor reached and the delivery facts, shown apart, together with blocking
   questions and the composing panel.
4. **Review a pull request's design change.** The reviewer's job, starting from a stamped preview.
   It exercises the stamp, the diff page and impact. The seed's whole loop, from a product manager's
   reading to verified code, is cycle 3's change journey.

## Answered from the repository

This document first put these questions to the owner. The repository answers their technical half.
Each row points to the section of [08 — What the repository settles](08-what-the-repo-settles.md)
that carries the evidence. What stays open moves to the next section.

| Question | What the repository settles | Section in 08 |
|---|---|---|
| Should ownership return to the model? | A Spec names no owner: this is a stated non-goal ([vision, §5](../concept/00-vision-scope-and-mvp-boundary.md)), and the envelope's key set is closed (`spec:carrier.envelope-contract`). Ownership can return only through a decision that reopens the non-goal | ownership |
| What should the provisional terms be? | None is ratified. `role` is a ratified anchor value. "Lens" names the Studio's graph views and is an alias to avoid for perspective. "Census" names the `sdp census` projection. The Studio calls its intent element the composing panel | terminology |
| Is "AI authors the selection; the graph supplies the content" a principle? | An assistant may select existing readings; that is the provisional answer to `#aiPresentationBoundary`. An agent can write a perspective on the agent surface today. The Studio reads only two named inputs | perspectives and AI |
| May a reading derived from git history ship? | Only as caller-supplied named input beside the graph, and never as a gate. The design diff already reads a graph built at another commit, and run records carry their own commits; neither enters the graph | history |
| Where may commercial product state live? | The law says what such state may never become: graph data, a delivery fact, a rung, an approval or a recorded review. It does not say where such state may live | state |
| Which Studio pages are retired, merged or kept? | The repository says which Specs each change touches, and which changes are ordinary revisions and which need a decision | evolution |
| Do questions and decisions become object pages? | Every decision is a Spec and already has its own page. Only question pages would be new, and each would need a carrying Spec and a path | objects |
| Where does the design project itself live? | Design intent and questions belong in carriers, forward planning in the roadmap, and prototypes in arc evidence | self-hosting |

## Design questions for the long horizon

These design and product questions will be answered over months of iterative work. They are not to
be settled up front: each is answered from the evidence a cycle gathers, and the owner rules on each
once that evidence is in. This is the one register of them: [08](08-what-the-repo-settles.md),
[10](10-studio-baseline.md), [11](11-rup-roles-and-artifacts.md), [12](12-analogous-products.md)
and [`PRODUCT.md`](../../PRODUCT.md) point here. They stay here until an engineering session and the
owner give them a corpus home ([07](07-graph-needs.md#a-corpus-home-for-these-needs-a-proposal)).

### People and entry

| Question | Evidence from |
|---|---|
| Do "my work" readings justify reopening the non-goal that a Spec names no owner, and in what form: per Spec or per Pack, a section rather than an envelope key, more `decider`-style tokens, or authorship derived from a history input? Any form is weighed against the closed envelope, the stability law L9 and the workflow-tracker risk `spec:model.open-question-fields` names | cycles 1–2: role homes built by concern show what a person-scoped reading would add |
| Do role homes ship in the Protocol at all? If so, are they fixed readings composed from named recipes, or built from corpus-owned perspectives? The latter needs a third named input | cycles 1–2 |
| Does `owner`, already the default decider token in the statement queue, the roadmap and the owner queue page, become a ratified term? Does the Studio serve deciders other than `owner`? Where do `delegated` questions surface, given that the token names nobody? | cycle 2 (*work the queue*) |
| Do "decide now" and "parked until a trigger" become separate readings wherever questions appear? | cycle 2 (*work the queue*) |
| Does an explanation-first "what stands before the stated next rung" reading help a readiness author or decider decide faster than today's Pack page? | cycle 1 (*review a Pack for readiness*) |
| Which personas need intent where they write code (the IDE, the vault) rather than in the Studio? | cycle 2; cycle 5 (desktop) |

### Words

| Question | Evidence from |
|---|---|
| Do "reading" and "persona" join the glossary's guidance-only labels, or stay design words? What are role homes, the basis line and object pages called if any of them ships, given the ratified anchor `role`? Which provisional words, if any, does the owner ratify? | every cycle; the cycle-1 briefs try the words with readers |
| How are the two kinds of design session named so that neither reads as the other ([08](08-what-the-repo-settles.md#2-terminology))? | cycle 0 |

### Landing, navigation and pages

| Question | Evidence from |
|---|---|
| Does the index stay the landing page and the Packs lens, or does a new landing replace it? What must a landing do to orient a newcomer and route by delivery role, and what does it drop from today's census-first index? | cycles 0–1 |
| How does the top navigation regroup, given the order the navigation and lenses Specs fix? | cycle 1 |
| Which pages merge or retire (Article 2's seventh question), and which become parts of role homes? Candidates from [10](10-studio-baseline.md): the roadmap Pack page and the Roadmap lens, the evidence lens and runs, the two backlogs | the cycle-0 list of readings, tested in cycle 1 |
| What does search rank first (the defining Spec, the entry or the code), and do entry addresses and decision registry names become search terms? | cycle 1 (the landing and arrival) |
| How does a count state its scope, so that one concept never shows different numbers unexplained? | cycles 1–2 |
| How should the rail and panel defaults behave when one Pack holds the whole corpus, and per kind? | cycle 1 |
| Do open questions get pages of their own? Do code units, which a Spec page shows as text today? Does a reader holding an entry address get a landing? | cycle 3 |
| Does phone review get readings of its own, against the rule that the same pages serve both widths? | cycle 2 |
| Do the Markdown Design Review and the Studio stay equal in rank, as the derived-HTML decision (MD-41) holds? | cycle 3 |

### Basis and trust

| Question | Evidence from |
|---|---|
| Is a basis visible on every reading worth giving up the rule that a page set carries no commit, or should the basis stay in the stamp? What does a `file://` page or a Pack export show? How does a reading of uncommitted work state its basis? | cycle 1 (*review a pull request's design change*); cycle 5 (working tree) |
| Does a reading-scoped count of findings and absences in every header help, or does it become noise the way suspect links did ([12](12-analogous-products.md))? | cycles 1–2 |
| Does a derived "changed since the base" indicator give reviewers the value of suspect links without their noise? | cycle 1 (*review a pull request's design change*) |

### History

| Question | Evidence from |
|---|---|
| Does any reader need a history reading? Nothing about history is on the roadmap | cycle 4 (decision lineage) |
| What does a "ruled" history input mean: a decision or a capture Spec? What is its shape, which commit metadata may a page show, and where may dates appear? | cycle 4 |
| Release and baseline views stay held by `spec:consumers.projections-model.roadmap-views#question.releaseReader` | its own trigger: the first published release |

### AI-assisted reading

| Question | Evidence from |
|---|---|
| Where is the boundary for assistant-written presentation (`#aiPresentationBoundary`, decided by the owner)? Does composing a perspective (A2) count as selection? Does a generator an agent writes and git reviews (A3) need the assistant-output contract, or is it ordinary authored code? | cycle 4 measurements |
| Does the Studio accept a perspective as a third named input, or render saved corpus perspectives? | cycles 1–2 (role homes), cycle 4 |
| Does code a corpus writes to generate a reading get a publishing path, or does it stay an adopter's own script over the exported reader? | cycle 4 |
| Does "AI authors the selection; the graph supplies the content" become a principle? | cycle 4 |
| How are this design pass's measurements recorded and presented as evidence for the AI-reading trigger? | cycle 0 (the session record in [09](09-design-method.md)); cycle 4 |

### Leader, audit and RUP-shaped readings

| Question | Evidence from |
|---|---|
| Can a leader reading built from counts of named kinds, with drill-down and no percentage, earn a leader's trust? What do leaders do when no single number is offered? | cycle 2 (the leader home) |
| Will an auditor accept stamped readings, a Pack export and git history in place of a signed review record, or does a commit-keyed evidence set need a reading of its own? | cycle 4 |
| Which RUP-shaped readings come first, starting from the cheapest that need no model change ([11](11-rup-roles-and-artifacts.md#long-horizon-research-backlog))? Do stakeholder entities, a business-versus-system use-case scope, effort estimates, or risk probability and impact ever enter the model? | cycles 1–4, as the RUP roles in 11 are taken up |

### Commercial surfaces (exploratory)

| Question | Evidence from |
|---|---|
| What does the commercial line cover? The corpus names only hosted review, shared comments and hosted previews; the desktop, web and CI surfaces appear nowhere in it | cycle 5 |
| Where may product state live (review threads, saved perspectives, preferences, drafts across devices), given that the corpus owns its perspectives? Two precedents exist for state a person writes beside a projection: the composing panel's gathered intents in browser storage (`spec:consumers.spec-studio.intent-panel#rule.persist`), and the vault, which keeps a Base a person changed and never writes the `intent/` notes outside its folder (the vault owns one folder, MD-45) | cycle 5 |
| May a hosted service run user-supplied `sdp q` bodies or rules files? Neither claims a sandbox | cycle 5 |
| Which app is the concrete caller for MCP, which the MCP-deferred decision (D6) holds? | cycle 5 |
| When does a run become stale (`spec:observation.run-evidence.bound-file-freshness#question.freshness`)? | cycle 5 (CI readings) |
| How are readings of a private corpus shared, given that previews deploy to the repository's own served pages? Do editor deep links belong on a desktop surface? | cycle 5 |
| Is commercial design intent recorded in this open-source corpus or elsewhere? | cycle 5 |
| Which habits from analogous products (comments, notifications, private drafts) belong in a commercial surface, and can each stay product state without becoming delivery truth ([12](12-analogous-products.md))? | cycle 5 |

### The design project and visual design

| Question | Evidence from |
|---|---|
| Do `PRODUCT.md` and `docs/design/` stay on main as status-labelled prose that confers nothing, or live as per-arc evidence? | cycle 0: the first arc's first commit forces the choice |
| Is a corpus home wanted at all? If so, is the effort one design Pack or several, and what are they named? | cycle 0 |
| Which design system is adopted, and does it fit the custom-elements decision (MD-42) or need a superseding decision? Until then, IA patterns stay within what native disclosure and custom elements carry | visual design |
| Which accessibility conformance target applies beyond the shell's existing rules (keyboard, words beside color, reading without script)? | keyboard, no-script and phone passes from cycle 1; the target at visual design |

## How design outputs become product

Design material lives here and confers nothing. A design session edits no graph input: no carrier,
Pack or anchor. When a design decides what a projection does, an engineering session moves the
decision into a Spec through the authoring workflow (the `sdp-authoring` skill), and the Spec becomes
the authority. The path runs like this:

1. The brief names its job, reader, recipes, basis and hand-off.
2. A capture at `idea` refines the Studio's carrying Spec (`spec:consumers.spec-studio`).
3. UI entries and manual verification tasks, the role acceptance tasks among them, take it toward
   `defined`.
4. Promotion preflight (recipe 9) shows what stands before the stated next rung, and the owner
   states `ready`.
5. An implementation arc builds it.

A change to a `ready` Studio Spec, such as the landing, the navigation order, the stamp, a Spec
page's source text or what search indexes, travels as a change proposal. The proposal check
(recipe 38) checks it against its base, and the proposal memo (recipe 49) renders it for review.

Some changes need a decision. The frozen projections (Design Review, census, Mermaid, Gherkin)
change only through a decision that refines or supersedes the shipped-projections decision (MD-32).
The Studio is not frozen, but its own decisions bind it: the derived-HTML decision (MD-41), the
custom-elements decision (MD-42), the build-renders decision (MD-43) and the diagram-layout decision
(MD-44). A Studio Spec changes by ordinary revision while the design stays static, derived, rendered
at build time and framework-free. Anything else needs a decision Spec that refines or supersedes the
relevant record. Everything proposed here targets the Studio and new readings.

**Proposed corpus home (a proposal, not done).** A design Pack holding the questions above as keyed
open questions is engineering-session work for the owner to decide, set out in
[07](07-graph-needs.md#a-corpus-home-for-these-needs-a-proposal); design sessions do not build it.
