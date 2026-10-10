---
id: spec:validation.architecture-constraints
kind: rule
altitude: feature
readiness: scoped
relations:
  dependsOn: spec:model.anchors
  decidedBy: spec:decisions.architectural-annotation
---
# Declared architecture rules are checked against anchored structure

The original design gave architecture a validation tier of its own. Its rules said that only adapter components depend on external systems, that domain code imports no infrastructure and that layers depend in one direction; dependency-cruiser, architecture tests and lint rules ran them, and their findings joined the one report (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.4). Since the architectural annotation decision, the data those rules read is in the graph with no inference: a component anchor states its layer and its context, and `uses` and `memberOf` edges are anchored. The same decision keeps the check out of the Protocol. A negative architecture constraint stays declared intent in a Spec, and a corpus that wants it enforced checks its declared `uses`, `layer` and `context` in its own gate.

The first adopter needed one such rule as soon as the attributes landed. No component in its `platform` context may have a `uses` edge to a component in another context, with each end resolved to its component through `memberOf` first. It checks the rule in its own script (`libar-platform/design/tools/check.py`, the context rule of `libar-platform/design/PLAN.md` §2.1). Recipe 33, architecture crossings, reports every `uses` edge whose ends sit in different contexts or layers and refuses nothing.

## Intent
- problem: A corpus that states an architecture rule in a Spec cannot have it checked by the Protocol, so each adopter writes the same walk over `uses`, `memberOf`, `layer` and `context` in its own gate.
- outcome: Check a corpus's declared architecture rules, such as a forbidden uses direction or context isolation, against the layers, contexts and uses its anchors state.

### Open questions
- [blocking #negativeConstraints] The architectural annotation decision keeps negative architecture constraints out of the Protocol's validators and sends them to the corpus's own gate. Does a check that reads only declared rules and anchored structure, and infers nothing, earn a decision that supersedes that consequence?
- [blocking #ruleDeclaration] Where is a rule declared so a check can read it: in a constraint Spec with a machine-readable target, in the Design entries of a component design, or in a corpus rule body?
- [non-blocking #ruleForms] Which rule forms cover the need: a forbidden `uses` from one layer to another, an isolated context, a component that must state a layer? The original's list also held rules on ports and routes, which have no anchors here.

## Rule
- An architecture rule is declared by the corpus as intent and names the `uses` edges it forbids by the layers or contexts of the components at either end.
- A check resolves each end of every anchored `uses` edge to its component, directly or through `memberOf`, and reports each edge a declared rule forbids, naming both units, both components and the rule.
- A check reads declared rules and anchored structure only; it infers no edge from imports, reads no file path and judges no role.
- A component that states no layer or context falls outside a rule that names one, and the check reports it as unclassified rather than as a breach.
