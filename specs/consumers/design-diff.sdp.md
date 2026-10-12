---
id: spec:consumers.design-diff
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.projections-model
  constrainedBy: spec:extraction.determinism
---
# Designs are compared between two commits at entry grain

The original design's CLI compared two graph snapshots with `graph diff <ref1> <ref2>` (`docs/lineage/v0-design/08-delivery-evidence-and-tooling.md` §6.1). The impact graph's Spec once stated that comparison under a blocking question on symbol identity, which concerns exhaustive code structure and not the curated graph a design lives in. This Spec now owns it.

Iterating on a design asks what changed since the last reading. The first adopter asks for a comparison by Spec id, section and entry key that tells changed declaration text from changed prose, moved entries, readiness edits, relation edits and new or removed examples, and for what changed since a design pass, read against the commit that pass read (`libar-platform/docs/feedback/sdp-feedback-02.md`, items 30 and 31). Git shows the changed lines; this comparison shows the changed design.

## Intent
- actor: A reviewer or an agent starting the next design pass over a Pack, holding the commit the last pass read.
- problem: A line diff of the carriers shows edits but not which Specs, entries, questions and relations changed, so each pass re-reads the whole Pack to find what moved.
- outcome: Show what changed in a design between two commits, down to the Spec, the section and the keyed entry, so a reviewer reads what moved since the last pass.

## Behavior
- rule: The design diff owns comparison between two commits, and the impact graph states nothing about comparing them.
- rule: A comparison is a catalog recipe that takes the base graph as a recipe parameter, the graph `sdp build` writes at the base commit, and compares it with the graph the evaluation derives at the head; it adds no verb and no binding.
- rule: The base graph is input the caller holds, derived from the repository alone at the base commit; it never answers in the graph's name, and the comparison writes nothing.
- rule: The caller always names the base. The recipe reads no record of a design pass and keeps none, and a corpus that notes which commit a pass read keeps that note outside the graph.
- rule: Two graphs written by different engine versions are compared on what both carry; the result reports each side's schema version, and a difference is a diagnostic in the result, never a refusal.
- rule: It reports the Specs added and removed, and for a Spec present at both commits the changes to its title, kind, altitude, stated readiness, relations, narrative and each section.
- rule: Inside the Design and UI sections, the open questions and any other section whose entries carry keys, it compares keyed entries by key and reports each as added, removed, changed in value or moved in order.
- rule: An unkeyed entry has no identity across two commits, neither its position nor its text, so it is compared as part of its whole section.
- rule: It reports changes to Pack membership and order, and to the code units, verifiers and delivery facts bound to each Spec, kept apart from the authored changes because they derive from anchors.
- rule: A comparison states facts about two commits and confers nothing. It grants no approval, raises no staleness flag, moves no readiness and never records that a pass happened.

## Design

- diffRecipe: recipe 35, the design diff, takes `params.base`, the graph object `sdp build` wrote at the base commit, an optional `params.pack` that limits the comparison to the Specs that are members of that Pack at either commit, and `params.detail`; it compares `params.base` with the `graph` binding and reads nothing else.
- diffShape: `{ base: { schemaVersion, specs }, head: { schemaVersion, specs }, diagnostics, totals, specs: { added: [id], removed: [id], changed }, packs, bindings, leftOut }`, where `totals` counts each list and `diagnostics` lists a schema-version difference or a part one side cannot carry.
- changedSpecRow: `{ id, parts: [part] }` in the summary and `{ id, parts: [{ part, change, from, to }] }` with `detail: true`; `change` is `added`, `removed`, `changed` or `moved`, and `from` and `to` carry the values on each side.
- diffParts: a part is `title`, `specKind`, `altitude`, `statedReadiness`, `narrative`, `relation.<type>:<target>`, a keyed entry as `design.<key>`, `ui.<key>`, `question.<key>`, `rule.<key>` or `term.<term>`, an unkeyed list as `behavior.rules`, `behavior.flows` or `intent.openQuestions`, and any other section as its name.
- movedEntry: a keyed entry whose value is unchanged and whose position among the keyed entries of its section changed is `moved`; an entry whose value changed is `changed` whatever its position.
- packRows: `packs` rows are `{ id, change, membersAdded, membersRemoved, reordered }` for each Pack added, removed or changed in membership or order.
- bindingRows: `bindings` rows are `{ id, implementedBy, referencedBy, verifiers, deliveryFacts }`, each an `{ added, removed }` pair of ids or fact names, kept apart from `specs` because they derive from anchors.
- baseRecipe: the catalog shows how to write the base graph: `git worktree add` at the base commit, `sdp build` on that worktree with the corpus's own exclusions, then pass its `generated/graph.json` as `base` and remove the worktree.
