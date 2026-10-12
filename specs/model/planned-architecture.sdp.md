---
id: spec:model.planned-architecture
kind: model
altitude: feature
readiness: defined
relations:
  dependsOn: spec:model.anchors
  decidedBy: spec:decisions.architectural-annotation
---
# Components are designed ahead of their code

The original design declared a component before its code, as a Component node with a layer, a bounded context and a capability, kept in an architecture folder and reconciled with the code markers and the Specs (`docs/lineage/v0-design/03-graph-metamodel.md` §2.5; `04-authoring-surfaces.md` §7). Its runtime chapter separated what a unit requires from the provider that supplies it, the provider a composition root selects and the one a test puts in its place, and gave one mechanism the ownership of runtime composition (`05-runtime-anchors.md` §1, §3.3, §7).

The Protocol records the architecture the code realizes. A `component:` anchor states its layer and context, and anchored `memberOf` and `uses` edges join the code units. Under the architectural annotation decision, a component no code realizes is a Spec, and the graph holds no node for it until an anchor exists. The first adopter states its component list and its context rule in prose (`libar-platform/design/PLAN.md` §2.1) and checks context isolation over anchored `uses` in its own script (`libar-platform/design/tools/check.py`). On 2026-10-12 the owner ruled that the architectural annotation decision stands: a component designed before its code is a component design Spec, and the `component:` anchor that later realizes it satisfies that Spec, which is the join a comparison reads.

## Intent
- problem: A design ahead of its code cannot state the components it adds, their layer and context and what they use, in a form the graph compares with the components the code later anchors.
- outcome: Let a design name the components it will add, with their layer, context and uses, and compare that design with the anchored components once code exists.
- risk: A planned component kept apart from its realization is a second place for the component to drift, which is why the architectural annotation decision refused a separate architecture file and why the design lives in a Spec the realizing anchor satisfies.

### Open questions
- [non-blocking #providerSelection] The original kept apart the interface a unit requires, the providers that supply it, the provider a composition root selects and the one a test substitutes, for Fastify, Effect, Awilix and plain factories alike. Does a component design state these without naming a framework, and does any of them earn graph structure beyond `uses`?
- [non-blocking #oneRuntimeOwner] Is the original's one-runtime-truth rule, one composition mechanism per application, a Protocol rule or a corpus's own architecture rule?

## Model
- **component design** — A Spec that states a component the code does not yet realize and what it is for. Its Design entries are keyed as the anchor's attributes are named: `component` for the planned `component:` id, `layer`, `context`, `uses` for the components it will use, and optionally `role`. The keys are a convention a recipe reads; the Protocol closes no Design shape, and the Spec confers nothing and mints no code unit.
- **planned component** — The component a component design names. It stays intent until a `component:` anchor realizes it, and that anchor satisfies the component design; the graph holds no component node before the anchor exists.
- **realization comparison** — A catalog recipe that reads each component design beside the `component:` anchor that satisfies it, through the component data recipe 32 joins, and lists a design no anchor satisfies yet, a layer or context that differs, and a `uses` named on one side only. It reports and refuses nothing.
- **provider** — A code unit that supplies an interface another unit requires; a composition selects one provider for each requirement, and a test may select another.
