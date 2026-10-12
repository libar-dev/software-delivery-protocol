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

## Intent
- outcome: Let a person see the graph four ways, by Pack, by architecture, by verification and by evidence, from one top navigation.
### Open questions
- [non-blocking #capabilityGrouping] A capability is a projection over high-altitude behavior Specs or a Pack grouping, and an arc's Pack is named for the capability it designs. Which grouping does the capability tree use, and which graph values supply it?
  - decider: owner
  - provisional: the Packs lens groups Specs by Pack, and no capability tree is drawn
- [non-blocking #architectureVocabulary] The original's architecture lens draws runtime layers, ports and external systems beside components and their dependencies; `spec:decisions.architectural-annotation` gives a component anchor a layer and a bounded context and any code anchor a role, beside component membership and `uses`, and admits no port or external-system node. Does the lens group components by layer and context and draw only what those anchors hold?
  - links: spec:consumers.structural-mermaid#question.layerAndContext
- [non-blocking #testRunResults] The original's tests lens shows each test's last run result; a verifier binding states that a verifier exists, and pass and fail stay in CI, as `spec:decisions.binding-not-liveness` rules. Does the lens show run results read from CI output, or bindings only?
  - decider: owner
  - links: spec:observation.run-evidence
  - provisional: The first Studio build shows bindings only; admitting run records in a later phase awaits an explicit input and reproducibility ruling.
- [non-blocking #ruleCoverage] The original's tests lens names the rules of a Spec that no test exercises; a rule may carry a key, an example's `verifies` may name the keys it exercises, and recipe 34 lists each keyed rule with its examples, while the graph cannot tell which examples exercise a rule with no key. Does the lens show keyed-rule coverage with the unkeyed rules counted apart, or name the uncovered Specs only?
  - decider: owner
  - links: spec:model.rule-keys
  - provisional: the tests lens lists each keyed rule with the examples recipe 34 reports and counts the unkeyed rules apart

## Behavior
- rule: The Packs lens is the default landing page.
- rule: Clicking a component in the architecture lens opens its detail.
- rule: The evidence lens is read-only.

## UI
The lenses in the order of the top navigation.
- packsLens: a Spec-by-Spec tree grouped by Pack, with each Pack's members in authored order; any capability grouping awaits `spec:consumers.spec-studio.lenses#question.capabilityGrouping`.
- architectureLens: the graph drawn as components and their dependencies, from component membership and `uses` edges, in an embedded interactive diagram whose renderer is the open question `spec:consumers.spec-studio.components#question.embeddedDiagrams`.
- testsLens: a coverage view: for each Spec, its verifiers with their bindings, and the rules no example exercises.
- evidenceLens: the graph-recorded evidence fields and absence labels `spec:consumers.spec-studio.verification-panels` states; while the graph records no observation or other evidence, each reads not tracked.
