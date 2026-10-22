## The next work, from the roadmap

Roadmap: The Protocol's roadmap `pack:roadmap`

The Protocol's next work, first entry first. The order is a preference: it dates, gates and sequences nothing, and what each entry still needs is read from the graph each time. Until the roadmap priority decision is ratified and its manifest field built, this is an ordinary Pack, and its order is the proposed priority only because this note says so.

First come the lead features of the roadmaps and slices arc, whose other Specs are in that arc's Pack. Then the two steps a reader of the Studio's pages could not take, the words of a test line that checks a declaration and an outside register's entries, and then the composed-intent model the build backlog holds. What the first adopter's mass update asks for joins when the owner selects it; a capture landing adds nothing here. An entry leaves by an edit to this manifest once its selected work is complete or no longer belongs among the next work.

This Pack's order is reading order, not a stated priority.

### To design

| Place | Entry | Next | Why now |
| --- | --- | --- | --- |
| 2 | The capability map reads every epic and its refinement descendants `spec:consumers.capability-map` | itself `defined` → `ready`, held by typed-dependency-targets-are-defined (`spec:decisions.epics-of-any-kind`); blocked by `spec:decisions.epics-of-any-kind#question.epicKinds`; decided by `spec:decisions.epics-of-any-kind` (scoped) | An altitude filter gives a flat list and Pack membership does not explain refinement. Waited on by 4. |
| 7 | A pinned declaration shows the words of each test line that cites it `spec:consumers.spec-studio.cited-line-text` | itself `scoped` → `defined`, held by no-blocking-open-questions; blocked by `spec:consumers.spec-studio.cited-line-text#question.lineText` | The declarations page names each citing line by file and line only, so the reader leaves the page to read it, and has no route at all when the page set carries no source link. |
| 8 | An outside register is a named Studio input, so a cited token links to its entry `spec:consumers.spec-studio.register-input` | itself `scoped` → `defined`, held by no-blocking-open-questions; blocked by `spec:consumers.spec-studio.register-input#question.registerEntry`, `spec:consumers.spec-studio.register-input#question.inputForm` | A cited token reads as bare text on every page, and the register that defines it is neither linked nor shown. |

### To state

| Place | Entry | Earlier waiting statements | Why now |
| --- | --- | --- | --- |
| 1 | A roadmap orders the next bodies of work, and the graph says what each still needs `spec:consumers.roadmap` | in this entry `spec:decisions.roadmap-priority`, `spec:consumers.roadmap` | Priority lives in prose, in each pull request's forward section and in the plan files, which the graph cannot read and which go stale as work lands. Waited on by 3. |
| 3 | A slice reads a Pack as one design, with the architecture it touches and what each member needs next `spec:consumers.design-slice` | No preceding waiting statement in the statement queue. | The Pack page reads member by member, so a reviewer assembles the dependency order, the touched architecture and the open decisions by hand before judging the design as a whole. Waited on by 3. |
| 4 | The Studio chooses diagram kinds from graph values `spec:consumers.spec-studio.diagram-kinds` | in this entry `spec:consumers.spec-studio.diagram-kinds`; on the roadmap `spec:consumers.design-slice` (place 3) | Choose useful drawings from graph values, keep their labels readable on first view, and offer source a reader can copy without changing the shipped Mermaid projection. Waited on by 2. |
| 5 | The engine's accepted set covers its significant abstractions and only those `spec:protocol.significant-units-review` | 1 outside the roadmap | Keep the accepted set focused on the engine's significant contracts, decisions and stages, with meaningful roles and architectural uses, and exclude units anchored only for coverage. |
| 6 | The Protocol reads its next work from its roadmap, and its plan files are history `spec:protocol.roadmap-replaces-plans` | in this entry `spec:decisions.roadmap-over-plans`; on the roadmap `spec:decisions.roadmap-priority` (place 1), `spec:consumers.roadmap` (place 1), `spec:consumers.roadmap.memo` (place 1) | The handbook points every session at the newest plan file and keeps a status line for each, and a gate requires both, so forward planning lives in prose beside the graph that already holds the arc's intent. |

### To build

| Place | Entry | Why now | Rests on |
| --- | --- | --- | --- |
| 9 | Views compose scoped intent instead of patching canonical source `spec:consumers.edit-model` | Let a view frame a requested change without giving derived surfaces a direct write path to canonical source. Waited on by 1. | nothing unbuilt |

