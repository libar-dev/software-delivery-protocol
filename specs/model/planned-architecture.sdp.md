---
id: spec:model.planned-architecture
kind: model
altitude: feature
readiness: idea
relations:
  dependsOn: spec:model.anchors
  decidedBy: spec:decisions.architectural-annotation
---
# Components are designed ahead of their code

The original design declared a component before its code, as a Component node with a layer, a bounded context and a capability, kept in an architecture folder and reconciled with the code markers and the Specs (`docs/lineage/v0-design/03-graph-metamodel.md` §2.5; `04-authoring-surfaces.md` §7). Its runtime chapter separated what a unit requires from the provider that supplies it, the provider a composition root selects and the one a test puts in its place, and gave one mechanism the ownership of runtime composition (`05-runtime-anchors.md` §1, §3.3, §7).

The Protocol records the architecture the code realizes. A `component:` anchor states its layer and context, and anchored `memberOf` and `uses` edges join the code units. Under the architectural annotation decision, a component no code realizes is a Spec, and the graph holds no node for it until an anchor exists. A design that adds components therefore names them in prose or in Design entries, and nothing compares that design with the components the code later anchors. The first adopter states its component list and its context rule in prose (`libar-platform/design/PLAN.md` §2.1) and checks context isolation over anchored `uses` in its own script (`libar-platform/design/tools/check.py`). When this arc was planned, the owner ruled to capture the component-before-code question here, not to decide it.

## Intent
- problem: A design ahead of its code cannot state the components it adds, their layer and context and what they use, in a form the graph compares with the components the code later anchors.
- outcome: Let a design name the components it will add, with their layer, context and uses, and compare that design with the anchored components once code exists.
- assumption: A component design can be a Spec whose Design entries state the planned layer, context and uses, read beside the anchored component once it exists.
- risk: A planned component kept apart from its realization is a second place for the component to drift, which is why the architectural annotation decision refused a separate architecture file.

### Open questions
- [blocking #componentBeforeCode] Should the architectural annotation decision's rule, that a component no code realizes is a Spec and never a component node, yield to a declared planned component kept apart from anchored realization? Or does a component design Spec, compared with its anchor once one exists, carry the need? The owner ruled to capture this question, not to decide it; changing the rule takes a later decision that supersedes it.
- [blocking #componentDesignShape] Which Design keys does a component design carry, and are they a convention a recipe reads or a shape the Protocol closes? The typing law keeps the Design section open, so closing its keys for one kind of Spec needs its own ruling.
- [non-blocking #realizationComparison] Once code exists, what does the comparison report: a planned component with no anchor, an anchored component no design names, a layer or context that differs, a `uses` edge the design does not name? Recipe 33, architecture crossings, already joins the same anchored data.
- [non-blocking #providerSelection] The original kept apart the interface a unit requires, the providers that supply it, the provider a composition root selects and the one a test substitutes, for Fastify, Effect, Awilix and plain factories alike. Does a component design state these without naming a framework, and does any of them earn graph structure beyond `uses`?
- [non-blocking #oneRuntimeOwner] Is the original's one-runtime-truth rule, one composition mechanism per application, a Protocol rule or a corpus's own architecture rule?

## Model
- **component design** — A Spec that states a component the code does not yet realize, with what it is for and, in Design entries, its planned layer, bounded context and uses. It confers nothing and mints no code unit.
- **planned component** — The component a component design names, which stays intent until a `component:` anchor realizes it.
- **realization comparison** — A report that reads a component design beside the anchored component it names and lists where the two differ; it reports and refuses nothing.
- **provider** — A code unit that supplies an interface another unit requires; a composition selects one provider for each requirement, and a test may select another.
