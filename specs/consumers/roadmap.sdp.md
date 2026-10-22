---
id: spec:consumers.roadmap
kind: behavior
altitude: feature
readiness: defined
relations:
  refines:
    target: spec:consumers.graph-first-planning
    reason: a roadmap is advisory reading of the graph for choosing the next work
  dependsOn:
    - target: spec:validation.next-rung-floor
      reason: an entry's stated next rung and the clauses that hold it come from the one floor evaluator
    - target: spec:validation.typed-dependency-floor
      reason: what an entry rests on is read through the relations the ready floor reads
    - target: spec:model.open-question-fields
      reason: the questions waiting on a person are selected by their decider field
    - target: spec:consumers.readiness-planner
      reason: the statements waiting on a person follow the statement queue's order
  decidedBy: spec:decisions.roadmap-priority
---
# A roadmap orders the next bodies of work, and the graph says what each still needs

The Protocol's planning reads the graph: the build backlog lists ready work no code realizes, the design backlog lists defined work, and the statement queue orders what a person can state. None of them says which capability comes first. A roadmap is that one authored choice, the order of the next few bodies of work. Everything else about an entry, whether it still needs design, waits only for a person's statement, is ready to build, or is built, is read from the graph each time, so a roadmap never goes stale in what it says about state. It goes stale only in its order, which its owner edits.

An entry stands for its whole refinement subtree: an epic for its features and stories, a feature for its stories. The reading counts the subtree's work by what each part needs, so a large entry shows how much of it is designed and built, and the parts that could be built now.

## Intent

- actor: The owner choosing what the next pull requests take up, and an agent opening the next body of work.
- problem: Priority lives in prose, in each pull request's forward section and in the plan files, which the graph cannot read and which go stale as work lands.
- outcome: Read a roadmap as an ordered list of upcoming capabilities, each placed by the graph in what it needs next, to design, to state, to build or built, with the design it lacks and the work it rests on.

## Behavior

