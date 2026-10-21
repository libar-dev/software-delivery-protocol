---
id: spec:consumers.wholesale-view-rewrite
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.design-review
  dependsOn:
    - target: spec:extraction.determinism
      reason: check-clean refuses when two renders of one graph differ
---
# Every view run rewrites the view wholesale

## Intent
- outcome: Guarantee that whatever a reader finds in the view directory was produced by the last run over the current source.

## Rule
- A view run rewrites the view wholesale: no page written by an earlier run survives a later one, so a Spec that left the corpus leaves no page behind.
- Pages are written to a temporary sibling of the view directory, the previous directory is removed, and the temporary is renamed into place — one rename, so no half-written view is ever readable and no temporary survives a completed run.
- A run that cannot produce a current view removes the stale one instead of leaving it readable as current: an absent view is honest, a stale view is not.
- [#buildInvalidates] Before extraction, the shared build removes `generated/design-review/`, `generated/census/`, `generated/mermaid/` and `generated/gherkin/`, each with its temporary sibling, so a run that fails before rendering leaves no view behind; a removal failure refuses the build before extraction. Every command that enters this build, including validate and its watch runs and every publisher, has this invalidation effect, so a sibling root the command does not publish stays absent until a later publication. The Studio's root is removed beside these four, as `spec:consumers.spec-studio.publisher#rule.buildInvalidates` states.
- Under `--check-clean` the view is rendered twice from the same graph and the run refuses when the two renders diverge, removing the view it could not certify.
- Findings never withhold the view. A run whose checks report findings still writes the current view and returns the checks' own exit code, because the view is where those findings are read in context.

## Example space
```gwt-vocabulary
Given an extraction root holding {corpus:"one authored spec"|"one authored spec the extractor refuses"} and a stale view page {stalePage:string}
Given the stale page is planted {planted:"before the run"|"after the build has invalidated the view"}
When the {command:"view"|"build"} command runs at that root
Then the run exits {exitCode:number}
Then the view directory survives: {viewSurvives:boolean}
Then the view holds the current page {currentPage:string}
Then the stale page survives: {staleSurvives:boolean}
Then a temporary view sibling survives: {temporarySurvives:boolean}
```
