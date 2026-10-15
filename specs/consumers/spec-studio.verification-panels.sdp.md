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

The graph records that a verifier binding exists and never a run, and a static page runs nothing, so the panels show bindings and no run result, and offer no run of an example. No Spec designs a source for build attestations, deployments or SBOMs, so each reads not tracked.

## Intent
- outcome: Show on a Spec page how far each example, constraint target and verifier goes, and what runtime evidence exists, without stating more than the graph records.

## Behavior
- rule: An example card shows the example's verifier as a binding that exists, and the example as an Executable Spec when a test anchor binds it, never as a test that passed.
- rule: [#bindingsOnly] A panel shows verifier bindings and no run result; run records join a panel only through `spec:observation.run-evidence`, under an input and reproducibility ruling of their own.
- rule: [#evidenceNotTracked] The evidence panel shows only runtime evidence the graph records, and reads not tracked while no delivery fact records an observation.
- rule: Each panel action gathers intent through the composing panel's contract.

## UI
The panels' parts in page order.
- ruleList: rules and flows in authored order, each keyed entry with its rule address, recorded carrier line and the examples that exercise it as recipe 34 reports, followed by the example cards; an unrecorded line stays absent.
- exampleCard: one card per example: its title; its stated readiness and whether it is an Executable Spec; its given, when and then steps with their bound values; and actions to view its verifying test, open the example, and compose intent to edit it.
- unwrittenExampleCard: an example with no given, when and then steps yet says so, and offers to compose intent proposing them.
- constraintTarget: each constraint with its flavor and statement, its target drawn as a bar beside the number, and a measured value only when the graph records one, otherwise not tracked; moving the bar composes intent to change the target, and the new value shows on the page only while the intent waits in the composing panel.
- unsetTarget: a constraint with no quantitative target says so, and offers to compose intent proposing one.
- verifierList: each verifier with its id, its binding, and its recorded repository-relative file and line as text, as `spec:consumers.spec-studio.spec-page#rule.sourceText` states; no line is invented for a verifier the graph does not locate.
- coverageGrid: when the Spec owns an example space, the per-slot coverage `spec:consumers.agent-surface.example-space-coverage` reports, listing each literal value of each slot with the examples that bind it and listing a non-literal-union slot as not enumerable; combinations of slots join the grid only when a design pass asks for them; an action composes intent proposing examples for missing values.
- evidencePanel: runtime observation reads not tracked under the binding-language rule; build attestations, deployments and SBOMs show no payload and each reads not tracked until a Spec designs its source.
