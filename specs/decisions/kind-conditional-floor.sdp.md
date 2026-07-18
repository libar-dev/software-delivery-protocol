---
id: spec:decisions.kind-conditional-floor
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:validation.readiness-floor
---
# Readiness evidence follows the Spec kind

## Intent
- outcome: Make stated readiness structurally honest without turning the floor into a quota.

## Decision
- context: Kinds have different natural evidence, while structural maturity clauses apply across every Spec.
- decision: The readiness floor combines cumulative kind-blind clauses with one kind-conditional evidence clause at each rung.
- rationale: Defined-only evidence and uniform evidence rules either leave padding legal or erase meaningful kind distinctions.
- consequence: Floor rows are monotonic, promotion-neutral, and converge honestly where a kind has no stronger form.
