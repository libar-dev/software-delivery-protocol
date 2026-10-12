---
id: spec:validation.superseded-decision-signal
kind: rule
altitude: story
readiness: defined
relations:
  refines: spec:validation.warn-level-signals
  dependsOn: spec:model.relations
---
# A Spec shaped by a superseded decision warns

The original design checked lifecycle integrity. It flagged a superseded Spec that live Specs still depend on, and a deprecated decision still named by `decidedBy` (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.3.4). The Protocol keeps decision lineage in the graph, as `supersedes` edges between decision Specs and `decidedBy` edges from the Specs they shape, but no check reads the two together. When this arc began, the corpus showed the cost. The Spec Studio's lenses Spec still named a decision the architectural annotation decision had superseded, and its architecture question still read the old ruling after the new one admitted layer and context.

The rule needed one ruling first. Three decisions once declared `supersedes` on the projections freeze while each replaced only one part of it, so a signal reading every `supersedes` as a whole replacement would have warned on the consumer Specs the freeze still correctly shapes. The owner ruled that `supersedes` replaces a whole decision and that a decision narrowing one part of another `refines` it; the three records now refine the freeze.

## Intent
- problem: A Spec can stay shaped by a decision that a later decision replaced, and nothing tells its author that the ruling it rests on has moved.
- outcome: Surface a live Spec that is still shaped by a decision another decision has superseded, as an informative warning.

### Open questions
- [non-blocking #signalReach] Does the signal read only `decidedBy`, or also a `refines` or `dependsOn` that names a superseded decision?
- [non-blocking #supersededChain] When a superseding decision is itself superseded, does the warning name the decision at the end of the chain?

## Rule
- A `supersedes` edge replaces the decision it targets whole; a decision that narrows part of another `refines` it instead, and the signal never reads a `refines` between decisions.
- Before the Protocol's first release a replaced decision is deleted by default, because the corpus is unreleased and its history lives in git; the signal stays unbuilt until a corpus keeps a replaced decision as history, and a `supersedes` edge stays lawful for that case.
- A replaced decision whose text no reader still needs is deleted rather than kept beside a `supersedes` edge, and a Spec still naming it then fails as an unresolved target, so the signal covers only replaced decisions kept as history.
- A Spec that names a decision through `decidedBy`, where another decision `supersedes` that decision, carries one warning for each such pair, naming the superseded decision and every decision that supersedes it.
- The warning is informative and never fails validation, as the orphan and gap signals never do, and its severity is fixed by the Protocol.
- The `supersedes` edge itself is never warned, and a superseded decision is never warned for being superseded.
- The signal reads the authored edges of the one graph and nothing else; it judges no content and never asks whether the newer ruling fits the Spec.
