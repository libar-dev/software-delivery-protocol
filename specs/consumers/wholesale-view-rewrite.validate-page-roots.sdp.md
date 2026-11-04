---
id: spec:consumers.wholesale-view-rewrite.validate-page-roots
kind: behavior
altitude: story
readiness: idea
relations:
  refines:
    target: spec:consumers.wholesale-view-rewrite
    reason: the question narrows the build's removal of the page roots for a validate run
---
# A validate run and the page roots it removes

`sdp validate` enters the shared build, so it removes the five generated page roots before extraction and writes none of them back. It names none of the roots it removed, so a session that runs it to read findings loses the pages it was reading without being told.

## Intent

- outcome: Let a person or a CI job that runs `sdp validate` keep the pages it was reading, or learn from the run which page roots it removed.

### Open questions
- [blocking #validatePageRoots] Should `sdp validate` keep the page roots it removes today, or name each one it removed?
  - decider: owner
  - provisional: read findings through `sdp q`'s `report`, which writes nothing, and restore removed pages with `sdp generate`
  - links: spec:consumers.wholesale-view-rewrite#rule.buildInvalidates
  - trigger: a session or CI job loses pages it still needed to a validate run

## Behavior
