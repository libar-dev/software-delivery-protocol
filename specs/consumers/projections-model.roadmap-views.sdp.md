---
id: spec:consumers.projections-model.roadmap-views
kind: model
altitude: story
readiness: idea
relations:
  refines: spec:consumers.projections-model
---
# Roadmap views read releases, baselines and phases from git and the graph

The projections model once defined release, baseline and roadmap vocabulary beside the projections the Protocol builds, though no unit builds a view for them. The owner ruled that the realized contract stays in the projections model and this vocabulary waits here, deferred, until a reader needs it.

## Intent

- outcome: Name the release, baseline and roadmap views a delivery reader may want, as optional projections that never gate or sequence work.

### Open questions

- [blocking #namedRoadmapReader] Re-entry trigger: a named reader who needs release, baseline or roadmap views that the shipped projections, the recipes and git do not serve, with a way to measure that need inside the arc that builds them.

## Model

- **release** — A tagged set surfaced as a git-tag projection.
- **baseline** — A named approved snapshot whose signed git tag is the approval artifact, with approval remaining outside the authored model.
- **phase / iteration / milestone** — Descriptive vocabulary for optional roadmap projections, never gates or enforced sequences.
