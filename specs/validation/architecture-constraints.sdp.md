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

The walk returns the edges a rule forbids as corpus findings, so one body answers a reader through `sdp q` and fails a gate when the corpus names it as a rules file; the first adopter's isolation check becomes the walk named by `sdp validate --rules` with the isolated context `platform`, and none of its own code. An edge the walk cannot decide, because a component states no layer or context or an end belongs to no component, is listed apart: a breach the anchors cannot show is a curation gap, not a finding.

## Intent
- problem: A corpus that states an architecture rule in a Spec cannot have it checked by the Protocol, so each adopter writes the same walk over `uses`, `memberOf`, `layer` and `context` in its own gate.
- outcome: Check a corpus's declared architecture rules, such as a forbidden uses direction or context isolation, against the layers, contexts and uses its anchors state.

## Rule
- The Protocol's validators never judge a corpus's architecture; an architecture rule runs as one of the corpus's own rules, the corpus's gate decides what fails, and that gate may be the corpus's own invocation of `sdp validate --rules` with the severity the rule states.
- A corpus states each architecture rule as intent in a `constraint` Spec that says what is forbidden and why, and keeps the rule's machine form, its forbidden layer pairs and isolated contexts, as data its corpus rule passes to the walk.
- [#walk] The Protocol supplies the walk as a catalog recipe, recipe 42, that takes forbidden layer pairs and isolated contexts as recipe parameters, resolves each end of every anchored `uses` edge to its component, directly or through `memberOf`, and returns each edge a rule forbids with both units, both components and the rule.
- [#walkAsRule] The walk returns the edges it forbids as corpus findings in its answer's `findings`, so the shipped recipe file runs unchanged as a rules file under `sdp validate --rules`, at the severity the corpus passes it.
- [#forms] The walk checks two forms, forbidden layer pairs and isolated contexts. It requires no component to state a layer or a context and checks no port, route or other fact the anchors do not carry; a corpus that wants such a check writes a rule of its own.
- The walk reads the given rules and anchored structure only; it infers no edge from imports, reads no file path, judges no role and refuses nothing.
- [#unclassified] A component that states no layer or context falls outside a rule that names one, and the walk lists the edge as unclassified rather than as a breach, as it lists an edge with an end that belongs to no component.
- The corpus binds a discovered TypeScript check site to its constraint Spec through a test anchor; that check invokes the corpus rule, and `has-verifier` states that the check exists while its result stays in the corpus's run.

## Design
- walkParams: recipe 42, the architecture walk, takes `params.forbidden`, a list of `{ from, to }` pairs of layers from the closed set; `params.isolated`, a list of context tokens; and `params.severity`, `"error"` by default or `"warning"`; either list may be empty, and a pair or context given twice counts once; a parameter name outside these three returns `{ unknownParams, accepts }` alone, before any other check, as every catalog recipe answers a name it does not take; neither list given, a layer outside the set, a malformed token or another severity returns `{ diagnostics }` with no `findings`; and either answer fails the file when the walk runs as a rules file.
- walkAnswer: `{ input: { forbidden, isolated, severity }, totals: { usesEdges, resolved, findings, unclassified }, findings, unclassified }` is the answer when every parameter name is known and every value lawful, where `resolved` counts the `uses` edges whose two ends both resolve to a component; findings sort by `from`, then `to`, then rule id, and unclassified rows by `from`, then `to`; recipe 32's answer stays as it is.
- walkBreach: an anchored `uses` edge whose ends resolve to two distinct components breaks the pair `{ from, to }` when the using component states layer `from` and the used one states layer `to`, and breaks the isolation of a context when the using component states that context and the used one states another; two units of one component never break a rule, as recipe 32 never counts them as crossing.
- walkFinding: `{ validatorId, subjectId, relatedId, severity, message, from, to, fromComponent, toComponent, rule }`, a corpus finding in the shape `spec:validation.corpus-rules#design.ruleFinding` pins, where `subjectId` is the using unit `from`, `relatedId` the used unit `to`, both components are `{ id, layer, context }` with null for an unstated attribute, and `validatorId` is `forbidden-layer` with `rule: { from, to }` the pair it breaks, or `isolated-context` with `rule: { context }` the isolated context it leaves.
- walkMessages: a `forbidden-layer` message reads `<from> uses <to>: layer <from layer> uses layer <to layer> (<fromComponent id> to <toComponent id>), a forbidden pair`, and an `isolated-context` message reads `<from> uses <to>: <fromComponent id> in the isolated context <context> uses <toComponent id> in the context <other context>`.
- walkUnclassified: `unclassified` rows `{ from, to, fromComponent, toComponent, missing }` list each anchored `uses` edge the walk cannot decide while a list is non-empty: an edge with an end that belongs to no component, that end's component null and `missing: ["component"]`, and an edge between two distinct components where either leaves unstated an attribute a non-empty list reads, `layer` for `forbidden` and `context` for `isolated`, named in `missing`.

## Example space
```gwt-vocabulary
Given a member of a component at the layer {fromLayer:"domain"|"application"} in the context {fromContext:"platform"|"orders"} that uses a member of a component at the layer {toLayer:"infrastructure"|"adapter"|"unstated"} in the context {toContext:"platform"|"orders"}
When the architecture walk runs {invocation:"through sdp q"|"as a rules file named by sdp validate --rules"} with the forbidden pair domain to infrastructure and the isolated context platform
Then the walk reports {findings:number} findings with the rule ids {ruleIds:string}
Then the walk lists {unclassified:number} unclassified edges
Then the command exits {exitCode:number}
```
