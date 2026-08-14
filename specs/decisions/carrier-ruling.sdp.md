---
id: spec:decisions.carrier-ruling
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:carrier.markdown-authoring
---
# Markdown is the default Spec carrier

## Intent
- outcome: Give every Spec kind one readable canonical authoring surface without losing a lawful escape hatch.

## Decision
- context: The carrier must express all Spec kinds without creating an unbounded tooling obligation or a dual-source truth path.
- decision: Specs default to Markdown; Packs remain TS until a Pack syntax ruling; the TS DSL survives as import source and a lawful per-ID option. Later refinements keep this default and the one-surface law without repealing them: the Pack syntax ruling completes Pack Markdown, and the Gherkin carrier option admits graph-aware Gherkin as a lawful per-ID option for behavior and example Specs only, with the canonical suffix settled as `.sdp.gherkin`.
- rationale: An owned grammar and a permanent kind split both add surface cost without a demonstrated expressive gain, while retiring the DSL removes a useful bounded option. Bounding Gherkin to behavior and example Specs preserves the same trade-off — a second parser only where BDD-native readability earns it — rather than pretending every kind has a natural Gherkin shape.
- consequence: Each ID has one canonical surface, and Markdown tooling is the default path for authored Specs.
- consequence: Gherkin does not flip the default carrier, does not extend kind coverage by itself, and does not reopen dual-source truth; those questions stay with later kind-coverage and default-carrier rulings.
