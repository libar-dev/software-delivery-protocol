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
  - provisional: a measured inventory by the arc that removes them, reviewed before anything is deleted
