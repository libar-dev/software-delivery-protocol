---
id: spec:validation.superseded-decision-signal
kind: rule
altitude: story
readiness: scoped
relations:
  refines: spec:validation.warn-level-signals
  dependsOn: spec:model.relations
---
# A Spec shaped by a superseded decision warns

The original design checked lifecycle integrity. It flagged a superseded Spec that live Specs still depend on, and a deprecated decision still named by `decidedBy` (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.3.4). The Protocol keeps decision lineage in the graph, as `supersedes` edges between decision Specs and `decidedBy` edges from the Specs they shape, but no check reads the two together. When this arc began, the corpus showed the cost. The Spec Studio's lenses Spec still named a decision the architectural annotation decision had superseded, and its architecture question still read the old ruling after the new one admitted layer and context.

The corpus also shows why the rule needs a ruling first. Three decisions declare `supersedes` on the projections freeze, and each replaces one part of it. The authored-entry-order decision reopened the rendering of open-section entries, the question-key-rendering decision the rendering of question keys, and the Pack design page decision the Pack page. The freeze stands for everything else, and several consumer Specs are still, correctly, shaped by it. A signal that read every `supersedes` as a whole replacement would warn on each of them.

## Intent
- problem: A Spec can stay shaped by a decision that a later decision replaced, and nothing tells its author that the ruling it rests on has moved.
- outcome: Surface a live Spec that is still shaped by a decision another decision has superseded, as an informative warning.

### Open questions
- [blocking #partialSupersession] May `supersedes` amend part of a decision, as the authored-entry-order, question-key-rendering and Pack design page decisions do to the projections freeze? If so, how does the graph tell a partial replacement from a whole one: a different relation, a reason on the edge, or `refines` for an amendment and `supersedes` only for a replacement?
- [non-blocking #signalReach] Does the signal read only `decidedBy`, or also a `refines` or `dependsOn` that names a superseded decision?
- [non-blocking #supersededChain] When a superseding decision is itself superseded, does the warning name the decision at the end of the chain?

## Rule
- A Spec that names a decision through `decidedBy`, where another decision `supersedes` that decision, carries one warning for each such pair, naming the superseded decision and every decision that supersedes it.
- The warning is informative and never fails validation, as the orphan and gap signals never do, and its severity is fixed by the Protocol.
- The `supersedes` edge itself is never warned, and a superseded decision is never warned for being superseded.
- The signal reads the authored edges of the one graph and nothing else; it judges no content and never asks whether the newer ruling fits the Spec.
