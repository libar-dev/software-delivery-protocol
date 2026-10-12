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

The original design's `designed` stage meant a Spec's key concepts were settled before code (`docs/lineage/v0-design/01-core-primitives.md` §1.4 and §8). The Protocol's readiness describes the maturity of intent. The graph therefore derives what design a Spec carries beside readiness, without adding a rung, floor clause or delivery fact. A new rung would change the locked readiness values, a floor clause reading Design would close that section's shape, and a design fact would mix design with realization signals.

## Intent
- problem: A reviewer or an implementer cannot tell from readiness alone which Specs carry a settled design and which carry only intent, and the first adopter's owner asked for Specs whose key concepts are designed as stubs before code.
- outcome: Show what design a Spec carries in values the graph derives, so the backlog and a review can tell a designed Spec from one that states only its intent.
- assumption: The design columns tell a Spec with pinned declarations and keyed entries from one that states only its intent.

### Open questions
- [non-blocking #designColumnsSufficiency] If the first adopter's design passes show that the design columns cannot distinguish settled design from intent alone, should this representation be revisited?
  - decider: owner
  - provisional: derive what design a Spec carries beside readiness without a new rung, floor clause or delivery fact

## Model
- **design columns** — The counts and lists the reader derives for a Spec beside its readiness under spec:consumers.pack-design; they are read on every pass and never stated.
- **designed stage** — The original design's readiness stage for a Spec whose key concepts were settled; it is not a Protocol rung.
