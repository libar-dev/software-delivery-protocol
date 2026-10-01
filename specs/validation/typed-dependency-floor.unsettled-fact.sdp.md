---
id: spec:validation.typed-dependency-floor.unsettled-fact
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.typed-dependency-floor
  verifies: spec:validation.typed-dependency-floor
---
# An unsettled constraint bounds ready but permits defined

## Intent
- outcome: Check the unsettled-fact matrix through the readiness floor.
```gwt
Given the typed dependency matrix {matrix: "unsettled-fact"}
When the reader checks the readiness floor
Then the matrix reports {targetFailures: 1} target failures and {resolutionFailures: 0} resolution failures and {questionFailures: 1} blocking question failures
```
