Lane G's review is answered. All 21 findings are fixed in the design, its prototypes, or the exact integration edits below. Nine Specs still state `defined`; none states `ready`. Product code and the protected files are unchanged.

Validation reports zero errors and exactly the existing `honesty/gaps` warning on `spec:model.spec-sections`. The refreshed evidence retains the Studio rail, uses the slice and capability answers, and checks routes, ports and labels independently. The answer commit is `8af6e9876e5a978f4ccd5c2fd62934a1ba80c574` on `p47/g-diagrams`, after the reviewed `1d7b3c9`, based on `44e62ef`.

## 1. Specs and measured floors

All ids in this table have the prefix `spec:consumers.spec-studio.diagram-kinds`. Recipe 9 was rerun against this lane's current graph.

| Spec | Stated rung | Floor reached | Hold above the floor |
| --- | --- | --- | --- |
| Parent | defined | ready | None |
| `.dependency` | defined | defined | `spec:consumers.design-slice` remains idea in this isolated lane |
| `.capability-tree` | defined | defined | `spec:consumers.capability-map` remains idea here |
| `.scoped-architecture` | defined | defined | `spec:consumers.design-slice` remains idea here |
| `.maturity-picture` | defined | ready | None |
| `.requirement-trace` | defined | ready | None |
| `.legibility` | defined | ready | None |
| `.edge-routing` | defined | ready | None |
| `.mermaid-source` | defined | ready | None |

The three holds are `typed-dependency-targets-are-defined`. E's and S's carriers were read through their graphs but were not copied into G. The shared legibility and routing children now refine `spec:consumers.spec-studio.diagrams` directly. The maturity child no longer depends on the ready maturity-map Spec. Existing ids remain stable; the displayed names are "refinement drawing" and "maturity map".

The catalog still covers the reviewed Mermaid registry, including aliases, diagnostics and additional diagram families. Its class row now defers an honest role-and-uses view until the role vocabulary settles and a reader needs it. Its kanban row names the roadmap page's categorical board as the existing equivalent.

## 2. Rulings made on delegation

These rulings await the owner's review. Entry addresses below use the table's prefix.

| Ruling | Meaning | Carrying entry |
| --- | --- | --- |
| Select useful forms | Keep dependency, refinement, scoped architecture, maturity and requirement readings; a Spec page's requirement drawing replaces realization | Parent `#rule.drawnKinds`; `.requirement-trace#design.placement` |
| Reader owns dependency meaning | S supplies depth starting at 1, cycles and the four typed relations, including its refinement exception; layout computes none of them | `.dependency#rule.depth`, `#rule.declaredOnly` |
| Preserve members before context | Count refining examples on parents; fold boundary groups before member bands, retaining holding targets and targets below defined | `.dependency#rule.examplesInParent`, `#rule.fold` |
| Preserve repeated refinement | Expand the first visit and link later repeat boxes to it; children stay grouped by their placement parent | `.capability-tree#rule.multipleParents`, `#design.layout` |
| Slice owns architecture reach | Draw supplied touched components and uses, including reach through what the slice rests on; resolve no unit in layout | `.scoped-architecture#rule.scopeInput`, `#rule.boundary` |
| Keep the Studio column | Use an 880-pixel box-layout budget, title-first labels and marked id elision; desktop SVG stays natural size, phone SVG keeps the existing fit rule | `.legibility#rule.firstView`, `#rule.titleFirst`, `#design.widthBudget`, `#design.shortId` |
| Make arrows distinguishable | Distinct ports and 8-pixel lanes, no shared collinear segments or overlapping labels; homogeneous uses needs one legend | `.edge-routing#rule.ports`, `#rule.labels`, `#design.cost` |
| Leave routing mechanics to the build | Determinism, obstacles, bounds and explicit failure are promises; search weights and grid choices are implementation | `.edge-routing#rule.routes`, `#design.searchBound` |
| Draw maturity as counts | Faint empty cells; exact counts and member marks in populated cells; no score or completion percentage | `.maturity-picture#rule.discreteCells`, `#rule.noScore` |
| Reuse copying | Source is selectable text enhanced by `sdp-copy`; no new custom element or decision record | `.mermaid-source#rule.copy`, `#design.sourceElement`, `#design.sourceEscaping` |

