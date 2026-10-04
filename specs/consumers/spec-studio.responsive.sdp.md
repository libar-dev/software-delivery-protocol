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

## Intent
- actor: A product manager or an executive reviewing a design on a phone.
- outcome: Let a design be reviewed on a phone through the same pages a desktop shows.
### Open questions
- [non-blocking #summaryMode] The original's summary mode hides low-confidence inferred edges; a claim is declared, anchored or inferred and carries no confidence, and the curated graph holds no inferred edge, which only the aspirational impact graph would add. What does summary mode hide?

## Behavior
- rule: Every page of the Studio is responsive, so the same pages serve a desktop and a phone.

## UI
- singleColumn: below about 720 pixels wide, every layout collapses to a single column.
- pinchZoom: on a touch device, every diagram zooms with a pinch.
- summaryMode: below a set screen width, the trace graph and the component diagrams switch to a summary mode that hides low-confidence inferred edges.

## Example space
```gwt-vocabulary
Given a Studio page whose layout holds {wideColumns:number} columns
When the page is shown {width:number} pixels wide
Then the layout holds {columns:number} columns
```
