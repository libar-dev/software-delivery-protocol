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
- assumption: The world has 24 single-relation rule subjects stating `ready`, one for each pairing of `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, and `supersedes` with a target stating `idea`, `scoped`, `defined`, or `ready`. Every target resolves. `constrainedBy` targets are constraints; `decidedBy` and `supersedes` targets are decisions; the other targets are rules. No Spec has a blocking open question.
- assumption: All probes are story-altitude Specs with declared relations and an Intent outcome. Rule subjects and rule targets carry a behavior rule; constraint targets carry a statement and target; decision targets carry a written decision. Each resolving target declares `dependsOn` back to its subject. No anchors are present. The expected counts include only `honesty/readiness-floor` findings, not findings from other validators.
- assumption: The four included relations each fail `typed-dependency-targets-are-defined` for their `idea` and `scoped` targets, giving eight target failures. Their `defined` and `ready` boundaries pass. `verifies` and `supersedes` pass at every target rung.
- assumption: The world also has sixteen rule subjects stating `ready`. Each pairs `refines` or `dependsOn` with `constrainedBy` or `decidedBy`. One target states `defined` and the other states `scoped`. Each pair appears with the older relation passing and the newer relation failing, and with the older relation failing and the newer relation passing, in both declaration orders. Targets have the same kinds and evidence as the single-relation probes and declare `dependsOn` back to their subject. Every mixed subject fails `typed-dependency-targets-are-defined` once and derives `defined`, regardless of declaration order.
```gwt
Given the typed dependency matrix {matrix: "relation-rungs"}
When the reader checks the readiness floor
Then the matrix reports {targetFailures: 24} target failures and {resolutionFailures: 0} resolution failures and {questionFailures: 0} blocking question failures
```
