---
id: spec:consumers.spec-studio.navigation
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - target: spec:consumers.spec-studio.shell
      reason: the entries extend the shell's top navigation
    - target: spec:consumers.spec-studio.index-page
      reason: the routes extend the index's task list
    - target: spec:consumers.spec-studio.lenses
      reason: the lens entries keep the order the lenses take
---
# Every page of the page set is reached from the top navigation and the index

The shell's top navigation reaches the index and each lens, and the index routes a reader by the task they came to do. The register pages, the owner queue, the glossary, and the diff and runs pages join both, so a reviewer with only a link reaches every page from any page and sees which page they are on.

## Intent
- outcome: Let a person reach every page of the page set from the top navigation of any page, and from the index by the task they came to do.

## Behavior
- rule: [#topEntries] After the lens entries, the top navigation lists Queue, Questions, Decisions, Declarations, Backlog and Glossary, then Diff when the build was given a base graph and Runs when it was given run records, each linking its page; the search field follows them.
- rule: [#currentPage] The top-navigation link to the page being read carries `aria-current="page"` and an underline, so it shows by more than color.
- rule: [#indexRoutes] After its four routes, the index's `Start here` list adds See what the owner can state first, linking the owner queue; See the components by context and layer, linking the architecture lens; and, given a base graph, See what changed since the base, linking the diff page.
