---
id: spec:consumers.spec-studio.owner-queue
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.spec-studio
  dependsOn:
    - spec:consumers.spec-studio.data
    - spec:consumers.spec-studio.shell
    - target: spec:consumers.readiness-planner
      reason: the page renders the statement queue the planner orders
---
# The owner queue page orders the statements and questions only a person can settle

A large design waits on one person: the statements its floor already allows and the questions only its owner decides. The readiness planner orders those statements, the ones they rest on first. This page shows that order to a reviewer with only a link, so the owner sees which statements can be made first and which questions hold the most. A rung stays a person's statement, so the page orders and links and states nothing.

## Intent
- outcome: Let the owner see, in one place, every statement the floor allows in the order that holds, and every open question only the owner settles, blocking ones first.

## Behavior
- rule: [#queuePage] The page set holds `queue.html`, which renders recipe 46, the statement queue, over the whole corpus.
- rule: [#waitingStatements] The first list holds every waiting statement in the queue's order, numbered by position: the Spec linked, its kind, its stated rung, the rung its floor allows, the waiting Specs it rests on, each linked to its own row, and its Packs; a statement that rests on no waiting Spec reads `can be made now`.
- rule: [#ownerQuestions] The second list holds the open questions whose decider is `owner`, blocking ones first, each with its address linked to the question on its Spec page, its text, its provisional reading when present, and the Specs it holds below a rung, linked. The page reads the provisional reading from the reader by the question's Spec and key, or by its position when it has no key.
- rule: [#queueSummary] The page opens with sentences the build counts from the queue's answer: the statements waiting, how many rest on no waiting Spec and can be made now, the owner's questions blocking and not blocking, and any dependency cycle the queue names.
- rule: [#queueFilters] Filters narrow both lists by Pack, and the statements by the rung their floor allows; without script every row shows.
- rule: [#statesNothing] The page orders and links: it states no rung, records no statement, and never presents a waiting statement as approved or a position as a priority the owner set.

## UI
- statementRow: `<position>.`, the title linked, the id as code, then as plain text the kind, `stated <rung>`, `floor allows <rung>`, `rests on` and the waiting Specs as links to their rows or `can be made now`, and the Packs; the row's element id is the Spec's id.
- ownerQuestionRow: `blocking` or `non-blocking` in words, the address as a link with a copy action, the text, the provisional reading on its own labelled line, then `holds` and the held Specs as links.

## Example space
```gwt-vocabulary
Given a Spec {dependent:string} that waits for a statement its floor allows and rests on a Spec {dependency:string} that waits for one too
When the build renders the owner queue page
Then the queue lists {first:string} first
Then the row of the Spec that rests on the other links it: {linked:boolean}
```
