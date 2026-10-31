---
id: spec:extraction.determinism
kind: constraint
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:extraction.derive-graph
    reason: deterministic output constrains the derivation capability
---
# Committed source derives byte-identical output

## Intent
- outcome: Make regeneration independent of location and prior generated state.

## Constraints
- flavor: quality
- statement: Two clean derivations of the same committed source produce byte-identical generated trees.
- target: sha256(tree@run1) == sha256(tree@run2)
- measurableBy: test:protocol.extraction-determinism

## Behavior
- rule: Nodes sort by id and edges by from, type and to. Generated graph and contract metadata contains no wall-clock timestamp or run-specific hash. Graph file locations are extraction-root-relative POSIX paths, never absolute paths; authored section text remains as authored.
- rule: `sdp build --check-clean` repeats extraction and contract generation independently, failing on any graph or generated-contract byte divergence.
