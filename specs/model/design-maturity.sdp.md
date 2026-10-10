---
id: spec:model.design-maturity
kind: model
altitude: feature
readiness: idea
relations:
  refines: spec:model.core-model
  dependsOn: spec:consumers.pack-design
---
# A Spec's design maturity, beside its readiness

The original design had seven readiness stages, and its `designed` stage meant the Spec's key abstractions were settled before code (`docs/lineage/v0-design/01-core-primitives.md` §1.4 and §8). The Protocol rules four rungs, and they describe the intent, so a `defined` Spec with no design and a `defined` Spec whose interfaces are settled look the same in the graph. The owner ruled on 2026-10-10 that this arc derives design columns beside readiness and adds no rung; this Spec holds the rest of the question.

## Intent
- problem: A reviewer or an implementer cannot tell from readiness alone which Specs carry a settled design and which carry only intent, and the first adopter's owner asked for Specs whose key abstractions are designed as stubs before code.
- outcome: Settle how the graph shows a Spec's design maturity, so the backlog and a review can tell a designed Spec from one that states only its intent.
- assumption: The derived design columns on the Pack context (keyed entries, pinned declarations, decisions, open and blocking questions) answer most of the need without a rung.

### Open questions
- [blocking #designedRung] Once readers have used the derived design columns, is a rung still needed, and in which form: a fifth rung between `defined` and `ready`, a kind-conditional clause on the `ready` floor that reads the Design section, a derived design fact beside the delivery facts, or none? A floor that reads Design closes that section's shape under the typing law, and the founding principles warn against fixed tiers.
- [non-blocking #designedBacklog] Should the build backlog recipe report the design columns of each ready unimplemented Spec, so an implementer can see which of them carry a settled design?

## Model
- **design columns** — the counts and lists the Pack context derives for a member beside its readiness: keyed Design and UI entries, pinned declarations, open and blocking questions, and the decisions it names.
- **designed stage** — the original design's readiness stage for a Spec whose key abstractions are settled; not a rung of the Protocol.
