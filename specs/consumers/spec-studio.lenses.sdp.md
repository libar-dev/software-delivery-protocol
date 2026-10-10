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
    - spec:observation.runtime-overlay
  decidedBy:
    - spec:decisions.binding-not-liveness
    - spec:decisions.architectural-annotation
---
# Four lenses read the graph as Packs, architecture, tests and evidence

## Intent
- outcome: Let a reader see the graph four ways, by Pack, by architecture, by verification and by evidence, from one top navigation.
### Open questions
- [non-blocking #capabilityGrouping] The original's Packs lens groups Specs by Pack or by capability; a capability is a projection over high-altitude behavior Specs or a Pack grouping, no Capability Map projection exists, and grouping by architectural significance is derived from id families and the component graph. Which grouping does the capability tree read?
- [non-blocking #architectureVocabulary] The original's architecture lens draws runtime layers, ports and external systems beside components and their dependencies; `spec:decisions.architectural-annotation` gives a component anchor a layer and a bounded context and any code anchor a role, beside component membership and `uses`, and admits no port or external-system node. Does the lens group components by layer and context and draw only what those anchors hold?
- [non-blocking #testRunResults] The original's tests lens shows each test's last run result; a verifier binding states that a verifier exists, and pass and fail stay in CI, as `spec:decisions.binding-not-liveness` rules. Does the lens show run results read from CI output, or bindings only?
- [non-blocking #ruleCoverage] The original's tests lens names the rules of a Spec that no test exercises; an example verifies a whole Spec and a rule entry has no address, so the graph cannot tell which rule an example exercises. Does a rule gain an address, or does the lens name the uncovered Specs only?

## Behavior
- rule: The Packs lens is the default landing page.
- rule: Clicking a component in the architecture lens opens its detail.
- rule: The evidence lens is read-only.

## UI
The lenses in the order of the top navigation.
- packsLens: a Spec-by-Spec tree grouped by Pack or by capability, each Pack's members in authored order.
- architectureLens: the graph drawn as components and their dependencies, from component membership and `uses` edges, in an embedded interactive diagram whose renderer is the open question `spec:consumers.spec-studio.components#question.embeddedDiagrams`.
- testsLens: a coverage view: for each Spec, its verifiers with their bindings, and the rules no example exercises.
- evidenceLens: build provenance, SBOM links, OpenTelemetry runtime observations and deployment history.
