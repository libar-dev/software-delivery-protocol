---
id: spec:observation.run-evidence.bound-file-freshness
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:observation.run-evidence
---
# When bound-file changes make run evidence stale

## Intent

- outcome: Tell a reader when a recorded run no longer speaks for the source being read because the files its verifiers bind have changed.

### Open questions
- [blocking #freshness] When should changes to bound files make recorded run evidence stale?
  - decider: owner
  - provisional: keep the current differing-commit display until a file-sensitive policy is designed
  - links: spec:observation.run-evidence
  - trigger: a reader cannot tell whether a run at another commit still applies, because nothing says whether its bound files changed since

## Behavior
