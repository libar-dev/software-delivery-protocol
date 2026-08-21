---
id: spec:extraction.delivery-facts
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:extraction.derive-graph
  decidedBy: spec:decisions.binding-not-liveness
---
# Resolving bindings confer direct delivery facts

## Intent
- outcome: State the one delivery-fact conferral law shared by the extractor, the delivery-facts honesty check, and the reader's enabled decode, so the three surfaces can never disagree.

## Behavior
- rule: Delivery facts are derived from resolving graph edges and are never authored.
- rule: `implemented` is conferred only by an anchored `satisfies` edge that resolves to the Spec — its source is a CodeNode present in the graph; a dangling or off-contract binding confers nothing.
- rule: `has-verifier` is conferred by an anchored `verifies` edge that resolves to the Spec from an Anchor node present in the graph, or by a declared `verifies` edge from an enabled example that resolves to it.
- rule: An enabled example is an example-kind Spec that is itself the target of a resolving anchored `verifies` edge; a declared verifier that is not enabled confers nothing — binding, never liveness.
- rule: Both facts are direct and per-target; neither propagates through `refines`.
- rule: `observed` is never computed; it remains the aspirational liveness rung.
- rule: An edge the claim-separation check would reject confers no fact, so any graph producer other than the extractor is fail-closed.
- rule: A duplicate-id verifier keys the same first carrier exactly as the graph index keys it, and the duplicate-ids check reports the ambiguity loudly.
- rule: The extractor, the delivery-facts honesty check, and the reader's enabled decode share the one conferral computation and its two eligibility predicates, so the three surfaces can never disagree.
- rule: Facts are emitted in ladder order — `implemented`, then `has-verifier`.
