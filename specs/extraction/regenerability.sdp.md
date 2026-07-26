---
id: spec:extraction.regenerability
kind: rule
altitude: feature
readiness: defined
relations:
  refines: spec:extraction.determinism
---
# Generated artifacts are disposable projections

## Intent
- outcome: Keep the repository canonical while allowing every graph and projection to be rebuilt safely.

## Rule
- Generated artifacts are disposable: deleting them and rebuilding from the same committed repository produces the same bytes.
- Consumers read the graph or link to source locations recorded in it; they never re-parse source or keep a parallel model.
- The graph is a single JSON projection with in-memory query support; a graph database remains deferred until measured traversal pain establishes a real need.
- Measured evidence from the self-hosting corpus keeps full rebuilds comfortable below roughly 50 Specs.
- Measured evidence defers a graph database until the graph reaches roughly 10k+ nodes or traversal pain establishes a real need.
