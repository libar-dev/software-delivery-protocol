---
id: spec:consumers.obsidian-vault.bases
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.obsidian-vault
  dependsOn:
    target: spec:consumers.pack-design
    reason: a Pack's Base shows the members, rungs and design columns the Pack design assembles
---
# A Pack's members and the standing queries are tables over the reader's values

A Base is Obsidian's table, card or list view over notes, filtered and sorted by their properties. Each Pack gets a Base of its members and the corpus one Base whose views are standing queries: the build backlog, the design backlog, the Specs whose next rung waits only for their author's statement, the Specs with blocking questions, and the decisions. In Obsidian a Pack's members read as one sortable table with implementation and verifier bindings shown as present or none, where the Design Review's Pack page is a table too wide for its page.

A view is a filter over values the generator wrote from the reader, so it agrees with the query it mirrors only while its predicate stays that simple. A view that would need a join waits until the reader carries the joined value. Keeping every filter inside a small closed grammar lets a test read each view's selection from the written files, without Obsidian, and compare it with its source over the same graph.

## Intent
- outcome: Give each Pack a Base of its members and the corpus a Base of standing queries, so a person filters and sorts a design by rung, floor, bindings and design columns.

## Behavior
- rule: [#corpusBase] The corpus has one Base, `sdp/specs.base`, over every Spec note, whose views are the standing queries `spec:consumers.obsidian-vault.bases#design.standingViews` lists, embedded in the index note.
- rule: [#packBase] Each Pack has a Base beside its note that selects the Spec notes whose `packs` property links the Pack, with the views `spec:consumers.obsidian-vault.bases#design.packViews` lists, embedded in the Pack's note.
- rule: [#viewsMirrorSources] Each standing view selects, over one graph, exactly the Specs its source selects, as `spec:consumers.obsidian-vault.bases#design.viewSources` pairs them.
- rule: [#closedClauses] Every filter is an `and` list of clauses from the closed grammar `spec:consumers.obsidian-vault.bases#design.filterClauses` states, over properties the notes hold, so no view computes a join, a fact or a floor.
- rule: [#bindingDisplay] A Base shows the two binding properties through formulas as present or none, under the column names Implementation binding and Verifier binding, never under a delivery-fact name.
- rule: [#memberOrder] A Pack's note lists its members in manifest order beside its embedded Base, since a Base sorts by property and keeps no authored order.

## Design
- filterClauses: a clause is one of `<property> == "<text>"`, `<property> != "<text>"`, `<property> == true`, `<property> == false`, `<property> > 0`, `<property>.isEmpty()`, `!<property>.isEmpty()`, `<property>.contains(link("<path>.md"))` and `file.inFolder("<folder>")`, each written as one double-quoted YAML string.
- corpusFilter: `sdp/specs.base` filters on `file.inFolder("sdp/specs")`.
- standingViews: table views in this order, `All Specs` with no further clause; `Build backlog` with `statedReadiness == "ready"`, `specKind != "example"`, `specKind != "decision"` and `implementationBinding == false`; `Design backlog` with `statedReadiness == "defined"`, `specKind != "example"`, `specKind != "decision"` and `implementationBinding == false`; `Nothing blocks the next rung` with `!statedNextRung.isEmpty()` and `statedNextRungFailures.isEmpty()`; `Blocking questions` with `blockingQuestions > 0`; `Decisions` with `specKind == "decision"`.
- viewSources: `Build backlog` the rows of the build backlog recipe; `Design backlog` the rows of the design backlog recipe; `Nothing blocks the next rung` the Specs whose reader context has a `statedNextRung` and an empty `statedNextRungFailures`; `Blocking questions` the Specs with a blocking question in the open-question register; `Decisions` the rows of the decision register; each compared by Spec id over the same graph.
- packFilter: `sdp/packs/<note>.base` filters on `file.inFolder("sdp/specs")` and `packs.contains(link("sdp/packs/<note>.md"))`.
- packViews: table views in this order, `Members` with no further clause and `Nothing blocks the next rung` with the clauses of the corpus view of that name.
- memberColumns: `Members` and `All Specs` show `file.name`, `title`, `specKind`, `statedReadiness`, `derivedReadiness`, `statedNextRung`, `statedNextRungFailures`, `formula.implementation`, `formula.verifier`, `designEntries`, `declarations`, `openQuestions` and `blockingQuestions`; the other views show `file.name`, `title` and the properties their clauses read.
- bindingFormulas: `implementation: 'if(implementationBinding, "present", "none")'` and `verifier: 'if(verifierBinding, "present", "none")'` under `formulas:` in every Base.
- columnNames: every Base names its columns under `properties:` with `displayName`, keyed `note.<property>` or `formula.<name>`: Title, Kind, Stated, Floor reached, Next rung, What holds it, Implementation binding, Verifier binding, Design entries, Declarations, Open questions, Blocking.

## Example space
The world writes a probe corpus with a Pack whose members put at least one Spec in every standing view, runs the vault command, reads the Bases and the Spec notes' properties from disk, applies each view's clauses to those properties, and runs each view's source over the same graph.

```gwt-vocabulary
Given a corpus holding a Pack of {members:number} Specs, with a Spec in every standing view
When the vault command writes the vault
Then each standing view of the corpus Base selects the Specs its source selects: {viewsMatch:boolean}
Then the Pack's Base selects every member and nothing else: {packMatches:boolean}
Then every filter clause belongs to the closed grammar: {closedClauses:boolean}
```
