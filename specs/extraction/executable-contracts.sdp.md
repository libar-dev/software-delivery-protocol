---
id: spec:extraction.executable-contracts
kind: behavior
altitude: feature
readiness: defined
relations:
  refines: spec:extraction.build-pipeline
---
# The build derives executable contracts from graph examples

## Intent
- outcome: Give bound tests typed step and example-space contracts without reading authored Specs directly.

## Behavior
- rule: `generateContracts` derives per-example step contracts and per-parent space contracts solely from the extracted graph.
- rule: A generated contract is disposable, keyed by Spec ID, and becomes unavailable when its authored example cannot bind honestly to its shared vocabulary.
