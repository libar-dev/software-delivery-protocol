---
id: spec:consumers.roadmap
kind: behavior
altitude: feature
readiness: idea
relations:
  refines:
    target: spec:consumers.graph-first-planning
    reason: a roadmap is advisory reading of the graph for choosing the next work
  decidedBy: spec:decisions.roadmap-priority
---
# A roadmap orders the next bodies of work, and the graph says what each still needs

The Protocol's planning reads the graph: the build backlog lists ready work no code realizes, the design backlog lists defined work, and the statement queue orders what a person can state. None of them says which capability comes first. A roadmap is that one authored choice, the order of the next few bodies of work. Everything else about an entry, whether it still needs design, is ready to build, or is built, is read from the graph each time, so a roadmap never goes stale in what it says about state.

## Intent

- actor: The owner choosing what the next pull requests take up, and an agent opening the next body of work.
- problem: Priority lives in prose, in each pull request's forward section and in the plan files, which the graph cannot read and which go stale as work lands.
- outcome: Read a roadmap as an ordered list of upcoming capabilities, each placed by the graph in what it needs next, to design, to build or built, with the design it lacks and the work it rests on.

### Open questions

- [blocking #lanes] Which graph facts place an entry in to design, to build or built, and how does an entry that is an epic or a feature count its descendants?
  - decider: delegated
  - provisional: to build when it or a descendant states `ready` without `implemented`, to design when one states below `ready`, built when every one is implemented; examples and decisions follow the build backlog's exclusions
