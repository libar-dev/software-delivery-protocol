---
id: spec:consumers.spec-studio.diff-page
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - target: spec:consumers.design-diff
      reason: the page renders the design diff between the base graph and the graph built
    - target: spec:consumers.spec-studio.data
      reason: the base graph reaches the page as the build's named base input
---
# The diff page shows what changed in the design since a base graph

Iterating on a design asks what changed since the last pass, or what a change proposal would change. Given the graph of an earlier commit, the build renders the design diff between it and the graph it built, so a reviewer reads the changed Specs, entries, relations and bindings, and each changed Spec's page says it changed.

## Intent
- outcome: Let a person read, from a link, what changed in the design between a base graph the build was given and the graph it built, down to each entry.

## Behavior
- rule: [#onlyWithBase] The page set holds `diff.html` only when the build was given a base graph; without one, no page, link or marker names a diff.
- rule: [#namesTheBase] The page opens by naming its input: the base graph, its label when the build was given one, its schema version and its Spec count beside the built graph's, and a sentence that the comparison reads the two graphs only.
- rule: [#diffSections] The page renders recipe 35's answer with `detail: true` over the whole corpus, in sections in this order: the totals as sentences; the Specs added, linked; the Specs removed, as their ids in text, since no page holds them; the Specs changed, each linked, with each changed part, its change in words, and for a changed value the base value and the built value as text, one above the other; the Packs whose membership or order changed; the bindings changed, kept apart and headed as derived from anchors; and the diagnostics.
- rule: [#specMarkers] Given a base graph, each changed Spec's page adds a line under its header that names the base input and lists the Spec's changed parts, linked to its row on the diff page, and each added Spec's page says it is new since the base.
- rule: [#packMarkers] Given a base graph, each Pack page adds a `Changed since the base` section, from recipe 35's answer for that Pack, listing its changed and added members, linked, and its own membership change.
- rule: [#confersNothing] The page and the markers state differences between two graphs and confer nothing: no approval, staleness or readiness, and no record that a design pass happened.

## UI
- diffNavigation: the page appears in the top navigation as Diff, after the glossary, only when the build was given a base graph.
- baseLine: `Compared with the base graph <label>, schema <version>, <n> Specs; the built graph has schema <version>, <m> Specs.`, the label left out when none was given.
- changedSpec: the title linked, the id as code, then one row per part: the part as code, its change in words, and for a changed value two labelled blocks, `Base` and `Now`, holding the values as text; the block's element id is the Spec's id, which the Spec page's marker links to.
- bindingRow: the Spec linked, then for implementing units, referencing units, enabled verifiers and delivery facts the ids added and removed, under the heading `Bindings, derived from anchors`.
- specMarker: `Changed since the base graph <label>:` and the changed parts as code, linked to the Spec's row on the diff page.
