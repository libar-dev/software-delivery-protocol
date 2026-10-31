---
id: spec:consumers.spec-studio.diagram-kinds.dependency
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
  dependsOn: spec:consumers.design-slice
---
# A dependency drawing shows the declared footing of a Spec set

## Intent
- outcome: See multi-hop dependency chains and cycles within a Pack, slice or roadmap without reading them as an execution schedule.

## Behavior
- rule: [#declaredOnly] Draw the design slice answer's structure edges and rests-on boundary, preserving each declared refines, dependsOn, constrainedBy and decidedBy relation's exact direction, reason and claim. The design slice owns its rests-on exception for a refines back to a member that names it by another typed relation: such an edge carries `orders: false`, is drawn dashed and says in its legend and text that it orders nothing. Membership is scope, never a dependency.
- rule: [#depth] Band each member by the depth its supplied answer gives, the design slice's `depth` for a Pack, slice or roadmap scope; the layout never recomputes it. A cycle's members share one band and are named as a cycle in words.
- rule: [#boundary] Show immediate dependencies outside the supplied scope in a separate boundary band, without traversing their dependencies. An unresolved target is named unresolved and has no invented title or link.
- rule: [#fold] The boundary band always folds into one box per relation type that names its count, keeping as its own box each outside Spec that holds a member's stated next rung or states below defined, and every folded Spec stays a row of the text equivalent; above the shared bound, whole depth bands fold in descending box count, ties by ascending depth; if the drawing still exceeds the bound, the SVG is omitted and the text equivalent opens.
- rule: [#examplesInParent] An example member the design slice folds into its parent is counted on that parent's box and is never drawn as its own box; it keeps its row in the text equivalent. An example the slice does not fold is a box like any other member's.

## Design
- inputs: `subject` and the design slice answer supply ordered members, exampleOf, exampleMembers, depth, cycles, structure edges and the rests-on boundary with its holds and relation reasons; a roadmap passes its explicitly selected ordered Spec set to that same reader. Duplicate or unknown scope ids are that reader's diagnostics, never repaired by layout.
- bands: Label bands `Depth <n>` from the deepest at the top down to depth 1, then `Outside this scope` at the bottom, so a member sits above what it rests on and boundary edges stay short. Within a band keep supplied order. Depths are structural, never phases, dates or priority.
- edgeWords: Show refines, dependsOn, constrainedBy and decidedBy beside their arrow or as a keyed legend where several kinds occur, and in the text equivalent with claim and optional reason. Mixed relations cannot become an unlabeled dependency arrow. Arrows with the same ends, claim and ordering may combine into one arrow naming every relation; the text equivalent retains each original relation and reason.
- textEquivalent: List every scoped and boundary Spec with its full id and title, then every original edge and every cycle's members; folding removes no text row.
- elementIds: Use `diagram.<subject>.dependencies.text`, `.dependencies.arrow` and `.dependencies.fold.<depth>`; a second scope on one page uses a distinct subject occurrence key supplied by the page.
- mermaidKind: `flowchart TB` with depth subgraphs and exact relation labels; export the displayed folds and name the full text equivalent beside the source.
