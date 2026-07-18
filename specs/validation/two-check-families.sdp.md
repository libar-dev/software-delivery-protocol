---
id: spec:validation.two-check-families
kind: rule
altitude: feature
readiness: defined
relations:
  refines: spec:protocol.self-hosting
---
# Validation separates well-formedness from non-pretending

## Intent
- outcome: Keep the graph trustworthy by checking conformance and honesty without judging content quality or enforcing workflow.

## Rule
- Every validator belongs to either the conformance family, which checks meta-model well-formedness, or the honesty family, which rejects authored or overstated derived truth.
- Validation errors fail the build; gaps and orphans remain informative signals rather than delivery-process gates.
- Types enforce structural shape, schema validates graph payloads, and graph validators enforce cross-file conformance and honesty; no one layer substitutes for the others.
- All graph validation runs through the one derived graph path: source, extraction, graph, then checks.
