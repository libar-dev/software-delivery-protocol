---
id: spec:consumers.agent-surface.example-space-coverage
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface.design-recipes
  dependsOn:
    - spec:carrier.slot-notation
    - target: spec:extraction.executable-contracts
      reason: its decoded slots and bound points reuse the space-contract interpretation
---
# Example spaces report which values their examples cover

The original design rendered a coverage heatmap from each example space: which combinations of its typed slots an example witnesses and which none does (`docs/lineage/v0-design/04-authoring-surfaces.md` §4 and §4.1, `06-extraction-and-validation.md` §8). This Spec reports slot-value coverage; the glossary keeps witness for an example in an outcome class.

## Intent
- problem: The graph carries example spaces and bound points, but no reader value or recipe reports which literal slot values example children bind.
- outcome: Report each literal slot value with the example children that bind it, and each value no child binds, before code exists.

### Open questions
- [non-blocking #combinationCoverage] Is coverage per slot value enough, or does a design pass need the combinations of two or more slots, as the original heatmap drew them?
  - decider: owner
  - links: spec:consumers.spec-studio.verification-panels#ui.coverageGrid
  - provisional: the recipe reports per-slot literal-union values
- [non-blocking #coverageShape] What reader field names and decoded slot and bound-point shapes, recipe parameters and result rows, eligible-example relation policy, and treatment of an unbound slot form the coverage contract?
  - decider: owner
  - links: spec:extraction.executable-contracts
  - provisional: the tests-lens design pass settles the decoded fields and the row shape and records them as keyed Design entries before implementation

## Behavior
- rule: The engine decodes each Spec's example space into its typed slots, and each example child's steps into its bound point, once, through the notation module that writes the space contracts, and the reader carries both on the Spec context; no recipe or projection parses slot notation a second time.
- rule: Slot-value coverage is a catalog recipe over the decoded reader values, listing each literal-union value with the example children that bind it and each value no child binds.
- rule: The recipe enumerates slots typed as closed unions of quoted literals. It reports every other slot type, a boolean included, as not enumerable by this recipe, never as covered or as missing a value.
- rule: Slot-value coverage reports and confers nothing: it moves no readiness, records no verdict and emits no validation finding.
