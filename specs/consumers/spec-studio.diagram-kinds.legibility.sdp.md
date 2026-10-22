---
id: spec:consumers.spec-studio.diagram-kinds.legibility
kind: contract
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
  dependsOn: spec:consumers.spec-studio.diagrams
---
# A diagram preserves readable labels before zoom

## Intent
- outcome: Read a drawing's labels on first view while allowing a wide graph to scroll inside its figure.

## Contract
- [#firstView] On screen, the figure spans the page's available content width and its SVG starts at the smaller of natural size and the container-fit scale, clamped to a minimum scale of one. Overflow scrolls inside the figure, never the page. A visible sentence explains horizontal scrolling whenever the SVG is wider than its viewport.
- [#titleFirst] A box starts with its title or recorded label at fourteen pixels, then a shortened id at twelve pixels, with full identity in its link title and complete text equivalent. Shortening changes no identity, target or element id; collisions extend the displayed suffix until it is unique within the figure.
- [#cellWrap] Layout uses a fixed logical width budget, never browser or font measurement, and wraps each cell's boxes within that budget. When context columns together exceed it, retain labelled columns and scroll; never squeeze each context into illegible cells.
- [#controls] Pan, zoom, pinch and reset change only the viewport. Reset restores natural-size first view and initial scroll position. Without script, scrolling, links, source and the complete text remain usable. Print and a self-contained export expose the complete text even when a drawing must fit paper width.

## Design
- widthBudget: `1120` logical pixels for a band or grid, `280` for one context cell and `24` pixels between boxes; a one-context grid can use the full band budget. The budget is deterministic input to layout, not a media-query-dependent graph calculation.
- labelMetrics: Title lines hold at most `28` characters at fourteen pixels with an eight-pixel character advance; ids hold at most `30` characters at twelve pixels with an eight-pixel advance. Wrap at spaces or id punctuation, then by code point, with whole-pixel coordinates and height calculated from all lines.
- minimumScale: `1` on first screen view. Reducing width by wrapping and shorter ids comes before local scrolling; zooming out remains an explicit reader choice. Titles therefore start at fourteen screen pixels and ids at twelve.
- shortId: Keep the namespace and the shortest trailing dotted segments that distinguish ids within this figure; keep additional segments on collisions. Full ids remain available in the text and source. An id without enough delimiters stays whole and wraps.
- viewport: `.diagram-scroll` is a keyboard-focusable named region with overflow auto, max-width one hundred percent, an SVG at natural width and height, and no max-width fit on screen. A figure-wide caption and legend remain outside its scroll area. A note reads `Scroll horizontally to read the whole drawing.` when width exceeds the fixed figure budget; CSS also leaves the scroll region discoverable when a narrower viewport causes overflow.
- elementIds: Keep each kind's text and arrow ids; the viewport uses `diagram.<subject>.<view>.viewport` and its visible instruction uses `.scroll-help`, both named through accessible attributes.
