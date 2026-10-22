---
id: spec:consumers.spec-studio.diagram-kinds.scoped-architecture
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
  dependsOn:
    - spec:consumers.design-slice
    - spec:model.planned-architecture
    - spec:consumers.spec-studio.lenses.architecture
---
# A Spec set draws the architecture it touches

## Intent
- outcome: Review a Pack, slice or roadmap's realized and planned seams together while seeing exactly why each component is present.

## Behavior
- rule: [#scopeInput] Read the slice's explicit scope, touched components, binding reasons, planned declarations and uses boundary. Resolve satisfying and referencing code to its component directly or through memberOf; a reference means answers to design, never realization. Unassigned units remain named apart rather than acquiring an inferred component.
- rule: [#separatePlans] Draw anchored components and component designs as separate identities, even when the realization comparison joins them. Planned layer, context and uses stay declared; realized structure stays anchored; a difference is labelled rather than merged away.
- rule: [#boundary] Include the immediate uses neighbors of touched components as context, labelled outside scope, with no recursive reach. Every aggregated uses count names its original unit edges in the text; planned uses never increase an anchored count.
- rule: [#bound] Apply the shared architecture folds by context then layer to this selected graph. If no component or planned design resolves, show the empty explanation and unassigned units instead of a blank or invented architecture.

## Design
- layout: Use the architecture grid's context columns and layer bands, with the legibility child's title-first boxes, cell wrapping and local scroll. Prefix planned boxes with `planned`; outside-scope boxes say `outside scope`.
- edgeWords: Solid arrows read `uses, anchored`; dashed arrows read `plans to use, declared`. A realization correspondence is its own labelled link, never a uses edge or a delivery fact.
- textEquivalent: List each component's full id, label, layer, context and the scoped Spec and binding kind that brought it in; list unassigned units, unreadable declarations, planned-to-realized comparisons and every original uses edge.
- elementIds: Use `diagram.<subject>.scoped-architecture.text` and `.scoped-architecture.arrow`; context and layer folds append their encoded full key before the suffix.
- mermaidKind: `block-beta` with generic component boxes and labelled uses arrows for a purely anchored grid; use `flowchart TB` with explicit declared and anchored labels when planned, comparison or folded edges cannot be preserved by block syntax. Architecture icons never infer deployment meaning.
