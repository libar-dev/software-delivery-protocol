---
id: spec:extraction.derive-graph
kind: behavior
altitude: feature
readiness: ready
relations:
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
- rule: Declared relations resolve Primitive to Primitive, while `satisfies` and test `verifies` edges derive from anchors and run from their binding node to the direct Spec target.
- rule: Delivery facts are computed node facts: a resolving `satisfies` edge contributes `implemented`, and an enabled direct verifier contributes `has-verifier` only to its target.
- rule: Inferred structural edges are advisory inputs to impact analysis and never become authoritative graph truth.
