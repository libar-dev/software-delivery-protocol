---
id: spec:consumers.spec-studio.diagram-kinds.scoped-architecture
kind: behavior
altitude: story
readiness: ready
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
- rule: [#scopeInput] Read the design slice's `architecture` answer: `components` with how the slice reaches each, in words, members' satisfying code, members' referencing code or what the slice rests on; `designs` with their declared values, realization and comparison rows, each drawn as a planned box; `uses` with the unit edges behind each count and its outside mark; `plannedUses`; `outside`; and `unplaced`. The drawing resolves no unit to a component itself and recomputes none of them; the unplaced units remain listed apart.
- rule: [#separatePlans] Draw anchored components and component designs as separate identities, even when the realization comparison joins them. Planned layer, context and uses stay declared; realized structure stays anchored; a difference is labelled rather than merged away.
- rule: [#boundary] Draw only the uses boundary the supplied design-slice architecture answer includes; never traverse it in layout. Its `uses` includes anchored pairs between touched components and pairs with one immediate outside neighbour, marked `outside: true`, as `spec:consumers.design-slice#rule.outsideNeighbors` states. Fold supplied outside neighbours into one `outside scope` box per context and layer while keeping their identities and original unit edges in the text equivalent; never add pairs between two outside components. Planned uses remain separate and never increase an anchored count.
- rule: [#bound] Apply the shared architecture folds by context then layer to this selected graph. If no component or planned design resolves, show the empty explanation and unassigned units instead of a blank or invented architecture.

## Design
- layout: Use the architecture grid's context columns and layer bands, with the legibility child's title-first boxes, cell wrapping and local scroll. Prefix planned boxes with `planned`; outside-scope boxes say `outside scope`.
- edgeWords: The legend reads `Arrows: uses (anchored).` and, when planned uses are drawn, `Dashed arrows: plans to use (declared).`; edges carry no per-edge label. A realization correspondence is its own labelled link, never a uses edge or a delivery fact.
- textEquivalent: List each component's full id, label, layer, context and the scoped Spec and binding kind that brought it in; list unassigned units, unreadable declarations, planned-to-realized comparisons and every original uses edge.
- elementIds: Use `diagram.<subject>.architecture.text` and `.architecture.arrow`; context and layer folds append their encoded full key before the suffix.
- mermaidKind: `block` with generic component boxes and uses arrows for a purely anchored grid; use `flowchart TB` with explicit declared and anchored labels when planned, comparison or folded edges cannot be preserved by block syntax. Architecture icons never infer deployment meaning.
