---
id: spec:protocol.delivery-record-cleanup
kind: behavior
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:protocol.roadmap-replaces-plans
    reason: carries out the removal the roadmap and the pull request record made possible for frozen history
  decidedBy: spec:decisions.roadmap-over-plans
---
# The Protocol removes the Markdown prose it keeps beside the graph

Markdown prose is not a Spec, and the Protocol plans in Specs. Since the roadmap and each pull request carry the Protocol's delivery record, `plans/` and `reviews/` stand as frozen history, and the concept documents keep material the Specs already carry. `docs/design/`, `docs/lineage/`, `jtbd-stories/` and `docs/articles/` keep design material, the initial specification, the jobs and the article series in prose beside the graph. Before they go, the durable content they still hold that no Spec, test, decision or recipe carries moves into the graph; git keeps the rest. The copy of the initial specification under `docs/lineage/v0-design/` is incomplete and its transfer into Specs was never completed; issue #44 keeps the complete original.

## Intent

- outcome: Remove `plans/`, `reviews/`, `docs/design/`, `docs/lineage/`, `jtbd-stories/`, `docs/articles/` and the superseded concept material from the tree, after moving into the graph the durable content they still hold, so intent has one home, the graph, and the delivery record stays in git and the pull requests.
- risk: The self-hosting gate's frozen historical checks read three plan files, and the temporal guard exempts both folders, so the removal changes those checks in the same change.
- risk: The handbook and the README link files under the added folders, the temporal guard exempts `docs/lineage/`, the article evidence check and the Markdown link tests read them, and Specs cite lineage files as sources, so the removal changes each of them in the same change.

### Open questions

- [blocking #durableContent] Which content in the prose this Spec removes does no Spec, test, decision or recipe carry yet, and where does each piece belong?
  - decider: owner
  - provisional: for `plans/`, `reviews/` and the concept documents, the owner accepted the whole-repository review's measured inventory, with its row rulings, as the answer; `docs/design/`, `docs/lineage/`, `jtbd-stories/` and `docs/articles/` have no inventory yet; the question leaves the Spec when the cleanup arc lands an inventory of all of them in its first commit

## Behavior

- rule: [#inventoryFirst] The arc that removes them opens with a measured inventory, in its first commit, of what the prose it removes still carries that no Spec, test, decision or recipe carries, each piece with its home; a review by another model family checks the inventory before anything is deleted.
