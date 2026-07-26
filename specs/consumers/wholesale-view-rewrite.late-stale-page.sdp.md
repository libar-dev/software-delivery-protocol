---
id: spec:consumers.wholesale-view-rewrite.late-stale-page
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.wholesale-view-rewrite
  verifies: spec:consumers.wholesale-view-rewrite
---
# A page the build's invalidation never saw still does not survive the swap

## Intent
- outcome: Execute the swap against a page the up-front invalidation cannot have removed, so the rename into place is what evicts it.

```gwt
Given an extraction root holding {corpus: "one authored spec"} and a stale view page {stalePage: "spec/probe.departed.md"}
Given the stale page is planted {planted: "after the build has invalidated the view"}
When the {command: "view"} command runs at that root
Then the run exits {exitCode: 0}
Then the view directory survives: {viewSurvives: true}
Then the view holds the current page {currentPage: "index.md"}
Then the stale page survives: {staleSurvives: false}
Then a temporary view sibling survives: {temporarySurvives: false}
```
