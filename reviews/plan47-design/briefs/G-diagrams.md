# Lane G: diagram kinds and legible drawings

Read `/tmp/plan47-briefs/common.md` first; it applies in full. Worktree: `/tmp/plan47-wt/G` on
branch `p47/g-diagrams`. Report step name: `design`.

## The question

The owner: "Architecture views are an amazing addition, but we don't leverage many Mermaid diagram
types." Also: the architecture diagram's labels are too small at desktop width unless zoomed, and
the maturity map reads as a long list rather than a picture.

What is ruled and stays: the engine lays out every Studio diagram as static SVG at build time
(MD-44, `spec:decisions.studio-diagram-renderer`); the build renders every view and an element only
enhances it (MD-43); a diagram is bounded and folds (`spec:consumers.spec-studio.diagrams`); the
shipped Mermaid projection stays frozen for its own readers (MD-32,
`spec:decisions.shipped-projections-frozen`). The Studio draws four diagrams today: the
architecture grid, a component's members, a Spec's one-hop relations (the trace graph, built on
every Spec page) and a Spec's realization. PR 35's forward section also asked for edge routing
around boxes: dense drawings cross boxes.

## Do

1. **The catalog.** For every Mermaid diagram type (flowchart, sequence, class, state,
   entity-relationship, user journey, Gantt, pie, quadrant, requirement, Git graph, C4, mindmap,
   timeline, sankey, XY chart, block, packet, kanban, architecture, radar, treemap, and any other
   the current Mermaid release ships), decide whether the graph holds honest data for it, for which
   subject (a Spec, a Pack or slice, a component, an epic, the roadmap, the corpus), and what a
   reader learns from it that no page shows today. A kind whose data the graph does not hold
   (message order for a sequence, states for a state machine, dates for a Gantt) is refused with
   the reason and the trigger that would bring it back; never derive it from prose. Put the
   catalog in `spec:consumers.spec-studio.diagram-kinds` (answer `#kindCatalog`).
2. **The kinds to draw.** Design each kind the catalog keeps as its own child Spec with keyed
   Design entries in the style of `spec:consumers.spec-studio.diagrams` (bands or layout,
   bound and fold, words beside style, text equivalent, element ids). Expect at least: a
   dependency drawing over a set of Specs (multi-hop declared relations within a Pack, a slice or
   a roadmap, banded by depth); a tree drawing for the capability map (lane E); an architecture
   drawing scoped to the components a set of Specs touches, realized and planned (lane S); the
   maturity map as a picture; and a requirement-style drawing if the catalog keeps it. Lanes E, S
   and R will reference your kinds; name them so they can.
3. **Legible labels.** Diagnose why labels shrink (measure: the SVG's own width against the
   column it fits at 1280 and 1440 wide, on both corpora's architecture page and largest trace
   graph); compare the remedies (a full-width figure, title-first labels with the id shortened,
   a smallest scale with scrolling inside the figure, cell wrapping) and design the fix (answer
   `#legibleLabels`). It may change ready rules of `spec:consumers.spec-studio.diagrams`
   (`#panZoomOnly`, `#design.labelMetrics`, `#design.cellWrap`): propose the exact text, or carry
   the new promise in a child Spec.
4. **Edge routing.** Design how edges route around boxes, deterministically, without a layout
   dependency.
5. **Mermaid source.** Each diagram may offer its Mermaid source to copy. Decide whether that
   needs a decision refining MD-44 or MD-32 (the shipped Mermaid root stays frozen), and design
   the affordance.
6. **Prototype** every kind and the legibility fix on both corpora (the Protocol's base and the
   platform copy), before and after, with screenshots at 1440 and 1280 wide. A throwaway layout
   in the prototype folder is fine; it is evidence for the build, not the build.
