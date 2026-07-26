---
id: spec:consumers.wholesale-view-rewrite.stale-page-removed
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.wholesale-view-rewrite
  verifies: spec:consumers.wholesale-view-rewrite
---
# A page from an earlier run does not survive the next one

## Intent
- outcome: Execute the wholesale rewrite against the case it exists for — a page whose subject the current source no longer holds.

```gwt
Given an extraction root holding {corpus: "one authored spec"} and a stale view page {stalePage: "spec/probe.departed.md"}
When the view is rendered at that root
Then the run exits {exitCode: 0}
Then the view holds the current page {currentPage: "index.md"}
Then the stale page survives: {staleSurvives: false}
Then a temporary view sibling survives: {temporarySurvives: false}
```
