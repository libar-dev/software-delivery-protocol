---
id: spec:decisions.typing-law
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:model.spec-sections
---
# Floor-read sections are closed typed shapes

## Intent
- outcome: Give authors guardrails exactly where readiness and honesty checks depend on section content.

## Decision
- context: A fixed list of typed sections becomes stale when the readiness floor evolves.
- decision: Every section read by a floor clause has a closed typed shape; unsettled design and ui surfaces remain open.
- rationale: Closed shapes block authored-fact smuggling and provide useful authoring guidance without prematurely fixing unsettled surfaces.
- consequence: A newly floor-read section becomes typed by the criterion, not by a frozen list.