### Waiting on the owner

- `spec:decisions.epics-of-any-kind#question.epicKinds` (blocking), place 2: Is a capability epic any Spec at epic altitude, or only a behavior Spec?
- `spec:consumers.design-slice#question.sliceTerm`, place 3: Does `design slice` join the glossary's guidance-only labels beside design pass, design diff and design backlog, so the word names a recipe's answer and is never read as the refused saved AI slice?
- `spec:protocol.significant-units-review#question.acceptedRoster`, place 5: Which proposed anchor and dependency changes does the owner accept after reading the annotation review?
- `spec:protocol.significant-units-review#question.notationBoundary`, place 5: Declaring the example-space decoder's real imports within notation makes graph, notation and validate a uses cycle. Should the decoder join the reader component, leaving notation a leaf codec?
- `spec:consumers.spec-studio.cited-line-text#question.lineText` (blocking), place 7: May the Studio show source text the graph does not hold, and if so is it recorded in the graph beside the citation or read as a named input?
- State `spec:consumers.design-slice`: it states `defined` and its floor allows `ready`; place 3
- State `spec:consumers.spec-studio.diagram-kinds`: it states `defined` and its floor allows `ready`; place 4
- State `spec:decisions.roadmap-priority`: it states `defined` and its floor allows `ready`; place 1
- State `spec:consumers.roadmap`: it states `defined` and its floor allows `ready`; place 1
- State `spec:consumers.spec-studio.diagram-kinds.capability-tree`: it states `defined` and its floor allows `ready`; place 4
- State `spec:consumers.spec-studio.diagram-kinds.dependency`: it states `defined` and its floor allows `ready`; place 4
- State `spec:consumers.spec-studio.diagram-kinds.maturity-picture`: it states `defined` and its floor allows `ready`; place 4
- State `spec:consumers.spec-studio.diagram-kinds.mermaid-source`: it states `defined` and its floor allows `ready`; place 4
- State `spec:consumers.spec-studio.diagram-kinds.requirement-trace`: it states `defined` and its floor allows `ready`; place 4
- State `spec:consumers.spec-studio.diagram-kinds.scoped-architecture`: it states `defined` and its floor allows `ready`; place 4
- State `spec:decisions.roadmap-over-plans`: it states `defined` and its floor allows `ready`; place 6
- State `spec:protocol.significant-units-review`: it states `defined` and its floor allows `ready`; place 5
- State `spec:consumers.roadmap.memo`: it states `defined` and its floor allows `ready`; place 1
- State `spec:protocol.roadmap-replaces-plans`: it states `defined` and its floor allows `ready`; place 6

### Deferred, with their triggers

- `spec:carrier.sdp-import.feature-adapter#question.featureAdapter`: Which bare .feature constructs can an import adapter preserve honestly? Trigger: an adopter migrates a gen-1 `.feature` corpus into the Protocol
- `spec:consumers.impact-graph.symbol-reach#question.symbolIdentity`: Which language-neutral identity and extraction boundary can support exhaustive symbol reach without freezing a single compiler's representation into the Protocol? Trigger: a reader needs symbol-level reach that file-level imports and curated anchors cannot give
- `spec:consumers.projections-model.roadmap-views#question.releaseReader`: Does a reader need release or baseline views that the roadmap, the recipes and git tags do not serve? Trigger: a named reader with that need, such as the package's first published release, and a way to measure it inside the arc that builds the views
- `spec:consumers.reference-projection#question.namedOutsideReader`: Does a human reader outside the repository need a reference projection the four shipped roots do not serve? The taxonomy row is not that reader. Trigger: a named consumer outside the repository, with a way to measure that demand inside the arc that builds the projection
- `spec:consumers.structural-mermaid#question.namedStructuralReader`: Does a reader need diagrams rooted at code units, which census tables and Spec-rooted one-hop Mermaid do not serve? Trigger: a named reader with that need, plus a decision that refines `spec:decisions.shipped-projections-frozen` for the affected Mermaid rendering or supersedes that ruling whole
- `spec:observation.runtime-overlay#question.observationIdentity`: Which external observation identity and freshness boundary is small enough for the graph while still supporting an honest `observed` delivery fact? Trigger: An adopter needs runtime measurements linked to measurable Spec targets and can supply an observation identity and freshness policy for review.
