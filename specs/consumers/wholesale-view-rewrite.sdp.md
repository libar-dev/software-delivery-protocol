---
id: spec:consumers.wholesale-view-rewrite
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.design-review
  dependsOn: spec:extraction.determinism
---
# Every view run rewrites the view wholesale

## Intent
- outcome: Guarantee that whatever a reader finds in the view directory was produced by the last run over the current source.

## Rule
- A view run rewrites the view wholesale: no page written by an earlier run survives a later one, so a spec that left the corpus leaves no page behind.
- Pages are written to a temporary sibling of the view directory, the previous directory is removed, and the temporary is renamed into place — one rename, so no half-written view is ever readable and no temporary survives a completed run.
- A run that cannot produce a current view removes the stale one instead of leaving it readable as current: an absent view is honest, a stale view is not.
- The invalidation happens before rendering as well as after it: the build the run passes through removes any existing view up front, so a run that fails before rendering leaves nothing behind either.
- Under `--check-clean` the view is rendered twice from the same graph and the run refuses when the two renders diverge, removing the view it could not certify.
- Findings never withhold the view. A run whose checks report findings still writes the current view and returns the checks' own exit code, because the view is where those findings are read in context.
- The realizing entrypoint is `runView` in `src/cli/validate-view-command.ts`, with the up-front invalidation in `runBuild` in `src/cli/build-command.ts`.

## Example space
```gwt-vocabulary
Given an extraction root holding {corpus:string} and a stale view page {stalePage:string}
When the view is rendered at that root
Then the run exits {exitCode:number}
Then the view holds the current page {currentPage:string}
Then the stale page survives: {staleSurvives:boolean}
Then a temporary view sibling survives: {temporarySurvives:boolean}
```
