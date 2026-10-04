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
- rule: Promotion preflight reports the Spec's stated rung, floor reached, any current unmet floor clause, and the unmet clauses of the rung above the floor reached, a typed-dependency failure with its targets.
- rule: The verifier audit keeps declared example relations distinct from enabled verifier bindings.
- rule: The lower-ladder view groups non-ready Specs by family and reports their next graph-visible unmet clause without treating an empty failure list as automatic promotion.
