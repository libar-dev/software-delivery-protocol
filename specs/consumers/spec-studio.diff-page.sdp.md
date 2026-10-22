---
id: spec:consumers.spec-studio.diff-page
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - target: spec:consumers.design-diff
      reason: the page renders the design diff between the base graph and the graph built
    - target: spec:consumers.spec-studio.data.inputs
      reason: the base graph reaches the page as the build's named base input
---
# The diff page shows what changed in the design since a base graph

Iterating on a design asks what changed since the last pass, or what a change proposal would change. Given the graph of an earlier commit, the build renders the design diff between it and the graph it built, so a reviewer reads the changed Specs, entries, relations and bindings, and each changed Spec's page says it changed.

## Intent
- outcome: Let a person read, from a link, what changed in the design between a base graph the build was given and the graph it built, down to each entry.

## Behavior
- rule: [#onlyWithBase] The page set holds `diff.html` only when the build was given a base graph; without one, no page, link or change note names a diff.
- rule: [#namesTheBase] The page opens by naming its input: the base graph, its label when the build was given one, its schema version and its Spec count beside the built graph's, and a sentence that the comparison reads the two graphs only.
- rule: [#diffSections] The page renders recipe 35's answer with `detail: true` over the whole corpus, in sections in this order: the totals as sentences; the Specs added, linked; the Specs removed, as their ids in text, since no page holds them; the Specs changed, each linked, with each changed part, its change in words, and for a changed value the base value and the built value as readable text blocks or lists, one above the other, never a raw JSON array; keyed changes list in the head's rule and flow order, each as one line with the entry's text rendered as on its Spec page beside its old and new address or `none`; the Packs whose membership, order or order meaning changed, a change of meaning read as `now a roadmap` or `no longer a roadmap`; the bindings changed, kept apart and headed as derived from anchors; and the diagnostics.
- rule: [#specChangeNotes] Given a base graph, each changed Spec's page adds a line under its header that names the base input, counts keyed parts apart as `<n> rules keyed, wording unchanged` beside any other changed parts it lists, and links to its row on the diff page; each added Spec's page says it is new since the base.
- rule: [#packChangeNotes] Given a base graph, each Pack page adds a `Changed since the base` section after its maturity map, from recipe 35's answer for that Pack, listing its changed and added members, linked, and its own membership change, with `now a roadmap` or `no longer a roadmap` when what its order means changed; a member whose only changes are keying is marked `keyed only`.
- rule: [#confersNothing] The page and the change notes state differences between two graphs and confer nothing: no approval, staleness or readiness, and no record that a design pass happened.

## UI
- baseLine: `Compared with the base graph <label>, schema <version>, <n> Specs; the built graph has schema <version>, <m> Specs.`, the label left out when none was given.
- changedSpec: the title linked, the id as code, then one row per part: the part as code, its change in words, `keyed` changes in the head's rule and flow order, each as one line with the entry's text rendered as on its Spec page beside `Base` and `Now` addresses or `none`, and for a changed value two labelled blocks, `Base` and `Now`, holding readable text or lists without a raw JSON array; the block's element id is the Spec's id, which the Spec page's change note links to.
- bindingRow: the Spec linked, then for implementing units, referencing units, enabled verifiers and delivery facts the ids added and removed, under the heading `Bindings, derived from anchors`.
- changeNote: `Changed since the base graph <label>:` followed by `<n> rules keyed, wording unchanged` when any parts are keyed, using `rule` for one, beside the other changed parts as code, linked to the Spec's row on the diff page.

## Example space
```gwt-vocabulary
Given a base graph in which the Design entry {key:string} of a Spec reads {before:string}
Given the built graph in which that entry reads {after:string}
When the build renders the diff page
Then the Spec's row shows the base value {baseShown:string} and the built value {nowShown:string}
Then the Spec's page carries the changed-since-base line: {changeNote:boolean}
```
