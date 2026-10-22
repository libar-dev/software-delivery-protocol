---
id: spec:consumers.spec-studio.diagrams
kind: contract
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.components
  dependsOn:
    - target: spec:consumers.spec-studio.data
      reason: a diagram is laid out from the values and recipe answers its page renders
    - target: spec:decisions.architectural-annotation
      reason: the architecture grid reads the layer and context a component anchor states
  constrainedBy: spec:extraction.determinism
  decidedBy: spec:decisions.studio-diagram-renderer
---
# A diagram is laid out from graph values into SVG with a text equivalent

Every Studio diagram is laid out in the engine when the page set is built, so a page draws it with no script and the same inputs draw the same bytes. The architecture grid, component members and one-hop trace retain their readings; the Spec page's requirement drawing replaces realization, and other pages name their supplied drawing answers. Words carry every reading the picture shows, and its text equivalent states every box and edge.

## Intent
- outcome: Draw the Studio's diagrams as inline SVG that reads without script, prints, and stays the same bytes for the same graph, with every box and edge also stated in words.

## Contract
- [#buildTime] The build lays out each diagram and writes it into its page as inline SVG; no diagram is laid out in the browser, and a page draws every diagram with no script.
- [#layoutInputs] A layout reads only the boxes, each with its id, words and supplied grouping, and edges, each with its two ends, exact kind and claim, optional reason and aggregation count, taken from the reader values and recipe answers its page names; it reads no font, file, clock or random value, measures text by character count and writes whole-pixel coordinates. Depth, reach and component resolution belong to those answers, never layout.
- [#sameBytes] One graph and the same inputs draw byte-identical SVG on every build and every machine.
- [#architectureGrid] The architecture diagram places each component in the column of its recorded context, contexts in code-unit order and then a column for components that state none, and in the band of its layer, in the order edge, application, domain, adapter, infrastructure, then a band for components that state none; a cell holds its components in id order.
- [#aggregatedUses] An architecture edge joins two components and carries the count of unit `uses` edges between them, as the component rows of `spec:consumers.spec-studio.lenses.architecture#design.componentRows` count them: each end of a unit `uses` edge resolves to its component, directly or through `memberOf`, and a use within one component draws nothing.
- [#relationBands] A trace graph draws the Spec in a band of its own, the Specs its declared relations name above it in one band per relation type, in the order refines, dependsOn, constrainedBy, decidedBy, verifies, supersedes, and the Specs whose declared relations name it below in bands of the same order; a Spec related more than one way sits in the band of its first relation, and each relation is its own edge.
- [#memberBands] A member diagram draws a component's members in bands by how deep `uses` among members reaches, a member that uses another sitting above it, and the units and components outside the component that members use in a last band of their own.
- [#bound] A diagram draws at most the boxes and edges the bound names.
- [#foldByContext] An architecture diagram over the bound with more than one context draws one box per context, with the uses between contexts aggregated and counted, and then each context's own diagram in a section of its own, where every other context it uses or is used by is one folded box in a band of its own.
- [#foldByLayer] A diagram of one context still over the bound draws one box per layer of that context, and then each layer's components in a section of their own.
- [#boundFallback] A drawing still over the bound after these folds, the context overview, one context's diagram or one layer's, writes no SVG; its text equivalent lists every box and edge the drawing would hold and then says the drawing was omitted because it exceeds the bound.
- [#foldGroups] A trace graph over the bound folds its largest relation group first, ties broken by direction and then by relation type, into one box that names the count and the relation and links to the Spec page's relations, until the drawing fits.
- [#noFoldBelowComponent] A member diagram over the bound writes no SVG; its text equivalent lists every member and every use edge, and then says the drawing was omitted because it exceeds the bound.
- [#wordsBesideStyle] Every reading a fill, outline or line style marks is also in words: bands and columns carry labels, a planned component reads `planned`, a folded box reads `folded`, and an aggregated edge's count is in its text equivalent. A drawing whose edges all have one relation names it once in its legend and draws no edge label; solid `uses` and dashed `plans to use` share the use relation, with the planned wording also in the legend. A drawing with several relations keeps its labelled bands and edge labels.
- [#textEquivalent] Each diagram is followed by its text equivalent, which states every box with its words and every edge as a sentence naming its two ends and its kind, and the SVG names it as its description.
- [#panZoomOnly] The diagram element adds only pan, zoom and pinch by changing the SVG's view box; it never moves a box or edge. At viewport widths of at least 720 CSS pixels the SVG starts at natural size inside a keyboard-accessible scroll region, with overflow inside the figure. Below that width the responsive contract fits the same drawing to the screen. Reset restores the initial view and scroll position. Without script the drawing, scrolling, links and text equivalent remain usable. Print fits the drawing to paper and exposes its text equivalent.

## Design
- bound: `40` boxes and `100` edges per diagram, counting every box a drawing holds, folded and planned boxes included, and every edge it draws.
- density: The build may trigger the existing folds before the hard bound when incident-edge density or estimated height would make the picture unreadable. Such a fold keeps the same scope, claims and complete text equivalent.
- labelMetrics: A title or recorded label leads at fourteen pixels, followed by the displayed id at twelve pixels and remaining words such as a component's member count. Title lines hold at most `28` characters and id lines `30`, with an eight-pixel character advance. Wrap at spaces or id punctuation, then by code point, and calculate box height from every line.
- cellWrap: Wrap a cell's boxes within the fixed logical width budget instead of a fixed box count; retain context columns with local scrolling when they exceed it. Layout reads no browser or font measurement.
- widthBudget: `880` logical pixels for a band or grid, band labels included above their band; `264` per context cell when several contexts share a grid, the full band budget when only one context is shown, and `24` between boxes. Routing gutters may widen the SVG to preserve distinct lanes. A drawing wider than `880` scrolls inside its figure and receives the build-written instruction `Scroll horizontally to read the whole drawing.`
- shortId: Drop the namespace and leading dotted segments every id in the figure shares, marking elision with `…`; keep more segments on collisions. A displayed id carries a namespace only when shown in full. Full ids remain in link titles, the text equivalent and source.
- edgeRouting: Reserve boxes and labels as obstacles, route orthogonally with distinct ports and lanes eight pixels apart, and never share a collinear segment or overlap labels. Crossings are permitted only at free points. Keep exact relations and claims through the words-beside-style rule. A deterministic finite routing failure omits the SVG, opens its text equivalent and explains the failure; the build owns search mechanics.
- edgeKinds: `uses` for a realized use, drawn solid; `plans to use` for a use a component design states, drawn dashed; on a trace graph the relation's type; an arrow points from the unit or Spec that uses or declares to the one it names.
- svgMarkup: the `svg` carries `role="img"`, a `title`, `aria-describedby` naming its text equivalent and a `viewBox` of its own size; a box is a `g` with class `node` and `data-id`, plus `data-planned="true"` or `data-folded="true"` when it is planned or folded, holding a link to the box's target; an edge is a `g` with class `edge`, `data-from`, `data-to` and `data-kind`; a band is a `g` with class `band` and `data-label`, a column a `g` with class `lane` and `data-label`, each also drawing its label as text. An edge also carries `data-claim` and a stable `data-edge-key` when its label uses a legend key; route and label coordinates are presentation values and mint no graph edge.
- boxTargets: a component's box links to its detail on the architecture lens, a planned component's to its component design's Spec page, a context's or layer's folded box to its section on the same page, a Spec's to its page, and a folded relation group's to the Spec page's relations.
- textEquivalent: a `details` element closed by default, summary `The diagram as text`, holding one `li` per box, `<id>: <words>`, followed by `· folded members: <ids>` when folded identities are present, and then one `li` per edge, `<from> <kind> <to>`, followed by `· <claim>` when present, `(<n> unit edges)` when the edge aggregates more than one, and `— <reason>` when present.
- diagramElement: `sdp-diagram` with `subject`, the rooted Spec, Pack, component or context id, or `architecture`, wraps one figure containing its caption and legend, any build-written scroll instruction, a keyboard-focusable named `.diagram-scroll` region containing the SVG, its text equivalent and, when offered, its closed Mermaid-source disclosure with labelled read-only textarea and `sdp-copy`. Caption, legend and source stay outside the scroll region. On upgrade it adds Zoom in, Zoom out and Reset buttons and handles drag, a wheel with Control or Command held, and pinch; it adds no layout or copy behavior.
- elementIds: a diagram's text equivalent has the id `diagram.<subject>.text` and its arrow has the id `diagram.<subject>.arrow`. A page that draws a second view of one subject inserts that view's name before `text` or `arrow`, so the Spec page's realization drawing uses `diagram.<subject>.realization.text` and `diagram.<subject>.realization.arrow`; its trace graph keeps the unqualified ids. Every id is unique on its page.
- omittedDrawing: A drawing over the bound keeps its figure and caption, writes `Shown as text: this drawing exceeds the bound of <b> boxes and <e> edges.`, and opens its text equivalent. A routing failure instead writes `Shown as text: a distinct route or label could not be placed within the routing budget.` and opens the same complete box-and-edge reading. Neither omission offers partial Mermaid source.

## Example space
```gwt-vocabulary
Given an architecture of {components:number} components spread over {contexts:number} contexts and {layers:number} layers, with {edges:number} uses edges between components
When the build lays the architecture diagram out twice
Then the two drawings are byte-identical: {identical:boolean}
Then the diagram folds by {fold:"nothing"|"context"|"layer"}
Then the first drawing holds {drawn:number} boxes
Then its text equivalent names {named:number} boxes and edges
```
