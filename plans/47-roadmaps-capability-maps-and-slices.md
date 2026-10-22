# Plan 47. Roadmaps, capability maps and design slices

> **Status:** DRAFTED on `feature/roadmap-and-slices-v0`, from `main` at `da4b141`, the merge of
> PR 35. The design wave is done and reviewed; the build waits for the owner's go. A thin
> pointer: the arc's intent is `pack:roadmaps-and-slices-v1`
> (`specs/roadmaps-and-slices.pack.sdp.md`), and readiness, backlog and open questions are read
> from the graph (recipes 1, 9, 11, 20, 29, 33), never from this file. If this file and the graph
> disagree, the graph wins.

## Why

The owner asked for one well-rounded PR on how a corpus reads where it stands and what comes next:

1. Epics. The Protocol's corpus stated one epic over 106 features and 298 stories, and no view drew
   refinement, so filtering by altitude showed one epic and a flat list.
2. A roadmap with priority, tied to the PR descriptions: what to design next and what to build
   next, in order. The planning truths decision (MD-33) refuses recorded work order as graph
   structure, and the roadmap views capture waited for a named reader. The owner is that reader.
3. More diagram kinds, legible at desktop width, and an annotation review that leaves a curated
   register of the engine's significant patterns and abstractions, never a generated inventory.
4. Architectural slices: features that must be reviewed together, read as one design.
5. Plans become the roadmap: forward planning read from the graph, `plans/` frozen as history.
6. Housekeeping the owner adds while reviewing the Studio.

The owner's direction for the arc: set a solid example of each aspect; the roadmap holds enough
work for the next few PRs, updated as work lands, never every feature; the annotation review is
as thorough as possible and its result curated.

## The design wave

Five lanes, each designed by one model family, reviewed by another, and answered by the first,
run as Relay jobs and Claude agents through one Workflow. Every review finding was fixed or
rebutted with a reason; the records are under `reviews/plan47-design/` (briefs, designs, reviews,
answers), with `reviews/plan47-annotation-review.md` and
`reviews/plan47-epics-integration-proposals.md`. Prototypes of every new page and drawing, on the
Protocol's corpus and on a copy of libar-platform at `b038bd4`, are under
`reviews/assets/plan47-prototypes/`.

| Lane | Designed by, reviewed by | Carrying Specs |
| --- | --- | --- |
| A annotations | GPT-6.1-Sol; Opus 5.5 and GPT-6-Astra | `spec:protocol.significant-units-review`, `spec:protocol.role-vocabulary`, `spec:consumers.spec-studio.lenses.architecture.unit-register` |
| E epics | GPT-6-Astra; Opus 5.5 | `spec:consumers.capability-map`, `spec:consumers.spec-studio.capability-map-page`, `spec:protocol.capability-epics`, `spec:extraction.executable-examples`, `spec:decisions.epics-of-any-kind` |
| G diagrams | GPT-6.1-Sol; Opus 5.5 | `spec:consumers.spec-studio.diagram-kinds` and its eight children |
| S slices | Opus 5.5; GPT-6.1-Sol | `spec:consumers.design-slice`, `spec:consumers.spec-studio.slice-page` |
| R roadmap and plans | Opus 5.5; GPT-6-Astra | `spec:decisions.roadmap-priority`, `spec:consumers.roadmap` with its page and memo, `spec:decisions.roadmap-over-plans`, `spec:protocol.roadmap-replaces-plans`, `pack:roadmap` |

Recipe numbers: 52 the capability map, 53 the roadmap, 54 the design slice, 55 the roadmap memo.

## Added, dropped and reshaped against the starting list

| Change | Why |
| --- | --- |
| Added: two captures from PR 35's forward lanes (the cited line's words, an outside register as a Studio input) | The first roadmap needs real upcoming work beyond this arc |
| Added: a ninth epic, executable examples | The runner and the contracts each own a narrower outcome; no Spec stated the capability |
| Added: a decision on epics of any kind | The glossary limits the capability map to behavior Specs, while three hubs are model or rule Specs; broadening a ratified term is the owner's |
| Added: a "to state" step on the roadmap, between to design and to build | A Spec whose floor allows `ready` waits only for a person's statement, which is neither design nor build |
| Added: the roadmap memo (recipe 55) | Ties the roadmap to the PR description's forward section, as the owner asked |
| Added: a significant-units panel on the architecture page | The curated register needs a reading place a contributor opens |
| Added: edge routing around boxes, Mermaid source to copy, a requirement drawing on the Spec page | PR 35's forward lane D, the owner's Mermaid ask, and a trace reading the Spec page lacked |
| Reshaped: the trace graph | It is already built, one hop, on every Spec page; what was missing is a multi-hop dependency drawing over a Pack, slice or roadmap |
| Reshaped: a slice is a reading, never an artifact | A Pack, a Pack narrowed to members, or an ordered list of Specs, composed on each run; no new grouping |
| Reshaped: the roadmap's split is derived | Only the order is authored; to design, to state, to build and built are read from the graph each time |
| Dropped: sequence views from flow entries | A flow is one prose line; the graph holds no participants or message order, and drawing one would infer from prose. Re-entry: a carrier grammar for flow steps |
| Dropped: state, Gantt, journey and similar Mermaid kinds | No honest data (states, dates, journeys); each is named with its trigger in the diagram catalog |
| Deferred: a class-style view of roles and uses | Waits for the role vocabulary to settle and a reader to ask |

