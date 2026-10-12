---
id: spec:consumers.impact-graph.symbol-reach
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:consumers.impact-graph
---
# Exhaustive symbol reach waits for a language-neutral identity

## Intent
- outcome: Answer find-all-usages and symbol-level impact exhaustively once a symbol identity exists that no single compiler owns.

### Open questions
- [blocking #symbolIdentity] Which language-neutral identity and extraction boundary can support exhaustive symbol reach without freezing a single compiler's representation into the Protocol? It re-enters when a reader needs symbol-level reach that file-level imports and curated anchors cannot give.

## Behavior
- rule: Symbol reach is inferred structure, kept apart from the curated graph as its parent states, and a symbol is never an anchor id or a relation target.
