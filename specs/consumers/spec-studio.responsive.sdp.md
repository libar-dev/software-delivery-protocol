---
id: spec:consumers.spec-studio.responsive
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn: spec:extraction.claim-taxonomy
---
# The Studio reads on a phone as on a desktop

The curated graph's edges carry no confidence, and the impact graph's inferred imports stay outside it, so a compact diagram shortens by distance alone.

## Intent
- actor: A person reviewing a design on a phone, including a pull request reviewer who holds only a link.
- outcome: Let a design be reviewed on a phone through the same pages a desktop shows.

## Behavior
- rule: Every page of the Studio is responsive, so the same pages serve a desktop and a phone.

## UI
- singleColumn: every layout collapses to one column below 720 CSS pixels of viewport width.
- pinchZoom: on a touch device, every diagram zooms with a pinch.
- summaryMode: a compact diagram presentation for narrow screens that drops relations past one hop and assigns no confidence to an edge.

## Example space
```gwt-vocabulary
Given a Studio page whose layout holds {wideColumns:number} columns
When the page is shown {width:number} pixels wide
Then the layout holds {columns:number} columns
```
