---
id: spec:consumers.spec-studio.diagram-kinds.maturity-picture
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.diagram-kinds
  dependsOn: spec:consumers.spec-studio.pack-page.maturity-map
---
# The maturity map shows the distribution before the member list

## Intent
- outcome: See whether a Pack's statements match, lag or exceed its floors without a wall of member cards inside the picture.

## Behavior
- rule: [#discreteCells] Draw one equal-sized cell per stated-rung and floor pair, with the exact member count and a link to that cell's full ordered member list. State the axes in words. Floor none is distinct from idea, and unresolved members are listed apart.
- rule: [#noScore] Use categorical cell position, never normalized coordinates, a quality score, area proportional to maturity, completion percentage or a recommendation to implement. A cell says `matches`, `floor above statement` or `statement above floor` in words.
- rule: [#fullMembership] Every resolved member appears in exactly one cell list in authored order. The picture holds cell counts, not per-member cards. Without script every populated cell links to its already-built list and every member links to its card.

## Design
- matrix: Rows run stated idea, scoped, defined, ready from top to bottom; columns run floor none, idea, scoped, defined, ready from left to right. Empty cells show zero, and the diagonal matching cells have both an outline and the word `matches`.
- bound: The fixed categorical cells fit the shared box bound and have no edges. Membership volume does not grow the picture; complete lists follow in closed disclosures and print open. Overlong lists are never truncated.
- textEquivalent: Keep the accessible table of cell counts and complete member lists as the diagram's text equivalent; identify every member by its full id, title, stated rung and floor. The axis explanation belongs to the caption.
- elementIds: Use `diagram.<subject>.maturity.text` and `diagram.<subject>.maturity.cell.<stated>.<floor>`; cell links target the built list, with unique member-card targets supplied by the Pack page.
- mermaidKind: `block-beta` with a fixed categorical grid, cell labels and counts. This is not a quadrant chart; source includes each cell's full membership as comments and names its accessible table.