The Mermaid-source ruling still changes neither the renderer decision, MD-44, nor the frozen-projections decision, MD-32. It needs no decision refining either one. Unsupported relations produce a flowchart export with the exact reason, rather than being renamed to fit requirement syntax.

## 3. Decisions for the owner

This lane adds no owner-only decision. The owner reviews the delegated rulings above; the executing thread proposes readiness statements after lane integration, and the build still waits for the owner's go. Priority and retiring plans remain in R's carrying decision Specs.

Confidence is high in the input contracts, column measurements, categorical maturity map and reuse of `sdp-copy`. Confidence in production routing remains moderate until the build measures adversarial layouts and its finite search budget. The prototypes demonstrate these inputs, not universal routing success.

## 4. Prototypes and measurements

Evidence lives in [G-diagrams](/tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/README.md). `prototype.mjs` and `router-probe.mjs` render it. `refresh-answers.mjs` queries the two read-only base corpora through the copied E/S reader probes; saved `*-map-answer.json` and `*-slice-answer.json` make rendering repeatable. Protocol inputs are from `44e62ef`; platform inputs are from `b038bd4`.

| View | HTML files in that directory | What changed |
| --- | --- | --- |
| Dependencies | `protocol-after-dependency.html`, `platform-after-dependency.html` | Supplied depth, real member boxes, parent example counts, boundary-first folds |
| Refinement | `protocol-after-capability.html`, `platform-after-capability.html` | First-visit repeats and separate sibling groups |
| Scoped architecture | `protocol-after-scoped-architecture.html`, `platform-after-scoped-architecture.html` | Supplied components, reach reasons and uses; no layout membership join |
| Maturity map | `protocol-after-maturity.html`, `platform-after-maturity.html` | An 872-pixel matrix with member marks and faint empty cells |
| Requirement traceability | `protocol-after-requirement.html`, `platform-after-requirement.html` | Explicit Spec-page set and truthful source fallback reasons |
| Existing architecture | `protocol-after-architecture.html`, `platform-after-architecture.html` | Readable titles, member counts, distinct routes, one uses legend |
| Widest trace | `protocol-after-trace.html`, `platform-after-trace.html` | Readable titles and elided ids, with the actual Spec-panel padding |

Each row has `<corpus>-after-<view>-1280.png`, `-1440.png` and `-390.png`. Architecture, trace and maturity retain before pages and desktop captures. `protocol-after.html` and `platform-after.html` collect the views. `synthetic-plans.html` demonstrates planned versus anchored structure; `synthetic-requirement.html` demonstrates the supported requirement syntax and punctuation. Each synthetic page has a 1440-pixel screenshot and states that it asserts no corpus fact.

The base measurements remain reproducible in `baseline-live-*.json`: architecture SVG widths were 1413 and 1770 pixels, and the widest traces were 1686. Architecture labels fell to 7.75/8.15 pixels in the Protocol and 6.19/6.51 in the platform at 1280/1440. Trace labels fell to 6.30/6.64 pixels. A wider figure alone cannot solve that.

The revised shell retains its 288-pixel rail. Architecture figures measure 913/960 pixels; Spec-panel figures measure 885.4/932.4. Both trace SVGs and the Protocol architecture are 880 pixels wide and start with 14-pixel titles and 12-pixel ids. The platform architecture is 1600 pixels and scrolls locally; routing gutters widen the Protocol dependency drawing to 1136. The 872-pixel maturity map fits. Fourteen phone measurements show no page exceeding 390 pixels. Phone diagrams scale under the existing responsive contract.

