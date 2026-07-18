---
id: spec:decisions.one-primitive
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:model.core-model
---
# One Spec carries named delivery coordinates

## Intent
- outcome: Preserve one durable authored primitive while making familiar delivery forms precise.

## Decision
- context: Delivery statements vary by truth category, scope, and maturity without needing separate artifact types.
- decision: A Spec is enriched in place with kind, altitude, and readiness; familiar delivery nouns are named coordinates on that primitive.
- rationale: Separate types per coordinate combination multiply shapes and break enrich-in-place identity.
- consequence: Domains and capabilities are projections or Packs, not extra altitudes.
