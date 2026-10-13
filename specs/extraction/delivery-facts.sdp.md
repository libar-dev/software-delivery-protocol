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
- outcome: State the shared delivery-fact conferral law used by extraction, the delivery-facts honesty check and the reader's verifier eligibility checks.

## Behavior
- rule: Delivery facts are derived from resolving graph edges and are never authored.
- rule: `implemented` is conferred only by an anchored `satisfies` edge that resolves to the Spec — its source is a CodeNode present in the graph; a dangling or off-contract binding confers nothing.
- rule: `has-verifier` is conferred by an anchored `verifies` edge that resolves to the Spec from a test anchor, an `Anchor` node in the `test:` namespace, present in the graph, or by a declared `verifies` edge from an enabled verifier that resolves to it.
- rule: An enabled verifier is an example-kind Spec that declares `verifies` to a target and is itself backed by a resolving anchored `verifies` edge from a test anchor. A declared verifier without that binding confers nothing; binding says nothing about whether a run passed.
- rule: Both facts are direct and per-target; neither propagates through `refines`.
- rule: `observed` is never computed; it remains the aspirational liveness rung.
- rule: An edge the claim-separation check would reject confers no fact, so any graph producer other than the extractor is fail-closed.
- rule: Binding eligibility resolves ids through the same first node in node order as the graph index; the duplicate-ids check reports the ambiguity.
- rule: The extractor, the delivery-facts honesty check, and the reader's enabled decode share the one conferral computation and its two eligibility predicates, so the three surfaces can never disagree.
- rule: Facts are emitted in ladder order — `implemented`, then `has-verifier`.

## Design

Shared policy. Extraction, validation, and the reader use one graph-level delivery-fact computation and its eligibility predicates. The graph component owns the policy; callers own graph construction, diagnostics, and decoded views. Keeping that computation below its callers prevents each consumer from maintaining a separate interpretation of binding eligibility.