The independent artifact audit checks 16 standalone drawings and 482 routes. It reports zero node or band-label collisions, shared collinear segments, reused ports, overlapping edge labels, routes through labels, duplicate HTML ids or omitted intended drawings. It also checks the punctuation regression. `audit-results.json`, `routing-results.json` and `metrics-*.json` hold the artifact measurements. Re-rendering the saved inputs produces identical output bytes. Desktop and phone screenshots were inspected; the maturity page now exposes only populated member lists.

## 5. Exact proposed edits outside this lane's files

Apply ready-contract changes with implementation and verifiers, after integration and the owner's build go. No ready Spec is edited in this design pass.

In `specs/roadmaps-and-slices.pack.sdp.md`, after the existing diagram-kinds member, insert:

```yaml
  - spec:consumers.spec-studio.diagram-kinds.legibility
  - spec:consumers.spec-studio.diagram-kinds.edge-routing
  - spec:consumers.spec-studio.diagram-kinds.mermaid-source
  - spec:consumers.spec-studio.diagram-kinds.dependency
  - spec:consumers.spec-studio.diagram-kinds.capability-tree
  - spec:consumers.spec-studio.diagram-kinds.scoped-architecture
  - spec:consumers.spec-studio.diagram-kinds.maturity-picture
  - spec:consumers.spec-studio.diagram-kinds.requirement-trace
```

In `specs/consumers/spec-studio.diagrams.sdp.md`, replace the narrative paragraph with:

```md
Every Studio diagram is laid out in the engine when the page set is built, so a page draws it with no script and the same inputs draw the same bytes. The architecture grid, component members and one-hop trace retain their readings; the Spec page's requirement drawing replaces realization, and other pages name their supplied drawing answers. Words carry every reading the picture shows, and its text equivalent states every box and edge.
```

Replace `#rule.layoutInputs` and `#rule.panZoomOnly` with:

```md
- [#layoutInputs] A layout reads only the boxes, each with its id, words and supplied grouping, and edges, each with its two ends, exact kind and claim, optional reason and aggregation count, taken from the reader values and recipe answers its page names; it reads no font, file, clock or random value, measures text by character count and writes whole-pixel coordinates. Depth, reach and component resolution belong to those answers, never layout.
- [#panZoomOnly] The diagram element adds only pan, zoom and pinch by changing the SVG's view box; it never moves a box or edge. At viewport widths of at least 720 CSS pixels the SVG starts at natural size inside a keyboard-accessible scroll region, with overflow inside the figure. Below that width the responsive contract fits the same drawing to the screen. Reset restores the initial view and scroll position. Without script the drawing, scrolling, links and text equivalent remain usable. Print fits the drawing to paper and exposes its text equivalent.
```

Delete `#rule.realizationBands`, whose page reading is replaced. Replace `#design.labelMetrics` and `#design.cellWrap`, and add the following entries beside them. These values belong to the shared contract, with no forward pointer to a defined child:

```md
- labelMetrics: A title or recorded label leads at fourteen pixels, followed by the displayed id at twelve pixels and remaining words such as a component's member count. Title lines hold at most `28` characters and id lines `30`, with an eight-pixel character advance. Wrap at spaces or id punctuation, then by code point, and calculate box height from every line.
- widthBudget: `880` logical pixels for a band or grid, band labels included above their band; `264` for one context cell and `24` between boxes. Routing gutters may widen the SVG to preserve distinct lanes. A drawing wider than `880` scrolls inside its figure and receives the build-written instruction `Scroll horizontally to read the whole drawing.`
- shortId: Drop the namespace and leading dotted segments every id in the figure shares, marking elision with `…`; keep more segments on collisions. A displayed id carries a namespace only when shown in full. Full ids remain in link titles, the text equivalent and source.
- cellWrap: Wrap a cell's boxes within the fixed logical width budget instead of a fixed box count; retain context columns with local scrolling when they exceed it. Layout reads no browser or font measurement.
- edgeRouting: Reserve boxes and labels as obstacles, route orthogonally with distinct ports and lanes eight pixels apart, and never share a collinear segment or overlap labels. Crossings are permitted only at free points. Keep exact relations and claims through the words-beside-style rule. A deterministic finite routing failure omits the SVG, opens its text equivalent and explains the failure; the build owns search mechanics.
```

