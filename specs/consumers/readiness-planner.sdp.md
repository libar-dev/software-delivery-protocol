---
id: spec:consumers.readiness-planner
kind: behavior
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:consumers.graph-first-planning
    reason: the planner is an advisory planning recipe that orders nothing the Protocol enforces
  dependsOn:
    - target: spec:validation.next-rung-floor
      reason: the rung each Spec's floor allows, and the targets that hold a rung, come from the one floor evaluator
    - target: spec:validation.typed-dependency-floor
      reason: the order reads the four typed relations the ready floor reads
    - target: spec:consumers.agent-surface.address-and-cycle-recipes
      reason: a cycle among waiting Specs reports in the shape dependency cycles reports
    - target: spec:model.open-question-fields
      reason: the owner's questions are selected by their decider field
---
# The readiness planner orders the statements a person can make

A corpus designed ahead of its code reaches the point where its floors allow far more than its authors have stated, and every statement waits on one person. The statements rest on each other: a Spec reviewed before what it rests on may need review again once that changes. The planner lists the waiting statements so that a Spec others rest on comes first, and lists apart the open questions only the owner settles, with what each holds. It states nothing. A rung stays a person's edit of a carrier, and the order is advice a person may set aside.

The order reads the four relations the ready floor reads. One pairing would make every decision rest on the Spec it shapes: a decision refines the Spec whose question it settles, and that Spec names the decision through `decidedBy`. A parent that names its own part through `dependsOn` or `constrainedBy` pairs the same way. In each pair the named Spec is what the other rests on, so the `refines` half orders nothing.

## Intent
- actor: The owner of a corpus, or an agent preparing the owner's review, with more waiting statements than a session can make.
- problem: No page orders the statements a person may make, so the owner either states rungs in an order that has to be undone or rebuilds the dependency order by hand with promotion preflight and dependency footing.
- outcome: Order the Specs whose floor allows a higher rung than their author stated, the Specs they rest on first, so a person makes those statements in an order that holds while tooling states nothing.

## Behavior
- rule: [#waiting] A waiting statement is a Spec whose floor reaches a rung above the rung it states; the queue lists every such Spec once, with the rung its floor allows, and no other Spec.
- rule: [#restsOn] A waiting Spec rests on each other waiting Spec it names by `dependsOn`, `constrainedBy`, `decidedBy` or `refines`, the four relations the ready floor reads; no Spec rests on itself.
- rule: [#refinesYields] A `refines` from a Spec to a Spec that names it by `dependsOn`, `constrainedBy` or `decidedBy` orders nothing, so a decision comes before the Spec it shapes and a part before the parent that rests on it.
- rule: [#rounds] A waiting Spec that rests on no waiting Spec is in round 1, the statements a person can make first; any other waiting Spec is in the round after the latest round among the waiting Specs it rests on.
- rule: [#order] The queue lists the waiting Specs by round, and within a round by id in code-unit order, numbering each by its place, so each comes after every waiting Spec it rests on unless the two share a cycle.
- rule: [#cycles] Waiting Specs that reach each other through those rests-on links form a cycle; its members share one round, the round after the latest round among the waiting Specs outside the cycle that any member rests on, or round 1 when there is none, and the planner lists each cycle with one closed path through it and refuses nothing.
- rule: [#ownerQuestions] Apart from the statements, the planner lists each open question whose `decider` names the person the caller gives, the owner by default, blocking questions first, each with the Specs it holds: a blocking question holds its own Spec below `defined`, and it holds every Spec whose `ready` the typed-dependency clause refuses because the question's own Spec states below `defined`.
- rule: [#undecided] The planner counts the open questions that carry no `decider`, and how many of them block, so an empty list of the owner's questions never reads as nothing waiting on the owner.
- rule: [#statesNothing] The planner is a catalog recipe that reads the graph and states, records and gates nothing; each statement it lists stays a person's edit of the carrier, and a Spec stated out of its order is never a finding.

## Design
- queueRecipe: recipe 46, the statement queue, takes `params.decider`, a token on the `decider` field's grammar, `"owner"` by default; another value returns `{ diagnostics: [{ parameter, problem }] }` and no queue.
- queueAnswer: `{ decider, totals: { waiting, firstRound, rounds, cycles, questions, blockingQuestions, withoutDecider, blockingWithoutDecider }, statements, cycles, questions }`, where `firstRound` counts the round 1 statements, `rounds` the highest round, `questions` and `blockingQuestions` the listed questions, and the last two the open questions that carry no `decider`.
- statementRow: `{ place, round, id, title, specKind, packs, statedReadiness, floorReached, restsOn }`, where `place` counts from 1 in queue order, `packs` lists the Spec's Pack ids in code-unit order, `floorReached` is the rung its floor allows, and `restsOn` lists the waiting Specs it rests on, sorted by id.
- cycleRow: `{ members, cycle }`, `members` sorted by id and `cycle` the shortest closed path from the first member through the members, found by a breadth-first walk over the ordering relations with targets in code-unit order, as dependency cycles finds its path; rows sort by first member.
- questionRow: `{ address, spec, index, question, blocking, decider, holds }`, where `address` is the question's entry address or null when it carries no key, `index` its authored position from 0, and `holds` its own Spec followed by the Specs it holds below `ready`, in code-unit order, empty for a non-blocking question.
- questionOrder: blocking questions first, then the question that holds more Specs first, then by Spec id and authored position.

## Example space
```gwt-vocabulary
Given a probe corpus in which {corpus:"one waiting Spec depends on another"|"a waiting Spec names a waiting decision that refines it"|"two waiting Specs depend on each other"|"a Spec carries a blocking question its owner decides and another Spec depends on it"}
When the statement queue runs over the probe corpus
Then the queue lists {queue:string} in that order
Then round 1 holds {firstRound:string}
Then the queue reports {cycles:number} cycles
Then the owner's questions hold {held:string}
```
