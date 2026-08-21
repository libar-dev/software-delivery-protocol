---
id: spec:decisions.structural-anchor-semantics
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:model.anchors
  dependsOn: spec:decisions.binding-not-liveness
---
# Structural anchor semantics

## Intent
- outcome: Resolve which intent-free structural relationships code anchors may author without creating a second architecture truth.

## Decision
- context: The generic `codeAnchor` already binds realization to a Spec through `satisfies`, while the reserved structural-semantics question leaves component membership and dependencies between anchored code units unresolved. Gen-1 also used `@architect-implements` to join separate test-pattern identities, not code to Spec, and exposed authored `uses` relationships through a broad tag registry.
- decision: In order, first, `satisfies` remains the only code-to-Spec realization slot: code that realizes a contract-kind Spec satisfies that Spec by authoring convention, so no `implements` field is admitted. Second, `component` and `uses` enter the `codeAnchor` contract as the only new structural fields. Third, their value forms are closed graph-ID references: `component?: ComponentAnchorId` is one statically reifiable reference, and `uses?: readonly CodeAnchorId[]` is a statically reifiable array of references; neither field accepts free strings or an enum detached from graph identity. Fourth, the structural references derive only the anchored `memberOf` and `uses` edges under the validation rules below. Fifth, the census always derives their taxonomy and rows from the graph and runtime constants; it is generated, disposable, and never hand-maintained.
- rationale: This is hard to reverse because the anchor authoring API and persisted edge vocabulary become contracts for source, validators, queries, and projections. It is surprising without context that contract realization remains `satisfies`, that a dependency cycle is accepted, and that structural edges confer no realization state. It is a real trade-off: local authored structure and referential checks justify two narrow fields, while rejecting `implements`, inference, lifecycle metadata, and an open tag system gives up looser notation to preserve one graph language. The caution is gen-1's taxonomy drift: a claimed 50 tags was corrected to about 26 while inconsistent counts remained (`reviews/14-executable-verification-design-review.md`, which cites the gen-1 formal-spec findings review); generated census output is therefore evidence, never another registry.
- consequence: Every `component` and `uses` target must exist as a `CodeNode`; a dangling graph ID is an error. A `memberOf` edge runs only from an `impl:` or `api:` `CodeNode` to a `component:` `CodeNode`, and each source has at most one component, enforcing one-level membership: a `component:` node cannot itself be a member. A `uses` edge runs between `CodeNode` endpoints whose IDs use the `impl:`, `api:`, or `component:` namespace.
- consequence: A present `uses` array must be non-empty and contain unique targets. Structural edges must be unique, and any structural self-reference is an error. Multi-node `uses` cycles remain authored data for census projection, not validator findings; validators do not infer transitive edges or reject cycles.
- consequence: The census renders the admitted structural bindings from graph edges, including component membership and uses relationships, and reports an explicit empty state when none exist. It may group cycles as data, but it neither re-derives validation findings nor owns a manually curated taxonomy.
- consequence: The new fields extend `codeAnchor` only; there are no per-namespace sibling anchor builders.
- consequence: The new edges are anchored claims only, never inferred claims; deriving architecture from imports is refused, because these edges are authored declarations in code. Derivation remains a mechanism and does not add a fourth claim.
- consequence: Anchors carry no intent, readiness, status, or delivery fact. `memberOf` and structural `uses` mint no delivery facts, add no delivery status, and do not change readiness floors.
- consequence: No free-form tag vocabulary, authored lifecycle, or parallel registry is admitted.
- consequence: Foreign fields remain extraction errors; after admitting `component` and `uses`, the anchor envelope remains closed and a malformed structural field refuses the whole anchor rather than yielding a partial declaration.
- consequence: Anchor-required lint remains warn-level and optional; absence of an anchor is useful evidence but never a load-bearing workflow gate.
- alternative: Adding `implements` would mirror gen-1 terminology, but would duplicate `satisfies` for contract-kind targets and make code-to-Spec realization ambiguous.
- alternative: Deriving dependencies from imports would increase coverage without annotations, but would turn incidental runtime wiring into authoritative architecture and misclassify an inferred observation as an anchored claim.
- alternative: Closed enums or free-form tags would be easy to author, but would not resolve to graph nodes and would recreate the taxonomy-governance failure this decision is intended to avoid.
