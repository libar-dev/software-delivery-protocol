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

## Behavior
- rule: Nodes sort by ID, edges sort by from, type, and to, and semantically compared output excludes wall-clock timestamps and run-specific hashes.
- rule: `sdp build --check-clean` repeats extraction and contract generation independently, failing on any graph or generated-contract byte divergence.
- rule: Static envelope fields fail extraction when they cannot be reified; optional TypeScript section detail may warn and drop, while Markdown documents refuse as a whole.
