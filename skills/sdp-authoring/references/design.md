# Design in rounds

For how much design a Spec carries, and for a design round. No check reads this guidance.

## The two-party test

Write the least design that lets two parties work apart: a builder and a test author, an author
and a reviewer, another Spec's author, an adopter.

- What they must agree on, a name, field, shape or message, is a keyed Design entry, opening with
  a code span when it pins a declaration (pinned declarations, recipe 24).
- Behavior is rules, keyed where cited from outside; why is said once, in the narrative or a
  decision Spec.
- The build owns private names, decomposition, file layout and the algorithm behind a stated
  outcome. A question only the builder can answer goes to the build, or `[non-blocking]` with
  `decider: delegated` and a `provisional:` reading.

## Rounds

A design grows in rounds over the Specs reviewed together, never one Spec to completion. Open
each with the design slice (recipe 54, `dist/recipes/54-the-design-slice.js`) over the Pack or
one perspective's members, and spend detail in depth order, first where others rest.

- `idea`: the outcome, its parent, the questions already visible.
- `scoped`: actor, problem, relations, first rules or examples, keyed questions with deciders and
  provisional readings, `decidedBy` for each decision needed.
- `defined`: every behavior a rule; blocking questions answered or moved to a decision Spec;
  shared names keyed; a component design for each component the code lacks; the example space.
- `ready`: no new detail; what it rests on states `defined`, and a person who read it in its
  slice states it.

Read the design columns beside each rung: pinned declarations on an `idea` or `scoped` member may
run ahead of settled intent, and a `defined` member others rest on, without keyed entries for
the names they need, leaves them guessing. Both are questions for the author, never findings.
