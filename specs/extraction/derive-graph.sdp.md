---
id: spec:extraction.derive-graph
kind: behavior
altitude: feature
readiness: ready
relations:
  dependsOn:
    - target: spec:extraction.delivery-facts
      reason: computes delivery facts by the shared conferral law
    - target: spec:model.relations
      reason: the relations Spec owns the kind restrictions on authored relations
    - target: spec:model.anchors
      reason: the anchors Spec owns binding eligibility and structural endpoint restrictions
  refines: spec:protocol.self-hosting
  constrainedBy: spec:extraction.determinism
  decidedBy:
    - spec:decisions.one-validation-path
    - spec:decisions.anchor-binding-grain
---
# Carrier reification derives the one graph

The graph is the current projection of the repository at a commit. Git holds lifecycle history, so removed records disappear from the current graph. A current `supersedes` relation, from a decision to the one it replaces, is the only relation between a record and its predecessor, and it lasts only while both records exist.

## Intent
- outcome: Expose one carrier-neutral derivation seam.

## Behavior
- rule: Each extraction feeds reified carriers to `deriveGraph`; no consumer derives a graph of its own from source.
- rule: The graph payload carries `schemaVersion`, flat arrays of typed nodes and edges, and the location table. Hierarchy and containment are edges, never nested nodes.
- rule: Each derived node and edge uses the claim and endpoint row in Design. Kind restrictions on authored relations remain those of the relations Spec; binding eligibility remains that of the anchors and delivery-facts Specs.
- rule: The edge list is closed at twelve types: the six declared relations `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, and `supersedes`, and the six derived edges `belongsTo`, `satisfies`, `models`, `memberOf`, `uses`, and `references`.
- rule: A `references` edge is anchored, runs from a CodeNode to the Spec its code answers to, and contributes no delivery fact.
- rule: Delivery facts are computed node facts: a resolving `satisfies` edge contributes `implemented`, and an enabled direct verifier contributes `has-verifier` only to its target.
- rule: Mechanical file-level imports carry `inferred` as external input apart from the curated graph. They remain advisory and derive no `uses`, `memberOf` or `satisfies` edge and no delivery fact in that graph.
- rule: The key order of `design`, `ui`, and `model.terms` is the authored order and part of the graph contract.
- rule: A Pack node carries its manifest's members in authored order, and the `belongsTo` edges that re-express them keep the global edge sort.

## Design

One read model. Carrier reifiers translate each supported syntax into common reified input. Graph derivation joins that input with bindings and computes delivery facts before consumers read it. Adding a carrier changes the input boundary; validators and projections continue to consume the same graph. The shared delivery-fact policy belongs to the graph component so graph construction does not define a competing policy.

- authoredEdges: `refines`, `dependsOn`, `constrainedBy`, `decidedBy` and `supersedes` carry declared and run Primitive to Primitive.
- verifiesEdge: Declared `verifies` runs Primitive to Primitive; anchored `verifies` runs from a test Anchor to a Primitive. Enabled-verifier eligibility and conferral are owned by the delivery-facts Spec.
- bindingEdges: `satisfies` and `references` carry anchored and run CodeNode to Primitive; `models` carries anchored and runs from an oracle Anchor to a Primitive.
- structureEdges: `memberOf` and `uses` carry anchored and run CodeNode to CodeNode; structural endpoint restrictions are owned by the anchors Spec.
- membershipEdge: `belongsTo` carries declared and runs Primitive to Pack, derived from the manifest.
- nodeClaims: Primitive and Pack carry declared; Anchor and CodeNode carry anchored.
