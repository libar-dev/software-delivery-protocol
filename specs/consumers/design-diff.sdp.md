---
id: spec:consumers.design-diff
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.projections-model
  constrainedBy: spec:extraction.determinism
---
# Designs are compared between two commits at entry grain

The original design's CLI compared two graph snapshots with `graph diff <ref1> <ref2>` (`docs/lineage/v0-design/08-delivery-evidence-and-tooling.md` §6.1). Today one rule of the impact graph's Spec states that comparison. It derives the graph at each commit and reports the nodes and edges added, removed or changed. That Spec is held by a blocking question on language-neutral symbol identity, which concerns exhaustive code structure and not the curated graph a design lives in, so the comparison a design review needs waits on a question it never asks.

Iterating on a design asks what changed since the last reading. The first adopter asks for a comparison by Spec id, section and entry key that tells changed declaration text from changed prose, moved entries, readiness edits, relation edits and new or removed examples, and for what changed since a design pass, read against the commit that pass read (`libar-platform/docs/feedback/sdp-feedback-02.md`, items 30 and 31). Git shows the changed lines; this comparison shows the changed design.

## Intent
- actor: A reviewer or an agent starting the next design pass over a Pack, holding the commit the last pass read.
- problem: A line diff of the carriers shows edits but not which Specs, entries, questions and relations changed, so each pass re-reads the whole Pack to find what moved.
- outcome: Show what changed in a design between two commits, down to the Spec, the section and the keyed entry, so a reviewer reads what moved since the last pass.

### Open questions
- [non-blocking #comparingRuleHome] Should the comparing rule leave the impact graph's Spec once this Spec is defined, so the impact graph keeps exhaustive code structure only?
- [non-blocking #passBase] A design pass is review context, not a graph fact. Is the base commit always one the caller names, or may a corpus keep the commit each pass read in its own records for the comparison to read?

## Behavior
- rule: A comparison is a catalog recipe that takes the base graph as a recipe parameter, the graph `sdp build` writes at the base commit, and compares it with the graph the evaluation derives at the head; it adds no verb and no binding.
- rule: The base graph is input the caller holds, derived from the repository alone at the base commit; it never answers in the graph's name, and the comparison writes nothing.
- rule: It reports the Specs added and removed, and for a Spec present at both commits the changes to its title, kind, altitude, stated readiness, relations, narrative and each section.
- rule: Inside the Design and UI sections, the open questions and any other section whose entries carry keys, it compares keyed entries by key and reports each as added, removed, changed in value or moved in order.
- rule: An unkeyed entry has no identity across two commits, neither its position nor its text, so it is compared as part of its whole section.
- rule: It reports changes to Pack membership and order, and to the code units, verifiers and delivery facts bound to each Spec, kept apart from the authored changes because they derive from anchors.
- rule: A comparison states facts about two commits and confers nothing. It grants no approval, raises no staleness flag, moves no readiness and never records that a pass happened.
