---
id: spec:consumers.agent-surface.example-space-coverage
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface.design-recipes
  dependsOn: spec:carrier.slot-notation
---
# Example spaces report which values their examples cover

The original design rendered a coverage heatmap from each example space: which combinations of its typed slots an example witnesses and which none does (`docs/lineage/v0-design/04-authoring-surfaces.md` §4 and §4.1, `06-extraction-and-validation.md` §8). The Protocol ratified the terms witness and coverage gap and computes neither, so a designer cannot see, before code exists, which examples a space still lacks.

## Intent
- problem: A parent's example space declares literal-union slots and its example children bind one point each, but no recipe or reader value says which literal values the children witness and which no child does.
- outcome: Report, for every example space, each literal slot value with the children that witness it and the values no child witnesses, so a design pass sees its missing examples before code exists.

### Open questions
- [non-blocking #combinationCoverage] Is coverage per slot value enough, or does a design pass need the combinations of two or more slots, as the original heatmap drew them?

## Behavior
- rule: The engine decodes each Spec's example space into its typed slots, and each example child's steps into its bound point, once, through the notation module that writes the space contracts, and the reader carries both on the Spec context; no recipe or projection parses slot notation a second time.
- rule: Coverage is a catalog recipe over the decoded values: for each slot typed as a union of literals, each value with the example children whose bound point witnesses it, and the values no child witnesses.
- rule: A slot that is not a union of literals has no finite set of values, and coverage reports it as not enumerable rather than as covered or as a coverage gap.
- rule: Coverage reports and confers nothing: it moves no readiness, records no verdict, and a coverage gap is what a design pass reads, never a validation finding.
