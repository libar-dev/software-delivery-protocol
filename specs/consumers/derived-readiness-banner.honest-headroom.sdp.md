---
id: spec:consumers.derived-readiness-banner.honest-headroom
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.derived-readiness-banner
  verifies: spec:consumers.derived-readiness-banner
---
# A rung the structure overshoots renders as information, not as a banner

## Intent
- outcome: Execute the honest direction, where the line still renders both rungs and nothing nags the author upward.

```gwt
Given the graph holds a rule spec {specId: "spec:probe.understated-rung"} whose stated readiness is {statedReadiness: "scoped"}
Given the spec {structure: "clears every floor clause"}
When the Design Review renders the graph
Then the spec page renders the floor reached {floorReached: "ready"}
Then the divergence banner is raised: {bannerRaised: false}
```
