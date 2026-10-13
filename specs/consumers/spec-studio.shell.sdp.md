---
id: spec:consumers.spec-studio.shell
kind: behavior
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - target: spec:consumers.spec-studio.lenses
      reason: the top navigation opens each lens
---
# The Studio's shell frames every page with navigation, a rail and a canvas

## Intent
- outcome: Let a person move between lenses, Packs and Specs from any page, and find a Spec by what they remember of it.
### Open questions
- [non-blocking #railHarnesses] The original's left rail shows the current Pack's tree, its specs and then its harnesses; the graph has no harness node. Does the rail list harnesses, and from which graph value?
  - decider: owner
  - provisional: the rail lists the current Pack's members that own an example space, each linked to its Spec page, and creates no harness identity
- [non-blocking #recentEdits] The original's left rail lists recent edits; the graph carries only current state, git is the event log, and the shipped views are a function of the graph alone. Does the rail read recent edits from git when the Studio is built, or leave them out?
  - decider: owner
  - provisional: leave recent edits out, so a Studio page stays a function of the graph alone
- [non-blocking #searchTags] The original's search indexes tags; the Spec envelope is closed to `id`, `kind`, `altitude`, `readiness` and `relations` with the H1 as title, and no free-form tag vocabulary is admitted. What, if anything, does search index in place of tags?
  - decider: owner
  - provisional: search matches what `findByConcept` matches, and indexing any further value needs the phase-0 search Spec's own contract

## Behavior
- rule: Every page has the same shell: a top navigation, a left rail and a main canvas.
- rule: Search is persistent on every page and uses the searchIndex data entry's scope; each result identifies its node type. A Spec result shows its stated rung beside the floor reached and opens its page; a Pack result opens its page without a readiness label; an Anchor or CodeNode result shows its recorded source location.
- rule: The rail's count of findings is the count of the validation report's findings, never a count the page derives.

## UI
The parts of the shell, top to bottom and left to right.
- topNavigation: Packs, Architecture, Tests, Evidence and Search; a capability grouping awaits `spec:consumers.spec-studio.lenses#question.capabilityGrouping`.
- leftRail: the current Pack's tree, its member Specs in authored order and the validation report's finding counts by severity; recent edits await `spec:consumers.spec-studio.shell#question.recentEdits`.
- mainCanvas: the page of the Spec or Pack selected in the rail or in a lens.
- search: matches the fields `spec:consumers.spec-studio.data#design.searchIndex` lists, with the same matching and ordering as `findByConcept`; results follow the search rule.
