---
id: spec:consumers.reference-projection
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:consumers.projections-model
---
# A reference projection serves a reader outside the repository

An interface and API reference is a deferred projection of the graph. The original design generated OpenAPI and AsyncAPI documents from route and schema nodes linked to their Specs. This capture keeps the reader and source questions open until a reader needs a reference the shipped projections do not provide.

## Intent
- outcome: Publish a current interface and API reference from the graph for a reader outside the repository, once such a reader is named.

### Open questions
- [blocking #namedOutsideReader] Does a human reader outside the repository need a reference projection the four shipped roots do not serve? The taxonomy row is not that reader.
  - decider: owner
  - trigger: a named consumer outside the repository, with a way to measure that demand inside the arc that builds the projection
- [non-blocking #referenceSource] Would the reference read pinned declarations, contract-kind Specs or `api:` code anchors, and does any of them hold enough to document an interface?

## Behavior
