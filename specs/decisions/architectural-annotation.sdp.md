---
id: spec:decisions.architectural-annotation
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:model.anchors
  supersedes:
    - spec:decisions.structural-anchor-semantics
    - spec:decisions.architectural-significance-rides-primitives
  dependsOn:
    - spec:decisions.binding-not-liveness
    - spec:decisions.anchor-binding-grain
---
# Architectural significance is annotated where it is realized

## Intent
- outcome: Let a code anchor state the architectural role its unit plays, and let a component anchor state its layer and bounded context, so the graph answers architecture questions from the code that realizes the architecture, without a status, a second vocabulary registry, or a second architecture file.

### Open questions
- [non-blocking #roleVocabulary] A role is a free, corpus-owned vocabulary and no validator checks it against a list. Should a corpus be able to declare its role vocabulary in a Spec, with a validator reporting a role outside it, or does the census taxonomy with counts stay the only check? Re-entry trigger: the census taxonomy of one corpus shows the same role under two spellings.

## Decision
- context: Two rulings carried the structural half of the anchor: structural anchors confer nothing (`spec:decisions.structural-anchor-semantics`, MD-30) admitted `component` and `uses` as the only structural fields, and architectural significance rides existing primitives (`spec:decisions.architectural-significance-rides-primitives`, MD-34) refused a vocabulary beyond them and gave up CodeNode-grain roles. Both cited gen 1's tag-registry drift, about 50 tags to about 26, as the failure of an open structural vocabulary. The annotation scout under `docs/lineage/` corrects that account: the 50-to-26 collapse was a cleanup of gen 1's formal vocabulary that never shipped as a runtime registry, and what drifted there was duplicate identities, scan scope, and syntax handling. The original design declared a Component with `layer` and `bounded_context` (`docs/lineage/v0-design/03-graph-metamodel.md` §2.5), and gen 1 carried a role on each annotated unit. The owner's direction opening plan 40 is to bring back the value of annotating architecturally significant units and their relationships in code.
- decision: Architectural significance is annotated on the anchor of the unit that realizes it. A code anchor may carry `role`, the architectural pattern the unit plays; a `component:` anchor may additionally carry `layer`, one of `edge`, `application`, `domain`, `adapter`, or `infrastructure`, and `context`, its bounded context. The `component:` anchor is anchored architecture: it is the declared component, and there is no separate architecture file, because the anchor sits where the component is realized. It is not the original design's declared Component that could exist before code; an unrealized component lives in Specs and never as an invented CodeNode. A role is a free, corpus-owned vocabulary whose taxonomy the census renders with counts from the graph; `service`, `decider`, `projection`, `read-model`, `codec`, `contract`, `barrel`, and `utility` are the lineage set, not a closed list. `layer` is a closed set, and a value outside it is an envelope error; `layer` or `context` on a non-component anchor is an envelope error. All three attributes are optional, and omission is lawful.
- rationale: Hard to reverse: the anchor envelope and the CodeNode fields are contracts for the extractor, the census, the Design Review, and every adopter's annotations. Surprising without context: the superseded rulings refused exactly these attributes on the strength of a drift account the scout found inaccurate, so the reversal reads as a repeat of gen 1 until the correction is on the table. Real trade-off: a free role vocabulary can drift across a corpus and no validator will say so; in exchange, the role, layer, and context live on the one anchor at the one site, and the census taxonomy makes drift visible without a registry.
- rationale: What survives from both superseded rulings is restated here as consequences: the `component` and `uses` semantics and their validation rules, structural non-conferral, no inference from imports, no status or readiness on code, significance never selects a Spec kind, no `pattern:` namespace, and the engine significance criterion.
- consequence: `component?: ComponentAnchorId` and `uses?: readonly CodeAnchorId[]` stay closed graph-ID references deriving only anchored `memberOf` and `uses` edges; neither accepts a free string or an enum detached from graph identity, and there are no per-namespace sibling builders.
- consequence: Every `component` and `uses` target exists as a CodeNode, and a dangling graph id is an error.
- consequence: Membership is one level: a `memberOf` edge runs only from an `impl:` or `api:` CodeNode to a `component:` CodeNode, each source has at most one component, and a `component:` node is never itself a member.
- consequence: A `uses` edge runs between CodeNode endpoints in the `impl:`, `api:`, or `component:` namespace; a present `uses` is non-empty and unique, structural edges are unique, and structural self-reference is an error.
- consequence: Multi-node `uses` cycles remain authored data for the census, never findings; validators infer no transitive edge and reject no cycle.
- consequence: A malformed or non-static structural field, an unknown `layer`, or `layer` or `context` on a non-component anchor refuses the whole anchor at reification rather than yielding a partial declaration; the envelope stays closed.
- consequence: Structural edges and the new attributes confer no intent, delivery fact, or readiness effect; `satisfies` stays the only code-to-Spec realization slot and no `implements` field is admitted.
- consequence: Architecture is never inferred from imports as anchored or declared structure; an inferred structural layer, if one arrives, stays advisory under its own claim, and derivation adds no fourth claim.
- consequence: No status, readiness, intent, behavior, or verification is carried on code; role, layer, and context describe what the unit is, never where it stands.
- consequence: Anchor-required lint stays warn-level and optional; the absence of an anchor is evidence, never a workflow gate.
- consequence: Architectural significance never selects a Spec kind; the Spec states the kind of truth it carries, and relationships among such Specs are the existing relations, with `dependsOn` reserved for genuine semantic need, `supersedes` for actual replacement, and scheduling-flavored edges refused (planning truths live in ruled graph homes, MD-33).
- consequence: Negative architecture constraints, a layer that must not use another, stay declared intent in a Spec, never a machine-enforced graph finding.
- consequence: No `pattern` term, kind, or `pattern:` namespace is admitted; a role is an attribute of a CodeNode, not a node; grouping is derived from id families and the component graph, not new Packs.
- consequence: The engine significance criterion stays exported public surface or cross-component reach; code never satisfies a decision Spec directly (MD-26), and an anchor is never pointed at an unfinished Spec to manufacture coverage.
- consequence: `role` and `context` values are one lowercase kebab token matching `^[a-z][a-z0-9-]*$`, with no normalization, so `read-model`, `readModel`, and `Read Model` cannot coexist as three categories; a value outside the token grammar is an envelope error.
- consequence: The census links each role, layer, and context value to the units that carry it, so an owner can reconcile two spellings of one category by editing the anchors; nothing forces a label, and an unlabelled unit does not populate the taxonomy.
- consequence: The five layers, one line each: `edge` is the transport and presentation boundary; `application` is use cases and orchestration; `domain` is the model and its rules; `adapter` is the implementations of ports toward external systems; `infrastructure` is runtime, persistence, and platform plumbing.
- consequence: A package may hold several layers or several contexts; the package-to-component mapping is reviewed, and one component per package is a choice, never a rule.
- consequence: Retained limitation: there is no independently declared Component; a component that no code realizes yet is a Spec, and the graph holds no CodeNode for it until an anchor exists.
- consequence: The census renders role, layer, context, and `references` beside the structural edges it already renders, reporting an explicit empty state when none exist, and the Design Review's component rows show layer and context; both render under their existing contracts, Mermaid and Gherkin are untouched, and the shipped projections stay frozen (MD-32) as it stands, because a frozen projection renders the graph it is given and no projection is re-specified.
- consequence: Annotations are curated, never a coverage quota; an identity has one owner; a realizing unit documents its local how, never a paraphrase of the Spec's what or why.
- alternative: A separate architecture file declaring components, layers, and contexts was refused: it is a second place for the component to drift from the code that realizes it.
- alternative: A closed role enum was refused: the corpus owns its architecture vocabulary, and a closed set would be the Protocol's architecture, not the adopter's.
- alternative: Deriving role, layer, or context from file paths or imports was refused: it turns incidental layout into authoritative architecture and misclassifies an inferred observation as an anchored claim.
- alternative: Adding `implements` was refused again: it would duplicate `satisfies` for contract-kind targets and make code-to-Spec realization ambiguous.
