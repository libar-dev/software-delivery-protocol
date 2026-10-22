---
id: spec:consumers.projections-model.roadmap-views
kind: model
altitude: story
readiness: scoped
relations:
  refines: spec:consumers.projections-model
  dependsOn:
    target: spec:consumers.roadmap
    reason: the roadmap view the owner asked for is the roadmap reading, its page and its memo
---
# Roadmap views read releases, baselines and phases from git and the graph

Release, baseline and roadmap vocabulary belongs to optional projections that wait until a reader needs them. The owner, choosing what the next pull requests take up, is the reader the roadmap view waited for, and the roadmap reading answers it: a Pack whose manifest states a priority order, read with what each entry still needs, shown on the Studio's roadmap page and rendered as a pull request's forward section. Release and baseline views still wait for a reader of their own.

## Intent

- outcome: Name the release, baseline and roadmap views a delivery reader may want, as optional projections that never gate or sequence work.

### Open questions

- [blocking #releaseReader] Does a reader need release or baseline views that the roadmap, the recipes and git tags do not serve?
  - decider: owner
  - trigger: a named reader with that need, such as the package's first published release, and a way to measure it inside the arc that builds the views

## Model

- **release** — A tagged set surfaced as a git-tag projection.
- **baseline** — A named approved snapshot whose signed git tag is the approval artifact, with approval remaining outside the authored model.
- **roadmap** — A Pack whose manifest states a priority order, read with what each entry still needs next; its order is an advisory preference, never a schedule or a gate.
- **phase / iteration / milestone** — Descriptive words a roadmap's framing may use, never an entry field, a date, a gate or an enforced sequence.