- rule: [#entries] A roadmap's entries are its Pack's members in authored order, each numbered by its place from 1; an entry may be an epic, a feature or a story, and its place states its owner's preference and nothing else.
- rule: [#scope] An entry's scope is the entry and every Spec that reaches it through one or more `refines` edges, each counted once whichever parent it reaches through; its work is the Specs of its scope whose kind is neither `example` nor `decision`, the build backlog's exclusions.
- rule: [#specLane] Each Spec in a scope falls in a lane read from the graph: to design when it states a rung below `ready` and its floor does not reach `ready`; to state when it states a rung below `ready` and its floor reaches `ready`, so only a person's statement stands before it; to build when it states `ready`, is neither an example nor a decision, and is not `implemented`; built when it states `ready` and is `implemented`; settled when it is an example or a decision that states `ready`.
- rule: [#drift] A Spec of an entry's work that is `implemented` while it states below `ready` keeps its lane and counts as drift, as the drift alarm reads it.
- rule: [#entryLane] An entry is in the first of to design, to state and to build that any Spec of its work falls in, and built when every Spec of its work is built; an entry reads built only when every Spec of its work states `ready` and is `implemented`.
- rule: [#apart] An entry that is itself an example or a decision, whose scope holds no work, takes no lane: it is listed apart with its place and its own lane, and it is read through the entries it verifies or shapes.
- rule: [#needs] Each entry shows its stated rung, the rung its floor reaches, its stated next rung with the floor clauses that hold it, its work counted by lane with the parts to build now, every blocking open question in its scope, and every decision below `ready` that its scope holds or names by `decidedBy`, with that decision's blocking questions.
- rule: [#restsOn] An entry rests on each Spec outside its scope that a Spec of its scope names by `dependsOn` or `constrainedBy`, and on the parent the entry itself names by `refines`, while that Spec is to design, to state or to build; each row names the relation, the Spec's lane and stated rung, whether it holds a `ready` statement in the scope because it states below `defined`, and the place of the first entry whose scope holds it, or none when it lies outside the roadmap.
- rule: [#restedOnBy] An entry is rested on by each Spec outside its scope, to design, to state or to build, that names a Spec of its scope by `dependsOn`, `constrainedBy` or `decidedBy`, so a reader sees what waits on it.
- rule: [#waiting] Apart from the entries, the reading lists what waits on the person the caller names, the owner by default: each open question whose `decider` names that person, on a Spec of any entry's scope or on a decision a scope names by `decidedBy`; and each such Spec or decision whose floor reaches a rung above the rung it states, a statement only a person makes, which for a decision is its ratification. Each row carries the places of the entries it touches and the rows follow the first such place.
- rule: [#builtStays] A built entry keeps its place and reads built until someone edits the roadmap; nothing removes it, and no check reports it.
- rule: [#overlap] Two entries may share Specs, as an epic and a feature beneath it do; each reads its own scope and names the places of the entries it shares a Spec with.
- rule: [#readingOrder] A Pack whose manifest does not state `order: priority` reads the same way when it is named, and the answer says its order is reading order, so no view presents it as a priority.
- rule: [#statesNothing] The reading states, records and gates nothing: it moves no rung, authors no fact and reports no finding, and work taken up out of its place is never a finding.

## Design

- roadmapRecipe: recipe 53, the roadmap, takes `params.pack`, one Pack id, and `params.decider`, a token on the `decider` field's grammar, `"owner"` by default; without `pack` it reads every Pack whose manifest states `order: priority`, in id order; a `pack` that names no Pack, or a `decider` off the grammar, returns `{ diagnostics: [{ parameter, problem }] }` and no roadmaps.
- roadmapAnswer: `{ decider, roadmaps }`, one roadmap per Pack read: `{ pack, title, framing, order, totals, entries, apart, waiting }`, where `order` is `"priority"` or `"reading"` and `totals` is `{ entries, toDesign, toState, toBuild, built, apart, questions, blockingQuestions, statements }`, the entries in each lane and the rows waiting.
- laneValues: an entry's `lane` is `"to design"`, `"to state"`, `"to build"` or `"built"`; a Spec's lane is one of those or `"settled"`.
- entryRow: `{ place, id, title, specKind, altitude, lane, statedReadiness, floorReached, statedNextRung, holdsNextRung, work, buildNow, blockingQuestions, decisions, restsOn, restedOnBy, packs, sharesScopeWith }` in place order, where `statedNextRung` is null at `ready`, `holdsNextRung` lists the clause ids that keep the floor from the stated next rung, `work` is `{ specs, toDesign, toState, toBuild, built, drift }` counted over the entry's work, `buildNow` lists the ids of its work to build, `packs` lists the entry's Packs other than the roadmap, and `sharesScopeWith` lists places.
- questionRow: `{ address, spec, question, decider, provisional }` for each blocking question in the entry's scope, `address` null when the question carries no key and `decider` and `provisional` null when absent, sorted by Spec id and authored position.
- decisionRow: `{ id, title, statedReadiness, blockingQuestions }` for each decision below `ready` the entry's scope holds or names by `decidedBy`, sorted by id, `blockingQuestions` listing the addresses of its keyed blocking questions.
- restsOnRow: `{ id, via, lane, statedReadiness, holdsReady, onRoadmap }`, where `via` is `"dependsOn"`, `"constrainedBy"` or `"refines"`, `holdsReady` is true when the Spec states below `defined`, and `onRoadmap` is the place of the first entry whose scope holds it or null; rows sort by id, then `via`.
- restedOnByRow: `{ id, via, lane, onRoadmap }`, where `via` is the relation it names the scope by; rows sort by id, then `via`.
- apartRow: `{ place, id, specKind, statedReadiness, lane }` in place order.
- waitingRows: `waiting` is `{ questions, statements }`: a question `{ address, spec, index, question, blocking, provisional, places }`, `index` its authored position from 0; a statement `{ id, statedReadiness, floorReached, places }`. Rows sort by their first place; within it, questions put blocking ones first, then sort by Spec id and authored position, and statements follow their order in the statement queue, recipe 46, so a Spec others rest on comes first.

## Example space

```gwt-vocabulary
Given a probe roadmap whose one entry holds the work {work:string}
Given that work {state:"is ready and implemented throughout"|"has one part ready and not implemented"|"has one part below ready whose floor reaches ready"|"has one part below ready whose floor stops short"|"has one part implemented below ready"}
When the roadmap recipe reads the probe roadmap
Then the entry reads in the lane {lane:"to design"|"to state"|"to build"|"built"}
Then the entry counts {drift:number} parts as drift
```
