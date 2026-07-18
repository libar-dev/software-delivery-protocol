---
id: spec:decisions.envelope-grammar-posture
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:carrier.envelope-contract
---
# The Protocol owns the envelope grammar

## Intent
- outcome: Keep authored envelope meaning stable while retaining a replaceable parsing representation.

## Decision
- context: YAML parsing behavior alone cannot define the Protocol's authored contract.
- decision: The Protocol owns a bounded envelope grammar and parser policy; the pinned YAML library is a swappable representation behind that contract.
- rationale: Permissive parsing lets library behavior define meaning, while an owned YAML parser recreates the rejected grammar-maintenance burden.
- consequence: Unsupported YAML constructs are refused within explicit resource bounds instead of silently becoming carrier semantics.
