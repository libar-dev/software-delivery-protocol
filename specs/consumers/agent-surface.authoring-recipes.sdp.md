---
id: spec:consumers.agent-surface.authoring-recipes
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface
---
# Authoring questions stay executable graph recipes

## Intent
- outcome: Answer recurring maturity and verifier questions by scripting the graph rather than adding query verbs.

## Behavior
- rule: Promotion preflight reports the Spec's stated rung, floor reached, current floor failures, and both next rungs as `aboveStated` and `aboveFloor`, each with `rung`, `failures` and `firstUnmetClause`; `rung` is null at `ready`, and a typed-dependency failure carries its targets.
- rule: Declared versus enabled verifiers keeps declared example relations distinct from enabled verifier bindings.
- rule: The lower ladder groups non-ready Specs by family and reports stated readiness, floor reached, stated next rung and its first unmet clause; null means nothing blocks that rung, never automatic promotion.
