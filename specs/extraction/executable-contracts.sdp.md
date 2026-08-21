---
id: spec:extraction.executable-contracts
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:extraction.build-pipeline
  decidedBy: spec:decisions.point-per-example
---
# The build derives executable contracts from graph examples

## Intent
- outcome: Give bound tests typed step and example-space contracts without reading authored Specs directly.

## Behavior
- rule: `generateContracts` derives per-example step contracts and per-parent space contracts solely from the extracted graph.
- rule: A generated contract is disposable, keyed by Spec ID, and becomes unavailable when its authored example cannot bind honestly to its shared vocabulary.
- rule: The concreteness law is a refusal, never a guess — an example carrying an unbound slot in any used step of any entry is not the bindable form and receives no step contract, and a prose-only example receives none either.
- rule: The concreteness law reads the example's own form alone, so it refuses whether or not a parent declares a shared vocabulary; vocabulary resolution is a separate, later gate whose withholding names its own finding.
- rule: An example is one point, so the step contract and the bound point derive from the same first complete entry; a further structured entry is named rather than left silently inert.
- rule: Degradation is loud and local — an undeclared slot, a value outside its declared type, and a conflicting re-binding each name the drift and drop exactly that one slot, so the emitted module still compiles.
- rule: A vocabulary slot group that declares no usable type is named rather than dropped in silence, and no dimension enters the space for it.
- rule: Two contract paths differing only by letter case cannot coexist on a case-insensitive filesystem, so the contracts tree is withheld whole and the finding names the colliding pair.
- rule: Every generation finding is a warning that describes what did not emit; gating belongs to graph validation alone, so a withheld contract never fails the build by itself.
- rule: The realizing entrypoint is `generateContracts` in `src/codegen/contracts.ts`.

## Example space
```gwt-vocabulary
Given a parent spec whose example space declares the slot {dimension:string}
Given a parent spec that declares no shared vocabulary for the slot {dimension:string}
Given a refining example {exampleId:string} whose used step {binding:"binds"|"leaves unbound"} that slot
Given the example carries {entryCount:number} structured entries
Given a case-twin example {twinId:string} whose contract path differs only by letter case
When the contracts are generated from the derived graph
Then the generated tree holds {fileCount:number} files
Then the step contract for the example is emitted: {emitted:boolean}
Then the findings name {findingId:string}
```
