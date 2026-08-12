---
id: spec:decisions.plain-language-references
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
---
# Durable references lead with meaning

## Intent
- outcome: Keep design rationale readable without decoding registries.

## Decision
- context: Decision codes are useful lookup keys but poor standalone prose.
- decision: Durable references lead with plain-language meaning; decision codes follow parenthetically when useful.
- rationale: Meaning survives registry churn.
- consequence: AGENTS and plans lead with names.
