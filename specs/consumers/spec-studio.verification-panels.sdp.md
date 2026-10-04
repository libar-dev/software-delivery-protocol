---
id: spec:consumers.spec-studio.verification-panels
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio.spec-page
  dependsOn:
    - spec:extraction.executable-contracts
    - spec:observation.runtime-overlay
  decidedBy:
    - spec:decisions.binding-not-liveness
    - spec:decisions.verification-posture-not-realization
---
# The panels for examples, targets, verifiers and evidence

## Intent
- outcome: Show on a Spec page how far each example, constraint target and verifier goes, and what runtime evidence exists, without stating more than the graph records.
### Open questions
- [non-blocking #runResults] The original shows each test's runner, whether it passed, its duration and its last run, and offers to run an example again; the graph records that a verifier binding exists and never a run, and a static page runs nothing. Does a panel show run results read from CI output when the Studio is built, or bindings only?
- [non-blocking #coverageSource] The original reads coverage from a harness's combinations; a parent's example space types its slots and the space contract lists each example's bound point, but only a slot typed as a union of literals has a finite set of values, and harnesses are outside this Pack. Does the grid enumerate those slots only?

## Behavior
- rule: An example card shows the example's verifier as a binding that exists, and the example as an Executable Spec when a test anchor binds it, never as a test that passed.
- rule: The evidence panel shows only runtime evidence the graph records, and reads not tracked while no delivery fact records an observation.
- rule: Each action on these panels composes scoped intent and changes no source.

## UI
The panels' parts in page order.
- ruleList: each rule on its own line, followed by the example cards.
- exampleCard: one card per example: its title; its stated readiness and whether it is an Executable Spec; its given, when and then steps with their bound values; and actions to view its verifying test, open the example, and compose intent to edit it.
- unwrittenExampleCard: an example with no given, when and then steps yet says so, and offers to compose intent proposing them.
- constraintTarget: each constraint with its flavor and statement, its target drawn as a bar beside the number, and the last measured value next to it; moving the bar composes intent to change the target, and the new value shows on the page only, while the intent waits in the composing panel.
- unsetTarget: a constraint with no quantitative target says so, and offers to compose intent proposing one.
- verifierList: each verifier with its id, its binding, and its file and line as a link.
- coverageGrid: when the Spec owns an example space, one row per combination of slot values, marked covered when an example's bound point witnesses it and missing otherwise, with an action that composes intent proposing examples for the missing rows.
- evidencePanel: the last build with its SLSA attestation, the last deployment with its environment, the OpenTelemetry observation against the target with a link to the tool that holds it, and the CycloneDX SBOM to download.
