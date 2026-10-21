---
id: spec:consumers.spec-studio.lenses.architecture
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.lenses
  dependsOn:
    - target: spec:consumers.spec-studio.diagrams
      reason: the lens's drawings are the architecture grid and the member diagrams
    - target: spec:model.planned-architecture
      reason: planned components come from the component designs recipe 43 reads
  decidedBy:
    target: spec:decisions.architectural-annotation
    reason: the lens draws only what component anchors state, membership, uses, layer, context and role
---
# The architecture lens draws components by context and layer, the planned beside the built

The original's architecture lens drew runtime layers, ports and external systems beside components. The graph holds what the architectural annotation decision admits: a component anchor's layer and bounded context, any unit's role, membership and `uses`, and no port or external-system node. So the lens groups components by their recorded context and layer and draws membership and `uses` only. A design ahead of its code states its components in component designs, which no anchor realizes yet; the lens draws them in the same grid, marked planned, so a reader sees what is designed and not built where it will sit.

## Intent
- outcome: Let a person see the components the code realizes and the components the design plans, grouped by bounded context and layer, with what each uses and what it holds.

## Behavior
- rule: [#contextAndLayer] The lens draws every component the anchors realize, from recipe 17's component rows and the attributes the `componentRows` entry adds to them, grouped by its recorded context and layer as the architecture grid of `spec:consumers.spec-studio.diagrams` places it, and folds above the bound as that Spec states.
- rule: [#membershipAndUses] The lens draws component membership, as the member count in each box, and `uses`, as edges between components, and nothing else: no port, external system, runtime layer or import the impact graph infers.
- rule: [#plannedApart] Each component design no anchor realizes, a row of recipe 43's `unrealized` list, draws in the same grid by its planned context and layer as a planned box, with the uses it plans drawn dashed to the components it names, and is listed again in a `Designed, not built` section apart from the realized components; a planned use naming a component the lens draws no box for draws no edge and stays listed in its design's row.
- rule: [#differences] A realized component whose design differs from it lists each differing field, as recipe 43's `differing` rows give it, with its planned and realized values in its detail, and a design value recipe 43 cannot read lists in the `Designed, not built` section as unreadable.
- rule: [#componentDetail] Each realized component has a detail section on the lens page whose element id is its id, which its box and every link to it from another page open: its id, label, layer, context and role; its recorded file and line as text with a copy action; its members, each with its id, label, role and recorded file and line; the components it uses and is used by, each with the count of unit edges; the Specs it and its members satisfy and reference, linked, a component design its anchor satisfies among them; and its member diagram, every value read from its recipe 17 row.
- rule: [#codeRootedHere] A component diagram rooted at code units, the view `spec:consumers.structural-mermaid` asked for, is this lens's member diagram, and the shipped Mermaid root draws none.
- rule: [#unresolvedStructure] A `memberOf` target the graph holds no component for, and a `uses` edge an end of which resolves to no component, list in an `Unresolved structure` section as recipe 17 reports them, never dropped.
- rule: [#lensSummary] The page opens with sentences the build counts from the two recipes' answers: the components realized and planned, the contexts and layers they state, the uses edges between components, and the designs that differ from their components.

## UI
- architecturePage: in order, the page title `Architecture`, the summary sentences, the architecture diagram or its fold with one section per context, the `Designed, not built` section, the component details in id order, and the `Unresolved structure` section when it has rows.
- designedNotBuilt: a table with one row per unrealized design in Spec id order: the component design's Spec, linked; the planned component's id as code; its planned context, layer and role, or `not stated`; the components it plans to use; and whether its component anchor exists without satisfying it.
- componentDetail: a heading with the component's id as code and its label, a line with its layer, context and role in words, its file and line with a copy action, then lists headed Members, Uses, Used by, Satisfies and References, an empty list reading None, then the member diagram.

## Design
- componentRows: `{ label: string | null; file: string | null; line: number | null; role: string | null; layer: string | null; context: string | null; referencedSpecs: string[]; usesCounts: { component: string; edges: number }[]; usedByCounts: { component: string; edges: number }[] }`, the fields recipe 17 adds to each component row: the component's own label, file, line, role, layer and context as its CodeNode records them, each null when the node records none or no node declares the component; the Specs the component and its members reference, sorted; and, sorted by component, the count of unit `uses` edges behind each pair `usesOut` and `usedBy` name. Each member row gains `role: string | null`, and every field the recipe returns today keeps its meaning.

## Example space
```gwt-vocabulary
Given component anchors that realize {realized:number} components in the context {context:string} and the layer {layer:"edge"|"application"|"domain"|"adapter"|"infrastructure"}
Given component designs that plan {planned:number} more components in that context and layer, which no anchor realizes
When the build renders the architecture lens
Then the context's column holds {boxes:number} component boxes in the layer's band
Then the diagram marks {plannedBoxes:number} boxes planned
Then the Designed, not built section lists {listed:number} component designs
```
