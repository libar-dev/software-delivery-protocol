---
id: spec:consumers.spec-studio.diagram-kinds.legibility
kind: contract
altitude: story
readiness: ready
relations:
  refines:
    - spec:consumers.spec-studio.diagrams
    - target: spec:consumers.spec-studio.diagram-kinds
      reason: readable labels are part of the outcome the diagram kinds state
  dependsOn: spec:consumers.spec-studio.responsive
---
# A diagram preserves readable labels before zoom

## Intent
- outcome: Read a drawing's labels on first view while allowing a wide graph to scroll inside its figure.

## Contract
- [#firstView] At 720 CSS pixels of viewport width and wider, a diagram's SVG starts at its natural size inside its figure's scroll region and is never shrunk to fit. Overflow scrolls inside the figure, never the page. The build writes `Scroll horizontally to read the whole drawing.` above every drawing wider than the width budget. Below that viewport width the responsive contract's narrow drawing applies.
- [#titleFirst] A box starts with its title or recorded label at fourteen pixels, then a shortened id at twelve pixels, with full identity in its link title and text equivalent. Shortening changes no identity, target or element id; collisions extend the displayed suffix until it is unique within the figure. The box's remaining words, such as a component's member count, follow the id.

## Design
- widthBudget: `880` logical pixels for a band or grid, band labels included, which stay above their band; `264` for one context cell and `24` between boxes. A drawing wider than `880` scrolls inside its figure. Layout reads no browser or font measurement.
- labelMetrics: Title lines hold at most `28` characters at fourteen pixels with an eight-pixel character advance; ids hold at most `30` characters at twelve pixels with an eight-pixel advance. Wrap at spaces or id punctuation, then by code point, with whole-pixel coordinates and height calculated from all lines.
- minimumScale: `1` on first desktop view at viewport widths of at least `720` CSS pixels; below that width the responsive contract fits the same drawing to the screen. Zooming out on desktop remains an explicit reader choice.
- shortId: Drop the namespace and the leading dotted segments every id in the figure shares, and mark the elision with a leading `…`, so a label may show `…markdown-authoring`; keep more segments on collisions. A displayed id never carries a namespace unless it is shown in full. Full ids remain in the link title, the text equivalent and the source.
- viewport: `.diagram-scroll` is a keyboard-focusable named region with overflow auto and max-width one hundred percent. At desktop widths its SVG has natural width and height with no max-width fit; below `720` CSS pixels the SVG fits the region. The caption and legend stay outside. The build emits the scroll instruction only when SVG width exceeds the fixed width budget; CSS leaves the region discoverable on narrower columns.
- elementIds: Keep each kind's text and arrow ids; the viewport uses `diagram.<subject>[.<view>].viewport` and its visible instruction uses `.scroll-help`, inserting the view name exactly where the diagram's own ids do.
