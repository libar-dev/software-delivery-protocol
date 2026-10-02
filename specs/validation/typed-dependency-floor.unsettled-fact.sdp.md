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
- assumption: The world has three rule subjects, each declaring `constrainedBy` on its own resolving constraint target. The first subject states `defined` and its target states `scoped`; the second subject states `ready` and its target states `scoped`; the third subject states `defined` and its target states `defined`. Each target carries the blocking open question "Is this fact settled?". The subjects have no blocking open questions.
- assumption: All probes are story-altitude Specs with declared relations and an Intent outcome. Each rule subject carries a behavior rule, and each constraint target carries a statement and target. Each resolving target declares `dependsOn` back to its subject. No anchors are present. The expected counts include only `honesty/readiness-floor` findings, not findings from other validators.
- assumption: All three targets derive `scoped`. The first subject lawfully states `defined`; the second fails `typed-dependency-targets-are-defined`; the third target alone fails `no-blocking-open-questions` for stating `defined`. Both subjects with `scoped` targets derive `defined`, while the third derives `ready` because the target clause reads the target's stated rung. No target is missing.
```gwt
Given the typed dependency matrix {matrix: "unsettled-fact"}
When the reader checks the readiness floor
Then the matrix reports {targetFailures: 1} target failures and {resolutionFailures: 0} resolution failures and {questionFailures: 1} blocking question failures
```
