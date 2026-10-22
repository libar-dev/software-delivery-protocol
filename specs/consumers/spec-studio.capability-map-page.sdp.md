---
id: spec:consumers.spec-studio.capability-map-page
kind: behavior
altitude: story
readiness: idea
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    target: spec:consumers.capability-map
    reason: the page renders the capability map's answer
---
# The capability map page shows each epic as a tree of its features and stories

## Intent

- outcome: Give the Studio a page that draws the capability map, each epic a tree of its features and stories with their rungs, and lets a person narrow the index's Specs by epic.
