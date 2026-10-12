---
id: spec:model.design-maturity
kind: model
altitude: feature
readiness: defined
relations:
  refines: spec:model.core-model
  dependsOn: spec:consumers.pack-design
---
# A Spec's design maturity, beside its readiness

The original design had seven readiness stages, and its `designed` stage meant the Spec's key abstractions were settled before code (`docs/lineage/v0-design/01-core-primitives.md` §1.4 and §8). The Protocol rules four rungs, and they describe the intent, so readiness alone does not tell a `defined` Spec with no design from a `defined` Spec whose interfaces are settled. When the design-management arc was planned, the owner ruled that it derives design columns beside readiness and adds no rung. On 2026-10-12 the owner ruled the rest: design maturity is read from the derived columns and never stated, so no rung, floor clause or design fact carries it.

## Intent
- problem: A reviewer or an implementer cannot tell from readiness alone which Specs carry a settled design and which carry only intent, and the first adopter's owner asked for Specs whose key abstractions are designed as stubs before code.
- outcome: Show a Spec's design maturity in values the graph derives, so the backlog and a review can tell a designed Spec from one that states only its intent.
- assumption: The design columns tell a Spec with pinned declarations and keyed entries from one that states only its intent.

## Model
- **design columns** — the counts and lists the reader derives for a Spec beside its readiness: keyed Design and UI entries, pinned declarations, open and blocking questions, and the decisions it names. The Pack design carries them for each member, and the build backlog recipe shows them for each ready Spec no code realizes yet.
- **design maturity** — what the design columns show about a Spec's design. It is derived on every read and never stated: no readiness rung, floor clause or delivery fact carries it, because a rung would break the four locked readiness values, a floor clause that read Design would close that section's shape, and a design fact would mix design into the facts that say what code and tests bind.
- **designed stage** — the original design's readiness stage for a Spec whose key abstractions are settled; not a rung of the Protocol. The question reopens only if the first adopter's design passes show that the design columns cannot tell a designed Spec from one that states only its intent.
