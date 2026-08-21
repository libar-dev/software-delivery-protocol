---
id: spec:decisions.architectural-significance-rides-primitives
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:model.anchors
  dependsOn:
    - spec:decisions.structural-anchor-semantics
    - spec:decisions.binding-not-liveness
---
# Architectural significance rides existing primitives

## Intent
- outcome: Rule that architecturally significant patterns and their relationships are authored on the existing Spec primitive, relation vocabulary, and structural anchors, so the graph answers architecture questions without a second architecture vocabulary.

## Decision
- context: `spec:model.structural-patterns` asked whether a vocabulary beyond `component` and `uses` passes the ADR three-part test, and "pattern" is not a ratified term; gen-1's tag-registry drift (~50→~26 tags) is the recorded failure of an open structural vocabulary (MD-30 cites it).
- decision: Architectural significance is authored on existing primitives, in order. First, a pattern is a `decision`-kind or `model`-kind Spec; no "pattern" term or kind is ratified. Second, relationships between patterns are the existing relations — `dependsOn`, `supersedes`, `refines`, `decidedBy` — with `dependsOn` reserved for genuine semantic need and `supersedes` for actual replacement under the ADR test; scheduling-flavored edges stay refused (MD-33). Third, code linkage rides the `satisfies` → `decidedBy` join: a component or member anchor satisfies the Spec it realizes, and that Spec names its shaping decisions by `decidedBy`; code never satisfies a decision Spec directly (MD-26). Fourth, grouping is derived from id families and the component graph, not new Packs. Fifth, the significance criterion for engine self-binding is exported public surface plus cross-component reach; under it `component:protocol.import` and `component:protocol.testing` enter the accepted component set.
- rationale: Hard to reverse — it permanently closes the vocabulary question and sets the grain at which architecture is authored; surprising without context — the concept "pattern" dissolves into named coordinates rather than gaining a word; real trade-off — CodeNode-grain pattern roles and machine-checked forbidden dependencies are given up to preserve one graph language.
- consequence: The two blocking open questions on `spec:model.structural-patterns` resolve: no vocabulary beyond `component`/`uses` passes the ADR test, and no "pattern" term is ratified.
- consequence: Two documented grain limits stand as named limits, not holes: pattern membership is Spec-grain (one `codeAnchor` carries one `satisfies`), and negative constraints are claimable but not enforced until the deferred architecture-enforcement validator family lands.
- consequence: New `codeAnchor`s minted under this ruling satisfy only Specs the unit already realizes; anchors are never pointed at decision Specs or unfinished Specs to manufacture coverage.
- consequence: `component:protocol.import` and `component:protocol.testing` join the accepted component set; the structural-edges oracle's import exception comment is retired by this ruling.
- alternative: A dedicated pattern layer (`participatesIn` fields, `pattern:` ids, an architecture validator) was refused — it recreates the MD-30/MD-33-refused engine surface and the gen-1 taxonomy drift.
- alternative: Deriving architecture from imports stays refused (MD-30): structural edges are authored declarations, never inference.
