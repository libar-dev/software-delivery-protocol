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
- rule: [#runner] The skill bootstraps through its runner script, which runs the built CLI with the root's fixture exclusions in the Protocol source checkout and the project's installed package anywhere else, refuses with a named remedy when neither exists, and never relies on a global `sdp`; the skill also teaches the direct forms that select a root and its exclusions.
- rule: [#pairing] The skill presents `sdp q` as a complement to an agent's own search and file tools: one body answers structure, claims and derived delivery facts, and a text search then reads the lines the answer names.
- rule: [#disclosure] The skill keeps its steps, its body contract and its reading rules in a short `SKILL.md`, and discloses the rest in reference files one level below it, each reached by one pointer.
- rule: [#orientation] The skill carries the orientation queries as body files and a runner that evaluates them over one graph derivation. Each body takes its subject from `params` and derives one from the graph when none is given, so orientation runs in the Protocol checkout and in an adopter's corpus.
- rule: The skill directs the reader from a question to the numbered, named catalog recipe that answers it, passes subjects as `params`, and teaches summary and detail output without creating query verbs.
- rule: The skill links the Specs that own law and uses summaries for orientation; current graph data answers state questions and the carrying Specs answer intended truth.
- rule: The skill carries one sheet that maps a delivery task to the recipe that answers it.
