---
id: spec:decisions.studio-diagram-renderer
kind: decision
altitude: story
readiness: ready
relations:
  refines:
    - target: spec:decisions.studio-web-components
      reason: narrows how an element that shows a diagram renders it; the element only enhances an SVG the build drew
  dependsOn:
    target: spec:extraction.determinism
    reason: a diagram laid out from graph values alone keeps one graph to one set of bytes
---
# The engine lays out every Studio diagram as static SVG when the page set is built

## Intent
- outcome: Give the Studio diagrams that a reader with only a link reads without script, that two builds of one graph draw byte for byte, and that need no layout code in the page.

## Decision
- context: The Studio's pages read in full without script and open from `file://`, two builds of one graph write the same bytes, and the custom-elements decision admits a framework runtime only through a decision that refines it. The architecture lens, a component's members, a Spec's relations and the code that realizes a Spec all need a drawing. A prototype over the Protocol's own components and the first adopter's, read through `sdp q`, measured how large those drawings are (`reviews/assets/plan46-prototypes/studio-diagrams/`).
- decision: The engine lays out every Studio diagram at build time with its own deterministic layered layout and writes it into the page as inline SVG followed by a text equivalent. The custom element that holds a diagram adds only pan, zoom and pinch, by changing the SVG's view box. One diagram draws at most the bound `spec:consumers.spec-studio.diagrams#design.bound` names, and above it the diagram folds, by context and then by layer, as that Spec states.
- rationale: Inline SVG reads without script, prints, survives the Pack export and opens from `file://`, so the page carries no layout code and the element stays small.
- rationale: A layout computed from graph values, with no font, clock or random value, draws the same bytes from the same graph, which the Studio's reproducibility rule and `--check-clean` need.
- rationale: The bound sits between what the two corpora need and what a page reads well: in the prototype the largest real drawing is the Protocol's thirty-five-box member diagram, and a synthetic sixty-two-component drawing spanned about two and a half screen widths unfolded; nothing between forty and sixty-two boxes was measured, and the edge bound is headroom over the thirty-nine edges the largest real diagram draws.
- alternative: Mermaid rendered in the page needs its script and a runtime of several hundred kilobytes, lays out differently per browser, and shows nothing without script; the shipped Mermaid projection stays frozen for its own readers.
- alternative: A layout library such as ELK or Dagre run at build time adds a dependency whose version moves the bytes, while the Studio's diagrams need only labelled bands and a grid.
- alternative: Drawing on a canvas from embedded data puts the diagram out of reach of a screen reader, of print and of a reader without script.
- consequence: The engine owns a small layout module and its tests; the layout's look is judged in review, and its determinism and fold by test.
- consequence: The text equivalent states every box and edge, so a diagram is never the only way to read what it shows.
- consequence: A change to the layout moves the Studio's bytes like any other rendering change, and `--check-clean` catches one nobody intended.
