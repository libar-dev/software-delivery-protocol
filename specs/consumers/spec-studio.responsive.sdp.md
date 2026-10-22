---
id: spec:consumers.spec-studio.responsive
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn: spec:extraction.claim-taxonomy
---
# The Studio reads on a phone as on a desktop

The curated graph's edges carry no confidence, and the impact graph's inferred imports stay outside it, so a diagram never drops an edge for a low score; a trace graph draws one hop at every width, and a narrow screen scales the drawing rather than cutting it.

## Intent
- actor: A person reviewing a design on a phone, including a pull request reviewer who holds only a link.
- outcome: Let a design be reviewed on a phone through the same pages a desktop shows.

## Behavior
- rule: Every page of the Studio is responsive, so the same pages serve a desktop and a phone.

## UI
- singleColumn: every layout collapses to one column below 720 CSS pixels of viewport width; at 390 CSS pixels no page exceeds the viewport. The top navigation and stamp line wrap, and a table wider than its column scrolls inside its own container, including maturity maps, run results and coverage tables; queue rows wrap within their column.
- pinchZoom: on a touch device, every diagram zooms with a pinch, which the diagram element adds.
- narrowDiagram: below the same width a diagram opens scaled to the screen's width, with its zoom controls above it and its text equivalent below it, and draws the same boxes and edges a desktop draws.

## Example space
```gwt-vocabulary
Given a Studio page whose layout holds {wideColumns:number} columns
When the page is shown {width:number} pixels wide
Then the layout holds {columns:number} columns
```
