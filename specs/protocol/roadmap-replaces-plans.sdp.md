---
id: spec:protocol.roadmap-replaces-plans
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:protocol.self-hosting
  dependsOn:
    target: spec:consumers.roadmap
    reason: the Protocol reads its own next work from its roadmap
  decidedBy: spec:decisions.roadmap-over-plans
---
# The Protocol reads its next work from its roadmap, and its plan files are history

Each arc's intent already lives in its capture Specs and Pack, its rulings in their carrying Specs, and its story in its pull request description. What a plan file still carries is the status line agents read first, the lanes and waves of the arc, and copies of ruling tables. Once a roadmap holds priority, the Protocol can read its next work from the graph and let the plan files stand as the record of how earlier arcs were run.

## Intent

- outcome: Let an agent opening the Protocol's next work read it from the roadmap recipe, and keep the numbered plan files as frozen history no gate requires to grow.
