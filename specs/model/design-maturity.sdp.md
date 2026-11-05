---
id: spec:model.design-maturity
kind: model
altitude: feature
readiness: ready
relations:
  refines: spec:model.core-model
  dependsOn: spec:consumers.pack-design
---
# What a Spec's design carries is derived, beside its readiness

Readiness states the design maturity of a Spec's intent, and the floor reads each kind's own evidence for it, such as a behavior's rules and examples or a model's terms. The shared names and shapes a Spec pins are derived beside readiness, without adding a rung, floor clause or delivery fact. A new rung would change the locked readiness values, a floor clause reading Design would close that section's shape, and a design fact would mix design with realization signals.

## Intent
- problem: Two Specs at one rung can differ in whether they pin the names and shapes an implementer builds to, such as signatures and record shapes, and readiness alone cannot tell them apart; the first adopter's owner asked for Specs whose key concepts are settled as stubs before code.
- outcome: Show the shared names and shapes a Spec pins in values the graph derives, beside its readiness, so the backlog and a review can tell a Spec that pins them from one at the same rung that pins none.
- assumption: The design columns count shared names and shapes, keyed Design and UI entries and pinned declarations, while readiness states the design of a Spec's behavior, whose floor reads its rules and examples.

## Model
- **design columns** — The counts and lists the reader derives for a Spec beside its readiness under spec:consumers.pack-design; they are read on every pass and never stated. Their entries and declarations count the shared names and shapes a Spec pins, never its rules, so zero entries on a Spec with rules says nothing about unsettled design: its rules are its design of behavior, and its readiness states their maturity.
- **designed stage** — The original design's readiness stage for a Spec whose key concepts were settled; it is not a Protocol rung.
