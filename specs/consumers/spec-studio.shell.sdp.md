---
id: spec:consumers.spec-studio.shell
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn: spec:consumers.spec-studio.data
---
# The Studio's shell frames every page with navigation, a rail and a canvas

## Intent
- outcome: Let a reader move between lenses, Packs and Specs from any page, and find a Spec by what they remember of it.
### Open questions
- [non-blocking #recentEdits] The original's left rail lists recent edits; the graph carries only current state, git is the event log, and the shipped views are a function of the graph alone. Does the rail read recent edits from git when the Studio is built, or leave them out?
- [non-blocking #searchTags] The original's search indexes tags; the Spec envelope is closed to `id`, `kind`, `altitude`, `readiness` and `relations` with the H1 as title, and no free-form tag vocabulary is admitted. What, if anything, does search index in place of tags?

## Behavior
- rule: Every page has the same shell: a top navigation, a left rail and a main canvas.
- rule: Search is persistent on every page; each result shows the Spec's readiness and opens its page.
- rule: The rail's count of findings is the count of the validation report's findings, never a count the page derives.

## UI
The parts of the shell, top to bottom and left to right.
- topNavigation: one bar with the entries Packs, Capabilities, Architecture, Tests, Evidence and Search; the first five open a lens, Packs and Capabilities being the two groupings of the Packs lens, and Search opens the search.
- leftRail: the current Pack's tree, its member Specs in the Pack's authored order, then the recent edits, then the count of validation findings by severity.
- mainCanvas: the page of the Spec or Pack selected in the rail or in a lens.
- search: indexes every Spec's title, id, terms and notes, and lists the matches, each with its readiness and a link into its page.
