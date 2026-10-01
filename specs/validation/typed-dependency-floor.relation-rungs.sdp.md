---
id: spec:validation.typed-dependency-floor.relation-rungs
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.typed-dependency-floor
  verifies: spec:validation.typed-dependency-floor
---
# Every relation reads the four stated target rungs

## Intent
- outcome: Check the relation-rungs matrix through the readiness floor.
```gwt
Given the typed dependency matrix {matrix: "relation-rungs"}
When the reader checks the readiness floor
Then the matrix reports {targetFailures: 8} target failures and {resolutionFailures: 0} resolution failures and {questionFailures: 0} blocking question failures
```
