---
id: spec:consumers.spec-studio.diagram-kinds.maturity-picture
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
---
# The maturity map is drawn as a grid of counts

## Intent
- outcome: See whether a Pack's statements match, lag or exceed its floors without a wall of member cards inside the picture.

## Behavior
- rule: [#discreteCells] Draw one equal-sized cell per stated-rung and floor pair. A populated cell shows its exact count and one mark per member, up to `100` marks, beyond which it is filled solid, and links to that cell's full ordered member list; an empty cell is a faint outline with no number. `matches`, `floor above statement` and `statement above floor` are named once each in the legend, and the diagonal carries an outline. Floor none is distinct from idea, and unresolved members are listed apart.
- rule: [#noScore] Use categorical cell position, never normalized coordinates, a quality score, area proportional to maturity, completion percentage or a recommendation to implement. Marks count members and score nothing.
- rule: [#fullMembership] Every resolved member appears in exactly one cell list in authored order. The picture holds cell counts, not per-member cards. Without script every populated cell links to its already-built list and every member links to its card.
- rule: [#oneCell] When every resolved member falls in one cell, one sentence before the grid names that cell's stated rung and floor with its count and links to the cell's member list, and the grid sits in a closed disclosure; when two or more cells hold members, the grid shows with no disclosure. The sentence scores nothing, and print opens the disclosure.

## Design
- matrix: Rows run stated idea, scoped, defined, ready from top to bottom; columns run floor none, idea, scoped, defined, ready from left to right. The grid including axes fits the shared width budget. Empty cells show only a faint outline; the matching diagonal has a stronger outline. Relation phrases appear once in the legend.
- bound: The fixed categorical cells fit the shared box bound and have no edges. Membership volume does not grow the picture; complete lists follow in closed disclosures and print open. Overlong lists are never truncated.
- oneCellDisclosure: the disclosure that holds a one-cell grid reads `Stated readiness by floor reached` as its summary; the grid inside it keeps its element ids.
- textEquivalent: Keep the accessible table of cell counts and complete member lists as the diagram's text equivalent; identify every member by its full id, title, stated rung and floor. The axis explanation belongs to the caption.
- elementIds: Use `diagram.<subject>.maturity.text` and `diagram.<subject>.maturity.cell.<stated>.<floor>`; cell links target the built list, with unique member-card targets supplied by the Pack page.
- mermaidKind: `block` with a fixed categorical grid, cell labels and counts. This is not a quadrant chart; source includes each cell's full membership as comments and names its accessible table.
