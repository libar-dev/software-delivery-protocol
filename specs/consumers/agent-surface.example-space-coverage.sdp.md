---
id: spec:consumers.agent-surface.example-space-coverage
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.agent-surface.design-recipes
  dependsOn:
    - spec:carrier.slot-notation
    - target: spec:extraction.executable-contracts
      reason: its decoded slots and bound points reuse the space-contract interpretation
---
# Example spaces report which values their examples cover

The original design rendered a coverage heatmap from each example space: which combinations of its typed slots an example witnesses and which none does (`docs/lineage/v0-design/04-authoring-surfaces.md` §4 and §4.1, `06-extraction-and-validation.md` §8). This Spec reports slot-value coverage; the glossary keeps witness for an example in an outcome class. Coverage is per slot value: no design pass has yet asked which combinations of slots no example exercises, and a combination grid grows with the product of the slots' sizes.

## Intent
- problem: The graph carries example spaces and bound points, but no reader value or recipe reports which literal slot values example children bind.
- outcome: Report each literal slot value with the example children that bind it, and each value no child binds, before code exists.

## Behavior
- rule: [#decodedOnce] The engine decodes each Spec's example space into its typed slots, and each example child's steps into its bound point, once, through the notation module that writes the space contracts, and the reader carries both on the Spec context; no recipe or projection parses slot notation a second time.
- rule: [#catalogRecipe] Slot-value coverage is a catalog recipe, recipe 44, over the decoded reader values, listing each literal-union value with the example children that bind it and each value no child binds.
- rule: [#literalUnions] The recipe enumerates slots typed as closed unions of quoted literals. It reports every other slot type, a boolean included, as not enumerable by this recipe, never as covered or as missing a value.
- rule: [#perSlotOnly] Coverage is reported per slot value; the recipe reports no combination of two or more slots until a design pass asks which combinations no example exercises.
- rule: [#eligibleChildren] The examples counted are the space owner's example children that declare `refines` on it and carry a given, when and then entry, the same children its space contract collects.
- rule: [#unboundSlot] An example that binds no value for a slot is listed under that slot as unbound, never as covering a value of it.
- rule: [#confersNothing] Slot-value coverage reports and confers nothing: it moves no readiness, records no verdict and emits no validation finding.

## Design
- readerSpace: the Spec context of a Spec that owns an example space carries `exampleSpace: { slots: ExampleSlot[]; points: BoundPoint[] }`, and a Spec that owns none carries no `exampleSpace`.
- exampleSlot: `{ name: string; type: "number" | "string" | "boolean" | "enum"; values?: string[]; step: string }`, one per slot the space's given and when steps declare, in the order the space contract's dimensions take, `values` the quoted literals in authored order when `type` is `enum`, and `step` the skeleton of the first step declaring the slot.
- boundPoint: `{ example: string; values: Record<string, string | number | boolean> }`, one per eligible child in id order, `values` holding the first value the child binds for each slot, the values the space contract holds for it.
- coverageRecipe: recipe 44, example-space coverage, takes `params.spec` or `params.pack`, at most one, and without either reads every Spec that owns an example space; it returns `{ scope, totals, spaces }`, and `{ diagnostics: [{ parameter, problem }] }` alone when the scope names no Spec or Pack, names both, or names a Spec that owns no example space.
- coverageSpace: `{ spec: string; examples: string[]; slots: CoverageSlot[] }`, one per space in Spec id order, `examples` the eligible children in id order.
- coverageSlot: `{ name: string; type: string; step: string; enumerable: boolean; values: { value: string | number | boolean; examples: string[] }[]; unbound: string[] }`: for an enumerable slot one value row per declared literal in authored order, a row with no example being an uncovered value; for any other slot one row per distinct value its examples bind, in the order they are first bound; `unbound` the examples that bind no value for the slot.
- coverageTotals: `{ spaces: number; slots: number; enumerable: number; values: number; uncovered: number }`, `values` counting the declared literals of the enumerable slots and `uncovered` those no example binds.

## Example space
```gwt-vocabulary
Given an example space that declares the slot {slot:string} as {declared:string}
Given its example children bind {bound:string}
When recipe 44 reports the space's coverage
Then the slot is enumerable: {enumerable:boolean}
Then the values no example binds are {uncovered:string}
Then the examples that leave the slot unbound are {unbound:string}
```
