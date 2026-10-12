---
id: spec:consumers.obsidian-vault.bases
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:consumers.obsidian-vault
  dependsOn:
    target: spec:consumers.pack-design
    reason: a Pack's Base shows the members, rungs and design columns the Pack design assembles
---
# A Pack's members and the standing queries are tables over the reader's values

A Base is Obsidian's table, card or list view over notes, filtered and sorted by their properties. The prototype gave each Pack a Base of its members and the corpus one Base whose views are standing queries: the build backlog, the design backlog, the Specs waiting only for their author's statement, the Specs with blocking questions, and the decisions. In Obsidian a Pack's members read as one sortable table with implementation and verifier bindings displayed as present or none, where the Design Review's Pack page is a table too wide for its page.

A view is a filter over values the generator wrote from the reader, so it agrees with the recipe it mirrors only while its predicate stays that simple. A view that would need a join waits until the reader carries the joined value.

## Intent

- outcome: Give each Pack a Base of its members and the corpus a Base of standing queries, so a person filters and sorts a design by rung, floor, delivery facts and design columns.

### Open questions
- [blocking #standingViews] Which standing queries become views, and how is each kept equal to the recipe it mirrors?
  - decider: owner
  - provisional: corpus-wide views for build backlog, design backlog, Specs whose stated next rung has no failing clause, Specs with blocking questions, and decisions; tests compare the first two selections with recipes 1 and 33, the no-failing-clause selection with each Spec context's `statedNextRung` and `statedNextRungFailures`, blocking Specs with the deduplicated Spec ids in recipe 20's blocking rows, and decisions with recipe 31's ids, all over the same graph
- [non-blocking #memberOrder] A Base sorts by property and keeps no authored order; how does a person read a Pack in its reading order?
  - provisional: the Pack's note lists the members in order beside the embedded Base

## Behavior
