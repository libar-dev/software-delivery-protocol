---
id: spec:consumers.wholesale-view-rewrite.failed-run-view-removed
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.wholesale-view-rewrite
  verifies: spec:consumers.wholesale-view-rewrite
---
# A run that cannot produce a current view leaves no view at all

## Intent
- outcome: Execute the honest-absence half of the law on a run that fails before it can render, where leaving the old view would read as current.

```gwt
Given an extraction root holding {corpus: "one authored spec the extractor refuses"} and a stale view page {stalePage: "spec/probe.departed.md"}
Given the stale page is planted {planted: "after the build has invalidated the view"}
When the {command: "view"} command runs at that root
Then the run exits {exitCode: 1}
Then the view directory survives: {viewSurvives: false}
Then the stale page survives: {staleSurvives: false}
Then a temporary view sibling survives: {temporarySurvives: false}
```
