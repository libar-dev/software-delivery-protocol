---
id: spec:consumers.spec-studio.diagram-kinds.capability-tree
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
  dependsOn: spec:consumers.capability-map
---
# A capability drawing follows declared refinement

## Intent
- outcome: Read the capability map as a hierarchy without inventing parentage from names or hiding multiple parents.

## Behavior
- rule: [#mapInput] Draw the roots, refinement edges, unplaced Specs and repeated reach supplied by the capability map. Root selection and reach belong to that reader, never to label prefixes, files or the drawing.
- rule: [#multipleParents] Use the first parent in supplied map order as a node's placement parent and draw every other declared refines as an explicit cross-link. A cycle is a labelled group whose internal relations stay in the text; the drawing never cuts an edge silently to manufacture a tree.
- rule: [#fold] Above the shared bound, retain each root and fold the largest descendant branch below a non-root parent first, ties by root order then id, linking to its full branch list. If leaf siblings still exceed the bound, keep their first entries in supplied order and replace the remaining siblings of one parent with a labelled folded remainder, keeping that parent's relation explicit. Count unique Specs and rendered boxes separately where a cycle or repeated reach needs an occurrence. If no lawful fold fits, omit the SVG and open the complete text.

## Design
- layout: Roots lead, then depth bands of children; label each box with its title, altitude and shortened id. A refines arrow still points child to parent. Unplaced Specs occupy a labelled band apart.
- wordsBesideStyle: The legend says `Placement follows refinement; cross-links also refine another parent.` A group says `cycle` or `folded` in words and names its unique member count.
- textEquivalent: List every root and reachable Spec, all declared refines edges, cycle membership and unplaced ids using full identities. Grouping confers no delivery fact or readiness.
- elementIds: Use `diagram.<subject>.capability.text`, `.capability.arrow` and `.capability.branch.<encoded-root-id>`; encoded identities are injective and stable, not truncated labels.
- mermaidKind: `mindmap` for a strict tree, with title and full id per node. Use `flowchart BT` with exact refines edges whenever there is repeated parentage, a cycle, an unplaced band or a fold that mindmap cannot state losslessly. TreeView is an optional equivalent export of a strict tree with icons disabled.
