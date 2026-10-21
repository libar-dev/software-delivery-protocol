---
id: spec:consumers.spec-studio.pack-page.maturity-map
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio.pack-page
  dependsOn:
    target: spec:consumers.derived-readiness-banner
    reason: the map sets each stated rung beside the floor reached, as the banner reads them
---
# A Pack page's maturity map places every member by its stated rung and its floor

A Pack of many members takes a reviewer a long scroll through its cards before they know where the design stands. The maturity map answers that first: one table, a row per stated rung and a column per floor reached, each member a short card in its cell. A member right of its row's own rung waits only for a statement the floor already allows; a member left of it states more than its floor holds.

## Intent
- outcome: Let a reviewer see at a glance where every member of a Pack stands, by the rung it states and the floor it reaches.

## Behavior
- rule: [#maturityMap] After the summary, the maturity map places each resolved member by its stated rung and the floor it reaches: one row per stated rung, idea to ready, and one column per floor, none to ready, each cell listing its members in authored order as short cards linked to their member cards, with its count; the row and column labels say in words where the floor sits above the statement and where the statement sits above the floor.

## UI
- maturityMap: an `sdp-maturity-map` holding a table under a `Maturity map` heading, rows headed `stated idea` to `stated ready`, columns headed `floor none` to `floor ready`, each cell its count and its members as short cards, an empty cell reading None, and a caption saying that a cell right of its row's own rung holds statements the floor already allows.
