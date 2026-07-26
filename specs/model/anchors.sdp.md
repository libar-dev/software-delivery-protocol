---
id: spec:model.anchors
kind: model
altitude: feature
readiness: ready
relations:
  refines: spec:model.core-model
  decidedBy: spec:decisions.binding-not-liveness
---
# Source anchors bind code without carrying intent

## Intent
- outcome: Connect implementation, tests, and oracles to Specs while keeping authored intent centralized in the carrier.

## Model
- **anchor** — A human-written source binding from one code location to one Spec ID, carrying identity, an optional label, and one target only.
- **code anchor** — An implementation-flavored binding that derives an anchored satisfies edge.
- **test anchor** — A binding that derives an anchored verifies edge from a test to its target Spec.
- **oracle anchor** — A binding that records an oracle's models target without deriving a delivery fact.
- **anchor-constant form** — The top-level const builder call that the MVP extractor reifies; decorator and JSDoc forms remain unextracted representations.
- **Protocol builder binding** — A builder import from the public Protocol package, or a relative import whose importer-relative resolution — including the TypeScript `.js`-to-`.ts` convention — canonicalizes to this package's `ids` or `model/code-anchor` module; consumer-local lookalike modules confer no binding authority. On the CommonJS package surface the trusted relative-module set is empty (`import.meta.url` is rewritten away), so relative bindings mint no anchors there while package imports stay trusted.
- **untrusted builder** — A builder call whose import is no Protocol builder binding: it mints nothing and reports nothing, because a source file that never bound to the Protocol is not authoring drift to report. The realizing entrypoints are `protocolBindingScopeFor` and `collectProtocolBindings` in `src/extract/protocol-bindings.ts`.

## Example space
```gwt-vocabulary
Given a repository whose one source file builds an anchor through {builderSource:"a consumer-local lookalike module"|"a relative import resolving to the Protocol builder modules"|"the published Protocol package"}
When the repository is extracted
Then the extraction mints {anchorCount:number} anchors
Then the extraction reports {findingCount:number} findings
```
