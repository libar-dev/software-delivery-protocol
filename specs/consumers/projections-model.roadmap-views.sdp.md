---
id: spec:consumers.projections-model.roadmap-views
kind: model
altitude: story
readiness: idea
relations:
  refines: spec:consumers.projections-model
---
# Roadmap views read releases, baselines and phases from git and the graph

Release, baseline and roadmap vocabulary belongs to optional projections that wait until a reader needs them.

## Intent

- outcome: Name the release, baseline and roadmap views a delivery reader may want, as optional projections that never gate or sequence work.

### Open questions

- [blocking #namedRoadmapReader] Does a reader need release, baseline or roadmap views that the shipped projections, the recipes and git do not serve?
  - decider: owner
  - trigger: a named reader with that need, and a way to measure it inside the arc that builds the views

## Model

- **release** — A tagged set surfaced as a git-tag projection.
- **baseline** — A named approved snapshot whose signed git tag is the approval artifact, with approval remaining outside the authored model.
- **phase / iteration / milestone** — Descriptive vocabulary for optional roadmap projections, never gates or enforced sequences.
