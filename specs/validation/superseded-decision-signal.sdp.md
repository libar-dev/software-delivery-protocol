---
id: spec:validation.superseded-decision-signal
kind: rule
altitude: story
readiness: scoped
relations:
  refines: spec:validation.warn-level-signals
  dependsOn:
    - spec:model.relations
    - target: spec:consumers.graph-first-planning
      reason: its retained-record law determines which supersedes edges remain available to the signal
  decidedBy:
    target: spec:decisions.planning-truths-placement
    reason: supersedes replaces a decision whole and refines narrows it
---
# A Spec shaped by a superseded decision warns

The original design checked lifecycle integrity. It flagged a superseded Spec that live Specs still depend on, and a deprecated decision still named by `decidedBy` (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.3.4). A corpus may keep a replaced decision whose text still explains something a reader needs. Its `supersedes` edge and a shaped Spec's `decidedBy` edge then make a stale shaping relation visible in the graph, but no check reads the two together.

## Intent
- problem: A Spec can stay shaped by a decision that a later decision replaced, and nothing tells its author that the ruling it rests on has moved.
- outcome: Surface a live Spec that is still shaped by a decision another decision has superseded, as an informative warning.

### Open questions
- [blocking #keptRecord] Does a corpus keep a replaced decision whose text a reader still needs beside its `supersedes` edge?
  - decider: owner
  - trigger: a corpus keeps a replaced decision record whose text a reader still needs
- [non-blocking #signalReach] Does the signal read only `decidedBy`, or also a `refines` or `dependsOn` that names a superseded decision?
  - decider: owner
  - provisional: the signal reads `decidedBy` only
- [non-blocking #supersededChain] When a superseding decision is itself superseded, does the warning name the decision at the end of the chain?
  - decider: owner

## Rule
- The signal reads `supersedes` edges between decisions kept in the graph and never reads a `refines` between decisions; a deleted decision is handled by referential integrity.
- A Spec that names a decision through `decidedBy`, where another decision `supersedes` that decision, carries one warning for each such pair, naming the superseded decision and every decision that supersedes it.
- The warning is informative and never fails validation, as the orphan and gap signals never do, and its severity is fixed by the Protocol.
- The `supersedes` edge itself is never warned, and a superseded decision is never warned for being superseded.
- The signal reads the authored edges of the one graph and nothing else; it judges no content and never asks whether the newer ruling fits the Spec.
