# Annotation context

This is the short orientation to the annotation decisions. It is historical and design context, not current law. The carrying Specs under `specs/` and the vocabulary in `CONTEXT.md` remain authoritative. The detailed scout is retained temporarily as [archive material](./archive-annotation-scout-2026-10-04.md).

## The lesson

The first generation, `@libar-dev/architect`, proved that source annotations could join code, behavior, decisions and generated documentation in one graph. It also showed the cost of a broad tag registry: the formal vocabulary, parser, checks and guidance drifted apart.

The pre-code seed design kept structured source markers in the model. The current Protocol's early design then overcorrected. It refused JSDoc identity tags and restricted source bindings too narrowly. Complete annotation exclusion was a mistake: without source bindings, projections cannot show which units realize a Spec, which tests verify it, how components relate or which design existing code follows.

The correction was not a return to the old tag registry. It was a small binding model with two representations and one graph.

## What an anchor contributes

An anchor is a human-written pointer in source code or tests. It binds identity and optional structure into the graph. It does not carry behavior, rationale, readiness, workflow status or delivery facts.

The graph needs those bindings for several kinds of projections:

- `satisfies` identifies code that realizes a Spec and confers `implemented` when the edge resolves.
- `verifies`, on a test anchor, identifies a test that verifies a Spec. The edge is `anchored` and can confer `has-verifier`.
- `models` binds an expected-outcome oracle to an example space.
- `references` identifies code that answers to a design without claiming to realize it. It confers no delivery fact.
- `memberOf` and `uses` record curated architectural structure between code units.
- `role`, and `layer` and `context` on component anchors, describe the unit's architectural place.

These bindings let a projection answer from repository evidence rather than reconstructing architecture from filenames, imports or prose. A binding still does not prove behavior. `implemented` is not liveness, and `has-verifier` is not a passing test.

An example verifies differently. An example Spec states its own `verifies` relation in its carrier, with the `declared` claim, not through an anchor. That relation confers `has-verifier` on its target only when a resolving test anchor binds the example itself, which makes the example an enabled verifier.

## The current representations

The constant form uses a statically extracted top-level builder call. The comment form uses reserved `@sdp*` tags in a top-level block and needs no runtime import. Both feed the same closed anchor envelope and derive the same graph model.

Bindings are optional and plural. A unit may name only structure, reference an unrealized design, or realize several Specs. Code that follows a decision uses `references`, not `satisfies`.

Declared intent in Specs, anchored bindings in source and inferred mechanical structure keep their distinct claims. Multiple extractors and representations do not imply multiple read models.

## What stayed excluded

The old process metadata did not return. Source anchors do not carry ticket status, hand-authored completion or a second readiness model. Git records history. CI supplies run results separately. The graph derives delivery facts from resolving edges.

The detailed evidence behind the correction lives in the archived scout and [PR #29](https://github.com/libar-dev/software-delivery-protocol/pull/29). Current law lives in `spec:model.anchors`, `spec:extraction.claim-taxonomy`, `spec:decisions.anchor-comment-form`, `spec:decisions.anchor-binding-grain` and `spec:decisions.architectural-annotation`.
