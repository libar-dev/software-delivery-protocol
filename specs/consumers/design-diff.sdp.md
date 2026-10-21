---
id: spec:consumers.design-diff
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.projections-model
  dependsOn:
    target: spec:consumers.agent-surface.recipe-parameters
    reason: the base graph is supplied as recipe-parameter data, including the KEY=@PATH file form
  constrainedBy:
    target: spec:extraction.determinism
    reason: equal sources derive equal graphs, so a difference records a source change
---
# Designs are compared between a base commit and the working tree at entry grain

The original design compared graph snapshots. Comparison concerns the curated graph a design lives in and needs no symbol identity.

Iterating on a design asks what changed since the last reading. The first adopter asks for a comparison by Spec id, section and entry key that tells changed declaration text from changed prose, moved entries, readiness edits, relation edits and new or removed examples, and for what changed since a design pass, read against the commit that pass read (`libar-platform/docs/feedback/sdp-feedback-02.md`, items 30 and 31). Git shows the changed lines; this comparison shows the changed design.

## Intent
- actor: A reviewer or an agent starting the next design pass over a Pack, holding the commit the last pass read.
- problem: A line diff of the carriers shows edits but not which Specs, entries, questions and relations changed, so each pass re-reads the whole Pack to find what moved.
- outcome: Show what changed in a design between a base commit and the working tree, down to the Spec, section and keyed entry, so a reviewer reads what changed since the last pass.

## Behavior
- rule: The design diff compares a base graph with the current graph.
- rule: A comparison is a catalog recipe that takes the graph `sdp build` wrote at the base commit as a recipe parameter and compares it with the graph the evaluation derives from the working tree, including uncommitted edits; it adds no verb or binding.
- rule: The base graph is input the caller holds, derived from the repository alone at the base commit; it never answers in the graph's name, and the comparison writes nothing.
- rule: The caller always names the base. The recipe reads no record of a design pass and keeps none, and a corpus that notes which commit a pass read keeps that note outside the graph.
- rule: Two graphs written by different engine versions are compared on what both carry; the result reports each side's schema version, and a difference is a diagnostic in the result, never a refusal.
- rule: It reports the Specs added and removed, and for a Spec present in both graphs the changes to its title, kind, altitude, stated readiness, relations, narrative and each section.
- rule: Inside the Design and UI sections, the open questions and other keyed sections apart from rules and flows, it compares keyed entries by key and reports each as added, removed, changed in value or moved in order.
- rule: Rule and flow entries match first by unchanged text, preferring the same key for repeated wording, then by retained key; remaining unkeyed base entries pair in list order, including an entry reworded while adding a key. An unmatched keyed base entry is removed, and an unmatched head entry is added. Other unkeyed entries have no identity across the two graphs and compare as part of their whole section.
- rule: A rule or flow with unchanged text whose key was added, removed or changed is one `keyed` change naming its old and new address, or none; only a text change is `changed`. An unchanged entry moving between rules and flows is `moved`; when one graph keeps no order across rules and flows, keyed entries compare by order within each list and a `ruleOrder` diagnostic names the Spec.
- rule: It reports changes to Pack membership and order, and to the code units, verifiers and delivery facts bound to each Spec, kept apart from the authored changes because they derive from anchors.
- rule: A comparison states facts about the two graphs and confers nothing. It grants no approval, raises no staleness flag, moves no readiness and never records that a pass happened.

## Design

- diffRecipe: recipe 35, the design diff, takes `params.base`, the graph object `sdp build` wrote at the base commit, an optional `params.pack` that limits the comparison to the Specs that are members of that Pack at either commit, and `params.detail`; it compares `params.base` with the `graph` binding and reads nothing else.
- diffShape: `{ base: { schemaVersion, specs }, head: { schemaVersion, specs }, diagnostics, totals, specs: { added: [id], removed: [id], changed }, packs, bindings, leftOut }`, where `totals` counts each list and `diagnostics` lists schema-version differences, parts outside the common schema, a Pack absent from both graphs, and Specs compared without order across rules and flows; `base.specs` and `head.specs` count the Specs of the comparison scope present on each side, the scope being every Spec or, with `pack`, the Pack's members in either graph, while the top-level `specs` object carries the change lists.
- changedSpecRow: `{ id, parts: [part] }` in the summary and `{ id, parts: [{ part, change, from, to }] }` with `detail: true`; `change` is `added`, `removed`, `changed`, `moved` or `keyed`. For `keyed`, `from` and `to` carry the old and new entry addresses, `null` meaning none; other changes carry the values on each side, a rule or flow value as `{ list, text }`. A text change while adding a key is one `changed` entry.
- diffParts: a part is `title`, `specKind`, `altitude`, `statedReadiness`, `narrative`, `relation.<type>:<target>`, a keyed entry as `design.<key>`, `ui.<key>`, `question.<key>`, `rule.<key>` or `term.<term>`, an unkeyed rule or flow as `behavior.rules[<index>]` or `behavior.flows[<index>]`, using its current index or its base index when removed, an unkeyed question list as `intent.openQuestions`, and any other section as its name.
- movedEntry: a keyed entry whose value is unchanged and whose position among the keyed entries of its section changed is `moved`; an entry whose value changed is `changed` whatever its position. For rules and flows, unchanged text with a different key takes `keyed` precedence, then a list change or relative order change among retained entries is `moved`; anonymous entries compare order within their list. Adding or removing a key alone moves no other entry.
- packRows: `packs` rows are `{ id, change, membersAdded, membersRemoved, reordered }` for each Pack added, removed or changed in membership or order.
- bindingRows: `bindings` rows are `{ id, implementedBy, referencedBy, verifiers, deliveryFacts }`, each an `{ added, removed }` pair of ids or fact names, kept apart from `specs` because they derive from anchors.
- baseRecipe: The catalog shows how to derive the base graph in a worktree at the base commit with the corpus's exclusions. When constant-form anchors use relative engine imports, as in this repository, run the base worktree's own engine, then pass its `generated/graph.json` as `base` and remove the worktree.
