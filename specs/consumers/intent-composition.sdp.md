---
id: spec:consumers.intent-composition
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.edit-model
---
# Composed intent hands off on one proposal shape

## Intent
- actor: A person or an agent reading a view who wants a design change made.
- problem: Each composing surface could invent its own hand-off, so a reviewer, an agent and a check would read one change in as many shapes as there are surfaces.
- outcome: Give every surface that composes scoped intent one hand-off shape, applied as an ordinary edit.

## Behavior
- rule: `spec:consumers.edit-model` owns the settled intent, agent and git law; this Spec owns how a composing surface hands its intent off.
- rule: Every surface that composes scoped intent, the Studio's composing panel first, hands off on the one change-proposal contract, `spec:consumers.intent-composition.proposal`.
- rule: A composing surface writes no source, and its hand-off is applied as an ordinary edit under the edit model.
