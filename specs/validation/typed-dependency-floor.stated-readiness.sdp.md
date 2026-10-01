---
id: spec:validation.typed-dependency-floor.stated-readiness
kind: example
altitude: story
readiness: defined
relations:
  refines: spec:validation.typed-dependency-floor
  verifies: spec:validation.typed-dependency-floor
---
# Target floor failures do not propagate across dependencies

## Intent
- outcome: Check the stated-readiness matrix through the readiness floor.
```gwt
Given the typed dependency matrix {matrix: "stated-readiness"}
When the reader checks the readiness floor
Then the matrix reports {targetFailures: 0} target failures and {resolutionFailures: 0} resolution failures and {questionFailures: 4} blocking question failures
```
