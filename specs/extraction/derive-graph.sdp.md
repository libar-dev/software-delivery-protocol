---
id: spec:extraction.derive-graph
kind: behavior
altitude: feature
readiness: ready
relations:
  dependsOn: spec:extraction.delivery-facts
  refines: spec:protocol.self-hosting
  constrainedBy: spec:extraction.determinism
  decidedBy: spec:decisions.one-validation-path
---
# Carrier reification derives the one graph

The graph is the current projection of the repository at a commit. Git holds lifecycle history, so
removed records disappear from the current graph and a current `supersedes` relation is the only
forward pointer between records that still exist.

## Intent
- outcome: Expose one carrier-neutral derivation seam.

## Behavior
- rule: Carrier reification feeds deriveGraph once; no consumer creates a second graph.
- rule: The graph is flat arrays of typed nodes and edges; hierarchy and containment are expressed by edges rather than nested nodes.
- rule: Declared relations resolve Primitive to Primitive, while `satisfies`, `references`, and test `verifies` edges derive from anchors and run from their binding node to the direct Spec target, one edge per target.
- rule: The edge list is closed at twelve types: the six declared relations `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, and `supersedes`, and the six derived edges `belongsTo`, `satisfies`, `models`, `memberOf`, `uses`, and `references`.
- rule: A `references` edge is anchored, runs from a CodeNode to the Spec its code is written against, and contributes no delivery fact.
- rule: Delivery facts are computed node facts: a resolving `satisfies` edge contributes `implemented`, and an enabled direct verifier contributes `has-verifier` only to its target.
- rule: Inferred structural edges are advisory inputs to impact analysis and never become authoritative graph truth.
- rule: The key order of `design`, `ui`, and `model.terms` is the authored order and part of the graph contract.
- rule: A Pack node carries its manifest's members in authored order, and the `belongsTo` edges that re-express them keep the global edge sort.

## Design

One read model. Carrier reifiers translate each supported syntax into common reified input. Graph derivation joins that input with bindings and computes delivery facts before consumers read it. Adding a carrier changes the input boundary; validators and projections continue to consume the same graph. The shared delivery-fact policy belongs to the graph component so graph construction does not define a competing policy.
