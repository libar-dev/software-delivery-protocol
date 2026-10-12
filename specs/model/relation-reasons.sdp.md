---
id: spec:model.relation-reasons
kind: rule
altitude: story
readiness: ready
relations:
  refines: spec:model.relations
  decidedBy:
    target: spec:decisions.prose-ownership
    reason: the relation owns its reason as typed prose
---
# An authored relation may carry its reason

The original design let a relation say why it holds: a rationale on `refines`, a strength on `dependsOn`, an aspect on `constrainedBy` and a reason on `supersedes` (`docs/lineage/v0-design/01-core-primitives.md` §4; `04-authoring-surfaces.md` §1.3). The Protocol's relations carry a type, a target and a claim; a relation without a reason leaves the explanation of why a Spec rests on another in narrative prose a reader has to find. The prose-ownership decision gives free prose a typed owner; this Spec gives a relation's reason its home on that relation.

The first adopter meets the reverse case. When its mention audit reported Spec pairs named in prose with no relation behind them, it declared the relations that were missing dependencies and kept the rest as prose, each listed with a one-line reason no typed relation fits (`libar-platform/docs/feedback/sdp-feedback-01.md`, "The mention warnings were mostly missing edges"; `libar-platform/design/tools/prose-mentions.json`). A reason on a relation says why an edge holds; a listed mention reason says why none does.

## Intent
- problem: A reviewer reading a relation cannot see why it holds, and a reviewer reading a mention left as prose cannot tell an intended pointer from a forgotten dependency without a list kept outside the graph.
- outcome: Let an author say in one line why a Spec refines, depends on, is constrained by, is decided by or supersedes another, beside the relation itself.

## Rule
- An authored relation may carry one optional reason, a single line of prose owned by that relation from that Spec to that target.
- One optional reason serves every relation type. No strength, aspect or other attribute rides a relation, except the rule keys an example's `verifies` lists, which the rule-coverage recipe reads.
- A reason is intent, as its relation is; it confers no delivery fact, moves no readiness floor and changes nothing its edge confers, and a relation without one stays lawful.
- In the envelope a relation target is a plain Spec id or an object with `target` and optional `reason`; a declared `verifies` object may also carry `exercises`. A target-only object reads as the plain id, plain ids and objects may mix in one relation, and no target is written twice. The TypeScript carrier passes the same reason beside the target.
- A reason on `supersedes` says what the newer decision replaces, and a reason on a `refines` from one decision to another says which part of the older decision the newer one narrows.
- A reason reaches readers with its relation through the graph, so a projection or a recipe reads it from the edge and never from the carrier.
- A mention left as prose carries no reason in the Spec. A corpus may keep the mentions it intends as rows of `from`, `to` and `reason` beside its Specs and pass them to the mention audit as a parameter; the audit reports the pairs a row matches apart from the rest, each with its reason, and lists the rows that match no current pair, while the validator reads no such list and its warning stands.

## Design

- envelopeTarget: a relation target is a Spec id or `{ target: <spec id>, reason: <one line> }`, the two mixing in one list and a single target taking either form; a declared `verifies` object may also carry `exercises`, and an object with another key, an empty reason, or a reason on two lines is refused; an object carrying only `target` reads as the plain id.
- builderArgument: each TypeScript relation builder takes an optional second argument, `dependsOn(target, { reason })`, with `verifies(target, { reason, exercises })` also taking the rule keys, and a builder called without it writes a plain declared relation.
- edgeReason: an authored graph edge carries an optional `reason`, and the reader's relation ends carry it; the guarantees recipe (3), dependency footing (21), the planning slice (19) and the decision register (31) show it beside the relation.
- gherkinRelations: no Gherkin form is invented for a relation reason, because relation tags carry no prose; a Spec that needs one is authored in Markdown or TypeScript.
- intendedMentions: the mention audit (recipe 22) takes `params.intended`, rows `{ from, to, reason }` keyed by Spec ids, and returns `intended`, the unbacked pairs a row matches with its reason, kept apart from the remaining pairs, and `staleIntended`, the rows that match no current pair.
