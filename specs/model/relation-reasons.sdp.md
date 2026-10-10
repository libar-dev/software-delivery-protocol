---
id: spec:model.relation-reasons
kind: rule
altitude: story
readiness: scoped
relations:
  refines: spec:model.relations
  decidedBy: spec:decisions.prose-ownership
---
# An authored relation may carry its reason

The original design let a relation say why it holds: a rationale on `refines`, a strength on `dependsOn`, an aspect on `constrainedBy` and a reason on `supersedes` (`docs/lineage/v0-design/01-core-primitives.md` §4; `04-authoring-surfaces.md` §1.3). The Protocol's relations carry a type, a target and a claim, and the envelope that holds them is closed, so the reason a Spec rests on another lives, if anywhere, in narrative prose a reader has to find. The prose-ownership decision gives free prose a home on a typed owner and leaves the text on an edge for later; a relation's reason is that text.

The first adopter meets the reverse case. When its mention audit reported Spec pairs named in prose with no relation behind them, it declared the relations that were missing dependencies and kept twelve pairs as prose, each listed with a one-line reason no typed relation fits (`libar-platform/docs/feedback/sdp-feedback-01.md`, "The mention warnings were mostly missing edges"; `libar-platform/design/tools/prose-mentions.json`). A reason on a relation says why an edge holds; a listed mention reason says why none does.

## Intent
- problem: A reviewer reading a relation cannot see why it holds, and a reviewer reading a mention left as prose cannot tell an intended pointer from a forgotten dependency without a list kept outside the graph.
- outcome: Let an author say in one line why a Spec refines, depends on, is constrained by, is decided by or supersedes another, beside the relation itself.

### Open questions
- [blocking #reasonCarrier] How does the closed envelope carry a reason: a map from target to reason beside each relation list, an object per target, or a body line the relation owns? The envelope contract and every carrier change with the answer.
- [non-blocking #typedAttributes] Should the original's typed attributes return, a strength on `dependsOn` and an aspect on `constrainedBy`, or does one free reason serve every relation type?
- [non-blocking #mentionReasons] Should a mention left as prose carry its reason in the mentioning Spec, so the mention audit can tell an intended pointer from a missing relation, or does that list stay the adopter's own?

## Rule
- An authored relation may carry one optional reason, a single line of prose owned by that relation from that Spec to that target.
- A reason is intent, as its relation is; it confers no delivery fact, moves no readiness floor and changes no edge, and a relation without one stays lawful.
- A reason on `supersedes` says what the newer decision replaces, which is where an amendment that replaces only part of an earlier decision would say so.
- A reason reaches readers with its relation through the graph, so a projection or a recipe reads it from the edge and never from the carrier.
