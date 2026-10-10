---
id: spec:consumers.agent-surface.design-recipes
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:consumers.agent-surface.register-recipes
  dependsOn:
    - spec:consumers.pack-design
    - spec:consumers.agent-surface.recipe-parameters
---
# Design work reads its answers from catalog recipes

## Intent
- problem: Iterating on a design asks questions no recipe answers in one body: where a Pack's design stands, what a change to a Spec asks to follow, which decisions shape what, which values of an example space no example covers, and which component dependencies cross a context or a layer. The first adopter answers each with its own script.
- outcome: Answer each of those questions with a catalog recipe that runs as written, so design work reads them from the graph.

## Behavior
- rule: Pack design (recipe 29) takes a Pack id in `params.pack` and returns the Pack context's design assembly as data: the members in authored order with their stated next rung and its unmet clauses, their design columns, bindings and verifiers, and the Pack's boundary. It returns `found: false` for an id that is no Pack.
- rule: Design-change impact (recipe 30) takes Spec ids in `params.specs` and returns every Spec that rests on them, transitively, through inbound `refines`, `dependsOn`, `constrainedBy` or `decidedBy` edges, each with the relation path that reaches it and its distance. For the changed Specs and every dependent it lists the units that satisfy it, the units that reference it, its enabled verifiers and its Packs. A `references` edge counts as a unit to notify and confers nothing.
- rule: Decision register (recipe 31) takes no parameter and returns one row per decision Spec, sorted by id: its title, stated rung, the decisions it supersedes and the decisions that supersede it, the Specs that name it through `decidedBy`, its keyed open questions, and its Packs. It reads the graph alone; the ratified names stay in the decision registry document.
- rule: Example-space coverage (recipe 32) takes no parameter and returns one row per Spec that owns an example space. For each slot whose type is a union of literals it lists every literal with the example children whose bound point names it, and the literals no child names are that slot's coverage gaps. A slot of an open type is listed with the values the children bind and no gap. It reports and never refuses.
- rule: Architecture crossings (recipe 33) takes no parameter and returns every `uses` edge whose two ends, each resolved to its own component directly or through `memberOf`, have components that both state a context and differ in it, or both state a layer and differ in it. Each row names both units, both components and what differs. It reports and never refuses: a corpus gates its own architecture rule, as the architectural annotation decision leaves it.
- rule: Each recipe body lives in the catalog and runs as written in the recipe test, and each reads its parameter as the recipe-parameters Spec states.
