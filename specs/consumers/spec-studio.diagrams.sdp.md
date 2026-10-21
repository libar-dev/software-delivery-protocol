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

The Studio draws four diagrams: the architecture lens's components by context and layer, one component's members and what they use, one Spec's relations, and on a Spec page the code that realizes it. Each is laid out in the engine when the page set is built, so a page draws it with no script and the same graph draws the same bytes. Words carry every reading the drawing shows: bands and columns are labelled, a planned or folded box says so, and a text equivalent after the drawing states every box and edge.

## Intent
- outcome: Draw the Studio's diagrams as inline SVG that reads without script, prints, and stays the same bytes for the same graph, with every box and edge also stated in words.

## Contract
- [#buildTime] The build lays out each diagram and writes it into its page as inline SVG; no diagram is laid out in the browser, and a page draws every diagram with no script.
- [#layoutInputs] A layout reads only the diagram's boxes, each with its id and its words, and its edges, each with its two ends and its kind, taken from the reader values and recipe answers its page names; it reads no font, file, clock or random value, measures text by character count, and writes whole-pixel coordinates.
- [#sameBytes] One graph and the same inputs draw byte-identical SVG on every build and every machine.
- [#architectureGrid] The architecture diagram places each component in the column of its recorded context, contexts in code-unit order and then a column for components that state none, and in the band of its layer, in the order edge, application, domain, adapter, infrastructure, then a band for components that state none; a cell holds its components in id order.
- [#aggregatedUses] An architecture edge joins two components and carries the count of unit `uses` edges between them, as the component rows of `spec:consumers.spec-studio.lenses.architecture#design.componentRows` count them: each end of a unit `uses` edge resolves to its component, directly or through `memberOf`, and a use within one component draws nothing.
- [#relationBands] A trace graph draws the Spec in a band of its own, the Specs it rests on above it in one band per relation type, in the order refines, dependsOn, constrainedBy, decidedBy, verifies, supersedes, and the Specs that rest on it below in bands of the same order; a Spec related more than one way sits in the band of its first relation, and each relation is its own edge.
- [#memberBands] A member diagram draws a component's members in bands by how deep `uses` among members reaches, a member that uses another sitting above it, and the units and components outside the component that members use in a last band of their own.
- [#realizationBands] A realization diagram draws the units that satisfy the Spec, then their components, then what those units use, in three bands.
- [#bound] A diagram draws at most the boxes and edges the bound names.
- [#foldByContext] An architecture diagram over the bound with more than one context draws one box per context, with the uses between contexts aggregated and counted, and then each context's own diagram in a section of its own, where every other context it uses or is used by is one folded box in a band of its own.
- [#foldByLayer] A diagram of one context still over the bound draws one box per layer of that context, and then each layer's components in a section of their own.
- [#boundFallback] A drawing still over the bound after these folds, the context overview, one context's diagram or one layer's, writes no SVG; its text equivalent lists every box and edge the drawing would hold and then says the drawing was omitted because it exceeds the bound.
- [#foldGroups] A trace graph over the bound folds its largest relation group first, ties broken by direction and then by relation type, into one box that names the count and the relation and links to the Spec page's relations, until the drawing fits.
- [#noFoldBelowComponent] A member or realization diagram over the bound writes no SVG; its text equivalent lists every member or unit and every use or realization edge, and then says the drawing was omitted because it exceeds the bound.
- [#wordsBesideStyle] Every reading a fill, outline or line style marks is also in words: bands and columns carry labels, a planned component reads `planned`, a folded box reads `folded`, and an aggregated edge's count is in its text.
- [#textEquivalent] Each diagram is followed by its text equivalent, which states every box with its words and every edge as a sentence naming its two ends and its kind, and the SVG names it as its description.
- [#panZoomOnly] The diagram element adds only pan, zoom and pinch, by rewriting the SVG's view box; it never moves a box or an edge, and without script the drawing shows at its own size inside a box that scrolls.

## Design
- bound: `40` boxes and `100` edges per diagram, counting every box a drawing holds, folded and planned boxes included, and every edge it draws.
- labelMetrics: a label line holds at most `30` characters, an id longer than that wraps after a dot or a colon and then after a hyphen, a character advances `7.5` pixels at the 12 pixel monospace label size, and a box is as wide as its longest line plus padding.
- cellWrap: a grid cell or a band places at most `6` boxes on one line and wraps onto the next.
- edgeKinds: `uses` for a realized use, drawn solid; `plans to use` for a use a component design states, drawn dashed; on a trace graph the relation's type; an arrow points from the unit or Spec that uses or declares to the one it names.
- svgMarkup: the `svg` carries `role="img"`, a `title`, `aria-describedby` naming its text equivalent and a `viewBox` of its own size; a box is a `g` with class `node` and `data-id`, plus `data-planned="true"` or `data-folded="true"` when it is planned or folded, holding a link to the box's target; an edge is a `g` with class `edge`, `data-from`, `data-to` and `data-kind`; a band is a `g` with class `band` and `data-label`, a column a `g` with class `lane` and `data-label`, each also drawing its label as text.
- boxTargets: a component's box links to its detail on the architecture lens, a planned component's to its component design's Spec page, a context's or layer's folded box to its section on the same page, a Spec's to its page, and a folded relation group's to the Spec page's relations.
- textEquivalent: a `details` element closed by default, summary `The diagram as text`, holding one `li` per box, `<id>: <words>`, and then one `li` per edge, `<from> <kind> <to>`, followed by `(<n> unit edges)` when the edge aggregates more than one.
- diagramElement: `sdp-diagram` with `subject`, the Spec, Pack, component or context id the diagram is rooted at, or `architecture`, wrapping one `figure` that holds the caption, the SVG and its text equivalent; on upgrade it adds `Zoom in`, `Zoom out` and `Reset` buttons and handles drag, a wheel turned with Control or Command held, and a two-finger pinch.
- elementIds: a diagram's text equivalent has the id `diagram.<subject>.text`, unique on its page because a page draws one diagram per subject.
- omittedDrawing: a drawing over the bound keeps its `figure` and caption, holds the sentence `Shown as text: this drawing exceeds the bound of <b> boxes and <e> edges.`, with the bound's two numbers, where the SVG would be, and writes its text equivalent open.

## Example space
```gwt-vocabulary
Given an architecture of {components:number} components spread over {contexts:number} contexts and {layers:number} layers, with {edges:number} uses edges between components
When the build lays the architecture diagram out twice
Then the two drawings are byte-identical: {identical:boolean}
Then the diagram folds by {fold:"nothing"|"context"|"layer"}
Then the first drawing holds {drawn:number} boxes
Then its text equivalent names {named:number} boxes and edges
```
