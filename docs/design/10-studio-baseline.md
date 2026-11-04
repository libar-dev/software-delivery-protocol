# 10 — Studio baseline

A page-by-page reading of today's Spec Studio, taken from one pull-request preview and read as a
prototype: what each page is for, whom it serves, what works and what does not. It is the
page-reading half of cycle 0 ([06](06-design-cycles.md)); the per-task outcomes that
[09](09-design-method.md) section 1 records have not been taken yet. This is design material, not
intended truth; where it differs from a Studio Spec under `spec:consumers.spec-studio`, the Spec
wins.

## The preview this baseline reads

- **Page set:** [the Studio preview of pull request #34](https://libar-dev.github.io/software-delivery-protocol/preview/34/index.html).
- **Basis, from its `stamp.json`:** corpus commit `35f1094d` (`35f1094dae742a673226fcb97580b887ef0c4ad1`),
  GitHub's merge of the pull request's head `6062075` into its base `480ded4`, with the same tree as
  the merge commit `f990bded` on `main`; engine `sdp 0.0.0` built from that commit; graph schema
  `0.12.0`. The build was given a base graph (the pull request's base) and CI run records, so the
  Diff and Runs pages exist.
- **Re-measured, not inherited.** `src/` and `specs/` are unchanged between the stamped commit and
  `53804437`, so each statement below about the corpus was re-derived from the live graph: each
  page's carrying Spec and rule through `g.specContext` and `g.resolveEntryAddress`, and corpus
  shape through recipes 1, 17, 20, 24, 33, 43, 46, 51 and 53. Re-run them rather than trusting this
  page; counts are left to the queries on purpose.
- **Not read yet:** slice pages (`spec:consumers.spec-studio.slice-page`), the Pack export and print
  (`spec:consumers.spec-studio.export`), the phone layout (`spec:consumers.spec-studio.responsive`),
  the composing panel's scripted behavior and the memo it hands off
  (`spec:consumers.spec-studio.intent-panel`), and watch mode
  (`spec:consumers.spec-studio.publisher.watch`). They are the next pages to read the same way.

## How to read the table

- **Stated purpose** paraphrases the carrying Spec's Intent outcome; the Spec id is where the
  exact words live.
- **Roles** are the personas of [01](01-roles-and-perspectives.md), shortened: TPM (technical
  product manager), decider (readiness author / question decider), architect, engineer, tester,
  leader (engineering leader / project lead / auditor), PR reviewer and newcomer. "Persona" is a provisional design term
  ([README](README.md)); the JTBD stories avoid personas on purpose, so each persona here is paired
  with a job rather than a profile.
- **Problems** are UX and information-architecture problems. Visual style is out of scope until
  the design system arrives.

## Page by page

| Page | Stated purpose (carrying Spec) | Job and roles served | What works | Main problems |
|---|---|---|---|---|
| [Index](https://libar-dev.github.io/software-delivery-protocol/preview/34/index.html), the landing | Say where the corpus stands, route by task, list every Pack with its members, narrow every Spec by coordinates and bindings (`spec:consumers.spec-studio.index-page`); the landing is the Packs lens (`spec:consumers.spec-studio.lenses.packs#rule.landing`) | Orientation, then a way into a Pack or a narrowed list. Leader (summary, findings), PR reviewer and TPM (Packs, "Start here"), decider (question counts, queue route), engineer and tester (binding filters); newcomer weakly | Summary sentences answer "where does it stand" fast, with explicit zero states; "Start here" routes are phrased as jobs; filters cover every coordinate, bindings, Pack and epic; Pack members sit in closed native disclosures and every row reads without script | No default narrowing: every Spec is one unpaginated row, about half of them examples interleaved by id, nearly all reading the same "ready · floor ready"; summary counts link nowhere; never names the project or says what the Studio is; the subtitle "from the reader" is engine vocabulary; Pack disclosures add weight and duplication, not visual length |
| [Search](https://libar-dev.github.io/software-delivery-protocol/preview/34/search.html) | Find a Spec, a Pack, a keyed entry or the code bound at a file by a remembered word, from any page, with no request (`spec:consumers.spec-studio.search`); one matcher with `findByConcept` (`#rule.oneMatcher`) | Jump by a word, key or file path. Engineer (files, code units), PR reviewer (coined keys, entry hits), architect, tester; newcomer only with a known word; decider weakly | The term lives in the link, so a search is shareable; coined keys and full paths land exactly; code units carry file and line, a source link and their `satisfies` target; every query says which fields it searched and why each card matched | Ranking buries the defining Spec (for "readiness floor", `spec:validation.readiness-floor` comes after examples and code units); a spaced phrase misses a hyphenated id; an entry address finds no entry, only Specs whose prose quotes it (search does not resolve addresses); short words flood with no facets; code-unit and anchor cards link nowhere; entry labels are internal paths (`rules[11]`); the embedded index makes it by far the heaviest page |
| [Glossary](https://libar-dev.github.io/software-delivery-protocol/preview/34/glossary.html) | Find any term a Spec defines, read it, open the Spec and entry that define it (`spec:consumers.spec-studio.glossary-page`); it renders no glossary document and picks neither of two definitions (`#rule.noGlossaryDocument`, `#rule.sameWordTwice`) | Look up a Model-section term. Newcomer partly, PR reviewer and decider (definitions side by side), architect (role vocabulary) | Small, scannable, with a letter index; a word two Specs define shows both, side by side; keyed terms deep-link and copy their term address | The Studio's own words (floor, rung, finding, deferral, decider, entry address, implementation binding, verifier binding) are absent, because no Model section defines them; no route to the ratified [`CONTEXT.md`](../../CONTEXT.md); most terms link to the top of a long Spec page; the defining Spec's stated rung is not shown, so a `scoped` definition reads like a `ready` one; "index" means an engine role here and the landing page elsewhere |
| [Capabilities](https://libar-dev.github.io/software-delivery-protocol/preview/34/capabilities.html) | Read an epic overview, its refinement structure and evidence, and narrow the index to its descendants, for a reviewer choosing a Spec or Pack (`spec:consumers.spec-studio.capability-map-page`, recipe 52) | How big a capability is and how it breaks down. TPM, architect, PR reviewer, newcomer; leader partly | Compact epic cards; stated rung and floor side by side on every row; rollups state their scope and refuse to sum overlapping epics; text equivalents carry every node and edge without script; "Show these Specs" narrows the index | Cards show size, not progress; binding rollups count examples and decisions in the denominator, so a mostly bound capability reads as mostly unbound; question and below-ready counts link nowhere; each epic appears four ways (drawing, its text, Mermaid source, refinement text); empty-question lines and zero kind buckets repeat on almost every row |
| [Architecture](https://libar-dev.github.io/software-delivery-protocol/preview/34/architecture.html) | See the components the code realizes and those the design plans, by bounded context and layer, with what each uses and holds (`spec:consumers.spec-studio.lenses.architecture`, with `spec:consumers.spec-studio.lenses.architecture.unit-register`) | The structure the component anchors record. Architect, engineer, newcomer (orientation to `src/`), PR reviewer; TPM only through "Designed, not built" | The uses matrix: complete, readable without script and in print; Satisfies and References kept apart; omissions shown (no component, role not stated, outside component); stable component ids; the claim word on every structural edge | With every component in the same context (recipe 17 lists each component's context), the context-by-layer grid has little to group; the text equivalent drops layer and context; "Significant units" is a bare id list; long member lists, mostly "References: None.", with no filter; anchors in test files read as orphaned engine code; no link to tests, readiness or source folder; "Designed, not built" is empty (recipe 43), so its acceptance task cannot be exercised here |
| [Tests](https://libar-dev.github.io/software-delivery-protocol/preview/34/tests.html) | For every Spec, whether a verifier is bound, which keyed rules an example exercises, which example-space values no example binds (`spec:consumers.spec-studio.lenses.tests`); bindings only, never a verdict (`#rule.bindingsOnly`) | Verification posture per non-example Spec, with file-grain run evidence. Tester, engineer, PR reviewer, leader; decider (rules no example exercises) | One line per Spec; binding existence kept apart from CI outcomes; filters match a tester's questions; rows deep-link to the verification panel; uncovered values link to the unbound example | Decision records make up most of the "without a verifier binding" rows, and there is no kind filter; "exercised" is never explained, so an example that declares no `exercises` reads as untested rules; file-wide run counts sit beside one Spec; no gap-first order; run lines repeat the runs page without linking it |
| [Evidence](https://libar-dev.github.io/software-delivery-protocol/preview/34/evidence.html) | Show which kinds of runtime evidence the Studio could show, and that none is tracked until the graph records it (`spec:consumers.spec-studio.lenses.evidence`), decided by the binding, never liveness decision (MD-7) | Say plainly what is not tracked and what would bring it in. Leader, TPM, newcomer | Short, unambiguous, invents nothing; keeping the page in the navigation makes the absence visible | A dead end: no link to runtime observation's design home (`spec:observation.runtime-overlay`, stated `idea`), to the deciding record or to the runs page (run records stay out of this lens by `#rule.runsElsewhere`, but the reader gets no route to them); "a Spec that designs this source" does not say whether one exists |
| [Runs](https://libar-dev.github.io/software-delivery-protocol/preview/34/runs.html) | Read, from a link, the test runs the build was given, the anchored test files each joins and the records that join none, each labelled external evidence (`spec:consumers.spec-studio.runs-page`); a commit is never called fresh or stale (`#rule.commitShown`) | CI results joined to test files and the Specs those anchors verify. Tester, engineer, PR reviewer (does the run match the preview?), leader | Strong honesty framing; each joined file names its test anchors and links the Specs they verify; unjoined records stay with their reason; test names read as behavior sentences | Runs are told apart only by position and times; one long, fully expanded list with no file index, per-file counts or result filter, so a failure would be hard to find; the share of records joining no anchor is never stated; unjoined rows show absolute CI paths; file headings never become source links; full commit hashes compared by eye |
| [Roadmap](https://libar-dev.github.io/software-delivery-protocol/preview/34/roadmap.html) | Show each roadmap in priority order with what to design, to state, to build and what is built, and what each entry lacks, for the owner choosing next work and a reviewer with a link (`spec:consumers.spec-studio.roadmap-page`, recipes 53 and 55) | What the next work needs, in the owner's order, plus a forward section to paste. Decider first, TPM, PR reviewer, engineer ("Build now" is the only page naming buildable Specs), leader partly | The need board answers design, state or build at a glance; the legend defines "To state" and "Built" in plain sentences; "Waiting on the owner" joins questions to entries; the copyable memo serves the pull-request convention; reads in full without script | Cards never say why an entry matters (its purpose sits inside the collapsed memo); deferred questions and their triggers appear only as raw Markdown in the memo; "nothing blocks" sits above "Blocked by" with no word on which rung each means; a question whose provisional reading records the owner's answer still reads as blocking; ids and titles mixed on one card |
| [Owner queue](https://libar-dev.github.io/software-delivery-protocol/preview/34/queue.html) | Every statement the floor allows, in the order that holds, and every open question only the owner settles, blocking first (`spec:consumers.spec-studio.owner-queue`, recipe 46 with decider `owner`) | Statements a person can make now, and the owner's questions. Decider first, TPM, PR reviewer | Answers its acceptance task directly ("can be made now"); statement rows lead with titles; provisional readings make long questions actionable; addresses link and copy | Deferral is erased: no word, no trigger, so parked questions read as blocking work; a counted question with no decider is never listed; delegated questions have no queue anywhere, though recipe 46 takes any decider; question rows show addresses, not titles; a waiting statement can invite work on a Spec whose blocking question is parked on a trigger; "round", "rests on" and "floor allows" go unexplained |
| [Open questions](https://libar-dev.github.io/software-delivery-protocol/preview/34/questions.html) | Every open question of the corpus on one page, linked to the entries it names (`spec:consumers.spec-studio.registers#rule.questionsPage`, recipe 20) | The register of unsettled design, with decider, provisional reading and trigger. Decider first, architect, PR reviewer, newcomer, TPM | The only page where deferrals, triggers and deciders all appear, so the long-horizon design agenda lives here; blocking first; "Links" point at the exact rule in question; deferral and decider filters with script | Questions open now and deferrals parked on a trigger are interleaved by id; "Decider: delegated" names nobody, and a question with no decider carries no note; no link to the roadmap entry a question blocks; no age, by design (`spec:consumers.spec-studio.shell#rule.noRecentEdits`), so long-open questions cannot show as stale; the questions open now are framed as a residue ("blocking without a trigger") |
| [Decisions](https://libar-dev.github.io/software-delivery-protocol/preview/34/decisions.html) | One row per decision: title, id, stated rung, supersession, refinement with reasons, the Specs it shapes, its questions (`spec:consumers.spec-studio.registers#rule.decisionsPage`, recipe 31) | Decision records and how they connect. Architect (what shapes what), newcomer (titles summarise the rulings), PR reviewer, leader | Titles are claim sentences, so the list alone summarises the rulings; refinement reasons make carve-outs legible; "Shapes" gives each ruling's reach | Most labelled lines read "None" (the row design requires them), burying the refinements that matter; no registry name or lookup key, so a reader holding a registry key such as "MD-22" cannot find it (few decision Specs mention one; the registry is [`DECISIONS.md`](../concept/DECISIONS.md)); id-slug order reads unsorted; no grouping by area; no rationale shown; every row reads `ready`, so the rung says nothing here |
| [Pinned declarations](https://libar-dev.github.io/software-delivery-protocol/preview/34/declarations.html) | The pinned declarations, each with the source lines that cite it, where a reader finds the test that checks one (`spec:consumers.spec-studio.registers#rule.declarationsPage`, recipes 24 and 51) | In principle, a signature and the test line that checks it; here, a catalogue of signatures. Engineer, tester, architect, PR reviewer | One place for every pinned signature, grouped by owning Spec and linked to its entry; declarations render as code | Almost every row reads "no citation recorded" (compare recipe 51's `citedDeclarations` with recipe 24's total), and the summary never says so; unlabelled, that reads as "untested", though a citation is `inferred` and confers nothing; a citation shows file and line, not the line's words (on the roadmap as `spec:consumers.spec-studio.cited-line-text`); machine keys as headings; no in-page index |
| [Design backlog](https://libar-dev.github.io/software-delivery-protocol/preview/34/backlog.html) (nav "Backlog") | The Specs designed and not yet built (`spec:consumers.spec-studio.registers#rule.backlogPage`, recipe 33) | Designed, unbuilt work. Engineer, TPM, architect, all as intended readers | Honest and small: the recipe's empty answer and its exclusions, unpadded | Empty, since no Spec states `defined`, while the build backlog (recipe 1) is not empty and no page renders it; a reader looking for buildable work reads "None." and stops, with no route onward; the bare label "Backlog" is a word `CONTEXT.md` lists to avoid; the vault offers both backlogs (`spec:consumers.obsidian-vault.bases`) |
| [Design diff](https://libar-dev.github.io/software-delivery-protocol/preview/34/diff.html) | What changed in the design between the base graph the build was given and the graph it built, down to each entry (`spec:consumers.spec-studio.diff-page`); confers nothing (`#rule.confersNothing`) | What a pull request changes in the design. PR reviewer first, decider, leader | An honest null result: a docs-and-tests pull request shows no design change, with the base named; Specs, Pack order and bindings kept apart; linked from "Start here" | The base label is doubled ("the base graph base 480ded4"); the built graph has no commit on the page, only in the scripted stamp as a full merge-commit hash; the pull request is never named; every empty section keeps its heading where one sentence would do; "Diagnostics" unexplained |
| Pack page ([`pack:spec-studio-v1`](https://libar-dev.github.io/software-delivery-protocol/preview/34/packs/spec-studio-v1.html), [`pack:roadmap`](https://libar-dev.github.io/software-delivery-protocol/preview/34/packs/roadmap.html)) | Where a Pack's design stands, member by member in reading order, on one page a reviewer scans and opens where needed (`spec:consumers.spec-studio.pack-page`); never presents a rung as approved (`#rule.holds`) | Review a Pack as one design. PR reviewer, architect, decider, engineer, leader; TPM on the roadmap Pack | Summary sentences answer the review's first questions; closed member cards carry rung, floor, questions and bindings on one line; decisions linked with their rung; the boundary shows what the set rests on and what rests on it; the roadmap Pack lists each blocking question with decider and provisional reading | Binding totals count examples and decisions without saying so; a maturity map whose members all share one cell still prints the member list and its Mermaid source; the "joined members" column changes direction between the boundary tables; the roadmap Pack and the Roadmap lens use different words for the same entry and the Pack page never links back; the Pack titled "Spec Studio" gets the product's own browser title |
| Spec page ([the Studio root](https://libar-dev.github.io/software-delivery-protocol/preview/34/specs/consumers.spec-studio.html), [an `idea` story](https://libar-dev.github.io/software-delivery-protocol/preview/34/specs/consumers.ai-assisted-reading.html), [a `ready` example](https://libar-dev.github.io/software-delivery-protocol/preview/34/specs/consumers.readiness-planner.decision-first.html)) | Everything the graph holds about one Spec on one page, in panels a person opens and closes (`spec:consumers.spec-studio.spec-page`, with `spec:consumers.spec-studio.spec-page.core` and `spec:consumers.spec-studio.verification-panels`) | Understand one Spec: intent, rules, acceptance, verifiers and runs, realizing code, shaping decisions, impact. Every role; the newcomer best through Intent | Intent (actor, problem, outcome) opens in plain language; keyed rules carry addresses and copy actions; decision text inline; an open question reads as a complete decision brief with compose actions; an example leads with its Given/When/Then; fixed "not tracked" labels; an over-budget diagram says so and falls back to text | Every panel opens by default (`spec:consumers.spec-studio.spec-page#rule.panelOrder`) and relations are restated in several forms; impact to any depth has no ranking or summary; panels that do not apply to an example still render; an example's "implementation binding: none" carries no posture note; run evidence shows the whole test file without marking this Spec's rows; exercised rule keys are text, not links; a floor clause names the per-kind evidence table without linking `spec:validation.kind-evidence` or saying what to add |

## Across pages

### The honesty language is the asset to keep

Every page keeps the epistemic line: the stated rung as a badge with the floor reached beside it
in words (`spec:consumers.spec-studio.shell#rule.rungBadge`); "implementation binding
present/none" instead of `implemented`; claim words on edges; "not tracked" for observation,
attestations, deployments and bills of materials; "external run evidence … from test files";
explicit "None." for every absence. A redesign should reuse this wording whole. Its cost shows at
corpus scale: the same reassuring phrase repeats on almost every row.

### Arrival and wayfinding

- The top navigation lists every lens and register as an equal entry
  (`spec:consumers.spec-studio.navigation#rule.topEntries`), with jargon labels ("Queue",
  "Declarations", "Evidence") and labels shorter than their page headings ("Backlog" for "Design
  backlog"). Nothing says which to open first.
- "Start here" is the best idea in the Studio, but it is partial by rule: the index's own task
  routes plus roadmap, queue, architecture and diff
  (`spec:consumers.spec-studio.index-page#rule.taskRoutes`,
  `spec:consumers.spec-studio.navigation#rule.indexRoutes`). Capabilities, Tests, Evidence, Runs,
  Questions, Decisions, Declarations, the design backlog and the Glossary have no task route.
- Lenses do not link to each other: tests to runs, architecture to tests, evidence to runs, the
  roadmap Pack page to the Roadmap lens.
- The rail lists Packs on every page and comes before the page heading. On a Spec page it lists
  every member of every Pack the Spec belongs to (`spec:consumers.spec-studio.shell#ui.leftRail`).
  The self-hosting Pack holds the whole corpus, so every Spec page leads with the whole corpus as
  links before its own content. This is the largest findability problem, and it is a design
  question for the shell Spec, not a rendering defect.
- Index and search do not hand off: the index has facets and no text term, search has a text term
  and no facets, and summary counts are not links into filters.

### Unranked lists that repeat themselves

Lists come in id or recipe order everywhere, so the few real signals (a stated rung below its
floor, a ready Spec without a verifier, a skipped test, a question open now) sit among long runs of
identical "ready · floor ready · present" rows. Several pages show the same thing in several forms:
drawing, text equivalent, Mermaid source and a table. Mermaid source and renderer notes are shown
to every reader.

### Postures that aggregate views do not apply

About half of the corpus is example Specs, and decision records are a sizeable group too. Under
the example realization posture (MD-24) and the decision readiness posture (MD-26) neither is build
work, and decisions are left out of verifier-gap signals while keeping an explicit count. Aggregate
views ignore this: the index, the capability rollups, the tests summary and Pack page totals count
them in the denominator, and their "none" reads as a gap. The Pack page explains decisions ("a decision
never needs a verifier binding"); nothing explains examples.

### One concept, several numbers and words

- **Questions** are counted differently on the index, the questions page, the owner queue, the
  roadmap and the roadmap Pack page (all questions, blocking ones, the owner's, the roadmap's). Each
  is right in its scope, and none says which scope it counts.
- **"State"** means two things. On the roadmap, "to state" means only a person's `ready` statement
  stands before the entry; in the queue, a statement is any rung the floor allows. The same entry,
  `spec:protocol.delivery-record-cleanup`, is "To design" on the roadmap and "can be made now" in
  the queue (recipes 53 and 46).
- **"Nothing blocks"** (the stated next rung, per `CONTEXT.md`) sits beside a blocking question that
  holds a higher rung, with no word on which rung each statement is about.
- **Findings** show the corpus total in the rail and the page's own scope in the header, side by
  side and unlabelled.
- **Names** mix: Packs by title in the rail and by id in filters and rows; kinds as raw literals on
  Pack cards and as named coordinates on Spec pages; ids on question and decision surfaces, titles
  on statement rows.

### The long-horizon agenda is hard to see

Most blocking questions are deferrals the owner parked on a trigger (recipe 20 separates
`deferrals` from `holds`). Only the questions page shows the deferral and its trigger. The queue
drops both, and the roadmap keeps them inside its copyable memo, so parked questions read as work
waiting now. Delegated questions have no queue, and the token names nobody. No page can show how
long a question has been open, by design: git holds history
(`spec:consumers.spec-studio.shell#rule.noRecentEdits`; the history row in [07](07-graph-needs.md)).
For design questions that will be answered over months, this is the gap that matters most.

### The basis needs the script

The build writes no stamp into its pages
(`spec:consumers.spec-studio.sharing#rule.buildWritesNoStamp`), and the stamp line appears only when
the script loads it (`spec:consumers.spec-studio.shell#ui.stampLine`). Without script, or through
`file://`, no page states what it projects. With script, the line shows a full merge-commit hash
twice and the engine version `0.0.0`, with no pull-request number and no base. The runs page then
asks the reader to compare full hashes by eye. This is the material for the basis line proposed in
[04](04-reading-model-and-ia.md), a provisional term.

### Engine and agent vocabulary on human pages

Recipe numbers open several page ledes, unlinked, and no page read here links the recipe
catalogue. Clause ids (`no-blocking-open-questions`), "node", "unit edges", "not enumerable",
"distinct descendants" and camelCase relation names reach readers unexplained. The glossary cannot
help: by `spec:consumers.spec-studio.glossary-page#rule.noGlossaryDocument` it lists only
Model-section terms, and the Studio's own vocabulary lives in `CONTEXT.md`, which no page read here
links.

### The composing panel and the page without script

The composing panel sits on every page (`spec:consumers.spec-studio.intent-panel#rule.everyPage`),
including pages that offer no composing action, where its hint points at actions that are not
there. Without script every page but search reads in full
(`spec:consumers.spec-studio.shell#rule.withoutScript`); filters hide, but their "N of N shown"
counters stay, with no control beside them.

### The Studio's own design record is split

`pack:spec-studio-v1` is the first-version record of the Studio. Its framing cites a lineage
document and says "its four lenses", while its member `spec:consumers.spec-studio.lenses` is titled
"Five lenses read the graph as Packs, capabilities, architecture, tests and evidence". The Studio
Specs added later (roadmap page, slice page, capability map page, diagram kinds) sit in
`pack:roadmaps-and-slices-v1`. No single Pack page presents the Studio as it ships. A design
session records this and edits no Pack: regrouping the Studio's Specs, like a corpus home for the
design project, is a proposal for an engineering session and the owner.

## Role coverage

The job stories below are illustrative design material, not entries of `jtbd-stories/`;
[01](01-roles-and-perspectives.md) links each persona to its job-story ids.

| Persona | Job | Best page today | What is missing |
|---|---|---|---|
| Technical product manager | When I survey a capability, I want to see how far its intent stands, so I can decide where to invest | Capabilities, Roadmap | progress rather than size; one line on where a capability stands |
| Readiness author / question decider | When statements and questions wait on me, I want them in the order that frees most, so I can settle them first | Owner queue, Open questions, Roadmap | decide-now apart from parked-until-trigger; delegated questions anywhere |
| Software architect | When a change touches structure, I want components, uses and the decisions that shape them, so I can judge its reach | Architecture, Decisions | links from components to tests and readiness; decisions findable by registry name |
| Engineer / implementer | When I pick work, I want the buildable Specs and their bound code, so I can start | Roadmap "Build now", Search | a build-backlog page (recipe 1) |
| Tester / QA | When I check verification, I want the real gaps first, so I can close them | Tests, Runs | gap-first order; decisions out of the gap count; failures findable in run lists |
| Engineering leader / project lead / auditor | When I report, I want a picture nobody wrote by hand, so I can trust it | Index summary, Evidence | change over time (git holds it, by design); who owns what (no graph value, by design) |
| Pull-request reviewer | When I open a preview link, I want to know what changed and on which commits, so I can review it | Design diff, Pack page | the pull request and both commits named in words on the page |
| Newcomer | When I meet the project, I want to know what it is and what its words mean, so I can find my way | Spec page Intent, decision titles | a landing that names the project and the Studio; a glossary covering the Studio's own words |

## Drift the repository answers

These are technical disagreements between a Studio Spec and its code or wiring, answered from the
repository rather than by design. They are recorded for an engineering session, which fixes the
stale side deliberately; this document changes nothing.

1. The top navigation's Packs entry should link to the index's Packs section
   (`spec:consumers.spec-studio.shell#ui.topNavigation`); the page frame
   (`src/projections/studio/pages/frame.ts`) links the top of the index.
2. A finding with a file and no line never becomes a source link, because the source mark in
   `src/projections/studio/pages/html.ts` needs both, although the source template's `{line}` is
   optional (`spec:consumers.spec-studio.sharing#design.sourceTemplate`).
3. Count wording: index rows read "N open, M blocking questions" as two totals with a broken plural
   (`index-page.ts`), and plurals break at one elsewhere ("1 verifiers", "1 unit edges").
4. A Pack titled "Spec Studio" gets the product's own browser title, from the title rule in
   `frame.ts`.
5. The diff page doubles its base label: the preview workflow passes `base <short commit>`
   (`.github/workflows/studio-preview.yml`) and the page writes "the base graph" before it.
6. Joined test-file headings on the runs page carry a copy action and no source mark (`run-rows.ts`),
   so they never link, even with a stamp.

## What this baseline feeds

- **The design cycles.** It gives [06](06-design-cycles.md)'s question "which current Studio pages
  are retired, merged or kept" a page-by-page starting point, and the jobs in the tables are the
  tasks cycle prototypes are measured against.
- **The AI reading trigger.** `spec:consumers.ai-assisted-reading#question.aiPresentationBoundary`
  (stated `idea`, owner, deferred) opens when "the UX design pass measures that assistant selection
  or a generated explanation helps a named review task". The jobs above are candidate named review
  tasks. How such a measurement is recorded is an open question in
  [06](06-design-cycles.md#ai-assisted-reading).
- **Graph needs** this baseline found (who acts on a `delegated` question, a route from a
  decision's registry name to its Spec, question age) are logged in [07](07-graph-needs.md#log).
- **A long-horizon research backlog**, to be worked across design cycles rather than settled now:
  - What a landing needs to orient a newcomer and route by role, and what it drops from today's
    census-first index.
  - Whether "decide now" and "parked until a trigger" become separate readings wherever questions
    appear, and where delegated questions surface.
  - What search ranks first (the defining Spec, the entry or the code), and whether entry addresses
    and registry names become search terms.
  - How a count states its scope, so one concept never shows different numbers unexplained.
  - How the rail and panel defaults should behave when one Pack holds the whole corpus, and per kind.
  - Which pages stay pages, which become parts of role homes (a provisional term), and which merge:
    the roadmap Pack page and the Roadmap lens, the evidence lens and runs, the two backlogs.

  These questions are carried in [06](06-design-cycles.md#design-questions-for-the-long-horizon).

  A decision on any of these lands as a Studio Spec change through the authoring workflow, and the
  Spec wins. The shipped projections stay frozen (MD-32) for the Design Review, census, Mermaid and
  Gherkin; the Studio is not among them.
- **Commercial surfaces.** The page set read here is the open-source static Studio. A commercial
  Studio (desktop app, web app, CI/CD surface) is under consideration and exploratory
  ([04](04-reading-model-and-ia.md)); this baseline is its starting point too.
