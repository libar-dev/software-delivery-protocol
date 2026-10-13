---
id: spec:consumers.spec-studio.lenses
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.components
    - spec:extraction.pack-member-order
    - target: spec:observation.runtime-overlay
      reason: future observation consumers need the observed-fact design
    - target: spec:model.rule-keys
      reason: the tests lens's rule coverage rests on rule keys
    - target: spec:consumers.spec-studio.verification-panels
      reason: the evidence lens renders the verification panels' evidence fields and absence labels
  decidedBy:
    - spec:decisions.binding-not-liveness
    - spec:decisions.architectural-annotation
---
# Four lenses read the graph as Packs, architecture, tests and evidence

A capability is read as a Pack, or as a projection over high-altitude behavior Specs that no view draws yet, so the Packs lens groups by Pack and draws no capability tree. A verifier binding states that a verifier exists, and pass and fail stay in CI, so the tests lens shows bindings and no run result.

## Intent
- outcome: Let a person see the graph four ways, by Pack, by architecture, by verification and by evidence, from one top navigation.
### Open questions
- [non-blocking #architectureVocabulary] The original's architecture lens draws runtime layers, ports and external systems beside components and their dependencies; `spec:decisions.architectural-annotation` gives a component anchor a layer and a bounded context and any code anchor a role, beside component membership and `uses`, and admits no port or external-system node. Does the lens group components by layer and context and draw only what those anchors hold?
  - links: spec:consumers.structural-mermaid#question.layerAndContext

## Behavior
- rule: The Packs lens is the default landing page.
- rule: [#packGrouping] The Packs lens groups Specs by Pack and draws no capability tree.
- rule: Clicking a component in the architecture lens opens its detail.
- rule: [#bindingsOnly] The tests lens shows verifier bindings and no run result; run records join it only through `spec:observation.run-evidence`, under an input and reproducibility ruling of their own.
- rule: The evidence lens is read-only.

## UI
The lenses in the order of the top navigation.
- packsLens: a Spec-by-Spec tree grouped by Pack, with each Pack's members in authored order, which the index page holds.
- architectureLens: the graph drawn as components and their dependencies, from component membership and `uses` edges, in an embedded interactive diagram whose renderer follows `spec:consumers.spec-studio.components#rule.diagramRenderer`.
- testsLens: a coverage view: for each Spec, its verifiers with their bindings, then each keyed rule with the examples recipe 34 reports as exercising it, with the unkeyed rules counted apart.
- evidenceLens: the graph-recorded evidence fields and absence labels `spec:consumers.spec-studio.verification-panels` states; while the graph records no observation or other evidence, each reads not tracked.
