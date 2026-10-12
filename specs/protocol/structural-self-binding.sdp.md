---
id: spec:protocol.structural-self-binding
kind: behavior
altitude: story
readiness: defined
relations:
  refines: spec:protocol.self-hosting
  dependsOn:
    - target: spec:model.structural-patterns
      reason: this model defines the significance criterion and the owner-reviewed accepted set
  decidedBy:
    - spec:decisions.architectural-annotation
    - spec:decisions.anchor-binding-grain
---
# The engine's structural self-binding covers its architecturally significant units

## Intent

- outcome: Structural recipes, the census and the Design Review answer architecture questions about the engine from its own anchors.

## Behavior

- rule: [#criterion] The engine applies the structural-patterns model's significance criterion: exported public surface or cross-component reach.
- rule: [#membership] Every architecturally significant engine unit carries component membership through a realizing anchor; a helper with no realization target of its own is covered through the nearest realization anchor that consumes it.
- rule: [#architecturalUses] An architectural dependency of the engine is declared as `uses`, normally from one engine component to another; a unit's own `uses` is optional.
- rule: [#componentUses] A component-level `uses` declaration tracks real value or type imports from another component's source files; imports made only to author anchors through the stable-id or anchor-builder modules confer no edge.
- rule: [#acceptedSet] The accepted set of architecturally significant engine units is an owner-reviewed declaration among the self-hosting suite's pinned expectations, never derived from imports or exports; the suite checks every accepted unit's declared membership and rejects unrostered membership edges.
- rule: [#layerAndContext] Every engine `component:` anchor declares its `layer` and its `context`.
- rule: [#role] Every architecturally significant engine unit carries a `role`.
- rule: [#decisionReferences] A unit reaches the decisions that shape it through the Specs it satisfies and their `decidedBy` relations, and may reference a decision directly when it answers to that design. A unit satisfies a Spec when it realizes at least one promise of it, and the satisfying units together realize every promise; a unit that follows a design without realizing a promise references it. Code never satisfies a decision Spec. A design that builds on existing code states that through its own `dependsOn` or `refines` to the Spec the code satisfies.
