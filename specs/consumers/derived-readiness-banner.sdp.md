---
id: spec:consumers.derived-readiness-banner
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.design-review
  dependsOn: spec:validation.readiness-floor
---
# Derived readiness renders beside the stated rung and warns in one direction

## Intent
- outcome: Show a reader where a Spec's stated maturity stands against the structure it earns, without turning a floor into a quota.

## Rule
- Derived readiness is the highest rung whose cumulative floor clauses pass. It is computed from the graph, rendered beside the author's statement, and never overwrites it.
- Every spec page renders the stated rung beside the floor reached, on one line, whether or not the two agree; the index and the pack member table carry the same pair as two columns.
- The divergence banner is raised only in the dishonest direction — the floor reached standing below the stated rung. A floor reached at or above the stated rung raises nothing, because a floor is a floor and never a quota that nags upward.
- A raised banner names the first unmet clause by its clause id and its description, so the reader is told which clause to satisfy rather than only that something is wrong.
- When even the `idea` floor is unmet, the floor reached renders as none rather than as a rung, and a raised banner states that the floor stands below `idea`.
- The banner is rendering, never a check: the same divergence is already the readiness floor's own finding, and the page shows it in context rather than gating on it.
- The realizing entrypoint is `renderReadiness` in `src/projections/design-review-context.ts`; the rung it renders is the derived readiness the one clause table yields.

## Example space
```gwt-vocabulary
Given the graph holds a rule spec {specId:string} whose stated readiness is {statedReadiness:"scoped"|"ready"}
Given the spec {structure:"clears every floor clause"|"records a blocking open question"}
When the Design Review renders the graph
Then the spec page renders the floor reached {floorReached:"scoped"|"ready"}
Then the divergence banner is raised: {bannerRaised:boolean}
Then the banner names the first unmet clause {clauseId:string}
```
