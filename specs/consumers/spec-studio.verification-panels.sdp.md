---
id: spec:consumers.spec-studio.verification-panels
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.spec-page
  dependsOn:
    - spec:extraction.executable-contracts
    - target: spec:consumers.agent-surface.example-space-coverage
      reason: the grid renders recipe 44's per-slot coverage
    - spec:model.rule-keys
    - target: spec:observation.run-evidence
      reason: with run records, a verifier's row adds the results recipe 45 joins from its test file
    - target: spec:consumers.spec-studio.intent-panel
      reason: each panel action gathers intent in the composing panel
  decidedBy:
    - spec:decisions.binding-not-liveness
    - spec:decisions.verification-posture-not-realization
---
# The panels for examples, targets, verifiers and evidence

The graph records that a verifier binding exists and never a run, and a static page runs nothing, so the panels show bindings and offer no run of an example. A run result shows only when the build was given run records, and then as evidence from a test file. No Spec designs a source for build attestations, deployments or bills of materials, so each reads not tracked. Moving a constraint target on a slider and running a scenario harness wait for designs of their own, as the HTML surface decision records; a panel action composes intent instead.

## Intent
- outcome: Show on a Spec page how far each example, constraint target and verifier goes, and what runtime evidence exists, without stating more than the graph records.

## Behavior
- rule: [#executableSpec] An example card shows the example's verifier as a binding that exists, and the example as an Executable Spec when a test anchor binds it, never as a test that passed.
- rule: [#bindingsOnly] A panel shows verifier bindings and states no run result of its own; with the run records input, a verifier's row adds the results recipe 45 joins from its test file, labelled as external run evidence from that file, as `spec:observation.run-evidence` states, and never as the verifier's verdict.
- rule: [#evidenceNotTracked] The evidence panel shows only runtime evidence the graph records, and reads not tracked while no delivery fact records an observation.
- rule: [#composeActions] Each panel action gathers intent in the composing panel, scoped to the Spec, the example or the entry it sits beside, and changes nothing on the page.
- rule: [#ruleCoverage] Beside each keyed rule or flow, the panel lists the examples recipe 34 reports exercising it, each linked with enabled or not enabled in words, and a keyed rule no example exercises reads `no example exercises it`; the unkeyed rules are counted after the list.
- rule: [#coverageGrid] A Spec that owns an example space shows recipe 44's coverage: each enumerable slot with each of its declared values and the examples that bind it, a value no example binds reading `no example`; each other slot with the values its examples bind and the words `not enumerable`; and the examples that leave a slot unbound.

## UI
The panels' parts in page order.
- ruleList: rules and flows in authored order, each keyed entry with its rule address, recorded carrier line and the examples that exercise it, followed by the example cards; an unrecorded line stays absent.
- exampleCard: one card per example that verifies the Spec: its title linked; its stated readiness and whether it is an Executable Spec; its given, when and then steps as preformatted text with their bound values; and actions to open the example's page and to compose intent to edit it.
- unwrittenExampleCard: an example with no given, when and then steps yet says so, and offers an action that composes intent proposing them.
- constraintTarget: each constraint with its flavor, its statement and its target as authored, and a measured value only when the graph records one, otherwise `not tracked`, with an action that composes intent to change the target.
- unsetTarget: a constraint with no target says so, and offers an action that composes intent proposing one.
- verifierList: each verifier with its id, its binding, and its recorded repository-relative file and line as text, as `spec:consumers.spec-studio.spec-page#rule.sourceText` states, no line invented for a verifier the graph does not locate; given run records, under each verifier the results joined from the test file that binds it, a test anchor's own file or, for an example, the file of the test anchor that verifies the example, each with its run, name, result in words and duration, headed `External run evidence from <file>`.
- coverageGrid: one table per enumerable slot, a row per declared value with the examples that bind it or `no example`; one line per other slot with the values bound and `not enumerable`; then `Unbound` with the examples that bind no value for a slot; and an action that composes intent proposing examples for the values no example binds.
- evidencePanel: runtime observation reads not tracked under the binding-language rule; build attestations, deployments and bills of materials show no payload and each reads not tracked until a Spec designs its source.
