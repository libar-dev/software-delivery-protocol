---
id: spec:decisions.concept-docs-dissolve
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:protocol.self-hosting
---
# Concept documents may dissolve after executable truth lands

## Intent
- outcome: Keep intended truth authoritative while allowing exposition to shrink.

## Decision
- context: Concept documents currently carry both laws and unsettled representation.
- decision: Concept documents may dissolve only after their semantic contract is carried by executable Specs and lean registries.
- rationale: Executable truth is easier to validate and consume.
- consequence: Deletion follows the carrying work, per document, and is never bundled into the change that lands the carrier.
