Lane G's design pass is complete. It defines five additional Studio views, a shared label fix, deterministic obstacle routing, and copyable Mermaid source. Nine Specs state `defined`; none states `ready`. The engine is unchanged. The prototypes cover both base corpora at 1280 and 1440 pixels.

Validation reports zero errors and exactly the existing `honesty/gaps` warning on `spec:model.spec-sections`. Recipe 2 reports no drift alarms. The lane's commit is `1d7b3c951e9beaf8470bb6ed0e4a3bb0304d9d54` on `p47/g-diagrams`, based on `44e62ef`.

## 1. Specs and measured floors

Every id below starts with `spec:consumers.spec-studio.diagram-kinds`. The parent was enriched; the eight suffixes are new child Specs. Recipe 9 was rerun at close.

| Spec | Stated rung | Floor reached | Hold above the floor |
| --- | --- | --- | --- |
| `spec:consumers.spec-studio.diagram-kinds` | defined | ready | None |
| `.dependency` | defined | ready | None |
| `.capability-tree` | defined | defined | `spec:consumers.capability-map` still states idea |
| `.scoped-architecture` | defined | defined | `spec:consumers.design-slice` still states idea |
| `.maturity-picture` | defined | ready | None |
| `.requirement-trace` | defined | ready | None |
| `.legibility` | defined | ready | None |
| `.edge-routing` | defined | ready | None |
| `.mermaid-source` | defined | ready | None |

The two holds are `typed-dependency-targets-are-defined`, not defects at the stated rung. A floor of ready is evidence for review, never a readiness statement. The carriers are under `/tmp/plan47-wt/G/specs/consumers/`, named for their full ids after `spec:consumers.`.

