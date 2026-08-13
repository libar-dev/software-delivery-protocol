---
id: spec:decisions.agent-front-door
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.agent-surface
---
# The agent front door is one evaluation sink over the exported reader

## Intent
- outcome: Let an agent read the typed graph in a single invocation without authoring a module for each question and without minting query verbs.

## Decision
- context: Agents arrive holding a question rather than a project, and the exported reader answers only after a TypeScript module is authored, compiled, and run.
- decision: The front door is two entrances over one seam: the package exports the reader constructor, and the CLI carries a single evaluation sink that derives the graph in process, injects that same reader, and prints the body's pre-shaped return.
- rationale: One evaluation sink adds no query vocabulary, so it is the opposite of a verb wall, while a scripting-only entrance taxes every question with a module, a sink with its own query language would rebuild the wall, and reading a committed graph artifact would answer from a snapshot a just-authored Spec is missing from.
- consequence: The graph is derived through the extractor on every invocation, so a just-authored Spec is queryable immediately and no stale artifact answers in the graph's name.
- consequence: The sink reads only — it consumes the extractor's derived output in memory, never re-parses carriers, and writes no artifact.
- consequence: The sink evaluates operator-supplied code with the trust stance of a local developer tool rather than a sandbox, and supplied roots resolve to canonical validated identities at the boundary.
- consequence: The injected binding names are a scripted contract that recipes and skills depend on, so renaming one breaks every body written against the surface.