## Rulings made on the owner's delegation

The executing thread's, and each lane's, after review; each awaits the owner's review.

| Ruling | Carrying entry |
| --- | --- |
| A significant unit owns a contract or responsibility a designer must understand; export status or import rank alone never qualifies | `spec:protocol.significant-units-review#rule.significantAbstractions` |
| Mechanical wrappers, forwarding barrels, empty registrations and formatting helpers stay bare | `spec:protocol.significant-units-review#rule.curatedBoundary` |
| A component `uses` needs a direct value or type import; anchor-authoring imports and unused re-exports confer none | `spec:protocol.significant-units-review#rule.dependencyEvidence` |
| The role vocabulary is a Model of the corpus's own words, read by reviewers, checked by no validator | `spec:protocol.role-vocabulary` |
| Nine epics: seven hubs enriched in place, executable examples new, self-hosting kept; every Spec is reached and every `ready` floor kept | `spec:protocol.capability-epics` |
| The capability map keeps every parent, counts distinct descendants, includes examples and decisions, and answers a summary by default | `spec:consumers.capability-map` |
| Capabilities is a lens after Packs, and the index narrows by epic | `spec:consumers.spec-studio.capability-map-page` |
| Labels lead with the title at fourteen pixels, ids shorten with a marked elision, a drawing keeps its natural size within an 880-pixel budget and scrolls inside its figure | `spec:consumers.spec-studio.diagram-kinds.legibility` |
| Edges route around boxes with distinct ports and lanes, deterministically; the search is the build's | `spec:consumers.spec-studio.diagram-kinds.edge-routing` |
| Mermaid source is selectable text copied by the existing copy element; it needs no decision refining MD-44 or MD-32 | `spec:consumers.spec-studio.diagram-kinds.mermaid-source` |
| The maturity map is a grid of counts with member marks, never a score | `spec:consumers.spec-studio.diagram-kinds.maturity-picture` |
| The design slice owns depth and rests-on; drawings consume its answer; a relation that orders nothing is drawn apart | `spec:consumers.design-slice#rule.restsOn`, `spec:consumers.spec-studio.diagram-kinds.dependency` |
| An example folds into its parent only when nothing is lost, and folding lends the parent nothing | `spec:consumers.design-slice#rule.examplesFold` |
| A planned component is a design row of its own, never merged with the anchored component | `spec:consumers.design-slice#rule.componentDesigns` |
| A roadmap entry's scope is its refinement subtree; its step is the first open one among its work, and each part that holds it is named | `spec:consumers.roadmap#rule.entryLane`, `#rule.workRows` |
| Waiting statements keep the statement queue's order across the whole roadmap | `spec:consumers.roadmap#rule.waiting` |
| One living roadmap; an entry joins on the owner's word and leaves by a manifest edit | `spec:protocol.roadmap-replaces-plans#rule.oneRoadmap` |
| The epic-kind decision lives in the decisions family, `spec:decisions.epics-of-any-kind` | the executing thread, at integration |

## Owner's decisions

| Decision | Recommendation | Carrying Spec |
| --- | --- | --- |
| Where priority lives | An optional Pack manifest field, `order: priority`, whose member order is advisory priority; no relation, no date, no gate (confidence 4 of 5) | `spec:decisions.roadmap-priority` |
| Retiring `plans/` | Freeze `plans/` at plan 47; the handbook names `pack:roadmap` and recipe 53; the gate checks the roadmap Pack instead of a current plan; an arc's record is `reviews/<pack>-record.md` until its first push, then its draft PR (4 of 5; the plan-number ceiling check 3 of 5) | `spec:decisions.roadmap-over-plans` |
| Epics of any kind | Any Spec at epic altitude is an epic, keeping its kind; broaden the glossary row (high) | `spec:decisions.epics-of-any-kind` |
| The engine's accepted set | Accept the annotation review's change table: 14 additions, 11 merges, 1 drop, role fixes, 3 component uses; the decoder moves to the reader component (high; the decoder medium) | `spec:protocol.significant-units-review` |
| Words | roadmap; the roadmap entry's step (lane collides with a PR's lanes; recommend "need"); "to state"; "design slice" as a guidance-only label | `CONTEXT.md` |
| Release and baseline views | Stay deferred; trigger: the first published release | `spec:consumers.projections-model.roadmap-views` |

## Proposed build waves, after the owner's go

1. **Foundation**, in parallel: the `order: priority` field and the design diff's order change;
   the diagram core (labels, routing, Mermaid source, the copy element's `for`); the accepted
   roster applied to the anchors with the oracle; recipes 52, 53 and 55, and 54.
2. **Pages**, in parallel: the capabilities lens and the epic filter; the slice page with the
   dependency and scoped architecture drawings; the roadmap page and its navigation; the maturity
   map, the requirement drawing and the significant-units panel.
3. **The switch and the close**: the handbook's roadmap pointer, the gate's roadmap check, the
   skills (design rounds, curation, roadmap), the glossary and registry rows, the upgrade guide's
   epics section, `ready` statements, acceptance on both corpora, screenshots and the PR.

## Working rules

- Commit after each coherent unit and its gate; never `git stash`; never touch `.omo/`.
- Before every push, run CI's route in a fresh clone on Node 20 and npm 10: `npm ci
  --ignore-scripts`, `npm run check`, `npm run check:git-install`.
- Never merge to `main`; libar-platform is read through a copy and never edited.
