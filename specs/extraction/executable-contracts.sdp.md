---
id: spec:extraction.executable-contracts
kind: behavior
altitude: feature
readiness: ready
relations:
  refines: spec:extraction.build-pipeline
  dependsOn:
    target: spec:carrier.step-keys
    reason: a keyed step's contract key is its step key
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
- rule: [#contractKeys] Each step of a step contract carries its contract key beside its skeleton: its step key, from its own marker or from the vocabulary step it resolves to, under `spec:carrier.step-keys`, and its skeleton when it has none. The `Step` union and the `StepParams` properties are the contract keys in first-occurrence order, and the runner dispatches each step to the handler bound under its contract key.
- rule: Degradation is loud and local: an undeclared slot or a value outside its declared type is named and left out of the bound point; an off-type value stays in the step contract, widened to its scalar kind, so the emitted module still compiles; and a conflicting re-binding is named and its first value wins, in the bound point for a slot bound twice and in the step contract for a step that recurs with other values.
- rule: A vocabulary slot group that declares no usable type is named rather than dropped in silence, and no dimension enters the space for it.
- rule: [#outcomeIdentity] Each Then step of the parent's example space is one variant of the space contract's Outcome union, whose `kind` is that step's contract key, its step key or else its skeleton text; the build derives no slug or ordinal, and the runner core adds `unspecified`.
- rule: [#keyConflicts] A contract never holds two steps under one contract key. An example marker that disagrees with the key of its vocabulary step withholds the example's step contract with `contracts/conflicting-step-key`. A step or space contract whose steps would share a contract key, two skeletons under one key or a key equal to another step's skeleton, is withheld with `contracts/duplicate-step-key`, naming the key and both skeletons; a withheld space contract withholds every registrar of its children.
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
- findingIds: `contracts/undeclared-slot` · `contracts/off-dimension-value` · `contracts/conflicting-binding` · `contracts/conflicting-dimension` · `contracts/untyped-vocabulary-slot` · `contracts/multi-entry-example` · `contracts/unmatched-vocabulary-step` · `contracts/case-colliding-path` · `contracts/multiple-registrar-paths` · `contracts/conflicting-step-key` · `contracts/duplicate-step-key`, each at warning severity.
- duplicateStepKey: `contracts/duplicate-step-key` is a warning on the parent at `behavior.exampleSpace` for a space collision, or on the example at `behavior.examples` for a step-contract collision. Its message is `contract key "<key>" names both "<first skeleton>" and "<second skeleton>"; <space|step> contract withheld`, with the skeletons in first-occurrence order.
- contractStep: `export interface ContractStep<K extends string, P extends ParamShape> { readonly kind: StepKind; readonly key: K; readonly text: string; readonly params: P; }` is the step shape the runner exports, where `key` is the contract key and `text` the skeleton the natural reading renders.
- stepContractModule: `export type Step = "<contract key>" | …;` is the union of the example's contract keys in first-occurrence order, `StepParams` maps each contract key to its parameters, and `export const <camel>Contract: ExampleContract<Step, StepParams>` lists every step as `{ kind, key, text, params }` in authored order.
- outcomeVariant: `{ readonly kind: "<contract key>"; readonly <slot>: <type>; … }` is the Outcome variant of one Then step of the example space, one per Then step, beside `UnspecifiedOutcome`.
- planDispatch: the runner's `planExample` runs each step through `bindings[step.key]`, carries `key` on each planned step beside `text` and `label`, and renders the label from `text` and `params`, so a red keyed step still names itself in the Spec's own words.
