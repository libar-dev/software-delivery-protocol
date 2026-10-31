---
id: spec:model.planned-architecture
kind: model
altitude: feature
readiness: ready
relations:
  refines:
    target: spec:model.core-model
    reason: planned components enrich Specs before code binds them
  dependsOn:
    target: spec:model.anchors
    reason: a planned component is realized by a component anchor that satisfies its design
  decidedBy: spec:decisions.architectural-annotation
---
# Components are designed ahead of their code

The original design declared a component before its code, as a Component node with a layer, a bounded context and a capability, kept in an architecture folder and reconciled with its code anchors and the Specs (`docs/lineage/v0-design/03-graph-metamodel.md` §2.5; `04-authoring-surfaces.md` §7). Its runtime chapter separated what a unit requires from the provider that supplies it, the provider a composition root selects and the one a test puts in its place, and gave one mechanism the ownership of runtime composition (`05-runtime-anchors.md` §1, §3.3, §7).

The Protocol records the architecture the code realizes. A `component:` anchor states its layer and context, and anchored `memberOf` and `uses` edges join the code units. Under the architectural annotation decision, a component no code realizes is a Spec, and the graph holds no node for it until an anchor exists. The first adopter states its component list and its context rule in prose (`libar-platform/design/PLAN.md` §2.1) and checks context isolation over anchored `uses` in its own script (`libar-platform/design/tools/check.py`). The owner ruled that the architectural annotation decision stands: a component designed before its code is a component design Spec, and the `component:` anchor that later realizes it satisfies that Spec, which is the join a comparison reads.

Choosing a provider stays prose. The original's distinctions between the interface a unit requires, the providers that supply it, the one a composition root selects and the one a test substitutes help a reader, and none of them needs graph structure beyond `uses` to be compared. Keeping one composition mechanism per application is a corpus's own architecture rule when the corpus wants it, stated in a `constraint` Spec and checked by its own corpus rule. A component design names its component with the keys a component anchor uses, so the comparison reads the same words on both sides, and a key the design leaves out is not compared, so a design states only what it has decided; a design that has decided its component uses nothing says `none`, which a left-out key cannot say.

## Intent
- problem: A design ahead of its code cannot state the components it adds, their layer and context and what they use, in a form the graph compares with the components the code later anchors.
- outcome: Let a design name the components it will add, with their layer, context and uses, and compare that design with the anchored components once code exists.
- risk: A planned component kept apart from its realization is a second place for the component to drift, which is why the architectural annotation decision refused a separate architecture file and why the design lives in a Spec the realizing anchor satisfies.

## Model
- **component design** — A Spec that states a component the code does not yet realize and what it is for. Its Design entries are keyed as the anchor's attributes are named: `id` for the planned `component:` anchor's own id, `layer`, `context`, `uses` for the components it will use, and optionally `role`. The keys are a convention recipes read; the Protocol closes no Design shape, and the Spec confers nothing and mints no code unit.
- **planned component** — The component a component design names. It stays intent until a `component:` anchor realizes it, and that anchor satisfies the component design; the graph holds no component node before the anchor exists.
- **realization comparison** — Recipe 43, planned against realized components, which reads each component design beside the `component:` anchor that satisfies it, resolving members through `memberOf` as recipe 32 does, and lists a design no anchor satisfies yet, a layer, context or role that differs, and a `uses` named on one side only. It reports and refuses nothing.
- **provider** — A code unit that supplies an interface another unit requires; a composition selects one provider for each requirement, and a test may select another. A component design names its providers and that selection in prose, and none of them earns graph structure beyond `uses`.

## Design
- componentDesign: a Spec is a component design when its Design `id` value, bare or in the code span that opens it, is a `component:` id; the curation report and the realization comparison select designs this way, and no validator reads the convention.
- designKeys: the comparison reads five Design keys, `id`, `layer`, `context`, `role` and `uses`, and no other; `layer` takes one of the five layers, `context` and `role` one token on the role grammar, and `uses` either `none` for the empty list or `component:` ids separated by commas, each trimmed, read as the set of distinct ids; each value is read bare when it is the whole value, or from the code span that opens it, with prose after the span free to say why.
- comparisonRecipe: recipe 43, planned against realized components, takes no parameter, so any parameter name returns `{ unknownParams, accepts: [] }` alone, as every catalog recipe answers a name it does not take; otherwise it returns `{ totals, unrealized, differing, unreadable }`, where `totals` is `{ designs, realized, matching, unrealized, differing, unreadable }`, `matching` counts the realized designs with neither a differing row nor an unreadable row, and `differing` counts rows.
- realizedWhen: a design is realized when its `component:` CodeNode is anchored and has an anchored `satisfies` edge to the design, as the curation report reads it; a design whose component exists without that edge stays unrealized, with `anchorExists: true`.
- comparedFields: for a realized design, each of `layer`, `context`, `role` and `uses` the design states is compared with the anchored component, and a key the design leaves out is not compared; the realized `uses` are the components other than its own that an anchored `uses` edge from the component or one of its members reaches, each end resolved to its component as recipe 32 resolves it.
- comparisonRows: `unrealized` rows are `{ spec, componentId, anchorExists, layer, context, role, uses }` with the planned values, null when unstated, and `uses` an empty list when the design states `none`; `differing` rows are `{ spec, componentId, field, planned, realized }`, one for each differing field, where `layer`, `context` and `role` carry the two values or null and `uses` carries the two sorted lists of components named on that side only; `unreadable` rows are `{ spec, key, value }` for a value outside its key's form, and that key is not compared; rows sort by `spec`, then by `field` or `key`.

## Example space
```gwt-vocabulary
Given a component design for {componentId:string} that plans the layer {plannedLayer:"domain"|"application"} and uses {plannedUses:string}
Given the component anchor for that design {anchor:"is absent"|"satisfies the design"}
Given that anchor states the layer {realizedLayer:"domain"|"application"|"absent"} and its member uses {realizedUses:string}
When the realization comparison runs
Then the comparison lists {unrealized:number} unrealized designs, {matching:number} matching designs and {differing:number} differing rows
Then the differing fields are {fields:string}
```
