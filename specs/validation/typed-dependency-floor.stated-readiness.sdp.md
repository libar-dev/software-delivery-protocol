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
- assumption: The world first pairs four rule subjects stating `ready` with targets stating `defined`, one through each of `refines`, `dependsOn`, `constrainedBy`, and `decidedBy`. Each target carries the blocking open question "Is this fact settled?", derives `scoped`, and fails `no-blocking-open-questions`. Each subject still derives `ready` because the target clause reads stated readiness.
- assumption: The world also pairs every subject kind, `behavior`, `workflow`, `example`, `rule`, `constraint`, `model`, `decision`, and `contract`, with each of `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, and `supersedes`, and each target rung, `idea`, `scoped`, `defined`, and `ready`. These 192 subjects all state `ready`. These pairs have no blocking open questions. Every target in both groups resolves. `constrainedBy` targets are constraints, `decidedBy` and `supersedes` targets are decisions, and the other targets are rules.
- assumption: All probes are story-altitude Specs with declared relations and an Intent outcome. Behavior, workflow, rule, and contract subjects carry a behavior rule; example subjects carry concrete Given, When, and Then steps; constraint subjects carry a statement and target; model subjects carry a term; decision subjects carry a written decision. Targets carry the same evidence for their kind. Each target declares `dependsOn` back to its subject. No anchors are present. The expected counts include only `honesty/readiness-floor` findings, not findings from other validators.
- assumption: Every subject kind fails `typed-dependency-targets-are-defined` for `idea` and `scoped` targets across the four included relations. The `defined` and `ready` boundaries pass, and `verifies` and `supersedes` pass at every target rung. No target is missing.
```gwt
Given the typed dependency matrix {matrix: "stated-readiness"}
When the reader checks the readiness floor
Then the matrix reports {targetFailures: 64} target failures and {resolutionFailures: 0} resolution failures and {questionFailures: 4} blocking question failures
```
