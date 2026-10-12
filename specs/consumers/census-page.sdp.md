---
id: spec:consumers.census-page
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:consumers.projections-model
  dependsOn:
    - target: spec:consumers.wholesale-view-rewrite
      reason: the shared build invalidates the projection roots before this publisher renders
  decidedBy:
    - spec:decisions.shipped-projections-frozen
    - target: spec:decisions.architectural-annotation
      reason: the census renders the structural edges and the role, layer and context attributes ruled by this decision
    - target: spec:decisions.anchor-binding-grain
      reason: the census renders the references edges ruled by this decision
---
# Census renders the runtime taxonomy without becoming a registry

## Intent
- outcome: Give maintainers one disposable graph-derived census that exposes the complete runtime taxonomy, foreign values, readiness divergence, binding flavor, structural bindings and their attributes, and current findings without creating another source of truth.

## Behavior
- rule: `renderCensus` is a pure `Reader -> pages` projection with no filesystem or clock access; every page, row, and finding is deterministically sorted so equal reader data produces byte-identical output.
- rule: Spec kind rows and their display labels, altitude rows, and readiness rows derive from `SPEC_KINDS`, `SPEC_KIND_DISPLAY_LABELS`, `SPEC_ALTITUDES`, and `SPEC_READINESS`; graph node, claim, delivery-fact, and edge rows derive from `graphNodeTypes`, `graphClaims`, `deliveryFactNames`, and `graphEdgeTypes`. Every exported runtime category renders even at count zero; no projection-owned taxonomy list is maintained. The structural section's layer rows derive from `CODE_ANCHOR_LAYERS`.
- rule: A foreign value outside an exported runtime taxonomy renders as a deterministic `unrecognized` row sorted by its literal value rather than disappearing or being coerced into a known category.
- rule: Stated readiness and structurally derived readiness render as separate dimensions, including a count for Specs that have not structurally reached the first derived rung; the census never resolves or confers readiness.
- rule: Anchor flavor groups binding nodes by node type, id namespace and outgoing edge type, counting each outgoing edge occurrence; a binding node with no outgoing edge has a `no binding edge` row, so a missing binding is stated rather than inferred.
- rule: The structural section counts `memberOf`, `uses` and `references` edges, with code units counted apart; it lists component members, `uses` fan-in and fan-out including members, references, and `uses` cycles as data rather than findings. Dangling structural references are read from the validation report.
- rule: With no structural edge or role, layer or context attribute, the section states that no structural binding exists. Otherwise it lists every closed layer value even at zero and the role and context values the graph holds, each with the units that carry it.
- rule: Findings come only from `reader.findings()`, the one validation report exposed as data; the projection never re-runs or re-implements validation.
- rule: The census is regenerable and disposable under `generated/census/index.md`; it confers nothing, writes no canonical source, and never becomes a second registry or truth store.
- rule: After the shared build, publication uses the explicit `sdp census` surface and owns only `generated/census/`. It is not a child of or an extra write inside Design Review's transaction.
- rule: A census run writes its complete page set to `generated/census.tmp/`, removes the prior census root, and renames the temporary root into place. The shared build invalidates this root and all sibling projection roots before extraction, as `spec:consumers.wholesale-view-rewrite#rule.buildInvalidates` states, so failure leaves honest absence rather than stale output that looks current.
- rule: `sdp census --check-clean` renders an independent twin, refuses divergent renders, and compares the current generated root with the new render. Missing or drifted output returns nonzero and is removed; clean output is replaced wholesale with byte-identical content.
- rule: When extraction succeeds but graph validation reports errors, census still publishes the labelled diagnostic projection and returns the nonzero validation exit code.

## Example space
```gwt-vocabulary
Given a graph containing known runtime categories, foreign taxonomy values, bindings, readiness divergence, and findings
When the census projection renders and publishes through the explicit census command
Then every runtime category remains visible including zero-count rows
Then foreign values render as deterministic unrecognized rows
Then stated and derived readiness remain separate dimensions
Then findings equal the values returned by reader.findings()
Then generated/census/index.md is the only current census page
Then a clean independent render is byte-identical
```
