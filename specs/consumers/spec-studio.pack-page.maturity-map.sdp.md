---
id: spec:consumers.spec-studio.pack-page.maturity-map
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio.pack-page
  dependsOn:
    - target: spec:consumers.derived-readiness-banner
      reason: the map sets each stated rung beside the floor reached, as the banner reads them
    - target: spec:consumers.spec-studio.diagram-kinds.maturity-picture
      reason: the map is drawn as the picture defines
---
# A Pack page's maturity map places every member by its stated rung and its floor

A Pack's maturity map shows its distribution before its member lists. Equal-sized cells place each resolved member by stated readiness and floor reached. Populated cells show exact counts and member marks; faint empty cells show no number. The count table and ordered lists retain the reading in text.

## Intent
- outcome: Let a reviewer see at a glance where every member of a Pack stands, by the rung it states and the floor it reaches.

## Behavior
- rule: [#maturityMap] After the summary, show the categorical grid and full member lists defined by spec:consumers.spec-studio.diagram-kinds.maturity-picture. Every resolved member belongs to one stated-rung and floor cell; unresolved members are named apart. Populated cells link to their built lists, whose members stay in authored order.

## UI
- maturityMap: An `sdp-maturity-map` holds the static SVG grid, caption and accessible count table, followed by populated cells' full member lists in disclosures that print open. Equal-sized cells have explicit axes; the legend names matches, floor above statement and statement above floor once. The diagonal has an outline, empty cells are faint, and populated cells carry exact counts and member marks, up to `100` marks and solid fill above that. Every member links to its card.
