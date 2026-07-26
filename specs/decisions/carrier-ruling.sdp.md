---
id: spec:decisions.carrier-ruling
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:carrier.markdown-authoring
---
# Markdown is the default Spec carrier

## Intent
- outcome: Give every Spec kind one readable canonical authoring surface without losing a lawful escape hatch.

## Decision
- context: The carrier must express all Spec kinds without creating an unbounded tooling obligation or a dual-source truth path.
- decision: Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option.
- rationale: An owned grammar and a permanent kind split both add surface cost without a demonstrated expressive gain, while retiring the DSL removes a useful bounded option.
- consequence: Each ID has one canonical surface, and Markdown tooling is the default path for authored Specs.
