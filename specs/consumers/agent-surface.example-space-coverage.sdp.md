---
id: spec:consumers.agent-surface.example-space-coverage
kind: behavior
altitude: story
readiness: idea
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
- [blocking #decodedSpace] A recipe body that parses step text would be a second slot-notation parser, which the extractor-only rule forbids. Should the reader decode a Spec's example space into typed slots and each example child's bound point, on the existing Spec context, so a recipe reads coverage without parsing; or should coverage ship as a projection inside the engine, beside the generated space contracts?
- [non-blocking #combinationCoverage] Is coverage per slot value enough, or does a design pass need the combinations of two or more slots, as the original heatmap drew them?
