---
id: spec:consumers.adopter-on-ramp
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.authoring-on-ramp
  dependsOn: spec:validation.typed-dependency-floor
  decidedBy:
    - spec:decisions.planning-truths-placement
    - spec:decisions.decision-readiness-posture
---
# An adopter learns the ruled graph homes from the shipped on-ramps

## Intent
- problem: An adopter that follows the shipped on-ramps cannot learn where a deferral, an unsettled fact, a ruling awaiting its owner, a probe, or a count belongs, so it invents marker conventions, hand-kept registers, and scripts that keep them true.
- outcome: Teach each ruled home in the shipped skills, one line each with its carrying Spec, so an adopter states those truths in the graph and not beside it.

## Behavior
- rule: The authoring skill teaches a deferral as a blocking open question that names its re-entry trigger, plus `dependsOn` for a true precondition. The floor then holds the Spec below `defined` without a marker, and because readiness is independent across refinement, the deferred Spec's own example children still state the rung their bound points clear.
- rule: It teaches an unsettled fact as a constraint Spec that records a blocking open question naming its probe. Specs bounded by it declare `constrainedBy`, and the floor refuses their `ready` statement.
- rule: It teaches a ruling that awaits its owner as a decision Spec below `ready`, with `decidedBy` from each Spec the ruling shapes.
- rule: It teaches a probe as an example that `verifies` its fact. `has-verifier` is derived once a test anchor binds the example, and a probed status is never authored.
- rule: It teaches that counts, registers, and review scope are derived. Census counts come from `sdp census`, open-question and mention registers from catalog recipes, and delta review scope from changed-file blast radius. None is quoted into prose.
- rule: `sdp --help` names the shipped skills, the recipe catalog, and the Protocol's own `specs/` by package-relative path, so an operator who reaches the CLI without a package runner still finds the on-ramps and the law they cite.
- rule: The skills teach and never check. No validator reads an adopter's marker convention, and an adopter's own policy checks stay the adopter's.
