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
- assumption: The world has six rule subjects stating `ready`, one for each of `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, and `supersedes`. Each subject names a missing target. No target Spec exists, so no target states a rung or declares a reverse relation. No subject has a blocking open question.
- assumption: All subjects are story-altitude Specs with declared relations, an Intent outcome, and a behavior rule. No anchors are present. The expected counts include only `honesty/readiness-floor` findings, not findings from other validators.
- assumption: Each subject fails `all-relations-resolve` once. Missing targets never add a `typed-dependency-targets-are-defined` failure, including for the four included relations.
```gwt
Given the typed dependency matrix {matrix: "missing-targets"}
When the reader checks the readiness floor
Then the matrix reports {targetFailures: 0} target failures and {resolutionFailures: 6} resolution failures and {questionFailures: 0} blocking question failures
```
