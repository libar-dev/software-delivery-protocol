---
id: spec:model.core-model
kind: model
altitude: feature
readiness: defined
relations:
  refines: spec:protocol.self-hosting
  decidedBy: spec:decisions.one-primitive
---
# The Protocol models delivery with one enrichable Spec

## Intent
- outcome: Give every authored delivery statement one stable shape and independent coordinates.

## Model
- **Spec** — The one authored truth-primitive, enriched in place without changing artifact type.
- **envelope** — The stable outer shape of id, title, kind, altitude, readiness, and relations; sections carry extension detail.
- **kind** — The true subtype that categorizes a Spec's truth and changes its required detail and validation.
- **altitude** — The scope position `epic`, `feature`, or `story`.
- **readiness** — The author-stated design-maturity position `idea`, `scoped`, `defined`, or `ready`, checked against a structural floor.
- **delivery fact** — A derived realization signal such as implemented or has-verifier; it is never authored readiness.
