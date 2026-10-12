---
id: spec:model.core-model
kind: model
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:protocol.self-hosting
    reason: the self-hosted corpus models itself with this primitive
  decidedBy:
    - spec:decisions.one-primitive
    - spec:decisions.example-realization-posture
---
# The Protocol models delivery with one enrichable Spec

## Intent
- outcome: Give every authored delivery statement one stable shape and independent coordinates.

## Model
- **Spec** — The one authored truth-primitive, enriched in place without changing artifact type.
- **envelope** — The stable outer shape of id, title, kind, altitude, readiness, and relations; sections carry extension detail.
- **kind** — The true subtype that categorizes a Spec's truth and changes its required detail and validation; one of eight, each shown by its display label: `behavior` (Use Case / Behavior), `workflow` (Workflow), `example` (Example / Scenario), `rule` (Business Rule), `constraint` (Constraint (NFR)), `model` (Domain Model), `decision` (Decision Record), `contract` (Contract).
- **one-kind rule** — A Spec states one category of truth; when one fact straddles kinds, author two Specs and join them with the relation that preserves their distinct intents.
- **altitude** — The scope position `epic`, `feature`, or `story`; `epic` is the ceiling, and anything above it is deferred.
- **readiness** — The author-stated design-maturity position `idea`, `scoped`, `defined`, or `ready`, checked against a structural floor.
- **delivery fact** — A derived realization signal, `implemented`, `has-verifier` or the deferred `observed`, computed from edges and never authored; it is independent of the stated readiness.
- **direct realization** — `implemented` follows a resolving implementation binding and never propagates through refinement; examples normally provide verification evidence rather than implementation work.
