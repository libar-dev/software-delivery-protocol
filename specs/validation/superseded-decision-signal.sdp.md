---
id: spec:validation.superseded-decision-signal
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:validation.warn-level-signals
  dependsOn:
    - target: spec:model.relations
      reason: its supersedes term keeps a replaced record only while a reader still needs its text, so the edges the signal reads are records a corpus chose to keep
    - target: spec:extraction.entry-locations
      reason: the warning takes its line from the location row of the decidedBy target it names
  decidedBy:
    target: spec:decisions.planning-truths-placement
    reason: supersedes replaces a decision whole and refines narrows it
---
# A Spec shaped by a superseded decision warns

The original design checked lifecycle integrity. It flagged a superseded Spec that live Specs still depend on, and a deprecated decision still named by `decidedBy` (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.3.4). A corpus may keep a replaced decision whose text still explains something a reader needs. Its `supersedes` edge and a shaped Spec's `decidedBy` edge then make a stale shaping relation visible in the graph, and this signal reads the two together.

Only `decidedBy` says that a ruling shapes a Spec now. A `refines` between decisions narrows a ruling for one case and stays true after the ruling it narrows is replaced, and a `dependsOn` that names a decision is not how a corpus says a ruling shapes it, so reading either would warn about relations that are not stale. When a replacement is itself replaced, the author needs the record at the end of the chain, so the warning names that record and leaves the steps between to the decision register.

## Intent
- problem: A Spec can stay shaped by a decision that a later decision replaced, and nothing tells its author that the ruling it rests on has moved.
- outcome: Surface a live Spec that is still shaped by a decision another decision has superseded, as an informative warning.

## Rule
- [#readsDecidedBy] The signal reads two kinds of authored edge and nothing else: `decidedBy` from a Spec to a decision, and `supersedes` between decisions. A `refines`, `dependsOn` or `constrainedBy` that names a superseded decision is never read, and neither is a `refines` between decisions.
- [#keptRecordLawful] A corpus may keep a replaced decision while its text explains something a reader still needs; keeping it is lawful, and a deleted decision leaves a dangling `decidedBy` that referential integrity reports and this signal does not read.
- [#onePerPair] A live Spec that names through `decidedBy` a decision another decision supersedes carries one warning for that pair, with the shaped Spec as its subject and the superseded decision as its related Spec; a Spec shaped by two superseded decisions carries two warnings.
- [#chainEnd] The warning names the decision at the end of each replacement chain: from the superseded decision the walk follows `supersedes` to the decisions that replace it, and on from each of those, and a decision it reaches that no decision supersedes is an end. Where the chain branches, the warning names every end.
- [#closedChain] The walk visits each decision once. When it reaches no end, because every decision it reaches is itself superseded, the warning says the chain of replacements closes on itself and names every decision the walk visited; a closed chain is never an error and is never followed twice.
- [#anyRung] The signal reads every `supersedes` edge whatever rung either decision states, so a replacement still below `ready` is named as it stands and its rung is read where the reader looks it up.
- [#liveSubjectsOnly] A Spec that a decision supersedes is not live and carries no warning for the decisions it names, and neither does a decision the walk visits, since it is itself a replacement of the record it names.
- [#informative] The warning never fails validation, as the orphan and gap signals never do; the Protocol fixes its severity and no setting changes it.
- [#noSupersedesWarning] The `supersedes` edge itself is never warned, and a superseded decision is never warned for being superseded.
- [#noContentJudgment] The signal judges no content: it never asks whether the newer ruling fits the shaped Spec, and moving the `decidedBy` to the end of the chain, or deleting the replaced record, is the author's edit.

## Design
- validatorId: `conformance/superseded-decisions`, registered as `supersededDecisions` in `graphValidatorIds`; a new id, never a reused one.
- family: `conformance`: the signal reads whether a Spec's authored relations still reach a current ruling, as the orphan signal reads whether any relation reaches a Spec.
- severity: `warning`, fixed by the Protocol.
- warningFields: `subjectId` is the shaped Spec, `relatedId` the superseded decision it names, `path` is `relation.decidedBy.<relatedId>`, the location table's entry for that relation, `file` is the shaped Spec's file, and `line` is that row's line, present only when the carrier recorded one.
- message: `Spec "<subjectId>" is decided by "<relatedId>", which a later decision supersedes; the chain of replacements ends at "<end>" (informative, never a gate).`, with `ends at "<end>", "<end>"` when the chain branches.
- closedChainMessage: `Spec "<subjectId>" is decided by "<relatedId>", whose chain of replacements closes on itself through "<id>", "<id>" (informative, never a gate).`, naming every decision the walk visited, `relatedId` included.
- chainWalk: start at the superseded decision; for each visited decision, visit each decision whose `supersedes` edge targets it, once; an end is a visited decision other than the start that no resolving `supersedes` edge targets; a `supersedes` edge whose source or target is no decision Spec in the graph is not followed.
- idOrder: the ids a message lists sort in code-unit order, and the findings sort as every report's findings do.
- skippedPairs: no warning for a `decidedBy` whose target does not resolve or is not a decision, for a subject a resolving `supersedes` edge targets, or for a subject the walk visits.

## Example space
Each world builds its graph in memory, and every probe Spec carries its kind's evidence, so only the signal moves the findings. The subject is a behavior Spec, or, for a superseded subject, the decision `decision-s`, which `decision-b` supersedes. The subject names the probe decision `decision-a`, and the replacing decisions are `decision-b` and `decision-c`, which state `ready` unless a point binds their rung. One replacement is `decision-b` superseding `decision-a`; a chain of two adds `decision-c` superseding `decision-b`; two at once are `decision-b` and `decision-c` each superseding `decision-a`; a closed chain is `decision-b` superseding `decision-a` and `decision-a` superseding `decision-b`. The named decisions are full ids joined by a comma and a space in code-unit order, or `nothing` when no warning names any.

```gwt-vocabulary
Given a {subject:"live Spec"|"superseded decision"} names the probe decision through {relation:"decidedBy"|"dependsOn"}
Given the probe decision is replaced by {replacement:"no decision"|"one decision"|"a chain of two decisions"|"two decisions at once"|"a chain that closes on itself"}
Given every replacing decision states {replacementRung:"idea"|"ready"}
When the graph is validated
Then the report holds {warnings:number} superseded-decision warnings
Then the warnings name {named:string}
Then the report holds {errorCount:number} errors
```
