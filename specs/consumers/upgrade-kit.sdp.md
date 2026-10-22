---
id: spec:consumers.upgrade-kit
kind: behavior
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:consumers.authoring-on-ramp
    reason: the kit moves a whole corpus onto the capabilities the on-ramp teaches one Spec at a time
  dependsOn:
    - target: spec:consumers.intent-composition
      reason: a proposed upgrade hands off on the one change-proposal shape and is applied after its check
    - target: spec:consumers.edit-model
      reason: a carrier changes only through an agent's or a person's edit, recorded by git
    - target: spec:consumers.capability-map
      reason: the guide teaches epic organization through the capability map
    - target: spec:consumers.roadmap
      reason: the guide teaches advisory priority and the roadmap memo as planning records
---
# The upgrade kit shows a corpus what it could adopt

An adopter learns what its corpus does not use yet only by writing its own queries, as the first adopter's survey did when it counted rule keys, question fields, relation reasons and `exercises` lists one at a time. The kit answers that survey with a recipe and turns the one capability a machine can apply without an author's judgment, a key for each rule, into a change proposal. Every other capability it reports asks for intent only an author has, so the kit reports where each could apply and proposes nothing for it.

## Intent
- actor: An adopter moving a corpus onto a newer Protocol commit, or the agent working for it.
- problem: An adopter cannot see which capabilities its corpus already uses and where each could apply, so it hand-rolls the survey for every release and applies each new capability by hand.
- outcome: Report, per Spec and Pack, the Protocol capabilities a corpus uses and where each could apply, and propose the edits as a change proposal an agent applies, never editing a carrier itself.

## Behavior
- rule: [#reportsAndProposes] The kit reports and proposes and never edits: its recipes read the graph and return data, and a change reaches a carrier only as an agent's or a person's edit, applied after the proposal check and recorded by git.
- rule: [#statesNoRung] The kit states no rung, authors no fact and scores nothing: a capability it reports as unused is a place it could apply, never a finding, a gate or a quota.
- rule: [#upgradeGuide] The package ships an upgrade guide for an adopter moving its corpus onto a newer commit: it measures the corpus with capability adoption, keys its rules with the rule-key proposal, and, for each capability the report lists, names the Spec that carries its law, with capability adoption as the recipe that measures it.
- rule: [#guideTeaches] The guide teaches and states no law: each section names the Spec that carries what it teaches, and no section repeats that Spec's rules.

## Design
- guideFile: `docs/agent-surface/upgrade-guide.md`, shipped in the package beside the recipe catalog, listed in the package's files and named by `sdp --help` among the shipped on-ramps.
- guideSections: in this order: re-pin the package and check `sdp --version`; measure the corpus with capability adoption (recipe 47); organize features in epics, reading the capability map (recipe 52) and citing `spec:consumers.capability-map`; `Model upcoming work in the graph; keep review history in git and pull requests`, a roadmap Pack read with recipes 53 and 55 and intended design proposed as a change proposal checked by recipe 38, citing `spec:consumers.roadmap`, with the guidance `Unresolved intended design lives in open questions. Review disposition and acceptance remain in git and the pull request; neither becomes a graph field.`; key the rules with the rule-key proposal (recipe 48), check the proposal with the proposal check (recipe 38) and apply it through an agent's edit; for every capability in recipe 47's answer, one subsection citing its `carriedBy` Spec and recipe 47 as the measurement, naming a further recipe only when the subsection teaches a distinct next action with it and otherwise sending the reader to the carrying Spec; move rules files onto shipped recipes, recipes 25, 26, 42, 50 and 51 and the `recipes` binding; read large Packs in parts and order the waiting statements, recipes 36 and 46; publish every root with `sdp generate`; and pass a recipe's subject as `--params` data, the recipe-caller guidance the README carries.
