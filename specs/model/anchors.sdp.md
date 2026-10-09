---
id: spec:model.anchors
kind: model
altitude: feature
readiness: ready
relations:
  refines: spec:model.core-model
  decidedBy:
    - spec:decisions.anchor-comment-form
    - spec:decisions.anchor-binding-grain
    - spec:decisions.architectural-annotation
    - spec:decisions.binding-not-liveness
---
# Source anchors bind code without carrying intent

## Intent
- outcome: Connect implementation, tests, and oracles to Specs while keeping authored intent centralized in the carrier.

## Model
- **anchor** — A human-written source binding from one code location into the graph, carrying identity, an optional label, zero or more targets, and optional structure; written in one of two extracted representations, the constant form or the comment form, which feed one closed envelope. It never carries behavior, rationale, readiness, status, acceptance criteria, or delivery facts.
- **constant form** — The top-level const initialized with a trusted builder call; the extractor reifies it statically. It was formerly named the anchor-constant form. The decorator form remains an unextracted representation.
- **comment form** — A top-level `/** … */` block in a `.ts` or `.tsx` file carrying reserved camelCase tags (`@sdpAnchor`, `@sdpLabel`, `@sdpSatisfies`, `@sdpVerifies`, `@sdpModels`, `@sdpReferences`, `@sdpComponent`, `@sdpUses`, `@sdpRole`, `@sdpLayer`, `@sdpContext`); `@sdpAnchor <id>` opens it, each tag appears at most once, prose precedes the tags, only the reserved tags are read, and comment prose authors nothing. No import is required: trust is by reserved grammar. The same id in both forms is a duplicate id. The law is the comment-form ruling (MD-36).
- **anchors subpath** — The zero-dependency package subpath `@libar-dev/software-delivery-protocol/anchors`, exporting the id builders and the three anchor builders and nothing else; the extractor trusts it as a Protocol builder module.
- **code anchor** — An implementation-flavored binding in the `impl:`, `api:`, or `component:` namespace. Its optional, plural `satisfies` derives one anchored `satisfies` edge per target; its optional `references` derives one anchored `references` edge per target. It may additionally name one `component?: ComponentAnchorId`, a non-empty, unique `uses?: readonly CodeAnchorId[]`, and a `role`; a `component:` anchor may also name `layer` and `context`. The binding grain is the binding-grain ruling (MD-37); the structural attributes are the architectural-annotation ruling (MD-38).
- **plural targets** — `satisfies` on a code anchor and `verifies` on a test anchor accept one `ref(…)` or a fresh array literal of them; `verifies` is non-empty. Each resolving target confers its fact as a single target does, and `implemented` stays a whole-Spec fact.
- **identity-only anchor** — A code anchor with no `satisfies` and no `references`; it mints a CodeNode for structure and for `byFile`, derives no realization edge, and confers nothing.
- **references** — The anchored CodeNode-to-Spec edge derived from `references?: readonly SpecId[]` on a code anchor: this code is written against that design. It confers no delivery fact, moves no readiness floor, and the drift alarm ignores it; a target also named in `satisfies` is an error. The reader reports the referencing units on the Spec's context, and blast radius traverses the edge as a binding.
- **role** — An optional free string on a code anchor naming the architectural pattern the unit plays; a corpus-owned vocabulary whose taxonomy the census renders with counts, checked against no list.
- **layer** — An optional attribute of a `component:` anchor, one of `edge`, `application`, `domain`, `adapter`, or `infrastructure`; a value outside the set, or the attribute on a non-component anchor, is an envelope error.
- **context** — An optional free string on a `component:` anchor naming its bounded context; on a non-component anchor it is an envelope error.
- **declared component** — The `component:` anchor is the component's declaration; there is no separate architecture file, because the anchor sits where the component is realized.
- **component realization convention** — A `component:` anchor that satisfies a Spec satisfies its seam's most-specific design Spec; that `satisfies` edge is the component's own realization claim. Structural edges confer nothing under the architectural-annotation ruling (MD-38), which supersedes structural anchors confer nothing (MD-30) without changing this.
- **structural anchor validity** — A `memberOf` source is an `impl:` or `api:` CodeNode and its target is a `component:` CodeNode; every structural target exists, every edge is unique, each source has at most one component, and structural self-reference is refused. A malformed or non-static structural field, an unknown `layer`, or `layer` or `context` on a non-component anchor refuses the whole anchor at reification; a graph-validly reified edge that later fails referential or structural validation remains visible with its anchor and independent `satisfies` binding. Multi-node `uses` cycles remain data and produce no finding.
- **structural non-conferral** — Structural edges, `role`, `layer`, and `context` carry no intent, delivery fact, readiness effect, or binding-to-Spec traversal; no `implements` field is admitted.
- **test anchor** — A binding in the `test:` namespace that derives one anchored `verifies` edge per target from a test to each Spec it verifies.
- **oracle anchor** — A binding in the `oracle:` namespace that records an oracle's `models` target without deriving a delivery fact.
- **executable binding boundary** — A resolving `specTest` anchor can establish verifier realization; a `bindExample` call executes a generated contract but is not extracted graph data, so the graph cannot claim from that call alone that the contract is bound.
- **document-realization binding** — When the realizing artifact is authored Markdown that cannot carry an extracted in-code anchor, the executable suite that asserts the shipped document may carry its code anchor. Its label must name the document realization rather than imply the test body is the product, and file-level blast radius remains coverage-unknown for the Markdown artifact.
- **Protocol builder binding** — A builder import from the public Protocol package or its anchors subpath, or a relative import whose importer-relative resolution, including the TypeScript `.js`-to-`.ts` convention, canonicalizes to this package's `ids` or `model/code-anchor` module; consumer-local lookalike modules confer no binding authority. On the CommonJS package surface the trusted relative-module set is empty (`import.meta.url` is rewritten away), so relative bindings mint no anchors there while package imports stay trusted. The comment form needs no builder binding.
- **untrusted builder** — A constant-form builder call whose import is no Protocol builder binding: it mints nothing and reports nothing, because a source file that never bound to the Protocol is not authoring drift to report. The realizing entrypoints are `protocolBindingScopeFor` and `collectProtocolBindings` in `src/extract/protocol-bindings.ts`.

## Example space
```gwt-vocabulary
Given a repository whose one source file builds an anchor through {builderSource:"a consumer-local lookalike module"|"a relative import resolving to the Protocol builder modules"|"the published Protocol package"}
When the repository is extracted
Then the extraction mints {anchorCount:number} anchors
Then the extraction reports {findingCount:number} findings
```
