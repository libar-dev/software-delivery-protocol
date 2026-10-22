# Plan 47. Roadmaps, capability maps and design slices

> **Status:** DRAFTED on `feature/roadmap-and-slices-v0`, from `main` at `da4b141`, the merge of
> PR 35. A thin pointer: the arc's intent is `pack:roadmaps-and-slices-v1`
> (`specs/roadmaps-and-slices.pack.sdp.md`), and readiness, backlog and open questions are read
> from the graph (recipes 1, 9, 11, 20, 29, 33), never from this file. If this file and the graph
> disagree, the graph wins. Design first; no build lane starts before the owner's go.

## Why

The owner asked for one well-rounded PR on how a corpus reads where it stands and what comes next:

1. Epics. The Protocol's corpus states one epic over 106 features and 298 stories, and no view
   draws refinement, so filtering by altitude shows one epic and a flat list.
2. A roadmap with priority, tied to the PR descriptions: what to design next and what to build
   next, in order. The planning truths decision (MD-33) refuses recorded work order as graph
   structure, and the roadmap views capture waits for a named reader. The owner is that reader.
3. More diagram kinds, legible at desktop width, and an annotation review that leaves a curated
   register of the engine's significant patterns and abstractions, not a generated inventory.
4. Architectural slices: features that must be reviewed together, read as one design.
5. Plans become the roadmap: forward planning read from the graph, `plans/` frozen as history.
6. Housekeeping the owner adds while reviewing the Studio.

## Shape of the arc

| Lane | What it designs | Carrying Specs |
| --- | --- | --- |
| A annotations | A review of every engine anchor against the significance criterion; the role vocabulary; the platform copy measured, never edited | `spec:protocol.significant-units-review`, `spec:protocol.role-vocabulary` |
| E epics | The capability map, its Studio page, the Protocol's capabilities as epics | `spec:consumers.capability-map`, `spec:protocol.capability-epics` |
| G diagrams | Every diagram kind the graph holds data for, legible labels, the maturity map as a picture, Mermaid source to copy | `spec:consumers.spec-studio.diagram-kinds` |
| S slices | A Pack read as one design, with the architecture it touches | `spec:consumers.design-slice` |
| R roadmap | Priority in the graph, the roadmap reading, page and memo, the first roadmap | `spec:decisions.roadmap-priority`, `spec:consumers.roadmap` |
| P plans | The roadmap replaces the numbered plan as the record an agent reads first | `spec:decisions.roadmap-over-plans`, `spec:protocol.roadmap-replaces-plans` |

Recipe numbers are pre-assigned so lanes do not collide: 52 the capability map (E), 53 the
roadmap (R), 54 the design slice (S), 55 the roadmap memo (R).

## Waves

1. **Design.** Parallel design passes, each by one model family and reviewed by another, run as
   Relay jobs through the Workflow tool; prototypes of each new page on the Protocol's corpus and
   on a copy of libar-platform at `b038bd4`. The executing thread rules on what each pass
   recommends and records the rulings here.
2. **Checkpoint.** A draft PR, so the owner reads the design in its own Studio preview, with the
   owner's decisions listed apart.
3. **Build**, after the owner's go.

## Owner's decisions

| Decision | Carrying Spec |
| --- | --- |
| Priority in the graph, refining the planning truths decision | `spec:decisions.roadmap-priority` |
| Retiring `plans/` as the forward-planning carrier and replacing the current-plan gate | `spec:decisions.roadmap-over-plans` |
| Ratifying any new decision record | the registry |

## Working rules

- Commit after each coherent unit and its gate; never `git stash`; never touch `.omo/`.
- Before every push, run CI's route in a fresh clone on Node 20 and npm 10: `npm ci
  --ignore-scripts`, `npm run check`, `npm run check:git-install`.
- Never merge to `main`; libar-platform is read through a copy and never edited.