The parent answers the former `#kindCatalog` and `#legibleLabels` questions through keyed Design entries. Its catalog covers the brief's list and the additional families registered by Mermaid's tagged release, including swimlanes, use case, event modeling, Venn, Ishikawa, Wardley, Cynefin, TreeView, agent flow, and the railroad variants. It also identifies diagnostic renderers, aliases, and the external ZenUML option. The catalog was checked against [Mermaid 12.2.0's registration source](https://github.com/mermaid-js/mermaid/blob/mermaid@12.2.0/packages/mermaid/src/diagram-api/diagram-orchestration.ts), alongside its [syntax navigation](https://mermaid.js.org/intro/).

The catalog distinguishes missing data from redundant views. Sequence, state, Gantt, C4 and similar forms are refused with explicit re-entry triggers. Count charts and Pack-overlap diagrams have honest inputs but are deferred until a reader needs a comparison the selected views and census do not provide.

## 2. Rulings made on delegation

Addresses in this table use the same parent-id prefix as above. These rulings await the owner's review.

| Ruling | Meaning | Carrying entry |
| --- | --- | --- |
| Select useful visual forms | Mermaid is a catalog and export syntax; static SVG remains the renderer. Data availability alone does not justify another chart. | Parent `#rule.drawnKinds`, `#design.kindCatalog` |
| Keep five new views | Draw dependency depth, capability refinement, scoped architecture, maturity distribution and requirement traceability. | Parent `#rule.drawnKinds`; each view's child Spec |
| Dependency depth is structural | Use declared dependencies and strongly connected sets; depth means neither time nor implementation order. | `.dependency#rule.depth` |
| A capability tree preserves extra parents | Placement may choose one parent, but cross-links and cycle text retain every declared refinement. | `.capability-tree#rule.multipleParents` |
| Planned structure stays separate | Keep planned designs, anchored components, binding reasons and immediate uses neighbors distinct. | `.scoped-architecture#rule.separatePlans` |
| Maturity is categorical | Equal-sized cells show exact membership counts; complete ordered lists follow the picture. Rungs become no score or completion percentage. | `.maturity-picture#rule.discreteCells`, `#rule.noScore` |
| Requirement pictures preserve claims | Declared examples, anchored tests, satisfying code, references and oracles keep their exact meanings. No passing result, risk level or verification method is invented. | `.requirement-trace#rule.claimsApart`, `#design.mermaidKind` |
| Readable first view | Use a wider figure, title-first labels, distinguishing id suffixes, width-based wrapping and natural-scale SVG with local scrolling. | `.legibility#rule.firstView`, `#rule.titleFirst`, `#design.minimumScale` |
| Route around obstacles | Use integer orthogonal routes around box and label rectangles, with deterministic costs, bounds and a text-only fallback. | `.edge-routing#rule.obstacles`, `#rule.routes`, `#rule.noPath` |
| Source needs no new decision | A separate source element enhances copying. It changes neither the SVG renderer nor the frozen Mermaid root. | `.mermaid-source#rule.sourceOnly`, `#rule.copy`, `#design.sourceElement` |

The source ruling preserves the renderer decision, MD-44, and the frozen-projections decision, MD-32. It adds no decision record or registry row. Preferred source is flowchart for dependencies, mindmap for a strict capability tree, block for a suitable grid, and requirement syntax for its exact supported relation subset. A labelled flowchart replaces a preferred syntax whenever that syntax would lose meaning. Requirement risk and verification-method fields can be omitted in the [tagged requirement grammar](https://github.com/mermaid-js/mermaid/blob/mermaid@12.2.0/packages/mermaid/src/diagrams/requirement/parser/requirementDiagram.jison).

## 3. Decisions for the owner

No new owner-only decision is required by this lane. Priority, retiring plans, and authorization to start the build remain with their existing owners and carrying Specs. The delegated rulings above are ready for the owner's review; this pass does not ratify them or start the build.

My confidence is high in the view selection, claim boundaries, source-only interpretation and label remedy. Confidence in the routing representation is moderate until production tests exercise adversarial layouts and measure its worst-case cost.

## 4. Prototypes and measurements

All evidence is under `/tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/`. Its [README](/tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/README.md) names the input commits and reproduction commands.

- `prototype.mjs` reads through `sdp q` and writes the static views. `protocol-input.json` and `platform-input.json` preserve reduced base graph values for repeatable rendering.
- [protocol-after.html](/tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/protocol-after.html) and [platform-after.html](/tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/platform-after.html) collect the views. The Protocol scope is `pack:spec-studio-v1`; the platform scope is `pack:history-view`.
- `capture.mjs` and `capture-all.mjs` produce exact desktop viewports. `measure.mjs` records browser geometry. `audit.mjs` checks routed segments against node rectangles and checks standalone HTML ids.

| View | HTML paths within the evidence directory | What it shows |
| --- | --- | --- |
| Dependency | `protocol-after-dependency.html`, `platform-after-dependency.html` | Multi-hop depth, folded groups and exact declared relation types |
| Capability | `protocol-after-capability.html`, `platform-after-capability.html` | Existing epic refinement, branch folds and a labelled remainder |
| Scoped architecture | `protocol-after-scoped-architecture.html`, `platform-after-scoped-architecture.html` | Touched components and immediate uses context, with outside-scope wording |
| Maturity | `protocol-after-maturity.html`, `platform-after-maturity.html` | A fixed matrix of counts, with full membership outside the picture |
| Requirement | `protocol-after-requirement.html`, `platform-after-requirement.html` | The intended Spec first, then related intent, code and verifier bindings |
| Architecture labels | `protocol-after-architecture.html`, `platform-after-architecture.html` | Context columns and layer bands at readable scale |
| Trace labels | `protocol-after-trace.html`, `platform-after-trace.html` | Existing relation bands with readable titles and shortened ids |

Every row has screenshots named `<corpus>-after-<view>-1280.png` and `<corpus>-after-<view>-1440.png`. Architecture, trace and maturity also have `<corpus>-before-<view>.html` and matching screenshots at both widths. The before pages preserve the existing panel markup in a Studio-width shell. `baseline-live-*.json` separately records the actual generated pages, including their panel padding.

Both corpora have no planned-component declarations at the base. [synthetic-plans.html](/tmp/plan47-wt/G/reviews/assets/plan47-prototypes/G-diagrams/synthetic-plans.html), with `synthetic-plans-1440.png`, demonstrates planned and anchored styles and a backward edge. It is explicitly synthetic and asserts no corpus fact.

The actual base architecture pages and selected widest trace pages measured as follows. Figures vary with the scrollbar and Spec-panel padding; these are browser measurements, not estimates from screenshots.

| Corpus and view | SVG's own width | Available figure at 1280 / 1440 | Effective label size at 1280 / 1440 |
| --- | --- | --- | --- |
| Protocol architecture | 1413 px | 913 / 960 px | 7.75 / 8.15 px |
| Platform architecture | 1770 px | 913 / 960 px | 6.19 / 6.51 px |
| Protocol widest trace | 1686 px | 885.4 / 932.4 px | 6.30 / 6.64 px |
| Platform widest trace | 1686 px | 885.4 / 932.4 px | 6.30 / 6.64 px |

The trace subjects are `spec:carrier.gherkin-authoring` and `spec:application.first-experiment`, each tied for the widest primary trace in its corpus. Their original labels are twelve pixels before scaling.

| Remedy | Finding |
| --- | --- |
| Full-width figure | Gains useful width, but cannot alone fit the platform's architecture without shrinking |
| Title first, distinguishing id suffix | Removes repeated namespace detail from the primary reading while keeping full identities in text and links |
| Minimum scale and internal scrolling | Guarantees readable first-view labels; wide context columns require horizontal scrolling |
| Width-based cell wrapping | Prevents the fixed six-box row from setting the width of a whole diagram |

The proposed architecture SVGs are 1160 pixels for the Protocol and 1492 for the platform; the selected trace layouts are 1020. At both desktop widths, titles stay fourteen pixels and ids twelve. The platform architecture scrolls inside its figure.

All screenshots were inspected, and the ordering defects found during inspection were corrected before recapture. The artifact audit checks 393 routed edges across fifteen standalone drawings with zero node-interior collisions and zero duplicate HTML ids. Re-rendering the captured inputs produced identical HTML, CSS and routing bytes. These are prototype checks, not claims about product implementation. Clipboard enhancement, Mermaid parser checks, print and export remain build verification.

## 5. Exact proposed edits outside this lane's files

Do not apply the following ready-Spec changes until the corresponding implementation and verifiers change together.

In `specs/roadmaps-and-slices.pack.sdp.md`, immediately after the existing diagram-kinds member, insert these new ids in reading order:

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

In `specs/consumers/spec-studio.diagrams.sdp.md`, replace `#rule.panZoomOnly` with:

```md
- [#panZoomOnly] The diagram element adds only pan, zoom and pinch by changing the SVG's view box; it never moves a box or an edge. On screen the SVG starts at natural scale inside a keyboard-accessible scroll region and may be wider than that region, while the figure stays within the page. Reset restores the initial view and scroll position. Without script the drawing, scrolling, links and complete text remain usable. Print fits the drawing to paper and exposes its complete text.
```

Replace its `#design.labelMetrics` and `#design.cellWrap`, and add `edgeRouting` immediately after `edgeKinds`:

```md
- labelMetrics: Use spec:consumers.spec-studio.diagram-kinds.legibility#design.labelMetrics and spec:consumers.spec-studio.diagram-kinds.legibility#design.shortId for title-first labels, deterministic wrapping and collision-safe displayed ids; shortening changes no identity or target.
- cellWrap: Use spec:consumers.spec-studio.diagram-kinds.legibility#design.widthBudget; wrap within that logical budget instead of placing a fixed number of boxes on every row, and retain context columns with local scrolling when they exceed it.
- edgeRouting: Route every edge under spec:consumers.spec-studio.diagram-kinds.edge-routing#rule.obstacles and spec:consumers.spec-studio.diagram-kinds.edge-routing#rule.routes; retain the exact relation and claim through an edge label or keyed legend, and use its complete-text fallback when routing cannot fit.
```

Both cited children already declare a direct dependency on the ready diagram contract, so these citations have declared relations in the reverse direction.

In `specs/consumers/spec-studio.pack-page.maturity-map.sdp.md`, replace the narrative paragraph with:

```md
A Pack's maturity picture shows its distribution before its member lists. Equal-sized cells place each resolved member by stated readiness and floor reached, showing a count and a link to its complete ordered list. A table and those lists carry the same reading in text; a large membership never turns the picture into a wall of cards.
```

Replace `#rule.maturityMap` and `#ui.maturityMap` with:

```md
- rule: [#maturityMap] After the summary, show the fixed categorical picture and complete member lists defined by spec:consumers.spec-studio.diagram-kinds.maturity-picture. Each resolved member belongs to one stated-rung and floor cell; unresolved members are named apart. The picture shows exact counts and links to built lists, and its accessible text retains every member in authored order.
- maturityMap: An sdp-maturity-map holds the static SVG picture, its caption and accessible count table, followed by the complete member lists in disclosures that print open. Cells have equal size and explicit axis labels; words distinguish a match, a floor above its statement and a statement above its floor. Every populated cell links to its full list, and every member links to its card.
```

No glossary, decision-registry, skill or recipe-catalog text change is needed solely for G. Existing anchors and examples that satisfy or verify the changed ready contracts must be rechecked during the build; this design pass does not silently extend their coverage.

## 6. What the build needs

1. Reconcile G with E, S and R, apply the Pack additions and ready-contract replacements with their implementation, and obtain the executing thread's readiness statements and the owner's build go. E supplies capability-map roots, ordered reach, refinement edges and unplaced Specs through recipe 52. S supplies the explicit slice scope, touched-component reasons, planned declarations, unassigned units and immediate uses boundary through recipe 54. R supplies the selected roadmap Spec set through recipe 53. None is inferred from prose or Pack order.
2. Extend `src/projections/studio/diagrams/model.ts`, `svg.ts` and `architecture.ts` for title-first metrics, fixed width budgets, claims and obstacle routing. Preserve the existing trace relation-band meanings in `bands.ts`. New view modules under that directory should consume the reader values and recipe answers, with stable subject/view ids. Keep graph joins and derived facts in the reader layer.
3. Wire the views into Pack, capability, slice, roadmap and Spec pages as appropriate. Update `src/projections/studio/pages/maturity-map.ts`, `pack-page.ts`, `architecture-page.ts` and Spec structure/verification panels. Scope selection belongs to those pages' named reader answers. G requests no new recipe number.
4. Add source serialization and a separate `sdp-diagram-source` enhancer under `src/studio-elements/`. Update `src/projections/studio/studio.css` and viewport reset behavior in `src/studio-elements/diagram.ts`. The existing diagram element retains only viewport enhancement. Keep the frozen Mermaid publisher unchanged.
5. Add meaningful tests beside the existing Studio data, rendering and element suites. Cover cycles, multiple parents, unresolved targets, folds and complete text; planned/anchored separation and unassigned code; exact edge claims; maturity membership and ordering; long and colliding labels; orthogonal obstacle avoidance, backward and parallel edges, routing limits and deterministic ties; no-script local scrolling at both widths; source escaping, preferred syntax and flowchart fallback; copy failure, print, export and unique ids. Parse exported syntax in test tooling without adding a Mermaid product runtime.
6. Bind examples to the new Specs, update the self-hosting oracle at integration, regenerate and run `npm run check`. Recheck the two real corpora and the synthetic/adversarial layout probes. Preserve the one existing warning; introduce none.

## 7. Changes to the brief's shape

I expanded the catalog beyond the named list using the tagged Mermaid registry. I distinguished forms that lack graph data from forms that have data but duplicate an existing reading. I grouped equivalent Mermaid syntaxes under one Studio view instead of creating redundant pages.

The maturity picture uses a discrete block matrix rather than numeric quadrant coordinates. Requirement syntax remains useful for its exact subset, with a flowchart fallback for references, models and folds. Copying belongs to a separate source enhancer so the existing diagram-element ruling stays intact.

I added a labelled synthetic planned-architecture probe because neither real base contains planned declarations. I did not author fictitious component designs or change another lane's corpus to make the prototype look fuller.

## 8. Risks and remaining questions

- The base capability maps still begin with one epic. G proves how their declared refinement reads; E's epic design determines whether the final overview is useful. Large sibling sets need explicit remainder folds and navigable detail.
- Dependency overviews can fold many members into depth groups. The complete text retains them, but a reviewer may prefer a smaller slice. Scope selection should remain explicit and reversible.
- Routing evidence shows no node collisions in these probes. It does not prove optimal paths, absence of edge crossings, label placement for every input, or acceptable worst-case performance. Test and measure those before implementation claims are bound.
- Fixed character metrics need long-label and wide-glyph tests. Source needs parser and escaping tests, especially experimental syntax. A flowchart fallback must preserve meaning rather than relabel unsupported relations.
- The prototypes show selectable source, not the clipboard enhancer or complete production print/export behavior. The five new view types are design only.
- The known dependency cycle reported by recipe 26 was present at the base. G introduces no change to it; the dependency view must render cycles honestly.

Close checks passed: the required validation command, recipe 9, recipe 2, temporal-token checking, ESLint on the prototype scripts, artifact route/id auditing, repeat rendering, and `git diff --check`. The full engine gate was not run for this design-only lane; the self-hosting oracle and product tests are reserved for integration as the brief requires. Re-run the commands rather than inheriting these measurements.

## 9. Commit and handoff

Commit `1d7b3c951e9beaf8470bb6ed0e4a3bb0304d9d54` on `p47/g-diagrams` contains the parent, eight children and prototype evidence. The worktree is clean after that commit. Nothing was pushed or merged.

Re-enter by querying recipe 9 for the nine ids above and recipes 29 and 30 for the arc and affected contracts. Review the exact proposed ready-contract replacements, align the capability and slice reader inputs, then let the executing thread propose readiness statements. The next step is cross-lane design review, not engine implementation.
