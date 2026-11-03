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
# The Protocol removes its frozen plans, review reports and superseded concept material

Since the roadmap and each pull request carry the Protocol's delivery record, `plans/` and `reviews/` stand as frozen history, and the concept documents keep material the Specs already carry. Before they go, the durable content they still hold that no Spec, test, decision or recipe carries moves into the graph; git keeps the rest.

## Intent

- outcome: Remove `plans/`, `reviews/` and the superseded concept material from the tree, after moving into the graph the durable content they still hold, so the repository keeps one delivery record: the graph, git and the pull requests.
- risk: The self-hosting gate's frozen historical checks read three plan files, and the temporal guard exempts both folders, so the removal changes those checks in the same change.

### Open questions

- [blocking #durableContent] Which content in `plans/`, `reviews/` and the concept documents does no Spec, test, decision or recipe carry yet, and where does each piece belong?
  - decider: owner
  - provisional: the measured inventory this Spec's rule requires answers it once the owner has reviewed it; each piece then moves to its home and the question leaves the Spec

## Behavior

- rule: [#inventoryFirst] The arc that removes them opens with a measured inventory, in its first commit, of what `plans/`, `reviews/` and the concept documents still carry that no Spec, test, decision or recipe carries, each piece with its home; a review by another model family checks the inventory before anything is deleted.
