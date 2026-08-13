---
id: spec:decisions.point-per-example
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:model.spec-sections
---
# Each example binds one point

## Intent
- outcome: Keep example-space coverage and outcome witnesses unambiguous while preserving compact authoring views.

## Decision
- context: A single example must remain one witness in its parent's typed example space.
- decision: An example binds exactly one point; table syntax may expand statically into sibling examples and renderers may project siblings as a table.
- rationale: Point sets make concreteness and witness semantics conditional, while banning table sugar taxes a surface layer that can translate honestly.
- consequence: The graph never stores multi-point examples even when a carrier offers tabular authoring.
