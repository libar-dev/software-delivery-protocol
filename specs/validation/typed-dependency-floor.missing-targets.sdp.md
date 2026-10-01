---
id: spec:validation.typed-dependency-floor.missing-targets
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.typed-dependency-floor
  verifies: spec:validation.typed-dependency-floor
---
# Missing targets fail relation resolution once

## Intent
- outcome: Check the missing-targets matrix through the readiness floor.
```gwt
Given the typed dependency matrix {matrix: "missing-targets"}
When the reader checks the readiness floor
Then the matrix reports {targetFailures: 0} target failures and {resolutionFailures: 6} resolution failures and {questionFailures: 0} blocking question failures
```
