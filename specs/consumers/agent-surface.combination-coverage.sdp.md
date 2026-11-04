---
id: spec:consumers.agent-surface.combination-coverage
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:consumers.agent-surface.example-space-coverage
---
# Which slot-value combinations example-space coverage reports

## Intent

- outcome: Report the combinations of slot values no example exercises, once a design pass needs them.

### Open questions
- [blocking #combinationCoverage] Which combinations of slot values should coverage enumerate and report?
  - decider: owner
  - provisional: keep recipe 44 limited to individual slot values
  - links: spec:consumers.agent-surface.example-space-coverage#rule.perSlotOnly
  - trigger: a design pass asks which combinations no example exercises

## Behavior
