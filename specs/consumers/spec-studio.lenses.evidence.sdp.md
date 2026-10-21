---
id: spec:consumers.spec-studio.lenses.evidence
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.lenses
  dependsOn:
    target: spec:observation.runtime-overlay
    reason: an observation the graph records would be the first evidence this lens shows
  decidedBy: spec:decisions.binding-not-liveness
---
# The evidence lens names each source of runtime evidence and reads it as not tracked

The graph derives no observation yet, and no Spec designs a source for build attestations, deployments or bills of materials, so every row of this lens reads not tracked. The lens stays in the navigation so a reader sees what is not tracked rather than assuming it is.

## Intent
- outcome: Let a person see which kinds of runtime evidence the Studio could show, and that none is tracked until the graph records it.

## Behavior
- rule: [#notTracked] The lens lists four sources, runtime observation, build attestations, deployments and software bills of materials, and reads each as not tracked: no delivery fact records an observation, and no Spec designs a source for the other three.
- rule: [#noInvention] The lens shows no payload, measurement or state it was not given, and never says that a Spec is live, deployed or attested.
- rule: [#runsElsewhere] CI run records are test evidence: they show in the tests lens and on the runs page when the build is given them, and never in this lens.

## UI
- evidenceList: one line per source, its name, then `not tracked`, then what would bring it in: an observation the graph records against a measurable target, or a Spec that designs the source.
