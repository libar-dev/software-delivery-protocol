---
id: spec:consumers.spec-studio.diagram-kinds.dependency
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
  dependsOn: spec:consumers.spec-studio.data
---
# A dependency drawing shows the declared footing of a Spec set

## Intent
- outcome: See multi-hop dependency chains and cycles within a Pack, slice or roadmap without reading them as an execution schedule.

## Behavior
- rule: [#declaredOnly] Draw the supplied Specs and their declared dependsOn, constrainedBy and decidedBy edges; each relation retains its exact direction, reason and claim. Refinement belongs to the capability tree, and membership is scope, never a dependency.
- rule: [#depth] Collapse strongly connected dependency sets for depth calculation only. A set with no outgoing dependency inside the scope has depth zero; every other set has one more than its deepest dependency. Keep every original node and edge in the drawing and text; mark a cycle in words and draw its internal edges without ordering its members.
- rule: [#boundary] Show immediate dependencies outside the supplied scope in a separate boundary band, without traversing their dependencies. An unresolved target is named unresolved and has no invented title or link.
- rule: [#fold] Above the shared bound, fold whole depth bands in descending box count, ties by ascending depth, then the boundary, until the drawing fits. A folded box names the members and relation counts in its linked text section. If folds still exceed the bound, keep the complete text and omit the SVG.

## Design
- inputs: `subject`, ordered `specs` and the page's reader answers supply scope and edges; no new recipe or authored field is needed. Duplicate ids keep their first supplied position; unknown ids are listed unresolved.
- bands: Label bands `Dependency depth <n>` in ascending depth, followed by `Outside this scope`. Within a band preserve supplied order. These are structural depths, never phases, dates or priority.
- edgeWords: Show dependsOn, constrainedBy and decidedBy beside their arrow and in the text equivalent with claim and optional reason. Mixed relations cannot become an unlabeled dependency arrow.
- textEquivalent: List every scoped and boundary Spec with its full id and title, then every original edge and every cycle's members; folding removes no text row.
- elementIds: Use `diagram.<subject>.dependency.text`, `.dependency.arrow` and `.dependency.fold.<depth>`; a second scope on one page uses a distinct subject occurrence key supplied by the page.
- mermaidKind: `flowchart BT` with depth subgraphs and exact relation labels; export the displayed folds and name the full text equivalent beside the source.
