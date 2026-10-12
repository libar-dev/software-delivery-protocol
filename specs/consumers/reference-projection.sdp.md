---
id: spec:consumers.reference-projection
kind: behavior
altitude: feature
readiness: idea
relations:
  refines: spec:consumers.projections-model
---
# A reference projection serves a reader outside the repository

The surfaces taxonomy names a reference projection, an interface and API reference kept current from the graph (`docs/concept/06-consumers-and-projections.md`, "The surfaces & projections taxonomy"). The original design generated its nearest relative, OpenAPI and AsyncAPI documents built from route and schema nodes and linked back to their Specs (`docs/lineage/v0-design/07-spec-studio-and-projections.md` §5.2). Plan 35 deferred it, because no candidate named a reader that the four shipped roots, the Design Review, the census, Mermaid and the Gherkin-shaped view, fail to serve (plan 35, "H leftover projections"). The trigger lived in plan prose; this Spec carries it as its own blocking question, the home the planning-truths placement decision gives a re-entry trigger.

## Intent
- outcome: Publish a current interface and API reference from the graph for a reader outside the repository, once such a reader is named.

### Open questions
- [blocking #namedOutsideReader] Re-entry trigger from plan 35: a named human consumer outside the repository whom the four shipped roots do not serve, with a way to measure that demand inside the arc that builds it. The taxonomy row is not that consumer.
- [non-blocking #referenceSource] Would the reference read pinned declarations, contract-kind Specs or `api:` code anchors, and does any of them hold enough to document an interface?

## Behavior
