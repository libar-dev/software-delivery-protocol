---
id: spec:model.structural-patterns
kind: model
altitude: feature
readiness: defined
relations:
  refines: spec:model.anchors
  decidedBy: spec:decisions.architectural-annotation
---
# Architecturally significant units are annotated where they are realized

## Intent

- outcome: Annotate each architecturally significant unit on the anchor of the code that realizes it, with its role, its component's layer and bounded context, its uses, and the designs it references, so the graph answers architecture questions from the code itself. Architectural significance adds no Spec kind, no node type, and no vocabulary registry.

## Model

- **architecturally significant unit** — A code unit with exported public surface or cross-component reach that warrants graph-visible structural binding: component membership, uses declarations for its architectural dependencies, a role, and `references` to the designs it is written against.
- **structural attributes** — `role` on any code anchor; `layer` and `context` on a `component:` anchor; all three describe what the unit is, never where it stands, and the census renders their taxonomy from the graph.
- **accepted set** — The set of architecturally significant units in a corpus is an owner-reviewed declaration, never derived from imports or exports; annotations are curated, never a coverage quota.
