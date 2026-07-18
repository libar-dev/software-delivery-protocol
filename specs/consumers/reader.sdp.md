---
id: spec:consumers.reader
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.agent-surface
---
# The reader bridges agent entry points to composable graph context

## Intent
- outcome: Let agents enter the curated graph from the strings, files, and changesets they already have without rebuilding its joins or taxonomy.

## Behavior
- rule: `createReader` constructs a fresh thin typed loader that decodes graph joins, claims, delivery facts, derived readiness, and validation findings once, then returns plain composable data without persisting state.
- rule: `findByConcept` and `byFile` bridge strings and extraction-root-relative files to the graph's recorded context.
- rule: The reader's `blastRadius` surface maps changed files to directly impacted Specs and Packs, their explicit one-hop at-risk neighbors, and every coverage-unknown file.
- rule: File-level blast radius reports curated graph reach without claiming exhaustive symbol-level usage reach.
