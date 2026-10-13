---
id: spec:extraction.executable-contracts
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:extraction.build-pipeline
  decidedBy: spec:decisions.point-per-example
---
# The build derives step and space contracts from graph examples

## Intent
- outcome: Give bound tests typed step contracts and space contracts without reading authored Specs directly.

## Behavior
- rule: `generateContracts` derives per-example step contracts and per-parent space contracts solely from the extracted graph.
- rule: A generated contract is disposable, keyed by Spec ID, and withheld when its example is not in the bindable form or its steps do not resolve against the shared vocabulary.
- rule: [#concreteness] The concreteness law is a refusal, never a guess — an example carrying an unbound slot in any used step of any entry is not the bindable form and receives no step contract, and a prose-only example receives none either.
- rule: Concreteness reads the example's own form, whether or not a parent declares shared vocabulary. Vocabulary resolution is a separate later check; incompatible resolution withholds the step contract with `contracts/unmatched-vocabulary-step`.
- rule: [#onePoint] An example is one point, so the step contract and bound point derive from the same first complete structured Given/When/Then entry. A further entry, which the TypeScript carrier can carry, is named `contracts/multi-entry-example` rather than left silently inert.
- rule: Degradation is loud and local: an undeclared slot or a value outside its declared type is named and left out of the bound point; an off-type value stays in the step contract, widened to its scalar kind, so the emitted module still compiles; and a conflicting re-binding is named and its first value wins, in the bound point for a slot bound twice and in the step contract for a step that recurs with other values.
- rule: A vocabulary slot group that declares no usable type is named rather than dropped in silence, and no dimension enters the space for it.
- rule: [#outcomeIdentity] Each Then step of the parent's example space is one variant of the space contract's Outcome union, whose `kind` is that step's skeleton text; the build derives no slug or ordinal, and the runner core adds `unspecified`.
- rule: [#caseCollision] Two contract paths differing only by letter case cannot coexist on a case-insensitive filesystem, so the contracts tree is withheld whole and the finding names the colliding pair.
- rule: Every generation finding is a warning that describes what did not emit; gating belongs to graph validation alone, so a withheld contract never fails the build by itself.

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

## Design
- findingIds: `contracts/undeclared-slot` · `contracts/off-dimension-value` · `contracts/conflicting-binding` · `contracts/conflicting-dimension` · `contracts/untyped-vocabulary-slot` · `contracts/multi-entry-example` · `contracts/unmatched-vocabulary-step` · `contracts/case-colliding-path` · `contracts/multiple-registrar-paths`, each at warning severity.
