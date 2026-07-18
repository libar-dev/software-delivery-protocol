---
id: spec:extraction.determinism
kind: constraint
altitude: feature
readiness: ready
relations:
  refines: spec:protocol.self-hosting
---
# Committed source derives byte-identical output

## Intent
- outcome: Make regeneration independent of location and prior generated state.

## Constraints
- flavor: quality
- statement: Two clean derivations of the same committed source produce byte-identical generated trees.
- target: sha256(tree@run1) == sha256(tree@run2)
- measurableBy: test/cli.test.ts clean-repo determinism
