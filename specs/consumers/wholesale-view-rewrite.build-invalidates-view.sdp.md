---
id: spec:consumers.wholesale-view-rewrite.build-invalidates-view
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.wholesale-view-rewrite
  verifies: spec:consumers.wholesale-view-rewrite
---
# A build that never renders still takes the old view down

## Intent
- outcome: Execute the up-front half of the invalidation on a command that writes no view, where a surviving directory would describe a graph that has moved.

```gwt
Given an extraction root holding {corpus: "one authored spec"} and a stale view page {stalePage: "spec/probe.departed.md"}
Given the stale page is planted {planted: "before the run"}
When the {command: "build"} command runs at that root
Then the run exits {exitCode: 0}
Then the view directory survives: {viewSurvives: false}
Then the stale page survives: {staleSurvives: false}
Then a temporary view sibling survives: {temporarySurvives: false}
```
