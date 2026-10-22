# Lane G review (diagram kinds and legible drawings)

Reviewed commit `1d7b3c9` on `p47/g-diagrams` against base `44e62ef`. I re-ran these myself rather than relying on the designer's report: validation through `sdp q` `report` (0 errors, only the `honesty/gaps` warning on `spec:model.spec-sections`), recipe 9 on all nine Specs (each states `defined`; the floors are `ready`, except `defined` for capability-tree and scoped-architecture), recipe 22 (no unbacked mentions) and recipe 26 (only the cycle that was already there at the base). I checked the catalog against Mermaid 12.2.0's `diagram-orchestration.ts` and found it complete. I looked at every screenshot and measured the prototype HTML.

The catalog, the honesty rules and the Mermaid-source ruling are sound. The legibility evidence and the dependency drawing are not ready: the "after" pages are measured on a page layout the Studio does not have, the dependency drawing folds into nothing on both corpora, and the dependency drawing conflicts with lane S's slice Specs.

## Findings

1. **Prototype pages; `…legibility#rule.firstView`, `#design.widthBudget`. Blocking.** The "after" pages drop the Studio's navigation rail (`prototype.css`: `.layout{display:block;max-width:82rem}`). That makes their figures 1233 px wide at 1280 and 1280 px wide at 1440. The live Studio's figure is 913 and 960 px (the lane's own `baseline-live-*.json`; I confirmed this by capturing `http://127.0.0.1:8471/architecture.html`). With a 1120 budget, the Protocol architecture (1160) and both traces (1020) would scroll at both desktop widths in the real Studio. The report says that only the platform architecture scrolls. The "after" layout also moved band labels out of their place above each band and into a left column of about 130 px. **Change:** recapture with the rail present. Then either make the budget fit the measured column:
   `- widthBudget: \`880\` logical pixels for a band or grid, band labels included, which stay above their band; \`264\` for one context cell and \`24\` between boxes. A drawing wider than \`880\` scrolls inside its figure.`
   or rule that a full-width figure breaks out of the column under the rail, and propose the exact `spec:consumers.spec-studio.shell` edit. I recommend the first option.

2. **`…dependency#rule.fold`, `#rule.declaredOnly`; `*-after-dependency-*.png`. Blocking.** On both corpora every band folds, so the drawing shows only `N Specs or units, folded` boxes and not one Spec. There are two causes:
   - The fold order folds the scope's own depth bands before the boundary band. The platform `pack:history-view` has 19 members, but its scope reaches 54 outside targets through 148 outgoing edges.
   - Examples have no dependency edges, so they land at depth zero as boxes: 23 of the 37 depth-zero boxes in `pack:spec-studio-v1`.

   **Change:** replace `#fold` with
   `- rule: [#fold] Above the shared bound, first fold the boundary band into one box per relation type that names its count, keeping as its own box each outside Spec that holds a member's stated next rung; then fold whole depth bands in descending box count, ties by ascending depth; if the drawing still exceeds the bound, omit the SVG and open the text equivalent.`
   and add
   `- rule: [#examplesInParent] An example member that refines another member is counted on its parent's box and is never drawn as its own box; it keeps its row in the text equivalent.`
   Then recapture both corpora.

3. **`…dependency#rule.depth`, `#rule.declaredOnly`, `#design.bands`, `#design.elementIds` against lane S's `spec:consumers.design-slice#rule.depth`, `#rule.restsOn` and `spec:consumers.spec-studio.slice-page#rule.dependencyDrawing`, `#ui.drawingIds`. Blocking.** S's slice page says its drawing is laid out as this Spec lays one out, but the two disagree in four places:
   - depth starts at 0 here and at 1 in S;
   - this Spec leaves out `refines`, while S's rests-on relation includes it;
   - the prototype puts depth 0 at the top with arrows pointing up, while S puts "a member sitting above the members it rests on";
   - the view ids differ: `dependency` and `scoped-architecture` here, `dependencies` and `architecture` in S.

   The drawing also recomputes depth itself, which breaks its parent's `#rule.graphData`. In the prototype the boundary band sits at the bottom, so every boundary edge runs the whole height of the drawing.

   **Change:** add `dependsOn: spec:consumers.design-slice` and replace `#depth` with
   `- rule: [#depth] Band each member by the depth its supplied answer gives, the design slice's \`depth\` for a Pack, slice or roadmap scope; the layout never recomputes it. A cycle's members share one band and are named as a cycle in words.`
   Then replace `bands` with
   `- bands: Label bands \`Depth <n>\` from the deepest at the top down to depth 1, then \`Outside this scope\` at the bottom, so a member sits above what it rests on and boundary edges stay short. Within a band keep supplied order. Depths are structural, never phases, dates or priority.`
   Settle the relation set with S: one of you owns whether `refines` is a rests-on edge. Adopt S's view names `dependencies` and `architecture` in both children's `elementIds`.

4. **`…edge-routing#design.cost`, `#rule.ports`, `#rule.labels`. Should fix.** The prototypes satisfy "no route crosses a box", but a reader still cannot follow an arrow:
   - Edges share segments: 189 pairs of edges in `protocol-after-architecture.html` (38 edges) and 452 pairs in `protocol-after-trace.html` (36 edges).
   - Parallel edges share ports: three dependency edges have identical start and end points.
   - Edge keys are drawn on top of each other. In the platform architecture 34 of 36 keys share their coordinates with another key; for example, `e10` and `e11` are both at (832,548) in `platform-after-requirement.html`. The screenshots show the garbled `e11`, `e17` and `e27`.

   `audit.mjs` checks only box interiors. **Change:** replace the second sentence of `cost` with
   `Two edges never share a collinear segment: they take distinct ports and lanes \`8\` pixels apart, and an edge that cannot get a lane is a routing failure under #noPath.`
   Append to `#labels`:
   `Every placed label rectangle is an obstacle for later labels and routes; no two labels overlap.`
   Extend the audit to check shared segments and label overlap, then recapture.

5. **`…edge-routing#rule.labels`, `…scoped-architecture#design.edgeWords` against ready `spec:consumers.spec-studio.diagrams#rule.wordsBesideStyle`. Should fix.** The ready rule says that when all edges share one relation, the legend names it once and no edge gets a label. The prototypes instead key every `uses` edge (`e10`…) and add a legend of 38 rows that each read `eN: uses, anchored, 1 unit edges`. **Change:** append to `#labels`:
   `An edge carries a label only where spec:consumers.spec-studio.diagrams#rule.wordsBesideStyle asks for one; a drawing whose edges share one relation and one claim names them once in its legend.`
   Replace `edgeWords` with:
   `- edgeWords: The legend reads \`Arrows: uses (anchored).\` and, when planned uses are drawn, \`Dashed arrows: plans to use (declared).\`; edges carry no per-edge label. A realization correspondence is its own labelled link, never a uses edge or a delivery fact.`

6. **Ready Specs contradicted, with no edit proposed. Should fix.**
   - (a) `spec:consumers.spec-studio.responsive#design.narrowDiagram` opens a diagram scaled to the screen's width below 720 px. `…legibility#rule.firstView` ("On screen", minimum scale one) and the proposed `#panZoomOnly` contradict it. No 390-wide capture was made, although `common.md` asks for one on phone pages.
   - (b) `diagrams#design.elementIds` keeps the trace graph's ids unqualified, but `…mermaid-source#design.elementIds` says "Existing views use explicit view keys too".
   - (c) `diagrams#design.diagramElement` gains a scroll region, a scroll note and a source disclosure, with no proposed text.
   - (d) `diagrams#rule.layoutInputs` reads only an edge's ends and kind, while the new edges also carry claim, reason and count.

   **Change:** for (a), scope the rule to desktop as in item 7, keep `narrowDiagram`, and capture at 390. For (b), replace the source ids with:
   `- elementIds: Use \`diagram.<subject>[.<view>].source\` and \`.source-text\`, inserting the view name exactly where the diagram's own ids do, so a trace graph's source is \`diagram.<subject>.source\`.`
   For (c) and (d), propose exact replacement text in the report's section 5.

7. **`…legibility#rule.firstView` against `#design.viewport`. Should fix.** "The smaller of natural size and the container-fit scale, clamped to a minimum scale of one" always comes out as one. "Whenever the SVG is wider than its viewport" cannot be known at build time without script, and the design entry emits the note only past the fixed budget. **Replacement:**
   `- [#firstView] At 720 CSS pixels of viewport width and wider, a diagram's SVG starts at its natural size inside its figure's scroll region and is never shrunk to fit. Overflow scrolls inside the figure, never the page. The build writes \`Scroll horizontally to read the whole drawing.\` above every drawing wider than the width budget.`

8. **`…mermaid-source#rule.copy`, `#design.sourceElement` against ready `spec:consumers.spec-studio.page-elements#design.copy`. Should fix.** `sdp-copy` already provides a Copy button, the `Copied` message, and a select-the-text fallback. A new `sdp-diagram-source` element would duplicate it, and the design proposes no page-elements edit. **Change:** replace `sourceElement` with
   `- sourceElement: The disclosure's copy button is the page elements' \`sdp-copy\`, given a \`for\` attribute that names the source text area so a long source is not repeated in an attribute; no new element is added, and \`sdp-diagram\` still adds only pan, zoom and pinch.`
   Propose for `page-elements#design.copy`:
   `- copy: \`sdp-copy\` with \`text\`, or with \`for\` naming a text area on its page: a \`Copy\` button whose accessible name includes the text or the text area's label; it copies that text and says \`Copied\`, and where the clipboard is unavailable it selects the text so the person can copy it.`

9. **One rule written in two places, with dependencies pointing the wrong way. Should fix.**
   - The proposed `diagrams#design.labelMetrics` and `#design.cellWrap` point at `…legibility`, and `…legibility#rule.controls` repeats the proposed `#panZoomOnly`.
   - `legibility` and `edge-routing` both `dependsOn` `diagrams`, yet `diagrams` would rest on them.
   - `…maturity-picture` `dependsOn` `pack-page.maturity-map`, while the proposed `#maturityMap` defers to the picture.

   **Change:** at integration, write the values (`widthBudget`, `labelMetrics`, `shortId`, `panZoomOnly`) into `diagrams`' own entries and delete legibility's `#controls` and `#cellWrap`. Do not point from a ready contract to a defined child. Because both children govern all drawings, including the four existing ones, re-parent `legibility` and `edge-routing` to `refines: spec:consumers.spec-studio.diagrams`. For the maturity map, give `pack-page.maturity-map` a `dependsOn: spec:consumers.spec-studio.diagram-kinds.maturity-picture` with reason `the map is drawn as the picture defines`, and drop the picture's `dependsOn` back to the map.

10. **`…capability-tree#rule.multipleParents`, `#rule.mapInput`, `#design.layout` against lane E's `spec:consumers.capability-map#rule.multipleParents` and `spec:consumers.spec-studio.capability-map-page#rule.drawing`. Should fix.**
    - E expands a shared Spec at its first visit and draws later visits as linked repeats. G places it once and draws cross-links.
    - G's "first parent in supplied map order" over E's id-sorted edges picks the parent with the smallest id, not E's first visit.
    - G says "unplaced" where E says "unreached".
    - The prototype (`protocol-after-capability-1440.png`) reads as a three-column list over a lattice of gutter routes, not as a tree: siblings of different parents mix within one band.

    **Replacement:**
    `- rule: [#multipleParents] Place a Spec at its first visit in the capability map's traversal of the epic and draw each later visit as a repeat box that links to the first occurrence and keeps its own refines arrow. A cycle is a labelled group whose internal relations stay in the text equivalent; the drawing never cuts an edge silently.`
    Replace "unplaced" with "unreached" throughout, and append to `layout`:
    `Within a depth band, children sit together under their placement parent as one labelled sibling group, in parent order; a band never interleaves siblings of different parents.`

11. **`…maturity-picture#rule.discreteCells`, `#design.matrix`. Should fix: this is the owner's "a picture" ask.**
    - Nineteen of the 20 equal cells show `0`, with the same weight as the one populated cell (`63` or `19`).
    - Every cell repeats a relation phrase.
    - The picture is about 1050 px wide, so it would scroll in the live 913 px column.

    **Replacement:**
    `- rule: [#discreteCells] Draw one equal-sized cell per stated-rung and floor pair. A populated cell shows its exact count and one mark per member, up to \`100\` marks, beyond which it is filled solid, and links to that cell's full ordered member list; an empty cell is a faint outline with no number. \`matches\`, \`floor above statement\` and \`statement above floor\` are named once each in the legend, and the diagonal carries an outline. Floor none is distinct from idea, and unresolved members are listed apart.`
    Size the cells so the picture fits the width budget from item 1. Marks count members and score nothing, so `#noScore` still holds.

12. **`…legibility#design.shortId`, `#rule.titleFirst`. Should fix.**
    - Shortening produces strings that look like ids but are not: `spec:carrier.markdown-authoring` displays as `spec:markdown-authoring`. A reader who copies it into a Spec gets an unresolved mention.
    - `component:example.parent` displays as `component:parent`, which hides the platform's split between its `example.*` and `platform.*` components.
    - The architecture boxes in the "after" pages lost their member counts (`31 members`).

    **Replacement:**
    `- shortId: Drop the namespace and the leading dotted segments every id in the figure shares, and mark the elision with a leading \`…\`, so \`spec:carrier.markdown-authoring\` shows \`…markdown-authoring\`; keep more segments on collisions. A displayed id never carries a namespace unless it is shown in full. Full ids remain in the link title, the text equivalent and the source.`
    Append to `#titleFirst`:
    `The box's remaining words, such as a component's member count, follow the id.`

13. **`…scoped-architecture#rule.scopeInput`, `#rule.boundary`. Should fix.**
    - This Spec resolves units to components itself through `memberOf`. S's `componentRow` already supplies components reached through the members' code, through what the slice rests on, and through planned designs.
    - G leaves out the "through what the slice rests on" route, which is the only route a design ahead of its code has.
    - In the Protocol prototype, 8 of 13 boxes are outside-scope neighbours.

    **Replacement:**
    `- rule: [#scopeInput] Draw the components and uses the design slice answer supplies for the scope, \`architecture.components\` and \`architecture.uses\`, with each component's reach in words: members' satisfying code, members' referencing code, what the slice rests on, or planned. The drawing resolves no unit to a component itself.`
    In `#boundary`, fold the immediate uses neighbours into one `outside scope` box per context and layer, and keep their names in the text equivalent.

14. **`…requirement-trace#rule.exactEdges`. Should fix.** "The supplied bounded Spec set" is never defined, and the page and section are left "as appropriate". The Spec page would then carry three drawings (the trace, the realization and this one) with overlapping edges. The prototypes never emit `requirementDiagram`: both fall back to a flowchart with the reason "preserves folds", although nothing folded. **Change:** add
    `- placement: On a Spec page the requirement drawing replaces the realization drawing under its heading; its set is the Spec, the Specs that refine it, and the examples that verify any of them.`
    or state the placement you prefer. Make the source's stated fallback reason name the relation that forced it, for example `models`.

15. **`spec:consumers.spec-studio.diagram-kinds#design.class`, owner's ask 3. Should fix.** No view reads `role`, yet 176 of 219 Protocol code units and 37 of 76 platform units carry one. The owner tied the diagrams to "architecturally significant patterns and abstractions, and the relationships between them". The `class` row refuses on fields and methods, but a role view is honest. **Replacement:**
    `- class: Defer a role view for a component or slice: units as classes stereotyped by their recorded role, with anchored uses as dependency arrows and no fields, methods or inheritance. Role, memberOf and uses are honest inputs, but the role vocabulary is under review and the architecture page lists roles as text. Re-enter when the role vocabulary settles and a reader needs pattern relationships drawn. Refuse fields, methods, inheritance and multiplicities; Model prose is not a schema.`

16. **Term: "complete text" (13 uses) for the ratified "text equivalent" (`CONTEXT.md`). Minor.** Replace it throughout. For example, `…edge-routing#rule.noPath` becomes "omit that SVG and open its text equivalent with an explicit routing explanation".

17. **`…mermaid-source#rule.escaping`. Minor.** The rule names no escaping scheme, and byte tests need one. The prototype's `safe()` is lossy: "The Studio s custom elements", and backticks are dropped. **Add:**
    `- sourceEscaping: Inside a quoted label, \`"\`, \`#\`, \`<\` and \`>\` become Mermaid entity codes (\`#quot;\`, \`#35;\`, \`#lt;\`, \`#gt;\`), a line break becomes a space, and every other character is kept.`

18. **`…edge-routing#design.cost`, `#design.searchBound`, `#rule.routes`. Minor.** These pin weights, tie-breaks and a visibility-grid algorithm, which are implementation. `#sameBytes` needs a deterministic router, not these numbers, and pinning them makes every tuning a Spec change. **Change:** keep the observable promises (obstacles, lanes, labels, `#noPath`, no dependency, determinism) and move the weights and grid to the build.

19. **Prototype fold boxes. Minor.** They print invented ids in the id slot (`fold:Dependency depth 0`, `fold:transactional-domain-platform`) and say "Specs or units" on a drawing that holds only Specs. **Change:** have a folded box's second line read `folded` and its band, with no namespace.

20. **Names. Minor.**
    - "Maturity picture" is a second name for the maturity map. Keep the view's name and retitle the child `The maturity map is drawn as a grid of counts`.
    - Align "capability tree" with E's "refinement drawing", and note that `CONTEXT.md`'s `capability / domain` row ("draws no capability tree") needs E's proposed edit.
    - Use the key `c4` rather than `cFour`.
    - Prefer `block` to `block-beta`: Mermaid 12.2.0's detector accepts both (`/^\s*block(-beta)?/`).

21. **`…diagram-kinds#design.kanban`. Minor.** Lane R's roadmap board (HTML lists by lane) is the "categorical board over explicit graph values" this deferral waits for. Name the roadmap page as the equivalent board, or name `kanban` as its source export.

## What is good and should not change

- **The catalog.** It is complete against Mermaid 12.2.0's registry (I fetched the tagged source). It separates aliases and diagnostics, and every refusal names the missing typed input and its re-entry trigger. The split between missing data and a redundant view is clear.
- **Honesty.** Depth is never order, the maturity map is never a score, verification reads "binding present, never passed", a reference is never realization, planned and anchored stay apart, and no delivery fact is authored anywhere.
- **The Mermaid-source ruling.** Source offered as copyable text needs no decision refining MD-44 or MD-32. That reading is correct.
- **The label diagnosis.** It was measured on the live pages, the four remedies are compared fairly, and the synthetic planned-architecture probe is clearly labelled as synthetic.
- **Rungs and writing.** Rungs are honest, there are no dates, counts or plan numbers in the Specs, no new warnings, and the Pack order proposal is sensible.
