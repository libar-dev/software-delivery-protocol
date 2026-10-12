---
id: spec:consumers.reading-on-ramp
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface
  decidedBy: spec:decisions.agent-front-door
---
# The reading skill teaches agents to query the graph

## Intent
- outcome: Give an agent a shipped reading on-ramp that selects current graph evidence and the Spec that owns each law.

## Behavior
- rule: The skill names the closed graph node types, edge types and claims, links their carrying Specs, and moves when those contracts change.
- rule: The skill teaches how delivery facts derive and explains the limits of empty answers, keeping a binding distinct from passing tests and runtime observation.
- rule: The skill bootstraps through the Protocol repository wrapper or an adopter's package runner, selecting the appropriate root and exclusions without relying on a global `sdp`.
- rule: The skill directs the reader from a question to the numbered, named catalog recipe that answers it, passes subjects as `params`, and teaches summary and detail output without creating query verbs.
- rule: The skill links the Specs that own law and uses summaries for orientation; current graph data answers state questions and the carrying Specs answer intended truth.
- rule: The skill carries one sheet that maps a delivery task to the recipe that answers it.
