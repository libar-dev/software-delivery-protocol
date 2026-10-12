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

The first adopter needed one such rule as soon as the attributes landed. No component in its `platform` context may have a `uses` edge to a component in another context, with each end resolved to its component through `memberOf` first. It checks the rule in its own script (`libar-platform/design/tools/check.py`, the context rule of `libar-platform/design/PLAN.md` §2.1). Recipe 32, architecture crossings, reports every `uses` edge whose ends sit in different contexts or layers and refuses nothing. The owner ruled that the architectural annotation decision stands: an architecture rule stays the corpus's own and runs as one of its corpus rules, and the Protocol supplies the walk the adopter writes by hand today.

## Intent
- problem: A corpus that states an architecture rule in a Spec cannot have it checked by the Protocol, so each adopter writes the same walk over `uses`, `memberOf`, `layer` and `context` in its own gate.
- outcome: Check a corpus's declared architecture rules, such as a forbidden uses direction or context isolation, against the layers, contexts and uses its anchors state.

### Open questions
- [non-blocking #ruleForms] Which rule forms cover the need: a forbidden `uses` from one layer to another, an isolated context, a component that must state a layer? The original's list also held rules on ports and routes, which have no anchors here.

## Rule
- The Protocol's validators never judge a corpus's architecture; an architecture rule runs as one of the corpus's own rules, the corpus's gate decides what fails, and that gate may be the corpus's own invocation of `sdp validate --rules` with the severity the rule states.
- A corpus states each architecture rule as intent in a `constraint` Spec that says what is forbidden and why, and keeps the rule's machine form, its forbidden layer pairs and isolated contexts, as data its corpus rule passes to the walk.
- The Protocol supplies the walk as a catalog recipe that takes forbidden layer pairs and isolated contexts as recipe parameters, resolves each end of every anchored `uses` edge to its component, directly or through `memberOf`, and returns each edge a rule forbids with both units, both components and the rule.
- The walk reads the given rules and anchored structure only; it infers no edge from imports, reads no file path, judges no role and refuses nothing.
- A component that states no layer or context falls outside a rule that names one, and the walk reports it as unclassified rather than as a breach.
- The corpus binds its rule file to the constraint Spec as that Spec's verifier through a test anchor, so `has-verifier` says a check for the constraint exists; pass and fail stay in the corpus's own run.