Replace `#design.diagramElement` and `#design.omittedDrawing` with:

```md
- diagramElement: `sdp-diagram` with `subject`, the rooted Spec, Pack, component or context id, or `architecture`, wraps one figure containing its caption and legend, any build-written scroll instruction, a keyboard-focusable named `.diagram-scroll` region containing the SVG, its text equivalent and, when offered, its closed Mermaid-source disclosure with labelled read-only textarea and `sdp-copy`. Caption, legend and source stay outside the scroll region. On upgrade it adds Zoom in, Zoom out and Reset buttons and handles drag, a wheel with Control or Command held, and pinch; it adds no layout or copy behavior.
- omittedDrawing: A drawing over the bound keeps its figure and caption, writes `Shown as text: this drawing exceeds the bound of <b> boxes and <e> edges.`, and opens its text equivalent. A routing failure instead writes `Shown as text: a distinct route or label could not be placed within the routing budget.` and opens the same complete box-and-edge reading. Neither omission offers partial Mermaid source.
```

In `#design.svgMarkup`, append this exact sentence:

```md
An edge also carries `data-claim` and a stable `data-edge-key` when its label uses a legend key; route and label coordinates are presentation values and mint no graph edge.
```

Keep `#design.elementIds` unchanged, including the trace graph's unqualified ids. Source ids insert a view name exactly where that drawing does.

In `specs/consumers/spec-studio.page-elements.sdp.md`, replace `#design.copy` with:

```md
- copy: `sdp-copy` with `text`, or with `for` naming a text area on its page: a `Copy` button whose accessible name includes the text or the text area's label; it copies that text and says `Copied`, and where the clipboard is unavailable it selects the text so the person can copy it.
```

In `specs/consumers/spec-studio.pack-page.maturity-map.sdp.md`, replace its `relations.dependsOn` stanza with:

```yaml
  dependsOn:
    - target: spec:consumers.derived-readiness-banner
      reason: the map sets each stated rung beside the floor reached, as the banner reads them
    - target: spec:consumers.spec-studio.diagram-kinds.maturity-picture
      reason: the map is drawn as the picture defines
```

Replace its narrative and keyed Behavior/UI entries with:

```md
A Pack's maturity map shows its distribution before its member lists. Equal-sized cells place each resolved member by stated readiness and floor reached. Populated cells show exact counts and member marks; faint empty cells show no number. The count table and ordered lists retain the reading in text.

- rule: [#maturityMap] After the summary, show the categorical grid and full member lists defined by spec:consumers.spec-studio.diagram-kinds.maturity-picture. Every resolved member belongs to one stated-rung and floor cell; unresolved members are named apart. Populated cells link to their built lists, whose members stay in authored order.
- maturityMap: An `sdp-maturity-map` holds the static SVG grid, caption and accessible count table, followed by populated cells' full member lists in disclosures that print open. Equal-sized cells have explicit axes; the legend names matches, floor above statement and statement above floor once. The diagonal has an outline, empty cells are faint, and populated cells carry exact counts and member marks, up to `100` marks and solid fill above that. Every member links to its card.
```

In `specs/consumers/spec-studio.spec-page.sdp.md`, replace `#rule.designView` and `#ui.designViewPanel` with:

```md
- rule: [#designView] The Design view panel draws the requirement drawing defined by spec:consumers.spec-studio.diagram-kinds.requirement-trace in place of realization, then lists the decision records the Spec names through decidedBy with linked titles and decision text inline. The Runtime panel retains the implementation anchors' components and uses.
- designViewPanel: The requirement drawing, with the text equivalent naming each binding's id, source file and line under the source-text rule, then the decision records and their decision text; its element id remains `panel.design-view`.
```

