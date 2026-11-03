---
id: spec:consumers.ai-assisted-reading
kind: behavior
altitude: story
readiness: idea
relations:
  refines:
    target: spec:consumers.projections-model
    reason: the boundary is drawn against the projection law, a pure function of the graph
  dependsOn:
    - target: spec:extraction.claim-taxonomy
      reason: each graph claim carries one of the three claim categories
    - target: spec:consumers.spec-studio
      reason: the Studio reads only the graph and its named inputs
    - target: spec:decisions.shipped-projections-frozen
      reason: the shipped projections stay frozen
---
# A boundary for assistant-written presentation

Every reading the Protocol ships is a deterministic function of the graph and the inputs a caller names, as founding principle P3, deterministic derivation, requires. An assistant that only selects one of those readings keeps that property; one that writes explanations or arrangements of its own does not, so its output needs a contract before it reaches a reader.

## Intent

- outcome: Let a reader ask for a useful existing reading and inspect why it was selected and what scope it omits.

### Open questions
- [blocking #aiPresentationBoundary] If an assistant generates explanations or arrangements beyond selecting deterministic readings, what contract keeps its output distinct from graph claims and makes the exact reading reviewable, including how the exact output is retained with its model, prompt and inputs?
  - decider: owner
  - provisional: Select existing deterministic readings only; any generated text stays outside the Studio and the frozen projections, labelled as assistant output with its source commit and scope, and adds no claim, fact or validator.
  - links: spec:consumers.projections-model, spec:extraction.claim-taxonomy, spec:decisions.shipped-projections-frozen, spec:consumers.spec-studio#rule.namedInputs
  - trigger: the UX design pass measures that assistant selection or a generated explanation helps a named review task

## Behavior
