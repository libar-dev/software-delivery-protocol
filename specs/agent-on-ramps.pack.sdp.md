---
id: pack:agent-on-ramps-v1
specs:
  - spec:consumers.shipped-protocol-corpus
  - spec:decisions.agent-plugin-package
  - spec:decisions.session-start-hook
  - spec:consumers.reading-on-ramp
  - spec:consumers.agent-surface.register-recipes
  - spec:consumers.agent-surface.answer-shapes
  - spec:consumers.agent-surface.evaluation-sink
  - spec:consumers.agent-surface
  - spec:consumers.agent-surface.demand-map-entries
  - spec:consumers.agent-surface.scripted-context-body
  - spec:consumers.authoring-on-ramp
  - spec:consumers.adopter-on-ramp
  - spec:model.open-question-fields
  - spec:consumers.delivery-session-on-ramp
  - spec:consumers.graph-first-planning
  - spec:consumers.intent-composition
  - spec:consumers.studio-on-ramp
  - spec:consumers.vault-on-ramp
  - spec:consumers.wholesale-view-rewrite
  - spec:consumers.wholesale-view-rewrite.validate-page-roots
  - spec:model.anchors.markdown-deliverable
---
# Agent on-ramps

The on-ramps that let an agent turn intent straight into Specs, with no prose specification in between: five skills shipped with the package, one each for reading the graph, authoring Specs, doing a session's delivery work, publishing the Studio and keeping the vault. First the package as a portable Agent Plugin: what it ships and the one shape every skill keeps, the ruling that the package root is the plugin, and the session-start hook that puts the graph's orientation answers in a session's context. Then the reading skill and the engine it teaches: the law a Spec rests on, recipe 56; the recipe catalog sorted into categories; and the hint and catalog listing `sdp q` prints, with the agent surface and its two examples that now expect that hint. Then the authoring skill, an adopter's path through it and the open-question fields it teaches, whose refusals the arc names extraction errors; the sessions skill, with the planning rules and the step that applies a received change proposal; and the Studio and vault skills. Then the rule that every build removes the generated page roots, which each skill warns about, with its new rule for files an operating system writes there. Last, two questions the arc leaves to the owner: whether a validate run should keep or name the page roots it removes, and whether a Markdown deliverable, such as a skill, should carry its own anchor. Pack design, recipe 29, shows each member's rungs, design columns and code bindings; the design diff, recipe 35, shows what the arc changed from its base.
