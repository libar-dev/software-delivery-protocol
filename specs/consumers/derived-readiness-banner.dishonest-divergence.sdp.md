---
id: spec:consumers.derived-readiness-banner.dishonest-divergence
kind: example
altitude: story
readiness: ready
relations:
  refines: spec:consumers.derived-readiness-banner
  verifies: spec:consumers.derived-readiness-banner
---
# An overstated rung raises the banner and names the clause that refused

## Intent
- outcome: Execute the dishonest direction, where the page must name the first clause the structure leaves unmet.

```gwt
Given the graph holds a rule spec {specId: "spec:probe.overstated-rung"} whose stated readiness is {statedReadiness: "ready"}
Given the spec {structure: "records a blocking open question"}
When the Design Review renders the graph
Then the spec page renders the floor reached {floorReached: "scoped"}
Then the divergence banner is raised: {bannerRaised: true}
Then the banner names the first unmet clause {clauseId: "no-blocking-open-questions"}
```
