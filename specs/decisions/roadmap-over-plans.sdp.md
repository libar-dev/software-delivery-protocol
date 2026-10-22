---
id: spec:decisions.roadmap-over-plans
kind: decision
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:decisions.planning-truths-placement
    reason: narrows what a plan file may still carry once a roadmap holds priority
---
# Plan files stop carrying forward planning once the roadmap does

## Intent

- outcome: Decide whether the Protocol retires its numbered plan files as the carrier of forward planning, reading its next work from the roadmap instead, and what replaces the gate that requires a current plan.

### Open questions

- [blocking #planCarrier] Does the roadmap replace the numbered plan as the record an agent reads first, with `plans/` kept as frozen history?
  - decider: owner
  - provisional: yes; the handbook names the roadmap recipe, and the arc's execution record moves to its pull request description
