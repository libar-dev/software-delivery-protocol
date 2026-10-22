---
id: spec:consumers.roadmap
kind: behavior
altitude: feature
readiness: ready
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
- rule: [#specNeed] Each Spec in a scope has a need read from the graph: to design when it states a rung below `ready` and its floor does not reach `ready`; to state when it states a rung below `ready` and its floor reaches `ready`, so only a person's statement stands before it; to build when it states `ready`, is neither an example nor a decision, and is not `implemented`; built when it states `ready` and is `implemented`; settled when it is an example or a decision that states `ready`.
- rule: [#drift] A Spec of an entry's work that is `implemented` while it states below `ready` keeps its need and counts as drift, as the drift alarm reads it.
- rule: [#entryNeed] An entry needs the first of to design, to state and to build that any Spec of its work needs, and is built when every Spec of its work is built; an entry reads built only when every Spec of its work states `ready` and is `implemented`.
- rule: [#apart] An entry that is itself an example or a decision, whose scope holds no work, takes no need: it is listed apart with its place and its own need, and it is read through the entries it verifies or shapes.
- rule: [#entryShows] Each entry shows its stated rung, the rung its floor reaches, its stated next rung with the floor clauses that hold it, its work counted by need with the parts to build now, every blocking open question in its scope, and every decision below `ready` that its scope holds or names by `decidedBy`, with that decision's blocking questions, keyed or not.
- rule: [#workRows] Each entry lists every Spec of its work once, with its need, its stated rung, the rung its floor reaches, its stated next rung with the floor clauses and the dependency targets that hold it, and whether it is drift; the parts with the entry's need are the ones that set it, so a descendant that holds an entry back is named with what holds it, and the entry's own readiness stays labelled apart.
- rule: [#restsOn] An entry rests on each resolving Spec outside its scope that any Spec of its scope names by `dependsOn`, `constrainedBy` or `refines`, while that Spec is to design, to state or to build, so a descendant's second parent outside the entry counts as the entry's own parent does; shaping decisions stay in the decision rows. Each row names the relation, the Specs of the scope that name it, the Spec's need and stated rung, whether it holds a `ready` statement in the scope because it states below `defined`, and the place of the first entry whose scope holds it, or none when it lies outside the roadmap.
- rule: [#restedOnBy] An entry is rested on by each Spec outside its scope, to design, to state or to build, that names a Spec of its scope by `dependsOn`, `constrainedBy` or `decidedBy`, so a reader sees what waits on it.
- rule: [#waiting] Apart from the entries, the reading lists what waits on the person the caller names, the owner by default: each open question whose `decider` names that person, on a Spec of any entry's scope or on a decision a scope names by `decidedBy`; and each such Spec or decision whose floor reaches a rung above the rung it states, a statement only a person makes, which for a decision is its ratification. Each row carries the places of the entries it touches. Questions follow their first place; statements keep their relative order in the statement queue across the whole roadmap, so a Spec others rest on comes first whatever its place, and their places never reorder them.
- rule: [#withoutDecider] The open questions over the same Specs that name no `decider` are listed apart and counted, blocking and not, so a question nobody is named to settle never reads as an empty workload; the reading never infers a decider from a question's prose.
- rule: [#earlier] Each entry lists the waiting statements the statement queue puts before its own: every Spec that the queue says one of the entry's waiting statements rests on, its work's and its shaping decisions' alike, each once, in the queue's order, marked as inside the entry, at the first place of another entry whose scope or shaping decisions it is among, or outside the roadmap. The list advises the order of statements and is never a readiness requirement.
- rule: [#builtStays] A built entry keeps its place and reads built until someone edits the roadmap; nothing removes it, and no check reports it.
- rule: [#overlap] Two entries may share Specs, as an epic and a feature beneath it do; each reads its own scope and names the places of the entries it shares a Spec with.
- rule: [#readingOrder] A Pack whose manifest does not state `order: priority` reads the same way when it is named, and the answer says its order is reading order, so no view presents it as a priority.
- rule: [#statesNothing] The reading states, records and gates nothing: it moves no rung, authors no fact and reports no finding, and work taken up out of its place is never a finding.

## Design

- roadmapRecipe: recipe 53, the roadmap, takes `params.pack`, one Pack id, and `params.decider`, a token on the `decider` field's grammar, `"owner"` by default; without `pack` it reads every Pack whose manifest states `order: priority`, in id order; a `pack` that names no Pack, or a `decider` off the grammar, returns `{ diagnostics: [{ parameter, problem }] }` and no roadmaps.
- roadmapAnswer: `{ decider, roadmaps }`, one roadmap per Pack read: `{ pack, title, framing, order, totals, entries, apart, waiting }`, where `order` is `"priority"` or `"reading"` and `totals` is `{ entries, toDesign, toState, toBuild, built, apart, questions, blockingQuestions, withoutDecider, blockingWithoutDecider, statements }`, the entries with each need and the rows waiting.
- needValues: an entry's `need` is `"to design"`, `"to state"`, `"to build"` or `"built"`; a Spec's need is one of those or `"settled"`.
- entryRow: `{ place, id, title, specKind, altitude, need, statedReadiness, floorReached, statedNextRung, holdsNextRung, work, workRows, buildNow, blockingQuestions, decisions, restsOn, restedOnBy, earlierStatements, packs, sharesScopeWith }` in place order, where `statedNextRung` is null at `ready`, `holdsNextRung` lists the holding rows that keep the floor from the stated next rung, `work` is `{ specs, toDesign, toState, toBuild, built, drift }` counted over the entry's work, `buildNow` lists the ids of its work to build, `packs` lists the entry's Packs other than the roadmap, and `sharesScopeWith` lists places.
- workRow: `workRows` lists every Spec counted in `work` once, in Spec-id order, as `{ id, need, statedReadiness, floorReached, statedNextRung, holdsNextRung, drift }`, with `statedNextRung` and `holdsNextRung` read as on the entry row and `drift` a boolean; the rows whose `need` equals the entry's are the ones that set it.
- holdsRow: a holding row is `{ clause, targets }`, `clause` the id of a floor clause that fails at the stated next rung, in the floor evaluator's order, and `targets` the ids that the typed-dependency clause names, in its order, empty for any other clause.
- questionRow: `{ address, spec, index, question, blocking, decider, provisional }` for each blocking question in the entry's scope, `address` null when the question carries no key, `index` its authored position from 0, and `decider` and `provisional` null when absent, sorted by Spec id and authored position.
- decisionRow: `{ id, title, statedReadiness, blockingQuestions }` for each decision below `ready` the entry's scope holds or names by `decidedBy`, sorted by id, `blockingQuestions` listing a question row for each of its blocking questions, keyed or not.
- restsOnRow: `{ id, via, from, need, statedReadiness, holdsReady, onRoadmap }`, where `via` is `"dependsOn"`, `"constrainedBy"` or `"refines"`, `from` lists in id order the Specs of the scope that name it by that relation, `holdsReady` is true when the Spec states below `defined`, and `onRoadmap` is the place of the first entry whose scope holds it or null; rows sort by id, then `via`.
- restedOnByRow: `{ id, via, need, onRoadmap }`, where `via` is the relation it names the scope by; rows sort by id, then `via`.
- earlierRow: `earlierStatements` lists `{ id, where, onRoadmap }` in the statement queue's order, where `where` is `"entry"` for a Spec of the entry's scope or one of its shaping decisions, `"roadmap"` for a waiting statement another entry touches through its scope or its shaping decisions, and `"outside"` otherwise, and `onRoadmap` is the first place of the entries that statement touches, null unless `where` is `"roadmap"`.
- apartRow: `{ place, id, specKind, statedReadiness, need }` in place order.
- waitingRows: `waiting` is `{ questions, withoutDecider, statements }`: a question in either list is a question row with `places`; a statement is `{ id, statedReadiness, floorReached, places }`. Questions sort by their first place, then blocking ones first, then by Spec id and authored position. Statements keep their relative order in the statement queue, recipe 46, across the whole roadmap; their `places` name the entries they touch and never reorder them.

## Example space

```gwt-vocabulary
Given a probe roadmap whose one entry holds the work {work:string}
Given that work {state:"is ready and implemented throughout"|"has one part ready and not implemented"|"has one part below ready whose floor reaches ready"|"has one part below ready whose floor stops short"|"has one part implemented below ready"|"has a ready root and one descendant without its kind's evidence"|"has a ready root and one descendant held by a blocking question"|"has one descendant that also refines a Spec outside the roadmap"}
Given a probe roadmap whose first entry rests on a Spec of its second entry, both waiting for a statement
When the roadmap recipe reads the probe roadmap
Then the entry's need reads {need:"to design"|"to state"|"to build"|"built"}
Then the entry counts {drift:number} parts as drift
Then the entry names {part:string} among the parts with its need, held by {clause:string}
Then the entry rests on {target:string} through {origin:string}
Then the waiting statements list {earlier:string} before {later:string}
```
