---
id: spec:extraction.regenerability
kind: rule
altitude: feature
readiness: ready
relations:
  refines: spec:extraction.determinism
---
# Generated artifacts are disposable projections

## Intent
- outcome: Keep the repository canonical while allowing every graph and projection to be rebuilt safely.

## Rule
- Generated artifacts are disposable: deleting them and rebuilding from the same committed repository produces the same bytes.
- Consumers read the graph or link to source locations recorded in it; they never re-parse source or keep a parallel model.
- The graph is one JSON document queried in memory.
