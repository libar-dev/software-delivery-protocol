---
id: spec:consumers.spec-studio.verification-panels
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio.spec-page
  dependsOn:
    - spec:extraction.executable-contracts
    - target: spec:observation.runtime-overlay
      reason: future observation consumers need the observed-fact design
    - target: spec:consumers.agent-surface.example-space-coverage
      reason: the grid consumes its decoded per-slot coverage report
    - spec:model.rule-keys
  decidedBy:
    - spec:decisions.binding-not-liveness
    - spec:decisions.verification-posture-not-realization
---
# The panels for examples, targets, verifiers and evidence

## Intent
- outcome: Show on a Spec page how far each example, constraint target and verifier goes, and what runtime evidence exists, without stating more than the graph records.
### Open questions
- [non-blocking #runResults] The original shows each test's runner, whether it passed, its duration and its last run, and offers to run an example again; the graph records that a verifier binding exists and never a run, and a static page runs nothing. Does a panel show run results read from CI output when the Studio is built, or bindings only?
  - decider: owner
  - links: spec:observation.run-evidence
  - provisional: The first Studio build shows bindings only; admitting run records in a later phase awaits an explicit input and reproducibility ruling.
- [non-blocking #coverageSource] Is per-slot coverage sufficient for the Studio grid, or does it need the combinations still open in spec:consumers.agent-surface.example-space-coverage#question.combinationCoverage?
  - decider: owner
  - links: spec:consumers.agent-surface.example-space-coverage#question.combinationCoverage
  - provisional: per-slot coverage for the grid; combinations wait for an adopter's design pass
- [non-blocking #deliveryArtifacts] The original's evidence panel shows the last build with its SLSA attestation, the last deployment and a CycloneDX SBOM; no Spec designs a source for any of them. Does the Studio show them, and from which input?
  - decider: owner
  - provisional: each reads not tracked until a Spec designs its source

## Behavior
- rule: An example card shows the example's verifier as a binding that exists, and the example as an Executable Spec when a test anchor binds it, never as a test that passed.
- rule: [#evidenceNotTracked] The evidence panel shows only runtime evidence the graph records, and reads not tracked while no delivery fact records an observation.
- rule: Each panel action gathers intent through the composing panel's contract.

## UI
The panels' parts in page order.
- ruleList: rules and flows in authored order, each keyed entry with its rule address, recorded carrier line and the examples that exercise it as recipe 34 reports, followed by the example cards; an unrecorded line stays absent.
- exampleCard: one card per example: its title; its stated readiness and whether it is an Executable Spec; its given, when and then steps with their bound values; and actions to view its verifying test, open the example, and compose intent to edit it.
- unwrittenExampleCard: an example with no given, when and then steps yet says so, and offers to compose intent proposing them.
- constraintTarget: each constraint with its flavor and statement, its target drawn as a bar beside the number, and a measured value only when the graph records one, otherwise not tracked; moving the bar composes intent to change the target, and the new value shows on the page only while the intent waits in the composing panel.
- unsetTarget: a constraint with no quantitative target says so, and offers to compose intent proposing one.
- verifierList: each verifier with its id, its binding, and its recorded repository-relative file and line; no line is invented for a verifier the graph does not locate, and source navigation awaits `spec:consumers.spec-studio.spec-page#question.sourceLinks`.
- coverageGrid: when the Spec owns an example space, the coverage `spec:consumers.agent-surface.example-space-coverage` reports, listing each literal value of each slot with the examples that bind it and listing a non-literal-union slot as not enumerable; an action composes intent proposing examples for missing values.
- evidencePanel: runtime observation reads not tracked under the binding-language rule; build attestations, deployments and SBOMs show no payload while the graph has no designed record for them, and each reads not tracked instead.
