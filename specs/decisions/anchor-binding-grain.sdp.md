---
id: spec:decisions.anchor-binding-grain
kind: decision
altitude: feature
readiness: defined
relations:
  refines: spec:model.anchors
  dependsOn: spec:decisions.binding-not-liveness
---
# Bindings are optional, plural, and may reference a design

## Intent
- outcome: Let a code anchor name zero, one, or several Specs it realizes, and name the Specs it is written against without claiming to realize them, so an anchor can state exactly what its code does and the graph can reach a design from the code that rests on it.

### Open questions
- [non-blocking #entryAddressTargets] The original design admits a `#` sub-segment in the id grammar for a child of a Spec that is not itself a Spec (`docs/lineage/v0-design/03-graph-metamodel.md` §6.2), and the checked-mentions ruling gives `#` its one meaning as an entry address while refusing it in every id slot, anchor targets included. Should a `satisfies` or `references` target be allowed to name an entry address, so code can bind to one keyed Design entry, or does binding stay at Spec grain with the entry named in the label? Re-entry trigger: an adopter whose Specs carry their design as keyed entries asks for it twice.
- [non-blocking #referenceDirection] This ruling says a `references` edge records that the code is written against the design. The engine's own self-binding points existing reader and projection units at the Studio Specs whose design rests on that code, the reading the annotation scout under `docs/lineage/` gives the first generation's see-also, and an independent review reads those edges as inverted. Does `references` also admit existing code as the design context of a Spec no code realizes yet, or only code written against the design, so the Studio references come out and each unit references the decisions it follows instead? Re-entry trigger: the owner's `ready` statement on this decision.

## Decision
- context: A code anchor carries one required `satisfies`, a test anchor one `verifies`. The first adopter split Specs so that an anchor could claim only what its code does, a stub reads as `implemented` because the only way to name a design from code is to claim to realize it, and a relationship the design states in prose cannot reach a page. The original design made `satisfies` optional and plural on a marker (`docs/lineage/v0-design/04-authoring-surfaces.md` §2.4) and drew the line that markers carry identity and structure, never readiness, intent, behavior, or verification. The annotation scout under `docs/lineage/` found no informational code-to-Spec edge in either lineage and proposed one as the smallest extension.
- decision: On a code anchor, `satisfies` is optional and plural; on a test anchor, `verifies` is plural and non-empty. The constant form accepts one `ref(…)` or a fresh array literal of them. Each resolving target confers its fact as today, and `implemented` stays a whole-Spec fact. A new anchored edge `references` runs from a CodeNode to a Spec, from `references?: readonly SpecId[]` on a code anchor; it may target any Spec, decisions included, confers no delivery fact, moves no readiness floor, and the drift alarm ignores it. It says this code is written against that design. A target named in both `satisfies` and `references` is an error. An identity-only code anchor, with no `satisfies` and no `references`, is lawful: it mints a CodeNode for structure and for `byFile`, and nothing else.
- rationale: Hard to reverse: the anchor contract and the closed edge list are contracts for the extractor, the validators, the reader, and every adopter's anchors. Surprising without context: the obvious move is to let `satisfies` name a design the code only partly realizes, and this ruling refuses that in favor of a second edge that confers nothing. Real trade-off: a non-conferring edge can be written where a realization claim is due, and nothing in the graph says which; in exchange, `implemented` keeps its one meaning and an honest anchor is always writable.
- rationale: Bindings state existence, not liveness, and `references` states less than existence of realization: only that the code rests on the design. Keeping that below the delivery facts preserves the drift alarm's meaning.
- consequence: The closed edge list gains `references`, derived and anchored; `satisfies` and `verifies` edges are one per target.
- consequence: A present `references` is non-empty and unique; a non-resolving target confers nothing and reports as a non-resolving `satisfies` target does.
- consequence: `satisfies` keeps its posture: code never satisfies a decision Spec directly (MD-26), and an anchor is never pointed at an unfinished Spec to manufacture coverage; a unit written against such a Spec references it.
- consequence: An identity-only anchor derives no `satisfies` edge, so it never confers `implemented`; a stub written against a design references the design rather than satisfying it.
- consequence: `byFile` may lawfully return a CodeNode with an empty Spec list; an empty list is the identity-only anchor's honest answer, not a lookup failure.
- consequence: `blastRadius` reports changed identity-only CodeNodes as their own list, neither dropped nor folded into coverage-unknown, because the graph records the node and nothing it binds.
- consequence: The drift alarm ignores `references` and still reports a `satisfies` target that states below `ready`, target by target.
- consequence: The build backlog predicate (recipe 1) is unchanged: `references` neither adds nor removes a row.
- consequence: The reader's Spec context names the CodeNodes that reference the Spec with their file and line; blast radius traverses `references` as a binding and names the edge type in its reason.
- consequence: The Design Review Spec page lists the units that reference the Spec, and the census renders `references` beside the structural edges.
- alternative: A partial-realization delivery fact was refused: a fact that says "partly implemented" is a status on code, and the floor cannot read it honestly.
- alternative: Folding the design relationship into `satisfies` was refused: it manufactures `implemented` on a Spec the code does not realize, which is the adopter's stub problem restated.
- alternative: Declaring the relationship on the Spec, as a list of its own code bindings, was refused: a Spec-side list of bindings is authored delivery state and a second place for the binding to drift.
