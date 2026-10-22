---
id: spec:model.structural-patterns
kind: model
altitude: feature
readiness: ready
relations:
  refines: spec:model.anchors
  decidedBy: spec:decisions.architectural-annotation
---
# Architecturally significant units are annotated where they are realized

## Intent

- outcome: Annotate each architecturally significant unit on the anchor of the code that realizes it, with its role, its component's layer and bounded context, and the designs it references, and declare `uses` where a dependency is architectural, so the graph answers architecture questions from the code itself. Architectural significance adds no Spec kind, no node type, and no vocabulary registry.

## Model

- **architecturally significant unit** — A code unit with exported public surface or cross-component reach that warrants graph-visible structural binding: component membership, a role, and `references` to the designs it answers to. An architectural dependency is declared as `uses`, normally between components; a unit's own `uses` is optional.
- **structural attributes** — `role` on any code anchor; `layer` and `context` on a `component:` anchor; they describe the unit's architecture and carry no readiness or delivery fact, and the census renders their taxonomy from the graph.
- **accepted set** — The set of architecturally significant units in a corpus is an owner-reviewed declaration, never derived from imports or exports; anchors are curated, never a coverage quota.
