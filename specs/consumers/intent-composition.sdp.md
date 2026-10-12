---
id: spec:consumers.intent-composition
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.edit-model
---
# Composed intent hands off on one proposal shape

The edit model, `spec:consumers.edit-model`, owns the intent, agent and git law. This Spec owns how a composing surface hands its intent off.

## Intent
- actor: A person or an agent reading a view who wants a design change made.
- problem: Each composing surface could invent its own hand-off, so a reviewer, an agent and a check would read one change in as many shapes as there are surfaces.
- outcome: Give every surface that composes scoped intent one hand-off shape, applied as an ordinary edit.

## Behavior
- rule: Every surface that composes scoped intent, including the Studio's composing panel, hands off on the one change-proposal contract, `spec:consumers.intent-composition.proposal`.
- rule: A composing surface writes no source.
- rule: [#changedScope] A composed proposal is applied after its proposal check: the applying caller sends a change whose scope changed since the base to a person instead of applying it and applies every other change as an ordinary edit, so one changed scope never holds back the whole proposal; the edit lands only from a worktree on which `sdp validate` reports no error, and the conformance and honesty checks stay the only gate.
