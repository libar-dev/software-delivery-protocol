---
id: spec:validation.architecture-constraints
kind: rule
altitude: feature
readiness: defined
relations:
  dependsOn:
    - spec:model.anchors
    - spec:validation.corpus-rules
  decidedBy: spec:decisions.architectural-annotation
---
# Declared architecture rules are checked against anchored structure

The original design gave architecture a validation tier of its own. Its rules said that only adapter components depend on external systems, that domain code imports no infrastructure and that layers depend in one direction; dependency-cruiser, architecture tests and lint rules ran them, and their findings joined the one report (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.4). Since the architectural annotation decision, the data those rules read is in the graph with no inference: a component anchor states its layer and its context, and `uses` and `memberOf` edges are anchored. The same decision keeps the check out of the Protocol. A negative architecture constraint stays declared intent in a Spec, and a corpus that wants it enforced checks its declared `uses`, `layer` and `context` in its own gate.

The first adopter checks that a component in its `platform` context has no `uses` edge to a component in another context, resolving each end through `memberOf`. Architecture crossings, recipe 32, reports differences in context or layer and refuses nothing. The architectural annotation decision keeps architecture checks in the corpus's own gate, and the Protocol supplies the reusable graph walk.

## Intent
- problem: A corpus that states an architecture rule in a Spec cannot have it checked by the Protocol, so each adopter writes the same walk over `uses`, `memberOf`, `layer` and `context` in its own gate.
- outcome: Check a corpus's declared architecture rules, such as a forbidden uses direction or context isolation, against the layers, contexts and uses its anchors state.

### Open questions
- [non-blocking #ruleForms] Do corpus rules need to require a component to state a layer or context, or check ports and routes that anchors do not carry, beyond the selected forbidden layer pairs and isolated contexts?
  - decider: owner
  - provisional: the supplied walk checks forbidden layer pairs and isolated contexts; absent attributes are unclassified rather than breaches
- [non-blocking #walkInvocation] Which pure callable walk serves both the catalog recipe and a loaded corpus rule, and what rule-data and result shapes do they share?
  - decider: owner
  - provisional: one pure walk takes `params.forbidden`, a list of `{ from, to }` layer pairs, and `params.isolated`, a list of context tokens whose components may have no `uses` edge into another context, either list possibly empty; it returns each forbidden edge as `{ from, to, fromComponent, toComponent, rule }` and lists unclassified edges apart; recipe 32's result stays as it is

## Rule
- The Protocol's validators never judge a corpus's architecture; an architecture rule runs as one of the corpus's own rules, the corpus's gate decides what fails, and that gate may be the corpus's own invocation of `sdp validate --rules` with the severity the rule states.
- A corpus states each architecture rule as intent in a `constraint` Spec that says what is forbidden and why, and keeps the rule's machine form, its forbidden layer pairs and isolated contexts, as data its corpus rule passes to the walk.
- The Protocol supplies the walk as a catalog recipe that takes forbidden layer pairs and isolated contexts as recipe parameters, resolves each end of every anchored `uses` edge to its component, directly or through `memberOf`, and returns each edge a rule forbids with both units, both components and the rule.
- The walk reads the given rules and anchored structure only; it infers no edge from imports, reads no file path, judges no role and refuses nothing.
- A component that states no layer or context falls outside a rule that names one, and the walk reports it as unclassified rather than as a breach.
- The corpus binds a discovered TypeScript check site to its constraint Spec through a test anchor; that check invokes the corpus rule, and `has-verifier` states that the check exists while its result stays in the corpus's run.
