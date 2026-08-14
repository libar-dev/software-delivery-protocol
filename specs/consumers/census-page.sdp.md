---
id: spec:consumers.census-page
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:consumers.projections-model
---
# Census renders the runtime taxonomy without becoming a registry

## Intent
- outcome: Give maintainers one disposable graph-derived census that exposes the complete runtime taxonomy, foreign values, readiness divergence, binding flavor, and current findings without creating another source of truth.

## Behavior
- rule: `renderCensus` is a pure `Reader -> pages` projection with no filesystem or clock access; every page, row, and finding is deterministically sorted so equal reader data produces byte-identical output.
- rule: Spec kind rows and their display labels, altitude rows, and readiness rows derive from `SPEC_KINDS`, `SPEC_KIND_DISPLAY_LABELS`, `SPEC_ALTITUDES`, and `SPEC_READINESS`; graph node, claim, delivery-fact, and edge rows derive from `graphNodeTypes`, `graphClaims`, `deliveryFactNames`, and `graphEdgeTypes`. Every exported runtime category renders even at count zero; no projection-owned taxonomy list is maintained.
- rule: A foreign value outside an exported runtime taxonomy renders as a deterministic `unrecognized` row sorted by its literal value rather than disappearing or being coerced into a known category.
- rule: Stated readiness and structurally derived readiness render as separate dimensions, including a count for Specs that have not structurally reached the first derived rung; the census never resolves or confers readiness.
- rule: Anchor flavor is counted from each binding node's graph node type, ID namespace, and outgoing binding edge, so structural bindings are visible as graph data and their absence is stated rather than inferred.
- rule: Findings come only from `reader.findings()`, the one validation report exposed as data; the projection never re-runs or re-implements validation.
- rule: The census is regenerable and disposable under `generated/census/index.md`; it confers nothing, writes no canonical source, and never becomes a second registry or truth store.
- rule: Publication uses the explicit `sdp census` surface and owns only `generated/census/`. It is not a child of or an extra write inside Design Review's transaction.
- rule: A census run writes its complete page set to `generated/census.tmp/`, removes the prior census root, and renames the temporary root into place. Every build attempt invalidates both census roots before extraction, so failure leaves honest absence rather than stale output that looks current.
- rule: `sdp census --check-clean` renders an independent twin, refuses divergent renders, and compares the current generated root with the new render. Missing or drifted output returns nonzero and is removed; clean output is replaced wholesale with byte-identical content.

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