Add this item to that file's `relations.dependsOn`. The requirement child depends on Studio data, so this introduces no reverse dependency:

```yaml
    - target: spec:consumers.spec-studio.diagram-kinds.requirement-trace
      reason: the Design view reads the selected set and claims the requirement drawing defines
```

Change that file's diagrams relation reason to:

```yaml
      reason: the design view and impact panel draw requirement traceability and the one-hop trace graph
```

Leave `spec-studio.responsive#ui.narrowDiagram` unchanged. No shell breakout is proposed. At implementation close, use E's exact replacement for the `capability / domain` row in `CONTEXT.md`:

```md
| **capability / domain** | a **`Pack` grouping** and/or a Capability Map projection over epic Specs and their declared `refines` descendants, of every kind; Pack membership and refinement remain distinct (`spec:consumers.capability-map`, `spec:consumers.spec-studio.lenses.packs#rule.packGrouping`) | a kind or an altitude |
```

No decision-registry, skill or recipe-catalog edit is requested solely by G. Existing bound examples and anchors must be rechecked when these ready contracts change.

## 6. What the build needs

1. Integrate E/S/R contracts first. Recipe 52 supplies refinement; recipe 54 supplies dependencies and touched architecture; recipe 53 supplies the roadmap's explicit scope. G needs no new recipe number. S's copied probe still emitted outside uses pairs although its current Spec selects touched pairs only; reconcile that probe during integration, as G's refresh adapter does explicitly.
2. Apply the protected-file proposals with the corresponding implementation and verifiers. Shared values live in `diagrams`; keep its children as refinements and avoid reverse dependency loops. The executing thread handles readiness statements before the owner-authorized build.
3. Extend `src/projections/studio/diagrams/{model,svg,architecture,bands}.ts`, add the selected view modules, and wire Pack, slice, capability, roadmap and Spec pages. Preserve one graph and keep joins in the reader answers.
4. Update Studio CSS and `src/studio-elements/diagram.ts` for desktop scrolling, mobile fit and reset. Extend the existing copy element to accept `for`; add source serializers, not a new copy element. Keep the frozen Mermaid publisher unchanged.
5. Add tests that fail on the reviewed defects: real shell and panel widths; visible dependency members; example counts and boundary folds; supplied depths and refinement exceptions; repeat links and sibling groups; through-rests-on components; distinct ports/lanes and non-overlapping labels; homogeneous legends; marked ids and member counts; maturity marks; source ids, escaping and precise fallback reasons. Parse preferred and fallback Mermaid syntax in test tooling. Cover no-script, clipboard failure, print/export and deterministic routing failure.
6. Rebind examples, update the integration oracle, regenerate and run `npm run check`. Re-run both corpora and the synthetic probes. This design pass did not run or claim the engine's full green gate.

## 7. Changes to the brief's shape

The view selection remains. The requirement drawing now has a precise page and scope, replacing realization rather than adding a third overlapping Spec drawing. The class catalog recognizes a future role view. The roadmap's HTML board answers the kanban comparison today.

The broad 1120-pixel, rail-free prototype was replaced by an 880-pixel box budget in the real shell and Spec panels. Source copying now reuses `sdp-copy`. Routing promises retain observable behavior while leaving the algorithm to the build. Phone captures were added without changing the ready mobile contract. No owner request was weakened to close a finding.

## 8. Risks and open questions

Dense dependency and requirement drawings still need many crossings and can be tall. Distinct lanes make arrows traceable; the text equivalent and an explicitly smaller slice remain useful. Crossings are permitted and are not a claim of optimal routing.

The two bases still have one epic and no planned-component declarations. E's proposed epic coverage and a future real planned design need integrated review. The maturity samples honestly concentrate in one cell; their member marks show that concentration without manufacturing variation.

Production font metrics, Mermaid parsing, clipboard enhancement, print/export and worst-case search performance remain build work. No blocking question was added. The existing dependency-cycle set is unchanged; recipe 26 remains an advisory corpus finding, separate from the required validation result.

Close checks passed: required validation, recipes 2, 9, 22 and 26, temporal-token checking, ESLint on the evidence scripts, route/id/escaping auditing, repeat rendering and `git diff --check`. Re-run these rather than inheriting this report's measurements.

## 9. Commit left on the lane branch

`8af6e9876e5a978f4ccd5c2fd62934a1ba80c574` on `p47/g-diagrams`: `Answer diagram design review and refresh Studio evidence`.

The reviewed design remains in `1d7b3c951e9beaf8470bb6ed0e4a3bb0304d9d54`. No push or merge was performed.

## 10. Every review finding and its disposition

All fixed rows belong to `8af6e9876e5a978f4ccd5c2fd62934a1ba80c574`. Protected-file changes are concrete integration proposals in section 5, as the lane's edit restrictions require.

| Opus finding | Disposition | Checkable result |
| --- | --- | --- |
| 1. Rail, column budget and band labels | Fixed | Rail retained, 880-pixel budget, labels above bands; refreshed desktop measurements and captures |
| 2. Dependency folds hide every Spec | Fixed | Boundary-first grouping, protected holds, examples counted in parents, visible real members and full text rows |
| 3. S/G depth, relations and ids disagree | Fixed | Supplied depths start at 1, deepest band first, S owns refinement semantics; `dependencies` and `architecture` view ids |
| 4. Shared segments, ports and labels | Fixed | Distinct lanes/ports and reserved labels; independent audit checks all three and reports zero failures |
| 5. Homogeneous edges get redundant labels | Fixed | Single uses/refinement legend, no per-edge keys; mixed drawings retain keyed relations |
| 6. Four ready-contract contradictions | Fixed | Desktop-only scale rule, phone captures, trace source ids preserved; diagram-element and layout-input replacements in section 5 |
| 7. Scale formula and unknown overflow | Fixed | Natural size from 720 pixels; build note follows final fixed-budget width, without runtime measurement |
| 8. Duplicate copy element | Fixed | `sdp-copy for` design and exact page-elements replacement; no new enhancer |
| 9. Repeated law and dependency direction | Fixed | Shared children re-parented, duplicate controls/wrap rules removed, maturity reverse dependency removed; shared values proposed directly in diagrams |
| 10. Multiple parents and mixed siblings | Fixed | First-visit repeats, first-occurrence links, unreached wording, parent-grouped layout |
| 11. Maturity cells read as repeated text | Fixed | Faint empty outlines, exact populated counts and member marks, one legend, 872-pixel matrix |
| 12. Short ids invent identities and lose counts | Fixed | Elision marked, namespaces retained only in full ids, collision extension and restored member counts |
| 13. Scoped architecture redoes incomplete reach | Fixed | Consumes S's component/uses answer, including through-rests-on reach; layout resolves no membership |
| 14. Requirement scope, placement and fallback | Fixed | Explicit Spec-page set and realization replacement; real fallback names unsupported relations; synthetic supported-syntax probe |
| 15. Class catalog ignores roles | Fixed | Role-and-anchored-uses view deferred with a vocabulary/reader re-entry trigger; class-shape invention remains refused |
| 16. Wrong term for text equivalent | Fixed | Replaced throughout lane carriers and revised evidence prose |
| 17. Lossy, unspecified source escaping | Fixed | Exact entity scheme, preserved apostrophes/backticks and punctuation regression audit |
| 18. Router algorithm over-pinned | Fixed | Weights, grid and search choices moved to prototype/build; observable deterministic promises remain |
| 19. Fold boxes invent displayed ids | Fixed | Fold subtitle says folded and names its band; dependency counts say Specs; no invented namespace in the id slot |
| 20. Names and Mermaid syntax aliases | Fixed | Maturity-map and refinement-drawing titles, `c4`, preferred `block`; E's glossary replacement proposed |
| 21. Kanban deferral already answered by R | Fixed | Catalog names the roadmap page's HTML board; Mermaid export waits for a copying reader |
